'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Floating card component
function FloatingCard({ children, style, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Elastic snap entrance card component
function ElasticEntranceCard({
  children,
  style,
  delay = 0,
  floatType,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  floatType: 'karthik' | 'deepika' | 'project' | 'badge' | 'priya';
}) {
  const [isFloating, setIsFloating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (reducedMotion) {
    return (
      <div style={{ ...style, opacity: 1, transform: 'none' }}>
        {children}
      </div>
    );
  }

  // Elastic snap parameters:
  // Start offset: x=140
  // Build tension: x=165
  // Shoot left: x=-20
  // Pull back right snap: x=6
  // Small correction left: x=-1.5
  // Settle at: x=0
  const xKeyframes = [140, 165, -20, 6, -1.5, 0];
  const scaleKeyframes = [0.96, 0.96, 1.02, 0.995, 1.002, 1];
  const opacityKeyframes = [0, 0.1, 1, 1, 1, 1];
  const keyframeTimes = [0, 0.15, 0.45, 0.7, 0.85, 1];
  const easings = [
    "easeOut",
    [0.25, 1.2, 0.35, 1.15],
    [0.4, 0, 0.2, 1],
    "easeInOut",
    "easeInOut",
  ];

  // Floating animations
  const getFloatingAnimate = () => {
    switch (floatType) {
      case 'karthik':
        return { y: [0, -10, 0] };
      case 'deepika':
        return { y: [0, 10, 0] };
      case 'priya':
        return { y: [0, -7, 0] };
      case 'project':
        return { y: [0, -4, 0], x: [0, 4, 0] };
      case 'badge':
        return { scale: [1, 1.02, 1] };
      default:
        return {};
    }
  };

  const getFloatingTransition = () => {
    switch (floatType) {
      case 'karthik':
        return { repeat: Infinity, duration: 6, ease: "easeInOut" };
      case 'deepika':
        return { repeat: Infinity, duration: 7, ease: "easeInOut" };
      case 'priya':
        return { repeat: Infinity, duration: 7.5, ease: "easeInOut" };
      case 'project':
        return {
          y: { repeat: Infinity, duration: 8, ease: "easeInOut" },
          x: { repeat: Infinity, duration: 8, ease: "easeInOut" },
        };
      case 'badge':
        return { repeat: Infinity, duration: 4.5, ease: "easeInOut" };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={isFloating ? undefined : { x: 140, opacity: 0, scale: 0.96 }}
      animate={isFloating ? getFloatingAnimate() : {
        x: xKeyframes,
        scale: scaleKeyframes,
        opacity: opacityKeyframes,
      }}
      transition={isFloating ? (getFloatingTransition() as any) : ({
        duration: 1.15,
        delay: delay / 1000,
        times: keyframeTimes,
        ease: easings as any,
      } as any)}
      onAnimationComplete={() => {
        if (!isFloating) {
          setIsFloating(true);
        }
      }}
      style={{
        ...style,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  );
}


// Animated connection thread (SVG)
function ConnectionThread() {
  return (
    <svg
      viewBox="0 0 600 500"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.12,
      }}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="thread-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B5C8" />
          <stop offset="50%" stopColor="#E84020" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      {/* Main thread path */}
      <path
        id="connection-path"
        d="M 80 80 Q 200 60 280 160 Q 360 260 440 200 Q 520 140 520 300 Q 520 440 400 420"
        fill="none"
        stroke="url(#thread-grad)"
        strokeWidth="2"
        strokeDasharray="8 6"
        style={{
          strokeDashoffset: 0,
          animation: 'drawLine 3s ease-out forwards',
        }}
      />
      {/* Traveling Glowing Particle */}
      <circle r="4.5" fill="var(--orange)" style={{ filter: 'drop-shadow(0 0 5px var(--orange))' }}>
        <animateMotion
          dur="9s"
          repeatCount="indefinite"
          path="M 80 80 Q 200 60 280 160 Q 360 260 440 200 Q 520 140 520 300 Q 520 440 400 420"
        />
      </circle>
      {/* Nodes */}
      <circle cx="80" cy="80" r="5" fill="#00B5C8" opacity="0.8" />
      <circle cx="280" cy="160" r="4" fill="#E84020" opacity="0.8" />
      <circle cx="440" cy="200" r="4" fill="#F5A623" opacity="0.8" />
      <circle cx="400" cy="420" r="5" fill="#00B5C8" opacity="0.8" />
      {/* Coordinate labels */}
      <text x="90" y="76" fontSize="8" fill="#0D2C5B" opacity="0.5" fontFamily="monospace">13.08°N</text>
      <text x="450" y="196" fontSize="8" fill="#0D2C5B" opacity="0.5" fontFamily="monospace">11.66°N</text>
    </svg>
  );
}

// TN State silhouette (abstract, decorative)
function TNSilhouette() {
  return (
    <div style={{
      position: 'absolute',
      right: '-5%',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '55%',
      height: '90%',
      pointerEvents: 'none',
      opacity: 0.04,
    }}>
      <svg viewBox="0 0 300 600" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <path
          d="M 160 20 L 190 40 L 220 60 L 240 100 L 250 140 L 245 180 L 260 220 L 255 260 L 240 300 L 230 340 L 200 380 L 180 420 L 160 460 L 140 490 L 120 520 L 110 500 L 100 470 L 90 440 L 80 400 L 70 360 L 60 320 L 70 280 L 80 240 L 70 200 L 80 160 L 100 120 L 120 80 L 140 50 Z"
          fill="var(--navy)"
        />
      </svg>
    </div>
  );
}

// Creator card preview
function CreatorPreviewCard({ name, title, location, color, delay, floatType }: { name: string; title: string; location: string; color: string; delay: number; floatType: 'karthik' | 'deepika' | 'priya' }) {
  return (
    <ElasticEntranceCard delay={delay} floatType={floatType} style={{
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(13,44,91,0.14)',
      border: '1px solid rgba(13,44,91,0.06)',
      minWidth: '200px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
        }}>
          {name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)' }}>{name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{title}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
        <MapPin size={11} color="var(--gray-400)" />
        <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{location}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {['★★★★★'].map((stars, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: '#F5A623' }}>{stars}</span>
        ))}
        <span style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginLeft: '2px' }}>4.9</span>
      </div>
    </ElasticEntranceCard>
  );
}

