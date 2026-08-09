require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');

const seedData = async () => {
  try {
    await connectDB();

    // Find your existing test user (created earlier via signup)
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('Test user not found. Please signup first with test@example.com');
      process.exit(1);
    }

    // Clear old test data for this user (optional, keeps re-runs clean)
    await Category.deleteMany({ userId: user._id });
    await Transaction.deleteMany({ userId: user._id });

    // Create categories
    const categories = await Category.insertMany([
      { userId: user._id, name: 'Food', type: 'expense', color: '#f97316', budgetLimit: 8000 },
      { userId: user._id, name: 'Travel', type: 'expense', color: '#3b82f6', budgetLimit: 3000 },
      { userId: user._id, name: 'Shopping', type: 'expense', color: '#ec4899', budgetLimit: 4000 },
      { userId: user._id, name: 'Work', type: 'income', color: '#22c55e', budgetLimit: 0 },
      { userId: user._id, name: 'House', type: 'expense', color: '#14b8a6', budgetLimit: 6000 },
      { userId: user._id, name: 'Rent', type: 'expense', color: '#a855f7', budgetLimit: 15000 },
      { userId: user._id, name: 'Health', type: 'expense', color: '#ef4444', budgetLimit: 2000 },
      { userId: user._id, name: 'Miscellaneous', type: 'expense', color: '#7FA396', budgetLimit: 1500 },
      { userId: user._id, name: 'Education', type: 'expense', color: '#3b82f6', budgetLimit: 2500 },
      { userId: user._id, name: 'Entertainment', type: 'expense', color: '#eab308', budgetLimit: 2000 },
      { userId: user._id, name: 'Bills', type: 'expense', color: '#eab308', budgetLimit: 5000 },
      { userId: user._id, name: 'Salary', type: 'income', color: '#22c55e', budgetLimit: 0 },
    ]);

    // Create transactions (mix of income/expense, this month + last month for trend comparison)
    const transactions = [
      { userId: user._id, type: 'income', amount: 25000, category: 'Salary', description: 'August salary', date: new Date('2026-08-01') },
      { userId: user._id, type: 'expense', amount: 450, category: 'Food', description: 'Lunch at cafe', date: new Date('2026-08-08') },
      { userId: user._id, type: 'expense', amount: 1200, category: 'Travel', description: 'Cab rides', date: new Date('2026-08-05') },
      { userId: user._id, type: 'expense', amount: 3000, category: 'Bills', description: 'Electricity bill', date: new Date('2026-08-06') },
      { userId: user._id, type: 'expense', amount: 2200, category: 'Shopping', description: 'New shoes', date: new Date('2026-08-03') },
      { userId: user._id, type: 'expense', amount: 800, category: 'Food', description: 'Groceries', date: new Date('2026-08-02') },
      // Last month data (for month-over-month comparison later)
      { userId: user._id, type: 'income', amount: 25000, category: 'Salary', description: 'July salary', date: new Date('2026-07-01') },
      { userId: user._id, type: 'expense', amount: 6500, category: 'Food', description: 'July food total', date: new Date('2026-07-15') },
      { userId: user._id, type: 'expense', amount: 900, category: 'Travel', description: 'July travel', date: new Date('2026-07-10') },
      { userId: user._id, type: 'expense', amount: 2800, category: 'Bills', description: 'July bills', date: new Date('2026-07-06') },
    ];

    await Transaction.insertMany(transactions);

    console.log(`Seeded ${categories.length} categories and ${transactions.length} transactions for ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();