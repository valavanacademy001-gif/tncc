'use client';

import React, { useState } from 'react';
import { CommunityResource } from '../../lib/types';
import { 
  Download, 
  ExternalLink, 
  Calendar, 
  Play, 
  Globe, 
  FileText 
} from 'lucide-react';

interface ResourceCardProps {
  resource: CommunityResource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [showModal, setShowModal] = useState(false);

  // Dynamic context-aware button label and icon based on resource type
  const getButtonAction = () => {
    switch (resource.category) {
      case 'Downloads':
        return {
          label: resource.is_google_drive ? 'Download Pack' : 'Download',
          icon: <Download className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'Feeds / Videos':
        return {
          label: 'Watch Now',
          icon: <Play className="w-3.5 h-3.5 shrink-0 fill-current" />,
        };
      case 'Useful Websites':
        return {
          label: 'Visit Website',
          icon: <Globe className="w-3.5 h-3.5 shrink-0" />,
        };
      case 'Blog Posts':
        return {
          label: 'Read Article',
          icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
        };
      default:
        return {
          label: 'Access Link',
          icon: <ExternalLink className="w-3.5 h-3.5 shrink-0" />,
        };
    }
  };

  const action = getButtonAction();

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
        {/* Clean Thumbnail WITHOUT overlay badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Category tag & Date placed cleanly below the image */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#E84020] uppercase tracking-wider">
                {resource.category} · {resource.resource_type}
              </span>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{new Date(resource.published_date).toLocaleDateString()}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm sm:text-base text-[#0D2C5B] group-hover:text-[#E84020] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
              {resource.title}
            </h3>

            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[2rem]">
              {resource.description}
            </p>
          </div>

          {/* Action Row - STRICTLY SINGLE LINE (no double line wrapping) */}
          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2.5">
            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:text-[#0D2C5B] bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors whitespace-nowrap shrink-0"
            >
              Details
            </button>
            <a
              href={resource.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              {action.icon}
              <span>{action.label}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scale-up">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
              <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#E84020] uppercase tracking-wider">{resource.category} · {resource.resource_type}</span>
              <h2 className="text-lg font-bold text-[#0D2C5B] mt-1">{resource.title}</h2>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{resource.description}</p>
            </div>

            <div className="p-3 bg-[#F8F6F1] rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-gray-500">
                <span>Published Date:</span>
                <span className="font-semibold text-gray-700">{resource.published_date}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Access Type:</span>
                <span className="font-semibold text-gray-700">{resource.is_google_drive ? 'Public Google Drive' : 'Verified Web Resource'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Downloads / Accesses:</span>
                <span className="font-semibold text-gray-700">{resource.download_count} creators</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <a
                href={resource.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                {action.icon}
                <span>{action.label}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
