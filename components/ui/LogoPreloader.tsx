'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type PreloaderPhase = 'init' | 'loading' | 'logoOut' | 'done';

export default function LogoPreloader() {
  const [phase, setPhase] = useState<PreloaderPhase>('init');

  useEffect(() => {
    // Check if user already saw the preloader in this browser session
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const isPreview = searchParams.get('preview_preloader') === 'true';

      if (!isPreview) {
        const hasSeen = sessionStorage.getItem('tncc_preloader_seen');
        if (hasSeen === 'true') {
          setPhase('done');
          return;
        }
      }
      sessionStorage.setItem('tncc_preloader_seen', 'true');
    } catch (_) {
      // Fallback if sessionStorage is disabled/blocked in private mode
    }

    // Phase 1 (Entrance): Animate logo in from bottom after 50ms (matching Framer reference)
    const t0 = setTimeout(() => {
      setPhase('loading');
    }, 50);

    // Track minimum presentation duration so animation feels deliberate and smooth
    const minDuration = 1100;
    const startTime = Date.now();

    const triggerExit = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        // Phase 2 (Exit): Animate logo up and out + fade background
        setPhase('logoOut');

        // Phase 3 (Done): Completely unmount after transition completes
        setTimeout(() => {
          setPhase('done');
        }, 700);
      }, remaining);
    };

    // If document is already complete, trigger exit after minimum duration
    if (document.readyState === 'complete') {
      triggerExit();
    } else {
      const onWindowLoad = () => triggerExit();
      window.addEventListener('load', onWindowLoad, { once: true });
    }

    // Safety fallback timeout: never block the user even on slow network
    const fallbackTimeout = setTimeout(() => {
      setPhase((prev) => {
        if (prev !== 'done') {
          setTimeout(() => setPhase('done'), 500);
          return 'logoOut';
        }
        return prev;
      });
    }, 2400);

    return () => {
      clearTimeout(t0);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  return (
    <aside
      role="status"
      aria-label="Loading Tamil Nadu Creators Club"
      aria-live="polite"
      className={`tncc-preloader-overlay ${phase === 'logoOut' ? 'preloader-fade-out' : ''}`}
    >
      <div className="preloader-content-wrap">
        <div className={`preloader-logo-motion preloader-phase-${phase}`}>
          {/* Exact original TNCC logo with transparent background and preserved proportions */}
          <Image
            src="/brand/logo.webp"
            alt="Tamil Nadu Creators Club Logo"
            width={320}
            height={124}
            priority
            draggable={false}
            className="preloader-logo-img"
          />

          {/* Minimal branded progress bar matching TNCC colors */}
          <div className="preloader-progress-track" aria-hidden="true">
            <div className="preloader-progress-bar" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .tncc-preloader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          user-select: none;
          pointer-events: auto;
        }

        :global(.dark) .tncc-preloader-overlay {
          background-color: #101318;
        }

        .preloader-fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .preloader-content-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .preloader-logo-motion {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          will-change: transform, opacity;
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Framer LogoPreloader 3-Phase Animation */
        .preloader-phase-init {
          transform: translateY(50px);
          opacity: 0;
        }

        .preloader-phase-loading {
          transform: translateY(0);
          opacity: 1;
        }

        .preloader-phase-logoOut {
          transform: translateY(-50px);
          opacity: 0;
        }

        .preloader-logo-img {
          width: clamp(200px, 45vw, 320px);
          height: auto;
          max-height: 124px;
          object-fit: contain;
          display: block;
        }

        /* Ambient halo for Dark Mode to ensure Navy & Dark accents remain vibrant against #101318 */
        :global(.dark) .preloader-logo-img {
          filter: drop-shadow(0 0 26px rgba(255, 255, 255, 0.16))
                  drop-shadow(0 6px 18px rgba(0, 0, 0, 0.5));
        }

        /* Minimal branded loader track */
        .preloader-progress-track {
          width: 110px;
          height: 2.5px;
          border-radius: 9999px;
          background: rgba(13, 69, 127, 0.08);
          overflow: hidden;
          position: relative;
        }

        :global(.dark) .preloader-progress-track {
          background: rgba(255, 255, 255, 0.12);
        }

        .preloader-progress-bar {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #2AC8D1 0%, #FA4618 50%, #FDB81B 100%);
          border-radius: 9999px;
          transform-origin: left;
          animation: preloader-track-shimmer 1.1s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        @keyframes preloader-track-shimmer {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(0.75);
          }
          100% {
            transform: scaleX(1);
            opacity: 0.2;
          }
        }

        /* Accessibility: Respect Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .tncc-preloader-overlay,
          .preloader-logo-motion,
          .preloader-progress-bar {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
