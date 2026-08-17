'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

const creatorSteps = [
  { num: '01', title: 'Build your profile', desc: 'Add your skills, portfolio, and availability. Let your work speak for you.' },
  { num: '02', title: 'Discover opportunities', desc: 'Browse projects filtered by your category, location, and rate — no noise.' },
  { num: '03', title: 'Send your proposal', desc: 'Write a focused proposal. Not a template — your genuine approach to the work.' },
  { num: '04', title: 'Get selected & start', desc: "When a client picks you, the project begins. Clear brief, open communication." },
  { num: '05', title: 'Deliver, grow, repeat', desc: 'Complete the work, earn your review, build your reputation within TNCC.' },
];

const employerSteps = [
  { num: '01', title: 'Post a project', desc: 'Describe what you need, your budget, timeline, and required skills. Done in minutes.' },
  { num: '02', title: 'Receive proposals', desc: 'Creators send proposals directly. Browse by experience, location, and rate.' },
  { num: '03', title: 'Compare and decide', desc: 'Review profiles, portfolios, and proposals side by side. Pick the right person.' },
  { num: '04', title: 'Hire and collaborate', desc: 'Connect directly with your chosen creator and begin the project.' },
  { num: '05', title: 'Receive great work', desc: 'Work delivered, team grows. Leave a review and build your creator network.' },
];

export default function HowItWorks() {
  const [mode, setMode] = useState<'creator' | 'employer'>('creator');
  const steps = mode === 'creator' ? creatorSteps : employerSteps;

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            Simple by design
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '24px' }}>
            How TNCC works
          </h2>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'var(--gray-100)', borderRadius: '100px', padding: '4px', gap: '4px' }}>
            {[
              { value: 'creator', label: 'For Creators', icon: User },
              { value: 'employer', label: 'For Employers', icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setMode(value as 'creator' | 'employer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  background: mode === value ? (value === 'creator' ? 'var(--cyan)' : 'var(--orange)') : 'transparent',
                  color: mode === value ? 'white' : 'var(--gray-500)',
                  boxShadow: mode === value ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0',
              background: 'var(--cream)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1.5px solid var(--gray-200)',
            }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  style={{
                    padding: '28px 24px',
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
                    fontSize: '2rem',
                    color: mode === 'creator' ? 'var(--cyan)' : 'var(--orange)',
                    opacity: 0.2,
                    lineHeight: 1,
                    marginBottom: '12px',
                  }}>
                    {step.num}
                  </div>

                  {/* Check icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: mode === 'creator' ? 'var(--cyan-light)' : 'var(--orange-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}>
                    <CheckCircle2 size={16} color={mode === 'creator' ? 'var(--cyan)' : 'var(--orange)'} />
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--navy)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--gray-500)',
                    lineHeight: 1.6,
                  }}>
                    {step.desc}
                  </p>

                  {/* Arrow connector */}
                  {i < steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      right: '-10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '20px',
                      height: '20px',
                      background: mode === 'creator' ? 'var(--cyan)' : 'var(--orange)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }} className="step-connector">
                      <ArrowRight size={10} color="white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <Link
            href={mode === 'creator' ? '/app' : '/app/hiring'}
            className={`btn btn-lg ${mode === 'creator' ? 'btn-cyan' : 'btn-primary'}`}
          >
            {mode === 'creator' ? 'Start finding work' : 'Post your first project'}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .step-item:hover {
          background: white;
        }
        @media (max-width: 768px) {
          .step-connector { display: none !important; }
        }
      `}</style>
    </section>
  );
}
