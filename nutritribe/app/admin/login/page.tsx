'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Invalid username or password.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #120601 0%, #1a0e0a 50%, #0a0200 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.08) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(253,251,247,0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(243,162,19,0.15)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'rgba(243,162,19,0.1)' }}>
            <div className="relative w-36 h-10 mx-auto mb-4">
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(243,162,19,0.1)', border: '1px solid rgba(243,162,19,0.2)' }}>
              <Lock size={10} style={{ color: '#f3a213' }} />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(243,162,19,0.7)' }}>
                Admin Access
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'rgba(253,251,247,0.9)' }}>
              Sign In
            </h1>
            <p className="font-body text-xs mt-1" style={{ color: 'rgba(253,251,247,0.35)' }}>
              Company access only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            <div>
              <label className="block font-body text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(253,251,247,0.45)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="nutritribe_admin"
                autoComplete="username"
                required
                className="w-full font-body text-sm rounded-xl px-4 py-3 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(243,162,19,0.15)',
                  color: 'rgba(253,251,247,0.9)',
                  caretColor: '#f3a213',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(243,162,19,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(243,162,19,0.15)')}
              />
            </div>

            <div>
              <label className="block font-body text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(253,251,247,0.45)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full font-body text-sm rounded-xl px-4 py-3 pr-11 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(243,162,19,0.15)',
                    color: 'rgba(253,251,247,0.9)',
                    caretColor: '#f3a213',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(243,162,19,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(243,162,19,0.15)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgba(243,162,19,0.4)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="font-body text-xs text-red-400 bg-red-900/20 border border-red-500/20 px-3 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-xl transition-all disabled:opacity-80 mt-2"
              style={{ background: '#f3a213', color: '#050100' }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={14} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>

        <p className="text-center font-body text-[10px] mt-5" style={{ color: 'rgba(243,162,19,0.25)' }}>
          NutriTribe Admin · Secured access
        </p>
      </motion.div>
    </div>
  );
}
