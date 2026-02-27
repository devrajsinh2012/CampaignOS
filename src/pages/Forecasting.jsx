import React, { useState, useRef } from 'react';
import { TrendingUp, Calculator, Copy, Download, RefreshCw, DollarSign } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Select, Textarea } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import MetricInput from '../components/ai/MetricInput';
import { useAI } from '../hooks/useAI';
import { FORECASTING_SYSTEM_PROMPT } from '../lib/prompts';
import { CAMPAIGN_TYPES, INDUSTRIES, CAMPAIGN_GOALS } from '../lib/constants';
import useStore from '../store/store';

export default function Forecasting() {
  const { response, loading, error, run, reset } = useAI();
  const currentCampaign = useStore((s) => s.currentCampaign);

  const [mode, setMode] = useState('benchmark'); // 'historical' | 'benchmark' | 'hybrid'
  const [platform, setPlatform] = useState('');
  const [industry, setIndustry] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('4');
  const [goal, setGoal] = useState('');

  // Historical metrics (optional)
  const [historicalCPC, setHistoricalCPC] = useState('');
  const [historicalCTR, setHistoricalCTR] = useState('');
  const [historicalConvRate, setHistoricalConvRate] = useState('');
  const [historicalRoas, setHistoricalRoas] = useState('');

  const resultRef = useRef(null);

  const canGenerate = budget && (platform || industry);

  const handleGenerate = () => {
    const campaignContext = currentCampaign
      ? `\nExisting Campaign Context:\n${JSON.stringify(currentCampaign, null, 2)}`
      : '';

    let historicalData = '';
    if (mode !== 'benchmark') {
      historicalData = `\nHistorical Data:
- CPC: ${historicalCPC || 'N/A'}
- CTR: ${historicalCTR || 'N/A'}%
- Conversion Rate: ${historicalConvRate || 'N/A'}%
- ROAS: ${historicalRoas || 'N/A'}`;
    }

    const userMessage = `Run a budget forecast simulation.

Mode: ${mode === 'historical' ? 'Historical (use my past data)' : mode === 'benchmark' ? 'Benchmark (use industry averages)' : 'Hybrid (mix of both)'}
Platform: ${platform || 'Multi-channel'}
Industry: ${industry || 'General'}
Total Budget: $${budget}
Duration: ${duration} weeks
Campaign Goal: ${goal || 'Not specified'}${historicalData}${campaignContext}

Generate three scenarios (Conservative, Moderate, Aggressive) with:
- Week-by-week projections
- Total projected results (impressions, clicks, conversions, CPA, ROAS)
- Comparison table
- Budget efficiency analysis
- Sensitivity analysis
- Clear recommendation`;

    run('/api/ai/chat', {
      systemPrompt: FORECASTING_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleCopy = () => {
    if (response) navigator.clipboard.writeText(response);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([`CampaignOS Budget Forecast\n\nBudget: $${budget}\nPlatform: ${platform}\nDuration: ${duration} weeks\n\n${response}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="text-teal-400" size={28} />
          Forecasting & Budget Simulator
        </h1>
        <p className="text-slate-400 mt-1">
          Run 'what-if' budget scenarios — see projected reach, conversions, CPA, and ROAS before spending a dollar.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3">
        {[
          { id: 'benchmark', label: 'Benchmark Mode', desc: 'Use industry averages' },
          { id: 'historical', label: 'Historical Mode', desc: 'Use your past data' },
          { id: 'hybrid', label: 'Hybrid Mode', desc: 'Mix both' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 p-3 rounded-2xl text-left transition-all cursor-pointer ${
              mode === m.id
                ? 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
                : 'bg-navy-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <p className="text-sm font-medium">{m.label}</p>
            <p className="text-xs opacity-70 mt-0.5">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            <DollarSign size={16} className="inline mr-1" />
            Campaign Parameters
          </CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <ChipSelector
              options={CAMPAIGN_TYPES.map((t) => t.label)}
              selected={platform ? [platform] : []}
              onChange={(p) => setPlatform(p === platform ? '' : p)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2.5 bg-navy-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <Input label="Total Budget ($) *" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 5000" />
            <Input label="Duration (weeks)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4" />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Goal</label>
            <ChipSelector
              options={CAMPAIGN_GOALS}
              selected={goal ? [goal] : []}
              onChange={(g) => setGoal(g === goal ? '' : g)}
            />
          </div>

          {/* Historical Metrics */}
          {mode !== 'benchmark' && (
            <div className="bg-navy-800/30 rounded-2xl p-4 border border-slate-700/50">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Your Historical Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricInput label="CPC" prefix="$" value={historicalCPC} onChange={(e) => setHistoricalCPC(e.target.value)} />
                <MetricInput label="CTR" suffix="%" value={historicalCTR} onChange={(e) => setHistoricalCTR(e.target.value)} />
                <MetricInput label="Conv. Rate" suffix="%" value={historicalConvRate} onChange={(e) => setHistoricalConvRate(e.target.value)} />
                <MetricInput label="ROAS" suffix="x" value={historicalRoas} onChange={(e) => setHistoricalRoas(e.target.value)} />
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} disabled={!canGenerate} loading={loading} className="w-full">
            <Calculator size={16} className="mr-2" />
            Run Forecast Simulation
          </Button>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <div ref={resultRef}>
          <Card>
            <CardHeader>
              <CardTitle>Forecast Results</CardTitle>
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
    </div>
  );
}
