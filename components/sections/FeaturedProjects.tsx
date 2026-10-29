'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Palette,
  Share2,
  TrendingUp,
  Video,
  Layers,
  Search,
  Globe,
  Mic,
  ChevronDown,
  Send,
  Sparkles
} from 'lucide-react';

// Dramatic, bouncy spring popup animation variants ("perisavey popup")
const popupVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 90,
    scale: 0.65,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 14,
      mass: 0.8,
      delay: customDelay,
    },
  }),
};

export default function FeaturedProjects() {
  const [activeCenterTab, setActiveCenterTab] = useState<'storefront' | 'portal'>('storefront');
  const [aiPrompt, setAiPrompt] = useState('Find senior Next.js developers and brand designers in Chennai');

  return (
    <section
      id="featured-opportunities"
      style={{
        background: '#FFFFFF',
        padding: '90px 0 110px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Full-width container with generous padding */}
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 36px',
          boxSizing: 'border-box',
        }}
      >
        {/* Centered Minimal Header with Orange Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            maxWidth: '840px',
            margin: '0 auto 60px',
          }}
        >
          <div
            className="section-label"
            style={{
              justifyContent: 'center',
              display: 'inline-flex',
              marginBottom: '14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
            }}
          >
            Opportunities
          </div>

          {/* User Requested: Orange color text for this heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 700,
              color: 'var(--navy)', // TNCC signature brand blue #0D2C5B
              lineHeight: 1.15,
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
            }}
          >
            Work that powers progress
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              color: '#6B7280',
              lineHeight: 1.5,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Brand systems, digital platforms, motion, social strategy, UI/UX, and AI matching — all under one club.
          </p>
        </motion.div>

        {/* 3-Column Bento Grid with previous rich color themes */}
        <div className="bento-fullwidth-grid">
          {/* ============================================================
              COLUMN 1 (LEFT) - CARD 1 (Top): Brand & Visual Identity
              Theme: Orange (Graphic Design)
              ============================================================ */}
          <motion.div
            custom={0.05}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-1"
          >
            <Link
              href="/projects/p1"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--orange-light)', color: 'var(--orange)' }}>
                    Graphic Design
                  </span>
                </div>
                <h3 className="bento-box-title">Brand & Visual Identity</h3>
                <p className="bento-box-text">
                  Complete visual identity systems covering logo design, typography hierarchies, packaging, and brand guidelines. We build iconic creative foundations for ambitious Tamil Nadu brands.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon in Orange */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--orange)',
                    boxShadow: '0 4px 14px rgba(232, 64, 32, 0.38)',
                  }}
                >
                  <Palette size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              COLUMN 2 (CENTER) - TALL CARD (Spans Rows 1 & 2)
              Digital & Web Platforms (Theme: Navy & Cyan)
              ============================================================ */}
          <motion.div
            custom={0.18}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-center-item"
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: '#EEF2FF', color: 'var(--navy)' }}>
                    Development
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: '#10B981', color: 'white' }}>
                    Active Brief
                  </span>
                </div>

                <h3 className="bento-box-title">Digital & Web Platforms</h3>
                <p className="bento-box-text">
                  High-performance web applications and digital commerce—Storefronts for regional D2C brands and Custom Portals for business scale. Built with Next.js, clean code, and modern architecture.
                </p>

                {/* Minimal Segmented Pills */}
                <div className="segmented-pill-container">
                  <button
                    type="button"
                    onClick={() => setActiveCenterTab('storefront')}
                    className={`segmented-pill-button ${activeCenterTab === 'storefront' ? 'active' : ''}`}
                  >
                    Storefront
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCenterTab('portal')}
                    className={`segmented-pill-button ${activeCenterTab === 'portal' ? 'active' : ''}`}
                  >
                    Portal Console
                  </button>
                </div>
              </div>

              {/* Peeking Mockup Window */}
              <div className="mockup-frame">
                {/* Mockup Header */}
                <div className="mockup-topbar">
                  <div className="mockup-dots-row">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="mockup-domain-pill">
                    <Globe size={11} />
                    <span>tncc.creators/workspace</span>
                  </div>
                  <div style={{ width: '40px' }} />
                </div>

                {/* Mockup Screen Content */}
                <div className="mockup-screen-body">
                  <AnimatePresence mode="wait">
                    {activeCenterTab === 'storefront' ? (
                      <motion.div
                        key="storefront"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Search Bar */}
                        <div className="mockup-search-box">
                          <Search size={12} />
                          <span>Search handloom storefronts, web apps, or client briefs...</span>
                        </div>

                        {/* Data Rows Table */}
                        <div className="mockup-table">
                          <div className="mockup-table-header">
                            <span>Project Title</span>
                            <span>Category</span>
                            <span style={{ textAlign: 'right' }}>Status</span>
                          </div>
                          <div className="mockup-table-row">
                            <span style={{ fontWeight: 600 }}>Tiruppur Textiles Co.</span>
                            <span>E-Commerce Store</span>
                            <span className="mockup-status-green">Completed</span>
                          </div>
                          <div className="mockup-table-row">
                            <span style={{ fontWeight: 600 }}>GreenRoute Organics</span>
                            <span>Brand & Storefront</span>
                            <span className="mockup-status-blue">Active</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.68rem', color: '#8A94A6', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Showing 1 to 24 of 120 verified client briefs</span>
                          <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Explore Platform →</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="portal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mockup-table">
                          <div className="mockup-table-header">
                            <span>Client Brief</span>
                            <span>Deliverable</span>
                            <span style={{ textAlign: 'right' }}>Milestone</span>
                          </div>
                          <div className="mockup-table-row">
                            <span style={{ fontWeight: 600 }}>Zoho Cohort Startup</span>
                            <span>Next.js Web App</span>
                            <span className="mockup-status-green">Delivered</span>
                          </div>
                          <div className="mockup-table-row">
                            <span style={{ fontWeight: 600 }}>Madurai Masala Brand</span>
                            <span>D2C Ads Setup</span>
                            <span className="mockup-status-blue">In Progress</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.68rem', color: '#8A94A6', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>100% on-time milestone delivery</span>
                          <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Open Console →</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================
              COLUMN 3 (RIGHT) - CARD 3 (Top): Video & Motion Design
              Theme: Orange (Motion)
              ============================================================ */}
          <motion.div
            custom={0.31}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-right-1"
          >
            <Link
              href="/projects/p5"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--orange-light)', color: 'var(--orange)' }}>
                    Video & Motion
                  </span>
                </div>
                <h3 className="bento-box-title">Video & Motion Design</h3>
                <p className="bento-box-text">
                  High-retention 2D/3D motion graphics, commercial reels, and animated explainers. We help regional brands and startups communicate complex ideas with effortless visual clarity.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon in Orange */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--orange)',
                    boxShadow: '0 4px 14px rgba(232, 64, 32, 0.38)',
                  }}
                >
                  <Video size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              COLUMN 1 (LEFT) - CARD 2 (Middle): Social & Content Strategy
              Theme: Yellow / Amber (Social Media)
              ============================================================ */}
          <motion.div
            custom={0.44}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-2"
          >
            <Link
              href="/projects/p3"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--yellow-light)', color: '#B47805' }}>
                    Social Media
                  </span>
                </div>
                <h3 className="bento-box-title">Social & Content Strategy</h3>
                <p className="bento-box-text">
                  Omnichannel social presence through viral short-form reels, photography curation, and community engagement. We connect creators and brands across every modern consumer channel.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon in Yellow */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--yellow)',
                    boxShadow: '0 4px 14px rgba(245, 166, 35, 0.38)',
                  }}
                >
                  <Share2 size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              COLUMN 3 (RIGHT) - CARD 4 (Middle): Product & UI/UX Design
              Theme: Cyan (UI/UX)
              ============================================================ */}
          <motion.div
            custom={0.57}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-right-2"
          >
            <Link
              href="/projects/p6"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--cyan-light)', color: '#008796' }}>
                    UI/UX Design
                  </span>
                </div>
                <h3 className="bento-box-title">Product & UI/UX Design</h3>
                <p className="bento-box-text">
                  Human-centered digital products, intuitive mobile interfaces, accessible user journeys, and robust Figma design systems built for rapid customer adoption and lasting retention.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon in Cyan */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--cyan)',
                    boxShadow: '0 4px 14px rgba(0, 181, 200, 0.38)',
                  }}
                >
                  <Layers size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              COLUMN 1 (LEFT) - CARD 3 (Bottom): Growth & Performance
              Theme: Orange (Marketing)
              ============================================================ */}
          <motion.div
            custom={0.70}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-3"
          >
            <Link
              href="/projects/p9"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--orange-light)', color: 'var(--orange)' }}>
                    Performance Marketing
                  </span>
                </div>
                <h3 className="bento-box-title">Growth & Performance</h3>
                <p className="bento-box-text">
                  Data-driven digital marketing, conversion funnels, and ad creative optimization. We empower regional startups and D2C brands to scale customer acquisition with confidence.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon in Orange */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--orange)',
                    boxShadow: '0 4px 14px rgba(232, 64, 32, 0.38)',
                  }}
                >
                  <TrendingUp size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              SPANNING ROW 3, COLS 2 & 3: SmartMatch AI (Light Theme Card)
              Theme: Soft Indigo / Violet / Cyan Ambient Gradient
              ============================================================ */}
          <motion.div
            custom={0.83}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={popupVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bento-box-ai-wide"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 50%, #F5F3FF 100%)',
              border: '1.5px solid #E2E8F0',
              borderRadius: '28px',
              padding: '38px 32px',
              color: 'var(--navy)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(13, 44, 91, 0.05)',
            }}
          >
            {/* Ambient Light Mesh Glow Effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.2) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0, 181, 200, 0.16) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Header inside wide card with clean visible Dark Navy text */}
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                  <Sparkles size={13} /> TNCC AI Matchmaker
                </div>
                <h3
                  style={{
                    color: 'var(--navy)', // #0D2C5B - 100% visible, crisp dark navy text
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)',
                    fontWeight: 700,
                    margin: '0 0 6px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  SmartMatch AI
                </h3>
                <p
                  style={{
                    color: '#64748B',
                    fontSize: '0.95rem',
                    margin: 0,
                  }}
                >
                  Match your creative briefs with verified top-tier talent in seconds
                </p>
              </div>

              {/* Floating Card (Clean White on Soft Gradient) */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid #E2E8F0',
                  padding: '18px 24px',
                  maxWidth: '580px',
                  margin: '0 auto',
                  boxShadow: '0 12px 32px rgba(13, 44, 91, 0.08)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.02em' }}>
                    TNCC SmartMatch AI
                  </span>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748B', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>Hi Founder,</span> how can we help your brand today?
                </div>

                {/* Input Prompt Box */}
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.03)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Find senior Next.js developers and brand designers in Chennai..."
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.825rem',
                      color: 'var(--navy)',
                      background: 'transparent',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748B',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      + Tamil & English <ChevronDown size={11} />
                    </span>
                    <Mic size={15} style={{ color: '#8A94A6', cursor: 'pointer', flexShrink: 0 }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
