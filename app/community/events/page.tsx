'use client';

import React from 'react';
import { useCommunity } from '@/tncc-community/lib/community-context';
import EventCard from '@/tncc-community/components/events/EventCard';
import { Calendar, Sparkles } from 'lucide-react';

export default function EventsPage() {
  const { events } = useCommunity();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">
          COMMUNITY GATHERINGS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C5B] tracking-tight mt-1">
          Upcoming TNCC Creator Events & Workshops
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Connect with creators in real life and join virtual masterclasses hosted across Tamil Nadu.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
