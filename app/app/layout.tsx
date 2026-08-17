'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserProvider, useUser } from '@/lib/user-context';
import {
  LayoutDashboard, Briefcase, FileText, Package, MessageSquare,
  Bell, Star, CalendarDays, User, Settings, LogOut,
  ChevronRight, Menu, X, ArrowLeftRight, Users, Plus,
  ClipboardList
} from 'lucide-react';

const freelancerNav = [
  { href: '/app/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/app/projects', icon: Briefcase, label: 'Projects' },
  { href: '/app/bids', icon: FileText, label: 'My Bids' },
  { href: '/app/packages', icon: Package, label: 'Packages' },
  { href: '/app/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/app/notifications', icon: Bell, label: 'Notifications' },
  { href: '/app/reviews', icon: Star, label: 'Reviews' },
  { href: '/app/events', icon: CalendarDays, label: 'Events' },
  { href: '/app/profile', icon: User, label: 'Profile' },
];

const employerNav = [
  { href: '/app/hiring', icon: LayoutDashboard, label: 'Overview' },
  { href: '/app/hiring/projects/new', icon: Plus, label: 'Post Project' },
  { href: '/app/hiring/projects', icon: Briefcase, label: 'My Projects' },
  { href: '/app/hiring/proposals', icon: ClipboardList, label: 'Proposals' },
  { href: '/app/hiring/creators', icon: Users, label: 'Creators' },
  { href: '/app/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/app/notifications', icon: Bell, label: 'Notifications' },
  { href: '/app/events', icon: CalendarDays, label: 'Events' },
  { href: '/app/profile', icon: User, label: 'Profile' },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, switchRole, logout } = useUser();
  const isEmployer = user.activeRole === 'employer';
  const navItems = isEmployer ? employerNav : freelancerNav;

  return (
    <div style={{
      width: '220px',
      background: 'var(--navy)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'block' }}>
          <Image
            src="/brand/logo.webp"
            alt="TNCC"
            width={100}
            height={34}
            style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '32px', filter: 'brightness(0) invert(1)' }}
          />
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '10px',
          padding: '8px 12px',
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Mode</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isEmployer ? 'var(--orange)' : 'var(--cyan)', marginTop: '1px' }}>
              {isEmployer ? 'Hiring' : 'Creator'}
            </div>
          </div>
          <button
            onClick={() => switchRole(isEmployer ? 'freelancer' : 'employer')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
            }}
            title="Switch role"
          >
            <ArrowLeftRight size={14} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
              style={{ marginBottom: '2px' }}
              onClick={onClose}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '4px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.8rem',
            fontFamily: 'var(--font-display)',
            flexShrink: 0,
          }}>
            {user.name ? user.name[0] : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name || 'Your Name'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email || 'your@email.com'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="sidebar-nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-100)' }}>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,26,58,0.7)',
              zIndex: 49,
            }}
          />
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* Main content */}
      <div style={{ marginLeft: 0 }} className="app-main">
        {/* Mobile top bar */}
        <div className="mobile-topbar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', padding: '4px' }}
          >
            <Menu size={22} />
          </button>
          <Image
            src="/brand/logo.webp"
            alt="TNCC"
            width={100}
            height={32}
            style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '28px' }}
          />
          <div style={{ width: '30px' }} />
        </div>

        {children}
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
          .mobile-topbar { display: none !important; }
          .app-main { margin-left: 220px !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppContent>{children}</AppContent>
    </UserProvider>
  );
}
