'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCommunity } from '@/tncc-community/lib/community-context';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';
import { createClient } from '@/lib/supabase/client';
import ThemeToggle from '@/components/theme/ThemeToggle';
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
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setResending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      if (error) {
        setErrorMsg(`Failed to resend confirmation: ${error.message}`);
      } else {
        setSuccessMsg('Confirmation email resent! Please check your inbox (and Spam folder).');
        setErrorMsg('');
      }
    } catch (err: any) {
      setErrorMsg(`Failed to resend confirmation: ${err.message || 'Unknown error'}`);
    } finally {
      setResending(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
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

        if (password.length < 8) {
          setErrorMsg('Password must be at least 8 characters.');
          setLoading(false);
          return;
        }

        const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
        const res = await registerMember({
          full_name: fullName.trim() || 'New Creator',
          username: username.trim() || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_'),
          email: email.trim().toLowerCase(),
          password: password,
          location: location.trim(),
          skills: skillsList,
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed. Please check your details.');
          setLoading(false);
          return;
        }

        if (res.session) {
          setSuccessMsg(`Welcome to TNCC, ${res.member?.full_name || 'Creator'}! Launching community...`);
          setTimeout(() => {
            const nextUrl = searchParams.get('next');
            if (nextUrl) {
              router.push(nextUrl);
            } else if (res.member?.role === 'admin') {
              router.push('/community/admin');
            } else {
              router.push('/community');
            }
          }, 800);
        } else {
          // Email confirmation is enabled in Supabase
          setSuccessMsg('Account created successfully! Please check your email to confirm your account before logging in.');
          setLoading(false);
        }
      } else if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both your email/username and password.');
          setLoading(false);
          return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        const res = await loginMember(cleanEmail, cleanPassword);
        if (!res.success) {
          const isEmailNotConfirmed = res.error?.toLowerCase().includes('not confirmed');
          setErrorMsg(
            isEmailNotConfirmed
              ? 'Email not confirmed. Please check your inbox or click resend.'
              : res.error || 'Invalid username, email, or password. Please verify your credentials.'
          );
          setLoading(false);
          return;
        }

        const isUserAdmin =
          res.member?.role === 'admin' ||
          cleanEmail === 'suganeshsugu07@gmail.com' ||
          cleanEmail === 'suganeshsugu07@gmailcom';

        if (typeof window !== 'undefined') {
          localStorage.setItem('tncc_active_user_email', cleanEmail);
          if (res.member?.id) {
            localStorage.setItem('tncc_current_member_id', res.member.id);
          }
          document.cookie = `tncc_active_user_email=${cleanEmail}; path=/; max-age=604800; SameSite=Lax`;
          if (res.member?.id) {
            document.cookie = `tncc_member_id=${res.member.id}; path=/; max-age=604800; SameSite=Lax`;
          }
          if (isUserAdmin) {
            localStorage.setItem('tncc_admin_session', 'true');
            document.cookie = `tncc_admin_session=true; path=/; max-age=604800; SameSite=Lax`;
          }
        }

        // Establish HTTP session cookies on server for mobile WebKit & Edge Middleware
        try {
          await fetch('/api/community/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              memberId: res.member?.id,
              isAdmin: isUserAdmin,
            }),
          });
        } catch (sessionErr) {
          console.warn('Session cookie sync error:', sessionErr);
        }

        setSuccessMsg(
          isUserAdmin 
            ? '🛡️ Verified Administrator sign-in. Launching admin workspace...' 
            : `Welcome back, ${res.member?.full_name || 'Creator'}! Launching community...`
        );

        setTimeout(() => {
          const nextUrl = searchParams.get('next');
          const targetUrl = nextUrl || (isUserAdmin ? '/community/admin' : '/community');
          if (typeof window !== 'undefined') {
            window.location.href = targetUrl;
          } else {
            router.push(targetUrl);
          }
        }, 350);
      } else {
        // Real Supabase password reset
        if (!email.trim()) {
          setErrorMsg('Please enter your email address to receive reset instructions.');
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

        if (resetError) {
          setErrorMsg(resetError.message);
          setLoading(false);
          return;
        }

        setSuccessMsg('Password reset instructions sent to ' + email.trim() + '. Please check your inbox.');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
        }, 4000);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-8 bg-[#FAF8F5] dark:bg-[#101318] transition-colors">
      {/* Brand, Return Link & Theme Toggle */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
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
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-gray-500 hover:text-[#0D2C5B] dark:text-gray-400 dark:hover:text-[#00B5C8] transition-colors"
        >
          ← Return to Landing Page
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1D2430] rounded-3xl border border-gray-200/80 dark:border-[#303846] shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden transition-colors">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] to-[#00B5C8]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TNCC Creative Ecosystem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA] tracking-tight">
            {mode === 'signup'
              ? 'Join TNCC Creator Community'
              : mode === 'login'
              ? 'Sign In to Your Account'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {mode === 'signup'
              ? 'Earn XP, compete in challenges & showcase your portfolio across Tamil Nadu.'
              : mode === 'login'
              ? 'Enter your registered email and password to access your creator dashboard.'
              : 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.toLowerCase().includes('not confirmed') && (
              <div className="pt-1.5 flex items-center justify-between border-t border-red-200/70 text-[11px]">
                <span className="text-gray-600">Haven't verified your email yet?</span>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="font-bold text-[#E84020] hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {resending ? 'Sending...' : 'Resend Confirmation Email'}
                </button>
              </div>
            )}
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
          <div className="py-1 px-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-full inline-flex items-center gap-1.5 text-[11px] text-amber-900 dark:text-amber-300 font-semibold mx-auto self-center shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Authorized Admin Account</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Creator Username</label>
                <div className="relative">
                  <span className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full text-xs sm:text-sm pl-8 pr-4 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Location in Tamil Nadu</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location (e.g. Chennai, Tamil Nadu)"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Creative Skills (comma separated)</label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Enter your skills (e.g. Graphic Design, UI/UX, 3D Art)"
                    className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {mode === 'signup' ? 'Email Address *' : 'Email Address or Username *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={mode === 'signup' ? 'email' : 'text'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signup' ? 'Enter your email' : 'Enter your email or username'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="email"
                className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#E84020] font-semibold hover:underline cursor-pointer"
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
                  placeholder="Enter your password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 bg-[#F8F6F1] dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-xl border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md touch-manipulation flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-[#303846]">
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
                className="font-bold text-[#0D2C5B] dark:text-[#00B5C8] hover:underline cursor-pointer"
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
