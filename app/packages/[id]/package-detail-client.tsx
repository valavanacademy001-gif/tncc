'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, Clock, RotateCcw, Check, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Package, Creator } from '@/lib/types';

interface PackageDetailClientProps {
  pkg: Package;
  creator?: Creator;
}

export default function PackageDetailClient({ pkg, creator }: PackageDetailClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Custom mock add-ons
  const [addOns, setAddOns] = useState([
    { id: 'fast', label: 'Extra Fast Delivery (2 days earlier)', price: 1500, checked: false },
    { id: 'source', label: 'Source files (vector formats)', price: 2000, checked: false },
    { id: 'revisions', label: 'Unlimited revisions support', price: 1000, checked: false },
  ]);

  // Sync saved status
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.packages && parsed.packages.includes(pkg.id)) {
          setIsSaved(true);
        }
      } catch (e) {}
    }
  }, [pkg.id]);

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
      savedObj.packages = [...savedObj.packages, pkg.id];
    } else {
      savedObj.packages = savedObj.packages.filter(id => id !== pkg.id);
    }
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const handleAddOnChange = (id: string) => {
    setAddOns(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const calculateTotal = () => {
    const addOnTotal = addOns.filter(item => item.checked).reduce((acc, curr) => acc + curr.price, 0);
    return pkg.price + addOnTotal;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSuccess(true);
  };

  const resetCheckout = () => {
    setCheckoutModalOpen(false);
    setCheckoutSuccess(false);
    setAddOns(prev => prev.map(item => ({ ...item, checked: false })));
  };

  // Mock inclusions
  const mockInclusions = [
    "Initial visual research & moodboards",
    "3 unique design directions/concepts",
    "Final vectors files and production assets",
    "Style guide document (PDF)",
    "Commercial usage rights",
  ];

  const mockExclusions = [
    "Trademarking or legal registration fees",
    "Printing production or material costs",
    "Font license purchasing fees",
  ];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          
          {/* Back Navigation */}
          <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--gray-500)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to packages
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="package-detail-grid">
            
            {/* Left Column: Details */}
            <div>
              {/* Cover Banner */}
              <div style={{ background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))', height: '240px', borderRadius: '24px', position: 'relative', overflow: 'hidden', padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.06)', fontSize: '9rem', fontWeight: 900, position: 'absolute', right: '-20px', bottom: '-40px', userSelect: 'none', pointerEvents: 'none' }}>PKG</span>
                <span style={{ padding: '4px 12px', background: 'var(--cyan)', color: 'white', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', width: 'fit-content', letterSpacing: '0.04em' }}>
                  {pkg.category}
                </span>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 1.95rem)', color: 'white', marginBottom: '4px', lineHeight: 1.2 }}>
                      {pkg.title}
                    </h1>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                      by <strong style={{ color: 'white' }}>{pkg.creator}</strong>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={toggleSave}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'white' }}
                    >
                      <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                    </button>
                    <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '16px' }}>
                  Service Description
                </h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                  {pkg.description}
                </p>
              </div>

              {/* Inclusions / Exclusions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }} className="inclusions-grid">
                
                {/* What's included */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}><Check size={11} /></span>
                    What's Included
                  </h3>
                  <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mockInclusions.map((inc, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>•</span> {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What's NOT included */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><X size={11} /></span>
                    What's Excluded
                  </h3>
                  <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mockExclusions.map((exc, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--gray-400)', fontWeight: 800 }}>•</span> {exc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Creator Profile Summary */}
              {creator && (
                <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '20px' }}>
                    About Creator
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: creator.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy)' }}>{creator.name}</h4>
                        {creator.verified && <CheckCircle2 size={15} color="var(--cyan)" fill="var(--cyan-light)" />}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '4px' }}>{creator.title} · {creator.location}</p>
                      
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                        <span>Completed: {creator.projectsCompleted} projects</span>
                        <span>Rating: ⭐ {creator.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <Link href={`/creators/${creator.id}`} className="btn btn-secondary btn-sm">
                      View Profile
                    </Link>
                    <Link href={`/app/messages?chat=${creator.id}`} className="btn btn-ghost btn-sm" style={{ display: 'flex', gap: '6px' }}>
                      Message Creator
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky checkout */}
            <div>
              <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1.5px solid var(--gray-200)', position: 'sticky', top: '100px' }} className="package-detail-sidebar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--gray-500)' }}>Package Price</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)' }}>
                    ₹{calculateTotal().toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--gray-500)', margin: '16px 0 24px 0', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', padding: '12px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {pkg.deliveryDays} days Delivery
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RotateCcw size={14} /> 3 Revisions
                  </span>
                </div>

                {/* Add-ons checkbox selectors */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Optional Add-ons</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {addOns.map(add => (
                      <label key={add.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.82rem', color: 'var(--gray-600)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={add.checked}
                          onChange={() => handleAddOnChange(add.id)}
                          style={{ marginTop: '3px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div>{add.label}</div>
                          <div style={{ fontWeight: 700, color: 'var(--navy)', marginTop: '2px' }}>+₹{add.price.toLocaleString()}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                >
                  Choose Package
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
          <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Total price</div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)' }}>₹{calculateTotal().toLocaleString()}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleSave}
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
          >
            <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
          </button>
          <button
            onClick={() => setCheckoutModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '12px 24px', cursor: 'pointer' }}
          >
            Choose Package
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <>
          <div onClick={resetCheckout} style={{ position: 'fixed', inset: 0, background: 'rgba(8,26,58,0.5)', zIndex: 199 }} />
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
            maxWidth: '480px',
            zIndex: 200,
            boxShadow: '0 24px 80px rgba(8,26,58,0.2)',
          }}>
            <button
              onClick={resetCheckout}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)' }}
            >
              <X size={22} />
            </button>

            {!checkoutSuccess ? (
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Checkout Order</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>Confirm Package Selection</h3>
                </div>

                <div style={{ background: 'var(--cream)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--gray-600)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong style={{ color: 'var(--navy)' }}>Package:</strong> {pkg.title}</div>
                  <div><strong style={{ color: 'var(--navy)' }}>Creator:</strong> {pkg.creator}</div>
                  <div><strong style={{ color: 'var(--navy)' }}>Delivery Estimate:</strong> {pkg.deliveryDays} days</div>
                  
                  {/* Selected Add-ons summary */}
                  {addOns.some(a => a.checked) && (
                    <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '6px', marginTop: '4px' }}>
                      <strong style={{ color: 'var(--navy)' }}>Selected Add-ons:</strong>
                      <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {addOns.filter(a => a.checked).map(a => (
                          <li key={a.id} style={{ fontSize: '0.8rem' }}>{a.label} (+₹{a.price.toLocaleString()})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div style={{ borderTop: '1.5px solid var(--gray-300)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, color: 'var(--navy)' }}>
                    <span>Total Amount</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>Your Message or Requirements Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Hi, here are my website brand colors and assets. Let me know if you need anything else..."
                    style={{ width: '100%', padding: '12px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', resize: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', cursor: 'pointer' }}>
                  Place Order
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 size={56} fill="#DCFCE7" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                  Package order initiated!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px', marginInline: 'auto' }}>
                  Your package selection order request has been sent to {pkg.creator.split(' ')[0]}. They will review notes and reach out in your Inbox.
                </p>
                <button onClick={resetCheckout} className="btn btn-primary" style={{ marginInline: 'auto', cursor: 'pointer' }}>
                  Close window
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        .related-project-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
        }
        @media (min-width: 992px) {
          .package-detail-grid {
            grid-template-columns: 1fr 340px !important;
          }
          .package-detail-sidebar {
            display: block !important;
          }
          .mobile-sticky-cta {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .package-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .package-detail-sidebar {
            display: none !important;
          }
          .mobile-sticky-cta {
            display: flex !important;
          }
        }
        @media (min-width: 768px) {
          .inclusions-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
