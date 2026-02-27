import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500/50';

  const variants = {
    primary:
      'bg-teal-500 text-navy-900 hover:bg-teal-400 active:bg-teal-600 shadow-lg shadow-teal-500/20',
    secondary:
      'bg-slate-700/50 text-slate-100 hover:bg-slate-600/50 border border-slate-600',
    ghost:
      'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-slate-100',
    danger:
      'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
