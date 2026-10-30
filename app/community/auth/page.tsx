'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCommunity } from '@/tncc-community/lib/community-context';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Lock, Mail, User } from 'lucide-react';

export default function CommunityAuthPage() {
  const router = useRouter();
  const { updateProfile } = useCommunity();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [skills, setSkills] = useState('Graphic Design, Typography');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      updateProfile({
        full_name: fullName.trim() || 'New Creator',
        username: username.trim() || `creator_${Date.now().toString().slice(-4)}`,
        location: location.trim(),
        skills: skillsList,
        total_xp: 50, // Starting welcome XP
      });
      router.push('/community');
    } else if (mode === 'login') {
      router.push('/community');
    } else {
      alert('Password reset instructions sent to your email.');
      setMode('login');
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-8">
      {/* Brand & Return Link */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/logo.webp"
            alt="Tamil Nadu Creators Club"
            width={160}
            height={44}
            style={{ objectFit: 'contain', height: 'auto', maxHeight: '42px', width: 'auto' }}
            priority
          />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-gray-500 hover:text-[#0D2C5B] transition-colors"
        >
          ← Return to Website
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] to-[#00B5C8]" />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free Creator Access</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D2C5B] tracking-tight">
            {mode === 'signup'
              ? 'Join TNCC Creator Community'
              : mode === 'login'
              ? 'Welcome Back Creator'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-gray-500">
            {mode === 'signup'
              ? 'Earn XP, compete in challenges & showcase your portfolio across Tamil Nadu.'
              : 'Enter your credentials to access your member dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Senthil Nathan"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Creator Username *</label>
                <div className="relative">
                  <span className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="senthil_visuals"
                    className="w-full text-xs sm:text-sm pl-8 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location in Tamil Nadu</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Madurai, Tamil Nadu"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Creative Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Poster Design, DaVinci Resolve, 3D"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@tncc.in"
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#E84020] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>
              {mode === 'signup'
                ? 'Create Free Creator Account (+50 XP)'
                : mode === 'login'
                ? 'Sign In to Community'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {mode === 'signup' ? (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-[#0D2C5B] hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Need an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-[#E84020] hover:underline"
              >
                Create Free Member Profile
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
