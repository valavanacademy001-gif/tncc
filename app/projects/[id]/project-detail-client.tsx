'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { MapPin, Users, Clock, ArrowLeft, Bookmark, Share2, ArrowRight, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectDetailClientProps {
  project: Project;
  similarProjects: Project[];
}

export default function ProjectDetailClient({ project, similarProjects }: ProjectDetailClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  
  // Proposal Form Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [proposalMsg, setProposalMsg] = useState('');
  const [bidAmount, setBidAmount] = useState(project.budget.min);
  const [deliveryDays, setDeliveryDays] = useState(10);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sync saved status
  useEffect(() => {
    const saved = localStorage.getItem('tncc_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.projects && parsed.projects.includes(project.id)) {
          setIsSaved(true);
        }
      } catch (e) {}
    }
  }, [project.id]);

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
      savedObj.projects = [...savedObj.projects, project.id];
    } else {
      savedObj.projects = savedObj.projects.filter(id => id !== project.id);
    }
    localStorage.setItem('tncc_saved', JSON.stringify(savedObj));
  };

  const handleNextStep = () => setWizardStep(prev => Math.min(prev + 1, 5));
  const handlePrevStep = () => setWizardStep(prev => Math.max(prev - 1, 1));

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // In a real app we'd push this to Supabase, for mock we just increment proposals locally
    project.proposals += 1;
  };

  const resetWizard = () => {
    setProposalModalOpen(false);
    setWizardStep(1);
    setProposalMsg('');
    setBidAmount(project.budget.min);
    setDeliveryDays(10);
    setPortfolioLink('');
    setFormSubmitted(false);
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          {/* Back Navigation */}
          <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--gray-500)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to project pool
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }} className="project-detail-grid">
            
            {/* Left Column: Details */}
            <div>
              {/* Header card */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ padding: '4px 12px', background: 'var(--orange-light)', color: 'var(--orange)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>
                      {project.category}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', color: 'var(--navy)', lineHeight: 1.25, marginBottom: '12px' }}>
                      {project.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {project.location} {project.remote && '· Remote'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} /> {project.proposals} proposals received
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> Posted {new Date(project.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={toggleSave}
                      style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
                      title="Save Project"
                    >
                      <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
                    </button>
                    <button style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-500)' }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Key specs grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', padding: '20px', background: 'var(--cream)', borderRadius: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Budget Range</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.975rem', color: 'var(--navy)' }}>
                      ₹{project.budget.min.toLocaleString('en-IN')} – ₹{project.budget.max.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Deadline Date</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.975rem', color: 'var(--navy)' }}>
                      {new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Required Exp</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.975rem', color: 'var(--navy)' }}>{project.experience}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Location type</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.975rem', color: 'var(--navy)' }}>{project.remote ? 'Remote Ok' : 'On-Site'}</div>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1.5px solid var(--gray-200)', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '16px' }}>
                  Project Overview
                </h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {project.description}
                </p>

                {/* Skills tags */}
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--navy)', marginBottom: '12px' }}>
                    Required Skillsets
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.skills.map(s => (
                      <span key={s} style={{ padding: '6px 14px', background: 'var(--cyan-light)', color: 'var(--cyan)', borderRadius: '100px', fontSize: '0.825rem', fontWeight: 700 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky actions */}
            <div>
              <div style={{ background: 'white', borderRadius: '24px', padding: '28px', border: '1.5px solid var(--gray-200)', marginBottom: '16px', position: 'sticky', top: '100px' }} className="project-detail-sidebar">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '4px' }}>
                  ₹{project.budget.min.toLocaleString('en-IN')} - ₹{project.budget.max.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '20px' }}>
                  Project Budget · {project.proposals} proposals received
                </div>

                <button
                  onClick={() => setProposalModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '12px', cursor: 'pointer' }}
                >
                  Submit Proposal
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={toggleSave}
                  style={{ width: '100%', padding: '12px', borderRadius: '100px', border: '1.5px solid var(--gray-200)', background: 'transparent', fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-600)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                >
                  {isSaved ? 'Saved to Bookmarks' : 'Bookmark Project'}
                </button>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginBottom: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>About Client</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                    {project.client}
                    <ShieldCheck size={16} color="var(--cyan)" fill="var(--cyan-light)" />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={12} /> {project.location}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Similar projects */}
          {similarProjects.length > 0 && (
            <div style={{ marginTop: '64px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '24px' }}>
                Similar project opportunities
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {similarProjects.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px', transition: 'all 0.2s' }} className="related-project-card">
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '6px' }}>{p.category}</div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '8px' }}>{p.title}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                        ₹{p.budget.min.toLocaleString('en-IN')} - ₹{p.budget.max.toLocaleString('en-IN')} · {p.location}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
          <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600 }}>Max Budget</div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--navy)' }}>₹{project.budget.max.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleSave}
            style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isSaved ? 'var(--orange)' : 'var(--gray-500)' }}
          >
            <Bookmark size={18} fill={isSaved ? 'var(--orange)' : 'none'} />
          </button>
          <button
            onClick={() => setProposalModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '12px 24px', cursor: 'pointer' }}
          >
            Submit Proposal
          </button>
        </div>
      </div>

      {/* Multi-Step Proposal Modal Flow */}
      {proposalModalOpen && (
        <>
          <div onClick={resetWizard} style={{ position: 'fixed', inset: 0, background: 'rgba(8,26,58,0.5)', zIndex: 199 }} />
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
            maxWidth: '520px',
            zIndex: 200,
            boxShadow: '0 24px 80px rgba(8,26,58,0.2)',
          }}>
            {/* Modal Close */}
            <button
              onClick={resetWizard}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)' }}
            >
              <X size={22} />
            </button>

            {!formSubmitted ? (
              <form onSubmit={handleProposalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Step header */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Submit Proposal · Step {wizardStep} of 5
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)' }}>
                    {wizardStep === 1 && "Write your cover letter"}
                    {wizardStep === 2 && "State your budget bid"}
                    {wizardStep === 3 && "Estimated delivery days"}
                    {wizardStep === 4 && "Add your portfolio links"}
                    {wizardStep === 5 && "Review and submit proposal"}
                  </h3>
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: '4px',
                        flex: 1,
                        borderRadius: '2px',
                        background: wizardStep > i ? 'var(--orange)' : 'var(--gray-200)',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>

                {/* Form fields based on wizardStep */}
                <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {wizardStep === 1 && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>
                        Introduce yourself and explain why you're a good fit for this project
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Hello, I've worked on similar branding requirements for..."
                        value={proposalMsg}
                        onChange={(e) => setProposalMsg(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', resize: 'none', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>
                        Your bid amount (INR)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--navy)' }}>₹</span>
                        <input
                          type="number"
                          required
                          min={1}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          style={{ width: '100%', padding: '12px 12px 12px 28px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)' }}
                        />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '8px' }}>
                        Client budget range: ₹{project.budget.min.toLocaleString()} - ₹{project.budget.max.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>
                        Delivery timeline (days)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        style={{ width: '100%', padding: '12px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, color: 'var(--navy)' }}
                      />
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '8px' }}>
                        How long will it take to deliver first draft?
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', display: 'block', marginBottom: '8px' }}>
                        Portfolio Link (Behance, Dribbble, GitHub or personal site)
                      </label>
                      <input
                        type="url"
                        placeholder="https://behance.net/username"
                        value={portfolioLink}
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1.5px solid var(--gray-200)', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  {wizardStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--gray-600)', background: 'var(--cream)', padding: '16px', borderRadius: '12px' }}>
                      <div><strong style={{ color: 'var(--navy)' }}>Project:</strong> {project.title}</div>
                      <div><strong style={{ color: 'var(--navy)' }}>Bid Amount:</strong> ₹{bidAmount.toLocaleString('en-IN')}</div>
                      <div><strong style={{ color: 'var(--navy)' }}>Delivery Estimate:</strong> {deliveryDays} days</div>
                      {portfolioLink && <div><strong style={{ color: 'var(--navy)' }}>Portfolio:</strong> {portfolioLink}</div>}
                      <div style={{ borderTop: '1px dashed var(--gray-300)', paddingTop: '8px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        <strong style={{ color: 'var(--navy)' }}>Cover Letter:</strong> &ldquo;{proposalMsg}&rdquo;
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {wizardStep > 1 && (
                    <button type="button" onClick={handlePrevStep} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                      Back
                    </button>
                  )}
                  {wizardStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={wizardStep === 1 && !proposalMsg.trim()}
                      className="btn btn-primary"
                      style={{ flex: 2, justifyContent: 'center', opacity: (wizardStep === 1 && !proposalMsg.trim()) ? 0.5 : 1 }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', cursor: 'pointer' }}>
                      Submit Proposal
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 size={56} fill="#DCFCE7" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px' }}>
                  Proposal submitted successfully!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px', marginInline: 'auto' }}>
                  Your proposal has been sent to the client. They will get in touch if they like your profile.
                </p>
                <button onClick={resetWizard} className="btn btn-primary" style={{ marginInline: 'auto', cursor: 'pointer' }}>
                  Close window
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />

      <style jsx global>{`
        .related-project-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
          transform: translateY(-2px) !important;
        }
        @media (min-width: 992px) {
          .project-detail-grid {
            grid-template-columns: 1fr 320px !important;
          }
          .project-detail-sidebar {
            display: block !important;
          }
          .mobile-sticky-cta {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .project-detail-sidebar {
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
