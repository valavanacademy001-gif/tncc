'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Star, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { mockCreators } from '@/lib/mock-data';

const availabilityLabel: Record<string, string> = {
  available: 'Available',
  busy: 'Limited',
  unavailable: 'Unavailable',
};
const availabilityColor: Record<string, string> = {
  available: '#10B981',
  busy: '#F59E0B',
  unavailable: '#EF4444',
};

const coverColors = [
  'var(--navy)', 'var(--cyan)', 'var(--orange)', 'var(--yellow)',
  'var(--navy-mid)', 'var(--orange)', 'var(--cyan)',
];

function CreatorCard({ creator, index }: { creator: typeof mockCreators[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/creators/${creator.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'white',
          border: '1.5px solid var(--gray-200)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }} className="creator-card">
          {/* Cover bar */}
          <div style={{
            height: '72px',
            background: creator.coverColor,
            position: 'relative',
          }}>
            {/* Pattern overlay */}
            <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
          </div>

          {/* Avatar area */}
          <div style={{ padding: '0 20px', position: 'relative', marginBottom: '12px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: creator.coverColor,
              border: '3px solid white',
              marginTop: '-32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.5rem',
              position: 'relative',
              zIndex: 1,
            }}>
              {creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            {/* Verified badge */}
            {creator.verified && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '60px',
                background: 'var(--cyan)',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                zIndex: 2,
              }}>
                <CheckCircle2 size={12} color="white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '0 20px 20px' }}>
            {/* Name & availability */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>
                {creator.name}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: availabilityColor[creator.availability],
                flexShrink: 0,
                marginLeft: '8px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: availabilityColor[creator.availability], display: 'inline-block' }} />
                {availabilityLabel[creator.availability]}
              </div>
            </div>

            {/* Title */}
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '10px' }}>
              {creator.title}
            </p>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <MapPin size={12} color="var(--gray-400)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{creator.location}, Tamil Nadu</span>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
              {creator.skills.slice(0, 3).map(skill => (
                <span key={skill} style={{
                  padding: '3px 8px',
                  background: 'var(--gray-100)',
                  borderRadius: '100px',
                  fontSize: '0.68rem',
                  color: 'var(--gray-600)',
                  fontWeight: 500,
                }}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--gray-100)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} color="#F5A623" fill="#F5A623" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>{creator.rating}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>({creator.reviewCount})</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                {creator.projectsCompleted} projects
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy)' }}>
                ₹{creator.hourlyRate}<span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--gray-400)' }}>/hr</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .creator-card:hover {
            border-color: var(--gray-300) !important;
            box-shadow: 0 12px 40px rgba(13,44,91,0.14) !important;
            transform: translateY(-5px) !important;
          }
        `}</style>
      </Link>
    </motion.div>
  );
}

export default function CreatorSpotlight() {
  const featured = mockCreators.slice(0, 6);

  return (
    <section className="section" style={{ background: 'var(--cream)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>Creator community</div>
            <h2 className="text-display-md" style={{ color: 'var(--navy)' }}>
              Meet the people<br />behind the work.
            </h2>
          </div>
          <Link href="/creators" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            All creators <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {featured.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: '48px',
            padding: '32px',
            background: 'var(--navy)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: 'white', marginBottom: '6px' }}>
              Are you a creator?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              Join 1,240+ creators already building their careers on TNCC.
            </p>
          </div>
          <Link href="/app" className="btn btn-yellow">
            Build your profile
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
