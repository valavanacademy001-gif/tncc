'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strength = passwordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // If email confirmation is disabled in Supabase (auto-confirm on),
        // user is logged in immediately
        if (data.session) {
          router.push('/onboarding');
          router.refresh();
        } else {
          // Email confirmation required
          setSuccess(true);
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <CheckCircle2 size={32} color="#10B981" />
        </div>
        <h1 style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--navy)',
          marginBottom: '12px',
        }}>
          Check your email
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '24px', lineHeight: 1.6 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--navy)' }}>{email}</strong>.
          Click the link to activate your account and get started.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 style={{
        fontSize: '1.5rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--navy)',
        marginBottom: '8px',
      }}>
        Join TNCC
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '32px' }}>
        Tamil Nadu's creative platform. Free to join.
      </p>

      <form onSubmit={handleSignup}>
        {/* Full name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: '6px',
          }}>
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Karthik Selvam"
            required
            autoComplete="name"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid rgba(13,44,91,0.12)',
              background: 'var(--cream)',
              fontSize: '0.875rem',
              color: 'var(--navy)',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(13,44,91,0.12)'}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: '6px',
          }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid rgba(13,44,91,0.12)',
              background: 'var(--cream)',
              fontSize: '0.875rem',
              color: 'var(--navy)',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(13,44,91,0.12)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: '6px',
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                borderRadius: '12px',
                border: '1.5px solid rgba(13,44,91,0.12)',
                background: 'var(--cream)',
                fontSize: '0.875rem',
                color: 'var(--navy)',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--cyan)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(13,44,91,0.12)'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gray-400)',
                padding: '4px',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    height: '3px',
                    flex: 1,
                    borderRadius: '4px',
                    background: i <= strength ? strengthColors[strength] : 'rgba(13,44,91,0.1)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.7rem', color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(232, 64, 32, 0.06)',
            border: '1px solid rgba(232, 64, 32, 0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: 'var(--orange)',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p style={{
          fontSize: '0.7rem',
          color: 'var(--gray-400)',
          textAlign: 'center',
          marginTop: '12px',
          lineHeight: 1.6,
        }}>
          By creating an account you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--navy)' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: 'var(--navy)' }}>Privacy Policy</Link>.
        </p>
      </form>

      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '0.875rem',
        color: 'var(--gray-500)',
      }}>
        Already have an account?{' '}
        <Link href="/login" style={{
          color: 'var(--navy)',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          Sign in
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
