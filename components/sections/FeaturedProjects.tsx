'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Popup animation variants: instantaneous on mobile, expressive spring on desktop
const popupVariants: Variants = {
  hidden: (custom: any) => {
    const isMob = typeof custom === 'object' ? custom?.isMobile : false;
    return {
      opacity: isMob ? 0.95 : 0,
      y: isMob ? 6 : 70,
      scale: isMob ? 1 : 0.75,
    };
  },
  visible: (custom: any) => {
    const isMob = typeof custom === 'object' ? custom?.isMobile : false;
    const delay = isMob ? 0 : (typeof custom === 'object' ? custom?.delay ?? 0 : custom ?? 0);
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: isMob
        ? {
            duration: 0.1,
            ease: 'easeOut',
          }
        : {
            type: 'spring',
            stiffness: 220,
            damping: 15,
            mass: 0.8,
            delay,
          },
    };
  },
};

export default function FeaturedProjects() {
  const [aiPrompt, setAiPrompt] = useState('Find senior video editors in Coimbatore and brand identity designers in Chennai');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {/* Centered Minimal Header with Orange Heading */}
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          margin: '0 auto 60px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={isMobile ? { opacity: 0.9, y: 10 } : { opacity: 0, y: 25, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: isMobile ? '120px 0px 0px 0px' : '-60px' }}
          transition={{ duration: isMobile ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
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
            CREATOR SHOWCASE
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontWeight: 700,
              color: 'var(--navy)',
              lineHeight: 1.15,
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
            }}
          >
            TALENT DESERVES TO BE SEEN.
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
            Discover creative works from the TNCC community.
          </p>
        </motion.div>
      </div>

      {/* Full-width container spanning display width for cards */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: '0 clamp(16px, 3.5vw, 48px)',
          boxSizing: 'border-box',
        }}
      >
        {/* 3-Column Bento Grid with previous rich color themes */}
        <div className="bento-fullwidth-grid">
          {/* ============================================================
              COLUMN 1 (LEFT) - CARD 1 (Top): Brand & Visual Identity
              Theme: Orange (Graphic Design)
              ============================================================ */}
          <motion.div
            custom={{ delay: 0.05, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-1"
          >
            <Link
              href="/community/portfolio"
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
                  Complete visual identity systems covering logo design, Tamil typography hierarchies, packaging, and brand guidelines crafted by TNCC designers for ambitious regional brands.
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
              Tamil Nadu Creator Showcase - Full Visual Image
              ============================================================ */}
          <motion.div
            custom={{ delay: 0.18, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-center-item"
            style={{
              padding: 0,
              overflow: 'hidden',
              position: 'relative',
              minHeight: '440px',
              height: '100%',
            }}
          >
            <Link
              href="/community/portfolio"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'inherit',
              }}
            >
              <img
                src="/tncc-showcase-meet.jpg"
                alt="Tamil Nadu Creator Showcase Community"
                className="bento-center-img"
                loading="lazy"
              />
            </Link>
          </motion.div>

          {/* ============================================================
              COLUMN 3 (RIGHT) - CARD 3 (Top): Video & Motion Design
              Theme: Orange (Motion)
              ============================================================ */}
          <motion.div
            custom={{ delay: 0.31, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-right-1"
          >
            <Link
              href="/community/portfolio"
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
                  High-retention 2D/3D motion graphics, commercial reels, kinetic typography, and YouTube post-production edited by seasoned regional video artists.
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
            custom={{ delay: 0.44, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-2"
          >
            <Link
              href="/community/portfolio"
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
                  Viral short-form reels, typography teasers, aesthetic photography curation, and creator collaborations designed to build deeply loyal regional audiences.
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
            custom={{ delay: 0.57, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-right-2"
          >
            <Link
              href="/community/portfolio"
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
                  Human-centered digital products, intuitive mobile interfaces, accessible user journeys, and robust Figma design systems built for modern Tamil Nadu startups.
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
              COLUMN 1 (LEFT) - CARD 3 (Bottom): AI & 3D Art
              Theme: Coral / Amber
              ============================================================ */}
          <motion.div
            custom={{ delay: 0.70, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
            className="bento-box-item bento-left-3"
          >
            <Link
              href="/community/portfolio"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--orange-light)', color: 'var(--orange)' }}>
                    AI & 3D Art
                  </span>
                </div>
                <h3 className="bento-box-title">AI Art & 3D Visualization</h3>
                <p className="bento-box-text">
                  Pushing creative boundaries with Midjourney, ComfyUI, Blender 3D, and Unreal Engine. Exploring the intersection of Tamil heritage and digital futurism.
                </p>
              </div>

              {/* Bottom Right Single Action Circle Icon */}
              <div className="bento-box-action-row">
                <div
                  className="bento-action-circle"
                  style={{
                    background: 'var(--orange)',
                    boxShadow: '0 4px 14px rgba(232, 64, 32, 0.38)',
                  }}
                >
                  <Sparkles size={18} strokeWidth={2.3} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ============================================================
              SPANNING ROW 3, COLS 2 & 3: SmartMatch AI (Light Theme Card)
              Theme: Soft Indigo / Violet / Cyan Ambient Gradient
              ============================================================ */}
          <motion.div
            custom={{ delay: 0.83, isMobile }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: isMobile ? '140px 0px 0px 0px' : '0px', amount: isMobile ? 0 : 0.15 }}
            variants={popupVariants}
            whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25 } }}
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

            <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                  gap: '32px',
                  alignItems: 'center',
                }}
              >
                {/* Left Column: Heading, description & Interactive prompt box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                      <Sparkles size={13} /> TNCC AI Matchmaker
                    </div>
                    <h3
                      style={{
                        color: 'var(--navy)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
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
                        fontSize: '0.92rem',
                        lineHeight: 1.5,
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
                      padding: '16px 20px',
                      boxShadow: '0 10px 28px rgba(13, 44, 91, 0.08)',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
                        <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.02em' }}>
                          TNCC SmartMatch AI
                        </span>
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '100px', border: '1px solid #A7F3D0' }}>
                        ● Live AI Match
                      </span>
                    </div>

                    <div style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '12px' }}>
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
                        placeholder="e.g. Find senior video editors in Coimbatore and brand designers..."
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

                {/* Right Column: Realistic Creators Collaboration Image */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 16px 36px rgba(13, 44, 91, 0.12)',
                    height: '100%',
                    minHeight: '260px',
                    width: '100%',
                    background: '#FFFFFF',
                  }}
                >
                  <img
                    src="/smartmatch-creators.jpg"
                    alt="Tamil Nadu Creators Collaboration"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    className="hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Public Showcase CTA */}
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          margin: '54px auto 0',
          padding: '0 24px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Link href="/community/auth?mode=register" className="btn btn-primary btn-lg">
            SHOWCASE YOUR WORK
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
