'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Briefcase, User, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { mockCreators, mockProjects } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

export default function Navbar() {
  const { user, switchRole } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDemoAdmin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tncc_admin_demo', 'true');
      try {
        const stored = localStorage.getItem('tncc_community_members');
        if (stored) {
          const members = JSON.parse(stored);
          const updated = members.map((m: any) =>
            m.id === 'mem-current' ? { ...m, role: 'admin' } : m
          );
          localStorage.setItem('tncc_community_members', JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    }
    router.push('/community');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  const suggestedCreators = mockCreators.slice(0, 2);
  const suggestedProjects = mockProjects.slice(0, 2);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled || searchFocused ? 'rgba(255,255,255,0.98)' : 'transparent',
          backdropFilter: scrolled || searchFocused ? 'blur(12px)' : 'none',
          boxShadow: scrolled || searchFocused ? '0 1px 0 rgba(13,44,91,0.08)' : 'none',
        }}
      >
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scrolled ? '64px' : '76px',
            transition: 'height 0.3s ease',
            gap: '16px',
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Image
                src="/brand/logo.webp"
                alt="Tamil Nadu Creators Club"
                width={155}
                height={48}
                style={{ objectFit: 'contain', height: 'auto', maxHeight: '42px', width: 'auto' }}
                priority
              />
            </Link>

            {/* Desktop Search Bar */}
            <div
              ref={searchRef}
              style={{
                position: 'relative',
                flex: '0 1 280px',
                display: 'none',
              }}
              className="search-desktop-wrapper"
            >
              <form onSubmit={handleSearchSubmit}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
                  <input
                    type="search"
                    placeholder="Search projects, creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '100px',
                      border: '1.5px solid var(--gray-200)',
                      background: 'var(--gray-100)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    className="search-input-header"
                  />
                </div>
              </form>

              {/* Suggestions Panel */}
              {searchFocused && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '380px',
                  background: 'white',
                  border: '1.5px solid var(--gray-200)',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(13,44,91,0.12)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  zIndex: 200,
                }}>
                  {/* Recent Searches */}
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Recent Searches
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {['Salem Farms branding', 'Coimbatore Web Designer', 'Video editor Chennai'].map(q => (
                        <button
                          key={q}
                          onClick={() => handleSuggestionClick(q)}
                          style={{
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: '0.8rem',
                            color: 'var(--gray-600)',
                            padding: '4px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Search size={12} color="var(--gray-400)" />
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Popular Categories
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['UI/UX Design', 'Video & Motion', 'Development'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleSuggestionClick(cat)}
                          style={{
                            background: 'var(--cream)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: '100px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            color: 'var(--navy)',
                            cursor: 'pointer',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Creators */}
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      Suggested Creators
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {suggestedCreators.map(c => (
                        <Link
                          key={c.id}
                          href={`/creators/${c.id}`}
                          onClick={() => setSearchFocused(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                          }}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>{c.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Nav Links */}
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
            }} className="nav-links-desktop">
              {[
                { label: 'About', href: '#about' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Activities', href: '#activities' },
                { label: 'Benefits', href: '#benefits' },
                { label: 'Plans', href: '#pricing' },
                { label: 'FAQ', href: '#faq' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '100px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--navy)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '8px',
            }} className="nav-actions-desktop">
              {user.isAuthenticated ? (
                <>
                  {/* Role Switcher */}
                  {user.roles && user.roles.length > 1 && (
                    <button
                      onClick={() => switchRole(user.activeRole === 'freelancer' ? 'employer' : 'freelancer')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '100px',
                        background: 'var(--cream)',
                        border: '1px solid rgba(13,44,91,0.12)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--navy)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: user.activeRole === 'freelancer' ? 'var(--cyan)' : 'var(--orange)',
                      }} />
                      {user.activeRole === 'freelancer' ? 'Freelancer Mode' : 'Hiring Mode'}
                    </button>
                  )}

                  <Link href="/app/hiring/projects/new" className="btn btn-primary btn-sm">
                    Post a Project
                  </Link>

                  <Link href="/app" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 4px',
                    borderRadius: '100px',
                    background: 'var(--cream)',
                    border: '1px solid rgba(13,44,91,0.08)',
                    textDecoration: 'none',
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--cyan)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {user.name[0]}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)' }}>{user.name.split(' ')[0]}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/community/auth" className="btn btn-ghost" style={{ fontSize: '0.875rem', padding: '8px 14px' }}>
                    Sign in
                  </Link>
                  <Link href="/community/auth?mode=register" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span>Join Free</span>
                  </Link>
                  <button
                    onClick={handleDemoAdmin}
                    className="btn btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, #0D2C5B 0%, #1B3F7E 100%)',
                      color: '#FFFFFF',
                      borderRadius: '100px',
                      padding: '8px 15px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 4px 12px rgba(13, 44, 91, 0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    title="Enter TNCC Community with Demo Admin privileges"
                  >
                    <ShieldCheck size={14} style={{ color: '#F5A623' }} />
                    <span>Demo Admin</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-actions-wrapper">
              <button
                onClick={() => setMobileSearchOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--navy)' }}
                className="mobile-search-btn"
                aria-label="Open search"
              >
                <Search size={22} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="mobile-menu-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--navy)' }}
                aria-label="Open navigation"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Search Overlay */}
      {mobileSearchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'white',
          zIndex: 200,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>Search TNCC</div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', padding: '4px' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearchSubmit}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
              <input
                type="search"
                placeholder="Search projects, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--gray-200)',
                  background: 'var(--gray-100)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
          </form>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Recent Searches
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Salem Farms branding', 'Coimbatore Web Designer', 'Video editor Chennai'].map(q => (
                  <button
                    key={q}
                    onClick={() => handleSuggestionClick(q)}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      color: 'var(--gray-600)',
                      padding: '6px 0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Search size={14} color="var(--gray-400)" />
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Popular Categories
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['UI/UX Design', 'Video & Motion', 'Development'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleSuggestionClick(cat)}
                    style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '100px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      color: 'var(--navy)',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <style jsx>{`
        @media (min-width: 992px) {
          .search-desktop-wrapper { display: block !important; }
          .nav-links-desktop { display: flex !important; }
          .nav-actions-desktop { display: flex !important; }
          .mobile-menu-btn, .mobile-search-btn { display: none !important; }
        }
        @media (max-width: 991px) {
          .nav-links-desktop, .nav-actions-desktop { display: none !important; }
          .mobile-menu-btn, .mobile-search-btn { display: block !important; }
        }
        .nav-link:hover {
          background: rgba(13, 44, 91, 0.07);
          color: var(--navy) !important;
        }
        .search-input-header:focus {
          border-color: var(--navy) !important;
          background: white !important;
          box-shadow: 0 0 0 3px rgba(13,44,91,0.06);
          width: 320px !important;
        }
      `}</style>
    </>
  );
}
