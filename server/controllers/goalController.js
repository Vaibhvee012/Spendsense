const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const goal = await Goal.create({ userId: req.user._id, title, targetAmount, deadline });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adds (or subtracts) an amount from currentAmount — used for "contribute" actions
const contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.currentAmount = Math.max(0, goal.currentAmount + Number(amount));
    await goal.save();

    // Log this contribution as an actual expense transaction
    if (Number(amount) > 0) {
      await Transaction.create({
        userId: req.user._id,
        type: 'expense',
        amount: Number(amount),
        category: 'Savings',
        description: `Contribution to ${goal.title}`,
        date: new Date(),
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGoal, getGoals, contributeToGoal, deleteGoal };