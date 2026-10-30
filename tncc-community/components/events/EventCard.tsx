'use client';

import React from 'react';
import { CommunityEvent } from '../../lib/types';
import { Calendar, Clock, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function EventCard({ event }: { event: CommunityEvent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group">
      {/* Banner */}
      <div className="relative md:w-2/5 aspect-[16/9] md:aspect-auto overflow-hidden bg-gray-100">
        <img
          src={event.banner_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#0D2C5B] text-white shadow">
          {event.status}
        </div>
        {event.is_online && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00B5C8] text-white shadow">
            <Globe className="w-3 h-3" />
            <span>Virtual</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 font-semibold text-[#E84020]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.event_date}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.event_time}</span>
            </div>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-[#0D2C5B] group-hover:text-[#E84020] transition-colors leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 pt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400">
            Free Community Access
          </span>
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
          >
            <span>Register Free</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
