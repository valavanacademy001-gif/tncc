'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Star, Clock, CheckCircle2, MessageSquare, ArrowRight, Briefcase, Globe, Heart, ShieldCheck, X, FileText, CheckCircle } from 'lucide-react';
import { Creator, Package, Review, Event } from '@/lib/types';
import EmptyState from '@/components/ui/EmptyState';

interface CreatorProfileClientProps {
  creator: Creator;
  packages: Package[];
  reviews: Review[];
  events: Event[];
}

export default function CreatorProfileClient({ creator, packages, reviews, events }: CreatorProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'packages' | 'reviews' | 'community'>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  
  // Hire flow states
  const [hireService, setHireService] = useState('quote'); // quote | project | package
  const [hireDetails, setHireDetails] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packages[0]?.id || '');
  const [hireSubmitted, setHireSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.creators && parsed.creators.includes(creator.id)) {
          setIsSaved(true);
        }
      } catch (e) {}
    }
  }, [creator.id]);

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
      savedObj.creators = [...savedObj.creators, creator.id];
    } else {
      savedObj.creators = savedObj.creators.filter(id => id !== creator.id);
    }
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHireSubmitted(true);
  };

  const resetHireForm = () => {
    setHireModalOpen(false);
    setHireService('quote');
    setHireDetails('');
    setHireSubmitted(false);
  };

  // Mock portfolio projects with asymmetric sizes
  const portfolioProjects = [
    { id: 1, title: 'Organic Farm Branding', category: 'Brand Design', size: 'large', color: '#FFF0ED' },
    { id: 2, title: 'SaaS Dashboard Design', category: 'UI/UX Design', size: 'medium', color: '#E6F9FC' },
    { id: 3, title: 'Creative Summit Posters', category: 'Illustration', size: 'small', color: '#FFF8EC' },
    { id: 4, title: 'E-commerce Mobile App', category: 'UI/UX Design', size: 'medium', color: '#EEF2FF' },
    { id: 5, title: 'Typography Motion Intro', category: 'Motion Video', size: 'large', color: '#F3E8FF' },
  ];

  const availColor = { available: '#10B981', busy: '#F59E0B', unavailable: '#EF4444' };
  const availLabel = { available: 'Available for work', busy: 'Limited availability', unavailable: 'Not available' };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', paddingBottom: '80px' }}>
        {/* Cover banner */}
        <div style={{ height: '200px', background: creator.coverColor, position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
          <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
        </div>

        <div className="container" style={{ padding: '0 24px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="profile-grid">
            
            {/* Left Column: Details */}
            <div>
              {/* Profile header */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1.5px solid var(--gray-200)', marginTop: '-60px', marginBottom: '20px', position: 'relative' }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '50%',
                  background: creator.coverColor, border: '4px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem',
                  marginBottom: '16px', boxShadow: '0 4px 16px rgba(13,44,91,0.15)',
                }}>
                  {creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', color: 'var(--navy)' }}>
                        {creator.name}
                      </h1>
                      {creator.verified && <ShieldCheck size={18} color="var(--cyan)" fill="var(--cyan-light)" />}
                    </div>
                    <p style={{ fontSize: '0.925rem', color: 'var(--cyan)', fontWeight: 700, marginBottom: '12px' }}>{creator.title}</p>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {creator.location}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={13} color="var(--yellow)" fill="var(--yellow)" />
                        {creator.rating} ({creator.reviewCount} reviews)
                      </span>
                      <span style={{ fontSize: '0.8rem', color: availColor[creator.availability], display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: availColor[creator.availability] }} />
                        {availLabel[creator.availability]}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={toggleSave}
                      style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
                    >
                      <Heart size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                    </button>
                    <button
                      onClick={() => setHireModalOpen(true)}
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', cursor: 'pointer' }}
                    >
                      Hire Me
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--gray-200)', marginBottom: '24px', overflowX: 'auto' }}>
                {[
                  { id: 'about' as const, label: 'About' },
                  { id: 'portfolio' as const, label: `Portfolio (${portfolioProjects.length})` },
                  { id: 'packages' as const, label: `Packages (${packages.length})` },
                  { id: 'reviews' as const, label: `Reviews (${reviews.length})` },
                  { id: 'community' as const, label: `Events (${events.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0 0 12px 0',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2.5px solid ${activeTab === tab.id ? 'var(--navy)' : 'transparent'}`,
                      color: activeTab === tab.id ? 'var(--navy)' : 'var(--gray-500)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div style={{ minHeight: '300px' }}>
                {activeTab === 'about' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '12px' }}>Biography</h3>
                      <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, fontSize: '0.925rem', whiteSpace: 'pre-line' }}>{creator.bio}</p>
                    </div>

                    <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '16px' }}>Skills & Frameworks</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {creator.skills.map(skill => (
                          <span key={skill} style={{ padding: '6px 14px', background: 'var(--cream)', border: '1px solid var(--gray-200)', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--navy)', fontWeight: 600 }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {portfolioProjects.map(proj => (
                      <div
                        key={proj.id}
                        style={{
                          background: proj.color,
                          borderRadius: '24px',
                          padding: '32px 24px',
                          minHeight: proj.size === 'large' ? '300px' : proj.size === 'medium' ? '240px' : '180px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1.5px solid var(--gray-200)',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                        className="portfolio-item-card"
                      >
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase', opacity: 0.6 }}>{proj.category}</span>
                          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)', marginTop: '4px' }}>{proj.title}</h4>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gray-200)' }}>
                            <ArrowRight size={14} color="var(--navy)" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {packages.length === 0 ? (
                      <EmptyState title="No active packages" description="This creator has not listed any custom packages yet." />
                    ) : (
                      packages.map(pkg => (
                        <Link href={`/packages/${pkg.id}`} key={pkg.id} style={{ textDecoration: 'none' }}>
                          <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }} className="package-profile-card">
                            <div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase' }}>{pkg.category}</span>
                              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginTop: '4px', marginBottom: '8px' }}>{pkg.title}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{pkg.description.slice(0, 80)}...</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--gray-100)', paddingTop: '14px', marginTop: '12px' }}>
                              <div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>Starting rate</div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy)' }}>₹{pkg.price.toLocaleString('en-IN')}</div>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{pkg.deliveryDays} days delivery</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviews.length === 0 ? (
                      <EmptyState title="No reviews yet" description="This creator has not received client reviews yet." />
                    ) : (
                      reviews.map(rev => (
                        <div key={rev.id} style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{rev.name}</h4>
                              <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{rev.role} at {rev.company}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '3px' }}>
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} size={12} color="var(--yellow)" fill="var(--yellow)" />
                              ))}
                            </div>
                          </div>
                          <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', lineHeight: 1.6 }}>&ldquo;{rev.content}&rdquo;</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'community' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {events.length === 0 ? (
                      <EmptyState title="No community activities" description="This creator hasn't organized or spoken at any TNCC events yet." />
                    ) : (
                      events.map(ev => (
                        <Link href={`/events/${ev.id}`} key={ev.id} style={{ textDecoration: 'none' }}>
                          <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px' }} className="related-project-card">
                            <div style={{ padding: '8px 12px', background: 'var(--cream)', borderRadius: '8px', textAlign: 'center', minWidth: '60px' }}>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>{new Date(ev.date).getDate()}</div>
                              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--gray-500)' }}>{new Date(ev.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)' }}>{ev.type}</span>
                              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginTop: '2px' }}>{ev.title}</h4>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>📍 {ev.venue}</div>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="profile-sidebar" style={{ display: 'none' }}>
              <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '24px', padding: '24px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Specs</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Starting rate</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>₹{creator.hourlyRate}/hr</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Completed projects</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>{creator.projectsCompleted} projects</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Response Time</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>{creator.responseTime}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Languages</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>{creator.languages.join(', ')}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Member since</span>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>{creator.memberSince}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Hire Creator Modal */}
      {hireModalOpen && (
        <>
          <div onClick={resetHireForm} style={{ position: 'fixed', inset: 0, background: 'rgba(8,26,58,0.5)', zIndex: 199 }} />
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
            maxWidth: '500px',
            zIndex: 200,
            boxShadow: '0 24px 80px rgba(8,26,58,0.2)',
          }}>
            <button
              onClick={resetHireForm}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)' }}
            >
              <X size={22} />
            </button>

            {!hireSubmitted ? (
              <form onSubmit={handleHireSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Hire {creator.name.split(' ')[0]}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>How would you like to work?</h3>
                </div>

                {/* Choices */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { id: 'quote', label: 'Request Quote' },
                    { id: 'project', label: 'Invite to Project' },
                    { id: 'package', label: 'Buy Package', disabled: packages.length === 0 },
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => setHireService(option.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1.5px solid var(--gray-200)',
                        background: hireService === option.id ? 'var(--navy)' : 'white',
                        color: hireService === option.id ? 'white' : 'var(--gray-600)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: option.disabled ? 'not-allowed' : 'pointer',
                        opacity: option.disabled ? 0.35 : 1,
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div>
                  {hireService === 'package' && (
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Select Package</label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--gray-200)' }}
                      >
                        {packages.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (₹{p.price.toLocaleString()})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>
                    {hireService === 'quote' && 'Explain your custom requirements, goals, and budget'}
                    {hireService === 'project' && 'Link your open project details or paste specs'}
                    {hireService === 'package' && 'Add notes / specific requirements for this package'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={hireDetails}
                    onChange={(e) => setHireDetails(e.target.value)}
                    placeholder="Provide details so we can align..."
                    style={{ width: '100%', padding: '12px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', resize: 'none', fontSize: '0.9rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', cursor: 'pointer' }}>
                  Send Request
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle size={56} fill="#DCFCE7" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                  Hiring request dispatched!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px', marginInline: 'auto' }}>
                  Your request has been sent to {creator.name.split(' ')[0]}. They will reply directly to your Inbox.
                </p>
                <button onClick={resetHireForm} className="btn btn-primary" style={{ marginInline: 'auto', cursor: 'pointer' }}>
                  Close window
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />

      <style jsx global>{`
        .portfolio-item-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        .package-profile-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
        }
        @media (min-width: 992px) {
          .profile-grid {
            grid-template-columns: 1fr 280px !important;
          }
          .profile-sidebar {
            display: block !important;
          }
        }
        @media (max-width: 991px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
