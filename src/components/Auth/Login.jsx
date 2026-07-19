import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import SEO from '../SEO';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-brand-primary px-4">
      <SEO 
        title="Customer Login | Annamalaiyar Recovery & Towing"
        description="Log in to your Annamalaiyar Recovery & Towing customer account to request vehicle towing or manage your roadside assistance requests."
      />
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-text-secondary text-sm">
            Sign in to your customer account to submit verified reviews.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
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
                placeholder="you@example.com"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-accent hover:text-accent-hover transition">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 cursor-pointer transition-all duration-200"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

        </form>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-text-secondary border-t border-white/5 pt-6 space-y-3">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-accent hover:text-accent-hover transition">
              Create Account
            </Link>
          </p>
          <p>
            Are you an administrator?{' '}
            <Link to="/admin/login" className="font-bold text-white hover:text-accent transition">
              Admin Gateway
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Login;
