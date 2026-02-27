import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppShell from './components/layout/AppShell';
import Spinner from './components/ui/Spinner';

// Pages (lazy could be used later)
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import Planner from './pages/Planner';
import Consultant from './pages/Consultant';
import LearningHub from './pages/LearningHub';
import LearningTopic from './pages/LearningTopic';

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
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
