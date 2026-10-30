'use client';

import React from 'react';
import Link from 'next/link';
import { ChallengeWinner } from '../../lib/types';
import { Trophy, Award, Medal, ExternalLink } from 'lucide-react';

interface WinnersPodiumProps {
  winners: {
    first?: ChallengeWinner;
    second?: ChallengeWinner;
    third?: ChallengeWinner;
  };
}

export default function ChallengeWinnersPodium({ winners }: WinnersPodiumProps) {
  if (!winners.first && !winners.second && !winners.third) return null;

  return (
    <div className="bg-gradient-to-br from-[#0D2C5B] to-[#1B3F7E] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#E84020]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#00B5C8]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8 space-y-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FFB84D] border border-white/10">
          <Trophy className="w-3.5 h-3.5 text-[#FFB84D]" />
          <span>Official Competition Results</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Challenge Winners Podium
        </h3>
        <p className="text-xs text-white/70">
          Celebrating top creative excellence across Tamil Nadu. Only top 3 ranks are awarded.
        </p>
      </div>

      {/* Podium Grid (2nd, 1st, 3rd) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10 max-w-4xl mx-auto">
        {/* 2nd Place */}
        {winners.second && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center space-y-3 order-2 md:order-1">
            <div className="w-10 h-10 rounded-full bg-[#D1D1D1] text-[#0D2C5B] flex items-center justify-center font-extrabold text-sm shadow-md">
              🥈 2nd
            </div>
            <img
              src={winners.second.member.avatar_url}
              alt={winners.second.member.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D1D1D1] shadow"
            />
            <div>
              <p className="font-bold text-sm leading-tight">{winners.second.member.full_name}</p>
              <p className="text-xs text-white/70">@{winners.second.member.username}</p>
            </div>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
              <img
                src={winners.second.submitted_work_url}
                alt="2nd work"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E84020] text-white">
              +{winners.second.xp_bonus} XP Bonus
            </span>
          </div>
        )}

        {/* 1st Place (Center & Elevated) */}
        {winners.first && (
          <div className="bg-gradient-to-b from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#F5A623] flex flex-col items-center text-center space-y-3 order-1 md:order-2 shadow-2xl md:-translate-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5A623] text-[#0D2C5B] flex items-center justify-center font-extrabold text-base shadow-lg animate-bounce-subtle">
              👑 1st
            </div>
            <img
              src={winners.first.member.avatar_url}
              alt={winners.first.member.full_name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#F5A623] shadow-lg"
            />
            <div>
              <p className="font-extrabold text-base leading-tight text-white">{winners.first.member.full_name}</p>
              <p className="text-xs text-[#FFB84D]">@{winners.first.member.username}</p>
            </div>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-[#F5A623]/30">
              <img
                src={winners.first.submitted_work_url}
                alt="1st work"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#F5A623] text-[#0D2C5B] shadow">
              +{winners.first.xp_bonus} XP Winner Bonus
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {winners.third && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-center text-center space-y-3 order-3">
            <div className="w-10 h-10 rounded-full bg-[#CD7F32] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
              🥉 3rd
            </div>
            <img
              src={winners.third.member.avatar_url}
              alt={winners.third.member.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#CD7F32] shadow"
            />
            <div>
              <p className="font-bold text-sm leading-tight">{winners.third.member.full_name}</p>
              <p className="text-xs text-white/70">@{winners.third.member.username}</p>
            </div>
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
              <img
                src={winners.third.submitted_work_url}
                alt="3rd work"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00B5C8] text-white">
              +{winners.third.xp_bonus} XP Bonus
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
