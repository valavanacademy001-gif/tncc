'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Link2, Play, X as XIcon } from 'lucide-react';

const footerNav = {
  community: [
    { label: 'About TNCC', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Community Activities', href: '#activities' },
    { label: 'Why Join TNCC (Benefits)', href: '#benefits' },
  ],
  membership: [
    { label: 'Sign In', href: '/community/auth' },
    { label: 'Join Free', href: '/community/auth?mode=register' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Community Guidelines', href: '#community-guidelines' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Organized by Valavan Academy', href: '#about' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white' }}>
      {/* Main footer */}
      <div className="container" style={{ padding: '80px 24px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Image
              src="/brand/logo.webp"
              alt="TNCC – Tamil Nadu Creators Club"
              width={145}
              height={48}
              style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '42px', marginBottom: '16px', filter: 'brightness(0) invert(1)' }}
            />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'white',
              marginBottom: '6px',
            }}>
              TNCC – TAMIL NADU CREATORS CLUB
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', marginBottom: '16px', maxWidth: '280px' }}>
              A creative community for creators across Tamil Nadu.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(232, 64, 32, 0.2)',
              border: '1px solid rgba(232, 64, 32, 0.4)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#FF7A59',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              ORGANIZED BY VALAVAN ACADEMY
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: ExternalLink, href: 'https://instagram.com/tncreatorclub', label: 'Instagram' },
                { icon: XIcon, href: '#', label: 'X (Twitter)' },
                { icon: Link2, href: '#', label: 'LinkedIn' },
                { icon: Play, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                    color: 'white',
                  }}
                  className="social-btn"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Link columns */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Community
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.community.map(item => (
                <li key={item.label}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Membership &amp; FAQ
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.membership.map(item => (
                <li key={item.label}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Guidelines &amp; Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {footerNav.legal.map(item => (
                <li key={item.label}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            © 2026 Tamil Nadu Creators Club (TNCC). Organized by Valavan Academy. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['CREATE', 'CONNECT', 'COMPETE', 'GROW'].map((word, i) => (
              <span key={word} style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--orange)' : i === 2 ? '#F5A623' : '#10B981',
              }}>
                {word}{i < 3 ? <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 6px' }}>·</span> : ''}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link:hover { color: white !important; }
        .social-btn:hover { background: rgba(255,255,255,0.2) !important; }
      `}</style>
    </footer>
  );
}
