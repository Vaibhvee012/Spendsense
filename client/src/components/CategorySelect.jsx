import { useState, useRef, useEffect } from 'react';
import { getCategoryIcon } from '../utils/categoryIcons';
import { RiArrowDownSLine } from 'react-icons/ri';

const CategorySelect = ({ categories, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = categories.find((c) => c.name === value);
  const SelectedIcon = selected ? getCategoryIcon(selected.name) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-surface-light border border-border text-text px-4 py-2.5 rounded-lg outline-none focus:border-accent"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <SelectedIcon size={16} style={{ color: selected.color }} />
              {selected.name}
            </>
          ) : (
            <span className="text-text-muted">Select category</span>
          )}
        </span>
        <RiArrowDownSLine className="text-text-muted" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-surface-light border border-border rounded-lg max-h-56 overflow-y-auto shadow-xl">
          {categories.length === 0 && (
            <p className="px-4 py-3 text-text-muted text-sm">No categories yet</p>
          )}
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.name);
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => { onChange(c.name); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-text hover:bg-surface transition text-sm"
              >
                <Icon size={16} style={{ color: c.color }} />
                {c.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;