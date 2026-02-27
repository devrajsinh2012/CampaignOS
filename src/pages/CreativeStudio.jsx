import React, { useState, useRef } from 'react';
import { Palette, Copy, Download, RefreshCw, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea, Select } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { useAI } from '../hooks/useAI';
import { CREATIVE_SYSTEM_PROMPT } from '../lib/prompts';
import { CREATIVE_TYPES, CREATIVE_PLATFORMS, VOICE_TONES } from '../lib/constants';
import useStore from '../store/store';

const VARIANT_COUNTS = [3, 5, 10];

export default function CreativeStudio() {
  const { response, loading, error, run, reset } = useAI();
  const currentCampaign = useStore((s) => s.currentCampaign);

  // Brand voice
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [selectedTones, setSelectedTones] = useState([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [alwaysUse, setAlwaysUse] = useState('');
  const [neverUse, setNeverUse] = useState('');

  // Creative brief
  const [creativeType, setCreativeType] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [objective, setObjective] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [variantCount, setVariantCount] = useState(5);
  const [showBrandVoice, setShowBrandVoice] = useState(false);

  const resultRef = useRef(null);

  const canGenerate = creativeType && platforms.length > 0 && (objective || keyMessage);

  const handleGenerate = () => {
    const brandContext = brandName
      ? `\n\nBrand Voice Profile:\n- Brand: ${brandName}\n- Description: ${brandDescription}\n- Tone: ${selectedTones.join(', ') || 'Not specified'}\n- Target Audience: ${targetAudience}\n- Value Proposition: ${valueProp}\n- Always use: ${alwaysUse || 'N/A'}\n- Never use: ${neverUse || 'N/A'}`
      : '';

    const campaignContext = currentCampaign
      ? `\n\nCampaign Context:\n${JSON.stringify(currentCampaign, null, 2)}`
      : '';

    const userMessage = `Generate ${variantCount} creative variants.

Creative Type: ${creativeType}
Target Platform(s): ${platforms.join(', ')}
Campaign Objective: ${objective}
Key Message: ${keyMessage}${brandContext}${campaignContext}

Generate exactly ${variantCount} variants. Rank by performance score (highest first). Follow platform character limits strictly.`;

    run('/api/ai/chat', {
      systemPrompt: CREATIVE_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleReset = () => {
    setCreativeType('');
    setPlatforms([]);
    setObjective('');
    setKeyMessage('');
    setVariantCount(5);
    reset();
  };

  const handleCopyAll = () => {
    if (response) navigator.clipboard.writeText(response);
  };

  const handleExport = () => {
    if (!response) return;
    const blob = new Blob([`CampaignOS Creative Package\n\nType: ${creativeType}\nPlatforms: ${platforms.join(', ')}\n\n${response}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-package-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Palette className="text-teal-400" size={28} />
          Creative Studio
        </h1>
        <p className="text-slate-400 mt-1">
          Generate ad copy, headlines, CTAs, and creative briefs — scored by predicted performance.
        </p>
      </div>

      {/* Brand Voice Toggle */}
      <Card>
        <button
          onClick={() => setShowBrandVoice(!showBrandVoice)}
          className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Brand Voice Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">Optional — helps generate on-brand copy</p>
          </div>
          {showBrandVoice ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>

        {showBrandVoice && (
          <div className="px-4 pb-4 space-y-4 border-t border-slate-700/50 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Brand Name" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Acme Co" />
              <Input label="Value Proposition" value={valueProp} onChange={(e) => setValueProp(e.target.value)} placeholder="Main benefit in 1 sentence" />
            </div>
            <Textarea label="Brand Description" value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="What does your brand do? Who is it for?" rows={2} />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone of Voice (up to 3)</label>
              <ChipSelector
                options={VOICE_TONES}
                selected={selectedTones}
                onChange={(tone) => {
                  if (selectedTones.includes(tone)) {
                    setSelectedTones(selectedTones.filter((t) => t !== tone));
                  } else if (selectedTones.length < 3) {
                    setSelectedTones([...selectedTones, tone]);
                  }
                }}
                multi
              />
            </div>
            <Textarea label="Target Audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Who are you speaking to?" rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Words to Always Use" value={alwaysUse} onChange={(e) => setAlwaysUse(e.target.value)} placeholder="e.g. innovative, premium" />
              <Input label="Words to Never Use" value={neverUse} onChange={(e) => setNeverUse(e.target.value)} placeholder="e.g. cheap, basic" />
            </div>
          </div>
        )}
      </Card>

      {/* Creative Brief */}
      <Card>
        <CardHeader>
          <CardTitle>Creative Brief</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          {/* Creative Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Creative Type *</label>
            <ChipSelector
              options={CREATIVE_TYPES}
              selected={creativeType ? [creativeType] : []}
              onChange={(type) => setCreativeType(type === creativeType ? '' : type)}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Platform(s) *</label>
            <ChipSelector
              options={CREATIVE_PLATFORMS}
              selected={platforms}
              onChange={(p) => {
                if (platforms.includes(p)) {
                  setPlatforms(platforms.filter((x) => x !== p));
                } else {
                  setPlatforms([...platforms, p]);
                }
              }}
              multi
            />
          </div>

          {/* Objective & Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea label="Campaign Objective *" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="e.g. Drive 20% more signups for our free trial" rows={3} />
            <Textarea label="Key Message" value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} placeholder="The core message to communicate" rows={3} />
          </div>

          {/* Variant Count */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Variants</label>
            <div className="flex gap-2">
              {VARIANT_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setVariantCount(n)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    variantCount === n
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-navy-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {n} variants
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleGenerate} disabled={!canGenerate} loading={loading} className="flex-1">
              <Star size={16} className="mr-2" />
              Generate {variantCount} Variants
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
              <CardTitle>Creative Package</CardTitle>
              {response && !loading && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                    <Copy size={14} className="mr-1" /> Copy All
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

      {/* Campaign Context Banner */}
      {currentCampaign && (
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-3 flex items-center gap-2 text-xs text-teal-300">
          <Star size={14} />
          <span>Campaign context from {currentCampaign.type || 'previous feature'} is being used for relevant creative generation.</span>
        </div>
      )}
    </div>
  );
}
