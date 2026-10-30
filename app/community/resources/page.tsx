'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import ResourceCard from '@/tncc-community/components/resources/ResourceCard';
import { ResourceCategory } from '@/tncc-community/lib/types';
import { BookOpen, Search, Download, Globe, Video, FileText, Layers, Plus, ShieldCheck } from 'lucide-react';

export default function ResourcesPage() {
  const { resources, isAdmin } = useCommunity();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: 'All', icon: Layers },
    { label: 'Downloads', icon: Download },
    { label: 'Useful Websites', icon: Globe },
    { label: 'Feeds / Videos', icon: Video },
    { label: 'Blog Posts', icon: FileText },
  ];

  const filteredResources = resources.filter((res) => {
    if (activeCategory !== 'All' && res.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchType = res.resource_type.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchType) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#00B5C8]/10 text-[#00B5C8] border border-[#00B5C8]/20">
            CREATOR RESOURCE VAULT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] tracking-tight mt-1">
            Free Design & Production Resources
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Curated fonts, Photoshop assets, LUTs, AI tools, and guides for Tamil Nadu creators.
          </p>
        </div>

        {/* Search & Admin Quick Action */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/community/admin"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Resource</span>
            </Link>
          )}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fonts, LUTs, PSDs..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#0D2C5B] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#0D2C5B] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-[#0D2C5B]">No resources matched</h3>
          <p className="text-xs text-gray-500 mt-1">Try switching categories or clearing search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
}
