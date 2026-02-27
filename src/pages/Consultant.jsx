import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Copy, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { ChatBubble, TypingIndicator } from '../components/ai/ChatBubble';
import ChipSelector from '../components/ui/ChipSelector';
import { useAI } from '../hooks/useAI';
import useStore from '../store/store';
import { STARTER_QUESTIONS, CONSULTANT_CATEGORIES } from '../lib/constants';
import { CONSULTANT_SYSTEM_PROMPT } from '../lib/prompts';

export default function Consultant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const { response, loading, error, streamResponse, reset: resetAI } = useAI();
  const { currentCampaign, addPinnedNote } = useStore();

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, response, loading]);

  // When AI finishes streaming, save the message
  useEffect(() => {
    if (response && !loading) {
      setMessages((prev) => {
        // Remove last if it was a streaming placeholder
        const cleaned = prev.filter((m) => m.id !== 'streaming');
        return [...cleaned, { id: Date.now(), role: 'assistant', content: response }];
      });
      resetAI();
    }
  }, [loading]);

  const buildSystemPrompt = () => {
    let prompt = CONSULTANT_SYSTEM_PROMPT;
    if (currentCampaign) {
      prompt += `\n\n## CURRENT CAMPAIGN CONTEXT (from user's previous work):\n`;
      if (currentCampaign.type) prompt += `- Campaign Type: ${currentCampaign.type}\n`;
      if (currentCampaign.description) prompt += `- Description: ${currentCampaign.description}\n`;
      if (currentCampaign.businessName) prompt += `- Business: ${currentCampaign.businessName}\n`;
      if (currentCampaign.industry) prompt += `- Industry: ${currentCampaign.industry}\n`;
      if (currentCampaign.goal) prompt += `- Goal: ${currentCampaign.goal}\n`;
      if (currentCampaign.budget) prompt += `- Budget: $${currentCampaign.budget}\n`;
      prompt += `\nReference this context naturally when relevant. Don't repeat it back verbatim.`;
    }
    return prompt;
  };

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    // Build conversation for API
    const apiMessages = newMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamResponse('chat', {
      systemPrompt: buildSystemPrompt(),
      messages: apiMessages,
    });
  };

  const handlePin = (content) => {
    addPinnedNote({
      id: Date.now().toString(),
      source: 'AI Consultant',
      content,
      createdAt: new Date().toISOString(),
    });
  };

  const handleClear = () => {
    setMessages([]);
    resetAI();
  };

  const handleExport = () => {
    const text = messages
      .map((m) => `${m.role === 'user' ? 'You' : 'AI Consultant'}: ${m.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultant-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredStarters = categoryFilter
    ? STARTER_QUESTIONS.filter((q) => q.category === categoryFilter)
    : STARTER_QUESTIONS;

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/15 rounded-xl flex items-center justify-center">
            <MessageSquare size={18} className="text-purple-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-slate-100">
              AI Marketing Consultant
            </h1>
            <p className="text-xs text-slate-500">15 years experience · Always available</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 size={14} />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Context Banner */}
      {currentCampaign && (
        <div className="mb-3 px-3 py-2 bg-teal-500/5 border border-teal-500/20 rounded-xl text-xs text-teal-400 flex-shrink-0">
          <span className="font-semibold">Campaign context loaded:</span>{' '}
          {currentCampaign.businessName || currentCampaign.type || 'Active campaign'}{' '}
          — AI will reference this automatically
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-purple-400" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-200 mb-1">
              Ask me anything about marketing
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              I'm a senior marketing consultant with 15 years of experience. 
              Ask about ads, strategy, analytics, email, SEO, or any marketing challenge.
            </p>

            {/* Category Chips */}
            <div className="mb-4">
              <ChipSelector
                options={['All', ...CONSULTANT_CATEGORIES]}
                selected={categoryFilter || 'All'}
                onChange={(v) => setCategoryFilter(v === 'All' ? '' : v)}
              />
            </div>

            {/* Starter Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
              {filteredStarters.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q.text)}
                  className="text-left px-4 py-3 bg-navy-800/40 border border-slate-700/40 rounded-xl 
                    text-sm text-slate-300 hover:border-purple-500/30 hover:bg-navy-800/60 
                    hover:text-slate-100 transition-all cursor-pointer"
                >
                  <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                    {q.category}
                  </span>
                  <p className="mt-0.5">{q.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            onPin={msg.role === 'assistant' ? handlePin : undefined}
          />
        ))}

        {/* Streaming response */}
        {loading && response && (
          <ChatBubble role="assistant" content={response} />
        )}

        {/* Typing indicator */}
        {loading && !response && <TypingIndicator />}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask your marketing question..."
            className="flex-1 bg-navy-800/60 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm 
              placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
              transition-colors"
            disabled={loading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            loading={loading}
            className="px-4"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
