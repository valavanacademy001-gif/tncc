'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/lib/user-context';
import {
  Zap, CheckCircle2, Briefcase, TrendingUp, Eye, Bookmark,
  ArrowRight, Star, Clock, Plus, Target
} from 'lucide-react';
import { mockProjects, mockCreators } from '@/lib/mock-data';

function StatCard({ label, value, sublabel, color, icon: Icon }: {
  label: string; value: string | number; sublabel?: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <div style={{
      background: 'white',
      border: '1.5px solid var(--gray-200)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: color + '20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--navy)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginTop: '4px' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '2px' }}>{sublabel}</div>}
      </div>
    </div>
  );
}

export default function FreelancerDashboard() {
  const { user } = useUser();
  const firstName = user.name?.split(' ')[0] || 'Creator';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const recommended = mockProjects.slice(0, 4);

  return (
    <div style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '4px' }}>{greeting}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--navy)', marginBottom: '8px' }}>
          {firstName} 👋
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
          Projects matching your skills, right here.
        </p>
      </div>

      {/* Bid allowance banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'var(--yellow-light)',
          border: '1.5px solid var(--yellow)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>Free bid allowance</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>2 of 2 free bids left this month</div>
          </div>
        </div>
        <Link href="/#pricing" className="btn btn-yellow btn-sm">
          Upgrade for more
        </Link>
      </motion.div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard label="Active bids" value={0} color="var(--orange)" icon={Target} />
        <StatCard label="Accepted bids" value={0} color="#10B981" icon={CheckCircle2} />
        <StatCard label="Packages listed" value={0} color="var(--cyan)" icon={Briefcase} />
        <StatCard label="Profile views" value={0} sublabel="This month" color="var(--navy)" icon={Eye} />
        <StatCard label="Saved projects" value={0} color="var(--yellow)" icon={Bookmark} />
        <StatCard label="Completed" value={0} sublabel="Total projects" color="#10B981" icon={Star} />
      </div>

      {/* Earnings summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 600 }}>Still in progress</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'white' }}>₹0</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          borderRadius: '20px',
          padding: '24px',
          color: 'white',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 600 }}>Completed earnings</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'white' }}>₹0</div>
        </div>
      </div>

      {/* Recommended projects */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--navy)' }}>
              Recommended for you
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '2px' }}>Projects matching your skills</p>
          </div>
          <Link href="/app/projects" style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>
            See all →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommended.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  border: '1.5px solid var(--gray-200)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                }} className="project-row">
                  {/* Category dot */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'var(--orange-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--orange)',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                  }}>
                    {project.category.split(' ')[0].slice(0, 2)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>
                      {project.budget.currency === 'INR' ? '₹' : ''}{project.budget.min.toLocaleString('en-IN')} – ₹{project.budget.max.toLocaleString('en-IN')} · {project.location} · {project.proposals} bids
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                      <Clock size={11} />
                      Expires in 7 days
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: 'var(--orange-light)',
                        color: 'var(--orange)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}>
                        {project.proposals} bids
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .project-row:hover {
          border-color: var(--gray-300) !important;
          box-shadow: 0 4px 16px rgba(13,44,91,0.08) !important;
        }
      `}</style>
    </div>
  );
}
