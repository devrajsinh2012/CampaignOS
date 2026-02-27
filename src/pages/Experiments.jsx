import React, { useState, useRef } from 'react';
import { FlaskConical, Plus, BarChart3, Copy, Download, RefreshCw, Lightbulb, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import MetricInput from '../components/ai/MetricInput';
import { useAI } from '../hooks/useAI';
import { EXPERIMENT_SYSTEM_PROMPT } from '../lib/prompts';
import { EXPERIMENT_TYPES, TEST_ELEMENTS, CONFIDENCE_LEVELS } from '../lib/constants';
import useStore from '../store/store';

export default function Experiments() {
  const designAI = useAI();
  const analyzeAI = useAI();
  const currentCampaign = useStore((s) => s.currentCampaign);

  const [tab, setTab] = useState('design'); // 'design' | 'analyze' | 'catalog'

  // Design fields
  const [experimentName, setExperimentName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [experimentType, setExperimentType] = useState('');
  const [testElement, setTestElement] = useState('');
  const [primaryMetric, setPrimaryMetric] = useState('');
  const [secondaryMetrics, setSecondaryMetrics] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [minEffect, setMinEffect] = useState('10');

  // Analyze fields
  const [controlConversions, setControlConversions] = useState('');
  const [controlSample, setControlSample] = useState('');
  const [variantConversions, setVariantConversions] = useState('');
  const [variantSample, setVariantSample] = useState('');
  const [testDuration, setTestDuration] = useState('');

  // Catalog
  const [experiments, setExperiments] = useState([]);

  const designRef = useRef(null);
  const analyzeRef = useRef(null);

  const handleDesign = () => {
    const campaignContext = currentCampaign
      ? `\nCampaign Context:\n${JSON.stringify(currentCampaign, null, 2)}`
      : '';

    const userMessage = `Design an experiment:

Experiment Name: ${experimentName || 'Untitled Experiment'}
Hypothesis: ${hypothesis}
Type: ${experimentType || 'A/B Test'}
Testing: ${testElement || 'Not specified'}
Primary Metric: ${primaryMetric || 'Conversion Rate'}
Secondary Metrics: ${secondaryMetrics || 'None specified'}
Confidence Level: ${confidenceLevel}%
Minimum Detectable Effect: ${minEffect}%${campaignContext}

Please:
1. Validate the hypothesis structure
2. Recommend the test type
3. Calculate required sample size
4. Estimate recommended runtime
5. Define success criteria
6. Suggest variant ideas`;

    designAI.run('/api/ai/chat', {
      systemPrompt: EXPERIMENT_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => designRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleAnalyze = () => {
    const userMessage = `Analyze experiment results:

Control Group:
- Conversions: ${controlConversions}
- Sample Size: ${controlSample}
- Conversion Rate: ${controlSample ? ((controlConversions / controlSample) * 100).toFixed(2) : 'N/A'}%

Variant Group:
- Conversions: ${variantConversions}
- Sample Size: ${variantSample}
- Conversion Rate: ${variantSample ? ((variantConversions / variantSample) * 100).toFixed(2) : 'N/A'}%

Test Duration: ${testDuration || 'Not specified'} days
Target Confidence: ${confidenceLevel}%

Provide:
1. Statistical significance analysis
2. Effect size calculation
3. Bayesian probability
4. Verdict: Full Rollout / Continue Test / Stop & Iterate
5. Learning summary and next experiment recommendations`;

    analyzeAI.run('/api/ai/chat', {
      systemPrompt: EXPERIMENT_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => analyzeRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <FlaskConical className="text-teal-400" size={28} />
          Experimentation Engine
        </h1>
        <p className="text-slate-400 mt-1">
          Design experiments, calculate sample sizes, and get AI-powered verdicts when tests conclude.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-navy-800/50 rounded-2xl p-1">
        {[
          { id: 'design', label: 'Design Experiment', icon: Plus },
          { id: 'analyze', label: 'Analyze Results', icon: BarChart3 },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Design Tab */}
      {tab === 'design' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                <Lightbulb size={16} className="inline mr-1" />
                Experiment Design
              </CardTitle>
            </CardHeader>
            <div className="p-4 pt-0 space-y-4">
              <Input label="Experiment Name" value={experimentName} onChange={(e) => setExperimentName(e.target.value)} placeholder="e.g. Homepage CTA Color Test" />

              <Textarea
                label="Hypothesis *"
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="We believe [change] will [increase/decrease] [metric] for [audience] because [reason]"
                rows={3}
              />

              {/* Experiment Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Experiment Type</label>
                <ChipSelector
                  options={EXPERIMENT_TYPES}
                  selected={experimentType ? [experimentType] : []}
                  onChange={(t) => setExperimentType(t === experimentType ? '' : t)}
                />
              </div>

              {/* Test Element */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">What are you testing?</label>
                <ChipSelector
                  options={TEST_ELEMENTS}
                  selected={testElement ? [testElement] : []}
                  onChange={(t) => setTestElement(t === testElement ? '' : t)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Primary Metric" value={primaryMetric} onChange={(e) => setPrimaryMetric(e.target.value)} placeholder="e.g. Conversion Rate, CTR" />
                <Input label="Secondary Metrics" value={secondaryMetrics} onChange={(e) => setSecondaryMetrics(e.target.value)} placeholder="e.g. Bounce Rate, Revenue" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confidence Level</label>
                  <div className="flex gap-2">
                    {CONFIDENCE_LEVELS.map((cl) => (
                      <button
                        key={cl.value}
                        onClick={() => setConfidenceLevel(cl.value)}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          confidenceLevel === cl.value
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : 'bg-navy-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {cl.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Minimum Detectable Effect (%)" type="number" value={minEffect} onChange={(e) => setMinEffect(e.target.value)} placeholder="10" />
              </div>

              <Button onClick={handleDesign} disabled={!hypothesis} loading={designAI.loading} className="w-full">
                <FlaskConical size={16} className="mr-2" />
                Design Experiment
              </Button>
            </div>
          </Card>

          {(designAI.response || designAI.loading) && (
            <div ref={designRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Experiment Design</CardTitle>
                  {designAI.response && !designAI.loading && (
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(designAI.response)}>
                      <Copy size={14} className="mr-1" /> Copy
                    </Button>
                  )}
                </CardHeader>
                <div className="p-4 pt-0">
                  <AIBlock response={designAI.response} loading={designAI.loading} error={designAI.error} />
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Analyze Tab */}
      {tab === 'analyze' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart3 size={16} className="inline mr-1" />
                Enter Results
              </CardTitle>
            </CardHeader>
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Control Group */}
                <div className="bg-navy-800/30 rounded-2xl p-4 border border-slate-700/50">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Control Group (A)</h4>
                  <div className="space-y-3">
                    <MetricInput label="Conversions" value={controlConversions} onChange={(e) => setControlConversions(e.target.value)} />
                    <MetricInput label="Sample Size" value={controlSample} onChange={(e) => setControlSample(e.target.value)} />
                    {controlSample && controlConversions && (
                      <p className="text-xs text-slate-400">
                        Conv. Rate: <span className="text-teal-400 font-mono">{((controlConversions / controlSample) * 100).toFixed(2)}%</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Variant Group */}
                <div className="bg-navy-800/30 rounded-2xl p-4 border border-teal-500/20">
                  <h4 className="text-sm font-semibold text-teal-300 mb-3">Variant Group (B)</h4>
                  <div className="space-y-3">
                    <MetricInput label="Conversions" value={variantConversions} onChange={(e) => setVariantConversions(e.target.value)} />
                    <MetricInput label="Sample Size" value={variantSample} onChange={(e) => setVariantSample(e.target.value)} />
                    {variantSample && variantConversions && (
                      <p className="text-xs text-slate-400">
                        Conv. Rate: <span className="text-teal-400 font-mono">{((variantConversions / variantSample) * 100).toFixed(2)}%</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Input label="Test Duration (days)" type="number" value={testDuration} onChange={(e) => setTestDuration(e.target.value)} placeholder="e.g. 14" />

              <Button
                onClick={handleAnalyze}
                disabled={!controlConversions || !controlSample || !variantConversions || !variantSample}
                loading={analyzeAI.loading}
                className="w-full"
              >
                <BarChart3 size={16} className="mr-2" />
                Analyze Results
              </Button>
            </div>
          </Card>

          {(analyzeAI.response || analyzeAI.loading) && (
            <div ref={analyzeRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Analysis & Verdict</CardTitle>
                  {analyzeAI.response && !analyzeAI.loading && (
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(analyzeAI.response)}>
                      <Copy size={14} className="mr-1" /> Copy
                    </Button>
                  )}
                </CardHeader>
                <div className="p-4 pt-0">
                  <AIBlock response={analyzeAI.response} loading={analyzeAI.loading} error={analyzeAI.error} />
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
