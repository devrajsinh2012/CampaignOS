import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageSquare,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AIBlock from '../components/ai/AIBlock';
import ChipSelector from '../components/ui/ChipSelector';
import { useAI } from '../hooks/useAI';
import useStore from '../store/store';
import { CURRICULUM, EXPERIENCE_LEVELS } from '../lib/constants';
import { LEARNING_SYSTEM_PROMPT, QUIZ_SYSTEM_PROMPT } from '../lib/prompts';

export default function LearningTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // Find topic in curriculum
  let topic = null;
  let track = null;
  for (const t of CURRICULUM) {
    const found = t.topics.find((tp) => tp.id === topicId);
    if (found) {
      topic = found;
      track = t;
      break;
    }
  }

  const [level, setLevel] = useState('intermediate');
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const { response, loading, error, streamResponse } = useAI();
  const { response: quizResponse, loading: quizLoading, streamResponse: streamQuiz } = useAI();

  const { completedTopics, markTopicComplete } = useStore();
  const isCompleted = completedTopics.includes(topicId);

  // Generate content on mount or level change
  const generateContent = useCallback(async () => {
    if (!topic) return;
    await streamResponse('learn', {
      systemPrompt: LEARNING_SYSTEM_PROMPT,
      userMessage: `Topic: ${topic.title}\nExperience Level: ${level}\n\nGenerate comprehensive educational content for this digital marketing topic. Adapt depth and vocabulary to the ${level} level.`,
    });
  }, [topic, level]);

  useEffect(() => {
    generateContent();
  }, [topicId, level]);

  // Generate quiz
  const handleStartQuiz = async () => {
    setShowQuiz(true);
    setQuizData(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);

    await streamQuiz('quiz', {
      systemPrompt: QUIZ_SYSTEM_PROMPT,
      userMessage: `Generate a quiz about: ${topic.title}\nDifficulty level: ${level}`,
    });
  };

  // Parse quiz JSON from response
  useEffect(() => {
    if (quizResponse && !quizLoading) {
      try {
        // Extract JSON from response
        const jsonMatch = quizResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setQuizData(parsed);
        }
      } catch {
        // If JSON parsing fails, that's ok
      }
    }
  }, [quizResponse, quizLoading]);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const quizScore = quizData
    ? Object.keys(selectedAnswers).filter(
        (i) => selectedAnswers[i] === quizData.questions[i]?.correct
      ).length
    : 0;

  if (!topic) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Topic not found.</p>
        <Link to="/learn" className="text-teal-400 hover:text-teal-300 mt-2 inline-block">
          Back to Learning Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-3 cursor-pointer transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Learning Hub
        </button>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
              {track.title}
            </p>
            <h1 className="font-display font-bold text-2xl text-slate-100">
              {topic.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={12} />
                {topic.time}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full
                  ${topic.difficulty === 'Beginner'
                    ? 'bg-green-500/15 text-green-400'
                    : topic.difficulty === 'Intermediate'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-red-500/15 text-red-400'
                  }`}
              >
                {topic.difficulty}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs text-teal-400">
                  <CheckCircle2 size={12} />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Level Selector */}
      <Card>
        <p className="text-sm font-medium text-slate-300 mb-2">Adjust content depth:</p>
        <ChipSelector
          options={EXPERIENCE_LEVELS}
          selected={level}
          onChange={setLevel}
        />
      </Card>

      {/* Content */}
      <AIBlock content={response} loading={loading} error={error} />

      {/* Actions */}
      {response && !loading && (
        <div className="flex flex-wrap items-center gap-3">
          {!isCompleted && (
            <Button onClick={() => markTopicComplete(topicId)}>
              <CheckCircle2 size={14} />
              Mark as Complete
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleStartQuiz}
            loading={quizLoading}
          >
            <Trophy size={14} />
            {showQuiz ? 'Retake Quiz' : 'Take Knowledge Quiz'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/consultant');
            }}
          >
            <MessageSquare size={14} />
            Go Deeper with Consultant
          </Button>
        </div>
      )}

      {/* Quiz Section */}
      {showQuiz && (
        <Card className="border-amber-500/20">
          <h2 className="font-display font-bold text-lg text-slate-100 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            Knowledge Check
          </h2>

          {quizLoading && !quizData && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <RefreshCw size={14} className="animate-spin" />
              Generating quiz questions...
            </div>
          )}

          {quizData && (
            <div className="space-y-6">
              {quizData.questions.map((q, qi) => (
                <div key={qi} className="space-y-2">
                  <p className="text-sm font-semibold text-slate-200">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5 pl-4">
                    {Object.entries(q.options).map(([letter, text]) => {
                      const isSelected = selectedAnswers[qi] === letter;
                      const isCorrect = quizSubmitted && letter === q.correct;
                      const isWrong = quizSubmitted && isSelected && letter !== q.correct;

                      return (
                        <button
                          key={letter}
                          onClick={() => {
                            if (quizSubmitted) return;
                            setSelectedAnswers((prev) => ({ ...prev, [qi]: letter }));
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer
                            ${isCorrect
                              ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                              : isWrong
                              ? 'bg-red-500/15 border border-red-500/40 text-red-300'
                              : isSelected
                              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                              : 'bg-navy-900/50 border border-slate-700/50 text-slate-400 hover:border-slate-600'
                            }`}
                          disabled={quizSubmitted}
                        >
                          <span className="font-mono font-bold mr-2">{letter}.</span>
                          {text}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="text-xs text-slate-400 pl-4 mt-1">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length < quizData.questions.length}
                >
                  Submit Answers
                </Button>
              ) : (
                <Card className={`${quizScore >= 4 ? 'border-teal-500/30 bg-teal-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                  <p className="text-lg font-display font-bold text-slate-100">
                    Score: {quizScore}/{quizData.questions.length}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {quizScore === quizData.questions.length
                      ? 'Perfect score! You nailed it.'
                      : quizScore >= 4
                      ? 'Great job! Review the explanations above for the ones you missed.'
                      : 'Good effort! Review the topic content and try again.'}
                  </p>
                </Card>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
