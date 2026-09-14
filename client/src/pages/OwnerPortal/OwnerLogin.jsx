import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Zap, ArrowRight } from 'lucide-react';

export default function OwnerLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@theevnetwork.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('voltdrives_owner_token', data.token);
        localStorage.setItem('voltdrives_owner_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error to newsroom server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#121622] rounded-3xl p-8 border border-[#263147] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#00aeef] flex items-center justify-center mx-auto text-black shadow-lg shadow-cyan-950/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Owner &amp; Editorial Suite
          </h2>
          <p className="text-xs text-gray-400">
            Sign in to manage autonomous agents, publish newsletters, and monitor SEO syndication.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Owner Email</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#252c3d] rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#252c3d] rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-950/40 flex items-center justify-center space-x-2">
            <span>{loading ? 'Authenticating...' : 'Access Command Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Hint Box */}
        <div className="bg-[#171c2a] p-3.5 rounded-xl border border-[#232d42] text-[11px] text-gray-400 space-y-1">
          <div className="font-bold text-gray-300 flex items-center">
            <Zap className="w-3 h-3 text-yellow-400 mr-1" />
            Default Demo Credentials Seeded:
          </div>
          <div className="font-mono text-gray-400">
            Email: <span className="text-white">admin@theevnetwork.com</span><br/>
            Password: <span className="text-white">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
