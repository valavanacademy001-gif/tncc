'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Link2, Play, X as XIcon, ArrowRight } from 'lucide-react';

const footerLinks = {
  explore: [
    { label: 'Explore', href: '/explore' },
    { label: 'Creators', href: '/creators' },
    { label: 'Projects', href: '/projects' },
    { label: 'Packages', href: '/packages' },
    { label: 'Events', href: '/events' },
  ],
  creators: [
    { label: 'Find Work', href: '/app' },
    { label: 'My Dashboard', href: '/app/dashboard' },
    { label: 'My Bids', href: '/app/bids' },
    { label: 'My Packages', href: '/app/packages' },
    { label: 'Creator Plans', href: '/#pricing' },
  ],
  employers: [
    { label: 'Hire Creators', href: '/app/hiring' },
    { label: 'Post a Project', href: '/app/hiring/projects/new' },
    { label: 'My Projects', href: '/app/hiring/projects' },
    { label: 'Browse Proposals', href: '/app/hiring/proposals' },
    { label: 'Business Plans', href: '/#pricing' },
  ],
  company: [
    { label: 'About TNCC', href: '/about' },
    { label: 'Community', href: '/events' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white' }}>
      {/* Main footer */}
      <div className="container" style={{ padding: '80px 24px 48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Image
              src="/brand/logo.webp"
              alt="Tamil Nadu Creators Club"
              width={140}
              height={48}
              style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '44px', marginBottom: '20px', filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: '24px', maxWidth: '220px' }}>
              Tamil Nadu's creative marketplace and community. Where talent meets opportunity.
            </p>
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

          {/* Link columns */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.explore.map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              For Creators
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.creators.map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              For Employers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.employers.map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.company.map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }} className="footer-link">
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
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Tamil Nadu Creators Club. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['LEARN', 'CONNECT', 'GROW', 'IMPACT'].map((word, i) => (
              <span key={word} style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--orange)' : i === 2 ? 'var(--yellow)' : 'rgba(255,255,255,0.5)',
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
