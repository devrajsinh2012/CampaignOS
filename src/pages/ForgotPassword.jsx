import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
            <Zap size={22} className="text-navy-900" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-100">
            Campaign<span className="text-teal-400">OS</span>
          </h1>
        </div>

        <div className="bg-navy-900/80 border border-slate-700/50 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl text-slate-100 mb-2">
                Check your email
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                We sent password reset instructions to <strong className="text-slate-200">{email}</strong>
              </p>
              <Link to="/login" className="text-teal-400 hover:text-teal-300 text-sm font-medium">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display font-bold text-xl text-slate-100 mb-1">
                Reset your password
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Enter your email and we'll send you reset instructions
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-slate-400 hover:text-slate-300 inline-flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
