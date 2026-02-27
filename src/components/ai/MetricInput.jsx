import React from 'react';

export default function MetricInput({ label, prefix, suffix, value, onChange, placeholder, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
            {prefix}
          </span>
        )}
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0'}
          className={`w-full bg-navy-900/80 border border-slate-700 text-slate-100 
            rounded-lg px-3 py-2 text-sm font-mono placeholder:text-slate-600 
            focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
            transition-colors
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
