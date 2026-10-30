'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, UserPlus, UploadCloud, Trophy, TrendingUp } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'JOIN THE COMMUNITY',
    desc: 'Create your free TNCC account and become part of the creator community.',
    icon: UserPlus,
    color: 'var(--cyan)',
    bg: 'var(--cyan-light)',
  },
  {
    num: '02',
    title: 'SHARE YOUR CREATIVITY',
    desc: 'Publish your posters, designs, videos, photography and creative projects.',
    icon: UploadCloud,
    color: 'var(--navy)',
    bg: '#EEF2FF',
  },
  {
    num: '03',
    title: 'PARTICIPATE & COMPETE',
    desc: 'Take part in creative competitions, challenges and community activities.',
    icon: Trophy,
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
  },
  {
    num: '04',
    title: 'SHOWCASE & GROW',
    desc: 'Build your portfolio, earn XP, receive recognition and discover new opportunities.',
    icon: TrendingUp,
    color: '#10B981',
    bg: '#DCFCE7',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            HOW IT WORKS
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '16px' }}>
            YOUR CREATIVE JOURNEY STARTS HERE.
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Four simple steps to connect, share, compete and grow alongside creative minds across Tamil Nadu.
          </p>
        </div>

        {/* 4 Process Steps Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0',
          background: 'var(--cream)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1.5px solid var(--gray-200)',
        }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  padding: '32px 26px',
                  borderRight: i < steps.length - 1 ? '1px solid var(--gray-200)' : 'none',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
                className="step-item"
              >
                {/* Step number */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '2.2rem',
                  color: step.color,
                  opacity: 0.2,
                  lineHeight: 1,
                  marginBottom: '14px',
                }}>
                  {step.num}
                </div>

                {/* Icon Circle */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Icon size={20} color={step.color} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--navy)',
                  marginBottom: '10px',
                  lineHeight: 1.3,
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--gray-600)',
                  lineHeight: 1.6,
                }}>
                  {step.desc}
                </p>

                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: '-11px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '22px',
                    height: '22px',
                    background: step.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }} className="step-connector">
                    <ArrowRight size={12} color="white" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '44px' }}
        >
          <Link
            href="/community/auth?mode=register"
            className="btn btn-primary btn-lg"
          >
            JOIN THE COMMUNITY – IT&apos;S FREE
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .step-item:hover {
          background: white;
        }
        @media (max-width: 900px) {
          .step-connector { display: none !important; }
        }
      `}</style>
    </section>
  );
}
