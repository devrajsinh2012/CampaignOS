import React, { useState, useRef } from 'react';
import { Map, ArrowLeft, ArrowRight, Save, RotateCcw, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Textarea, Select } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import useStore from '../store/store';
import { CAMPAIGN_GOALS, CHANNELS, EXPERIENCE_LEVELS } from '../lib/constants';
import { PLANNER_SYSTEM_PROMPT } from '../lib/prompts';
import { generateId } from '../lib/utils';

export default function Planner() {
  const [step, setStep] = useState(1);

  // Step 1 — Project Brief
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [geography, setGeography] = useState('');

  // Step 2 — Channels
  const [channels, setChannels] = useState([]);
  const [aiRecommend, setAiRecommend] = useState(false);
  const [experience, setExperience] = useState('intermediate');

  // AI
  const { response, loading, error, streamResponse, reset } = useAI();
  const { setCurrentCampaign, addSavedPlan } = useStore();
  const resultRef = useRef(null);

  const canProceed = () => {
    if (step === 1) return businessName && industry && productDesc && goal && budget;
    if (step === 2) return aiRecommend || channels.length > 0;
    return true;
  };

  const handleGenerate = async () => {
    const channelList = aiRecommend
      ? 'AI should recommend the best channels based on goal and budget.'
      : channels.join(', ');

    const userMessage = `
## Project Brief
- Business Name: ${businessName}
- Industry: ${industry}
- Product/Service: ${productDesc}
- Campaign Goal: ${goal}
- Target Audience: ${audience || 'Not specified — please suggest based on industry'}
- Total Budget: $${budget}
- Duration: ${duration || '4 weeks'}
- Geography: ${geography || 'Global'}

## Channel Preferences
${channelList}

## Experience Level: ${experience}

Please generate a complete marketing strategy tailored to this specific business, budget, and goal.
    `.trim();

    setCurrentCampaign({
      businessName,
      industry,
      goal,
      budget,
      channels: aiRecommend ? 'AI-recommended' : channels,
    });

    setStep(3);
    await streamResponse('plan', {
      systemPrompt: PLANNER_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleSave = () => {
    if (!response) return;
    addSavedPlan({
      id: generateId(),
      businessName,
      industry,
      goal,
      budget,
      response,
      createdAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setStep(1);
    setBusinessName('');
    setIndustry('');
    setProductDesc('');
    setGoal('');
    setAudience('');
    setBudget('');
    setDuration('');
    setGeography('');
    setChannels([]);
    setAiRecommend(false);
    reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-teal-500/15 rounded-xl flex items-center justify-center">
            <Map size={18} className="text-teal-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-100">
            Campaign Planner
          </h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">
          Enter your project details and get a complete marketing strategy with budget allocation and timeline.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors
                ${step >= s
                  ? 'bg-teal-500 text-navy-900'
                  : 'bg-slate-700/50 text-slate-500'
                }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > s ? 'bg-teal-500' : 'bg-slate-700/50'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Project Brief</span>
        <span>Channels</span>
        <span>Strategy</span>
      </div>

      {/* Step 1: Project Brief */}
      {step === 1 && (
        <Card>
          <h2 className="font-display font-bold text-lg text-slate-100 mb-4">
            Project Brief
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              placeholder="e.g., Acme Co"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <Input
              label="Industry"
              placeholder="e.g., E-commerce, SaaS, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Product/Service Description"
              placeholder="What are you selling and to whom? (Min 50 characters for best results)"
              rows={3}
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Primary Campaign Goal
            </label>
            <ChipSelector
              options={CAMPAIGN_GOALS}
              selected={goal}
              onChange={setGoal}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Textarea
              label="Target Audience"
              placeholder="Describe your ideal customer..."
              rows={2}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
            <div className="space-y-4">
              <Input
                label="Total Budget ($)"
                type="number"
                placeholder="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Duration"
                  placeholder="e.g., 4 weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <Input
                  label="Geography"
                  placeholder="e.g., US, India"
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(2)} disabled={!canProceed()}>
              Next: Channels
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Channel Preferences */}
      {step === 2 && (
        <Card>
          <h2 className="font-display font-bold text-lg text-slate-100 mb-4">
            Channel Preferences
          </h2>

          {/* AI Recommend Toggle */}
          <label className="flex items-center gap-3 p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={aiRecommend}
              onChange={(e) => setAiRecommend(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600"
            />
            <div>
              <p className="text-sm font-semibold text-teal-400">Let AI recommend channels</p>
              <p className="text-xs text-slate-500">AI will choose the best channels based on your goal and budget</p>
            </div>
          </label>

          {!aiRecommend && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Channels
              </label>
              <ChipSelector
                options={CHANNELS}
                selected={channels}
                onChange={setChannels}
                multiple
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Experience Level
            </label>
            <ChipSelector
              options={EXPERIENCE_LEVELS}
              selected={experience}
              onChange={setExperience}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button onClick={handleGenerate} disabled={!canProceed()} loading={loading}>
              Generate Strategy
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Strategy Output */}
      {step === 3 && (
        <div ref={resultRef} className="space-y-4">
          <AIBlock content={response} loading={loading} error={error} />

          {response && !loading && (
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>
                <Save size={14} />
                Save Plan
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw size={14} />
                Start Over
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
