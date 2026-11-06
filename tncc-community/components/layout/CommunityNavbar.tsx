'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCommunity } from '../../lib/community-context';
import { useUser } from '@/lib/user-context';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { 
  Sparkles, 
  Search, 
  Bell, 
  PlusCircle, 
  ChevronDown, 
  ShieldCheck,
  Award,
  User, 
  LogOut,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Trophy,
  Briefcase,
  Gift,
  LogIn
} from 'lucide-react';

export default function CommunityNavbar({ onOpenComposer }: { onOpenComposer?: () => void }) {
  const router = useRouter();
  const { currentMember, memberLevel, isAdmin, toggleAdminMode } = useCommunity();
  const { logout } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tncc_user');
        localStorage.removeItem('tncc_session');
        localStorage.removeItem('tncc_admin_demo');
        localStorage.removeItem('tncc_active_user_email');
        localStorage.removeItem('tncc_current_member_id');
      }
      router.push('/community/auth');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#171C24]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#303846] transition-colors duration-200">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Community Tag */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/community" className="flex items-center gap-2 group">
            <Image
              src="/brand/logo.webp"
              alt="Tamil Nadu Creators Club"
              width={130}
              height={38}
              style={{ objectFit: 'contain', height: 'auto', maxHeight: '34px', width: 'auto' }}
              className="transition-transform group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, creators, resources & challenges..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#F8F6F1] dark:bg-[#1D2430] hover:bg-gray-100 dark:hover:bg-[#252E3E] focus:bg-white dark:focus:bg-[#1D2430] rounded-full border border-gray-200 dark:border-[#303846] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 focus:border-[#0D2C5B] dark:focus:border-[#00B5C8] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Member Status */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* XP Badge & Meter */}
          <Link 
            href="/community/leaderboard"
            className="h-8 sm:h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-[#0D2C5B] to-[#1B3F7E] text-white shadow-xs hover:shadow transition-all group shrink-0"
            title="Your Total Experience Points"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#E84020] flex items-center justify-center text-[10px] sm:text-xs text-white shrink-0">
              ⚡
            </div>
            <div className="flex items-center text-left">
              <span 
                className="text-[11px] sm:text-xs md:text-sm font-extrabold leading-none text-[#FFF8EC] group-hover:text-white"
                suppressHydrationWarning
              >
                {currentMember?.total_xp || 0} XP
              </span>
            </div>
          </Link>

          {/* Quick Create Post Button */}
          {onOpenComposer && (
            <button
              onClick={onOpenComposer}
              className="h-8 sm:h-9 hidden sm:flex items-center justify-center gap-1.5 px-3 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-full text-xs font-bold transition-all shadow-xs hover:shadow active:scale-95 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post</span>
            </button>
          )}

          {/* Admin Suite Button in Header if Admin */}
          {isAdmin && (
            <Link
              href="/community/admin"
              className="h-8 sm:h-9 hidden md:flex items-center justify-center gap-1.5 px-3 rounded-full bg-[#0D2C5B] dark:bg-[#1D2430] hover:bg-[#1B3F7E] text-white font-extrabold text-xs shadow-xs hover:shadow transition-all shrink-0 border border-white/10 dark:border-white/20"
              title="Open TNCC Administration Suite"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Suite</span>
            </Link>
          )}

          {/* Sign Out Button in Header */}
          <button
            onClick={handleSignOut}
            className="h-8 sm:h-9 hidden sm:flex items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 px-2.5 rounded-full hover:bg-red-50/70 dark:hover:bg-red-950/30 transition-all cursor-pointer shrink-0"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>

          {/* Member Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#0D2C5B]/20 dark:hover:ring-white/20 transition-all cursor-pointer"
            >
              <img
                src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentMember?.full_name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1D2430] rounded-2xl shadow-xl border border-gray-100 dark:border-[#303846] py-2 z-50 animate-scale-up"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-[#303846]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0D2C5B] dark:text-[#F5F7FA] truncate">{currentMember?.full_name}</p>
                      {isAdmin && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-700">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">@{currentMember?.username}</p>
                    <p className="text-[10px] text-[#E84020] font-semibold mt-0.5">ID: {currentMember?.member_id}</p>
                  </div>

                  {/* Administration Dropdown Menu Section */}
                  {isAdmin && (
                    <>
                      <div className="px-4 py-1.5 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/50 dark:border-amber-800/40 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Admin Controls
                        </span>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                        >
                          Dashboard →
                        </Link>
                      </div>

                      <div className="py-1 bg-amber-50/20 dark:bg-amber-950/20 border-b border-gray-100 dark:border-[#303846]">
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                          Admin Reports
                        </Link>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <Users className="w-3.5 h-3.5 text-amber-600" />
                          User Management
                        </Link>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          Resource Management
                        </Link>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          Event Management
                        </Link>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <Trophy className="w-3.5 h-3.5 text-amber-600" />
                          Challenges & Winners
                        </Link>
                        <Link
                          href="/community/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 dark:text-gray-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                          Hiring & Jobs
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Standard Creator Links */}
                  <div className="py-1">
                    <Link
                      href="/community/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      My Creator Profile
                    </Link>
                    <Link
                      href="/community/leaderboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      Community Leaderboard
                    </Link>
                  </div>

                  {/* Verified Admin Status Indicator */}
                  {isAdmin && (
                    <div className="border-t border-amber-100 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-950/40 px-4 py-2 text-[11px] text-amber-900 dark:text-amber-300 font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Admin Access Active</span>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 dark:bg-amber-800 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-extrabold">VERIFIED</span>
                    </div>
                  )}

                  {/* Sign In / Switch Account & Sign Out */}
                  <div className="border-t border-gray-100 dark:border-[#303846] pt-1">
                    <Link
                      href="/community/auth?mode=login"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#0D2C5B] dark:text-[#00CDE0] hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-left font-semibold transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#0D2C5B] dark:text-[#00CDE0]" />
                      Sign In / Switch Account
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
