'use client';

import React from 'react';
import Link from 'next/link';
import { CommunityMember } from '../../lib/types';
import { useCommunity } from '../../lib/community-context';
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
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Cover / Top Featured Project Preview */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-tr from-slate-100 to-slate-200 shrink-0">
        <img
          src={topPreview}
          alt={member.full_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackCover;
          }}
        />

        {/* Rank & XP Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {rank && rank <= 3 && (
            <span className="w-6 h-6 rounded-full bg-[#F5A623] text-[#0D2C5B] font-extrabold text-xs flex items-center justify-center shadow-md">
              #{rank}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#0D2C5B]/90 text-white backdrop-blur-sm shadow">
            ⚡ {member.total_xp} XP
          </span>
        </div>

        {/* Total Projects Count */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm z-10">
          {projects.length} Works
        </div>
      </div>

      {/* Creator Info Body */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3">
            <img
              src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={member.full_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white -mt-8 shadow-md shrink-0 bg-white relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="flex-1 min-w-0 pt-0.5">
              <Link
                href={`/community/portfolio/${member.username}`}
                className="font-bold text-[13px] sm:text-sm text-[#0D2C5B] hover:text-[#E84020] transition-colors leading-tight line-clamp-1 block"
                title={member.full_name}
              >
                {member.full_name}
              </Link>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{member.location.split(',')[0]}</span>
                <span>·</span>
                <span className="shrink-0 font-medium text-gray-500">{member.followers_count ?? 240} followers</span>
              </div>
            </div>
          </div>

          {/* Bio - exact 2 lines height container */}
          <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
            {member.bio}
          </p>

          {/* Skills pills - tight and compact without excess white space */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {member.skills?.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-[#F8F6F1] text-gray-700 px-2 py-0.5 rounded-md border border-gray-100 truncate max-w-[140px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions - compact margin directly under the 3 points */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          {member.behance_url ? (
            <a
              href={member.behance_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-[#0D2C5B] hover:text-[#00B5C8] flex items-center gap-1 transition-colors"
            >
              <span>Behance</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-gray-400">TNCC Verified</span>
          )}

          <Link
            href={`/community/portfolio/${member.username}`}
            className="px-3.5 py-1.5 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
