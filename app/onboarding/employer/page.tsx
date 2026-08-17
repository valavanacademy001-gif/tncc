'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { createClient } from '@/lib/supabase/client';

const CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore', 'Tiruppur', 'Erode', 'Tirunelveli', 'Kanchipuram'];
const INDUSTRIES = ['Technology / Software', 'Agency / Marketing', 'E-commerce / Retail', 'Fashion & Apparel', 'Food & Hospitality', 'Media & Entertainment', 'Manufacturing', 'Education & Non-profit'];
const COMPANY_SIZES = ['1-10 employees', '11-50 employees', '51-200 employees', '201+ employees', 'Solo Founder / Individual'];

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology / Software');
  const [companySize, setCompanySize] = useState('1-10 employees');
  const [location, setLocation] = useState('Chennai');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      if (user?.id && user.id !== 'demo-user') {
        // Upsert employer profile
        await supabase.from('employer_profiles').upsert({
          user_id: user.id,
          company_name: companyName,
          industry,
          company_size: companySize,
          website,
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
        employerOnboardingComplete: true,
        activeRole: 'employer',
        location,
      });

      router.push('/app');
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
        maxWidth: '600px',
        boxShadow: '0 8px 48px rgba(13,44,91,0.1)',
        border: '1px solid rgba(13,44,91,0.06)',
      }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--orange)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            Hiring Account Setup
          </div>
          <h1 style={{
            fontSize: '1.6rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--navy)',
            marginBottom: '6px',
          }}>
            Set up your company or hiring profile
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Tell Tamil Nadu creators about your brand and what you build.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Company Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              Company / Brand Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Silk & Spice D2C / Chennai Labs"
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

          {/* Industry & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
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
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Headquarters City
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

          {/* Company Size & Website */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Team Size
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
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
                {COMPANY_SIZES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                Website / Social Link
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
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

          {/* About */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              Company Description
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Describe your company, products, and what kind of creative projects you post..."
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
            className="btn btn-secondary btn-lg"
            style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Saving company profile...
              </>
            ) : (
              <>
                Complete Setup & Go to Workspace
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
