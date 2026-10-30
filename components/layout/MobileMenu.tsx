'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Briefcase, User2, Zap, MapPin, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'About', href: '#about', sub: 'More than a community' },
  { label: 'How It Works', href: '#how-it-works', sub: 'Your creative journey' },
  { label: 'Activities', href: '#activities', sub: 'Challenges, showcases & events' },
  { label: 'Benefits', href: '#benefits', sub: 'Why join TNCC' },
  { label: 'Plans', href: '#pricing', sub: 'Free Community & Pro Freelance' },
  { label: 'FAQ', href: '#faq', sub: 'Common questions & answers' },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8,26,58,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 150,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(360px, 100vw)',
              background: 'white',
              zIndex: 200,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--gray-200)',
            }}>
              <Image
                src="/brand/logo.webp"
                alt="TNCC"
                width={120}
                height={40}
                style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '36px' }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'var(--gray-100)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--navy)',
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            <div style={{ padding: '12px 16px', flex: 1 }}>
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 12px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      marginBottom: '4px',
                      transition: 'background 0.15s ease',
                    }}
                    className="mobile-nav-item"
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '1rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>{item.sub}</div>
                    </div>
                    <ArrowRight size={16} color="var(--gray-400)" />
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--gray-200)', margin: '12px 0' }} />

              {/* Sign in action */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/community/auth"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--cream)',
                    textDecoration: 'none',
                    marginBottom: '8px',
                    border: '1px solid var(--gray-200)',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <User2 size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>Member Sign In</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Access your creator account & XP</div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Footer CTA */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--gray-200)' }}>
              <Link href="/community/auth?mode=register" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Join Free Community
              </Link>
            </div>
          </motion.div>
        </>
      )}

      <style jsx>{`
        .mobile-nav-item:hover {
          background: var(--gray-100);
        }
      `}</style>
    </AnimatePresence>
  );
}
