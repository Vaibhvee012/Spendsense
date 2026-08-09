import { useState } from 'react';

const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#eab308', '#22c55e', '#a855f7', '#ef4444', '#14b8a6'];

const AddCategoryModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState(COLORS[0]);
  const [budgetLimit, setBudgetLimit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onAdd({ name, type, color, budgetLimit: Number(budgetLimit) || 0 });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-display font-semibold text-text">New Category</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Category name (e.g. Groceries)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-light border border-border text-text placeholder-text-muted px-4 py-2.5 rounded-lg outline-none focus:border-accent"
            required
          />

          <div className="flex bg-surface-light rounded-lg p-1">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition ${
                  type === t ? 'bg-accent text-bg' : 'text-text-muted'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Monthly budget limit (optional)"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
            className="w-full bg-surface-light border border-border text-text placeholder-text-muted px-4 py-2.5 rounded-lg outline-none focus:border-accent font-mono"
          />

          <div>
            <p className="text-text-muted text-xs mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full transition ${
                    color === c ? 'ring-2 ring-offset-2 ring-offset-surface ring-accent' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:brightness-110 text-bg py-2.5 rounded-lg font-semibold font-display transition mt-2"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;