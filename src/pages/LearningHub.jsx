import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Radio,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Card from '../components/ui/Card';
import useStore from '../store/store';
import { CURRICULUM } from '../lib/constants';

const TRACK_ICONS = {
  foundations: BookOpen,
  channels: Radio,
  strategy: Target,
  analytics: BarChart3,
};

export default function LearningHub() {
  const navigate = useNavigate();
  const completedTopics = useStore((s) => s.completedTopics);

  const getTrackProgress = (track) => {
    const completed = track.topics.filter((t) => completedTopics.includes(t.id)).length;
    return { completed, total: track.topics.length, percent: Math.round((completed / track.topics.length) * 100) };
  };

  const totalCompleted = completedTopics.length;
  const totalTopics = CURRICULUM.reduce((acc, t) => acc + t.topics.length, 0);
  const overallPercent = Math.round((totalCompleted / totalTopics) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-amber-500/15 rounded-xl flex items-center justify-center">
              <GraduationCap size={18} className="text-amber-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-100">
              Learning Hub
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            Master digital marketing with AI-powered lessons, quizzes, and structured tracks.
          </p>
        </div>
      </div>

      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-teal-500/5 border-amber-500/20">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg width="80" height="80" className="-rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="32" fill="none" stroke="#F59E0B"
                strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={(1 - overallPercent / 100) * 2 * Math.PI * 32}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-display font-bold text-amber-400">{overallPercent}%</span>
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-100">Your Progress</h2>
            <p className="text-sm text-slate-400">
              {totalCompleted} of {totalTopics} topics completed
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {totalCompleted === 0
                ? 'Start your first lesson to begin tracking!'
                : totalCompleted === totalTopics
                ? 'Congratulations! You completed all topics!'
                : 'Keep going — consistency beats intensity.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CURRICULUM.map((track) => {
          const Icon = TRACK_ICONS[track.id] || BookOpen;
          const progress = getTrackProgress(track);

          return (
            <Card key={track.id} className="hover:border-slate-600 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-slate-100">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {progress.completed}/{progress.total} completed
                  </p>
                </div>
                <span className="text-sm font-mono text-amber-400">{progress.percent}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-700/50 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              {/* Topics */}
              <div className="space-y-1">
                {track.topics.map((topic) => {
                  const done = completedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => navigate(`/learn/${topic.id}`)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left 
                        transition-all cursor-pointer group
                        ${done
                          ? 'bg-teal-500/5 text-teal-400'
                          : 'text-slate-400 hover:bg-navy-800/50 hover:text-slate-200'
                        }`}
                    >
                      {done ? (
                        <CheckCircle2 size={16} className="text-teal-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      <span className="flex-1 font-medium">{topic.title}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock size={12} />
                        {topic.time}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-slate-600 group-hover:text-teal-400 transition-colors"
                      />
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
