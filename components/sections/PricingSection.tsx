'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, X, ArrowRight, Zap } from 'lucide-react';
import { pricingPlans } from '@/lib/mock-data';

export default function PricingSection() {
  const [tab, setTab] = useState<'freelancer' | 'employer'>('freelancer');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const plans = tab === 'freelancer' ? pricingPlans.freelancer : pricingPlans.employer;

  return (
    <section id="pricing" className="section" style={{ background: 'var(--cream)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            Membership
          </div>
          <h2 className="text-display-md" style={{ color: 'var(--navy)', marginBottom: '12px' }}>
            Plans for every stage.
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1rem', marginBottom: '32px' }}>
            Start free. Upgrade when you're ready.
          </p>

          {/* Role tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="tab-list" style={{ maxWidth: '320px', width: '100%' }}>
              {[
                { value: 'freelancer', label: 'For Creators' },
                { value: 'employer', label: 'For Employers' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value as 'freelancer' | 'employer')}
                  className={`tab-item ${tab === t.value ? 'active' : ''}`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Billing toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.875rem', color: billing === 'monthly' ? 'var(--navy)' : 'var(--gray-400)', fontWeight: billing === 'monthly' ? 600 : 400 }}>
              Monthly
            </span>
            <button
              onClick={() => setBilling(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: billing === 'yearly' ? 'var(--orange)' : 'var(--gray-300)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.25s ease',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: billing === 'yearly' ? '22px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                transition: 'left 0.25s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
            <span style={{ fontSize: '0.875rem', color: billing === 'yearly' ? 'var(--navy)' : 'var(--gray-400)', fontWeight: billing === 'yearly' ? 600 : 400 }}>
              Yearly
              <span style={{
                marginLeft: '6px',
                padding: '2px 6px',
                background: 'var(--orange-light)',
                color: 'var(--orange)',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plans grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + billing}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="pricing-cards-grid"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="pricing-plan-card"
                style={{
                  background: plan.highlight ? 'var(--navy)' : 'white',
                  border: `2px solid ${plan.highlight ? 'var(--orange)' : 'var(--gray-200)'}`,
                  borderRadius: '24px',
                  padding: '32px 28px',
                  position: 'relative',
                  boxShadow: plan.highlight ? '0 16px 48px rgba(13,44,91,0.22)' : '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--orange)',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Zap size={10} fill="white" />
                    {plan.badge}
                  </div>
                )}

                {/* Plan details container expanding to fill height */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Plan name & description */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: plan.highlight ? 'white' : 'var(--navy)', marginBottom: '4px' }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)', minHeight: '40px', lineHeight: 1.4 }}>
                      {plan.description}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${plan.highlight ? 'rgba(255,255,255,0.12)' : 'var(--gray-200)'}`, minHeight: '74px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: plan.highlight ? 'white' : 'var(--navy)' }}>
                        {plan.price[billing] === 0 ? 'Free' : `₹${plan.price[billing].toLocaleString('en-IN')}`}
                      </span>
                      {plan.price[billing] > 0 && (
                        <span style={{ fontSize: '0.8rem', color: plan.highlight ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)', fontWeight: 400 }}>
                          /{billing === 'monthly' ? 'month' : 'month billed yearly'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {plan.features.map(feature => (
                      <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2 size={16} color={plan.highlight ? 'var(--cyan)' : 'var(--orange)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.85rem', color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--gray-600)', lineHeight: 1.4 }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA - pinned to bottom */}
                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                  <Link
                    href="/app"
                    className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      width: '100%',
                      height: '48px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      ...(plan.highlight ? {} : { borderColor: 'var(--gray-300)' })
                    }}
                  >
                    {plan.cta}
                    {plan.id !== 'free' && plan.id !== 'starter' && <ArrowRight size={16} />}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust line */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--gray-400)', fontSize: '0.825rem' }}>
          No credit card required to start · Cancel anytime · Plans can be changed at any time
        </div>
      </div>
    </section>
  );
}
