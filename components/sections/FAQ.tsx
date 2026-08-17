'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import { mockFAQs } from '@/lib/mock-data';

function FAQItem({ faq, index }: { faq: typeof mockFAQs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      style={{
        border: `1.5px solid ${open ? 'var(--cyan)' : 'var(--gray-200)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        background: 'white',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
        aria-expanded={open}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '0.975rem',
          color: 'var(--navy)',
          lineHeight: 1.4,
          flex: 1,
        }}>
          {faq.question}
        </span>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: open ? 'var(--cyan)' : 'var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}>
          <ChevronDown
            size={16}
            color={open ? 'white' : 'var(--gray-500)'}
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 24px 20px',
              fontSize: '0.9rem',
              color: 'var(--gray-500)',
              lineHeight: 1.7,
            }}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'start',
        }} className="faq-grid">
          {/* Header */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>Got questions?</div>
            <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '16px', maxWidth: '360px' }}>
              Things people ask.
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px', maxWidth: '320px' }}>
              If your question isn't here, reach out — we're always happy to help.
            </p>
            <a
              href="mailto:hello@tncc.in"
              style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              hello@tncc.in →
            </a>
          </div>

          {/* FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockFAQs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr 2fr !important;
          }
        }
      `}</style>
    </section>
  );
}
