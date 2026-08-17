'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Star, ArrowRight, Package } from 'lucide-react';
import { mockPackages } from '@/lib/mock-data';

function PackageCard({ pkg, index }: { pkg: typeof mockPackages[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/packages/${pkg.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'white',
          border: '1.5px solid var(--gray-200)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          height: '100%',
        }} className="pkg-card">
          {/* Image area */}
          <div style={{
            height: '140px',
            background: pkg.popular
              ? 'linear-gradient(135deg, var(--navy), var(--navy-mid))'
              : 'linear-gradient(135deg, var(--cream), var(--gray-100))',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: pkg.popular ? 0.15 : 0.4 }} />

            <Package size={40} color={pkg.popular ? 'rgba(255,255,255,0.4)' : 'var(--gray-300)'} />

            {pkg.popular && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--yellow)',
                color: 'var(--navy)',
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}>
                POPULAR
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '18px' }}>
            {/* Category */}
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {pkg.category}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--navy)',
              marginBottom: '6px',
              lineHeight: 1.3,
            }}>
              {pkg.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--gray-500)',
              lineHeight: 1.5,
              marginBottom: '14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {pkg.description}
            </p>

            {/* Creator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-display)',
              }}>
                {pkg.creator.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)' }}>{pkg.creator}</span>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--gray-100)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--navy)' }}>
                  ₹{pkg.price.toLocaleString('en-IN')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Clock size={11} color="var(--gray-400)" />
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{pkg.deliveryDays} days delivery</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} color="#F5A623" fill="#F5A623" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>{pkg.rating}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>({pkg.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .pkg-card:hover {
            border-color: var(--gray-300) !important;
            box-shadow: 0 12px 40px rgba(13,44,91,0.14) !important;
            transform: translateY(-5px) !important;
          }
        `}</style>
      </Link>
    </motion.div>
  );
}

export default function PackagesSection() {
  return (
    <section className="section" style={{ background: 'var(--navy)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--yellow)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--yellow)', display: 'inline-block', borderRadius: '1px' }} />
              Ready to buy
            </div>
            <h2 className="text-display-md" style={{ color: 'white', maxWidth: '500px' }}>
              Creative help, ready when you are.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', marginTop: '12px', maxWidth: '400px' }}>
              No briefs, no proposals — just pick a package and get started.
            </p>
          </div>
          <Link href="/packages" className="btn" style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1.5px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
            borderRadius: '100px',
            padding: '10px 20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            All packages <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {mockPackages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
