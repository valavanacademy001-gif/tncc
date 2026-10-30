'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import JobCard from '@/tncc-community/components/jobs/JobCard';
import { Briefcase, Search, Filter, Plus } from 'lucide-react';

export default function JobsPage() {
  const { jobs, isAdmin } = useCommunity();
  const [activeCategory, setActiveCategory] = useState('All Roles');
  const [workModeFilter, setWorkModeFilter] = useState('All Modes');
  const [searchQuery, setSearchQuery] = useState('');

  const jobCategories = [
    'All Roles',
    'Motion Graphics',
    'Graphic Designer',
    'Video Editor',
    'UI/UX Designer',
    'AI Creative Specialist',
    'Photographer',
  ];

  const workModes = ['All Modes', 'Remote', 'Hybrid', 'On-site'];

  const filteredJobs = jobs.filter((job) => {
    if (activeCategory !== 'All Roles' && job.category !== activeCategory) return false;
    if (workModeFilter !== 'All Modes' && job.work_mode !== workModeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = job.company_name.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchSkill = job.required_skills?.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchDesc && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0D2C5B]/10 text-[#0D2C5B] border border-[#0D2C5B]/20">
            CREATIVE CAREERS IN TAMIL NADU
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] tracking-tight mt-1">
            Verified Creative Job Board
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Full-time, contract, and freelance roles curated for Tamil Nadu designers, video editors, and animators.
          </p>
        </div>

        {/* Search & Admin Action */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/community/admin"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Post Job</span>
            </Link>
          )}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, studios, skills..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#0D2C5B] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {jobCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0D2C5B] text-white shadow'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <select
          value={workModeFilter}
          onChange={(e) => setWorkModeFilter(e.target.value)}
          className="text-xs bg-white text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
        >
          {workModes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-[#0D2C5B]">No job offers found</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting the filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
