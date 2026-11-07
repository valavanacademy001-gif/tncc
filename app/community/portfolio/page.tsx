'use client';

import React, { useState } from 'react';
import { useCommunity } from '@/tncc-community/lib/community-context';
import CreatorCard from '@/tncc-community/components/portfolio/CreatorCard';
import { FolderKanban, Search, Sparkles, Filter } from 'lucide-react';

export default function PortfolioDirectoryPage() {
  const { allMembers } = useCommunity();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Graphic Design',
    'Branding',
    'Logo Design',
    'Video Editing',
    'Photography',
    'UI/UX',
    'AI Art',
    'Motion Graphics',
  ];

  // Sorted by XP descending by default as strictly required!
  const sortedMembers = [...allMembers].sort((a, b) => b.total_xp - a.total_xp);

  const filteredMembers = sortedMembers.filter((m) => {
    // 1. Category filter
    if (activeCategory !== 'All') {
      const matchSkill = m.skills?.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));
      if (!matchSkill) return false;
    }

    // 2. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.full_name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q);
      const matchBio = m.bio.toLowerCase().includes(q);
      const matchLoc = m.location.toLowerCase().includes(q);
      const matchSkill = m.skills?.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchLoc && !matchSkill) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#00B5C8]/10 text-[#00B5C8] border border-[#00B5C8]/20">
            CREATOR SHOWCASE DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA] tracking-tight mt-1">
            Tamil Nadu Creative Portfolios
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Discover verified creators from Chennai to Kanyakumari. Top XP performers are featured first.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, skills, locations..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1D2430] rounded-xl border border-gray-200 dark:border-[#303846] text-xs sm:text-sm text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] shadow-sm transition-colors"
          />
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#0D2C5B] dark:bg-[#00B5C8] text-white dark:text-[#101318] shadow-md'
                  : 'bg-white dark:bg-[#1D2430] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252E3D] border border-gray-200 dark:border-[#303846]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Creators Grid (Behance Style) */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1D2430] rounded-3xl border border-gray-200 dark:border-[#303846] p-8">
          <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-[#0D2C5B] dark:text-[#F5F7FA]">No creators matched</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try switching creative categories or clear your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredMembers.map((member, idx) => (
            <CreatorCard key={member.id} member={member} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
