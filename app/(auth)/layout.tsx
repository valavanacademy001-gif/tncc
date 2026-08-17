'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      {/* Background grid */}
      <div className="bg-grid" style={{ position: 'fixed', inset: 0, opacity: 0.4 }} aria-hidden="true" />

      {/* Logo */}
      <Link href="/" style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 10,
      }}>
        <Image
          src="/brand/logo.webp"
          alt="Tamil Nadu Creators Club"
          width={155}
          height={48}
          style={{ objectFit: 'contain', height: 'auto', maxHeight: '40px', width: 'auto' }}
          priority
        />
      </Link>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 8px 48px rgba(13,44,91,0.1)',
        border: '1px solid rgba(13,44,91,0.06)',
        position: 'relative',
        zIndex: 10,
      }}>
        {children}
      </div>

      {/* Footer */}
      <p style={{
        marginTop: '24px',
        fontSize: '0.75rem',
        color: 'var(--gray-400)',
        position: 'relative',
        zIndex: 10,
      }}>
        © 2026 Tamil Nadu Creators Club. All rights reserved.
      </p>
    </div>
  );
}
