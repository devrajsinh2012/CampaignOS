import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppShell from './components/layout/AppShell';
import Spinner from './components/ui/Spinner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Planner from './pages/Planner';
import Consultant from './pages/Consultant';
import LearningHub from './pages/LearningHub';
import LearningTopic from './pages/LearningTopic';
// Phase 2
import CreativeStudio from './pages/CreativeStudio';
import AudienceBuilder from './pages/AudienceBuilder';
import PromptGenerator from './pages/PromptGenerator';
import FestivalPlanner from './pages/FestivalPlanner';
import NewsFeed from './pages/NewsFeed';
import PromptLibrary from './pages/PromptLibrary';
// Phase 3
import Forecasting from './pages/Forecasting';
import Experiments from './pages/Experiments';
import Competitive from './pages/Competitive';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/consultant" element={<Consultant />} />
        <Route path="/learn" element={<LearningHub />} />
        <Route path="/learn/:topicId" element={<LearningTopic />} />
        {/* Phase 2 */}
        <Route path="/creative" element={<CreativeStudio />} />
        <Route path="/audience" element={<AudienceBuilder />} />
        <Route path="/prompt-generator" element={<PromptGenerator />} />
        <Route path="/festival" element={<FestivalPlanner />} />
        <Route path="/news" element={<NewsFeed />} />
        <Route path="/prompts" element={<PromptLibrary />} />
        {/* Phase 3 */}
        <Route path="/forecasting" element={<Forecasting />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/competitive" element={<Competitive />} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
