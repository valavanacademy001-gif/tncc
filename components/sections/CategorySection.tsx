'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Palette, Layers, Video, Camera, Monitor, PenLine, 
  Code2, TrendingUp, Share2, Sparkles, CalendarDays, ArrowRight
} from 'lucide-react';
import { mockCategories } from '@/lib/mock-data';

const iconMap: Record<string, React.ElementType> = {
  Palette, Layers, Video, Camera, Monitor, PenLine,
  Code2, TrendingUp, Share2, Sparkles, CalendarDays,
  PaintBrush: Palette, // fallback
};

function CategoryCard({ category, index }: { category: typeof mockCategories[0]; index: number }) {
  const Icon = iconMap[category.icon] || Palette;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/creators?category=${encodeURIComponent(category.name)}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 22px',
          background: '#F4F5F7',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          borderRadius: '22px',
          textDecoration: 'none',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
        className="cat-card"
      >
        {/* Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: category.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          transition: 'transform 0.25s ease',
        }} className="cat-icon">
          <Icon size={24} color={category.color} />
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--navy)',
          marginBottom: '6px',
          lineHeight: 1.3,
        }}>
          {category.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--gray-500)',
          lineHeight: 1.5,
          marginBottom: '18px',
          flex: 1,
        }}>
          {category.description}
        </p>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: category.color,
          }}>
            {category.creatorCount} creators
          </span>
          <ArrowRight size={14} color="var(--gray-400)" className="cat-arrow" style={{ transition: 'transform 0.2s ease' }} />
        </div>

        {/* Hover accent border */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: category.color,
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.25s ease',
        }} className="cat-border" />
      </Link>

      <style jsx>{`
        .cat-card:hover {
          background: #FFFFFF !important;
          border-color: rgba(13, 44, 91, 0.08) !important;
          box-shadow: 0 16px 36px rgba(13, 44, 91, 0.08) !important;
          transform: translateY(-4px) !important;
        }
        .cat-card:hover .cat-icon {
          transform: scale(1.08) !important;
        }
        .cat-card:hover .cat-border {
          transform: scaleX(1) !important;
        }
        .cat-card:hover .cat-arrow {
          transform: translateX(4px) !important;
        }
      `}</style>
    </motion.div>
  );
}

export default function CategorySection() {
  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label" style={{ marginBottom: '16px' }}>What we do</div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display-md"
            style={{ color: 'var(--navy)', maxWidth: '560px', marginBottom: '16px' }}
          >
            Every kind of creative work, in one place.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'var(--gray-500)', fontSize: '1.05rem', maxWidth: '480px' }}
          >
            From brand identity to motion design, photography to development — TNCC has creators for it.
          </motion.p>
        </div>

        {/* Grid - 8 Cards in balanced 4x2 layout */}
        <div className="category-grid-8">
          {mockCategories.slice(0, 8).map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>

        {/* Browse all */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <Link href="/explore" className="btn btn-secondary">
            Browse all categories
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .category-grid-8 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .category-grid-8 {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 560px) {
          .category-grid-8 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
