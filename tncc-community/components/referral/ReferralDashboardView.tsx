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
      {/* 1. Motivational Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D2C5B] via-[#1B3F7E] to-[#0D2C5B] text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E84020]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FFB84D]/20 text-[#FFB84D] border border-[#FFB84D]/30">
            <Gift className="w-3.5 h-3.5" />
            <span>Referral & Earn Program</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Invite your creative friends to TNCC. Earn <span className="text-[#FFB84D]">+50 XP</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
            Invite your creative friends to TNCC. Earn 50 XP when your friend completes their first approved creative activity (publishing their first approved showcase post or valid challenge entry).
          </p>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#FFB84D] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Server-Side XP Ledger · Anti-Fraud Protected · No Signup Farming</span>
          </div>
        </div>
      </div>

      {/* 2. Shareable Code & Link Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-extrabold text-base text-[#0D2C5B]">Your Shareable Referral Assets</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Permanent Code Card */}
          <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Your Referral Code</p>
              <p className="font-mono font-black text-xl text-[#0D2C5B] tracking-wider mt-0.5">{referralCode}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2.5 rounded-xl bg-white text-[#0D2C5B] hover:bg-[#0D2C5B] hover:text-white border border-gray-200 transition-all shadow-xs"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Shareable Link Input with Quick Buttons */}
          <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-gray-200 flex flex-col justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Shareable Invitation Link</p>
              <p className="text-xs font-mono text-gray-700 truncate mt-0.5">{shareUrl}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTwitterShare}
                className="py-1.5 px-3 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                title="Share on X / Twitter"
              >
                <span>X / Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Referral Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Invited</span>
            <Users className="w-4 h-4 text-[#0D2C5B]" />
          </div>
          <p className="text-2xl font-black text-[#0D2C5B]">{summary?.total_invited || 0}</p>
          <p className="text-[11px] text-gray-400">Members registered</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Activity</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">{summary?.pending_count || 0}</p>
          <p className="text-[11px] text-gray-400">Awaiting 1st post/challenge</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Successful</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{summary?.successful_count || 0}</p>
          <p className="text-[11px] text-gray-400">Activity verified</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Referral XP Earned</span>
            <Sparkles className="w-4 h-4 text-[#E84020]" />
          </div>
          <p className="text-2xl font-black text-[#E84020]">+{summary?.total_referral_xp || 0} XP</p>
          <p className="text-[11px] text-gray-400">Credited to your balance</p>
        </div>
      </div>

      {/* 4. Referral History Stream */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#0D2C5B]">Your Invited Creators</h3>
          <span className="text-xs text-gray-400 font-semibold">{summary?.history?.length || 0} Records</span>
        </div>

        {!summary?.history || summary.history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-6 space-y-2">
            <Gift className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-sm text-[#0D2C5B]">No referrals yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Share your link with talented Tamil creators. Once they publish their first creative post or submit to a challenge, you will automatically earn +50 XP!
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

      {/* 5. Rules & Anti-Fraud Notice */}
      <div className="bg-[#FFF8EC] border border-[#F5A623]/30 rounded-2xl p-5 text-xs text-[#8A5000] space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm text-[#0D2C5B]">
          <AlertCircle className="w-4 h-4 text-[#E84020]" />
          <span>TNCC Referral & Earn Policy</span>
        </div>
        <p className="leading-relaxed">
          • Referral reward is awarded <strong>only once per referred member</strong> when they successfully publish their first approved creative post or complete a challenge entry.
        </p>
        <p className="leading-relaxed">
          • <strong>Zero XP is awarded at signup</strong> to prevent automated bot farming. Self-referrals and duplicate accounts are strictly disqualified.
        </p>
      </div>
    </div>
  );
}
