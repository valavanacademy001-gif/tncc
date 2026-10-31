'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCommunity } from '@/tncc-community/lib/community-context';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Tag, 
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerMember, loginMember } = useCommunity();

  const initialMode = searchParams.get('mode') === 'register' || searchParams.get('mode') === 'signup' 
    ? 'signup' 
    : 'login';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [skills, setSkills] = useState('Graphic Design, Typography');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'register' || qMode === 'signup') {
      setMode('signup');
    } else if (qMode === 'login') {
      setMode('login');
    }
  }, [searchParams]);

  const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.some(
    (e) => e.toLowerCase() === email.trim().toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Email and password are required.');
          setLoading(false);
          return;
        }

        const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
        const newMember = registerMember({
          full_name: fullName.trim() || 'New Creator',
          username: username.trim() || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
          email: email.trim().toLowerCase(),
          password: password,
          location: location.trim(),
          skills: skillsList,
        });

        setSuccessMsg(`Welcome to TNCC, ${newMember.full_name}! Redirecting...`);
        setTimeout(() => {
          if (newMember.role === 'admin') {
            router.push('/community/admin');
          } else {
            router.push('/community');
          }
        }, 800);
      } else if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both your email/username and password.');
          setLoading(false);
          return;
        }

        const res = loginMember(email.trim().toLowerCase(), password);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials. Please verify your email and password.');
          setLoading(false);
          return;
        }

        setSuccessMsg(
          res.member?.role === 'admin' 
            ? '🛡️ Verified Administrator sign-in. Launching admin workspace...' 
            : `Welcome back, ${res.member?.full_name}! Launching community...`
        );

        setTimeout(() => {
          if (res.member?.role === 'admin') {
            router.push('/community/admin');
          } else {
            router.push('/community');
          }
        }, 700);
      } else {
        // Forgot password simulation
        setSuccessMsg('Password reset instructions sent to ' + email.trim());
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-8 bg-[#FAF8F5]">
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
          ← Return to Landing Page
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] to-[#00B5C8]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TNCC Creative Ecosystem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D2C5B] tracking-tight">
            {mode === 'signup'
              ? 'Join TNCC Creator Community'
              : mode === 'login'
              ? 'Sign In to Your Account'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-gray-500">
            {mode === 'signup'
              ? 'Earn XP, compete in challenges & showcase your portfolio across Tamil Nadu.'
              : mode === 'login'
              ? 'Enter your registered email and password to access your creator dashboard.'
              : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Administrator notification indicator */}
        {isAdminEmail && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2.5 text-xs text-amber-900 font-bold animate-pulse">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Authorized Administrator Email Detected. Full Admin Suite privileges will unlock on sign-in.</span>
          </div>
        )}

        {/* Form */}
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
                    placeholder="e.g. Your Name"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Creator Username</label>
                <div className="relative">
                  <span className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="w-full text-xs sm:text-sm pl-8 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location in Tamil Nadu</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Creative Skills (comma separated)</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="UI/UX, 3D Art, Video Editing"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {mode === 'signup' ? 'Email Address *' : 'Email Address or Username *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={mode === 'signup' ? 'email' : 'text'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
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
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#E84020] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>
              {loading
                ? 'Processing...'
                : mode === 'signup'
                ? 'Create Free Creator Account (+50 XP)'
                : mode === 'login'
                ? 'Sign In to Dashboard'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#0D2C5B] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#E84020] hover:underline cursor-pointer"
              >
                Join Free (+50 XP)
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommunityAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-gray-500">Loading TNCC Auth...</div>}>
      <AuthContent />
    </Suspense>
  );
}
