const DonutChart = ({ income, expense }) => {
  const total = income + expense;
  const incomePct = total > 0 ? (income / total) * 100 : 0;

  const gradient = `conic-gradient(
    var(--color-accent) 0% ${incomePct}%,
    var(--color-accent-2) ${incomePct}% 100%
  )`;

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <div
        className="w-44 h-44 rounded-full"
        style={{ background: total > 0 ? gradient : 'var(--color-surface-light)' }}
      />
      <div className="absolute w-32 h-32 bg-surface rounded-full flex flex-col items-center justify-center">
        <p className="text-text-muted text-xs">Total</p>
        <p className="font-mono text-lg font-semibold text-text">₹{(income - expense).toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default DonutChart;