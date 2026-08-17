'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({
  className = '',
  width,
  height,
  borderRadius = '8px',
  style,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '20px',
        borderRadius,
        background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.6s infinite ease-in-out',
        ...style,
      }}
    >
      <style jsx global>{`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Skeleton width={48} height={48} borderRadius="12px" />
        <div style={{ flex: 1 }}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="20%" height={12} style={{ marginTop: '8px' }} />
        </div>
      </div>
      <Skeleton width="100%" height={40} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
        <Skeleton width={80} height={16} />
        <Skeleton width={60} height={20} borderRadius="100px" />
      </div>
    </div>
  );
}

export function CreatorSkeleton() {
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', overflow: 'hidden' }}>
      <Skeleton height={80} borderRadius="0" />
      <div style={{ padding: '0 20px', marginTop: '-20px' }}>
        <Skeleton width={56} height={56} borderRadius="50%" style={{ border: '3px solid white' }} />
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} style={{ marginTop: '8px' }} />
        <Skeleton width="100%" height={32} style={{ marginTop: '16px' }} />
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
          <Skeleton width={60} height={20} borderRadius="100px" />
          <Skeleton width={70} height={20} borderRadius="100px" />
        </div>
      </div>
    </div>
  );
}

export function PackageSkeleton() {
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', overflow: 'hidden' }}>
      <Skeleton height={140} borderRadius="0" />
      <div style={{ padding: '18px' }}>
        <Skeleton width="30%" height={10} />
        <Skeleton width="80%" height={16} style={{ marginTop: '10px' }} />
        <Skeleton width="100%" height={36} style={{ marginTop: '12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--gray-100)' }}>
          <Skeleton width={70} height={16} />
          <Skeleton width={50} height={14} />
        </div>
      </div>
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '20px' }}>
      <Skeleton width={80} height={80} borderRadius="16px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="20%" height={14} />
        <Skeleton width="70%" height={18} style={{ marginTop: '8px' }} />
        <Skeleton width="40%" height={12} style={{ marginTop: '8px' }} />
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={12} />
        </div>
      </div>
    </div>
  );
}
