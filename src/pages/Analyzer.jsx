import React, { useState, useRef } from 'react';
import {
  Search,
  Send,
  Save,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import HealthRing from '../components/ai/HealthRing';
import MetricInput from '../components/ai/MetricInput';
import { useAI } from '../hooks/useAI';
import useStore from '../store/store';
import { CAMPAIGN_TYPES } from '../lib/constants';
import { ANALYZER_SYSTEM_PROMPT } from '../lib/prompts';
import { extractHealthScore, generateId } from '../lib/utils';

export default function Analyzer() {
  // Form state
  const [campaignType, setCampaignType] = useState('');
  const [description, setDescription] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    spend: '', impressions: '', clicks: '', ctr: '',
    cpc: '', conversions: '', cpa: '', roas: '', revenue: '',
  });

  // Follow-up chat
  const [followUp, setFollowUp] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // AI hook
  const { response, loading, error, streamResponse, reset } = useAI();
  const { response: chatResponse, loading: chatLoading, streamResponse: streamChat } = useAI();

  const { setCurrentCampaign, setAnalyzerResult, addSavedAnalysis } = useStore();
  const resultRef = useRef(null);

  const healthScore = extractHealthScore(response);

  const handleAnalyze = async () => {
    if (!campaignType || !description) return;

    const metricsText = Object.entries(metrics)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');

    const userMessage = `
Campaign Type: ${CAMPAIGN_TYPES.find((t) => t.id === campaignType)?.label || campaignType}
Campaign Description: ${description}
${metricsText ? `Metrics: ${metricsText}` : 'No structured metrics provided — please analyze based on the description.'}
    `.trim();

    // Set cross-feature context
    setCurrentCampaign({ type: campaignType, description, metrics });

    await streamResponse('analyze', {
      systemPrompt: ANALYZER_SYSTEM_PROMPT,
      userMessage,
    });

    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || chatLoading) return;

    const newHistory = [
      ...chatHistory,
      { role: 'user', content: followUp },
    ];
    setChatHistory(newHistory);
    setFollowUp('');

    const context = `
Previous Analysis Context:
Campaign Type: ${CAMPAIGN_TYPES.find((t) => t.id === campaignType)?.label}
Description: ${description}
Analysis Result: ${response.substring(0, 2000)}
    `.trim();

    await streamChat('chat', {
      systemPrompt: ANALYZER_SYSTEM_PROMPT,
      messages: [
        { role: 'system', content: context },
        ...newHistory.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
  };

  const handleSave = () => {
    if (!response) return;
    addSavedAnalysis({
      id: generateId(),
      type: campaignType,
      description: description.substring(0, 100),
      healthScore,
      response,
      createdAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setCampaignType('');
    setDescription('');
    setMetrics({ spend: '', impressions: '', clicks: '', ctr: '', cpc: '', conversions: '', cpa: '', roas: '', revenue: '' });
    setChatHistory([]);
    setFollowUp('');
    reset();
  };

  const updateMetric = (key, value) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
            <Search size={18} className="text-blue-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-100">
            Campaign Analyzer
          </h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">
          Paste your campaign details and get an expert AI breakdown of what's working and what to fix.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <div className="space-y-5">
          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Campaign Type
            </label>
            <ChipSelector
              options={CAMPAIGN_TYPES}
              selected={campaignType}
              onChange={setCampaignType}
            />
          </div>

          {/* Description */}
          <Textarea
            label="Describe Your Campaign"
            placeholder="Tell us about your campaign: What product/service are you promoting? Who's the target audience? What creatives are you using? What's the objective? How long has it been running?"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Metrics Toggle */}
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            {showMetrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showMetrics ? 'Hide' : 'Add'} Campaign Metrics (optional)
          </button>

          {/* Metrics Grid */}
          {showMetrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-navy-900/50 rounded-xl">
              <MetricInput label="Spend" prefix="$" value={metrics.spend} onChange={(v) => updateMetric('spend', v)} />
              <MetricInput label="Impressions" value={metrics.impressions} onChange={(v) => updateMetric('impressions', v)} />
              <MetricInput label="Clicks" value={metrics.clicks} onChange={(v) => updateMetric('clicks', v)} />
              <MetricInput label="CTR" suffix="%" value={metrics.ctr} onChange={(v) => updateMetric('ctr', v)} />
              <MetricInput label="CPC" prefix="$" value={metrics.cpc} onChange={(v) => updateMetric('cpc', v)} />
              <MetricInput label="Conversions" value={metrics.conversions} onChange={(v) => updateMetric('conversions', v)} />
              <MetricInput label="CPA" prefix="$" value={metrics.cpa} onChange={(v) => updateMetric('cpa', v)} />
              <MetricInput label="ROAS" suffix="x" value={metrics.roas} onChange={(v) => updateMetric('roas', v)} />
              <MetricInput label="Revenue" prefix="$" value={metrics.revenue} onChange={(v) => updateMetric('revenue', v)} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={!campaignType || !description}
              size="lg"
            >
              <Search size={16} />
              Analyze Campaign
            </Button>
            {response && (
              <>
                <Button variant="secondary" onClick={handleSave}>
                  <Save size={14} />
                  Save
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw size={14} />
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {(response || loading || error) && (
        <div ref={resultRef} className="space-y-4">
          {/* Health Score + AI Response */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Health Score Card */}
            {healthScore !== null && (
              <Card className="lg:w-48 flex flex-col items-center justify-center py-6 flex-shrink-0">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Health Score
                </p>
                <HealthRing score={healthScore} />
              </Card>
            )}

            {/* Analysis */}
            <div className="flex-1">
              <AIBlock content={response} loading={loading} error={error} />
            </div>
          </div>

          {/* Follow-up Chat */}
          {response && !loading && (
            <Card>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                Ask a follow-up question
              </h3>

              {/* Chat history */}
              {chatHistory.length > 0 && (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-sm px-3 py-2 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-teal-500/10 text-slate-200 ml-8'
                          : 'bg-navy-900/50 text-slate-300 mr-8'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {chatResponse && (
                    <div className="text-sm px-3 py-2 rounded-xl bg-navy-900/50 text-slate-300 mr-8 ai-markdown">
                      <AIBlock content={chatResponse} loading={chatLoading} />
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                  placeholder="e.g., How do I improve my CTR specifically?"
                  className="flex-1 bg-navy-900/80 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm 
                    placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <Button onClick={handleFollowUp} loading={chatLoading} disabled={!followUp.trim()}>
                  <Send size={14} />
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
