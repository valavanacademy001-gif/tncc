'use client';

import React from 'react';
import { Search, Sparkles, MessageSquare, Bookmark, Layers } from 'lucide-react';

export type FeedFilterType = 'All' | 'Saved' | 'Discussion' | 'Showcase';

interface FeedFiltersProps {
  activeFilter: FeedFilterType;
  onFilterChange: (filter: FeedFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
}

export default function FeedFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: FeedFiltersProps) {
  const tabs: { label: FeedFilterType; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { label: 'Showcase', icon: <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { label: 'Discussion', icon: <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
    { label: 'Saved', icon: <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Search Bar on Mobile / Feed top */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search posts, hashtags, discussions..."
          className="w-full pl-10 pr-12 py-2.5 bg-white dark:bg-[#1D2430] rounded-xl border border-gray-200 dark:border-[#303846] text-xs sm:text-sm text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] shadow-sm transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-1"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs - Display-responsive Single Row */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => onFilterChange(tab.label)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'bg-[#0D2C5B] dark:bg-[#00B5C8] text-white dark:text-[#101318] shadow-xs'
                  : 'bg-white dark:bg-[#1D2430] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#171C24] border border-gray-200 dark:border-[#303846]'
              }`}
            >
              <span className="shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
