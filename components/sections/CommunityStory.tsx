'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const words = [
  {
    word: 'LEARN',
    color: 'var(--cyan)',
    tagline: 'Workshops, bootcamps, and hands-on sessions across Tamil Nadu.',
    detail: 'From content creation to design systems — TNCC is where creators grow their skills alongside peers.',
    number: '14+',
    numLabel: 'events hosted',
  },
  {
    word: 'CONNECT',
    color: 'var(--orange)',
    tagline: "The right conversation can change where your career goes.",
    detail: 'Meetups in Chennai, Coimbatore, Vellore, and beyond. A community that feels like yours.',
    number: '1,240+',
    numLabel: 'active members',
  },
  {
    word: 'GROW',
    color: 'var(--navy)',
    tagline: 'More projects. Better clients. Stronger work.',
    detail: 'Creators on TNCC report finding consistent work within their first three months. The platform grows with you.',
    number: '₹85L+',
    numLabel: 'paid to creators',
  },
  {
    word: 'IMPACT',
    color: 'var(--yellow)',
    tagline: "Creative work that matters — to clients, to communities, to you.",
    detail: 'From a tiny startup in Vellore to a film production in Chennai. Tamil Nadu\'s creative output, amplified.',
    number: '2,100+',
    numLabel: 'successful hires',
  },
];

export default function CommunityStory() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = words[active];

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--navy)',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 0',
      }}
    >
      {/* Background decorative */}
      <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.06 }} aria-hidden="true" />

      {/* Background large word */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(120px, 25vw, 280px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          letterSpacing: '-0.04em',
          userSelect: 'none',
          transition: 'all 0.5s ease',
        }}>
          {current.word}
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Word pills navigation */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '56px' }}>
          {words.map((w, i) => (
            <button
              key={w.word}
              onClick={() => setActive(i)}
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                border: `2px solid ${active === i ? w.color : 'rgba(255,255,255,0.15)'}`,
                background: active === i ? w.color : 'transparent',
                color: active === i ? (w.word === 'GROW' ? 'white' : w.word === 'IMPACT' ? 'var(--navy)' : 'white') : 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {w.word}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
            alignItems: 'center',
          }}
          className="story-grid"
        >
          {/* Text */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: current.color,
              lineHeight: 0.95,
              marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}>
              {current.word}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}>
              {current.tagline}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: '500px',
            }}>
              {current.detail}
            </p>
          </div>

          {/* Stat */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '36px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: current.color,
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              {current.number}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500 }}>
              {current.numLabel}
            </div>
          </div>
        </motion.div>

        {/* Progress line */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '48px' }}>
          {words.map((_, i) => (
            <div
              key={i}
              style={{
                height: '3px',
                flex: 1,
                borderRadius: '2px',
                background: active === i ? current.color : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Tagline footer */}
        <div style={{
          marginTop: '64px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
            Organised by
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.04em',
          }}>
            VALAVAN ACADEMY
          </div>
          <div style={{ flex: 1, minWidth: '120px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.04em',
          }}>
            #TNCC2026
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .story-grid {
            grid-template-columns: 1.5fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
