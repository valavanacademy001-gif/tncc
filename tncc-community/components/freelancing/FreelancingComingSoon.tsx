'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function FreelancingComingSoon() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 sm:p-12 bg-white rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#E84020]/10 via-[#00B5C8]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0D2C5B] to-[#1B3F7E] text-white flex items-center justify-center mx-auto shadow-xl">
          <Zap className="w-8 h-8 text-[#FFB84D] animate-bounce-subtle" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#E84020]/10 text-[#E84020] border border-[#E84020]/20 inline-block">
            COMING SOON
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D2C5B] tracking-tight">
            Creative Freelance Network
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
            Exciting freelance opportunities and collaborations are coming to TNCC. Connect with direct clients and creative agencies across Tamil Nadu.
          </p>
        </div>

        <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-xs text-gray-500 max-w-sm mx-auto">
          In the meantime, build your XP through Challenges and Showcase your portfolio to get discovered early.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/community/challenges"
            className="px-5 py-2.5 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Explore Active Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/community"
            className="px-5 py-2.5 bg-white text-[#0D2C5B] border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
          >
            Return to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
