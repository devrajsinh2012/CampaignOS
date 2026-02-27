import React, { useState, useRef } from 'react';
import { Users, Copy, Download, RefreshCw, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { AUDIENCE_SYSTEM_PROMPT } from '../lib/prompts';
import useStore from '../store/store';

export default function AudienceBuilder() {
  const { response, loading, error, run, reset } = useAI();
  const currentCampaign = useStore((s) => s.currentCampaign);

  const [industry, setIndustry] = useState('');
  const [product, setProduct] = useState('');
  const [topAttributes, setTopAttributes] = useState('');
  const [avgOrderValue, setAvgOrderValue] = useState('');
  const [purchaseFrequency, setPurchaseFrequency] = useState('');
  const [exampleCustomers, setExampleCustomers] = useState('');

  const resultRef = useRef(null);

  const canGenerate = industry && product;

  const handleGenerate = () => {
    const campaignContext = currentCampaign
      ? `\n\nCampaign Context:\n${JSON.stringify(currentCampaign, null, 2)}`
      : '';

    const userMessage = `Generate 5 distinct audience personas for this business:

Industry: ${industry}
Product/Service: ${product}
Top 3 Customer Attributes: ${topAttributes || 'Not specified'}
Average Order Value: ${avgOrderValue || 'Not specified'}
Purchase Frequency: ${purchaseFrequency || 'Not specified'}
${exampleCustomers ? `\nExample Customer Descriptions:\n${exampleCustomers}` : ''}${campaignContext}

Generate 5 genuinely distinct personas with actionable targeting suggestions.`;

    run('/api/ai/chat', {
      systemPrompt: AUDIENCE_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleReset = () => {
    setIndustry('');
    setProduct('');
    setTopAttributes('');
    setAvgOrderValue('');
    setPurchaseFrequency('');
    setExampleCustomers('');
    reset();
  };

  const handleCopy = () => {
    if (response) navigator.clipboard.writeText(response);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([`CampaignOS Audience Personas\n\nIndustry: ${industry}\nProduct: ${product}\n\n${response}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audience-personas-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Users className="text-teal-400" size={28} />
          Audience Builder & Persona Lab
        </h1>
        <p className="text-slate-400 mt-1">
          Build precise audience segments with size estimates, predicted CAC, and creative hooks.
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Industry *" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Fashion & Apparel, SaaS, Food & Beverage" />
            <Input label="Average Order Value" value={avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value)} placeholder="e.g. $45" />
          </div>

          <Textarea label="Product / Service Description *" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="What are you selling and to whom? Be specific about features and benefits." rows={3} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Top 3 Customer Attributes" value={topAttributes} onChange={(e) => setTopAttributes(e.target.value)} placeholder="e.g. health-conscious, age 25-34, urban" />
            <Input label="Purchase Frequency" value={purchaseFrequency} onChange={(e) => setPurchaseFrequency(e.target.value)} placeholder="e.g. monthly, quarterly" />
          </div>

          <Textarea label="Example Customer Descriptions (Optional)" value={exampleCustomers} onChange={(e) => setExampleCustomers(e.target.value)} placeholder="Paste 5-10 example customer descriptions for richer persona matching..." rows={3} />

          {/* Audience Recipes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Quick Audience Recipes</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: 'Broad Prospecting', desc: 'Wide reach, interest-based cold targeting' },
                { label: 'Mid-Funnel Engaged', desc: 'Website visitors, video viewers, engagers' },
                { label: 'Narrow Retargeting', desc: 'Cart abandoners, high-intent visitors' },
              ].map((recipe) => (
                <button
                  key={recipe.label}
                  onClick={() => setTopAttributes((prev) => (prev ? prev + ', ' : '') + recipe.label.toLowerCase())}
                  className="text-left p-3 bg-navy-800/50 border border-slate-700/50 rounded-xl hover:border-teal-500/30 transition-all cursor-pointer"
                >
                  <p className="text-sm font-medium text-slate-200">{recipe.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{recipe.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleGenerate} disabled={!canGenerate} loading={loading} className="flex-1">
              <Target size={16} className="mr-2" />
              Generate 5 Personas
            </Button>
            {response && (
              <Button variant="ghost" onClick={handleReset}>
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results */}
      {(response || loading) && (
        <div ref={resultRef}>
          <Card>
            <CardHeader>
              <CardTitle>Audience Personas</CardTitle>
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

      {currentCampaign && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-3 flex items-center gap-2 text-xs text-teal-300">
          <Target size={14} />
          <span>Campaign context applied — personas are tailored to your current campaign.</span>
        </div>
      )}
    </div>
  );
}
