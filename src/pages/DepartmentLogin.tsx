import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, User, Key, Globe } from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function DepartmentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold rounded-3xl text-white shadow-xl mb-6 shadow-brand-gold/20">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 italic serif">Authority Access</h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Department Intelligence Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center space-x-2">
              <Lock size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@iks-smartcity.gov"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-brand-gold outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Passphrase</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-brand-gold outline-none transition-colors"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-gold text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand-gold/10 hover:shadow-brand-gold/20 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize Protocol</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center">
             <button 
              onClick={handleGoogleLogin}
              className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors"
             >
                <div className="p-2 border border-slate-700 rounded-full">
                  <Globe size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Sign in with Neural ID</span>
             </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
          Global Sustainable Governance Grid • 2026
        </p>
      </motion.div>
    </div>
  );
}
