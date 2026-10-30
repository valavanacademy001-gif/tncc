'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface StackingCardData {
  id: string;
  tag: string;
  tagIcon: React.ElementType;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  accentColor: string;
  borderColor: string;
  ctaBg: string;
  ctaColor: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
}

const stackingCards: StackingCardData[] = [
  {
    id: 'creative-opportunities',
    tag: 'Creative Opportunities',
    tagIcon: Sparkles,
    title: 'YOUR NEXT CREATIVE OPPORTUNITY STARTS HERE.',
    description:
      'Discover creative job openings, hiring announcements and opportunities shared through TNCC. Explore verified openings across Graphic Design, Video Editing, Motion Graphics, UI/UX Design, Photography, AI Creative Work, and Freelance Projects.',
    ctaText: 'JOIN TO EXPLORE OPPORTUNITIES',
    ctaLink: '/community/auth?mode=register',
    bgColor: '#E6F9FC', // TNCC Brand Cyan Tint
    accentColor: '#00B5C8',
    borderColor: 'rgba(0, 181, 200, 0.32)',
    ctaBg: 'var(--navy)',
    ctaColor: 'white',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&auto=format&fit=crop&q=80',
    imageAlt: 'Creative digital team collaborating',
    imagePosition: 'left', // 1st: Image Left
  },
  {
    id: 'community-guidelines',
    tag: 'Community Guidelines',
    tagIcon: ShieldCheck,
    title: 'A COMMUNITY BUILT ON CREATIVITY & RESPECT.',
    description:
      'TNCC thrives on mutual respect and professional integrity. Respect every creator, share original work with proper credits, provide constructive critique, follow competition rules, avoid spam, respect intellectual property, and support other creators across Tamil Nadu.',
    ctaText: 'Join Our Respectful Community',
    ctaLink: '/community/auth?mode=register',
    bgColor: '#FFF0ED', // TNCC Brand Orange Tint
    accentColor: '#E84020',
    borderColor: 'rgba(232, 64, 32, 0.28)',
    ctaBg: 'var(--navy)',
    ctaColor: 'white',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=80',
    imageAlt: 'Strategy and community discussion',
    imagePosition: 'right', // 2nd: Image Right
  },
  {
    id: 'resources-and-portfolio',
    tag: 'Vault & Portfolio',
    tagIcon: Compass,
    title: 'Free Tools, Curated Assets & Verified Portfolio.',
    description:
      'Access useful fonts, design tools, AI websites, tutorials, and recorded sessions. Share your creative works with the community to automatically build your permanent showcase portfolio.',
    ctaText: 'SHOWCASE YOUR WORK – JOIN FREE',
    ctaLink: '/community/auth?mode=register',
    bgColor: '#EEF2FF', // TNCC Brand Navy/Periwinkle Tint
    accentColor: '#0D2C5B',
    borderColor: 'rgba(13, 44, 91, 0.25)',
    ctaBg: 'var(--orange)',
    ctaColor: 'white',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&auto=format&fit=crop&q=80',
    imageAlt: 'Creators studio session',
    imagePosition: 'left', // 3rd: Image Left
  },
];

