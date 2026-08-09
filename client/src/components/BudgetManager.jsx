import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import api from '../api/axios';

const BudgetManager = ({ categories, onClose, month: monthProp, year: yearProp, onSaved }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const now = new Date();
  const month = monthProp || now.getMonth() + 1;
  const year = yearProp || now.getFullYear();

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const fetchBudgets = async () => {
    setLoading(true);
    const { data } = await api.get(`/budgets?month=${month}&year=${year}`);
    setBudgets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budgets', { category, monthlyLimit: Number(limit), month, year });
      setCategory('');
      setLimit('');
      fetchBudgets();
      onSaved?.(); // tell parent page to refresh too
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set budget');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    setBudgets((prev) => prev.filter((b) => b._id !== id));
    onSaved?.();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-display font-semibold text-text">Monthly Budgets</h2>
            <p className="text-text-muted text-xs mt-0.5">
              {new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Existing budgets */}
        {loading ? (
          <p className="text-text-muted text-sm">Loading...</p>
        ) : budgets.length === 0 ? (
          <p className="text-text-muted text-sm mb-6">No budgets set for this month yet.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {budgets.map((b) => {
              const pct = b.monthlyLimit > 0 ? Math.min((b.spent / b.monthlyLimit) * 100, 100) : 0;
              const over = b.spent > b.monthlyLimit;
              return (
                <div key={b._id} className="bg-surface-light border border-border rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text text-sm font-medium">{b.category}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${over ? 'text-red-400' : 'text-text-muted'}`}>
                        ₹{b.spent.toLocaleString('en-IN')} / ₹{b.monthlyLimit.toLocaleString('en-IN')}
                      </span>
                      <button onClick={() => handleDelete(b._id)} className="text-text-muted hover:text-red-400">
                        <RiCloseLine size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${over ? 'bg-red-400' : 'bg-accent'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new budget */}
        <div className="border-t border-border pt-5">
          <p className="text-text-muted text-xs font-medium mb-3">Set a new budget</p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2.5 rounded-lg mb-3">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-surface-light border border-border text-text px-3 py-2 rounded-lg text-sm outline-none focus:border-accent"
              required
            >
              <option value="">Category</option>
              {expenseCategories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="₹ Limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-28 bg-surface-light border border-border text-text placeholder-text-muted px-3 py-2 rounded-lg text-sm outline-none focus:border-accent font-mono"
              required
            />
            <button
              type="submit"
              className="bg-accent hover:brightness-110 text-bg px-3 rounded-lg transition"
            >
              <RiAddLine size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetManager;