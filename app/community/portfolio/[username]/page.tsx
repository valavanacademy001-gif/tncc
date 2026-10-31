'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import { 
  ArrowLeft, 
  MapPin, 
  ExternalLink, 
  Award, 
  FolderKanban, 
  Sparkles, 
  Heart,
  Share2
} from 'lucide-react';

export default function CreatorPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const { allMembers, getPortfolioProjects, posts, isFollowing, toggleFollow, currentMember } = useCommunity();

  const member = allMembers.find(
    (m) => m.username.toLowerCase() === resolvedParams.username.toLowerCase()
  );

  if (!member) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-[#0D2C5B]">Creator not found</h2>
        <Link href="/community/portfolio" className="text-xs font-bold text-[#E84020] hover:underline">
          Return to Portfolio Showcase
        </Link>
      </div>
    );
  }

  // Automatic Portfolio integration: Get member's showcase projects
  const projects = getPortfolioProjects(member.id);

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Back Link */}
      <Link
        href="/community/portfolio"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0D2C5B] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Creator Directory</span>
      </Link>

      {/* Profile Cover & Header */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-44 sm:h-60 bg-gradient-to-r from-[#0D2C5B] to-[#1B3F7E] relative overflow-hidden">
          <img
            src={member.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-black/60 text-white backdrop-blur-md shadow-md">
              ⚡ {member.total_xp} Total XP
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative z-10">
          {/* Top Row: Avatar overlapping the banner, and Action buttons on the right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-5">
            <div className="relative inline-block">
              <img
                src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={member.full_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                }}
              />
            </div>

            {/* Action & External Links */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {currentMember?.username !== member.username && (
                <button
                  type="button"
                  onClick={() => toggleFollow(member.username)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 active:scale-95 ${
                    isFollowing(member.username)
                      ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200'
                      : 'bg-[#0D2C5B] hover:bg-[#E84020] text-white'
                  }`}
                >
                  <span>{isFollowing(member.username) ? 'Following' : '+ Follow'}</span>
                </button>
              )}
              {member.behance_url && (
                <a
                  href={member.behance_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <span>Behance Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {member.instagram_url && (
                <a
                  href={member.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#F8F6F1] hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200"
                  title="Instagram"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Creator Information - 100% cleanly on White Card with optimal contrast */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] leading-tight">
                {member.full_name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
                @{member.username} · {member.location}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#0D2C5B] text-sm">
                  {member.followers_count ?? 320}
                </span>
                <span className="text-gray-500 font-medium">Followers</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#0D2C5B] text-sm">
                  {member.following_count ?? 78}
                </span>
                <span className="text-gray-500 font-medium">Following</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {member.skills?.map((skill, i) => (
                <span key={i} className="text-xs font-semibold bg-[#F8F6F1] text-gray-700 px-3 py-1 rounded-lg border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {member.bio && (
            <div className="pt-4 mt-5 border-t border-gray-100">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
                {member.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Showcase Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0D2C5B]">Portfolio Gallery</h2>
          <p className="text-xs text-gray-400">
            Automatically synced from approved showcase posts & works ({projects.length} {projects.length === 1 ? 'project' : 'projects'})
          </p>
        </div>
      </div>

      {/* Projects Gallery Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 text-gray-400">
          <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="font-bold text-sm">No showcase projects published yet</p>
          <p className="text-xs mt-1">This creator hasn&apos;t marked any feed posts as showcase yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
            >
              <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative shrink-0">
                <img
                  src={project.preview_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0D2C5B] leading-snug group-hover:text-[#E84020] transition-colors line-clamp-1 min-h-[1.25rem]">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed min-h-[2.5rem]">
                    {project.description || 'Creative showcase work published to the TNCC Community.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  <span className="text-[#E84020] font-bold">TNCC Showcase</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
