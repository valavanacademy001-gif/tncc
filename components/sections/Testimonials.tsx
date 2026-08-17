'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Briefcase, Users } from 'lucide-react';
import { mockTestimonials } from '@/lib/mock-data';

const typeIcon = { creator: User, employer: Briefcase, community: Users };
const typeLabel = { creator: 'Creator', employer: 'Employer', community: 'Community' };
const typeColor = { creator: 'var(--cyan)', employer: 'var(--orange)', community: 'var(--yellow)' };
const typeBg = { creator: 'var(--cyan-light)', employer: 'var(--orange-light)', community: 'var(--yellow-light)' };

export default function Testimonials() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? mockTestimonials
    : mockTestimonials.filter(t => t.type === filter);

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            What people say
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '24px' }}>
            Straight from the community.
          </h2>

          {/* Filter tabs */}
          <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['all', 'creator', 'employer', 'community'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '100px',
                  border: `1.5px solid ${filter === tab ? 'var(--navy)' : 'var(--gray-200)'}`,
                  background: filter === tab ? 'var(--navy)' : 'transparent',
                  color: filter === tab ? 'white' : 'var(--gray-500)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'all' ? 'All' : typeLabel[tab as keyof typeof typeLabel]}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((testimonial, i) => {
            const Icon = typeIcon[testimonial.type];
            const color = typeColor[testimonial.type];
            const bg = typeBg[testimonial.type];

            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                style={{
                  background: 'white',
                  border: '1.5px solid var(--gray-200)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 0.25s ease',
                }}
                className="testimonial-card"
              >
                {/* Quote icon */}
                <div style={{ color: 'var(--gray-200)' }}>
                  <Quote size={28} fill="var(--gray-200)" />
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      color="#F5A623"
                      fill={si < testimonial.rating ? '#F5A623' : 'none'}
                    />
                  ))}
                </div>

                {/* Content */}
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--gray-700)',
                  lineHeight: 1.65,
                  flex: 1,
                  fontStyle: 'normal',
                }}>
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}>
                    {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy)' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {testimonial.role}, {testimonial.company} · {testimonial.location}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    background: bg,
                    borderRadius: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Icon size={11} color={color} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color }}>
                      {typeLabel[testimonial.type]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .testimonial-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 8px 32px rgba(13,44,91,0.1) !important;
          transform: translateY(-3px) !important;
        }
      `}</style>
    </section>
  );
}
