import React from 'react';

export default function ChipSelector({
  options = [],
  selected = [],
  onChange,
  multiple = false,
  className = '',
}) {
  const handleClick = (value) => {
    if (multiple) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    } else {
      onChange(selected === value ? '' : value);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const value = opt.id || opt.value || opt;
        const label = opt.label || opt;
        const isSelected = multiple
          ? selected.includes(value)
          : selected === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer
              ${
                isSelected
                  ? 'bg-teal-500/20 border-teal-500 text-teal-400 shadow-lg shadow-teal-500/10'
                  : 'bg-navy-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
