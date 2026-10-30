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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creator posts, captions, hashtags or discussions..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#0D2C5B] shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Main Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => onFilterChange(tab.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0D2C5B] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-category selector */}
        <div className="flex items-center justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs bg-white text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
