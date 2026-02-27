import React, { useState, useRef } from 'react';
import { Wand2, Copy, RefreshCw, Image, Video, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Input, { Textarea } from '../components/ui/Input';
import ChipSelector from '../components/ui/ChipSelector';
import AIBlock from '../components/ai/AIBlock';
import { ChatBubble } from '../components/ai/ChatBubble';
import { useAI } from '../hooks/useAI';
import { PROMPT_GENERATOR_SYSTEM_PROMPT } from '../lib/prompts';

const TARGET_TOOLS = ['Midjourney', 'DALL-E 3', 'Adobe Firefly', 'Runway', 'Sora', 'Kling'];
const OUTPUT_FORMATS = ['Still Image', 'Short Loop (3-5s)', 'Short Video (15-30s)'];
const AD_PLACEMENTS = ['Meta Feed', 'TikTok', 'YouTube', 'LinkedIn', 'Display', 'Instagram Stories'];

export default function PromptGenerator() {
  const { response, loading, error, run, reset } = useAI();
  const refineAI = useAI();

  const [concept, setConcept] = useState('');
  const [brandContext, setBrandContext] = useState('');
  const [targetTool, setTargetTool] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [adPlacement, setAdPlacement] = useState('');
  const [refineInput, setRefineInput] = useState('');
  const [refinements, setRefinements] = useState([]);

  const resultRef = useRef(null);
  const refineRef = useRef(null);

  const canGenerate = concept.trim().length > 10;

  const handleGenerate = () => {
    const userMessage = `Creative Concept: ${concept}
${brandContext ? `Brand Context: ${brandContext}` : ''}
Target Tool: ${targetTool || 'General (optimize for all)'}
Output Format: ${outputFormat || 'Still Image'}
Ad Placement: ${adPlacement || 'Not specified'}

Generate optimized prompts for this concept.`;

    run('/api/ai/chat', {
      systemPrompt: PROMPT_GENERATOR_SYSTEM_PROMPT,
      userMessage,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleRefine = () => {
    if (!refineInput.trim() || !response) return;

    const newRefinement = { role: 'user', content: refineInput };
    setRefinements((prev) => [...prev, newRefinement]);
    setRefineInput('');

    const messages = [
      { role: 'system', content: PROMPT_GENERATOR_SYSTEM_PROMPT },
      { role: 'user', content: `Original concept: ${concept}` },
      { role: 'assistant', content: response },
      ...refinements.map((r) => ({ role: r.role, content: r.content })),
      { role: 'user', content: `Refine the prompt based on this instruction: ${refineInput}. Keep the base concept but apply this change. Output the FULL updated prompt package.` },
    ];

    refineAI.run('/api/ai/chat', { messages });

    setTimeout(() => refineRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || response);
  };

  const handleReset = () => {
    setConcept('');
    setBrandContext('');
    setTargetTool('');
    setOutputFormat('');
    setAdPlacement('');
    setRefinements([]);
    reset();
    refineAI.reset();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <Wand2 className="text-teal-400" size={28} />
          Concept-to-Prompt Generator
        </h1>
        <p className="text-slate-400 mt-1">
          Describe your creative concept in plain language — get optimized prompts for any AI image/video tool.
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle>Creative Concept</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          <Textarea
            label="Describe your concept in plain English *"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. A woman using a sleek skincare product in a bright bathroom at golden hour, with soft natural light and clean aesthetic"
            rows={3}
          />

          <Textarea
            label="Brand Context (optional)"
            value={brandContext}
            onChange={(e) => setBrandContext(e.target.value)}
            placeholder="Tone, colors, style references from your brand..."
            rows={2}
          />

          {/* Target Tool */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Tool</label>
            <ChipSelector
              options={TARGET_TOOLS}
              selected={targetTool ? [targetTool] : []}
              onChange={(tool) => setTargetTool(tool === targetTool ? '' : tool)}
            />
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Output Format</label>
            <div className="flex gap-2 flex-wrap">
              {OUTPUT_FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt === outputFormat ? '' : fmt)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    outputFormat === fmt
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-navy-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {fmt.includes('Image') ? <Image size={14} /> : <Video size={14} />}
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Ad Placement */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ad Placement</label>
            <ChipSelector
              options={AD_PLACEMENTS}
              selected={adPlacement ? [adPlacement] : []}
              onChange={(p) => setAdPlacement(p === adPlacement ? '' : p)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleGenerate} disabled={!canGenerate} loading={loading} className="flex-1">
              <Sparkles size={16} className="mr-2" />
              Generate Prompt Package
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
              <CardTitle>Prompt Package</CardTitle>
              {response && !loading && (
                <Button variant="ghost" size="sm" onClick={() => handleCopy()}>
                  <Copy size={14} className="mr-1" /> Copy All
                </Button>
              )}
            </CardHeader>
            <div className="p-4 pt-0">
              <AIBlock response={response} loading={loading} error={error} />
            </div>
          </Card>
        </div>
      )}

      {/* Refinement Chat */}
      {response && !loading && (
        <div ref={refineRef}>
          <Card>
            <CardHeader>
              <CardTitle>Refine This Prompt</CardTitle>
            </CardHeader>
            <div className="p-4 pt-0 space-y-3">
              {refinements.map((r, i) => (
                <ChatBubble key={i} role={r.role} content={r.content} />
              ))}
              {refineAI.response && (
                <div>
                  <AIBlock response={refineAI.response} loading={refineAI.loading} error={refineAI.error} />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                  placeholder="e.g. Make it feel more luxury, Change setting to outdoors at dusk..."
                  className="flex-1 px-4 py-2.5 bg-navy-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
                <Button onClick={handleRefine} disabled={!refineInput.trim() || refineAI.loading} loading={refineAI.loading} size="sm">
                  Refine
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
