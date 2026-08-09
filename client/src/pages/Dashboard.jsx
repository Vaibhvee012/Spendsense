import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import DonutChart from '../components/DonutChart';
import BudgetCard from '../components/BudgetCard';
import TransactionCard from '../components/TransactionCard';
import AddTransactionModal from '../components/AddTransactionModal';
import AddCategoryModal from '../components/AddCategoryModal';
import BudgetManager from '../components/BudgetManager';
import InsightsCard from '../components/InsightsCard';
import TrendChart from '../components/TrendChart';
import CategoryBarChart from '../components/CategoryBarChart';
import GoalsCard from '../components/GoalsCard';
import CsvActions from '../components/CsvActions';
import MonthSelector from '../components/MonthSelector';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [budgets, setBudgets] = useState([]);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const fetchData = async () => {
    setLoading(true);
    const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
    const endDate = new Date(selectedYear, selectedMonth, 1).toISOString();

    const [txRes, catRes, budgetRes] = await Promise.all([
      api.get(`/transactions?limit=200&startDate=${startDate}&endDate=${endDate}`),
      api.get('/categories'),
      api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
    ]);
    setTransactions(txRes.data.transactions);
    setCategories(catRes.data);
    setBudgets(budgetRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleAdd = async (newTx) => {
    await api.post('/transactions', newTx);
    fetchData();
  };

  const handleUpdate = async (id, updatedTx) => {
    const { data } = await api.put(`/transactions/${id}`, updatedTx);
    setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const handleAddCategory = async (newCat) => {
    const { data } = await api.post('/categories', newCat);
    setCategories((prev) => [...prev, data]);
  };

  const categoryMeta = categories.reduce((acc, c) => {
    acc[c.name] = { color: c.color };
    return acc;
  }, {});

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Hello, {user?.name} 👋</h1>
            <p className="text-text-muted text-sm mt-1">Take a look at your current balance</p>
          </div>
          <MonthSelector
            month={selectedMonth}
            year={selectedYear}
            onChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }}
          />
        </div>

        <div className="flex justify-end gap-2 mb-8">
          <CsvActions onImportComplete={fetchData} />
          <button
            onClick={() => setShowBudgetManager(true)}
            className="border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Budgets
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Category
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-accent hover:brightness-110 text-bg text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add Transaction
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: donut + summary */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center">
            <DonutChart income={totalIncome} expense={totalExpense} />
            <div className="flex gap-6 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-text-muted">Income</span>
                <span className="font-mono text-text">₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-2" />
                <span className="text-text-muted">Expense</span>
                <span className="font-mono text-text">₹{totalExpense.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right: budget cards */}
          <div className="lg:col-span-2">
            <p className="text-text-muted text-sm mb-3">Your Current Budgets</p>
            {budgets.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-6 text-text-muted text-sm">
                Click "Budgets" above to set a spending limit for this month.
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
                {budgets.map((b) => {
                  const cat = categories.find((c) => c.name === b.category);
                  return (
                    <BudgetCard
                      key={b._id}
                      category={b.category}
                      spent={b.spent}
                      limit={b.monthlyLimit}
                      color={cat?.color || '#7FA396'}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <InsightsCard month={selectedMonth} year={selectedYear} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="text-text-muted text-sm mb-4">Spending Trend</p>
            <TrendChart />
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="text-text-muted text-sm mb-4">Top Categories</p>
            <CategoryBarChart />
          </div>
        </div>

        <div className="mt-8">
          <GoalsCard onContribute={fetchData} />
        </div>

        {/* Transactions table/list */}
        <div className="mt-8">
          <p className="text-text-muted text-sm mb-3">Your Expenses</p>
          {loading ? (
            <p className="text-text-muted text-sm">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-text-muted text-sm">No transactions yet. Add your first one.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((t) => (
                <TransactionCard
                  key={t._id}
                  transaction={t}
                  categoryMeta={categoryMeta}
                  onDelete={handleDelete}
                  onEdit={setEditingTransaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddTransactionModal categories={categories} onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
      {editingTransaction && (
        <AddTransactionModal
          categories={categories}
          editingTransaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={handleUpdate}
        />
      )}
      {showCategoryModal && (
        <AddCategoryModal onClose={() => setShowCategoryModal(false)} onAdd={handleAddCategory} />
      )}
      {showBudgetManager && (
  <BudgetManager
    categories={categories}
    month={selectedMonth}
    year={selectedYear}
    onClose={() => setShowBudgetManager(false)}
    onSaved={fetchData}
  />
)}
    </div>
  );
};

export default Dashboard;