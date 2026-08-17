'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const stages = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover',
    headline: 'The right project\nfinds you.',
    body: 'Browse opportunities curated for your category, location, and skill level. Filter by budget, deadline, and work mode. Never scroll through noise.',
    color: 'var(--cyan)',
    bg: 'var(--cyan-light)',
    nodeLabel: 'CREATOR',
    coords: '13.08°N · 80.27°E',
  },
  {
    id: 'connect',
    step: '02',
    title: 'Connect',
    headline: 'A proposal that\nactually means something.',
    body: 'Write proposals that speak to the project, not a template. Employers see your work, your process, and your thinking — not just your hourly rate.',
    color: 'var(--navy)',
    bg: '#EEF2FF',
    nodeLabel: 'PROJECT',
    coords: '11.00°N · 76.96°E',
  },
  {
    id: 'collaborate',
    step: '03',
    title: 'Collaborate',
    headline: 'Work that works\nfor everyone.',
    body: 'Once selected, the collaboration begins. Clear briefs, open communication, and a shared goal. Good work comes from good working relationships.',
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
    nodeLabel: 'WORK',
    coords: '9.93°N · 78.11°E',
  },
  {
    id: 'grow',
    step: '04',
    title: 'Grow',
    headline: 'Each project adds\nto what you are.',
    body: 'Build your portfolio, collect reviews, and grow your reputation within Tamil Nadu\'s creative community. Every project is a step forward.',
    color: '#10B981',
    bg: '#DCFCE7',
    nodeLabel: 'IMPACT',
    coords: '8.73°N · 77.69°E',
  },
];

function NetworkNode({ label, x, y, color, active }: { label: string; x: number; y: number; color: string; active: boolean }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={active ? 12 : 7} fill={active ? color : 'var(--gray-200)'} style={{ transition: 'all 0.4s ease' }} />
      <circle r={active ? 20 : 10} fill={active ? color : 'transparent'} opacity={0.15} style={{ transition: 'all 0.4s ease' }} />
      <text x={0} y={-20} textAnchor="middle" fontSize={9} fill={active ? color : 'var(--gray-400)'} fontWeight={700} fontFamily="monospace" style={{ transition: 'all 0.4s ease' }}>
        {label}
      </text>
    </g>
  );
}

export default function CreativeNetwork() {
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll through stages
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = -rect.top;
      const total = sectionHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setActiveStage(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const active = stages[activeStage];

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'white',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="section-label" style={{ marginBottom: '16px' }}>How the network works</div>
        <h2 className="text-display-md" style={{ color: 'var(--navy)', maxWidth: '600px', marginBottom: '16px' }}>
          From discovery to delivered work.
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem', maxWidth: '440px' }}>
          A clear path from the right opportunity to the right outcome.
        </p>
      </div>

      {/* Pinned desktop layout */}
      <div style={{ position: 'relative' }}>
        {/* Mobile: sequential cards */}
        <div className="mobile-stages">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '32px 24px',
                borderBottom: i < stages.length - 1 ? '1px solid var(--gray-200)' : 'none',
              }}
            >
              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: stage.bg,
                  border: `2px solid ${stage.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  color: stage.color,
                }}>
                  {stage.step}
                </div>
                {i < stages.length - 1 && (
                  <div style={{ width: '2px', flex: 1, minHeight: '40px', background: 'var(--gray-200)', margin: '8px 0' }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: stage.color, marginBottom: '8px' }}>
                  {stage.title}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '10px', whiteSpace: 'pre-line' }}>
                  {stage.headline}
                </h3>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {stage.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: sticky visual */}
        <div className="desktop-stages" style={{ display: 'none' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '400vh' }}>
            {/* Left: sticky text */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', padding: '0 48px 0 24px' }}>
              <div style={{ maxWidth: '440px' }}>
                {stages.map((stage, i) => (
                  <motion.div
                    key={stage.id}
                    animate={{
                      opacity: activeStage === i ? 1 : 0,
                      y: activeStage === i ? 0 : activeStage > i ? -20 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: activeStage === i ? 'relative' : 'absolute',
                      pointerEvents: activeStage === i ? 'auto' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: stage.color, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.5 }}>{stage.step}</span>
                      {stage.title}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--navy)', marginBottom: '20px', lineHeight: 1.1, whiteSpace: 'pre-line' }}>
                      {stage.headline}
                    </h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                      {stage.body}
                    </p>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage.color, display: 'inline-block' }} />
                      {stage.coords}
                    </div>
                  </motion.div>
                ))}

                {/* Step indicators */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '40px', position: 'absolute', bottom: '80px' }}>
                  {stages.map((stage, i) => (
                    <div
                      key={stage.id}
                      style={{
                        width: activeStage === i ? '32px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: activeStage === i ? stage.color : 'var(--gray-200)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveStage(i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: sticky animated network viz */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'var(--cream)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} aria-hidden="true">
                  {/* Connection lines */}
                  <line x1="200" y1="60" x2="340" y2="200" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="340" y1="200" x2="200" y2="340" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="340" x2="60" y2="200" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="60" y1="200" x2="200" y2="60" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Active connection */}
                  {activeStage > 0 && <line x1="200" y1="60" x2="340" y2="200" stroke={stages[1].color} strokeWidth="2" opacity="0.5" />}
                  {activeStage > 1 && <line x1="340" y1="200" x2="200" y2="340" stroke={stages[2].color} strokeWidth="2" opacity="0.5" />}
                  {activeStage > 2 && <line x1="200" y1="340" x2="60" y2="200" stroke={stages[3].color} strokeWidth="2" opacity="0.5" />}

                  {/* Nodes */}
                  <NetworkNode label="DISCOVER" x={200} y={60} color={stages[0].color} active={activeStage >= 0} />
                  <NetworkNode label="CONNECT" x={340} y={200} color={stages[1].color} active={activeStage >= 1} />
                  <NetworkNode label="WORK" x={200} y={340} color={stages[2].color} active={activeStage >= 2} />
                  <NetworkNode label="GROW" x={60} y={200} color={stages[3].color} active={activeStage >= 3} />

                  {/* Center node */}
                  <circle cx={200} cy={200} r={30} fill="white" stroke="var(--gray-200)" strokeWidth="1.5" />
                  <text x={200} y={196} textAnchor="middle" fontSize={7} fill="var(--navy)" fontWeight={700} fontFamily="var(--font-display)" letterSpacing="1">
                    TNCC
                  </text>
                  <text x={200} y={208} textAnchor="middle" fontSize={6} fill="var(--gray-400)" fontFamily="monospace">
                    NETWORK
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-stages { display: none !important; }
          .desktop-stages { display: block !important; }
        }
      `}</style>
    </section>
  );
}
