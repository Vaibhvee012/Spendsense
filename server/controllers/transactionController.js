const Transaction = require('../models/Transaction');
const fs = require('fs');
const csv = require('csv-parser');
// @route POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, isRecurring, recurringFrequency } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      description,
      date,
      isRecurring,
      recurringFrequency,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/transactions  (with optional filters)
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processRecurringTransactions = require('../utils/processRecurring');

// @route POST /api/transactions/process-recurring
const runRecurringCheck = async (req, res) => {
  try {
    const count = await processRecurringTransactions();
    res.json({ message: `Processed recurring transactions`, created: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ExcelJS = require('exceljs');

// @route GET /api/transactions/export
const exportTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Transactions');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Category', key: 'category', width: 16 },
      { header: 'Description', key: 'description', width: 28 },
      { header: 'Amount', key: 'amount', width: 14 },
    ];

    // Bold header row
    sheet.getRow(1).font = { bold: true };

    transactions.forEach((t) => {
      sheet.addRow({
        date: new Date(t.date).toISOString().split('T')[0],
        type: t.type,
        category: t.category,
        description: t.description || '',
        amount: t.amount,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=spendsense-transactions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route POST /api/transactions/import
const importTransactions = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Expecting columns: date, type, category, description, amount
        if (row.date && row.type && row.category && row.amount) {
          results.push({
            userId: req.user._id,
            date: new Date(row.date),
            type: row.type.trim().toLowerCase(),
            category: row.category.trim(),
            description: row.description?.trim() || '',
            amount: Number(row.amount),
          });
        }
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path); // clean up temp file
        if (results.length === 0) {
          return res.status(400).json({ message: 'No valid rows found in CSV' });
        }
        const inserted = await Transaction.insertMany(results);
        res.json({ message: `Imported ${inserted.length} transactions`, count: inserted.length });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  runRecurringCheck,
  exportTransactions,
  importTransactions,
};