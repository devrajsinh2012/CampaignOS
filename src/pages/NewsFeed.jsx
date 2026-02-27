import React, { useState, useRef } from 'react';
import { Newspaper, RefreshCw, Bookmark, BookmarkCheck, ExternalLink, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { NEWS_SYSTEM_PROMPT } from '../lib/prompts';
import { NEWS_CATEGORIES } from '../lib/constants';

export default function NewsFeed() {
  const { response, loading, error, run, reset } = useAI();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarked, setBookmarked] = useState([]);

  const resultRef = useRef(null);

  const handleFetchNews = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const userMessage = `Generate today's digital marketing news digest for ${today}.
${selectedCategory !== 'All' ? `Focus on category: ${selectedCategory}` : 'Cover all categories.'}

Generate 8-12 articles covering:
- Platform updates (Meta, Google, TikTok, etc.)
- Industry trends and insights
- Campaign best practices
- AI & martech developments
- Strategy and optimization tips

For each article:
1. **Headline** — attention-grabbing title
2. **What Happened** — 2-sentence summary
3. **Why It Matters** — 1-sentence impact for marketers
4. **Category** — one of: Platform Updates, Paid Media, SEO/Content, Email, AI & Martech, Strategy
5. **Priority** — Breaking / Important / Useful

Mark any algorithm or policy changes as "Breaking" with higher priority.
Format each article as a clearly separated section.`;

    run('/api/ai/chat', {
      systemPrompt: NEWS_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const toggleBookmark = (index) => {
    setBookmarked((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Newspaper className="text-teal-400" size={28} />
          DM News & Trends
        </h1>
        <p className="text-slate-400 mt-1">
          AI-curated daily digest of the most important digital marketing news and platform updates.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Filter size={14} className="inline mr-1" /> Filter by Category
            </label>
            <ChipSelector
              options={NEWS_CATEGORIES}
              selected={[selectedCategory]}
              onChange={(cat) => setSelectedCategory(cat === selectedCategory ? 'All' : cat)}
            />
          </div>

          <Button onClick={handleFetchNews} loading={loading} className="w-full">
            <Newspaper size={16} className="mr-2" />
            Generate Today's Digest
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <div ref={resultRef}>
          <Card>
            <CardHeader>
              <CardTitle>Today's Marketing News</CardTitle>
              {response && !loading && (
                <Button variant="ghost" size="sm" onClick={() => run('/api/ai/chat', { systemPrompt: NEWS_SYSTEM_PROMPT, userMessage: `Generate a fresh batch of digital marketing news for today. Category: ${selectedCategory}. Make it different from the previous batch.` })}>
                  <RefreshCw size={14} className="mr-1" /> Refresh
                </Button>
              )}
            </CardHeader>
            <div className="p-4 pt-0">
              <AIBlock response={response} loading={loading} error={error} />
            </div>
          </Card>
        </div>
      )}

      {/* Tips */}
      {!response && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📢', title: 'Platform Updates', desc: 'Algorithm changes, new features, policy updates' },
            { icon: '📈', title: 'Trends & Insights', desc: 'Industry shifts, consumer behavior, market signals' },
            { icon: '🤖', title: 'AI & Martech', desc: 'New tools, automation strategies, AI in marketing' },
          ].map((tip) => (
            <Card key={tip.title}>
              <div className="p-4 text-center">
                <div className="text-3xl mb-2">{tip.icon}</div>
                <h3 className="text-sm font-semibold text-slate-200">{tip.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{tip.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
