'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import FeedComposer from '@/tncc-community/components/feed/FeedComposer';
import PostCard from '@/tncc-community/components/feed/PostCard';
import FeedFilters, { FeedFilterType } from '@/tncc-community/components/feed/FeedFilters';
import { Trophy, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';

export default function CommunityFeedPage() {
  const { posts, allMembers, challenges } = useCommunity();
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  // Filter posts based on tab, category, and search query
  const filteredPosts = posts.filter((post) => {
    // 1. Tab filter
    if (activeFilter === 'Saved' && !post.is_saved) return false;
    if (activeFilter === 'Showcase' && !post.is_showcase && post.category !== 'Showcase') return false;
    if (activeFilter === 'Discussion' && post.category !== 'Discussion') return false;

    // 2. Category filter
    if (categoryFilter !== 'All Categories' && post.category !== categoryFilter) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = post.caption.toLowerCase().includes(q);
      const matchAuthor = post.author.full_name.toLowerCase().includes(q) || post.author.username.toLowerCase().includes(q);
      const matchHashtags = post.hashtags?.some((t) => t.toLowerCase().includes(q));
      if (!matchCaption && !matchAuthor && !matchHashtags) return false;
    }

    return true;
  });

  const topCreators = allMembers.slice(0, 4);
  const activeChallenge = challenges.find((c) => c.status === 'Active');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Feed Column - Instagram Desktop Proportions */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <div className="w-full max-w-[540px] space-y-6">
          {/* Inline Post Composer */}
          <FeedComposer isInline={true} />

          {/* Feed Filters & Search */}
          <FeedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          {/* Posts Stream */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <Compass className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-[#0D2C5B]">No posts found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                There are no posts matching your current filter. Try selecting &quot;All&quot; or clearing your search.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Discovery Sidebar */}
      <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-20 h-fit self-start">
        {/* Active Challenge Spotlight */}
        {activeChallenge && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0D2C5B] to-[#1B3F7E] text-white shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E84020] text-white">
                Active Challenge
              </span>
              <span className="text-xs text-[#FFB84D] font-bold">⚡ +{activeChallenge.xp_reward} XP</span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm leading-snug line-clamp-2">
                {activeChallenge.title}
              </h4>
              <p className="text-xs text-white/70 line-clamp-2 mt-1">
                {activeChallenge.description}
              </p>
            </div>
            <Link
              href={`/community/challenges/${activeChallenge.id}`}
              className="w-full inline-flex items-center justify-center py-2 bg-white text-[#0D2C5B] hover:bg-[#FFB84D] rounded-xl text-xs font-bold transition-all shadow"
            >
              Enter Challenge
            </Link>
          </div>
        )}

        {/* Top Community Creators */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0D2C5B]">
              <Award className="w-4 h-4 text-[#E84020]" />
              <span>Top Tamil Nadu Creators</span>
            </div>
            <Link
              href="/community/leaderboard"
              className="text-[11px] font-bold text-[#E84020] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {topCreators.map((creator, i) => (
              <Link
                key={creator.id}
                href={`/community/portfolio/${creator.username}`}
                className="flex items-center justify-between group p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                  <img
                    src={creator.avatar_url}
                    alt={creator.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0D2C5B] group-hover:text-[#E84020] transition-colors truncate">
                      {creator.full_name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">@{creator.username}</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-[#0D2C5B] shrink-0">
                  ⚡ {creator.total_xp}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="p-4 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
          <p className="font-bold text-[#0D2C5B]">TNCC Community Rulebook</p>
          <ul className="text-[11px] text-gray-500 space-y-1 list-disc pl-3.5">
            <li>Original artwork & constructive critique only.</li>
            <li>Earn XP by publishing, submitting & engaging.</li>
            <li>TNCC is 100% Free for all Tamil Nadu creators.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
