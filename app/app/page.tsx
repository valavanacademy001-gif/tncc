'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User2, Briefcase, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { UserProvider, useUser } from '@/lib/user-context';

function RoleSelectionContent() {
  const [selected, setSelected] = useState<'freelancer' | 'employer' | null>(null);
  const { addRole, user } = useUser();
  const router = useRouter();

  const handleProceed = () => {
    if (!selected) return;
    addRole(selected);
    if (selected === 'freelancer') {
      router.push('/app/dashboard');
    } else {
      router.push('/app/hiring');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0 }} />

      {/* Logo top */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <Image
          src="/brand/logo.webp"
          alt="TNCC"
          width={120}
          height={40}
          style={{ objectFit: 'contain', height: 'auto', width: 'auto', maxHeight: '36px' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'white',
          borderRadius: '32px',
          padding: 'clamp(32px, 5vw, 56px)',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 24px 80px rgba(13,44,91,0.14)',
          border: '1.5px solid var(--gray-200)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            color: 'var(--navy)',
            marginBottom: '12px',
            lineHeight: 1.1,
          }}>
            How are you joining?
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '1rem', lineHeight: 1.6 }}>
            Pick your role to get started. You can switch between modes anytime.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          {[
            {
              value: 'freelancer' as const,
              title: "I'm a Creator",
              desc: 'Find projects, build a profile, offer packages',
              icon: User2,
              color: 'var(--cyan)',
              bg: 'var(--cyan-light)',
              border: 'var(--cyan)',
            },
            {
              value: 'employer' as const,
              title: "I'm Hiring",
              desc: 'Post projects, find talent, build your team',
              icon: Briefcase,
              color: 'var(--orange)',
              bg: 'var(--orange-light)',
              border: 'var(--orange)',
            },
          ].map(role => {
            const Icon = role.icon;
            const isSelected = selected === role.value;
            return (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                style={{
                  padding: '20px 16px',
                  borderRadius: '20px',
                  border: `2px solid ${isSelected ? role.border : 'var(--gray-200)'}`,
                  background: isSelected ? role.bg : 'var(--gray-100)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isSelected ? role.color : 'var(--gray-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <Icon size={22} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--navy)' : 'var(--gray-600)', marginBottom: '4px' }}>
                    {role.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', lineHeight: 1.4 }}>
                    {role.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleProceed}
          disabled={!selected}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            justifyContent: 'center',
            opacity: selected ? 1 : 0.4,
            cursor: selected ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
          }}
        >
          Continue
          <ArrowRight size={18} />
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '16px' }}>
          You can switch roles anytime from the dashboard.
        </p>
      </motion.div>
    </div>
  );
}

export default function AppEntryPage() {
  return (
    <UserProvider>
      <RoleSelectionContent />
    </UserProvider>
  );
}
