'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProjects, mockCreators, mockPackages, mockEvents } from '@/lib/mock-data';
import Link from 'next/link';
import { MapPin, Users, Clock, Star, Calendar, ArrowRight, Heart, Bookmark, Sparkles, Send } from 'lucide-react';
import Image from 'next/image';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'creators' | 'packages' | 'events'>('projects');
  const [savedItems, setSavedItems] = useState<{ projects: string[]; creators: string[]; packages: string[]; events: string[] }>({
    projects: [],
    creators: [],
    packages: [],
    events: [],
  });

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSave = (type: 'projects' | 'creators' | 'packages' | 'events', id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = { ...savedItems };
    if (updated[type].includes(id)) {
      updated[type] = updated[type].filter(item => item !== id);
    } else {
      updated[type] = [...updated[type], id];
    }
    setSavedItems(updated);
    localStorage.setItem('tncc_saved', JSON.stringify(updated));
  };

  const featuredProject = mockProjects[0];
  const hotProjects = mockProjects.slice(1, 3);
  const featuredCreator = mockCreators[0];
  const creatorList = mockCreators.slice(1, 6);
  const featuredPackage = mockPackages[0];
  const trendingPackages = mockPackages.slice(1, 4);
  const highlightedEvent = mockEvents[0];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Explore Hero */}
        <div style={{ background: 'var(--navy)', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
          {/* Connection thread background */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path d="M-50 200 C300 50, 600 350, 1250 200" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeDasharray="10 6" />
          </svg>

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              Explore TNCC
            </div>
            <h1 className="text-display-lg" style={{ color: 'white', maxWidth: '640px', lineHeight: 1 }}>
              Find the work, people and ideas worth your attention.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', marginTop: '16px', maxWidth: '440px' }}>
              Tamil Nadu's creative catalog — projects, professionals, packages, and meetups in one place.
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          position: 'sticky',
          top: '64px',
          zIndex: 90,
        }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', padding: '16px 0 0 0' }}>
              {[
                { id: 'projects' as const, label: 'Projects Pool', count: mockProjects.length },
                { id: 'creators' as const, label: 'Creator Network', count: mockCreators.length },
                { id: 'packages' as const, label: 'Creative Packages', count: mockPackages.length },
                { id: 'events' as const, label: 'Community Events', count: mockEvents.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0 0 16px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `3px solid ${activeTab === tab.id ? 'var(--orange)' : 'transparent'}`,
                    color: activeTab === tab.id ? 'var(--navy)' : 'var(--gray-500)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)' }}>({tab.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editorial Feed */}
        <div className="section" style={{ paddingBottom: '96px' }}>
          <div className="container">
            
            {/* 1. Feature Banner (Asymmetric Layout) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '64px' }} className="explore-hero-grid">
              <div style={{
                background: 'var(--navy)',
                borderRadius: '32px',
                padding: '40px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                border: '2px solid rgba(255,255,255,0.06)',
                boxShadow: '0 24px 64px rgba(8,26,58,0.18)',
              }}>
                <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
                
                <div>
                  <div style={{ color: 'var(--yellow)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <Sparkles size={12} fill="var(--yellow)" />
                    Featured Spotlight
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: 'white', lineHeight: 1.2, maxWidth: '500px', marginBottom: '16px' }}>
                    {featuredProject.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', maxWidth: '440px', lineHeight: 1.6 }}>
                    {featuredProject.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Budget Range</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                      ₹{featuredProject.budget.min.toLocaleString('en-IN')} - ₹{featuredProject.budget.max.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <Link href={`/projects/${featuredProject.id}`} className="btn btn-yellow">
                    Apply for work <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Sub-featured profile */}
              <div style={{
                background: 'white',
                border: '1.5px solid var(--gray-200)',
                borderRadius: '32px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ padding: '4px 10px', background: 'var(--cyan-light)', color: 'var(--cyan)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Creator of the Week
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: featuredCreator.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem' }}>
                      {featuredCreator.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)' }}>{featuredCreator.name}</h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--gray-500)' }}>{featuredCreator.title} · {featuredCreator.location}</p>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    &ldquo;{featuredCreator.bio.slice(0, 140)}...&rdquo;
                  </p>
                </div>
                <Link href={`/creators/${featuredCreator.id}`} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                  View Profile
                </Link>
              </div>
            </div>

            {/* 2. Two-Column Discovery Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', marginBottom: '64px' }} className="explore-two-col">
              {/* Left Column: Trending Projects */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)' }}>Trending Projects</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>Open proposals matching popular requests</p>
                  </div>
                  <Link href="/projects" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700, textDecoration: 'none' }}>See all Projects →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {hotProjects.map(p => {
                    const isSaved = savedItems.projects.includes(p.id);
                    return (
                      <Link href={`/projects/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', gap: '16px' }} className="card-hover-box">
                          <div>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '4px' }}>{p.title}</h4>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', gap: '12px' }}>
                              <span>{p.location}</span>
                              <span>{p.proposals} proposals</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <button
                              onClick={(e) => toggleSave('projects', p.id, e)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                            >
                              <Bookmark size={16} fill={isSaved ? 'var(--orange)' : 'none'} />
                            </button>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>₹{p.budget.max.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Trending Packages */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)' }}>Hot Packages</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>Predefined services ready to start</p>
                  </div>
                  <Link href="/packages" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700, textDecoration: 'none' }}>See all Packages →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {trendingPackages.map(pkg => {
                    const isSaved = savedItems.packages.includes(pkg.id);
                    return (
                      <Link href={`/packages/${pkg.id}`} key={pkg.id} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', gap: '16px' }} className="card-hover-box">
                          <div>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{pkg.category}</span>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginTop: '2px' }}>{pkg.title}</h4>
                            <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '2px' }}>by {pkg.creator} · {pkg.deliveryDays} days delivery</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <button
                              onClick={(e) => toggleSave('packages', pkg.id, e)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                            >
                              <Bookmark size={16} fill={isSaved ? 'var(--orange)' : 'none'} />
                            </button>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--navy)' }}>₹{pkg.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Large Featured Item - Event Highlight */}
            <div style={{
              background: 'white',
              border: '1.5px solid var(--gray-200)',
              borderRadius: '24px',
              padding: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '64px',
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', flex: 1 }}>
                <div style={{ padding: '16px 20px', background: 'var(--orange-light)', color: 'var(--orange)', borderRadius: '16px', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>
                    {new Date(highlightedEvent.date).getDate()}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                    {new Date(highlightedEvent.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                </div>
                <div>
                  <span style={{ padding: '3px 8px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--gray-600)' }}>
                    {highlightedEvent.type}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)', margin: '8px 0' }}>{highlightedEvent.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                    <span>📍 {highlightedEvent.venue} · {highlightedEvent.location}</span>
                    <span>🕒 {highlightedEvent.time}</span>
                    <span style={{ color: 'var(--orange)', fontWeight: 600 }}>🔥 {highlightedEvent.spotsLeft} seats left</span>
                  </div>
                </div>
              </div>
              <Link href={`/events/${highlightedEvent.id}`} className="btn btn-primary" style={{ height: 'fit-content' }}>
                Join Meetup <ArrowRight size={16} />
              </Link>
            </div>

            {/* 4. Horizontal Creator Strip */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)' }}>Meet the Creators</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>Available talents to hire today</p>
                </div>
                <Link href="/creators" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700, textDecoration: 'none' }}>See all Creators →</Link>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
              }} className="horizontal-creator-scroll">
                {creatorList.map(c => {
                  const isSaved = savedItems.creators.includes(c.id);
                  return (
                    <Link href={`/creators/${c.id}`} key={c.id} style={{ textDecoration: 'none', flexShrink: 0 }}>
                      <div style={{
                        width: '220px',
                        background: 'white',
                        border: '1.5px solid var(--gray-200)',
                        borderRadius: '20px',
                        padding: '20px',
                        textAlign: 'center',
                        transition: 'all 0.25s',
                        position: 'relative',
                      }} className="creator-strip-card">
                        <button
                          onClick={(e) => toggleSave('creators', c.id, e)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                        >
                          <Heart size={14} fill={isSaved ? 'var(--orange)' : 'none'} />
                        </button>
                        
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: c.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, margin: '0 auto 12px' }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                        
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '100px',
                          background: 'var(--cream)',
                          color: 'var(--navy)',
                          fontSize: '0.67rem',
                          fontWeight: 700,
                        }}>
                          ₹{c.hourlyRate}/hr
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .card-hover-box:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        .creator-strip-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 6px 20px rgba(13,44,91,0.1) !important;
          transform: translateY(-4px) !important;
        }
        @media (min-width: 992px) {
          .explore-hero-grid {
            grid-template-columns: 1.5fr 1fr !important;
          }
          .explore-two-col {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
