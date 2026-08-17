'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(
          authError.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please check your credentials.'
            : authError.message
        );
        return;
      }

      if (data.user) {
        // Check if profile onboarding is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single();

        if (profile && !profile.onboarding_complete) {
          router.push('/onboarding');
        } else {
          router.push('/app');
        }
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 style={{
        fontSize: '1.5rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--navy)',
        marginBottom: '8px',
      }}>
        Welcome back
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '32px' }}>
        Sign in to your TNCC account
      </p>

      <form onSubmit={handleLogin}>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: '6px',
            letterSpacing: '0.02em',
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
        <div style={{ marginBottom: '8px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: '6px',
            letterSpacing: '0.02em',
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <Link href="/forgot-password" style={{
            fontSize: '0.8rem',
            color: 'var(--cyan)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Forgot password?
          </Link>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Sign up link */}
      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '0.875rem',
        color: 'var(--gray-500)',
      }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{
          color: 'var(--navy)',
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          Sign up free
        </Link>
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
