import { getCategoryIcon } from '../utils/categoryIcons';
import { RiPencilLine } from 'react-icons/ri';

const TransactionCard = ({ transaction, categoryMeta, onDelete, onEdit }) => {
  const { type, amount, category, description, date } = transaction;
  const meta = categoryMeta[category] || { color: '#7FA396' };
  const isIncome = type === 'income';
  const Icon = getCategoryIcon(category);

  return (
    <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 hover:border-accent/40 transition group">
      <button
        onClick={() => onEdit(transaction)}
        className="flex items-center gap-3 flex-1 text-left"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${meta.color}22` }}
        >
          <Icon size={18} style={{ color: meta.color }} />
        </div>
        <div>
          <p className="text-text font-medium text-sm">{description || category}</p>
          <p className="text-text-muted text-xs">
            {category} · {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        <span className={`font-mono text-sm font-semibold ${isIncome ? 'text-accent' : 'text-text'}`}>
          {isIncome ? '+' : '-'}₹{amount.toLocaleString('en-IN')}
        </span>
        <button
          onClick={() => onEdit(transaction)}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent text-xs transition"
        >
          <RiPencilLine size={15} />
        </button>
        <button
          onClick={() => onDelete(transaction._id)}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 text-xs transition"
        >
          
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;