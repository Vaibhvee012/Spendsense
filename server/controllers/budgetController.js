const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @route POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, category, month, year },
      { monthlyLimit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/budgets?month=8&year=2026
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ userId: req.user._id, month, year });

    // Calculate actual spend per category for this month using aggregation
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const spend = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startDate, $lt: endDate },
        },
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendMap = spend.reduce((acc, s) => {
      acc[s._id] = s.spent;
      return acc;
    }, {});

    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      month: b.month,
      year: b.year,
      spent: spendMap[b.category] || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBudget, getBudgets, deleteBudget };