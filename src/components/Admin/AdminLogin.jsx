import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, LogIn, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminLogin(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Database link error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-brand-primary px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-danger/5 to-transparent pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-danger/10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-danger/10 text-danger rounded-xl flex items-center justify-center mx-auto mb-4 border border-danger/20">
            <Shield size={28} />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-white mb-2">
            Admin Gateway
          </h2>
          <p className="text-text-secondary text-sm">
            Access the administrator dashboard to moderate reviews and view enquiries.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-start gap-3 mb-6">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Admin Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-brand-secondary border border-white/10 hover:border-white/20 focus:border-danger focus:ring-1 focus:ring-danger rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-text-muted transition duration-200 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-secondary border border-white/10 hover:border-white/20 focus:border-danger focus:ring-1 focus:ring-danger rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-text-muted transition duration-200 outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-danger hover:bg-danger-hover disabled:bg-danger/60 text-white font-bold py-4 rounded-xl shadow-lg shadow-danger/15 cursor-pointer transition-all duration-200"
          >
            {loading ? (
              <span>Authorizing Admin...</span>
            ) : (
              <>
                <LogIn size={18} />
                Access Dashboard
              </>
            )}
          </button>

        </form>

      </div>
    </main>
  );
};

export default AdminLogin;
