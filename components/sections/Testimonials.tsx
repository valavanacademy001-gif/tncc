'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Briefcase, Users } from 'lucide-react';
import { mockTestimonials } from '@/lib/mock-data';

const typeIcon = { creator: User, employer: Briefcase, community: Users };
const typeLabel = { creator: 'Creator', employer: 'Employer', community: 'Community' };
const typeColor = { creator: 'var(--cyan)', employer: 'var(--orange)', community: 'var(--yellow)' };
const typeBg = { creator: 'var(--cyan-light)', employer: 'var(--orange-light)', community: 'var(--yellow-light)' };

export default function Testimonials() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? mockTestimonials
    : mockTestimonials.filter(t => t.type === filter);

  // Repeat items so the infinite track is always smooth and seamless
  const duplicatedList = [...filtered, ...filtered, ...filtered, ...filtered];

  return (
    <section
      id="community-testimonials"
      style={{
        background: '#FFFFFF',
        padding: '90px 0 110px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* Centered Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            className="section-label"
            style={{
              justifyContent: 'center',
              display: 'inline-flex',
              marginBottom: '14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--orange)',
            }}
          >
            What people say
          </div>
          <h2
            className="text-display-md"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: 'var(--navy)',
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
            }}
          >
            Straight from the community.
          </h2>
          <p
            style={{
              color: 'var(--gray-500)',
              fontSize: '1.05rem',
              maxWidth: '540px',
              margin: '0 auto 28px',
              lineHeight: 1.5,
            }}
          >
            Real feedback from creators, founders, and creative directors across Tamil Nadu.
          </p>

          {/* Filter Tabs */}
          <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['all', 'creator', 'employer', 'community'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: `1.5px solid ${filter === tab ? 'var(--navy)' : 'var(--gray-200)'}`,
                  background: filter === tab ? 'var(--navy)' : '#FFFFFF',
                  color: filter === tab ? '#FFFFFF' : 'var(--gray-600)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: filter === tab ? '0 4px 12px rgba(13, 44, 91, 0.15)' : 'none',
                }}
              >
                {tab === 'all' ? 'All' : typeLabel[tab as keyof typeof typeLabel]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width Carousel Marquee with Left & Right White Gradients */}
      <div className="testimonials-fullwidth-wrapper">
        {/* Left White Gradient Fade Mask */}
        <div className="gradient-fade-left" />

        {/* Right White Gradient Fade Mask */}
        <div className="gradient-fade-right" />

        {/* Continuous Right-to-Left Infinite Scrolling Track */}
        <div className="testimonial-scroll-track" key={filter}>
          {duplicatedList.map((testimonial, index) => {
            const Icon = typeIcon[testimonial.type];
            const color = typeColor[testimonial.type];
            const bg = typeBg[testimonial.type];

            return (
              <div
                key={`${testimonial.id}-${index}`}
                className="testimonial-carousel-card"
              >
                {/* Top Row: Quote Icon & Stars */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center' }}>
                    <Quote size={28} fill="#E2E8F0" />
                  </div>

                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        size={15}
                        color="#F5A623"
                        fill={si < testimonial.rating ? '#F5A623' : 'none'}
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote Content */}
                <p className="testimonial-text">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="testimonial-author-row">
                  {/* Initial Avatar */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--navy)', lineHeight: 1.25 }}>
                      {testimonial.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--gray-500)',
                        marginTop: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {testimonial.role}, {testimonial.company} • {testimonial.location}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '4px 10px',
                      background: bg,
                      borderRadius: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={12} color={color} />
                    <span>{typeLabel[testimonial.type]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .testimonials-fullwidth-wrapper {
          position: relative;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          padding: 16px 0;
        }

        /* White Gradients on Left and Right */
        .gradient-fade-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 160px;
          background: linear-gradient(to right, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 0) 100%);
          z-index: 10;
          pointer-events: none;
        }

        .gradient-fade-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 160px;
          background: linear-gradient(to left, rgba(255, 255, 255, 1) 15%, rgba(255, 255, 255, 0) 100%);
          z-index: 10;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .gradient-fade-left,
          .gradient-fade-right {
            width: 60px;
          }
        }

        /* Infinite Smooth Marquee: Right to Left */
        .testimonial-scroll-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marqueeRightToLeft 42s linear infinite;
        }

        .testimonial-scroll-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Card Styling */
        .testimonial-carousel-card {
          width: 380px;
          flex-shrink: 0;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 24px;
          padding: 30px 28px;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          box-shadow: 0 4px 20px rgba(13, 44, 91, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .testimonial-carousel-card:hover {
          border-color: #D1D5DB;
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(13, 44, 91, 0.09);
        }

        .testimonial-text {
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.65;
          margin: 0 0 24px;
          flex: 1;
        }

        .testimonial-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 18px;
          border-top: 1px solid #F1F5F9;
        }
      `}</style>
    </section>
  );
}
