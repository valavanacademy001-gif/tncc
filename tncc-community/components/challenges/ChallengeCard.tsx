'use client';

import React from 'react';
import Link from 'next/link';
import { CommunityChallenge } from '../../lib/types';
import { 
  Trophy, 
  Clock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ChallengeCard({ challenge }: { challenge: CommunityChallenge }) {
  const getStatusColor = (status: CommunityChallenge['status']) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Upcoming':
        return 'text-[#00B5C8] bg-cyan-50 border-cyan-200';
      case 'Submission Closed':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Completed':
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Clean Thumbnail WITHOUT any overlay buttons/badges */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={challenge.thumbnail_url}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Minimal Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Status & Category Tag (placed cleanly below image) */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold uppercase tracking-wider text-[#E84020]">
              {challenge.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border uppercase ${getStatusColor(challenge.status)}`}>
              {challenge.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-[#0D2C5B] group-hover:text-[#E84020] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
            {challenge.title}
          </h3>

          {/* Minimal 2-line Description */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2rem]">
            {challenge.description}
          </p>

          {/* Minimal Prize summary badge */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D2C5B] bg-[#FFF8EC] border border-orange-100 px-3 py-1.5 rounded-xl">
            <Trophy className="w-3.5 h-3.5 text-[#E84020] shrink-0" />
            <span className="truncate">1st Place: {challenge.prizes.first}</span>
          </div>
        </div>

        {/* Footer Meta & "Details" Action Button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(challenge.submission_deadline).toLocaleDateString()}</span>
          </div>

          <Link
            href={`/community/challenges/${challenge.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow-sm group/btn shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
