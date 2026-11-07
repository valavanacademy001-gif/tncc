'use client';

import React from 'react';
import Link from 'next/link';
import { CommunityMember } from '../../lib/types';
import { useCommunity } from '../../lib/community-context';
import SocialLinks from '../common/SocialLinks';
import { MapPin, Sparkles, ExternalLink, Award } from 'lucide-react';

interface CreatorCardProps {
  member: CommunityMember;
  rank?: number;
}

export default function CreatorCard({ member, rank }: CreatorCardProps) {
  const { getPortfolioProjects } = useCommunity();
  const projects = getPortfolioProjects(member.id);
  const fallbackCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const topPreview = projects[0]?.preview_url || member.cover_url || fallbackCover;

  return (
    <div className="bg-white dark:bg-[#1D2430] rounded-2xl border border-gray-200 dark:border-[#303846] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group/card">
      {/* Cover / Top Featured Project Preview */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shrink-0">
        <img
          src={topPreview}
          alt={member.full_name}
          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackCover;
          }}
        />

        {/* Rank Overlay (Top 3 only — XP removed per request) */}
        {rank && rank <= 3 && (
          <div className="absolute top-2.5 left-2.5 flex items-center z-10">
            <span className="w-5.5 h-5.5 rounded-full bg-[#F5A623] text-[#0D2C5B] font-extrabold text-[11px] flex items-center justify-center shadow-md">
              #{rank}
            </span>
          </div>
        )}

        {/* Total Projects Count */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm z-10">
          {projects.length} Works
        </div>
      </div>

      {/* Creator Info Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-2.5">
            <img
              src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={member.full_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#1D2430] -mt-6 shadow-md shrink-0 bg-white dark:bg-[#1D2430] relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="flex-1 min-w-0 pt-0.5">
              <Link
                href={`/community/portfolio/${member.username}`}
                className="font-bold text-[13px] text-[#0D2C5B] dark:text-[#F5F7FA] hover:text-[#E84020] dark:hover:text-[#00B5C8] transition-colors leading-tight line-clamp-1 block truncate"
                title={member.full_name}
              >
                {member.full_name}
              </Link>
              <div className="flex items-center gap-1 text-[10.5px] text-gray-400 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{member.location.split(',')[0]}</span>
                <span>·</span>
                <span className="shrink-0 font-medium text-gray-500 dark:text-gray-400">{member.followers_count ?? 240} followers</span>
              </div>
            </div>
          </div>

          {/* Bio - exact 2 lines height container with automatic ellipsis (...) truncation */}
          <div className="h-[2.4rem] mt-2 overflow-hidden">
            <p className="text-[11.5px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Skills pills - single-line compact height so all cards remain equal size */}
          <div className="flex items-center gap-1.5 mt-2 h-5 overflow-hidden">
            {member.skills?.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                className="text-[9.5px] font-semibold bg-[#F8F6F1] dark:bg-[#171C24] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md border border-gray-100 dark:border-[#303846] truncate max-w-[105px]"
              >
                {skill}
              </span>
            ))}
            {member.skills && member.skills.length > 2 && (
              <span className="text-[9.5px] font-bold text-gray-400 dark:text-gray-500 shrink-0">
                +{member.skills.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions - All Socials in single line without dropping down + View Portfolio */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-[#303846] flex items-center justify-between gap-1.5">
          <SocialLinks member={member} showLabels={false} size="sm" className="shrink-0" />

          <Link
            href={`/community/portfolio/${member.username}`}
            className="px-2.5 py-1 bg-[#0D2C5B] dark:bg-[#00B5C8] hover:bg-[#E84020] dark:hover:bg-[#00B5C8]/80 text-white dark:text-[#101318] rounded-lg text-[11px] font-bold transition-all shadow-xs shrink-0 whitespace-nowrap"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
