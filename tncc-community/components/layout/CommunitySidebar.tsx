'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Briefcase, 
  FolderKanban, 
  Award, 
  User, 
  Zap,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useCommunity } from '../../lib/community-context';
import { useUser } from '@/lib/user-context';

export const COMMUNITY_NAV_ITEMS = [
  { name: 'Feed', href: '/community', icon: Compass, badge: 'Live' },
  { name: 'Resources', href: '/community/resources', icon: BookOpen },
  { name: 'Events', href: '/community/events', icon: Calendar },
  { name: 'Challenges', href: '/community/challenges', icon: Trophy, badge: 'XP' },
  { name: 'Portfolio', href: '/community/portfolio', icon: FolderKanban },
  { name: 'Freelancing', href: '/community/freelancing', icon: Zap, badge: 'Soon' },
  { name: 'Job Offers', href: '/community/jobs', icon: Briefcase },
  { name: 'Leaderboard', href: '/community/leaderboard', icon: Award },
  { name: 'My Profile', href: '/community/profile', icon: User },
];

export default function CommunitySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentMember, memberLevel, isAdmin } = useCommunity();
  const { logout } = useUser();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tncc_user');
        localStorage.removeItem('tncc_session');
      }
      router.push('/login');
    }
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 pr-4 border-r border-gray-100 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="px-3 pb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Community Hub
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/community/admin"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all group mb-2 border ${
              pathname.startsWith('/community/admin')
                ? 'bg-amber-500 text-[#0D2C5B] shadow-md border-amber-600'
                : 'bg-amber-50/80 text-amber-900 hover:bg-amber-100/80 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-4 h-4 ${pathname.startsWith('/community/admin') ? 'text-[#0D2C5B]' : 'text-amber-600'}`} />
              <span>Admin Hub</span>
            </div>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-amber-200 text-amber-950">
              Admin
            </span>
          </Link>
        )}

        {COMMUNITY_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all group ${
                isActive
                  ? 'bg-[#0D2C5B] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#0D2C5B] hover:bg-[#F8F6F1]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#E84020]' : 'text-gray-400 group-hover:text-[#0D2C5B]'
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'Live'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : item.badge === 'XP'
                      ? 'bg-[#FFF0ED] text-[#E84020] border border-[#E84020]/20'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Creator Level Widget & Sign Out */}
      <div className="space-y-4 pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8F6F1] to-[#FFF8EC] border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#0D2C5B]">Creator Rank</span>
            <span className="text-[11px] font-extrabold text-[#E84020]">
              Lvl {memberLevel.level}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-gray-600 mb-2 truncate">
            {memberLevel.title}
          </p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E84020] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, memberLevel.progressPercentage))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1.5">
            <span>{currentMember?.total_xp} XP</span>
            <span>Next: {memberLevel.nextLevelXp} XP</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 text-xs font-semibold transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600 transition-colors" />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
