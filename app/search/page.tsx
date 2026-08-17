'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProjects, mockCreators, mockPackages, mockEvents } from '@/lib/mock-data';
import Link from 'next/link';
import { MapPin, Users, Clock, Star, Calendar, ArrowRight, Heart, Bookmark, Filter, FileText } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams ? (searchParams.get('q') || '') : '';
  const [activeTab, setActiveTab] = useState<'projects' | 'creators' | 'packages' | 'events'>('projects');
  const [savedItems, setSavedItems] = useState<{ projects: string[]; creators: string[]; packages: string[]; events: string[] }>({
    projects: [],
    creators: [],
    packages: [],
    events: [],
  });

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSave = (type: 'projects' | 'creators' | 'packages' | 'events', id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = { ...savedItems };
    if (updated[type].includes(id)) {
      updated[type] = updated[type].filter(item => item !== id);
    } else {
      updated[type] = [...updated[type], id];
    }
    setSavedItems(updated);
    localStorage.setItem('tncc_saved', JSON.stringify(updated));
  };

  const cleanQuery = query.toLowerCase().trim();

  // Filter items based on query
  const filteredProjects = mockProjects.filter(p =>
    p.title.toLowerCase().includes(cleanQuery) ||
    p.description.toLowerCase().includes(cleanQuery) ||
    p.category.toLowerCase().includes(cleanQuery) ||
    p.skills.some(s => s.toLowerCase().includes(cleanQuery))
  );

  const filteredCreators = mockCreators.filter(c =>
    c.name.toLowerCase().includes(cleanQuery) ||
    c.title.toLowerCase().includes(cleanQuery) ||
    c.bio.toLowerCase().includes(cleanQuery) ||
    c.skills.some(s => s.toLowerCase().includes(cleanQuery)) ||
    c.location.toLowerCase().includes(cleanQuery)
  );

  const filteredPackages = mockPackages.filter(pkg =>
    pkg.title.toLowerCase().includes(cleanQuery) ||
    pkg.description.toLowerCase().includes(cleanQuery) ||
    pkg.category.toLowerCase().includes(cleanQuery)
  );

  const filteredEvents = mockEvents.filter(e =>
    e.title.toLowerCase().includes(cleanQuery) ||
    e.description.toLowerCase().includes(cleanQuery) ||
    e.location.toLowerCase().includes(cleanQuery) ||
    e.type.toLowerCase().includes(cleanQuery)
  );

  const totalResults = filteredProjects.length + filteredCreators.length + filteredPackages.length + filteredEvents.length;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Header */}
        <div style={{ background: 'var(--navy)', padding: '50px 0 32px', position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Search Results
            </div>
            <h1 className="text-display-md" style={{ color: 'white', marginBottom: '12px' }}>
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              Found <strong style={{ color: 'white' }}>{totalResults}</strong> matches across the club
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="section">
          <div className="container">
            {totalResults === 0 ? (
              <EmptyState
                title="No exact matches yet"
                description={`We couldn't find any projects, creators, packages, or events matching "${query}". Try searching for categories like "UI/UX", "Brand", or "Salem".`}
              />
            ) : (
              <div>
                {/* Tabs selection */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  borderBottom: '1px solid var(--gray-200)',
                  marginBottom: '32px',
                  paddingBottom: '1px',
                  overflowX: 'auto',
                }}>
                  {[
                    { key: 'projects' as const, label: 'Projects', count: filteredProjects.length },
                    { key: 'creators' as const, label: 'Creators', count: filteredCreators.length },
                    { key: 'packages' as const, label: 'Packages', count: filteredPackages.length },
                    { key: 'events' as const, label: 'Events', count: filteredEvents.length },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '12px 20px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `2.5px solid ${activeTab === tab.key ? 'var(--navy)' : 'transparent'}`,
                        color: activeTab === tab.key ? 'var(--navy)' : 'var(--gray-500)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {tab.label}
                      <span style={{
                        padding: '2px 7px',
                        background: activeTab === tab.key ? 'var(--navy-light)' : 'var(--gray-100)',
                        color: activeTab === tab.key ? 'var(--navy)' : 'var(--gray-500)',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === 'projects' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredProjects.length === 0 ? (
                      <EmptyState title="No projects found" description="Adjust your keywords or view other discovery categories." />
                    ) : (
                      filteredProjects.map(project => {
                        const isSaved = savedItems.projects.includes(project.id);
                        return (
                          <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }} className="search-card">
                              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)', fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 }}>
                                {project.category.slice(0, 2).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                  <div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: '4px' }}>{project.title}</h3>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                      <span>{project.location} {project.remote && '· Remote'}</span>
                                      <span>{project.proposals} proposals</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                      {project.skills.slice(0, 3).map(s => (
                                        <span key={s} style={{ padding: '2px 8px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.68rem', color: 'var(--gray-600)' }}>{s}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)' }}>₹{project.budget.min.toLocaleString('en-IN')} - ₹{project.budget.max.toLocaleString('en-IN')}</div>
                                    <button
                                      onClick={(e) => toggleSave('projects', project.id, e)}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)', padding: '6px', marginTop: '6px' }}
                                    >
                                      <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'creators' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {filteredCreators.length === 0 ? (
                      <EmptyState title="No creators found" description="Adjust your keywords or view other discovery categories." />
                    ) : (
                      filteredCreators.map(creator => {
                        const isSaved = savedItems.creators.includes(creator.id);
                        return (
                          <Link key={creator.id} href={`/creators/${creator.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }} className="search-card">
                              <div style={{ height: '50px', background: creator.coverColor }} />
                              <div style={{ padding: '0 16px', marginTop: '-20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: creator.coverColor, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
                                  {creator.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <button
                                  onClick={(e) => toggleSave('creators', creator.id, e)}
                                  style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                                >
                                  <Heart size={14} fill={isSaved ? 'var(--orange)' : 'none'} />
                                </button>
                              </div>
                              <div style={{ padding: '12px 16px 16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '2px' }}>{creator.name}</h3>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '8px' }}>{creator.title}</div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                  {creator.skills.slice(0, 2).map(s => (
                                    <span key={s} style={{ padding: '1px 6px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--gray-600)' }}>{s}</span>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-100)', paddingTop: '10px' }}>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{creator.location}</span>
                                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--navy)' }}>₹{creator.hourlyRate}/hr</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {filteredPackages.length === 0 ? (
                      <EmptyState title="No service packages found" description="Adjust your keywords or view other discovery categories." />
                    ) : (
                      filteredPackages.map(pkg => {
                        const isSaved = savedItems.packages.includes(pkg.id);
                        return (
                          <Link key={pkg.id} href={`/packages/${pkg.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', overflow: 'hidden', position: 'relative' }} className="search-card">
                              <div style={{ height: '100px', background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', opacity: 0.15, fontSize: '3rem', fontWeight: 800 }}>PKG</span>
                                <button
                                  onClick={(e) => toggleSave('packages', pkg.id, e)}
                                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                                >
                                  <Bookmark size={14} fill={isSaved ? 'var(--orange)' : 'none'} />
                                </button>
                              </div>
                              <div style={{ padding: '16px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '4px' }}>{pkg.category}</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '12px' }}>{pkg.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--gray-100)' }}>
                                  <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Price</div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--navy)' }}>₹{pkg.price.toLocaleString('en-IN')}</div>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{pkg.deliveryDays} days</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}

                {activeTab === 'events' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredEvents.length === 0 ? (
                      <EmptyState title="No events found" description="Adjust your keywords or view other discovery categories." />
                    ) : (
                      filteredEvents.map(event => {
                        const isSaved = savedItems.events.includes(event.id);
                        return (
                          <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }} className="search-card">
                              <div style={{ padding: '12px 16px', background: 'var(--cream)', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)', lineHeight: 1 }}>{new Date(event.date).getDate()}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: '2px' }}>{new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '6px' }}>{event.title}</h3>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                  <span>{event.time}</span>
                                  <span>{event.venue}</span>
                                  <span>{event.spotsLeft} spots left</span>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <button
                                  onClick={(e) => toggleSave('events', event.id, e)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)', padding: '6px' }}
                                >
                                  <Heart size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                                </button>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--navy)', marginTop: '8px' }}>
                                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .search-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)', color: 'var(--navy)' }}>
        Searching creative network...
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
