'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { mockProjects } from '@/lib/mock-data';

function formatBudget(budget: { min: number; max: number; currency: string }) {
  const fmt = (n: number) => n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;
  return `${fmt(budget.min)} – ${fmt(budget.max)}`;
}

function daysAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date('2026-08-17');
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
}

function ProjectCard({ project, large = false }: { project: typeof mockProjects[0]; large?: boolean }) {
  const catColors: Record<string, string> = {
    'Graphic Design': 'var(--orange)',
    'Development': 'var(--navy)',
    'UI/UX Design': 'var(--cyan)',
    'Video & Motion': 'var(--orange)',
    'Photography': 'var(--cyan)',
    'Social Media': 'var(--yellow)',
    'Marketing': 'var(--orange)',
    'Content Creation': 'var(--yellow)',
    'Events': 'var(--orange)',
  };
  const catBg: Record<string, string> = {
    'Graphic Design': 'var(--orange-light)',
    'Development': '#EEF2FF',
    'UI/UX Design': 'var(--cyan-light)',
    'Video & Motion': 'var(--orange-light)',
    'Photography': 'var(--cyan-light)',
    'Social Media': 'var(--yellow-light)',
    'Marketing': 'var(--orange-light)',
    'Content Creation': 'var(--yellow-light)',
    'Events': 'var(--orange-light)',
  };
  const color = catColors[project.category] || 'var(--navy)';
  const bgc = catBg[project.category] || 'var(--gray-100)';

  return (
    <Link
      href={`/projects/${project.id}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div style={{
        background: 'white',
        border: '1.5px solid var(--gray-200)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }} className="project-card">
        {/* Image placeholder with category color */}
        <div style={{
          height: large ? '220px' : '160px',
          background: `linear-gradient(135deg, ${bgc}, white)`,
          position: 'relative',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '20px',
          overflow: 'hidden',
        }}>
          {/* Background pattern */}
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

          {/* Budget badge */}
          <div style={{
            background: 'var(--navy)',
            color: 'white',
            borderRadius: '100px',
            padding: '6px 14px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.875rem',
            zIndex: 1,
          }}>
            {formatBudget(project.budget)}
          </div>

          {/* Status */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255,255,255,0.95)',
            padding: '5px 10px',
            borderRadius: '100px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#10B981',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Open
          </div>

          {/* Remote badge */}
          {project.remote && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(255,255,255,0.95)',
              padding: '4px 8px',
              borderRadius: '100px',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--cyan)',
            }}>
              Remote OK
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Category */}
          <div style={{
            display: 'inline-block',
            padding: '3px 10px',
            background: bgc,
            borderRadius: '100px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color,
            marginBottom: '10px',
            width: 'fit-content',
          }}>
            {project.category}
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: large ? '1.125rem' : '0.975rem',
            color: 'var(--navy)',
            lineHeight: 1.3,
            marginBottom: '12px',
            flex: 1,
          }}>
            {project.title}
          </h3>

          {/* Skills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px' }}>
            {project.skills.slice(0, 3).map(skill => (
              <span key={skill} style={{
                padding: '3px 8px',
                background: 'var(--gray-100)',
                borderRadius: '100px',
                fontSize: '0.7rem',
                color: 'var(--gray-600)',
                fontWeight: 500,
              }}>
                {skill}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--gray-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                <MapPin size={12} />
                {project.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                <Users size={12} />
                {project.proposals} proposals
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>{daysAgo(project.postedAt)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-card:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 12px 40px rgba(13,44,91,0.14) !important;
          transform: translateY(-5px) !important;
        }
      `}</style>
    </Link>
  );
}

export default function FeaturedProjects() {
  const featured = mockProjects.filter(p => p.featured).slice(0, 3);
  const others = mockProjects.filter(p => !p.featured).slice(0, 3);

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>Opportunities</div>
            <h2 className="text-display-md" style={{ color: 'var(--navy)', maxWidth: '500px' }}>
              Work worth your attention.
            </h2>
          </div>
          <Link href="/projects" className="btn btn-secondary" style={{ flexShrink: 0 }}>
            All projects <ArrowRight size={16} />
          </Link>
        </div>

        {/* Featured asymmetric grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
          className="featured-grid"
        >
          {/* Large featured */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="featured-large"
          >
            <ProjectCard project={featured[0]} large={true} />
          </motion.div>

          {/* Stacked smaller */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {featured.slice(1).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Row of 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {others.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .featured-grid {
            grid-template-columns: 1.4fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
