import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MonthSelector = ({ month, year, onChange }) => {
  const goPrev = () => {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  };

  const goNext = () => {
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  };

  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-1.5">
      <button onClick={goPrev} className="text-text-muted hover:text-accent transition p-1">
        <RiArrowLeftSLine size={18} />
      </button>
      <span className="text-text text-sm font-medium w-32 text-center">
        {MONTH_NAMES[month - 1]} {year}
      </span>
      <button
        onClick={goNext}
        disabled={isCurrentMonth}
        className="text-text-muted hover:text-accent transition p-1 disabled:opacity-30 disabled:hover:text-text-muted"
      >
        <RiArrowRightSLine size={18} />
      </button>
    </div>
  );
};

export default MonthSelector;