export default function StackingCards() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Single unified scroll track - eliminates all jitter, unsticking bugs and clipping
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // =========================================================================
  // CARD 0 (1st Card - Cyan) ANIMATIONS
  // Holds full scale until 0.10.
  // Scales 1.0 -> 0.95 and shifts 0 -> -24px as Card 1 arrives (0.10 to 0.42).
  // Holds 0.95 until 0.52.
  // Scales 0.95 -> 0.90 and shifts -24px -> -48px as Card 2 arrives (0.52 to 0.84).
  // Holds final 0.90 scale and -48px offset until 1.00.
  // =========================================================================
  const card0Scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.42, 0.52, 0.84, 1],
    [1, 1, 0.95, 0.95, 0.9, 0.9]
  );
  const card0StackY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.42, 0.52, 0.84, 1],
    [0, 0, -24, -24, -48, -48]
  );
  const card0Brightness = useTransform(
    scrollYProgress,
    [0, 0.1, 0.42, 0.52, 0.84, 1],
    ['brightness(1)', 'brightness(1)', 'brightness(0.98)', 'brightness(0.98)', 'brightness(0.96)', 'brightness(0.96)']
  );

  // =========================================================================
  // CARD 1 (2nd Card - Orange) ANIMATIONS
  // Slides up from bottom (110% -> 0%) between 0.10 and 0.42 at full scale 1.0.
  // Holds full scale until 0.52.
  // Scales 1.0 -> 0.95 and shifts 0 -> -24px as Card 2 arrives (0.52 to 0.84).
  // Holds final 0.95 scale and -24px offset until 1.00.
  // =========================================================================
  const card1SlideY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.42, 1],
    ['110%', '110%', '0%', '0%']
  );
  const card1Scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.42, 0.52, 0.84, 1],
    [1, 1, 1, 1, 0.95, 0.95]
  );
  const card1StackY = useTransform(
    scrollYProgress,
    [0, 0.42, 0.52, 0.84, 1],
    [0, 0, 0, -24, -24]
  );
  const card1Brightness = useTransform(
    scrollYProgress,
    [0, 0.52, 0.84, 1],
    ['brightness(1)', 'brightness(1)', 'brightness(0.98)', 'brightness(0.98)']
  );

  // =========================================================================
  // CARD 2 (3rd Card - Navy) ANIMATIONS
  // Slides up from bottom (110% -> 0%) between 0.52 and 0.84.
  // Stays at full scale 1.0 and 0px offset through completion (0.84 to 1.00).
  // =========================================================================
  const card2SlideY = useTransform(
    scrollYProgress,
    [0, 0.52, 0.84, 1],
    ['110%', '110%', '0%', '0%']
  );

  return (
    <section
      id="stacking-overview"
      ref={trackRef}
      style={{
        background: '#FAF9F6',
        position: 'relative',
        width: '100%',
        height: '280vh', // Controlled scroll distance for smooth progressive animation
        padding: '0 0 40px',
      }}
    >
      {/* Sticky Viewport Stage */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          width: '100%',
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '24px 0 32px',
          overflow: 'visible',
        }}
      >
        {/* Full-width container */}
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', padding: '0 24px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              className="section-label"
              style={{
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              How Collaboration Happens
            </div>
            <h2
              className="text-display-md"
              style={{
                color: 'var(--navy)',
                maxWidth: '760px',
                margin: '0 auto 12px',
                lineHeight: 1.05,
              }}
            >
              Built for creators and brands ready to build together.
            </h2>
            <p
              style={{
                color: 'var(--gray-500)',
                fontSize: '1.05rem',
                maxWidth: '580px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              A seamless, transparent pathway from project discovery to high-impact delivered work.
            </p>
          </div>

          {/* =========================================================================
              DECK STAGE (Relative frame holding all 3 absolute stacked cards)
              Base card position is at top: 48px.
              Card 0 shifts to -48px -> top: 0px (exposed top: 24px)
              Card 1 shifts to -24px -> top: 24px (exposed top: 24px)
              Card 2 stays at 0px -> top: 48px (full front card)
              ========================================================================= */}
          <div
            className="stacking-stage"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '560px',
              height: '570px',
            }}
          >
            {/* ================= CARD 1 (Cyan - Digital Transformation) ================= */}
            <div
              className="stacking-card-slot"
              style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                right: 0,
                zIndex: 1,
                width: '100%',
              }}
            >
              <motion.div
                style={{
                  y: card0StackY,
                  scale: card0Scale,
                  filter: card0Brightness,
                  transformOrigin: 'top center',
                  width: '100%',
                }}
              >
                <div
                  className="stacking-card-box"
                  style={{
                    backgroundColor: stackingCards[0].bgColor,
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04), 0 20px 50px rgba(13, 44, 91, 0.10)',
                    border: `1.5px solid ${stackingCards[0].borderColor}`,
                    display: 'flex',
                    flexDirection: 'row',
                    minHeight: '520px',
                    height: '520px',
                    width: '100%',
                  }}
                >
                  {/* 1st Card: Image Left */}
                  <div className="stacking-card-media" style={{ flex: '1 1 50%', position: 'relative', height: '100%' }}>
                    <img
                      src={stackingCards[0].image}
                      alt={stackingCards[0].imageAlt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  {/* 1st Card: Text Right */}
                  <div
                    className="stacking-card-content"
                    style={{
                      flex: '1 1 50%',
                      padding: '44px 48px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 14px',
                          borderRadius: '100px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          color: stackingCards[0].accentColor,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          border: `1.5px solid ${stackingCards[0].borderColor}`,
                        }}
                      >
                        <Sparkles size={13} strokeWidth={2.4} />
                        {stackingCards[0].tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
                        color: 'var(--navy)',
                        lineHeight: 1.14,
                        letterSpacing: '-0.02em',
                        marginBottom: '16px',
                      }}
                    >
                      {stackingCards[0].title}
                    </h3>
                    <p style={{ fontSize: '1.02rem', lineHeight: 1.62, color: '#374151', marginBottom: '28px', maxWidth: '560px' }}>
                      {stackingCards[0].description}
                    </p>
                    <div>
                      <Link
                        href={stackingCards[0].ctaLink}
                        className="btn"
                        style={{
                          background: stackingCards[0].ctaBg,
                          color: stackingCards[0].ctaColor,
                          borderRadius: '100px',
                          padding: '12px 26px',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 16px rgba(13, 44, 91, 0.18)',
                        }}
                      >
                        {stackingCards[0].ctaText}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ================= CARD 2 (Orange - Our Strategy) ================= */}
            <motion.div
              className="stacking-card-slot"
              style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                right: 0,
                y: card1SlideY,
                zIndex: 2,
                width: '100%',
              }}
            >
              <motion.div
                style={{
                  y: card1StackY,
                  scale: card1Scale,
                  filter: card1Brightness,
                  transformOrigin: 'top center',
                  width: '100%',
                }}
              >
                <div
                  className="stacking-card-box"
                  style={{
                    backgroundColor: stackingCards[1].bgColor,
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 -4px 22px rgba(0, 0, 0, 0.05), 0 22px 55px rgba(13, 44, 91, 0.12)',
                    border: `1.5px solid ${stackingCards[1].borderColor}`,
                    display: 'flex',
                    flexDirection: 'row',
                    minHeight: '520px',
                    height: '520px',
                    width: '100%',
                  }}
                >
                  {/* 2nd Card: Text Left */}
                  <div
                    className="stacking-card-content"
                    style={{
                      flex: '1 1 50%',
                      padding: '44px 48px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 14px',
                          borderRadius: '100px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          color: stackingCards[1].accentColor,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          border: `1.5px solid ${stackingCards[1].borderColor}`,
                        }}
                      >
                        <Compass size={13} strokeWidth={2.4} />
                        {stackingCards[1].tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
                        color: 'var(--navy)',
                        lineHeight: 1.14,
                        letterSpacing: '-0.02em',
                        marginBottom: '16px',
                      }}
                    >
                      {stackingCards[1].title}
                    </h3>
                    <p style={{ fontSize: '1.02rem', lineHeight: 1.62, color: '#374151', marginBottom: '28px', maxWidth: '560px' }}>
                      {stackingCards[1].description}
                    </p>
                    <div>
                      <Link
                        href={stackingCards[1].ctaLink}
                        className="btn"
                        style={{
                          background: stackingCards[1].ctaBg,
                          color: stackingCards[1].ctaColor,
                          borderRadius: '100px',
                          padding: '12px 26px',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 16px rgba(13, 44, 91, 0.18)',
                        }}
                      >
                        {stackingCards[1].ctaText}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                  {/* 2nd Card: Image Right */}
                  <div className="stacking-card-media" style={{ flex: '1 1 50%', position: 'relative', height: '100%' }}>
                    <img
                      src={stackingCards[1].image}
                      alt={stackingCards[1].imageAlt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ================= CARD 3 (Navy - Community Empowerment) ================= */}
            <motion.div
              className="stacking-card-slot"
              style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                right: 0,
                y: card2SlideY,
                zIndex: 3,
                width: '100%',
              }}
            >
              <div
                className="stacking-card-box"
                style={{
                  backgroundColor: stackingCards[2].bgColor,
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.06), 0 25px 65px rgba(13, 44, 91, 0.16)',
                  border: `1.5px solid ${stackingCards[2].borderColor}`,
                  display: 'flex',
                  flexDirection: 'row',
                  minHeight: '520px',
                  height: '520px',
                  width: '100%',
                }}
              >
                {/* 3rd Card: Image Left */}
                <div className="stacking-card-media" style={{ flex: '1 1 50%', position: 'relative', height: '100%' }}>
                  <img
                    src={stackingCards[2].image}
                    alt={stackingCards[2].imageAlt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </div>
                {/* 3rd Card: Text Right */}
                <div
                  className="stacking-card-content"
                  style={{
                    flex: '1 1 50%',
                    padding: '44px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 14px',
                        borderRadius: '100px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        color: stackingCards[2].accentColor,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        border: `1.5px solid ${stackingCards[2].borderColor}`,
                      }}
                    >
                      <ShieldCheck size={13} strokeWidth={2.4} />
                      {stackingCards[2].tag}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
                      color: 'var(--navy)',
                      lineHeight: 1.14,
                      letterSpacing: '-0.02em',
                      marginBottom: '16px',
                    }}
                  >
                    {stackingCards[2].title}
                  </h3>
                  <p style={{ fontSize: '1.02rem', lineHeight: 1.62, color: '#374151', marginBottom: '28px', maxWidth: '560px' }}>
                    {stackingCards[2].description}
                  </p>
                  <div>
                    <Link
                      href={stackingCards[2].ctaLink}
                      className="btn"
                      style={{
                        background: stackingCards[2].ctaBg,
                        color: stackingCards[2].ctaColor,
                        borderRadius: '100px',
                        padding: '12px 26px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(232, 64, 32, 0.28)',
                      }}
                    >
                      {stackingCards[2].ctaText}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .stacking-stage {
            height: auto !important;
            min-height: 520px !important;
          }
          .stacking-card-box {
            flex-direction: column !important;
            height: auto !important;
            min-height: 500px !important;
          }
          .stacking-card-media {
            height: 220px !important;
            flex: none !important;
          }
          .stacking-card-content {
            padding: 28px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
