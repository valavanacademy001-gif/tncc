'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';

const competitionCategories = [
  'Social Media Poster Design',
  'Thumbnail Design',
  'Logo Design',
  'Branding',
  'Typography',
  'AI Image Creation',
  'Video Editing',
  'Creative Experiments',
];

const stages = [
  {
    id: 'discover',
    step: '01',
    title: 'DISCOVER A CHALLENGE',
    headline: 'Find your next creative\ncompetition.',
    body: 'Explore upcoming poster, thumbnail, branding, and video editing challenges organized across Tamil Nadu with transparent briefs and clear judging criteria.',
    color: 'var(--cyan)',
    bg: 'var(--cyan-light)',
    nodeLabel: 'DISCOVER',
    coords: '13.08°N · 80.27°E',
  },
  {
    id: 'create',
    step: '02',
    title: 'CREATE YOUR WORK',
    headline: 'Push boundaries with\noriginal concepts.',
    body: 'Turn ideas into high-craft design and video creations. Build original visual compositions, motion graphics, typography hierarchies, or innovative AI artwork.',
    color: 'var(--navy)',
    bg: '#EEF2FF',
    nodeLabel: 'CREATE',
    coords: '11.00°N · 76.96°E',
  },
  {
    id: 'submit',
    step: '03',
    title: 'SUBMIT YOUR ENTRY',
    headline: 'Upload work and\nearn challenge XP.',
    body: 'Submit your entry before the deadline with high-resolution image, video, or Google Drive link. Receive instant challenge submission XP for your participation.',
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
    nodeLabel: 'SUBMIT',
    coords: '9.93°N · 78.11°E',
  },
  {
    id: 'recognize',
    step: '04',
    title: 'GET RECOGNIZED',
    headline: 'Podium finishes &\nstatewide spotlight.',
    body: 'Community judges and votes determine the Top 3 winners. Earn certificates, trophies, cash awards, and up to +100 bonus XP for your creator ranking.',
    color: '#10B981',
    bg: '#DCFCE7',
    nodeLabel: 'RECOGNIZE',
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
        paddingTop: '20px',
        paddingBottom: '80px',
      }}
    >
      {/* Pinned desktop layout */}
      <div style={{ position: 'relative' }}>
        {/* Mobile: sequential cards */}
        <div className="mobile-stages container">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '28px 0',
                borderBottom: i < stages.length - 1 ? '1px solid var(--gray-200)' : 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '180vh' }}>
              {/* Left: sticky text */}
              <div style={{ position: 'sticky', top: '70px', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 48px 0 24px' }}>
                <div style={{ maxWidth: '440px', width: '100%' }}>
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

                  {/* Step indicators directly under content */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '36px' }}>
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
              <div style={{ position: 'sticky', top: '70px', height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    <line x1="200" y1="60" x2="340" y2="200" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="340" y1="200" x2="200" y2="340" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="200" y1="340" x2="60" y2="200" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="60" y1="200" x2="200" y2="60" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 4" />

                    {activeStage > 0 && <line x1="200" y1="60" x2="340" y2="200" stroke={stages[1].color} strokeWidth="2" opacity="0.5" />}
                    {activeStage > 1 && <line x1="340" y1="200" x2="200" y2="340" stroke={stages[2].color} strokeWidth="2" opacity="0.5" />}
                    {activeStage > 2 && <line x1="200" y1="340" x2="60" y2="200" stroke={stages[3].color} strokeWidth="2" opacity="0.5" />}

                    <NetworkNode label="DISCOVER" x={200} y={60} color={stages[0].color} active={activeStage >= 0} />
                    <NetworkNode label="CREATE" x={340} y={200} color={stages[1].color} active={activeStage >= 1} />
                    <NetworkNode label="SUBMIT" x={200} y={340} color={stages[2].color} active={activeStage >= 2} />
                    <NetworkNode label="RECOGNIZE" x={60} y={200} color={stages[3].color} active={activeStage >= 3} />

                    <circle cx={200} cy={200} r={34} fill="white" stroke="var(--gray-200)" strokeWidth="1.5" />
                    <image
                      href="/brand/tncc-symbol.png"
                      x={184}
                      y={179}
                      width={32}
                      height={42}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/community/auth?mode=register" className="btn btn-primary btn-lg">
          JOIN TO PARTICIPATE
          <ArrowRight size={18} />
        </Link>
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
