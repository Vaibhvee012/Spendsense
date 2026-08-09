const BudgetCard = ({ category, spent, limit, color }) => {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - spent, 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 min-w-[220px]">
      <p className="text-text font-medium text-sm mb-4">{category}</p>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <div
            className="w-16 h-16 rounded-full"
            style={{
              background: `conic-gradient(${color} ${pct}%, var(--color-surface-light) ${pct}%)`,
            }}
          />
          <div className="absolute inset-1.5 bg-surface rounded-full flex items-center justify-center">
            <span className="text-[10px] text-text-muted font-mono">{Math.round(pct)}%</span>
          </div>
        </div>
        <div className="text-xs space-y-1">
          <p className="text-text-muted">
            Spent <span className="text-text font-mono ml-1">₹{spent.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-text-muted">
            Limit <span className="text-text font-mono ml-1">₹{limit.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-text-muted">
            Left <span className="text-accent font-mono ml-1">₹{remaining.toLocaleString('en-IN')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;