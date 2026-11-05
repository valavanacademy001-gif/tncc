'use client';

import React, { useState, useEffect } from 'react';
import { useCommunity } from '../../lib/community-context';
import { MemberReferralSummary, ReferralRecord } from '../../lib/types';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function ReferralDashboardView() {
  const { currentMember } = useCommunity();
  const [summary, setSummary] = useState<MemberReferralSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/community/referrals/me', {
        headers: currentMember?.id ? { 'x-tncc-member-id': currentMember.id } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch referral summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [currentMember?.id]);

  const referralCode = summary?.referral_code || `TNCC-${(currentMember?.username || 'CREATOR').toUpperCase()}`;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join?ref=${referralCode}`
    : summary?.share_url || `https://tncc.vercel.app/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Join Tamil Nadu Creators Club (TNCC) with me! Connect with top creators across TN and showcase your work: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `Join me on Tamil Nadu Creators Club (TNCC) — the home for Tamil designers, editors, and filmmakers across TN! #TNCC #TamilCreators ${shareUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Motivational Banner with TNCC Logo Theme Colors */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2C5B] via-[#10366d] to-[#081A3A] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        {/* Brand Theme Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0D2C5B] via-[#E84020] via-[#F5A623] to-[#00B5C8]" />

        {/* Ambient Brand Glowing Orbs */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-[#E84020]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-[#00B5C8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#F5A623]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-[#FFB84D] border border-[#FFB84D]/30 backdrop-blur-md shadow-xs">
            <Gift className="w-3.5 h-3.5 text-[#E84020]" />
            <span>Referral & Earn Program</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Invite your creative friends to TNCC.{' '}
            <span className="whitespace-nowrap">
              Earn{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FF5733] to-[#E84020] font-black drop-shadow-sm">
                +50 XP
              </span>
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
            Invite your creative friends to TNCC. Earn 50 XP when your friend completes their first approved creative activity (publishing their first approved showcase post or valid challenge entry).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[#00CDE0] border border-[#00B5C8]/25 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00CDE0] shrink-0" />
              <span>Verified Server-Side XP Ledger</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-emerald-300 border border-emerald-400/25 backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Anti-Fraud Protected</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[#FFB84D] border border-[#FFB84D]/25 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB84D] shrink-0" />
              <span>No Signup Farming</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shareable Code & Link Box with Brand Colors */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-5 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#E84020] to-[#FFB84D]" />
          <h3 className="font-black text-lg text-[#0D2C5B] tracking-tight">Your Shareable Referral Assets</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Permanent Code Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF8EC] via-[#FFF0ED]/40 to-white border border-[#FFB84D]/40 shadow-xs relative overflow-hidden group hover:border-[#E84020]/60 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E84020]/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold text-[#E84020] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E84020]" />
                  <span>Your Referral Code</span>
                </p>
                <p className="font-mono font-black text-2xl text-[#0D2C5B] tracking-wider mt-1">{referralCode}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0D2C5B] to-[#1B3F7E] hover:from-[#E84020] hover:to-[#FF5733] text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Copy referral code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Shareable Link Input with Quick Buttons */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#E6F9FC] via-[#E6F9FC]/30 to-white border border-[#00B5C8]/40 shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#00B5C8] transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00B5C8]/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <p className="text-[11px] font-extrabold text-[#00B5C8] uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#00B5C8]" />
                <span>Shareable Invitation Link</span>
              </p>
              <div className="mt-1 px-3 py-1.5 rounded-xl bg-white/90 border border-[#00B5C8]/25 font-mono text-xs text-[#0D2C5B] select-all truncate font-semibold">
                {shareUrl}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="flex-1 min-w-[120px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#E84020] to-[#FF5733] hover:from-[#d03517] hover:to-[#e84020] text-white font-extrabold text-xs transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="py-2 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTwitterShare}
                className="py-2 px-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Share on X / Twitter"
              >
                <span>X / Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Referral Metric Stats with Brand Theme Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invited - Cyan & Navy Accent */}
        <div className="bg-gradient-to-b from-[#E6F9FC]/60 to-white p-5 rounded-3xl border border-[#00B5C8]/30 border-t-4 border-t-[#00B5C8] shadow-xs space-y-1 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-[#0D2C5B]">
            <span className="text-xs font-black uppercase tracking-wider text-[#00B5C8]">Total Invited</span>
            <div className="w-8 h-8 rounded-xl bg-[#00B5C8]/15 text-[#00B5C8] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0D2C5B]">{summary?.total_invited || 0}</p>
          <p className="text-[11px] font-semibold text-gray-400">Members registered</p>
        </div>

        {/* Card 2: Pending Activity - Yellow/Amber Accent */}
        <div className="bg-gradient-to-b from-[#FFF8EC]/70 to-white p-5 rounded-3xl border border-[#F5A623]/30 border-t-4 border-t-[#F5A623] shadow-xs space-y-1 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-[#0D2C5B]">
            <span className="text-xs font-black uppercase tracking-wider text-[#F5A623]">Pending Activity</span>
            <div className="w-8 h-8 rounded-xl bg-[#F5A623]/15 text-[#F5A623] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#F5A623]">{summary?.pending_count || 0}</p>
          <p className="text-[11px] font-semibold text-gray-400">Awaiting 1st post/challenge</p>
        </div>

        {/* Card 3: Successful - Emerald Accent */}
        <div className="bg-gradient-to-b from-emerald-50/50 to-white p-5 rounded-3xl border border-emerald-500/30 border-t-4 border-t-emerald-500 shadow-xs space-y-1 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-[#0D2C5B]">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Successful</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{summary?.successful_count || 0}</p>
          <p className="text-[11px] font-semibold text-gray-400">Activity verified</p>
        </div>

        {/* Card 4: Referral XP Earned - Brand Orange Accent */}
        <div className="bg-gradient-to-b from-[#FFF0ED]/70 to-white p-5 rounded-3xl border border-[#E84020]/30 border-t-4 border-t-[#E84020] shadow-xs space-y-1 relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between text-[#0D2C5B]">
            <span className="text-xs font-black uppercase tracking-wider text-[#E84020]">Referral XP Earned</span>
            <div className="w-8 h-8 rounded-xl bg-[#E84020]/15 text-[#E84020] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84020] to-[#FF5733]">
            +{summary?.total_referral_xp || 0} XP
          </p>
          <p className="text-[11px] font-bold text-[#E84020]">Credited to your balance</p>
        </div>
      </div>

      {/* 4. Referral History Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#0D2C5B] to-[#00B5C8]" />
            <h3 className="font-black text-lg text-[#0D2C5B] tracking-tight">Your Invited Creators</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F8F6F1] text-[#0D2C5B] border border-gray-200">
            {summary?.history?.length || 0} Records
          </span>
        </div>

        {!summary?.history || summary.history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#FFB84D]/40 bg-gradient-to-b from-[#FFF8EC]/30 to-white rounded-2xl p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFF0ED] to-[#FFF8EC] text-[#E84020] border border-[#FFB84D]/40 flex items-center justify-center mx-auto shadow-xs">
              <Gift className="w-7 h-7" />
            </div>
            <h4 className="font-black text-base text-[#0D2C5B]">No referrals yet</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Share your invite link with talented Tamil creators. Once they publish their first creative post or submit to a challenge, you will automatically earn <span className="font-bold text-[#E84020]">+50 XP</span>!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {summary.history.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between text-xs gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-[#0D2C5B] truncate">{item.referred_member_name || 'Invited Creator'}</p>
                  <p className="text-[11px] text-gray-400">
                    Joined on {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'rewarded' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>+50 XP Rewarded ({item.qualifying_activity_type || 'activity'})</span>
                    </span>
                  ) : item.status === 'pending_activity' ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending 1st Activity</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-600" />
                      <span>Rejected</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Rules & Anti-Fraud Notice with Logo Palette */}
      <div className="bg-gradient-to-br from-[#FFF8EC] via-white to-[#FFF0ED]/40 border border-[#F5A623]/35 rounded-2xl p-5 text-xs text-[#8A5000] space-y-2 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#E84020] via-[#F5A623] to-[#00B5C8]" />
        <div className="flex items-center gap-2 font-black text-sm text-[#0D2C5B]">
          <AlertCircle className="w-4 h-4 text-[#E84020]" />
          <span>TNCC Referral & Earn Policy</span>
        </div>
        <p className="leading-relaxed text-gray-700">
          • Referral reward is awarded <strong>only once per referred member</strong> when they successfully publish their first approved creative post or complete a challenge entry.
        </p>
        <p className="leading-relaxed text-gray-700">
          • <strong>Zero XP is awarded at signup</strong> to prevent automated bot farming. Self-referrals and duplicate accounts are strictly disqualified.
        </p>
      </div>
    </div>
  );
}

