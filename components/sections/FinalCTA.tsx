'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Animated connection line background
function CTAConnectionLine() {
  return (
    <svg
      viewBox="0 0 1200 300"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.08,
      }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cta-thread" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#00B5C8" />
          <stop offset="40%" stopColor="#E84020" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <path
        d="M 0 150 Q 200 80 400 160 Q 600 240 800 120 Q 1000 0 1200 150"
        fill="none"
        stroke="url(#cta-thread)"
        strokeWidth="2"
        strokeDasharray="12 8"
      />
      <path
        d="M 0 200 Q 300 120 600 200 Q 900 280 1200 180"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeDasharray="6 10"
      />
      {/* Nodes along path */}
      <circle cx="200" cy="115" r="4" fill="#00B5C8" />
      <circle cx="600" cy="215" r="5" fill="#E84020" />
      <circle cx="1000" cy="85" r="4" fill="#F5A623" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section style={{
      background: 'var(--navy)',
      position: 'relative',
      overflow: 'hidden',
      padding: '96px 0',
    }}>
      {/* Background */}
      <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} aria-hidden="true" />
      <CTAConnectionLine />

      {/* Oversized background text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-2%',
          fontSize: 'clamp(80px, 14vw, 180px)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          userSelect: 'none',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        TNCC 2026
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--cyan)',
            marginBottom: '32px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-soft 2s ease-in-out infinite' }} />
            Tamil Nadu Creators Club
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            color: 'white',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          Your next collaboration<br />
          <span style={{ color: 'var(--orange)' }}>could start here.</span>
        </motion.h2>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            marginBottom: '48px',
            maxWidth: '500px',
            marginInline: 'auto',
            lineHeight: 1.65,
          }}
        >
          Thousands of creators and businesses already building, working, and growing through TNCC.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}
        >
          <Link href="/app" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
            Find your next opportunity
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/app/hiring"
            className="btn btn-lg cta-ghost"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '100px',
              padding: '16px 32px',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            Build with a creator
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginTop: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '1,240+', label: 'Creators' },
            { value: '3,800+', label: 'Projects' },
            { value: '27', label: 'Cities' },
            { value: '₹85L+', label: 'Paid out' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* LEARN CONNECT GROW IMPACT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            marginTop: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            flexWrap: 'wrap',
          }}
        >
          {['LEARN', 'CONNECT', 'GROW', 'IMPACT'].map((word, i) => (
            <span key={word} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                letterSpacing: '0.12em',
                color: i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--orange)' : i === 2 ? 'var(--yellow)' : 'rgba(255,255,255,0.5)',
              }}>
                {word}
              </span>
              {i < 3 && (
                <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>●</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .cta-ghost:hover {
          background: rgba(255,255,255,0.18) !important;
          border-color: rgba(255,255,255,0.4) !important;
        }
      `}</style>
    </section>
  );
}
