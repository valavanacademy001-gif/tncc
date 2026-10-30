'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '../../lib/community-context';
import { Trophy, Award, Medal, Zap, Sparkles, Filter } from 'lucide-react';

export default function LeaderboardView() {
  const { allMembers } = useCommunity();
  const [timeFilter, setTimeFilter] = useState<'All Time' | 'Monthly' | 'Weekly'>('All Time');

  // Sorted members by XP (real data)
  const sorted = [...allMembers].sort((a, b) => b.total_xp - a.total_xp);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const rest = sorted.slice(3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#E84020]/10 text-[#E84020] border border-[#E84020]/20">
              COMMUNITY XP RANKINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] tracking-tight mt-1">
            Tamil Nadu Creators Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Ranked dynamically by verified creative XP earned through approved posts, likes, challenges, and wins.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center p-1 bg-white rounded-xl border border-gray-200 self-start sm:self-auto shadow-sm">
          {(['All Time', 'Monthly', 'Weekly'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === filter
                  ? 'bg-[#0D2C5B] text-white shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (Gold, Silver, Bronze) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* 2nd Place */}
        {second && (
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm flex flex-col items-center text-center space-y-3 order-2 md:order-1 relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-[#0D2C5B] flex items-center justify-center font-extrabold text-sm shadow">
              🥈 2nd
            </div>
            <img
              src={second.avatar_url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'}
              alt={second.full_name}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <div>
              <Link
                href={`/community/portfolio/${second.username}`}
                className="font-bold text-base text-[#0D2C5B] hover:text-[#E84020] transition-colors block"
              >
                {second.full_name}
              </Link>
              <p className="text-xs text-gray-400">@{second.username}</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#0D2C5B]/5 text-[#0D2C5B] font-extrabold text-sm">
              ⚡ {second.total_xp} XP
            </div>
            <div className="text-[11px] text-gray-500">
              {second.wins_count || 0} Wins · {second.challenges_count || 0} Challenges
            </div>
          </div>
        )}

        {/* 1st Place (Center & Elevated) */}
        {first && (
          <div className="bg-gradient-to-b from-[#FFF8EC] to-white rounded-3xl p-8 border-2 border-[#F5A623] shadow-xl flex flex-col items-center text-center space-y-4 order-1 md:order-2 relative md:-translate-y-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#F5A623] via-[#E84020] to-[#F5A623]" />
            <div className="w-12 h-12 rounded-full bg-[#F5A623] text-[#0D2C5B] flex items-center justify-center font-extrabold text-base shadow-lg animate-bounce-subtle">
              👑 1st
            </div>
            <img
              src={first.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={first.full_name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#F5A623] shadow-xl"
            />
            <div>
              <Link
                href={`/community/portfolio/${first.username}`}
                className="font-extrabold text-lg text-[#0D2C5B] hover:text-[#E84020] transition-colors block"
              >
                {first.full_name}
              </Link>
              <p className="text-xs text-[#E84020] font-semibold">@{first.username}</p>
            </div>
            <div className="px-5 py-2 rounded-full bg-[#E84020] text-white font-extrabold text-base shadow-md">
              ⚡ {first.total_xp} XP
            </div>
            <div className="text-xs font-semibold text-gray-600">
              {first.wins_count || 0} Competition Wins · {first.challenges_count || 0} Challenges
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm flex flex-col items-center text-center space-y-3 order-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#CD7F32]/20 text-[#8B4513] flex items-center justify-center font-extrabold text-sm shadow">
              🥉 3rd
            </div>
            <img
              src={third.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
              alt={third.full_name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#CD7F32]/40 shadow-md"
            />
            <div>
              <Link
                href={`/community/portfolio/${third.username}`}
                className="font-bold text-base text-[#0D2C5B] hover:text-[#E84020] transition-colors block"
              >
                {third.full_name}
              </Link>
              <p className="text-xs text-gray-400">@{third.username}</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#0D2C5B]/5 text-[#0D2C5B] font-extrabold text-sm">
              ⚡ {third.total_xp} XP
            </div>
            <div className="text-[11px] text-gray-500">
              {third.wins_count || 0} Wins · {third.challenges_count || 0} Challenges
            </div>
          </div>
        )}
      </div>

      {/* Remaining Members Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0D2C5B]">Community Rankings Table</h3>
          <span className="text-xs text-gray-400">Total {sorted.length} Creators</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F1] text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Creator</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Challenges</th>
                <th className="px-6 py-3.5">Wins</th>
                <th className="px-6 py-3.5 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((member, idx) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-extrabold text-gray-700">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/community/portfolio/${member.username}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                        alt={member.full_name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-[#0D2C5B]/20 transition-all"
                      />
                      <div>
                        <p className="font-bold text-[#0D2C5B] group-hover:text-[#E84020] transition-colors">
                          {member.full_name}
                        </p>
                        <p className="text-[11px] text-gray-400">@{member.username}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.location}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {member.challenges_count || 0}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#E84020]">
                    {member.wins_count || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#0D2C5B]/5 text-[#0D2C5B]">
                      ⚡ {member.total_xp} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
