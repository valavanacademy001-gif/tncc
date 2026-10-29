'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CIRCLE_RADIUS = 165; // ~330px diameter matching reference

// Animated connection line background
function CTAConnectionLine({ isInverted = false }: { isInverted?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: isInverted ? 0.12 : 0.08,
      }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={isInverted ? "cta-thread-inv" : "cta-thread"} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={isInverted ? "#0D2C5B" : "#00B5C8"} />
          <stop offset="40%" stopColor={isInverted ? "#0D2C5B" : "#E84020"} />
          <stop offset="100%" stopColor={isInverted ? "#0D2C5B" : "#F5A623"} />
        </linearGradient>
      </defs>
      <path
        d="M 0 150 Q 200 80 400 160 Q 600 240 800 120 Q 1000 0 1200 150"
        fill="none"
        stroke={`url(#${isInverted ? "cta-thread-inv" : "cta-thread"})`}
        strokeWidth="2"
        strokeDasharray="12 8"
      />
      <path
        d="M 0 200 Q 300 120 600 200 Q 900 280 1200 180"
        fill="none"
        stroke={isInverted ? "#0D2C5B" : "white"}
        strokeWidth="1"
        strokeDasharray="6 10"
      />
      <circle cx="200" cy="115" r="4" fill={isInverted ? "#0D2C5B" : "#00B5C8"} />
      <circle cx="600" cy="215" r="5" fill={isInverted ? "#0D2C5B" : "#E84020"} />
      <circle cx="1000" cy="85" r="4" fill={isInverted ? "#0D2C5B" : "#F5A623"} />
    </svg>
  );
}

// Reusable CTA content block to guarantee 100% pixel-perfect alignment between layers
function CTAContent({ isInverted = false }: { isInverted?: boolean }) {
  return (
    <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
      {/* Label */}
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: isInverted ? 'rgba(13, 44, 91, 0.12)' : 'rgba(255, 255, 255, 0.08)',
          border: isInverted ? '1px solid rgba(13, 44, 91, 0.25)' : '1px solid rgba(255, 255, 255, 0.15)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isInverted ? 'var(--navy)' : 'var(--cyan)',
          marginBottom: '32px',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isInverted ? 'var(--navy)' : 'var(--cyan)',
            display: 'inline-block',
          }} />
          Tamil Nadu Creators Club
        </div>
      </div>

      {/* Headline */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
        color: isInverted ? 'var(--navy)' : 'white',
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        marginBottom: '24px',
      }}>
        Your next collaboration<br />
        <span style={{ color: isInverted ? 'var(--navy)' : 'var(--orange)' }}>
          could start here.
        </span>
      </h2>

      {/* Sub text */}
      <p style={{
        color: isInverted ? 'rgba(13, 44, 91, 0.85)' : 'rgba(255, 255, 255, 0.6)',
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        marginBottom: '48px',
        maxWidth: '500px',
        marginInline: 'auto',
        lineHeight: 1.65,
        fontWeight: isInverted ? 500 : 400,
      }}>
        Thousands of creators and businesses already building, working, and growing through TNCC.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {isInverted ? (
          <div
            className="btn btn-lg"
            style={{
              fontSize: '1rem',
              background: 'var(--navy)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              padding: '12px 24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(13, 44, 91, 0.3)',
            }}
          >
            Find your next opportunity
            <ArrowRight size={20} />
          </div>
        ) : (
          <Link href="/app" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
            Find your next opportunity
            <ArrowRight size={20} />
          </Link>
        )}

        {isInverted ? (
          <div
            className="btn btn-lg"
            style={{
              background: 'transparent',
              color: 'var(--navy)',
              border: '2px solid var(--navy)',
              borderRadius: '100px',
              padding: '16px 32px',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            Build with a creator
          </div>
        ) : (
          <Link
            href="/app/hiring"
            className="btn btn-lg cta-ghost"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
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
        )}
      </div>

      {/* Trust signals */}
      <div style={{
        marginTop: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        {[
          { value: '1,240+', label: 'Creators' },
          { value: '3,800+', label: 'Projects' },
          { value: '27', label: 'Cities' },
          { value: '₹85L+', label: 'Paid out' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: isInverted ? 'var(--navy)' : 'white',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: isInverted ? 'rgba(13, 44, 91, 0.7)' : 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* LEARN CONNECT GROW IMPACT */}
      <div style={{
        marginTop: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0',
        flexWrap: 'wrap',
      }}>
        {['LEARN', 'CONNECT', 'GROW', 'IMPACT'].map((word, i) => (
          <span key={word} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(0.75rem, 2vw, 1rem)',
              letterSpacing: '0.12em',
              color: isInverted ? 'var(--navy)' : (i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--orange)' : i === 2 ? 'var(--yellow)' : 'rgba(255, 255, 255, 0.5)'),
            }}>
              {word}
            </span>
            {i < 3 && (
              <span style={{
                margin: '0 12px',
                color: isInverted ? 'rgba(13, 44, 91, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.6rem',
              }}>●</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse coordinates relative to this section
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const circleRadius = useMotionValue(0);

  // Smooth physics-based spring interpolation
  const smoothX = useSpring(mouseX, { damping: 24, stiffness: 220, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 24, stiffness: 220, mass: 0.5 });
  const smoothRadius = useSpring(circleRadius, { damping: 20, stiffness: 200, mass: 0.4 });

  // Dynamic circular clip-path for hover spotlight
  const clipPath = useMotionTemplate`circle(${smoothRadius}px at ${smoothX}px ${smoothY}px)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    circleRadius.set(CIRCLE_RADIUS);
  };

  const handleMouseLeave = () => {
    circleRadius.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--navy)',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 0',
      }}
    >
      {/* ================= BASE LAYER (Original Dark Theme) ================= */}
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
          WebkitTextStroke: '1px rgba(255, 255, 255, 0.04)',
          userSelect: 'none',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        TNCC 2026
      </div>

      <CTAContent isInverted={false} />

      {/* ================= INVERTED SPOTLIGHT LAYER (Cyan Circle Hover) ================= */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--cyan)',
          padding: '96px 0',
          clipPath,
          pointerEvents: 'none',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <CTAConnectionLine isInverted={true} />

        {/* Oversized background text on cyan */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-2%',
            fontSize: 'clamp(80px, 14vw, 180px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(13, 44, 91, 0.08)',
            userSelect: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          TNCC 2026
        </div>

        <CTAContent isInverted={true} />
      </motion.div>

      <style jsx>{`
        .cta-ghost:hover {
          background: rgba(255, 255, 255, 0.18) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </section>
  );
}
