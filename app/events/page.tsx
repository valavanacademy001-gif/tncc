import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockEvents } from '@/lib/mock-data';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowRight, Ticket } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const typeColors: Record<string, { color: string; bg: string }> = {
  Summit: { color: 'var(--orange)', bg: 'var(--orange-light)' },
  Bootcamp: { color: 'var(--navy)', bg: '#EEF2FF' },
  Meetup: { color: 'var(--cyan)', bg: 'var(--cyan-light)' },
  Workshop: { color: '#10B981', bg: '#DCFCE7' },
  'Portfolio Review': { color: 'var(--yellow)', bg: 'var(--yellow-light)' },
};

export default function EventsPage() {
  const upcoming = mockEvents.filter(e => new Date(e.date) >= new Date('2026-08-17'));

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ background: 'var(--navy)', padding: '60px 0 40px', position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.06 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--yellow)', display: 'inline-block', borderRadius: '1px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--yellow)' }}>TNCC Events</span>
            </div>
            <h1 className="text-display-md" style={{ color: 'white', marginBottom: '16px', maxWidth: '560px' }}>
              Where the community gathers.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '440px', marginBottom: '24px' }}>
              Bootcamps, summits, portfolio reviews, and casual meetups — all across Tamil Nadu.
            </p>

            {/* Quick filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Free', 'Online', 'Chennai', 'Coimbatore', 'Vellore', 'Madurai'].map(f => (
                <button key={f} style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: `1.5px solid ${f === 'All' ? 'white' : 'rgba(255,255,255,0.2)'}`,
                  background: f === 'All' ? 'white' : 'transparent',
                  color: f === 'All' ? 'var(--navy)' : 'rgba(255,255,255,0.65)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events list */}
        <div className="section" style={{ background: 'var(--cream)' }}>
          <div className="container">
            <div style={{ marginBottom: '24px', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
              <strong style={{ color: 'var(--navy)' }}>{upcoming.length}</strong> upcoming events
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockEvents.map(event => {
                const tc = typeColors[event.type] || { color: 'var(--navy)', bg: '#EEF2FF' };
                const spotsPercent = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
                return (
                  <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'white',
                      border: '1.5px solid var(--gray-200)',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      transition: 'all 0.25s ease',
                    }} className="event-list-item">
                      {/* Date block */}
                      <div style={{
                        background: tc.bg,
                        borderRadius: '16px',
                        padding: '16px 20px',
                        textAlign: 'center',
                        minWidth: '80px',
                        flexShrink: 0,
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: tc.color, lineHeight: 1 }}>
                          {new Date(event.date).getDate()}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: tc.color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ padding: '3px 10px', background: tc.bg, color: tc.color, borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                            {event.type}
                          </span>
                          {event.price === 0 && (
                            <span style={{ padding: '3px 10px', background: '#DCFCE7', color: '#16A34A', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                              Free
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.3 }}>
                          {event.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock size={12} /> {event.time}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={12} /> {event.venue}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Users size={12} /> {event.spotsLeft} spots left
                          </span>
                        </div>
                        {/* Spots bar */}
                        <div style={{ maxWidth: '200px' }}>
                          <div style={{ height: '4px', background: 'var(--gray-100)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${spotsPercent}%`,
                              background: spotsPercent > 80 ? 'var(--orange)' : 'var(--cyan)',
                              borderRadius: '2px',
                            }} />
                          </div>
                          <div style={{ fontSize: '0.67rem', color: 'var(--gray-400)', marginTop: '3px' }}>{spotsPercent}% filled</div>
                        </div>
                      </div>

                      {/* Right: price + CTA */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                          {event.price === 0 ? 'Free' : `₹${event.price}`}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 700, color: tc.color }}>
                          Register <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '48px', padding: '40px', background: 'var(--navy)', borderRadius: '24px' }}>
              <Ticket size={32} color="var(--yellow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: 'white', marginBottom: '8px' }}>
                Stay updated on TNCC events
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Follow us on Instagram for early bird registrations and community updates.
              </p>
              <a
                href="https://instagram.com/tncreatorclub"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-yellow"
              >
                Follow @tncreatorclub
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .event-list-item:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 8px 24px rgba(13,44,91,0.1) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </>
  );
}

