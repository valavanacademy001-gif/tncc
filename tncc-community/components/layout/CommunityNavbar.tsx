'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCommunity } from '../../lib/community-context';
import { useUser } from '@/lib/user-context';
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
  Briefcase
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand & Community Tag */}
        <div className="flex items-center gap-3">
          <Link href="/community" className="flex items-center gap-2.5 group">
            <Image
              src="/brand/logo.webp"
              alt="Tamil Nadu Creators Club"
              width={145}
              height={44}
              style={{ objectFit: 'contain', height: 'auto', maxHeight: '38px', width: 'auto' }}
              className="transition-transform group-hover:scale-105"
              priority
            />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#E84020]/10 text-[#E84020] border border-[#E84020]/20">
              COMMUNITY
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, creators, resources & challenges..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#F8F6F1] hover:bg-gray-100 focus:bg-white rounded-full border border-gray-200 focus:border-[#0D2C5B] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons & Member Status */}
        <div className="flex items-center gap-3">
          {/* XP Badge & Meter */}
          <Link 
            href="/community/leaderboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0D2C5B] to-[#1B3F7E] text-white shadow-sm hover:shadow transition-all group"
            title="Your Total Experience Points"
          >
            <div className="w-5 h-5 rounded-full bg-[#E84020] flex items-center justify-center text-xs text-white">
              ⚡
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-extrabold leading-none text-[#FFF8EC] group-hover:text-white">
                {currentMember?.total_xp || 0} XP
              </span>
              <span className="text-[9px] font-medium text-gray-300 leading-tight">
                {memberLevel.title}
              </span>
            </div>
          </Link>

          {/* Quick Create Post Button */}
          {onOpenComposer && (
            <button
              onClick={onOpenComposer}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-full text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post</span>
            </button>
          )}

          {/* Admin Suite Button in Header if Admin */}
          {isAdmin && (
            <Link
              href="/community/admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0D2C5B] font-extrabold text-xs shadow-sm hover:shadow transition-all"
              title="Open TNCC Administration Suite"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Suite</span>
            </Link>
          )}

          {/* Sign Out Button in Header */}
          <button
            onClick={handleSignOut}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50/70 border border-transparent hover:border-red-200 transition-all cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          {/* Member Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#0D2C5B]/20 transition-all"
            >
              <img
                src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentMember?.full_name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-up"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0D2C5B] truncate">{currentMember?.full_name}</p>
                    {isAdmin && (
                      <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-200">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">@{currentMember?.username}</p>
                  <p className="text-[10px] text-[#E84020] font-semibold mt-0.5">ID: {currentMember?.member_id}</p>
                </div>

                {/* Administration Dropdown Menu Section */}
                {isAdmin && (
                  <>
                    <div className="px-4 py-1.5 bg-amber-50/80 border-b border-amber-200/50 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        Admin Controls
                      </span>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="text-[10px] font-bold text-amber-700 hover:underline"
                      >
                        Dashboard →
                      </Link>
                    </div>

                    <div className="py-1 bg-amber-50/20 border-b border-gray-100">
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                        Admin Reports
                      </Link>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
                      >
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        User Management
                      </Link>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        Resource Management
                      </Link>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Event Management
                      </Link>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        Challenges & Winners
                      </Link>
                      <Link
                        href="/community/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-800 hover:bg-amber-100/60 font-semibold"
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
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    My Creator Profile
                  </Link>
                  <Link
                    href="/community/leaderboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Award className="w-3.5 h-3.5 text-gray-400" />
                    Community Leaderboard
                  </Link>
                </div>

                {/* Verified Admin Status Indicator */}
                {isAdmin && (
                  <div className="border-t border-amber-100 bg-amber-50/70 px-4 py-2 text-[11px] text-amber-900 font-bold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Access Active</span>
                    </div>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">VERIFIED</span>
                  </div>
                )}

                {/* Sign Out */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