// Project card preview
function ProjectPreviewCard({ title, budget, category, delay, floatType }: { title: string; budget: string; category: string; delay: number; floatType: 'project' }) {
  return (
    <ElasticEntranceCard delay={delay} floatType={floatType} style={{
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 32px rgba(13,44,91,0.14)',
      border: '1px solid rgba(13,44,91,0.06)',
      minWidth: '220px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{category}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
          Open
        </div>
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.4 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>₹{budget}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>8 proposals</span>
      </div>
    </ElasticEntranceCard>
  );
}

// Stats pill
function StatPill({ icon: Icon, value, label, color, delay }: { icon: React.ElementType; value: string; label: string; color: string; delay: number }) {
  return (
    <FloatingCard delay={delay} style={{
      background: 'white',
      borderRadius: '100px',
      padding: '10px 16px',
      boxShadow: '0 4px 16px rgba(13,44,91,0.1)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      border: '1px solid rgba(13,44,91,0.06)',
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={14} color="white" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem', color: 'var(--navy)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--gray-500)' }}>{label}</div>
      </div>
    </FloatingCard>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '80px',
      }}
    >
      {/* Background grid */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} aria-hidden="true" />

      {/* TN Silhouette */}
      <TNSilhouette />

      {/* Connection thread */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ConnectionThread />
      </div>

      {/* Oversized background letter */}
      <div style={{
        position: 'absolute',
        left: '-4%',
        bottom: '-15%',
        fontSize: 'clamp(200px, 35vw, 500px)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(13,44,91,0.05)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }} aria-hidden="true">
        TN
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, padding: '80px 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '48px',
          alignItems: 'center',
        }} className="hero-grid">

          {/* Left: Text content */}
          <div style={{ maxWidth: '640px' }}>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-label" style={{ marginBottom: '24px' }}>
                Tamil Nadu's Creative Platform
              </div>
            </motion.div>

            {/* Headline */}
            <h1 className="text-display-xl" style={{ color: 'var(--navy)', marginBottom: '24px' }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block' }}
              >
                Good work starts
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block', color: 'var(--orange)' }}
              >
                with the right
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block' }}
              >
                connection.
              </motion.span>
            </h1>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg"
              style={{ color: 'var(--gray-600)', maxWidth: '480px', marginBottom: '36px' }}
            >
              TNCC brings Tamil Nadu's creators, businesses, projects, and opportunities 
              into one living creative network — from Chennai to Kanyakumari.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}
            >
              <Link href="/app" className="btn btn-primary btn-lg">
                I'm a Freelancer
                <ArrowRight size={18} />
              </Link>
              <Link href="/app/hiring" className="btn btn-secondary btn-lg">
                I'm Hiring
              </Link>
            </motion.div>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
            >
              <StatPill icon={Users} value="1,240+" label="Active creators" color="var(--cyan)" delay={0.7} />
              <StatPill icon={Briefcase} value="3,800+" label="Projects posted" color="var(--orange)" delay={0.8} />
              <StatPill icon={Zap} value="27" label="Cities covered" color="var(--yellow)" delay={0.9} />
            </motion.div>
          </div>

          {/* Right: Visual composition */}
          <div style={{
            position: 'relative',
            height: '480px',
            display: 'none',
          }} className="hero-visual">
            {/* Creator cards */}
            <div style={{ position: 'absolute', top: '0', left: '0' }}>
              <CreatorPreviewCard name="Karthik" title="Brand Designer" location="Chennai" color="var(--navy)" delay={0} floatType="karthik" />
            </div>
            <div style={{ position: 'absolute', top: '140px', right: '20px' }}>
              <CreatorPreviewCard name="Priya" title="UI/UX Designer" location="Coimbatore" color="var(--cyan)" delay={240} floatType="priya" />
            </div>
            <div style={{ position: 'absolute', bottom: '100px', left: '30px' }}>
              <CreatorPreviewCard name="Deepika" title="Content Creator" location="Vellore" color="var(--yellow)" delay={320} floatType="deepika" />
            </div>

            {/* Project card */}
            <div style={{ position: 'absolute', top: '80px', right: '0' }}>
              <ProjectPreviewCard title="Brand Identity for Organic Startup" budget="15K–25K" category="Graphic Design" delay={180} floatType="project" />
            </div>

            {/* Live indicator */}
            <ElasticEntranceCard delay={500} floatType="badge" style={{
              position: 'absolute',
              bottom: '60px',
              right: '0',
              background: 'var(--navy)',
              color: 'white',
              borderRadius: '100px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(13,44,91,0.18)',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
                animation: 'pulse-soft 1.5s ease-in-out infinite',
              }} />
              7 projects posted today
            </ElasticEntranceCard>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-400)', fontWeight: 600 }}>Scroll</span>
        <div style={{
          width: '1px',
          height: '32px',
          background: 'linear-gradient(to bottom, var(--gray-400), transparent)',
          animation: 'float 1.5s ease-in-out infinite',
        }} />
      </motion.div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-visual {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
