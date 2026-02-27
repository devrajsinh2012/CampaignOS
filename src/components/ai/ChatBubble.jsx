import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Pin } from 'lucide-react';

export function ChatBubble({ role, content, onPin }) {
  const isAI = role === 'assistant';

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center 
          ${isAI ? 'bg-teal-500/20 text-teal-400' : 'bg-blue-500/20 text-blue-400'}`}
      >
        {isAI ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm 
          ${
            isAI
              ? 'bg-navy-800/60 border border-slate-700/50 text-slate-200'
              : 'bg-teal-500/15 border border-teal-500/30 text-slate-100'
          }`}
      >
        {isAI ? (
          <div className="ai-markdown">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}

        {/* Pin button for AI messages */}
        {isAI && onPin && (
          <button
            onClick={() => onPin(content)}
            className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-teal-400 transition-colors cursor-pointer"
            title="Pin this answer"
          >
            <Pin size={12} />
            Pin
          </button>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
        <Bot size={16} />
      </div>
      <div className="bg-navy-800/60 border border-slate-700/50 rounded-2xl px-4 py-3">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-teal-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-teal-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-teal-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
