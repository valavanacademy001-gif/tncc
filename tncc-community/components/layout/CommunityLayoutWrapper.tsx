'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CommunityNavbar from './CommunityNavbar';
import CommunitySidebar, { COMMUNITY_NAV_ITEMS } from './CommunitySidebar';
import FeedComposer from '../feed/FeedComposer';
import { Compass, BookOpen, Trophy, User, PlusCircle } from 'lucide-react';

export default function CommunityLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showComposer, setShowComposer] = useState(false);

  // Check if current page is signin/signup/auth page
  const isAuthPage = pathname === '/community/auth' || pathname.startsWith('/community/auth');

  // Mobile bottom bar links (top 4 essentials + create)
  const mobileNav = [
    { name: 'Feed', href: '/community', icon: Compass },
    { name: 'Resources', href: '/community/resources', icon: BookOpen },
    { name: 'Post', action: () => setShowComposer(true), icon: PlusCircle, highlight: true },
    { name: 'Challenges', href: '/community/challenges', icon: Trophy },
    { name: 'Profile', href: '/community/profile', icon: User },
  ];

  // If on Auth/Signin page: remove sidebar & dashboard header, show only centered content!
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] text-[#0D2C5B] font-sans antialiased flex flex-col justify-center items-center p-4">
        <main className="w-full flex items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#0D2C5B] font-sans antialiased selection:bg-[#E84020] selection:text-white flex flex-col">
      {/* Top Navbar Header (Image 2) */}
      <CommunityNavbar onOpenComposer={() => setShowComposer(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-start">
        {/* Left Sidebar for Desktop */}
        <CommunitySidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0 py-6 md:pl-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-around">
        {mobileNav.map((item, idx) => {
          const Icon = item.icon;
          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center p-1 text-[#E84020]"
              >
                <div className="w-10 h-10 -mt-5 rounded-full bg-[#E84020] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-1">Post</span>
              </button>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#0D2C5B]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#E84020]' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Post Composer Modal */}
      {showComposer && (
        <FeedComposer
          onClose={() => setShowComposer(false)}
        />
      )}
    </div>
  );
}
