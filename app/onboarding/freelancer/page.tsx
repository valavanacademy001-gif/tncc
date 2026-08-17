'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { createClient } from '@/lib/supabase/client';

const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore', 'Tiruppur', 'Erode', 'Tirunelveli', 'Kanchipuram'];
const SKILL_OPTIONS = ['Photoshop', 'Illustrator', 'Figma', 'After Effects', 'Premiere Pro', 'Blender', 'Branding', 'Typography', 'Logo Design', 'Social Media Design', 'UI Design', 'Motion Design', 'Photography', 'Video Editing', 'React', 'Next.js'];

export default function FreelancerOnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Graphic Design');
  const [experience, setExperience] = useState('3');
  const [hourlyRate, setHourlyRate] = useState('1500');
  const [location, setLocation] = useState('Chennai');
  const [about, setAbout] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Figma', 'Branding']);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      if (user?.id && user.id !== 'demo-user') {
        // Upsert freelancer profile
        await supabase.from('freelancer_profiles').upsert({
          user_id: user.id,
          professional_title: title,
          experience_years: parseInt(experience, 10),
          hourly_rate: parseFloat(hourlyRate),
          location,
          about,
        }, { onConflict: 'user_id' });

        // Update profile onboarding complete
        await supabase.from('profiles').update({
          onboarding_complete: true,
          location,
        }).eq('id', user.id);
      }

      setUser({
        freelancerOnboardingComplete: true,
        activeRole: 'freelancer',
        location,
      });

      // If user also selected employer role, go to employer setup next, else go to app dashboard
      if (user.roles?.includes('employer') && !user.employerOnboardingComplete) {
        router.push('/onboarding/employer');
      } else {
        router.push('/app');
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      router.push('/app');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '640px',
        boxShadow: '0 8px 48px rgba(13,44,91,0.1)',
        border: '1px solid rgba(13,44,91,0.06)',
      }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--cyan)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            Step 2 of 2 — Creator Profile
          </div>
          <h1 style={{
            fontSize: '1.6rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--navy)',
            marginBottom: '6px',
          }}>
            Set up your creator profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            This helps clients in Tamil Nadu find and hire you for projects.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Professional Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              Professional Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Brand Designer & Illustrator"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(13,44,91,0.12)',
                background: 'var(--cream)',
                fontSize: '0.875rem',
                color: 'var(--navy)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(13,44,91,0.12)',
                  background: 'var(--cream)',
                  fontSize: '0.875rem',
                  color: 'var(--navy)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {['Graphic Design', 'Brand Identity', 'UI/UX Design', 'Web Development', 'Video Editing', 'Motion Graphics', 'Photography', 'Illustration'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Base City (Tamil Nadu)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(13,44,91,0.12)',
                  background: 'var(--cream)',
                  fontSize: '0.875rem',
                  color: 'var(--navy)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rate & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Hourly Rate (₹/hr)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="1500"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(13,44,91,0.12)',
                  background: 'var(--cream)',
                  fontSize: '0.875rem',
                  color: 'var(--navy)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Experience (Years)
              </label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="3"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(13,44,91,0.12)',
                  background: 'var(--cream)',
                  fontSize: '0.875rem',
                  color: 'var(--navy)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
              Select your top skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SKILL_OPTIONS.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `1.5px solid ${isSelected ? 'var(--cyan)' : 'rgba(13,44,91,0.15)'}`,
                      background: isSelected ? 'var(--cyan)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--navy)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* About */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              Short Bio / About You
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell clients about your background, style, and what kind of projects you love building..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(13,44,91,0.12)',
                background: 'var(--cream)',
                fontSize: '0.875rem',
                color: 'var(--navy)',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Saving profile...
              </>
            ) : (
              <>
                Complete Profile & Enter TNCC
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
