'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, Gift } from 'lucide-react';

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refCode = searchParams.get('ref') || '';
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (refCode) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tncc_referral_code', refCode.toUpperCase());
        document.cookie = `tncc_referral_code=${refCode.toUpperCase()}; path=/; max-age=2592000; SameSite=Lax`;
      }

      // Validate referral code
      fetch('/api/community/referrals/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referral_code: refCode }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid && data.referrer_name) {
            setReferrerName(data.referrer_name);
          }
        })
        .catch(() => {})
        .finally(() => setIsValidating(false));
    } else {
      setIsValidating(false);
    }
  }, [refCode]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#101318] flex flex-col justify-center items-center p-4 selection:bg-[#E84020] selection:text-white transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#1D2430] rounded-3xl border border-gray-200 dark:border-[#303846] shadow-xl p-8 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] to-[#FFB84D]" />

        <div className="w-16 h-16 rounded-2xl bg-[#0D2C5B]/5 dark:bg-white/10 border border-[#0D2C5B]/10 dark:border-[#303846] text-[#0D2C5B] dark:text-[#F5F7FA] flex items-center justify-center mx-auto shadow-inner">
          <Gift className="w-8 h-8 text-[#E84020]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Creator Invitation</span>
          </div>

          <h1 className="text-2xl font-black text-[#0D2C5B] dark:text-[#F5F7FA] tracking-tight">
            Join Tamil Nadu Creators Club
          </h1>

          {referrerName ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You were invited by <strong className="text-[#0D2C5B] dark:text-[#F5F7FA]">{referrerName}</strong> (Code:{' '}
              <span className="font-mono text-[#E84020] font-bold">{refCode.toUpperCase()}</span>)
            </p>
          ) : refCode ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Joining with referral code: <span className="font-mono text-[#E84020] font-bold">{refCode.toUpperCase()}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect with 500+ top designers, video editors, and animators across Tamil Nadu.
            </p>
          )}
        </div>

        <div className="bg-[#F8F6F1] dark:bg-[#171C24] p-4 rounded-2xl text-left space-y-2 border border-gray-100 dark:border-[#303846] text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 font-semibold text-[#0D2C5B] dark:text-[#F5F7FA]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Participate in high-stakes creative challenges</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-[#0D2C5B] dark:text-[#F5F7FA]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Showcase your portfolio to statewide agency recruiters</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-[#0D2C5B] dark:text-[#F5F7FA]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Earn verified XP and climb the Tamil Nadu Creator Leaderboard</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/signup${refCode ? `?ref=${encodeURIComponent(refCode.toUpperCase())}` : ''}`}
            className="w-full py-3.5 px-6 rounded-xl bg-[#0D2C5B] dark:bg-[#00B5C8] hover:bg-[#1B3F7E] dark:hover:bg-[#00B5C8]/80 text-white dark:text-[#101318] font-extrabold text-sm shadow-lg shadow-[#0D2C5B]/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Creator Account</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="text-[11px] text-gray-400">
          Already a TNCC member?{' '}
          <Link href="/login" className="text-[#0D2C5B] dark:text-[#00B5C8] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading invitation...</div>}>
      <JoinContent />
    </Suspense>
  );
}

