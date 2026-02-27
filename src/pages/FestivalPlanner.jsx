import React, { useState, useRef } from 'react';
import { Calendar, Globe, Briefcase, ChevronRight, Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { FESTIVAL_SYSTEM_PROMPT } from '../lib/prompts';
import { FESTIVAL_GEOGRAPHIES, FESTIVAL_MONTHS } from '../lib/constants';

export default function FestivalPlanner() {
  const { response, loading, error, run, reset } = useAI();

  const [geography, setGeography] = useState([]);
  const [industry, setIndustry] = useState('');
  const [brandName, setBrandName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [mode, setMode] = useState('calendar'); // 'calendar' | 'concept'
  const [selectedEvent, setSelectedEvent] = useState('');

  const resultRef = useRef(null);

  const handleGenerateCalendar = () => {
    const userMessage = `Generate a 12-month marketing calendar.

Target Geographies: ${geography.length > 0 ? geography.join(', ') : 'Global'}
Industry: ${industry || 'General'}
Brand: ${brandName || 'Not specified'}
${selectedMonth ? `Focus Month: ${selectedMonth}` : 'Show all 12 months'}

For each event/holiday include:
- Date and lead time recommendation
- Opportunity score for this industry (1-10)
- Tier: 1 (major, high-spend), 2 (medium), 3 (social post only)
- Brief campaign angle suggestion

Format as a structured calendar by month.`;

    run('/api/ai/chat', {
      systemPrompt: FESTIVAL_SYSTEM_PROMPT,
      userMessage,
    });

    setMode('calendar');
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleGenerateConcept = () => {
    if (!selectedEvent) return;

    const userMessage = `Generate a complete campaign concept for this event:

Event: ${selectedEvent}
Industry: ${industry || 'General'}
Brand: ${brandName || 'Not specified'}
Target Geographies: ${geography.length > 0 ? geography.join(', ') : 'Global'}

Provide:
1. Event overview — cultural context, consumer behavior, spending patterns
2. 5 Campaign Angles — emotional, humorous, offer-led, storytelling, educational
3. 3 Social Post Concepts per angle (image direction + caption)
4. Offer Ideas — promotions, bundles, limited-time offers
5. Messaging Do's and Don'ts — cultural sensitivity, brand-safe tips
6. Recommended timeline — when to start preparation`;

    run('/api/ai/chat', {
      systemPrompt: FESTIVAL_SYSTEM_PROMPT,
      userMessage,
    });

    setMode('concept');
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleCopy = () => {
    if (response) navigator.clipboard.writeText(response);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([`CampaignOS Festival Planner\n\nGeographies: ${geography.join(', ')}\nIndustry: ${industry}\n\n${response}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `festival-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setGeography([]);
    setIndustry('');
    setBrandName('');
    setSelectedMonth('');
    setSelectedEvent('');
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="text-teal-400" size={28} />
          Festival & Holiday Planner
        </h1>
        <p className="text-slate-400 mt-1">
          Never miss a marketing moment — 12-month campaign calendar with AI-generated creative concepts.
        </p>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Settings</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          {/* Geographies */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Globe size={14} className="inline mr-1" /> Target Geographies
            </label>
            <ChipSelector
              options={FESTIVAL_GEOGRAPHIES}
              selected={geography}
              onChange={(geo) => {
                if (geography.includes(geo)) {
                  setGeography(geography.filter((g) => g !== geo));
                } else {
                  setGeography([...geography, geo]);
                }
              }}
              multi
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Fashion, Food & Beverage, SaaS"
            />
            <Input
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your brand name"
            />
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Focus on Month (optional)</label>
            <div className="flex flex-wrap gap-2">
              {FESTIVAL_MONTHS.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month === selectedMonth ? '' : month)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedMonth === month
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-navy-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Calendar */}
          <Button onClick={handleGenerateCalendar} loading={loading && mode === 'calendar'} className="w-full">
            <Calendar size={16} className="mr-2" />
            Generate 12-Month Calendar
          </Button>
        </div>
      </Card>

      {/* Event Concept Builder */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Sparkles size={16} className="inline mr-1" /> Event Concept Builder
          </CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          <Input
            label="Event / Holiday Name"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            placeholder="e.g. Black Friday, Diwali, Valentine's Day, Back to School"
          />
          <Button
            onClick={handleGenerateConcept}
            disabled={!selectedEvent}
            loading={loading && mode === 'concept'}
            variant="secondary"
            className="w-full"
          >
            <Sparkles size={16} className="mr-2" />
            Generate Campaign Concept
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <div ref={resultRef}>
          <Card>
            <CardHeader>
              <CardTitle>{mode === 'calendar' ? '12-Month Marketing Calendar' : `Campaign Concept: ${selectedEvent}`}</CardTitle>
              {response && !loading && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExport}>
                    <Download size={14} className="mr-1" /> Export
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw size={14} />
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
    </div>
  );
}
