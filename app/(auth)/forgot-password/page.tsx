'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
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
          We sent a password reset link to <strong style={{ color: 'var(--navy)' }}>{email}</strong>.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8rem',
        color: 'var(--gray-500)',
        textDecoration: 'none',
        marginBottom: '20px',
        fontWeight: 500,
      }}>
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <h1 style={{
        fontSize: '1.5rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--navy)',
        marginBottom: '8px',
      }}>
        Reset password
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '32px' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleReset}>
        <div style={{ marginBottom: '24px' }}>
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
              Sending reset link...
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
