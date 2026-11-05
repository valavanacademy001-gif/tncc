'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strength = passwordStrength();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/community/auth?mode=login');
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-8 bg-[#FAF8F5]">
      {/* Brand */}
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
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] to-[#00B5C8]" />

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#0D2C5B]">Password Updated Successfully!</h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Your new password is now active. You are being redirected to the login page...
            </p>
            <Link
              href="/community/auth?mode=login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E84020] hover:underline pt-2"
            >
              <span>Click here to sign in immediately</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0D2C5B] tracking-tight">
                Set New Password
              </h1>
              <p className="text-xs text-gray-500">
                Choose a strong password with at least 8 characters to secure your creator account.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#F8F6F1] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: step <= strength ? strengthColors[strength] : '#E5E7EB',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[10px] font-semibold text-right"
                      style={{ color: strengthColors[strength] }}
                    >
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#F8F6F1] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link
                href="/community/auth?mode=login"
                className="text-xs text-gray-500 hover:text-[#0D2C5B] transition-colors"
              >
                ← Return to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

