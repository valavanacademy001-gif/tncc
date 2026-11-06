'use client';

import React from 'react';
import { Search, Sparkles, MessageSquare, Bookmark, Layers } from 'lucide-react';

export type FeedFilterType = 'All' | 'Saved' | 'Discussion' | 'Showcase';

interface FeedFiltersProps {
  activeFilter: FeedFilterType;
  onFilterChange: (filter: FeedFilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

export default function FeedFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: FeedFiltersProps) {
  const tabs: { label: FeedFilterType; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Showcase', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Discussion', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { label: 'Saved', icon: <Bookmark className="w-3.5 h-3.5" /> },
  ];

  const categories = [
    'All Categories',
    'Graphic Design',
    'Video Editing',
    'Photography',
    'AI Art',
    'Branding',
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

      {/* Filter Tabs & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Main Tabs - Scrollable with no ugly scrollbars */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => onFilterChange(tab.label)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#0D2C5B] dark:bg-[#00B5C8] text-white dark:text-[#101318] shadow-sm'
                    : 'bg-white dark:bg-[#1D2430] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#171C24] border border-gray-200 dark:border-[#303846]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-category selector */}
        <div className="flex items-center justify-end shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs bg-white dark:bg-[#1D2430] text-gray-700 dark:text-gray-200 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#1D2430] text-gray-700 dark:text-gray-200">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
