import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import SEO from '../SEO';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request token, 2 = reset password
  const [debugCode, setDebugCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request reset token
  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        if (data.debugCode) {
          setDebugCode(data.debugCode);
        }
        setStep(2); // Move to password resetting form
      } else {
        setError(data.message || 'Email not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      setError('Please fill in all recovery fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Password reset successfully! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Invalid or expired token.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-brand-primary px-4">
      <SEO 
        title="Reset Password | Annamalaiyar Recovery & Towing"
        description="Reset your customer account password for Annamalaiyar Recovery & Towing to continue booking 24/7 towing services."
      />
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold text-white mb-2">
            Reset Password
          </h2>
          <p className="text-text-secondary text-sm">
            {step === 1
              ? 'Request a secure code to reset your account password.'
              : 'Enter the verification code and set your new password.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success / Debug Notification */}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex flex-col gap-2 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{success}</span>
            </div>
            {debugCode && (
              <div className="bg-brand-primary/80 border border-white/5 p-3 rounded-lg mt-2 text-center">
                <p className="text-xs text-text-secondary mb-1">Development Verification Code:</p>
                <code className="text-lg font-mono font-bold text-accent tracking-widest">{debugCode}</code>
              </div>
            )}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Request Code */
          <form onSubmit={handleRequestToken} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-text-muted"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 cursor-pointer transition-all duration-200"
            >
              {loading ? <span>Generating Token...</span> : <span>Send Reset Code</span>}
            </button>
          </form>
        ) : (
          /* Step 2: Reset Password with Token */
          <form onSubmit={handleResetPassword} className="space-y-4">
            
            {/* Token */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="token" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Verification Code
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted font-mono tracking-widest text-center"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 cursor-pointer transition-all duration-200"
            >
              {loading ? (
                <span>Resetting Password...</span>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Reset Password
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-text-muted hover:text-white transition py-2"
            >
              ← Go back / Change email
            </button>

          </form>
        )}

        <div className="mt-8 text-center text-sm text-text-secondary border-t border-white/5 pt-6">
          <Link to="/login" className="font-bold text-white hover:text-accent transition">
            Back to Sign In
          </Link>
        </div>

      </div>
    </main>
  );
};

export default ForgotPassword;
