'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockCreators, mockCategories } from '@/lib/mock-data';
import Link from 'next/link';
import { MapPin, Star, CheckCircle2, Filter, Search, Heart, ShieldCheck, X, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { Creator } from '@/lib/types';

const availColor = { available: '#10B981', busy: '#F59E0B', unavailable: '#EF4444' };
const availLabel = { available: 'Available', busy: 'Limited', unavailable: 'Unavailable' };

function CreatorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const qParam = searchParams ? (searchParams.get('q') || '') : '';
  const catParam = searchParams ? (searchParams.get('category') || 'all') : 'all';
  const availParam = searchParams ? (searchParams.get('availability') || 'all') : 'all';

  const [searchVal, setSearchVal] = useState(qParam);
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [availability, setAvailability] = useState(availParam);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRate, setSelectedRate] = useState('all');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [savedCreators, setSavedCreators] = useState<string[]>([]);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.creators) setSavedCreators(parsed.creators);
      } catch (e) {}
    }
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setSearchVal(qParam);
    setSelectedCat(catParam);
    setAvailability(availParam);
  }, [qParam, catParam, availParam]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (savedCreators.includes(id)) {
      updated = savedCreators.filter(c => c !== id);
    } else {
      updated = [...savedCreators, id];
    }
    setSavedCreators(updated);

    const saved = localStorage.getItem('tncc_saved');
    let savedObj = { projects: [], creators: [], packages: [], events: [] };
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
      } catch (e) {}
    }
    savedObj.creators = updated as any;
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const updateUrlFilters = (filters: { q?: string; category?: string; availability?: string }) => {
    const params = new URLSearchParams();
    if (filters.q !== undefined ? filters.q : searchVal) params.set('q', filters.q !== undefined ? filters.q : searchVal);
    if ((filters.category !== undefined ? filters.category : selectedCat) !== 'all') {
      params.set('category', filters.category !== undefined ? filters.category : selectedCat);
    }
    if ((filters.availability !== undefined ? filters.availability : availability) !== 'all') {
      params.set('availability', filters.availability !== undefined ? filters.availability : availability);
    }
    router.push(`/creators?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlFilters({ q: searchVal });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCat(cat);
    updateUrlFilters({ category: cat });
  };

  const handleAvailabilitySelect = (avail: string) => {
    setAvailability(avail);
    updateUrlFilters({ availability: avail });
  };

  const clearAllFilters = () => {
    setSearchVal('');
    setSelectedCat('all');
    setAvailability('all');
    setSelectedLocation('all');
    setSelectedRate('all');
    router.push('/creators');
  };

  // Filter Logic
  const filtered = mockCreators.filter(creator => {
    // 1. Keyword search
    const cleanVal = searchVal.toLowerCase().trim();
    if (cleanVal) {
      const matchText = creator.name.toLowerCase().includes(cleanVal) ||
                        creator.title.toLowerCase().includes(cleanVal) ||
                        creator.bio.toLowerCase().includes(cleanVal) ||
                        creator.skills.some(s => s.toLowerCase().includes(cleanVal)) ||
                        creator.location.toLowerCase().includes(cleanVal);
      if (!matchText) return false;
    }

    // 2. Category
    if (selectedCat !== 'all' && creator.category !== selectedCat) return false;

    // 3. Availability
    if (availability !== 'all' && creator.availability !== availability) return false;

    // 4. Location
    if (selectedLocation !== 'all' && creator.location.toLowerCase() !== selectedLocation.toLowerCase()) return false;

    // 5. Starting rate range
    if (selectedRate !== 'all') {
      const rate = creator.hourlyRate;
      if (selectedRate === 'under500' && rate > 500) return false;
      if (selectedRate === '500to1000' && (rate < 500 || rate > 1000)) return false;
      if (selectedRate === 'above1000' && rate < 1000) return false;
    }

    return true;
  });

  // Featured Showcase Composition (Top Section)
  // Large creator is the highest rated, supporting cards are other highly rated creators
  const featured = [...filtered].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  const primaryFeatured = featured[0];
  const supportingFeatured = featured.slice(1, 3);
  const listCreators = primaryFeatured ? filtered.filter(c => c.id !== primaryFeatured.id && !supportingFeatured.some(sc => sc.id === c.id)) : filtered;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        
        {/* Hero */}
        <div style={{ background: 'var(--cream)', padding: '60px 0 40px', borderBottom: '1px solid var(--gray-200)', position: 'relative' }}>
          <div className="container">
            <div className="section-label" style={{ marginBottom: '16px' }}>Creator Network</div>
            <h1 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '16px', maxWidth: '640px' }}>
              Meet the people behind the work.
            </h1>
            
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '540px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="search"
                  placeholder="Search creators by skills, location, name..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--gray-200)',
                    background: 'white',
                    fontSize: '0.925rem',
                    outline: 'none',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ cursor: 'pointer' }}>Search creators</button>
            </form>
          </div>
        </div>

        {/* Content Section */}
        <div className="section" style={{ background: 'white', paddingBottom: '96px' }}>
          <div className="container">
            
            {/* Editorial Featured Showcase */}
            {primaryFeatured && !qParam && selectedCat === 'all' && (
              <div style={{ marginBottom: '56px' }}>
                <h3 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
                  ★ Spotlight Directory Showcase
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="creators-showcase-grid">
                  
                  {/* Primary Large Card */}
                  <div style={{
                    background: 'var(--navy)',
                    color: 'white',
                    borderRadius: '32px',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: '2.5px solid var(--navy)',
                    boxShadow: '0 16px 48px rgba(8,26,58,0.14)',
                  }}>
                    <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.08 }} />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: primaryFeatured.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', border: '3px solid rgba(255,255,255,0.2)' }}>
                          {primaryFeatured.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: availColor[primaryFeatured.availability], background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: availColor[primaryFeatured.availability] }} />
                          {availLabel[primaryFeatured.availability]}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'white', lineHeight: 1 }}>{primaryFeatured.name}</h2>
                        {primaryFeatured.verified && <ShieldCheck size={18} color="var(--cyan)" fill="white" />}
                      </div>
                      <p style={{ color: 'var(--cyan)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>{primaryFeatured.title}</p>
                      
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '440px' }}>
                        {primaryFeatured.bio.slice(0, 150)}...
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '28px' }}>
                        {primaryFeatured.skills.slice(0, 4).map(s => (
                          <span key={s} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '12px', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Hourly Rate</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '2px' }}>₹{primaryFeatured.hourlyRate}/hr</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Rating</div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={14} color="var(--yellow)" fill="var(--yellow)" />
                            {primaryFeatured.rating}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => toggleSave(primaryFeatured.id, e)}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: savedCreators.includes(primaryFeatured.id) ? 'var(--orange)' : 'white' }}
                        >
                          <Heart size={18} fill={savedCreators.includes(primaryFeatured.id) ? 'var(--orange)' : 'none'} />
                        </button>
                        <Link href={`/creators/${primaryFeatured.id}`} className="btn btn-yellow">
                          View profile <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Cards (2 smaller ones stacked) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {supportingFeatured.map(sc => {
                      const isSaved = savedCreators.includes(sc.id);
                      return (
                        <div key={sc.id} style={{
                          background: 'var(--cream)',
                          borderRadius: '24px',
                          padding: '24px',
                          border: '1.5px solid var(--gray-200)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          flex: 1,
                        }}>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: sc.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                              {sc.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.name}</h4>
                                {sc.verified && <CheckCircle2 size={13} color="var(--cyan)" fill="var(--cyan-light)" />}
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.title}</p>
                            </div>
                            <button
                              onClick={(e) => toggleSave(sc.id, e)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                            >
                              <Heart size={15} fill={isSaved ? 'var(--orange)' : 'none'} />
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {sc.skills.slice(0, 3).map(s => (
                              <span key={s} style={{ padding: '1px 6px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--gray-500)' }}>{s}</span>
                            ))}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)', paddingTop: '12px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>📍 {sc.location}</span>
                            <Link href={`/creators/${sc.id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              Profile <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

            {/* List structure with Filters Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'start' }} className="creators-grid-cols">
              {/* 1. Desktop Filters Sidebar */}
              <div className="filters-sidebar" style={{ display: 'none', background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>Filter Talents</h3>
                  <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
                </div>

                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Category</div>
                  <select
                    value={selectedCat}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Categories</option>
                    {mockCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Availability</div>
                  <select
                    value={availability}
                    onChange={(e) => handleAvailabilitySelect(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">Any Status</option>
                    <option value="available">Available Now</option>
                    <option value="busy">Busy / Limited</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Location</div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">All TN Cities</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Vellore">Vellore</option>
                    <option value="Madurai">Madurai</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Starting Rate</div>
                  <select
                    value={selectedRate}
                    onChange={(e) => setSelectedRate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">Any Rate</option>
                    <option value="under500">Under ₹500/hr</option>
                    <option value="500to1000">₹500 - ₹1000/hr</option>
                    <option value="above1000">Above ₹1000/hr</option>
                  </select>
                </div>
              </div>

              {/* 2. Results List grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Showing <strong style={{ color: 'var(--navy)' }}>{filtered.length}</strong> creative profiles
                  </div>
                  
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="mobile-filters-trigger"
                    style={{
                      padding: '6px 14px',
                      background: 'white',
                      border: '1.5px solid var(--gray-200)',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      display: 'none',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Filter size={14} /> Filter
                  </button>
                </div>

                {filtered.length === 0 ? (
                  <EmptyState
                    title="No creators found"
                    description="No creative profiles match your filter queries. Try resetting filters."
                    actionText="Clear all filters"
                    onAction={clearAllFilters}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {listCreators.map(creator => {
                      const isSaved = savedCreators.includes(creator.id);
                      return (
                        <Link key={creator.id} href={`/creators/${creator.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', overflow: 'hidden', position: 'relative', transition: 'all 0.25s' }} className="creator-card">
                            {/* Card Cover */}
                            <div style={{ height: '60px', background: creator.coverColor }} />
                            
                            {/* Avatar row */}
                            <div style={{ padding: '0 16px', marginTop: '-24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: creator.coverColor, border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', position: 'relative', zIndex: 10 }}>
                                {creator.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <button
                                onClick={(e) => toggleSave(creator.id, e)}
                                style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                              >
                                <Heart size={14} fill={isSaved ? 'var(--orange)' : 'none'} />
                              </button>
                            </div>

                            {/* Card Content */}
                            <div style={{ padding: '12px 16px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{creator.name}</h3>
                                {creator.verified && <CheckCircle2 size={14} color="var(--cyan)" fill="var(--cyan-light)" />}
                              </div>
                              <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '8px' }}>{creator.title}</p>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '12px' }}>
                                <Star size={12} color="var(--yellow)" fill="var(--yellow)" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--navy)' }}>{creator.rating}</span>
                                <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>({creator.reviewCount})</span>
                              </div>

                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {creator.skills.slice(0, 3).map(s => (
                                  <span key={s} style={{ padding: '1px 6px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--gray-600)' }}>{s}</span>
                                ))}
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-100)', paddingTop: '12px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>📍 {creator.location}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--navy)' }}>₹{creator.hourlyRate}/hr</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Filters Drawer Overlay */}
        {mobileFiltersOpen && (
          <>
            <div onClick={() => setMobileFiltersOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(8,26,58,0.5)', zIndex: 140 }} />
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'white',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px',
              zIndex: 150,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>Filter Creators</h3>
                <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--navy)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Category</div>
                  <select
                    value={selectedCat}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">All Categories</option>
                    {mockCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Availability</div>
                  <select
                    value={availability}
                    onChange={(e) => handleAvailabilitySelect(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">Any Status</option>
                    <option value="available">Available Now</option>
                    <option value="busy">Busy / Limited</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Location</div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">All TN Cities</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Vellore">Vellore</option>
                    <option value="Madurai">Madurai</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button onClick={clearAllFilters} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Clear All</button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Apply Filters</button>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
      <Footer />

      <style jsx global>{`
        .creator-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        @media (min-width: 992px) {
          .creators-grid-cols {
            grid-template-columns: 260px 1fr !important;
          }
          .filters-sidebar {
            display: block !important;
          }
          .mobile-filters-trigger {
            display: none !important;
          }
          .creators-showcase-grid {
            grid-template-columns: 1.5fr 1fr !important;
          }
        }
        @media (max-width: 991px) {
          .creators-grid-cols {
            grid-template-columns: 1fr !important;
          }
          .filters-sidebar {
            display: none !important;
          }
          .mobile-filters-trigger {
            display: inline-flex !important;
          }
          .creators-showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default function CreatorsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)', color: 'var(--navy)' }}>
        Loading creators pool...
      </div>
    }>
      <CreatorsContent />
    </Suspense>
  );
}
