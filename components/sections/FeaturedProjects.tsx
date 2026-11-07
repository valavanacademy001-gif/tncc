'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Link from 'next/link';
import {
  Palette,
  Share2,
  Video,
  Layers,
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
        background: 'var(--lp-bg-alt)',
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
              color: 'var(--lp-text-title)',
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
              color: 'var(--lp-text-body)',
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
