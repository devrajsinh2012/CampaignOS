import React from 'react';

export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-navy-900/80 border border-slate-700 text-slate-100 
          rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 
          focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
          transition-colors ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', rows = 4, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full bg-navy-900/80 border border-slate-700 text-slate-100 
          rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 
          focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
          transition-colors resize-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-navy-900/80 border border-slate-700 text-slate-100 
          rounded-xl px-4 py-2.5 text-sm 
          focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
          transition-colors ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
