'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const communityFAQs = [
  {
    question: 'What is Tamil Nadu Creators Club?',
    answer: 'TNCC is a free creator community organized by Valavan Academy for creative individuals across Tamil Nadu.',
  },
  {
    question: 'Is TNCC free to join?',
    answer: 'Yes. TNCC is a completely free community. There are no membership fees or subscription plans.',
  },
  {
    question: 'Who can join TNCC?',
    answer: 'Designers, video editors, photographers, filmmakers, AI creators, students, freelancers and other creative individuals can join.',
  },
  {
    question: 'Can beginners join?',
    answer: 'Yes. Beginners and experienced creators are welcome.',
  },
  {
    question: 'Can I share my creative work?',
    answer: 'Yes. Members can publish their designs, videos, photography and other creative projects.',
  },
  {
    question: 'How do TNCC challenges work?',
    answer: 'Members can discover creative competitions, follow the guidelines, submit their work and get recognized through winner announcements.',
  },
  {
    question: 'How can I earn XP?',
    answer: 'Members earn XP through approved community activities, engagement and competition achievements.',
  },
  {
    question: 'Can I create my own portfolio?',
    answer: 'Yes. Members get a portfolio space where their selected creative projects can be showcased.',
  },
  {
    question: 'Can I access creative resources?',
    answer: 'Yes. Members can explore available fonts, tutorials, useful websites, tools and recorded sessions.',
  },
  {
    question: 'How can I find job opportunities?',
    answer: 'Published creative hiring opportunities can be explored through the member dashboard.',
  },
  {
    question: 'Who organizes TNCC?',
    answer: 'Tamil Nadu Creators Club is organized by Valavan Academy.',
  },
];

function FAQItem({ faq, index }: { faq: typeof communityFAQs[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      style={{
        border: `1.5px solid ${open ? 'var(--orange)' : 'var(--gray-200)'}`,
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
          background: open ? 'var(--orange)' : 'var(--gray-100)',
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
              color: 'var(--gray-600)',
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
    <section id="faq" className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'start',
        }} className="faq-grid">
          {/* Header */}
          <div className="faq-header">
            <div className="section-label" style={{ marginBottom: '16px' }}>Got questions?</div>
            <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '16px', maxWidth: '380px' }}>
              FREQUENTLY ASKED QUESTIONS.
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px', maxWidth: '340px' }}>
              Everything you need to know about joining, sharing, competing, and growing inside TNCC.
            </p>
            <a
              href="mailto:hello@tncc.in"
              style={{ color: 'var(--orange)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              hello@tncc.in →
            </a>
          </div>

          {/* FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {communityFAQs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-header {
          position: static;
        }
        @media (min-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr 2fr !important;
          }
          .faq-header {
            position: sticky !important;
            top: 96px !important;
          }
        }
      `}</style>
    </section>
  );
}
