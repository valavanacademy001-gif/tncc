'use client';

import { useState } from 'react';
import { MapPin, ArrowRight, Sparkles, BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

interface Pillar {
  id: string;
  word: string;
  number: string;
  category: string;
  tagline: string;
  detail: string;
  statNumber: string;
  statLabel: string;
  location: string;
  bgGradient: string;
  accentColor: string;
  chips: string[];
  ctaText: string;
  ctaLink: string;
  icon: typeof BookOpen;
}

const pillars: Pillar[] = [
  {
    id: 'learn',
    word: 'LEARN',
    number: '01',
    category: 'WORKSHOPS & BOOTCAMPS',
    tagline: 'Practical masterclasses & skill sprints across Tamil Nadu.',
    detail:
      'From Tamil typography and Figma design systems to DaVinci Resolve color grading, 3D Blender, and AI creative workflows. Practical sessions led by active industry professionals.',
    statNumber: '18+',
    statLabel: 'workshops hosted',
    location: 'Across Tamil Nadu',
    bgGradient: 'linear-gradient(155deg, #00A3B5 0%, #006D7A 100%)',
    accentColor: '#00B5C8',
    chips: ['UI/UX Design', 'Video Production', 'Tamil Typography', '3D & AI Art'],
    ctaText: 'Explore Workshops',
    ctaLink: '/events',
    icon: BookOpen,
  },
  {
    id: 'connect',
    word: 'CONNECT',
    number: '02',
    category: 'COMMUNITY & MEETUPS',
    tagline: 'Ego-free creator hangouts & lifelong statewide friendships.',
    detail:
      'Offline meetups in Chennai, Coimbatore, Madurai, Salem, and beyond. Meet designers, editors, filmmakers, and builders to trade feedback, co-create, and collaborate.',
    statNumber: '1,240+',
    statLabel: 'active creators',
    location: 'Chennai • Coimbatore • Madurai',
    bgGradient: 'linear-gradient(155deg, #E84020 0%, #AB270D 100%)',
    accentColor: '#E84020',
    chips: ['Creator Meetups', 'Feedback Circles', 'Discord Lounge', 'State Chapters'],
    ctaText: 'Join the Community',
    ctaLink: '/join',
    icon: Users,
  },
  {
    id: 'create',
    word: 'CREATE',
    number: '03',
    category: 'CHALLENGES & BOUNTIES',
    tagline: 'Weekly brand briefs, video remixes & cash prize bounties.',
    detail:
      'Test your craft against real briefs from Tamil Nadu brands. Win cash prizes, collect XP badges, climb the statewide leaderboard, and earn recognized bragging rights.',
    statNumber: '₹2.5L+',
    statLabel: 'bounties rewarded',
    location: 'Weekly State Contests',
    bgGradient: 'linear-gradient(155deg, #1B3F7E 0%, #0B2247 100%)',
    accentColor: '#1B3F7E',
    chips: ['Brand Briefs', 'Reel Remixes', 'Cash Bounties', 'Leaderboard XP'],
    ctaText: 'Explore Challenges',
    ctaLink: '/community/challenges',
    icon: Sparkles,
  },
  {
    id: 'showcase',
    word: 'SHOWCASE',
    number: '04',
    category: 'VERIFIED PORTFOLIOS',
    tagline: 'Your verified creative identity discovered by top studios.',
    detail:
      'Build a verified creator portfolio showcasing your best graphic design, video edits, 3D renders, and UI mockups. Ranked by XP and craft merit, not algorithm tricks.',
    statNumber: '350+',
    statLabel: 'verified works',
    location: 'Chennai to Kanyakumari',
    bgGradient: 'linear-gradient(155deg, #10B981 0%, #047857 100%)',
    accentColor: '#059669',
    chips: ['Creator Directory', 'Verified Badges', 'Client Discovery', 'Behance Sync'],
    ctaText: 'Browse Portfolios',
    ctaLink: '/community/portfolio',
    icon: Award,
  },
  {
    id: 'grow',
    word: 'GROW',
    number: '05',
    category: 'CLIENT GIGS & CAREERS',
    tagline: 'High-value freelance gigs, studio hiring & Valavan mentorship.',
    detail:
      'Connect directly with startups, D2C brands, and film studios hiring Tamil creators. Supported by Valavan Academy mentorship to help you price right and work with confidence.',
    statNumber: '₹85L+',
    statLabel: 'paid to creators',
    location: 'Statewide Opportunities',
    bgGradient: 'linear-gradient(155deg, #D98200 0%, #8C5200 100%)',
    accentColor: '#F5A623',
    chips: ['Direct Client Leads', 'Pricing Guidance', 'Agency Retainers', 'Valavan Mentorship'],
    ctaText: 'Find Creator Gigs',
    ctaLink: '/community/feed',
    icon: TrendingUp,
  },
];

export default function CommunityStory() {
  const [active, setActive] = useState(0);

  const current = pillars[active];

  return (
    <section
      id="pillars"
      style={{
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: '110px 0 90px',
      }}
    >
      {/* Background subtle dot pattern */}
      <div
        className="bg-dot-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Background large word watermark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(140px, 28vw, 360px)',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(13, 44, 91, 0.04)',
            letterSpacing: '-0.04em',
            userSelect: 'none',
            transition: 'all 0.5s ease',
          }}
        >
          {current.word}
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header (Light Theme on White) */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              background: 'rgba(232, 64, 32, 0.08)',
              border: '1px solid rgba(232, 64, 32, 0.2)',
              color: 'var(--orange)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={13} />
            COMMUNITY PILLARS
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)',
              color: 'var(--navy)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            The Pillars That Power TNCC
          </h2>

          <p
            style={{
              color: '#4B5563',
              fontSize: 'clamp(1rem, 1.7vw, 1.125rem)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Uniting Tamil Nadu’s designers, video editors, and creative builders statewide.
            <br className="hidden sm:inline" />
            {' '}Collaborate, showcase verified craft, and unlock high-value career opportunities.
          </p>
        </div>

        {/* Word pills navigation bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {pillars.map((p, i) => {
            const isSelected = active === i;
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={`View ${p.word} pillar`}
                style={{
                  padding: '9px 22px',
                  borderRadius: '100px',
                  border: `1.5px solid ${
                    isSelected ? p.accentColor : '#E5E7EB'
                  }`,
                  background: isSelected ? p.accentColor : '#F9FAFB',
                  color: isSelected ? '#FFFFFF' : '#4B5563',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.25s ease',
                  boxShadow: isSelected
                    ? `0 6px 18px ${p.accentColor}35`
                    : 'none',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSelected ? '#FFFFFF' : '#9CA3AF',
                    transition: 'all 0.25s ease',
                  }}
                />
                <span style={{ opacity: isSelected ? 0.8 : 0.6, fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
                  {p.number}
                </span>
                {p.word}
              </button>
            );
          })}
        </div>

        {/* ============================================================
            EXPANDING ACCORDION CARDS (5 Pillars)
            Rock-solid layout: Collapsed cards have fixed 58px width,
            Active card takes flex: 1 1 0% without resizing flicker.
            ============================================================ */}
        <div
          className="tncc-accordion-container"
          style={{
            display: 'flex',
            gap: '12px',
            height: '490px',
            width: '100%',
            maxWidth: '940px',
            margin: '0 auto',
          }}
        >
          {pillars.map((p, i) => {
            const isExpanded = active === i;
            const IconComponent = p.icon;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`tncc-accordion-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                style={{
                  background: p.bgGradient,
                  borderRadius: '24px',
                  boxShadow: isExpanded
                    ? '0 24px 50px rgba(13, 44, 91, 0.22), 0 8px 20px rgba(0, 0, 0, 0.08)'
                    : '0 4px 16px rgba(13, 44, 91, 0.08)',
                  cursor: isExpanded ? 'default' : 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  /* Smooth flex transition with strictly fixed collapsed size */
                  flex: isExpanded ? '1 1 0%' : '0 0 58px',
                  minWidth: isExpanded ? '0' : '58px',
                  maxWidth: isExpanded ? '100%' : '58px',
                  transition: 'flex 0.5s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
                }}
              >
                {/* Collapsed State Spine (Always fixed at 58px width, fades out smoothly on expand) */}
                <div
                  className="card-spine"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '58px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px 6px',
                    zIndex: 2,
                    pointerEvents: isExpanded ? 'none' : 'auto',
                    opacity: isExpanded ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {/* Number 01-05 at top */}
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      letterSpacing: '0.02em',
                      color: '#FFFFFF',
                      lineHeight: 1,
                    }}
                  >
                    {p.number}
                  </div>

                  {/* Rotated text along spine (reading bottom-to-top like reference) */}
                  <div
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      letterSpacing: '0.12em',
                      color: 'rgba(255, 255, 255, 0.92)',
                      textTransform: 'uppercase',
                      padding: '8px 0',
                    }}
                  >
                    {p.word}
                  </div>

                  {/* Small icon indicator at bottom */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                  >
                    <IconComponent size={15} />
                  </div>
                </div>

                {/* Expanded Content View (Absolute positioned inside card so it never shifts flex width) */}
                <div
                  className="card-expanded-content"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '28px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 3,
                    overflowY: 'auto',
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? 'translateX(0)' : 'translateX(20px)',
                    pointerEvents: isExpanded ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease 0.12s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
                  }}
                >
                  {/* Top Header Row */}
                  <div>
                    {/* Number (with subtle low opacity) & Category row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '2.5rem',
                          letterSpacing: '-0.02em',
                          color: 'rgba(255, 255, 255, 0.28)', // Low opacity as requested
                          lineHeight: 1,
                        }}
                      >
                        {p.number}
                      </div>

                      <div
                        style={{
                          padding: '5px 14px',
                          borderRadius: '100px',
                          background: 'rgba(255, 255, 255, 0.16)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.22)',
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.category}
                      </div>
                    </div>

                    {/* Big Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                        color: '#FFFFFF',
                        lineHeight: 1.05,
                        letterSpacing: '-0.02em',
                        marginBottom: '8px',
                      }}
                    >
                      {p.word}
                    </h3>

                    {/* Location / Scope badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'rgba(255, 255, 255, 0.88)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        marginBottom: '20px',
                      }}
                    >
                      <MapPin size={15} style={{ color: '#FFFFFF' }} />
                      <span>{p.location}</span>
                    </div>

                    {/* Hairline Divider */}
                    <div
                      style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        width: '100%',
                        marginBottom: '18px',
                      }}
                    />

                    {/* Tagline Lead (bold) */}
                    <p
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                        lineHeight: 1.45,
                        marginBottom: '12px',
                      }}
                    >
                      {p.tagline}
                    </p>

                    {/* Full Detail Paragraph */}
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.82)',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        maxWidth: '640px',
                        marginBottom: '22px',
                      }}
                    >
                      {p.detail}
                    </p>

                    {/* Feature Chips */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {p.chips.map((chip) => (
                        <span
                          key={chip}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: '#FFFFFF',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metric & CTA Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px',
                      flexWrap: 'wrap',
                      paddingTop: '18px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.16)',
                      marginTop: '16px',
                    }}
                  >
                    {/* Metric stat pill */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: 'clamp(1.75rem, 2.4vw, 2.3rem)',
                          color: '#FFFFFF',
                          lineHeight: 1,
                        }}
                      >
                        {p.statNumber}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {p.statLabel}
                      </span>
                    </div>

                    {/* CTA Link */}
                    <Link
                      href={p.ctaLink}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 22px',
                        borderRadius: '100px',
                        background: '#FFFFFF',
                        color: 'var(--navy)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        transition: 'all 0.25s ease',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                      }}
                    >
                      <span>{p.ctaText}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress line tracking active pillar */}
        <div style={{ display: 'flex', gap: '8px', maxWidth: '860px', margin: '32px auto 0', width: '100%' }}>
          {pillars.map((p, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                height: '4px',
                flex: active === i ? 2 : 1,
                borderRadius: '3px',
                background:
                  active === i ? p.accentColor : '#E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>

        {/* Tagline footer (Light Theme) */}
        <div
          style={{
            marginTop: '56px',
            paddingTop: '28px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
            Organised by
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'var(--navy)',
              letterSpacing: '0.06em',
            }}
          >
            VALAVAN ACADEMY
          </div>
          <div
            style={{
              flex: 1,
              minWidth: '120px',
              height: '1px',
              background: '#E5E7EB',
            }}
          />
          <div
            style={{
              fontSize: '0.8rem',
              color: '#9CA3AF',
              letterSpacing: '0.06em',
              fontWeight: 500,
            }}
          >
            #TNCC2026
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .tncc-accordion-container {
            flex-direction: column !important;
            height: auto !important;
            gap: 12px !important;
          }
          .tncc-accordion-card {
            flex: none !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            transition: height 0.4s ease !important;
          }
          .tncc-accordion-card.is-collapsed {
            height: 64px !important;
          }
          .tncc-accordion-card.is-expanded {
            height: 480px !important;
          }
          .card-spine {
            width: 100% !important;
            height: 64px !important;
            flex-direction: row !important;
            padding: 14px 18px !important;
          }
          .card-spine > div:nth-child(2) {
            writing-mode: horizontal-tb !important;
            transform: none !important;
          }
          .card-expanded-content {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
