import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SkeletonBlock } from '../ui/Spinner';

/**
 * AIBlock — renders streaming AI markdown responses with loading state.
 */
export default function AIBlock({ content, loading, error, className = '' }) {
  if (error) {
    return (
      <div className={`bg-red-500/10 border border-red-500/30 rounded-2xl p-5 ${className}`}>
        <p className="text-red-400 text-sm font-medium">⚠ AI Error</p>
        <p className="text-red-300/80 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (loading && !content) {
    return (
      <div className={`bg-navy-800/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-sm text-teal-400 font-medium">AI is thinking...</span>
        </div>
        <SkeletonBlock lines={5} />
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className={`bg-navy-800/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      {loading && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span className="text-xs text-teal-400">Streaming...</span>
        </div>
      )}
      <div className="ai-markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
