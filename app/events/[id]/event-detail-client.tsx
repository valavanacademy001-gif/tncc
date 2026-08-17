'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, Calendar, Clock, MapPin, Ticket, X, CheckCircle, Users } from 'lucide-react';
import { Event } from '@/lib/types';

interface EventDetailClientProps {
  event: Event;
  similarEvents: Event[];
}

export default function EventDetailClient({ event, similarEvents }: EventDetailClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  // Registration form inputs
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');

  // Sync saved status
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.events && parsed.events.includes(event.id)) {
          setIsSaved(true);
        }
      } catch (e) {}
    }
  }, [event.id]);

  const toggleSave = () => {
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    const saved = localStorage.getItem('tncc_saved');
    let savedObj: { projects: string[]; creators: string[]; packages: string[]; events: string[] } = { projects: [], creators: [], packages: [], events: [] };
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
      } catch (e) {}
    }

    if (nextSavedState) {
      savedObj.events = [...savedObj.events, event.id];
    } else {
      savedObj.events = savedObj.events.filter(id => id !== event.id);
    }
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(true);
    
    // Decrement spots locally for demonstration
    if (event.spotsLeft > 0) {
      event.spotsLeft -= 1;
    }
  };

  const resetRegister = () => {
    setRegisterModalOpen(false);
    setRegisterSuccess(false);
    setAttendeeName('');
    setAttendeeEmail('');
  };

  // Mock Agenda Items
  const mockAgenda = [
    { time: "09:30 AM", title: "Registrations & Networking coffee", desc: "Collect badges and catch up with other creators at the lounge." },
    { time: "10:15 AM", title: "Keynote address: The Creative Economy of TN", desc: "Opening talk on market dynamics, local demand, and scaling freelancers." },
    { time: "11:30 AM", title: "Panel Discussion: Pricing & Contracts", desc: "Experienced directors discuss how to value creative deliverables." },
    { time: "01:00 PM", title: "Catered Networking Lunch", desc: "Enjoy a traditional lunch while connecting with agency representatives." },
    { time: "02:30 PM", title: "Interactive Portfolio Critiques", desc: "Breakout tracks for visual arts, web dev, and video production." },
  ];

  // Mock Speakers
  const mockSpeakers = [
    { name: "Karthik Rajan", role: "Brand Lead, TNCC", avatar: "" },
    { name: "Priya Sundaram", role: "UX Consultant", avatar: "" },
    { name: "Suresh Balaji", role: "Founder, Valavan Academy", avatar: "" },
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          
          {/* Back Navigation */}
          <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--gray-500)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to events list
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="event-detail-grid">
            
            {/* Left Column: Details */}
            <div>
              {/* Event Cover / Details Header */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ padding: '4px 12px', background: 'var(--cyan-light)', color: 'var(--cyan)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, display: 'inline-block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {event.type}
                    </span>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: '12px' }}>
                      {event.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {event.venue} · {event.location}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={toggleSave}
                      style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
                    >
                      <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                    </button>
                    <button style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-500)' }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Spots status bar */}
                <div style={{ padding: '16px 20px', background: 'var(--cream)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                      <span>Seats Registration</span>
                      <span style={{ color: 'var(--orange)' }}>{event.spotsLeft} of {event.spots} left</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--orange)', width: `${(event.spotsLeft / event.spots) * 100}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Hosted by</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{event.organizer}</div>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '16px' }}>
                  About the Event
                </h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                  {event.description}
                </p>
              </div>

              {/* Agenda schedule list */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '20px' }}>
                  Event Agenda
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {mockAgenda.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: 'var(--cyan)', padding: '4px 10px', background: 'var(--cyan-light)', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        {item.time}
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers list */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '20px' }}>
                  Speakers & Mentors
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {mockSpeakers.map((sp, idx) => (
                    <div key={idx} style={{ padding: '16px', background: 'var(--cream)', borderRadius: '16px', border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--orange-light)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.875rem' }}>
                        {sp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{sp.name}</h4>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{sp.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky actions */}
            <div>
              <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1.5px solid var(--gray-200)', position: 'sticky', top: '100px' }} className="event-detail-sidebar">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '4px' }}>
                  {event.price === 0 ? 'Free Entry' : `₹${event.price.toLocaleString('en-IN')}`}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '20px' }}>
                  Single ticket registration · {event.spotsLeft} seats available
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '24px', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} color="var(--gray-400)" />
                    <span>{event.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="var(--gray-400)" />
                    <span>{event.venue} · {event.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => setRegisterModalOpen(true)}
                  disabled={event.spotsLeft === 0}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', cursor: event.spotsLeft === 0 ? 'not-allowed' : 'pointer', opacity: event.spotsLeft === 0 ? 0.5 : 1 }}
                >
                  {event.spotsLeft === 0 ? 'Fully Booked' : 'Register for Event'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="mobile-sticky-cta" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid var(--gray-200)',
        padding: '16px 24px',
        display: 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 99,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Ticket pricing</div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)' }}>{event.price === 0 ? 'Free' : `₹${event.price}`}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleSave}
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
          >
            <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
          </button>
          <button
            onClick={() => setRegisterModalOpen(true)}
            disabled={event.spotsLeft === 0}
            className="btn btn-primary"
            style={{ padding: '12px 24px', cursor: event.spotsLeft === 0 ? 'not-allowed' : 'pointer' }}
          >
            Register
          </button>
        </div>
      </div>

      {/* Event Registration Modal */}
      {registerModalOpen && (
        <>
          <div onClick={resetRegister} style={{ position: 'fixed', inset: 0, background: 'rgba(8,26,58,0.5)', zIndex: 199 }} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '24px',
            border: '2px solid var(--navy)',
            padding: '36px',
            width: '100%',
            maxWidth: '460px',
            zIndex: 200,
            boxShadow: '0 24px 80px rgba(8,26,58,0.2)',
          }}>
            <button
              onClick={resetRegister}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)' }}
            >
              <X size={22} />
            </button>

            {!registerSuccess ? (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Register Ticket</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>Confirm attendee details</h3>
                </div>

                <div style={{ background: 'var(--cream)', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  <div><strong style={{ color: 'var(--navy)' }}>Event:</strong> {event.title}</div>
                  <div style={{ marginTop: '4px' }}><strong style={{ color: 'var(--navy)' }}>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
                  <div style={{ marginTop: '4px' }}><strong style={{ color: 'var(--navy)' }}>Ticket:</strong> {event.price === 0 ? 'Free Ticket' : `₹${event.price}`}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Enter your name"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="Enter your email"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', cursor: 'pointer' }}>
                  Confirm Registration
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle size={56} fill="#DCFCE7" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                  Registration Confirmed!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px', marginInline: 'auto' }}>
                  Your ticket has been booked successfully. Check your email inbox ({attendeeEmail}) for the event pass.
                </p>
                <button onClick={resetRegister} className="btn btn-primary" style={{ marginInline: 'auto', cursor: 'pointer' }}>
                  Close window
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />

      <style jsx global>{`
        @media (min-width: 992px) {
          .event-detail-grid {
            grid-template-columns: 1fr 320px !important;
          }
          .event-detail-sidebar {
            display: block !important;
          }
          .mobile-sticky-cta {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .event-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .event-detail-sidebar {
            display: none !important;
          }
          .mobile-sticky-cta {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
