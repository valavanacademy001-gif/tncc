'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockPackages, mockCategories } from '@/lib/mock-data';
import Link from 'next/link';
import { Star, Filter, Search, Bookmark, ArrowRight, X } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

function PackagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const qParam = searchParams ? (searchParams.get('q') || '') : '';
  const catParam = searchParams ? (searchParams.get('category') || 'all') : 'all';

  const [searchVal, setSearchVal] = useState(qParam);
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState('all');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [savedPackages, setSavedPackages] = useState<string[]>([]);

  // Load saved packages
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.packages) setSavedPackages(parsed.packages);
      } catch (e) {}
    }
  }, []);

  // Sync state with URL params
  useEffect(() => {
    setSearchVal(qParam);
    setSelectedCat(catParam);
  }, [qParam, catParam]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated: string[];
    if (savedPackages.includes(id)) {
      updated = savedPackages.filter(p => p !== id);
    } else {
      updated = [...savedPackages, id];
    }
    setSavedPackages(updated);

    const saved = localStorage.getItem('tncc_saved');
    let savedObj = { projects: [], creators: [], packages: [], events: [] };
    if (saved) {
      try {
        savedObj = JSON.parse(saved);
      } catch (e) {}
    }
    savedObj.packages = updated as any;
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const updateUrlFilters = (filters: { q?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (filters.q !== undefined ? filters.q : searchVal) params.set('q', filters.q !== undefined ? filters.q : searchVal);
    if ((filters.category !== undefined ? filters.category : selectedCat) !== 'all') {
      params.set('category', filters.category !== undefined ? filters.category : selectedCat);
    }
    router.push(`/packages?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlFilters({ q: searchVal });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCat(cat);
    updateUrlFilters({ category: cat });
  };

  const clearAllFilters = () => {
    setSearchVal('');
    setSelectedCat('all');
    setSelectedPrice('all');
    setSelectedDelivery('all');
    router.push('/packages');
  };

  // Filter Logic
  const filtered = mockPackages.filter(pkg => {
    // 1. Keyword search
    const cleanVal = searchVal.toLowerCase().trim();
    if (cleanVal) {
      const matchText = pkg.title.toLowerCase().includes(cleanVal) ||
                        pkg.description.toLowerCase().includes(cleanVal) ||
                        pkg.creator.toLowerCase().includes(cleanVal) ||
                        pkg.category.toLowerCase().includes(cleanVal);
      if (!matchText) return false;
    }

    // 2. Category
    if (selectedCat !== 'all' && pkg.category !== selectedCat) return false;

    // 3. Price Filter
    if (selectedPrice !== 'all') {
      const p = pkg.price;
      if (selectedPrice === 'under5000' && p > 5000) return false;
      if (selectedPrice === '5000to15000' && (p < 5000 || p > 15000)) return false;
      if (selectedPrice === 'above15000' && p < 15000) return false;
    }

    // 4. Delivery Days
    if (selectedDelivery !== 'all') {
      const d = pkg.deliveryDays;
      if (selectedDelivery === 'fast' && d > 5) return false;
      if (selectedDelivery === 'week' && d > 10) return false;
    }

    return true;
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        
        {/* Hero */}
        <div style={{ background: 'var(--navy)', padding: '50px 0 40px', position: 'relative', overflow: 'hidden' }}>
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.06 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-label" style={{ marginBottom: '16px', color: 'var(--cyan)', '--section-label-color': 'var(--cyan)' } as React.CSSProperties}>
              <span style={{ width: '24px', height: '2px', background: 'var(--cyan)', display: 'inline-block', borderRadius: '1px' }} />
              Pre-set Services
            </div>
            <h1 className="text-display-md" style={{ color: 'white', marginBottom: '12px' }}>
              Creative help, ready when you are.
            </h1>
            
            {/* Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '540px', flexWrap: 'wrap', marginTop: '20px' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="search"
                  placeholder="Search visual design, branding, content packs..."
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
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ cursor: 'pointer' }}>Search packages</button>
            </form>
          </div>
        </div>

        {/* Content */}
        <div className="section" style={{ background: 'var(--cream)', paddingBottom: '96px' }}>
          <div className="container">
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'start' }} className="packages-grid-cols">
              {/* 1. Desktop Sidebar Filters */}
              <div className="filters-sidebar" style={{ display: 'none', background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>Filter Packages</h3>
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Price Range</div>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">Any Price</option>
                    <option value="under5000">Under ₹5K</option>
                    <option value="5000to15000">₹5K – ₹15K</option>
                    <option value="above15000">Above ₹15K</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Delivery Days</div>
                  <select
                    value={selectedDelivery}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none', fontSize: '0.85rem' }}
                  >
                    <option value="all">Any Delivery</option>
                    <option value="fast">Fast (under 5 days)</option>
                    <option value="week">Under 10 days</option>
                  </select>
                </div>
              </div>

              {/* 2. Packages Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Showing <strong style={{ color: 'var(--navy)' }}>{filtered.length}</strong> service packages
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
                    title="No packages found"
                    description="No service packages match those filters. Try clearing filters."
                    actionText="Clear all filters"
                    onAction={clearAllFilters}
                  />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {filtered.map(pkg => {
                      const isSaved = savedPackages.includes(pkg.id);
                      return (
                        <Link href={`/packages/${pkg.id}`} key={pkg.id} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: 'white',
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.25s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '340px',
                          }} className="package-card-hover">
                            <div>
                              {/* Thumbnail decoration */}
                              <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--navy-dark), var(--navy-mid))', padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.06)', fontSize: '5rem', fontWeight: 900, position: 'absolute', right: '-10px', bottom: '-20px', userSelect: 'none', pointerEvents: 'none' }}>PKG</span>
                                
                                <span style={{ padding: '2px 8px', background: 'var(--cyan)', color: 'white', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', width: 'fit-content', letterSpacing: '0.04em' }}>
                                  {pkg.category}
                                </span>

                                <button
                                  onClick={(e) => toggleSave(pkg.id, e)}
                                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-400)' }}
                                >
                                  <Bookmark size={15} fill={isSaved ? 'var(--orange)' : 'none'} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.7rem' }}>
                                    {pkg.creator.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 500 }}>{pkg.creator}</span>
                                </div>
                              </div>

                              <div style={{ padding: '16px' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.3 }}>
                                  {pkg.title}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                  {pkg.description}
                                </p>
                              </div>
                            </div>

                            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--gray-100)' }}>
                              <div>
                                <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>Starting rate</span>
                                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>₹{pkg.price.toLocaleString('en-IN')}</div>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                🕒 {pkg.deliveryDays} days
                              </span>
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
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>Filter Packages</h3>
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
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Price Range</div>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">Any Price</option>
                    <option value="under5000">Under ₹5K</option>
                    <option value="5000to15000">₹5K – ₹15K</option>
                    <option value="above15000">Above ₹15K</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Delivery Days</div>
                  <select
                    value={selectedDelivery}
                    onChange={(e) => setSelectedDelivery(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid var(--gray-200)', outline: 'none' }}
                  >
                    <option value="all">Any Delivery</option>
                    <option value="fast">Fast (under 5 days)</option>
                    <option value="week">Under 10 days</option>
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
        .package-card-hover:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        @media (min-width: 992px) {
          .packages-grid-cols {
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
          .packages-grid-cols {
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

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--cream)', color: 'var(--navy)' }}>
        Loading creative packages...
      </div>
    }>
      <PackagesContent />
    </Suspense>
  );
}
