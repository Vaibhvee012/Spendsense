import { useState } from 'react';
import CategorySelect from './CategorySelect';

const AddTransactionModal = ({ categories, onClose, onAdd, onUpdate, editingTransaction }) => {
  const isEditMode = Boolean(editingTransaction);

  const [type, setType] = useState(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editingTransaction?.amount ?? '');
  const [category, setCategory] = useState(editingTransaction?.category || '');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState(
    editingTransaction?.date
      ? new Date(editingTransaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!category) {
      setError('Pick a category');
      return;
    }
    try {
      if (isEditMode) {
        await onUpdate(editingTransaction._id, { type, amount: Number(amount), category, description, date });
      } else {
        await onAdd({ type, amount: Number(amount), category, description, date });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} transaction`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-display font-semibold text-text">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">✕</button>
        </div>

        <div className="flex bg-surface-light rounded-lg p-1 mb-4">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCategory(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition ${
                type === t ? 'bg-accent text-bg' : 'text-text-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            step="0.01"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface-light border border-border text-text placeholder-text-muted px-4 py-2.5 rounded-lg outline-none focus:border-accent font-mono"
            required
          />

          <CategorySelect categories={filteredCategories} value={category} onChange={setCategory} />
          {filteredCategories.length === 0 && (
            <p className="text-text-muted text-xs">
              No {type} categories yet. Close this and create one first.
            </p>
          )}

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-light border border-border text-text placeholder-text-muted px-4 py-2.5 rounded-lg outline-none focus:border-accent"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface-light border border-border text-text px-4 py-2.5 rounded-lg outline-none focus:border-accent"
            required
          />

          <button
            type="submit"
            className="w-full bg-accent hover:brightness-110 text-bg py-2.5 rounded-lg font-semibold font-display transition mt-2"
          >
            {isEditMode ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;