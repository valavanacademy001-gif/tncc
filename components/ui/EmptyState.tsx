'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: React.ReactNode;
  suggestions?: { label: string; href: string }[];
}

export default function EmptyState({
  title = "No results found",
  description = "We couldn't find any items matching your current filters. Try adjusting your search or selection.",
  actionText,
  onAction,
  actionHref,
  icon,
  suggestions = [
    { label: "Explore all projects", href: "/projects" },
    { label: "Browse top creators", href: "/creators" },
    { label: "Check upcoming events", href: "/events" },
  ],
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'white',
      border: '1.5px solid var(--gray-200)',
      borderRadius: '24px',
      maxWidth: '560px',
      margin: '24px auto',
    }}>
      {/* Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--gray-400)',
        marginBottom: '20px',
      }}>
        {icon || <Search size={28} />}
      </div>

      {/* Texts */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--navy)',
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--gray-500)',
        lineHeight: 1.6,
        maxWidth: '400px',
        marginBottom: '24px',
      }}>
        {description}
      </p>

      {/* Actions */}
      {actionText && (
        <div style={{ marginBottom: '24px' }}>
          {actionHref ? (
            <Link href={actionHref} className="btn btn-primary">
              {actionText}
            </Link>
          ) : (
            <button onClick={onAction} className="btn btn-primary" style={{ cursor: 'pointer' }}>
              {actionText}
            </button>
          )}
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div style={{
          width: '100%',
          paddingTop: '20px',
          borderTop: '1px solid var(--gray-100)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Or try these instead
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {suggestions.map((s, idx) => (
              <Link
                key={idx}
                href={s.href}
                style={{
                  padding: '5px 12px',
                  background: 'var(--gray-100)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '100px',
                  fontSize: '0.78rem',
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                className="suggestion-tag"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .suggestion-tag:hover {
          background: var(--navy) !important;
          color: white !important;
          border-color: var(--navy) !important;
        }
      `}</style>
    </div>
  );
}
