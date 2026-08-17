'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, CheckCircle, Clock, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import { mockProjects, mockCreators } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';

function StatCard({ label, value, color, icon: Icon, sub }: { label: string; value: string | number; color: string; icon: React.ElementType; sub?: string }) {
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>{label}</div>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--navy)' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

export default function EmployerDashboard() {
  const { user } = useUser();
  const firstName = user.name?.split(' ')[0] || 'there';

  const openProjects = mockProjects.slice(0, 3);
  const suggestedCreators = mockCreators.filter(c => c.availability === 'available').slice(0, 3);

  return (
    <div style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '4px' }}>Employer Dashboard</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--navy)', marginBottom: '6px' }}>
            {firstName}'s Workspace
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Find, hire, and collaborate with Tamil Nadu's best creators.</p>
        </div>
        <Link href="/app/hiring/projects/new" className="btn btn-primary">
          <Plus size={16} /> Post a Project
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Active projects" value={0} color="var(--orange)" icon={Briefcase} />
        <StatCard label="Pending proposals" value={0} color="var(--cyan)" icon={Clock} />
        <StatCard label="Hired creators" value={0} color="#10B981" icon={Users} />
        <StatCard label="Completed" value={0} color="var(--navy)" icon={CheckCircle} />
        <StatCard label="Total spend" value="₹0" color="var(--yellow)" icon={TrendingUp} sub="Across all projects" />
        <StatCard label="Creators saved" value={0} color="var(--cyan)" icon={Eye} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="employer-grid">
        {/* Recent projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>Your projects</h2>
            <Link href="/app/hiring/projects" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>See all →</Link>
          </div>

          <div style={{
            background: 'white',
            border: '1.5px solid var(--gray-200)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--gray-400)' }}>
              <Briefcase size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>No projects yet</div>
              <div style={{ fontSize: '0.8rem', marginBottom: '20px' }}>Post your first project to start receiving proposals from Tamil Nadu's best creators.</div>
              <Link href="/app/hiring/projects/new" className="btn btn-primary btn-sm">
                <Plus size={14} /> Post a project
              </Link>
            </div>
          </div>
        </div>

        {/* Suggested creators */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>Available creators</h2>
            <Link href="/app/hiring/creators" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>Browse all →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {suggestedCreators.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/creators/${creator.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    border: '1.5px solid var(--gray-200)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                  }} className="creator-row">
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: creator.coverColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}>
                      {creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>{creator.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{creator.title} · {creator.location}</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {creator.skills.slice(0, 2).map(s => (
                          <span key={s} style={{ padding: '2px 7px', background: 'var(--gray-100)', borderRadius: '100px', fontSize: '0.65rem', color: 'var(--gray-600)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>₹{creator.hourlyRate}/hr</div>
                      <div style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>● Available</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .creator-row:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
        }
        @media (min-width: 1024px) {
          .employer-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
