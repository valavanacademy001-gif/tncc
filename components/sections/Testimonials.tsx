'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, Sparkles, Trophy, BookOpen, FolderKanban, Award, Briefcase, TrendingUp, ArrowRight 
} from 'lucide-react';

const benefits = [
  {
    num: '01',
    title: 'CONNECT WITH CREATORS',
    desc: 'Meet designers, editors, photographers, filmmakers and creative professionals.',
    icon: Users,
    color: 'var(--cyan)',
    bg: 'var(--cyan-light)',
  },
  {
    num: '02',
    title: 'SHOWCASE YOUR WORK',
    desc: 'Share your creative projects and build visibility across Tamil Nadu.',
    icon: Sparkles,
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
  },
  {
    num: '03',
    title: 'PARTICIPATE IN COMPETITIONS',
    desc: 'Challenge yourself and receive recognition for your creativity.',
    icon: Trophy,
    color: '#F5A623',
    bg: '#FEF3C7',
  },
  {
    num: '04',
    title: 'ACCESS CREATIVE RESOURCES',
    desc: 'Explore useful tools, websites, fonts and tutorials in the vault.',
    icon: BookOpen,
    color: 'var(--navy)',
    bg: '#EEF2FF',
  },
  {
    num: '05',
    title: 'BUILD YOUR PORTFOLIO',
    desc: 'Create a dedicated space to display your selected creative work.',
    icon: FolderKanban,
    color: 'var(--cyan)',
    bg: 'var(--cyan-light)',
  },
  {
    num: '06',
    title: 'EARN RECOGNITION',
    desc: 'Earn XP, achievements and competition podium rewards.',
    icon: Award,
    color: 'var(--orange)',
    bg: 'var(--orange-light)',
  },
  {
    num: '07',
    title: 'DISCOVER OPPORTUNITIES',
    desc: 'Explore creative job openings and collaborative creative briefs.',
    icon: Briefcase,
    color: 'var(--navy)',
    bg: '#EEF2FF',
  },
  {
    num: '08',
    title: 'GROW TOGETHER',
    desc: 'Learn from the experiences and creative work of other community members.',
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
  },
];

export default function Testimonials() {
  return (
    <section
      id="benefits"
      style={{
        background: '#FFFFFF',
        padding: '90px 0 100px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* Centered Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '740px', margin: '0 auto 48px' }}>
          <div
            className="section-label"
            style={{
              justifyContent: 'center',
              display: 'inline-flex',
              marginBottom: '14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
            }}
          >
            WHY JOIN TNCC?
          </div>
          <h2
            className="text-display-md"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: 'var(--navy)',
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
            }}
          >
            WHY BECOME PART OF TNCC?
          </h2>
          <p
            style={{
              color: 'var(--gray-500)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
            }}
          >
            Eight core reasons creative individuals across Tamil Nadu choose TNCC as their home community.
          </p>
        </div>

        {/* 8 Benefit Cards Grid */}
        <div className="benefits-grid">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="benefit-card-wrapper"
              >
                <div style={{
                  padding: '28px 24px',
                  background: 'var(--cream)',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(13, 44, 91, 0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: b.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={20} color={b.color} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: 'var(--navy)',
                      opacity: 0.2,
                    }}>
                      {b.num}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--navy)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}>
                    {b.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--gray-600)',
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                  }}>
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <Link href="/community/auth?mode=register" className="btn btn-primary btn-lg">
            JOIN TNCC FOR FREE
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
