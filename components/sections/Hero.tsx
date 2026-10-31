'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, ArrowUpRight, Zap, Users, Briefcase, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic import for client-only 3D logo rendering without any jarring loading text
const Hero3DLogo = dynamic(() => import('./Hero3DLogo'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

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

// Elastic snap entrance card component with floating idle loop
function ElasticEntranceCard({
  children,
  style,
  delay = 0,
  floatType,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  floatType: 'karthik' | 'project';
}) {
  const [isFloating, setIsFloating] = useState(false);

  const xKeyframes = [100, 120, -15, 5, -1, 0];
  const scaleKeyframes = [0.96, 0.96, 1.02, 0.995, 1.002, 1];
  const opacityKeyframes = [0, 0.1, 1, 1, 1, 1];

  const getFloatingAnimate = () => {
    switch (floatType) {
      case 'karthik':
        return { y: [0, -10, 0] };
      case 'project':
        return { y: [0, -6, 0], x: [0, 5, 0] };
      default:
        return {};
    }
  };

  const getFloatingTransition = (): any => {
    switch (floatType) {
      case 'karthik':
        return { repeat: Infinity, duration: 6, ease: 'easeInOut' };
      case 'project':
        return {
          y: { repeat: Infinity, duration: 7.5, ease: 'easeInOut' },
          x: { repeat: Infinity, duration: 7.5, ease: 'easeInOut' },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={isFloating ? undefined : { x: 100, opacity: 0, scale: 0.96 }}
      animate={isFloating ? getFloatingAnimate() : {
        x: xKeyframes,
        scale: scaleKeyframes,
        opacity: opacityKeyframes,
      }}
      transition={isFloating ? getFloatingTransition() : {
        duration: 0.95,
        delay: delay / 1000,
        times: [0, 0.15, 0.45, 0.7, 0.85, 1],
        ease: 'easeOut',
      }}
      onAnimationComplete={() => {
        if (!isFloating) setIsFloating(true);
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

// 1st Card: Creator Preview Card (Top-Left Edge)
// 1st Card: Creator Preview Card (Top-Left Overlapping Edge)
function CreatorPreviewCard({
  name,
  title,
  location,
  color,
  delay,
  floatType,
}: {
  name: string;
  title: string;
  location: string;
  color: string;
  delay: number;
  floatType: 'karthik';
}) {
  return (
    <ElasticEntranceCard delay={delay} floatType={floatType} style={{
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '14px',
      padding: '8px 12px',
      boxShadow: '0 12px 30px rgba(13,44,91,0.13), 0 2px 6px rgba(13,44,91,0.05)',
      border: '1px solid rgba(13,44,91,0.08)',
      minWidth: '150px',
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
        }}>
          {name[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--navy)', lineHeight: 1.15 }}>{name}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--gray-500)' }}>{title}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <MapPin size={10} color="var(--gray-400)" />
          <span style={{ fontSize: '0.64rem', color: 'var(--gray-400)' }}>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '0.62rem', color: '#F5A623' }}>★★★★★</span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--gray-500)', marginLeft: '1px' }}>4.9</span>
        </div>
      </div>
    </ElasticEntranceCard>
  );
}

// 2nd Card: Project Opportunity Card (Bottom-Right Overlapping Edge)
function ProjectPreviewCard({
  title,
  budget,
  category,
  proposals = '8 proposals',
  delay,
  floatType,
}: {
  title: string;
  budget: string;
  category: string;
  proposals?: string;
  delay: number;
  floatType: 'project';
}) {
  return (
    <ElasticEntranceCard delay={delay} floatType={floatType} style={{
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '14px',
      padding: '9px 12px',
      boxShadow: '0 12px 30px rgba(13,44,91,0.13), 0 2px 6px rgba(13,44,91,0.05)',
      border: '1px solid rgba(13,44,91,0.08)',
      minWidth: '170px',
      maxWidth: '190px',
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{
          fontSize: '0.58rem',
          fontWeight: 700,
          padding: '1.5px 6px',
          borderRadius: '100px',
          background: 'rgba(0,181,200,0.1)',
          color: 'var(--cyan)',
        }}>
          {category}
        </span>
        <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          Open
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.74rem', color: 'var(--navy)', marginBottom: '5px', lineHeight: 1.25 }}>
        {title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--navy)', fontSize: '0.82rem' }}>{budget}</span>
        <span style={{ fontSize: '0.62rem', color: 'var(--gray-500)', fontWeight: 500 }}>{proposals}</span>
      </div>
    </ElasticEntranceCard>
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
      className="hero-section"
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

      <div className="container hero-container" style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="hero-grid">

          {/* Left: Text content */}
          <div style={{ maxWidth: '620px' }}>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-label" style={{ marginBottom: '24px' }}>
                TAMIL NADU&apos;S CREATOR COMMUNITY
              </div>
            </motion.div>

            {/* Headline - 3 lines */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 4.2vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.01em',
                color: 'var(--navy)',
                marginBottom: '24px',
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block' }}
                className="whitespace-normal sm:whitespace-nowrap"
              >
                WHERE TAMIL NADU&apos;S
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block', color: 'var(--orange)' }}
                className="whitespace-normal sm:whitespace-nowrap"
              >
                CREATORS CONNECT,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'block' }}
                className="whitespace-normal sm:whitespace-nowrap"
              >
                CREATE &amp; GROW.
              </motion.span>
            </h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                lineHeight: 1.6,
                color: 'var(--gray-600)',
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              A free community for designers, video editors, photographers,
              filmmakers and AI creators. Share your creativity, participate in competitions, showcase your work and grow together.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <Link
                href="/community/auth?mode=register"
                className="btn btn-primary btn-lg"
                style={{
                  boxShadow: '0 8px 24px rgba(232,64,32,0.35)',
                }}
              >
                JOIN THE COMMUNITY
                <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
              <Link
                href="#about"
                className="btn btn-secondary btn-lg"
              >
                EXPLORE TNCC
                <ArrowUpRight size={16} style={{ marginLeft: '6px' }} />
              </Link>
            </motion.div>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                fontSize: '0.8rem',
                color: 'var(--gray-400)',
                marginBottom: '40px',
              }}
            >
              A space for every creative mind.
            </motion.p>

            {/* Stat pills row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="hero-stats-row"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <StatPill icon={Users} value="1,240+" label="Active creators" color="var(--cyan)" delay={0.7} />
              <StatPill icon={Briefcase} value="48+" label="Creative challenges" color="var(--orange)" delay={0.8} />
              <StatPill icon={Zap} value="27" label="Cities in Tamil Nadu" color="var(--yellow)" delay={0.9} />
            </motion.div>
          </div>

          {/* Right: Interactive 3D Tamil Nadu Logo with Layered Edge Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hero-3d-wrapper hidden lg:flex lg:translate-x-6 xl:translate-x-12"
          >
            {/* Top-Left Floating Creator Card (Layered Over 3D Logo) */}
            <div
              style={{
                position: 'absolute',
                top: '15%',
                left: '12px',
                zIndex: 25,
                pointerEvents: 'none',
              }}
              className="hidden sm:block"
            >
              <CreatorPreviewCard
                name="Karthik"
                title="Brand Designer"
                location="Chennai"
                color="var(--navy)"
                delay={150}
                floatType="karthik"
              />
            </div>

            {/* Central 3D Logo Canvas (Enlarged & Never Cut Off) */}
            <div style={{ width: '100%', height: '100%', minHeight: 'inherit', position: 'relative', zIndex: 10 }}>
              <Hero3DLogo />
            </div>

            {/* Bottom-Right Floating Project Card (Layered Over 3D Logo) */}
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '4px',
                zIndex: 25,
                pointerEvents: 'none',
              }}
              className="hidden sm:block"
            >
              <ProjectPreviewCard
                title="Brand Identity for Organic Startup"
                budget="₹15K–25K"
                category="Graphic Design"
                proposals="8 proposals"
                delay={300}
                floatType="project"
              />
            </div>
          </motion.div>
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

      </section>
  );
}
