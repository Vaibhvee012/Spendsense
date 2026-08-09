import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiFlagLine, RiAddLine, RiCloseLine } from 'react-icons/ri';
import api from '../api/axios';

const GoalsCard = ({ onContribute }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contributingId, setContributingId] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const fetchGoals = async () => {
    setLoading(true);
    const { data } = await api.get('/goals');
    setGoals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/goals', { title, targetAmount: Number(targetAmount), deadline: deadline || undefined });
    setTitle('');
    setTargetAmount('');
    setDeadline('');
    setShowAdd(false);
    fetchGoals();
  };

  const handleContribute = async (id) => {
    if (!contributeAmount) return;
    const { data } = await api.post(`/goals/${id}/contribute`, { amount: Number(contributeAmount) });
    setGoals((prev) => prev.map((g) => (g._id === id ? data : g)));
    setContributingId(null);
    setContributeAmount('');
    onContribute?.(); // tell parent page to refresh its transaction list
  };

  const handleDelete = async (id) => {
    await api.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g._id !== id));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <RiFlagLine className="text-accent" size={18} />
          <h2 className="font-display font-semibold text-text">Savings Goals</h2>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="text-text-muted hover:text-accent transition"
        >
          <RiAddLine size={20} />
        </button>
      </div>

      {showAdd && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleAdd}
          className="bg-surface-light border border-border rounded-xl p-4 mb-4 space-y-2"
        >
          <input
            type="text"
            placeholder="Goal name (e.g. New Laptop)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface border border-border text-text placeholder-text-muted px-3 py-2 rounded-lg text-sm outline-none focus:border-accent"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Target ₹"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="flex-1 bg-surface border border-border text-text placeholder-text-muted px-3 py-2 rounded-lg text-sm outline-none focus:border-accent font-mono"
              required
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="flex-1 bg-surface border border-border text-text px-3 py-2 rounded-lg text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" className="w-full bg-accent hover:brightness-110 text-bg py-2 rounded-lg text-sm font-semibold transition">
            Create Goal
          </button>
        </motion.form>
      )}

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : goals.length === 0 ? (
        <p className="text-text-muted text-sm">No goals yet. Set your first savings target.</p>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
            const isComplete = g.currentAmount >= g.targetAmount;
            return (
              <div key={g._id} className="bg-surface-light border border-border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-text text-sm font-medium">{g.title}</p>
                    {g.deadline && (
                      <p className="text-text-muted text-xs mt-0.5">
                        by {new Date(g.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(g._id)} className="text-text-muted hover:text-red-400">
                    <RiCloseLine size={16} />
                  </button>
                </div>

                <div className="h-2 bg-surface rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={`h-full rounded-full ${isComplete ? 'bg-accent' : 'bg-accent-2'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-text-muted">
                    ₹{g.currentAmount.toLocaleString('en-IN')} / ₹{g.targetAmount.toLocaleString('en-IN')}
                  </span>
                  {isComplete ? (
                    <span className="text-accent font-medium">🎉 Complete</span>
                  ) : contributingId === g._id ? (
                    <div className="flex gap-1">
                      <input
                        type="number"
                        autoFocus
                        placeholder="₹"
                        value={contributeAmount}
                        onChange={(e) => setContributeAmount(e.target.value)}
                        className="w-20 bg-surface border border-border text-text px-2 py-1 rounded text-xs outline-none focus:border-accent font-mono"
                      />
                      <button
                        onClick={() => handleContribute(g._id)}
                        className="bg-accent text-bg px-2 rounded text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setContributingId(g._id)}
                      className="text-accent hover:underline font-medium"
                    >
                      + Contribute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsCard;