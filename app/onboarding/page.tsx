'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingRoleChoicePage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [selected, setSelected] = useState<'freelancer' | 'employer' | 'both'>('freelancer');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Add user roles
      const rolesToInsert: ('freelancer' | 'employer')[] = selected === 'both'
        ? ['freelancer', 'employer']
        : [selected];

      if (user?.id && user.id !== 'demo-user') {
        for (const role of rolesToInsert) {
          await supabase.from('user_roles').upsert({
            user_id: user.id,
            role,
          }, { onConflict: 'user_id,role' });
        }
      }

      setUser({
        roles: rolesToInsert,
        activeRole: rolesToInsert[0],
      });

      // Direct to first onboarding form
      if (selected === 'freelancer' || selected === 'both') {
        router.push('/onboarding/freelancer');
      } else {
        router.push('/onboarding/employer');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      router.push('/onboarding/freelancer');
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
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 8px 48px rgba(13,44,91,0.1)',
        border: '1px solid rgba(13,44,91,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '6px 14px',
            borderRadius: '100px',
            background: 'rgba(0,181,200,0.1)',
            color: 'var(--cyan)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Welcome to TNCC
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--navy)',
            marginBottom: '8px',
          }}>
            What bring you here?
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Choose how you want to use Tamil Nadu Creators Club. You can enable both anytime.
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {/* Freelancer */}
          <div
            onClick={() => setSelected('freelancer')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: `2px solid ${selected === 'freelancer' ? 'var(--cyan)' : 'rgba(13,44,91,0.08)'}`,
              background: selected === 'freelancer' ? 'rgba(0,181,200,0.03)' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(0,181,200,0.1)',
              color: 'var(--cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Briefcase size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>Find creative work</span>
                {selected === 'freelancer' && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cyan)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.5 }}>
                I am a freelancer or creator looking for projects, client leads, and showcasing my portfolio.
              </p>
            </div>
          </div>

          {/* Employer */}
          <div
            onClick={() => setSelected('employer')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: `2px solid ${selected === 'employer' ? 'var(--orange)' : 'rgba(13,44,91,0.08)'}`,
              background: selected === 'employer' ? 'rgba(232,64,32,0.03)' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(232,64,32,0.1)',
              color: 'var(--orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Users size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>Hire a creator</span>
                {selected === 'employer' && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.5 }}>
                I am a business owner, agency, or founder looking to post projects and hire top Tamil Nadu talent.
              </p>
            </div>
          </div>

          {/* Both */}
          <div
            onClick={() => setSelected('both')}
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: `2px solid ${selected === 'both' ? 'var(--navy)' : 'rgba(13,44,91,0.08)'}`,
              background: selected === 'both' ? 'rgba(13,44,91,0.03)' : 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(13,44,91,0.1)',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>Both (Freelance & Hire)</span>
                {selected === 'both' && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} />
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', margin: 0, lineHeight: 1.5 }}>
                I offer creative services AND hire other specialists for my team or clients. Seamless role switching included.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? 'Setting up...' : 'Continue to profile setup'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
