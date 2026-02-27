import React, { useState } from 'react';
import { Image, Copy, Search, Filter, Star, ExternalLink, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { PROMPT_LIBRARY_SYSTEM_PROMPT } from '../lib/prompts';
import { PROMPT_CATEGORIES, PROMPT_TOOLS, PROMPT_STYLES } from '../lib/constants';

export default function PromptLibrary() {
  const { response, loading, error, run, reset } = useAI();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSearch = () => {
    const userMessage = `Generate a curated collection of 10 high-quality AI image/video prompts.

${searchQuery ? `Search Query: ${searchQuery}` : ''}
${selectedCategory ? `Category: ${selectedCategory}` : ''}
${selectedTool ? `Optimized for: ${selectedTool}` : ''}
${selectedStyle ? `Style: ${selectedStyle}` : ''}

For each prompt, provide:
1. **Prompt Title** — descriptive name
2. **Category** — Product Photography / Lifestyle & UGC / Ad Backgrounds / Logo Mockups / Social Graphics / Video B-Roll / Thumbnails
3. **Full Prompt** — the complete, copy-ready prompt text
4. **Compatible Tools** — which AI tools this works best with (Midjourney, DALL-E 3, Adobe Firefly, Runway, Sora, Kling, Pika)
5. **Style Tags** — Minimalist, Luxurious, Playful, Corporate, Cinematic, Lo-Fi, Editorial
6. **Difficulty** — Easy / Medium / Advanced
7. **Pro Tip** — one optimization tip for better results

Include a "🔥 Trending" badge on the top 3 prompts.
Sort by relevance and quality. Make prompts specific and actionable.`;

    run('/api/ai/chat', {
      systemPrompt: PROMPT_LIBRARY_SYSTEM_PROMPT,
      userMessage,
    });
  };

  const handleCopyPrompt = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Image className="text-teal-400" size={28} />
          AI Prompt Library
        </h1>
        <p className="text-slate-400 mt-1">
          Searchable collection of proven prompts for AI image and video tools — filtered by style, platform, and use case.
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search prompts... e.g. product photography, luxury lifestyle, food"
              className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
            <ChipSelector
              options={PROMPT_CATEGORIES}
              selected={selectedCategory ? [selectedCategory] : []}
              onChange={(cat) => setSelectedCategory(cat === selectedCategory ? '' : cat)}
            />
          </div>

          {/* Tool Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Optimized For</label>
            <ChipSelector
              options={PROMPT_TOOLS}
              selected={selectedTool ? [selectedTool] : []}
              onChange={(tool) => setSelectedTool(tool === selectedTool ? '' : tool)}
            />
          </div>

          {/* Style Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Style</label>
            <ChipSelector
              options={PROMPT_STYLES}
              selected={selectedStyle ? [selectedStyle] : []}
              onChange={(style) => setSelectedStyle(style === selectedStyle ? '' : style)}
            />
          </div>

          <Button onClick={handleSearch} loading={loading} className="w-full">
            <Sparkles size={16} className="mr-2" />
            Generate Prompts
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <Card>
          <CardHeader>
            <CardTitle>Prompt Collection</CardTitle>
            {response && !loading && (
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(response)}>
                <Copy size={14} className="mr-1" /> Copy All
              </Button>
            )}
          </CardHeader>
          <div className="p-4 pt-0">
            <AIBlock response={response} loading={loading} error={error} />
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!response && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '📸', title: 'Product Photography', desc: 'Clean, e-commerce-ready product shots' },
            { icon: '🎬', title: 'Video B-Roll', desc: 'Cinematic clips for ads and social' },
            { icon: '🎨', title: 'Ad Backgrounds', desc: 'Eye-catching backgrounds for ad creatives' },
            { icon: '✨', title: 'Lifestyle & UGC', desc: 'Authentic, relatable lifestyle imagery' },
            { icon: '📱', title: 'Social Graphics', desc: 'Platform-optimized social media visuals' },
            { icon: '🖼️', title: 'Thumbnails', desc: 'Click-worthy thumbnails for video content' },
          ].map((cat) => (
            <button
              key={cat.title}
              onClick={() => {
                setSelectedCategory(cat.title);
                handleSearch();
              }}
              className="text-left cursor-pointer"
            >
              <Card>
                <div className="p-4">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <h3 className="text-sm font-semibold text-slate-200">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
