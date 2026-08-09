const Transaction = require('../models/Transaction');

// Adds N units of time to a date based on frequency
const getNextDate = (date, frequency) => {
  const next = new Date(date);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return next;
};

// Finds recurring transactions whose "next occurrence" is due, and creates new transaction entries for them
const processRecurringTransactions = async () => {
  const recurringTx = await Transaction.find({ isRecurring: true });

  let createdCount = 0;

  for (const tx of recurringTx) {
    // Find the most recent transaction in this recurring series
    const lastInSeries = await Transaction.findOne({
      userId: tx.userId,
      category: tx.category,
      description: tx.description,
      isRecurring: true,
    }).sort({ date: -1 });

    const nextDue = getNextDate(lastInSeries.date, tx.recurringFrequency);
    if (!nextDue) continue;

    // If the next due date has passed (or is today) and we haven't already created it
    if (nextDue <= new Date()) {
      const alreadyExists = await Transaction.findOne({
        userId: tx.userId,
        category: tx.category,
        description: tx.description,
        date: nextDue,
      });

      if (!alreadyExists) {
        await Transaction.create({
          userId: tx.userId,
          type: tx.type,
          amount: tx.amount,
          category: tx.category,
          description: tx.description,
          date: nextDue,
          isRecurring: true,
          recurringFrequency: tx.recurringFrequency,
        });
        createdCount++;
      }
    }
  }

  return createdCount;
};

module.exports = processRecurringTransactions;