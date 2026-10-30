'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  Trophy,
  Check
} from 'lucide-react';

export default function PricingSection() {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
      setTimeout(() => setWaitlistSubmitted(false), 5000);
      setWaitlistEmail('');
    }
  };

  const freeFeatures = [
    'Complete access to Community Feed & discussions',
    'Automatic portfolio showcase synced with your works',
    'Participate in creative design & video challenges',
    'Earn Experience Points (XP) & statewide leaderboard rank',
    'Free access to curated Tamil fonts, LUTs, AI tools & guides',
    'Connect with fellow creators across Tamil Nadu',
    'Zero platform fees — 100% free forever',
  ];

  const proFeatures = [
    'Direct freelance client matching & high-budget project leads',
    'Hire verified top Tamil Nadu creators & post custom briefs',
    'Verified Pro Creator badge & priority client spotlight',
    'Zero-commission client invoicing & secure payment escrow',
    'Standardized scopes, legal contracts & pricing templates',
    'Priority placement in TNCC statewide hiring directory',
    'Dedicated support & client dispute protection',
  ];

  return (
    <section id="pricing" className="section" style={{ background: 'var(--cream)', padding: '100px 0 90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px', maxWidth: '780px', margin: '0 auto 52px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            COMMUNITY &amp; PRO PLANS
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '16px' }}>
            START FREE. UNLOCK FREELANCE &amp; HIRING WHEN READY.
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            TNCC is a free community for every creator in Tamil Nadu. Direct client freelance matching and employer hiring tools are coming soon.
          </p>
        </div>

        {/* 2 Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '960px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}>
          {/* Card 1: Free Community Plan */}
          <div style={{
            background: 'white',
            borderRadius: '28px',
            border: '1.5px solid var(--gray-200)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 24px rgba(13,44,91,0.04)',
            position: 'relative',
          }}>
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '100px',
                background: 'rgba(0, 181, 200, 0.1)',
                color: 'var(--cyan)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                <Sparkles size={12} />
                100% FREE COMMUNITY
              </div>

              {/* Plan Title & Description */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '6px' }}>
                Community Member
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: '24px' }}>
                For all designers, video editors, photographers, filmmakers and AI creators across Tamil Nadu.
              </p>

              {/* Price */}
              <div style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', color: 'var(--navy)', lineHeight: 1 }}>
                    ₹0
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-400)', fontWeight: 600 }}>
                    / Free Forever
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600, marginTop: '6px' }}>
                  ✓ No credit card required · Instant access
                </p>
              </div>

              {/* Feature List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {freeFeatures.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.45 }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/community/auth?mode=register"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              >
                JOIN THE COMMUNITY
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Card 2: Pro Freelance & Hiring (Paid - Coming Soon) */}
          <div style={{
            background: 'var(--navy)',
            color: 'white',
            borderRadius: '28px',
            border: '2px solid var(--orange)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(13,44,91,0.28)',
            position: 'relative',
          }}>
            {/* Ribbon Badge */}
            <div style={{
              position: 'absolute',
              top: '-13px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--orange)',
              color: 'white',
              padding: '5px 18px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(232, 64, 32, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}>
              <Zap size={12} fill="white" />
              COMING SOON · FREELANCE &amp; HIRING
            </div>

            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '100px',
                background: 'rgba(232, 64, 32, 0.2)',
                color: '#FF8A73',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                <Briefcase size={12} />
                PRO FREELANCER &amp; EMPLOYER
              </div>

              {/* Plan Title & Description */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '6px' }}>
                Freelance &amp; Hiring Pro
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '24px' }}>
                Direct freelance client matching, verified project scopes, and hiring top Tamil Nadu creators.
              </p>

              {/* Price */}
              <div style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', color: 'white', lineHeight: 1 }}>
                    ₹999
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    / monthly
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#FFB84D', fontWeight: 600, marginTop: '6px' }}>
                  ⚡ Launching soon · Join waitlist for 50% early bird discount
                </p>
              </div>

              {/* Feature List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {proFeatures.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={16} color="var(--cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Waitlist Form / CTA */}
            <div>
              {waitlistSubmitted ? (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  borderRadius: '16px',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#A7F3D0',
                }}>
                  ✓ You&apos;re on the early bird waitlist! We&apos;ll notify you at launch.
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter email for early access..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '100px',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      fontSize: '0.825rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap', fontWeight: 700, padding: '12px 20px' }}
                  >
                    WAITLIST
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Trust Note */}
        <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--gray-500)', fontSize: '0.825rem' }}>
          TNCC Community is 100% free with no hidden charges · Freelance &amp; Hiring Pro launches soon
        </div>
      </div>
    </section>
  );
}
