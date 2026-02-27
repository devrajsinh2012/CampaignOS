import React from 'react';

export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={`bg-navy-800/50 border border-slate-700/50 rounded-2xl p-5 
        ${glow ? 'animate-pulse-glow' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3
      className={`font-display font-bold text-lg text-slate-100 ${className}`}
    >
      {children}
    </h3>
  );
}
