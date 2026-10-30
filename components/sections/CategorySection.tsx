'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Trophy, Sparkles, BookOpen, CalendarDays, ArrowRight
} from 'lucide-react';

const communityActivities = [
  {
    num: '01',
    title: 'CREATIVE CHALLENGES',
    description: 'Participate in poster design, thumbnail design, logo design, branding, AI art and video editing competitions.',
    icon: Trophy,
    color: 'var(--orange)',
    bgColor: 'var(--orange-light)',
    badge: 'Competitions & XP',
  },
  {
    num: '02',
    title: 'CREATOR SHOWCASE',
    description: 'Share your creative projects and discover inspiring work from other creators.',
    icon: Sparkles,
    color: 'var(--cyan)',
    bgColor: 'var(--cyan-light)',
    badge: 'Talent Showcase',
  },
  {
    num: '03',
    title: 'CREATOR RESOURCES',
    description: 'Explore useful fonts, design tools, AI websites, tutorials, recorded sessions and creative resources.',
    icon: BookOpen,
    color: 'var(--navy)',
    bgColor: '#EEF2FF',
    badge: 'Curated Vault',
  },
  {
    num: '04',
    title: 'COMMUNITY EVENTS',
    description: 'Discover creative meetups, workshops, learning sessions and community events.',
    icon: CalendarDays,
    color: '#10B981',
    bgColor: '#ECFDF5',
    badge: 'Workshops & Meetups',
  },
];

export default function CategorySection() {
  return (
    <section id="activities" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              COMMUNITY ACTIVITIES
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display-md"
            style={{ color: 'var(--navy)', marginBottom: '16px' }}
          >
            ONE COMMUNITY. MANY WAYS TO CREATE.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'var(--gray-500)', fontSize: '1.05rem', lineHeight: 1.6 }}
          >
            Public informational previews of active community programs. Connect, compete, share and discover.
          </motion.p>
        </div>

        {/* 4 Main Activity Cards Grid */}
        <div className="activities-grid">
          {communityActivities.map((act, i) => {
            const Icon = act.icon;
            return (
              <motion.div
                key={act.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="activity-card"
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '32px 28px',
                  background: 'var(--cream)',
                  border: '1.5px solid rgba(13, 44, 91, 0.08)',
                  borderRadius: '24px',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                }}>
                  {/* Top Bar with Number and Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: act.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={24} color={act.color} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      color: 'var(--navy)',
                      opacity: 0.18,
                    }}>
                      {act.num}
                    </span>
                  </div>

                  {/* Badge */}
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: act.color,
                    marginBottom: '8px',
                  }}>
                    {act.badge}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: 'var(--navy)',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}>
                    {act.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--gray-600)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    flex: 1,
                  }}>
                    {act.description}
                  </p>

                  {/* Bottom Accent */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                  }}>
                    <span>Community Activity</span>
                    <ArrowRight size={14} color={act.color} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Public Informational CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <Link href="/community/auth?mode=register" className="btn btn-primary btn-lg">
            JOIN TNCC TO EXPLORE
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .activities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .activities-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 600px) {
          .activities-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
