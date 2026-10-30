'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, ArrowUpRight, Zap, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic import for client-only 3D logo rendering
const Hero3DLogo = dynamic(() => import('./Hero3DLogo'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-[#00B5C8]/30 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#E84020] border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-bold tracking-wider uppercase text-gray-400">
        Loading 3D Logo...
      </span>
    </div>
  ),
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
          <div style={{ maxWidth: '720px' }}>
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

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg"
              style={{ color: 'var(--gray-600)', maxWidth: '540px', marginBottom: '32px' }}
            >
              A free community for designers, video editors, photographers, filmmakers and AI creators. Share your creativity, participate in competitions, showcase your work and grow together.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link
                  href="/community/auth?mode=register"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>JOIN THE COMMUNITY</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="#about" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>EXPLORE TNCC</span>
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--gray-500)', fontWeight: 500, margin: '4px 0 0' }}>
                A space for every creative mind.
              </p>
            </motion.div>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
            >
              <StatPill icon={Users} value="1,240+" label="Active creators" color="var(--cyan)" delay={0.7} />
              <StatPill icon={Briefcase} value="48+" label="Creative challenges" color="var(--orange)" delay={0.8} />
              <StatPill icon={Zap} value="27" label="Cities in Tamil Nadu" color="var(--yellow)" delay={0.9} />
            </motion.div>
          </div>

          {/* Right: Interactive 3D Tamil Nadu Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hero-3d-wrapper"
          >
            <Hero3DLogo />
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

      <style jsx>{`
        .hero-3d-wrapper {
          height: 440px;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        @media (min-width: 768px) {
          .hero-3d-wrapper {
            height: 540px;
            min-height: 480px;
          }
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1.05fr !important;
            gap: 32px !important;
          }
          .hero-3d-wrapper {
            height: 660px !important;
            min-height: 600px !important;
          }
        }
        @media (min-width: 1280px) {
          .hero-grid {
            grid-template-columns: 1fr 1.12fr !important;
            gap: 40px !important;
          }
          .hero-3d-wrapper {
            height: 720px !important;
            min-height: 660px !important;
          }
        }
      `}</style>
    </section>
  );
}
