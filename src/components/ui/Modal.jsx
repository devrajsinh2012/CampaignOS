import React from 'react';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`relative bg-navy-900 border border-slate-700 rounded-2xl p-6 
          max-w-lg w-full mx-4 shadow-2xl animate-fade-in ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-slate-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
