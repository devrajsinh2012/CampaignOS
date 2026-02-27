import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Map,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  Zap,
  TrendingUp,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import useStore from '../store/store';
import { getGreeting } from '../lib/utils';

const QUICK_ACTIONS = [
  {
    to: '/analyzer',
    icon: Search,
    title: 'Analyze Campaign',
    desc: 'Paste your campaign details and get expert AI analysis',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  {
    to: '/planner',
    icon: Map,
    title: 'Plan Campaign',
    desc: 'Build a complete strategy with budget allocation',
    color: 'text-teal-400',
    bg: 'bg-teal-500/15',
  },
  {
    to: '/consultant',
    icon: MessageSquare,
    title: 'Ask Consultant',
    desc: 'Get expert marketing advice from AI consultant',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
  },
  {
    to: '/learn',
    icon: GraduationCap,
    title: 'Learning Hub',
    desc: 'Master digital marketing with structured courses',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
];

const ONBOARDING_STEPS = [
  { id: 'analyze', label: 'Analyze your first campaign', to: '/analyzer', icon: Search },
  { id: 'plan', label: 'Create a campaign plan', to: '/planner', icon: Map },
  { id: 'chat', label: 'Ask the AI Consultant', to: '/consultant', icon: MessageSquare },
  { id: 'learn', label: 'Complete a learning topic', to: '/learn', icon: GraduationCap },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { savedAnalyses, savedPlans, completedTopics, aiCallsToday } = useStore();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Marketer';

  // Track onboarding completion
  const completedSteps = [
    savedAnalyses.length > 0 ? 'analyze' : null,
    savedPlans.length > 0 ? 'plan' : null,
    aiCallsToday > 0 ? 'chat' : null,
    completedTopics.length > 0 ? 'learn' : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-100">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-slate-400 mt-1">
            Your AI-powered marketing command centre is ready.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-navy-800/50 border border-slate-700/50 rounded-xl px-4 py-2">
          <Zap size={16} className="text-teal-400" />
          <span className="text-sm text-slate-300">
            <span className="text-teal-400 font-mono font-bold">{aiCallsToday}</span>/15 AI calls today
          </span>
        </div>
      </div>

      {/* Onboarding Checklist */}
      {completedSteps.length < 4 && (
        <Card className="border-teal-500/20 bg-teal-500/5">
          <CardHeader>
            <CardTitle>
              <Sparkles size={18} className="inline mr-2 text-teal-400" />
              Getting Started
            </CardTitle>
            <span className="text-sm text-teal-400 font-mono">
              {completedSteps.length}/4
            </span>
          </CardHeader>
          <div className="grid gap-2">
            {ONBOARDING_STEPS.map((step) => {
              const done = completedSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => navigate(step.to)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer
                    ${done
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'bg-navy-800/30 text-slate-400 hover:bg-navy-800/50 hover:text-slate-200'
                    }`}
                >
                  <step.icon size={18} />
                  <span className={`text-sm font-medium flex-1 ${done ? 'line-through' : ''}`}>
                    {step.label}
                  </span>
                  {done ? (
                    <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">Done</span>
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-lg text-slate-100 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.to}
              onClick={() => navigate(action.to)}
              className="group flex items-start gap-4 bg-navy-800/40 border border-slate-700/40 
                rounded-2xl p-5 text-left transition-all duration-200 
                hover:border-slate-600 hover:bg-navy-800/60 cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center flex-shrink-0`}>
                <action.icon size={20} className={action.color} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-slate-100 group-hover:text-teal-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-600 group-hover:text-teal-400 mt-1 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Analyses</p>
          <p className="text-2xl font-display font-bold text-slate-100 mt-1">{savedAnalyses.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Plans</p>
          <p className="text-2xl font-display font-bold text-slate-100 mt-1">{savedPlans.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Topics Learned</p>
          <p className="text-2xl font-display font-bold text-slate-100 mt-1">{completedTopics.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Calls Today</p>
          <p className="text-2xl font-display font-bold text-teal-400 mt-1">{aiCallsToday}</p>
        </Card>
      </div>

      {/* Pro tip */}
      <Card className="bg-gradient-to-r from-navy-800/60 to-teal-500/5 border-teal-500/10">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-200">Pro Tip</p>
            <p className="text-sm text-slate-400 mt-0.5">
              Start by analyzing a running campaign with the Campaign Analyzer. Then use the AI Consultant to ask follow-up questions about the results. Your campaign context carries across features automatically.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
