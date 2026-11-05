'use client';

import React from 'react';
import { CommunityMember } from '../../lib/types';
import { Globe, Plus } from 'lucide-react';

export function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66s-.74-1.66-1.66-1.66a1.66 1.66 0 0 0-1.66 1.66c0 .92.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export function BehanceIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.659 0-5.748-2.617-5.748-5.877 0-3.528 2.285-6.123 5.679-6.123 3.633 0 5.488 2.459 5.488 5.797 0 .548-.06 1.233-.119 1.445h-7.859c.071 1.77 1.373 2.758 2.858 2.758 1.42 0 2.215-.658 2.571-1.357l1.856.357zm-2.316-3.693c-.027-1.258-.875-2.217-2.39-2.217-1.423 0-2.389.928-2.585 2.217h4.975zm-13.41 5.693h-6v-14h6.059c2.428 0 4.195 1.054 4.195 3.518 0 1.488-.857 2.658-2.176 3.141 1.748.423 2.672 1.839 2.672 3.57 0 2.472-1.921 3.771-4.75 3.771zm-3.353-8.154h2.723c1.234 0 2.051-.518 2.051-1.658 0-1.071-.855-1.545-2.051-1.545h-2.723v3.203zm0 5.518h2.951c1.477 0 2.404-.619 2.404-1.899 0-1.238-.985-1.78-2.404-1.78h-2.951v3.679z" />
    </svg>
  );
}

interface SocialLinksProps {
  member: CommunityMember;
  onEditClick?: () => void;
  showLabels?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SocialLinks({
  member,
  onEditClick,
  showLabels = true,
  className = '',
  size = 'md',
}: SocialLinksProps) {
  const instagram = member.instagram_url || (member.username ? `https://instagram.com/${member.username}` : '');
  const linkedin = member.linkedin_url || (member.username ? `https://linkedin.com/in/${member.username}` : '');
  const behance = member.behance_url || (member.username ? `https://behance.net/${member.username}` : '');
  const website = member.website_url;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] gap-1.5 rounded-lg',
    md: 'px-3 py-1.5 text-xs gap-2 rounded-xl',
    lg: 'px-4 py-2 text-xs sm:text-sm gap-2.5 rounded-xl',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4 sm:w-5 sm:h-5',
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Instagram */}
      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          title={`Instagram (@${member.username})`}
          className={`group flex items-center font-bold border border-gray-200 bg-white text-gray-700 hover:text-white hover:border-transparent hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] shadow-sm hover:shadow-md transition-all active:scale-95 ${sizeClasses[size]}`}
        >
          <InstagramIcon className={`${iconSizes[size]} text-[#E1306C] group-hover:text-white transition-colors`} />
          {showLabels && <span>Instagram</span>}
        </a>
      ) : onEditClick ? (
        <button
          type="button"
          onClick={onEditClick}
          title="Add Instagram link"
          className={`group flex items-center font-semibold border border-dashed border-gray-300 bg-[#F8F6F1] text-gray-500 hover:text-[#E1306C] hover:border-[#E1306C] transition-all ${sizeClasses[size]}`}
        >
          <Plus className="w-3 h-3" />
          <InstagramIcon className={iconSizes[size]} />
          {showLabels && <span>Add Instagram</span>}
        </button>
      ) : null}

      {/* LinkedIn */}
      {linkedin ? (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title={`LinkedIn (@${member.username})`}
          className={`group flex items-center font-bold border border-gray-200 bg-white text-gray-700 hover:text-white hover:border-transparent hover:bg-[#0A66C2] shadow-sm hover:shadow-md transition-all active:scale-95 ${sizeClasses[size]}`}
        >
          <LinkedinIcon className={`${iconSizes[size]} text-[#0A66C2] group-hover:text-white transition-colors`} />
          {showLabels && <span>LinkedIn</span>}
        </a>
      ) : onEditClick ? (
        <button
          type="button"
          onClick={onEditClick}
          title="Add LinkedIn link"
          className={`group flex items-center font-semibold border border-dashed border-gray-300 bg-[#F8F6F1] text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-all ${sizeClasses[size]}`}
        >
          <Plus className="w-3 h-3" />
          <LinkedinIcon className={iconSizes[size]} />
          {showLabels && <span>Add LinkedIn</span>}
        </button>
      ) : null}

      {/* Behance */}
      {behance ? (
        <a
          href={behance}
          target="_blank"
          rel="noopener noreferrer"
          title={`Behance Portfolio (@${member.username})`}
          className={`group flex items-center font-bold border border-gray-200 bg-white text-gray-700 hover:text-white hover:border-transparent hover:bg-[#0057FF] shadow-sm hover:shadow-md transition-all active:scale-95 ${sizeClasses[size]}`}
        >
          <BehanceIcon className={`${iconSizes[size]} text-[#0057FF] group-hover:text-white transition-colors`} />
          {showLabels && <span>Behance</span>}
        </a>
      ) : onEditClick ? (
        <button
          type="button"
          onClick={onEditClick}
          title="Add Behance link"
          className={`group flex items-center font-semibold border border-dashed border-gray-300 bg-[#F8F6F1] text-gray-500 hover:text-[#0057FF] hover:border-[#0057FF] transition-all ${sizeClasses[size]}`}
        >
          <Plus className="w-3 h-3" />
          <BehanceIcon className={iconSizes[size]} />
          {showLabels && <span>Add Behance</span>}
        </button>
      ) : null}

      {/* Personal Website if present */}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          title={`Website (${website})`}
          className={`group flex items-center font-bold border border-gray-200 bg-white text-gray-700 hover:text-white hover:border-transparent hover:bg-[#0D2C5B] shadow-sm hover:shadow-md transition-all active:scale-95 ${sizeClasses[size]}`}
        >
          <Globe className={`${iconSizes[size]} text-[#00B5C8] group-hover:text-white transition-colors`} />
          {showLabels && <span>Website</span>}
        </a>
      )}
    </div>
  );
}
