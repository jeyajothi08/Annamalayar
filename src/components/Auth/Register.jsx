import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(name, email, phone, password, confirmPassword);
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.message || 'Registration failed. Try a different email.');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-28 pb-16 bg-brand-primary px-4">
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/5 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold text-white mb-2">
            Create Account
          </h2>
          <p className="text-text-secondary text-sm">
            Sign up to post verified reviews for Annamalaiyar Towing.
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
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Porkoti Annamalai"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                placeholder="porkoti@example.com"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 95855 87999"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full bg-brand-secondary input-field rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-text-muted"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-brand-primary font-bold py-4 rounded-xl shadow-lg shadow-accent/15 mt-2 cursor-pointer transition-all duration-200"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>

        </form>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-text-secondary border-t border-white/5 pt-6">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent hover:text-accent-hover transition">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Register;
