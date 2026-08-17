'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowRight, Ticket } from 'lucide-react';
import { mockEvents } from '@/lib/mock-data';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long' });
}

const typeColors: Record<string, { color: string; bg: string }> = {
  Summit: { color: 'var(--orange)', bg: 'var(--orange-light)' },
  Bootcamp: { color: 'var(--navy)', bg: '#EEF2FF' },
  Meetup: { color: 'var(--cyan)', bg: 'var(--cyan-light)' },
  Workshop: { color: '#10B981', bg: '#DCFCE7' },
  'Portfolio Review': { color: 'var(--yellow)', bg: 'var(--yellow-light)' },
};

function EventCard({ event, featured = false, index = 0 }: { event: typeof mockEvents[0]; featured?: boolean; index?: number }) {
  const tc = typeColors[event.type] || { color: 'var(--navy)', bg: '#EEF2FF' };
  const spotsPercent = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/events/${event.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'white',
          border: '1.5px solid var(--gray-200)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: featured ? 'row' : 'column',
          height: '100%',
        }} className="event-card">
          {/* Date column / header */}
          <div style={{
            background: tc.bg,
            padding: featured ? '28px 24px' : '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: featured ? 'center' : 'flex-start',
            justifyContent: 'center',
            minWidth: featured ? '120px' : 'auto',
            flexShrink: 0,
          }}>
            {featured ? (
              <>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: tc.color, lineHeight: 1 }}>
                  {new Date(event.date).getDate()}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: tc.color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                </div>
                <div style={{ fontSize: '0.7rem', color: tc.color, opacity: 0.5, marginTop: '4px' }}>
                  {formatDay(event.date)}
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  padding: '3px 10px',
                  background: tc.color,
                  color: 'white',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  {event.type}
                </div>
                {event.price === 0 && (
                  <div style={{
                    padding: '3px 10px',
                    background: '#DCFCE7',
                    color: '#16A34A',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    Free
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '20px', flex: 1 }}>
            {!featured && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Calendar size={12} color="var(--orange)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--orange)' }}>
                  {formatDate(event.date)} · {formatDay(event.date)}
                </span>
              </div>
            )}

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: featured ? '1.25rem' : '1rem',
              color: 'var(--navy)',
              lineHeight: 1.3,
              marginBottom: '10px',
            }}>
              {event.title}
            </h3>

            <p style={{ fontSize: '0.825rem', color: 'var(--gray-500)', lineHeight: 1.55, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {event.description}
            </p>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                <Clock size={12} color="var(--gray-400)" />
                {event.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                <MapPin size={12} color="var(--gray-400)" />
                {event.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                <Users size={12} color="var(--gray-400)" />
                {event.spotsLeft} spots left
              </div>
            </div>

            {/* Spots bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ height: '4px', background: 'var(--gray-100)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${spotsPercent}%`,
                  background: spotsPercent > 80 ? 'var(--orange)' : spotsPercent > 50 ? 'var(--yellow)' : 'var(--cyan)',
                  borderRadius: '2px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                {spotsPercent}% filled
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: tc.color }}>
                Register <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .event-card:hover {
            border-color: var(--gray-300) !important;
            box-shadow: 0 12px 40px rgba(13,44,91,0.14) !important;
            transform: translateY(-4px) !important;
          }
        `}</style>
      </Link>
    </motion.div>
  );
}

export default function EventsSection() {
  const [featured, ...rest] = mockEvents;

  return (
    <section className="section" style={{ background: 'var(--cream)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>Community events</div>
            <h2 className="text-display-md" style={{ color: 'var(--navy)', maxWidth: '480px' }}>
              Where creators meet beyond the screen.
            </h2>
          </div>
          <Link href="/events" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            All events <ArrowRight size={16} />
          </Link>
        </div>

        {/* Featured event */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '20px' }}
        >
          <EventCard event={featured} featured={true} index={0} />
        </motion.div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {rest.map((event, i) => (
            <EventCard key={event.id} event={event} index={i + 1} />
          ))}
        </div>

        {/* Community CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: '48px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
            <Ticket size={16} color="var(--orange)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              TNCC Pro members get <strong style={{ color: 'var(--orange)' }}>20% off</strong> all events
            </span>
          </div>
          <Link href="/#pricing" style={{ fontSize: '0.875rem', color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>
            See membership plans →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
