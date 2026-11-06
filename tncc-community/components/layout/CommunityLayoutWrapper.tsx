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
      <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#101318] text-[#0D2C5B] dark:text-[#F5F7FA] font-sans antialiased flex flex-col justify-center items-center p-4 transition-colors duration-200">
        <main className="w-full flex items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#101318] text-[#0D2C5B] dark:text-[#F5F7FA] font-sans antialiased selection:bg-[#E84020] selection:text-white flex flex-col transition-colors duration-200">
      {/* Top Navbar Header */}
      <CommunityNavbar onOpenComposer={() => setShowComposer(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 flex items-start">
        {/* Left Sidebar for Desktop */}
        <CommunitySidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0 py-4 sm:py-6 md:pl-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#171C24]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#303846] px-2 sm:px-4 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg transition-colors"
      >
        {mobileNav.map((item, idx) => {
          const Icon = item.icon;
          if (item.action) {
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                aria-label="Create New Post"
                className="flex flex-col items-center justify-center p-1 text-[#E84020] touch-manipulation active:scale-95 cursor-pointer"
              >
                <div className="w-10 h-10 -mt-5 rounded-full bg-[#E84020] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#171C24]">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-0.5 text-[#E84020]">Post</span>
              </button>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={idx}
              href={item.href!}
              aria-label={item.name}
              className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-semibold transition-colors touch-manipulation ${
                isActive 
                  ? 'text-[#0D2C5B] dark:text-[#F5A623] font-bold' 
                  : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#E84020] dark:text-[#FF5733]' : 'text-gray-400 dark:text-gray-400'}`} />
              <span className="truncate max-w-[64px]">{item.name}</span>
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
