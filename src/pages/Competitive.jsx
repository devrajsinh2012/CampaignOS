import React, { useState, useRef } from 'react';
import { Eye, Globe, Search, Copy, Download, RefreshCw, Shield, Target, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { COMPETITIVE_SYSTEM_PROMPT } from '../lib/prompts';

export default function Competitive() {
  const { response, loading, error, run, reset } = useAI();

  const [tab, setTab] = useState('analysis'); // 'analysis' | 'gaps' | 'monitor'

  // Analysis inputs
  const [myBrand, setMyBrand] = useState('');
  const [myIndustry, setMyIndustry] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [focusArea, setFocusArea] = useState('');

  const resultRef = useRef(null);

  const handleAnalyze = () => {
    const userMessage = tab === 'analysis'
      ? `Perform a competitive intelligence analysis.

My Brand: ${myBrand || 'Not specified'}
Industry: ${myIndustry || 'Not specified'}
Competitors: ${competitors}

Provide:
1. Competitive landscape overview
2. Ad strategy analysis for each competitor
3. Share of voice estimate
4. Strategic recommendations
5. Counterplay alerts`
      : tab === 'gaps'
      ? `Perform a gap analysis for competitive opportunities.

My Brand: ${myBrand || 'Not specified'}
Industry: ${myIndustry || 'Not specified'}
Competitors: ${competitors}
Focus Area: ${focusArea || 'All areas'}

Identify:
1. Keywords and audiences competitors are NOT targeting
2. Content gaps — topics no one is covering well
3. Platform gaps — channels being underutilized
4. Timing gaps — when competitors reduce activity
5. Messaging gaps — value propositions not being addressed
6. Specific low-competition opportunities to exploit quickly`
      : `Set up a competitive monitoring framework.

My Brand: ${myBrand || 'Not specified'}
Industry: ${myIndustry || 'Not specified'}
Competitors: ${competitors}

Create:
1. Key metrics to monitor for each competitor
2. Alert triggers — what changes should raise flags
3. Weekly monitoring checklist
4. Counterplay playbook — pre-planned responses to competitor moves
5. Quarterly review framework`;

    run('/api/ai/chat', {
      systemPrompt: COMPETITIVE_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleCopy = () => {
    if (response) navigator.clipboard.writeText(response);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([`CampaignOS Competitive Intelligence\n\nBrand: ${myBrand}\nCompetitors: ${competitors}\n\n${response}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitive-intel-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Eye className="text-teal-400" size={28} />
          Competitive Intelligence
        </h1>
        <p className="text-slate-400 mt-1">
          Know what competitors are doing, find gaps, and stay a step ahead.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-navy-800/50 rounded-2xl p-1">
        {[
          { id: 'analysis', label: 'Competitor Analysis', icon: BarChart3 },
          { id: 'gaps', label: 'Gap Analysis', icon: Target },
          { id: 'monitor', label: 'Monitoring Framework', icon: Shield },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); reset(); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <t.icon size={16} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tab === 'analysis' ? 'Competitor Details' : tab === 'gaps' ? 'Gap Analysis Setup' : 'Monitoring Setup'}
          </CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Your Brand" value={myBrand} onChange={(e) => setMyBrand(e.target.value)} placeholder="Your brand or product name" />
            <Input label="Industry" value={myIndustry} onChange={(e) => setMyIndustry(e.target.value)} placeholder="e.g. SaaS, E-commerce, F&B" />
          </div>

          <Textarea
            label="Competitors *"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="List competitor names and/or URLs (one per line)&#10;e.g.&#10;Competitor A - competitor-a.com&#10;Competitor B - competitor-b.com&#10;Competitor C - competitor-c.com"
            rows={4}
          />

          {tab === 'gaps' && (
            <Input
              label="Focus Area (optional)"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Social media content, SEO keywords, Email marketing"
            />
          )}

          <Button onClick={handleAnalyze} disabled={!competitors.trim()} loading={loading} className="w-full">
            {tab === 'analysis' && <><Search size={16} className="mr-2" /> Analyze Competitors</>}
            {tab === 'gaps' && <><Target size={16} className="mr-2" /> Find Gaps</>}
            {tab === 'monitor' && <><Shield size={16} className="mr-2" /> Build Monitoring Framework</>}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <div ref={resultRef}>
          <Card>
            <CardHeader>
              <CardTitle>
                {tab === 'analysis' ? 'Intelligence Report' : tab === 'gaps' ? 'Gap Analysis' : 'Monitoring Framework'}
              </CardTitle>
              {response && !loading && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExport}>
                    <Download size={14} className="mr-1" /> Export
                  </Button>
                </div>
              )}
            </CardHeader>
            <div className="p-4 pt-0">
              <AIBlock response={response} loading={loading} error={error} />
            </div>
          </Card>
        </div>
      )}

      {/* Empty State Tips */}
      {!response && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🔍', title: 'Track Competitors', desc: 'Analyze their ad strategies, messaging, and positioning' },
            { icon: '🎯', title: 'Find Opportunities', desc: 'Discover gaps in keywords, content, and platforms' },
            { icon: '🛡️', title: 'Stay Ahead', desc: 'Set up monitoring to catch competitive moves early' },
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
