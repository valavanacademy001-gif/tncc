'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProjects, mockCategories } from '@/lib/mock-data';
import Link from 'next/link';
import { MapPin, Users, Clock, ArrowRight, Filter, Search, Bookmark, CheckCircle, ChevronDown, X } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { Project } from '@/lib/types';

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter state synced with URL where possible
  const qParam = searchParams ? (searchParams.get('q') || '') : '';
  const catParam = searchParams ? (searchParams.get('category') || 'all') : 'all';
  const remoteParam = searchParams ? (searchParams.get('remote') || 'all') : 'all';

  const [searchVal, setSearchVal] = useState(qParam);
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [remoteOnly, setRemoteOnly] = useState(remoteParam);
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  const [savedProjects, setSavedProjects] = useState<string[]>([]);

  // Load saved projects
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.projects) setSavedProjects(parsed.projects);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Synchronize state when URL params change
  useEffect(() => {
    setSearchVal(qParam);
    setSelectedCat(catParam);
    setRemoteOnly(remoteParam);
  }, [qParam, catParam, remoteParam]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (savedProjects.includes(id)) {
      updated = savedProjects.filter(p => p !== id);
    } else {
      updated = [...savedProjects, id];
    }
    setSavedProjects(updated);
    
    // Save to localStorage structure
    const saved = localStorage.getItem('tncc_saved');
    let savedObj = { projects: [], creators: [], packages: [], events: [] };
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
      } catch (e) {}
    }
    savedObj.projects = updated as any;
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  // Build filter query strings
  const updateUrlFilters = (filters: { q?: string; category?: string; remote?: string }) => {
    const params = new URLSearchParams();
    if (filters.q !== undefined ? filters.q : searchVal) params.set('q', filters.q !== undefined ? filters.q : searchVal);
    if ((filters.category !== undefined ? filters.category : selectedCat) !== 'all') {
      params.set('category', filters.category !== undefined ? filters.category : selectedCat);
    }
    if ((filters.remote !== undefined ? filters.remote : remoteOnly) !== 'all') {
      params.set('remote', filters.remote !== undefined ? filters.remote : remoteOnly);
    }
    router.push(`/projects?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlFilters({ q: searchVal });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCat(cat);
    updateUrlFilters({ category: cat });
  };

  const handleRemoteChange = (rem: string) => {
    setRemoteOnly(rem);
    updateUrlFilters({ remote: rem });
  };

  const clearAllFilters = () => {
    setSearchVal('');
    setSelectedCat('all');
    setRemoteOnly('all');
    setSelectedBudget('all');
    setSelectedExperience('all');
    router.push('/projects');
  };

  // Filter logic
  const filtered = mockProjects.filter(project => {
    // 1. Keyword search
    const cleanVal = searchVal.toLowerCase().trim();
    if (cleanVal) {
      const matchText = project.title.toLowerCase().includes(cleanVal) || 
                        project.description.toLowerCase().includes(cleanVal) ||
                        project.skills.some(s => s.toLowerCase().includes(cleanVal)) ||
                        project.client.toLowerCase().includes(cleanVal);
      if (!matchText) return false;
    }

    // 2. Category
    if (selectedCat !== 'all' && project.category !== selectedCat) return false;

    // 3. Remote
    if (remoteOnly !== 'all') {
      const isRemote = remoteOnly === 'true';
      if (project.remote !== isRemote) return false;
    }

    // 4. Budget Range
    if (selectedBudget !== 'all') {
      const maxBudget = project.budget.max;
      if (selectedBudget === 'under10' && maxBudget > 10000) return false;
      if (selectedBudget === '10to30' && (maxBudget < 10000 || maxBudget > 30000)) return false;
      if (selectedBudget === 'above30' && maxBudget < 30000) return false;
    }

    // 5. Experience
    if (selectedExperience !== 'all' && project.experience.toLowerCase() !== selectedExperience.toLowerCase()) return false;

    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    if (sortBy === 'budgetHigh') return b.budget.max - a.budget.max;
    if (sortBy === 'budgetLow') return a.budget.min - b.budget.min;
    if (sortBy === 'proposalsHigh') return b.proposals - a.proposals;
    return 0;
  });

  // Split out the featured project
  const featuredProject = sorted.find(p => p.featured) || sorted[0];
  const listProjects = featuredProject ? sorted.filter(p => p.id !== featuredProject.id) : sorted;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        
        {/* Marketplace Hero */}
        <div style={{ background: 'var(--navy)', padding: '50px 0 40px', position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.06 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ marginBottom: '16px', color: 'var(--cyan)', '--section-label-color': 'var(--cyan)' } as React.CSSProperties}>
              <span style={{ width: '24px', height: '2px', background: 'var(--cyan)', display: 'inline-block', borderRadius: '1px' }} />
              Project Pool
            </div>
            <h1 className="text-display-md" style={{ color: 'white', marginBottom: '12px' }}>
              Opportunities worth your attention.
            </h1>
            
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '600px', flexWrap: 'wrap', marginTop: '24px' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="search"
                  placeholder="Search projects, skills, key terms..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'white',
                    fontSize: '0.925rem',
                    outline: 'none',
                  }}
                  className="hero-search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ cursor: 'pointer' }}>Search Pool</button>
            </form>
          </div>
        </div>

        {/* Content Marketplace */}
        <div className="section" style={{ background: 'var(--cream)', paddingBottom: '96px' }}>
          <div className="container">
            
            {/* Featured Project Showcase (Editorial Grid) */}
            {featuredProject && !qParam && selectedCat === 'all' && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  ★ Highlighted Opportunity
                </div>
                <div style={{
                  background: 'white',
                  border: '2px solid var(--navy)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  boxShadow: '0 16px 40px rgba(13,44,91,0.06)',
                }} className="featured-project-card">
                  {/* Left content */}
                  <div style={{ padding: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ padding: '4px 10px', background: 'var(--orange-light)', color: 'var(--orange)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {featuredProject.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        Posted {new Date(featuredProject.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'var(--navy)', marginBottom: '12px', lineHeight: 1.25 }}>
                      {featuredProject.title}
                    </h2>
                    
                    <p style={{ color: 'var(--gray-600)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '24px' }}>
                      {featuredProject.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
                      {featuredProject.skills.map(s => (
                        <span key={s} style={{ padding: '3px 10px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.72rem', color: 'var(--gray-600)', fontWeight: 600 }}>{s}</span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '20px',
                      borderTop: '1px solid var(--gray-100)',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Client Budget</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginTop: '2px' }}>
                          ₹{featuredProject.budget.min.toLocaleString('en-IN')} - ₹{featuredProject.budget.max.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => toggleSave(featuredProject.id, e)}
                          style={{
                            background: 'white',
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: savedProjects.includes(featuredProject.id) ? 'var(--orange)' : 'var(--gray-400)',
                          }}
                        >
                          <Bookmark size={18} fill={savedProjects.includes(featuredProject.id) ? 'var(--orange)' : 'none'} />
                        </button>
                        <Link href={`/projects/${featuredProject.id}`} className="btn btn-primary">
                          View details <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'start' }} className="projects-grid-cols">
              {/* 1. Sidebar Filters (Desktop) */}
              <div className="filters-sidebar" style={{ display: 'none', background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>Filter Pool</h3>
                  <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
                </div>

                {/* Categories */}
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

                {/* Remote status */}
                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Work Location</div>
                  <select
                    value={remoteOnly}
                    onChange={(e) => handleRemoteChange(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Locations</option>
                    <option value="true">Remote Only</option>
                    <option value="false">On-site / Tamil Nadu</option>
                  </select>
                </div>

                {/* Budget tier */}
                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Budget Range</div>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">Any Budget</option>
                    <option value="under10">Under ₹10K</option>
                    <option value="10to30">₹10K - ₹30K</option>
                    <option value="above30">Above ₹30K</option>
                  </select>
                </div>

                {/* Experience Tier */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Experience level</div>
                  {['all', 'Entry', 'Intermediate', 'Expert'].map(exp => (
                    <label key={exp} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--gray-600)', marginBottom: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="experience"
                        checked={selectedExperience === exp}
                        onChange={() => setSelectedExperience(exp)}
                        style={{ cursor: 'pointer' }}
                      />
                      {exp === 'all' ? 'Any Experience' : exp}
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Results List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Result header & Sort */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Showing <strong style={{ color: 'var(--navy)' }}>{sorted.length}</strong> open projects
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Mobile filter button */}
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

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '100px', border: '1.5px solid var(--gray-200)', background: 'white', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="budgetHigh">Budget: High to Low</option>
                      <option value="budgetLow">Budget: Low to High</option>
                      <option value="proposalsHigh">Bids: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Grid listing */}
                {sorted.length === 0 ? (
                  <EmptyState
                    title="No projects match those filters"
                    description="We couldn't find any listings matching your selection. Try clearing filters or searching for another keyword."
                    actionText="Clear all filters"
                    onAction={clearAllFilters}
                  />
                ) : (
                  listProjects.map(project => {
                    const isSaved = savedProjects.includes(project.id);
                    return (
                      <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          background: 'white',
                          border: '1.5px solid var(--gray-200)',
                          borderRadius: '16px',
                          padding: '24px',
                          display: 'flex',
                          gap: '20px',
                          alignItems: 'flex-start',
                          transition: 'all 0.25s ease',
                          position: 'relative',
                        }} className="project-list-card">
                          
                          {/* Category Dot */}
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'var(--orange-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--orange)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}>
                            {project.category.slice(0, 2).toUpperCase()}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                              
                              <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: '6px' }}>
                                  {project.title}
                                </h3>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <MapPin size={11} /> {project.location} {project.remote && '· Remote'}
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Users size={11} /> {project.proposals} proposals
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Clock size={11} /> {new Date(project.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </span>
                                </div>
                                
                                {/* Skills */}
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {project.skills.slice(0, 3).map(s => (
                                    <span key={s} style={{ padding: '2px 8px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.67rem', color: 'var(--gray-600)' }}>{s}</span>
                                  ))}
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>
                                  ₹{project.budget.min.toLocaleString('en-IN')} - ₹{project.budget.max.toLocaleString('en-IN')}
                                </div>
                                <button
                                  onClick={(e) => toggleSave(project.id, e)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)', padding: '6px', marginTop: '4px' }}
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
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>Filter Projects</h3>
                <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--navy)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Mobile options list */}
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Location</div>
                  <select
                    value={remoteOnly}
                    onChange={(e) => handleRemoteChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">All Locations</option>
                    <option value="true">Remote Only</option>
                    <option value="false">On-site / Tamil Nadu</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Budget Range</div>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">Any Budget</option>
                    <option value="under10">Under ₹10K</option>
                    <option value="10to30">₹10K - ₹30K</option>
                    <option value="above30">Above ₹30K</option>
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
        .project-list-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        @media (min-width: 992px) {
          .projects-grid-cols {
            grid-template-columns: 260px 1fr !important;
          }
          .filters-sidebar {
            display: block !important;
          }
          .mobile-filters-trigger {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .projects-grid-cols {
            grid-template-columns: 1fr !important;
          }
          .filters-sidebar {
            display: none !important;
          }
          .mobile-filters-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)', color: 'var(--navy)' }}>
        Loading projects pool...
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
