'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import ChallengeCard from '@/tncc-community/components/challenges/ChallengeCard';
import { Trophy, Sparkles, Layers, Award, Plus } from 'lucide-react';

export default function ChallengesPage() {
  const { challenges, isAdmin } = useCommunity();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Upcoming' | 'Completed'>('All');

  const filteredChallenges = challenges.filter((c) => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020] border border-[#E84020]/20">
            CREATIVE COMPETITIONS & XP
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] tracking-tight mt-1">
            Community Design & Video Challenges
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Submit original works, compete on leaderboards, win cash prizes & boost your TNCC XP.
          </p>
        </div>

        {/* Right Action: Status Filters & Admin Winner Review */}
        <div className="flex items-center gap-3 flex-wrap">
          {isAdmin && (
            <Link
              href="/community/admin"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Review Submissions & Pick Winners</span>
            </Link>
          )}

          {/* Status Filters */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-gray-200 self-start sm:self-auto shadow-sm">
            {(['All', 'Active', 'Upcoming', 'Completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === filter
                    ? 'bg-[#0D2C5B] text-white shadow'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
