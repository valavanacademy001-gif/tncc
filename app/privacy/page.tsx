import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tamil Nadu Creators Club (TNCC)',
  description: 'Learn how Tamil Nadu Creators Club collects, manages, and protects creator information, portfolio media, and account data.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 5, 2026';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream, #FAF9F6)' }}>
        {/* Header Hero Banner */}
        <section
          style={{
            background: 'var(--navy, #0D2C5B)',
            color: 'white',
            padding: '70px 0 50px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="bg-dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            {/* Breadcrumb Back Button */}
            <div style={{ marginBottom: '20px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                className="hover-underline"
              >
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--cyan, #00B5C8)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={14} /> Legal & Compliance
            </div>

            <h1
              className="text-display-lg"
              style={{
                color: 'white',
                lineHeight: 1.15,
                fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                fontWeight: 800,
                maxWidth: '820px',
                marginBottom: '14px',
              }}
            >
              TNCC Privacy Policy
            </h1>

            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', maxWidth: '640px' }}>
              This policy explains how the Tamil Nadu Creators Club (TNCC), organized by Valavan Academy, collects, protects, and respects the personal information and creative work of our members.
            </p>

            <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Last Updated: {lastUpdated}
            </div>
          </div>
        </section>

        {/* Content Container */}
        <section className="container" style={{ padding: '60px 24px 100px' }}>
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 25px rgba(13, 44, 91, 0.05)',
              padding: 'clamp(28px, 5vw, 56px)',
              color: '#1F2937',
              lineHeight: 1.7,
            }}
          >
            {/* Table of Contents Box */}
            <div
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '40px',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px', fontSize: '0.95rem' }}>
                Summary of Sections
              </div>
              <ol
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '8px 16px',
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '0.85rem',
                  color: '#4B5563',
                }}
              >
                <li><a href="#intro" style={{ color: 'inherit', textDecoration: 'none' }}>1. Introduction</a></li>
                <li><a href="#info-collected" style={{ color: 'inherit', textDecoration: 'none' }}>2. Information We Collect</a></li>
                <li><a href="#account-profile" style={{ color: 'inherit', textDecoration: 'none' }}>3. Account & Profile Info</a></li>
                <li><a href="#media-content" style={{ color: 'inherit', textDecoration: 'none' }}>4. Content & Submitted Media</a></li>
                <li><a href="#how-we-use" style={{ color: 'inherit', textDecoration: 'none' }}>5. How We Use Information</a></li>
                <li><a href="#public-visibility" style={{ color: 'inherit', textDecoration: 'none' }}>6. Public Visibility & Feed</a></li>
                <li><a href="#supabase-storage" style={{ color: 'inherit', textDecoration: 'none' }}>7. Supabase & Data Storage</a></li>
                <li><a href="#external-links" style={{ color: 'inherit', textDecoration: 'none' }}>8. External Links & GDrive</a></li>
                <li><a href="#security" style={{ color: 'inherit', textDecoration: 'none' }}>9. Data Security</a></li>
                <li><a href="#retention" style={{ color: 'inherit', textDecoration: 'none' }}>10. Data Retention</a></li>
                <li><a href="#user-rights" style={{ color: 'inherit', textDecoration: 'none' }}>11. User Rights & Deletion</a></li>
                <li><a href="#cookies" style={{ color: 'inherit', textDecoration: 'none' }}>12. Cookies & Technical Data</a></li>
                <li><a href="#updates" style={{ color: 'inherit', textDecoration: 'none' }}>13. Policy Updates</a></li>
                <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>14. Contact Information</a></li>
              </ol>
            </div>

            {/* Section 1 */}
            <div id="intro" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                1. Introduction
              </h2>
              <p>
                Tamil Nadu Creators Club (TNCC) is a statewide professional creative community organized and facilitated by <strong>Valavan Academy</strong>. Our mission is to connect graphic designers, video editors, brand strategists, 3D artists, and creative technologists across Tamil Nadu.
              </p>
              <p style={{ marginTop: '12px' }}>
                We believe in creative transparency and data dignity. This Privacy Policy informs creators, participants, and visitors about how their personal details, portfolio works, challenge submissions, and interactive data are collected, managed, and safeguarded when using the TNCC web platform.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 2 */}
            <div id="info-collected" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                2. Information We Collect
              </h2>
              <p>
                We collect information directly provided by members upon registration and platform interaction:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Identity & Credentials:</strong> Full name, username, email address, password hashes, and unique community member ID (e.g., TNCC-2026-XXXX).</li>
                <li><strong>Creator Profile Data:</strong> Location within Tamil Nadu (e.g., Chennai, Coimbatore, Madurai, Tiruchirappalli), bio, creative skills, and external portfolio links (Behance, Instagram, LinkedIn, YouTube, personal portfolio URL).</li>
                <li><strong>Creative Submissions:</strong> Post captions, media files (images/videos up to platform limits), hashtags, category labels, showcase status, challenge entries, and competition files.</li>
                <li><strong>Community Activity:</strong> Likes given and received, comments, bookmarks/saves, challenge submissions, XP transaction ledger records, and competition podium ranks.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 3 */}
            <div id="account-profile" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                3. Account and Profile Information
              </h2>
              <p>
                When creating an account, you provide basic details used to construct your verified creator portfolio. Your profile is designed to showcase your craft to fellow creators, hiring studios, and competition evaluators.
              </p>
              <p style={{ marginTop: '12px' }}>
                You maintain direct control over your profile information and can update your display name, biography, skills tags, avatar image, and social media handles at any time through the Profile Settings interface.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 4 */}
            <div id="media-content" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                4. Content and Media Submitted by Members
              </h2>
              <p>
                Members retain intellectual property ownership of their original creative assets, designs, typography, animations, and video files submitted to TNCC. By publishing content to the feed or submitting to challenges, you grant TNCC a non-exclusive license to display, index, and feature your artwork within the community feed, leaderboards, and official TNCC highlights.
              </p>
              <div
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #F59E0B',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '16px',
                  fontSize: '0.85rem',
                  color: '#92400E',
                }}
              >
                <strong>Member Responsibility:</strong> You are strictly responsible for ensuring that any work you upload does not infringe on third-party copyrights, trademarks, or intellectual property rights. Plagiarism or unauthorized copying is strictly prohibited.
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 5 */}
            <div id="how-we-use" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                5. How We Use Information
              </h2>
              <p>We use the data collected strictly for community and platform operations:</p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>To authenticate your session and protect member account security.</li>
                <li>To render your portfolio and published creative projects.</li>
                <li>To compute verified Creative XP, evaluate community milestones, and render statewide leaderboards.</li>
                <li>To enable competition judging, submission reviews, and winner announcements.</li>
                <li>To prevent automated spam, duplicate farming, and malicious platform abuse.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 6 */}
            <div id="public-visibility" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                6. Community Posts and Public Visibility
              </h2>
              <p>
                TNCC is an open professional community. When you publish a post to the feed or mark a project as a <em>Showcase</em>, your creator name, username, city, portfolio media, and caption become visible to registered community members and public visitors.
              </p>
              <p style={{ marginTop: '12px' }}>
                Your email address, hashed passwords, and private administrative notes are <strong>never</strong> exposed publicly or shared in client responses.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 7 */}
            <div id="supabase-storage" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                7. Supabase and Data Storage
              </h2>
              <p>
                Our backend infrastructure leverages Supabase (hosted on AWS PostgreSQL). Data storage practices include:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>PostgreSQL Database:</strong> All member profiles, posts, comments, challenge submissions, and XP audit ledgers reside in encrypted PostgreSQL databases.</li>
                <li><strong>Row Level Security (RLS):</strong> Granular PostgreSQL security policies enforce access controls so that members can only modify their own profile assets and cannot tamper with system ledgers.</li>
                <li><strong>Supabase Auth:</strong> User passwords are encrypted in transit and hashed using industry-standard bcrypt hashing.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 8 */}
            <div id="external-links" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                8. External Links and Google Drive Resources
              </h2>
              <p>
                The platform contains creative resources, templates, fonts, and challenge deliverables that link to external cloud storage providers (including Google Drive, Behance, Figma, and GitHub).
              </p>
              <p style={{ marginTop: '12px' }}>
                TNCC does not own or operate external third-party hosts. When navigating to third-party links or downloading external files, their respective privacy policies and terms apply. We advise creators to exercise caution and scan any downloaded assets.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 9 */}
            <div id="security" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                9. Data Security
              </h2>
              <p>
                We employ technical, administrative, and architectural safeguards to protect creator information:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Transport Layer Security (TLS 1.3 / HTTPS) encryption for all web and API traffic.</li>
                <li>Server-side Next.js route protection and JWT verification on privileged administrative workflows.</li>
                <li>Immutable server-side transaction ledgers to eliminate unauthorized score tampering.</li>
                <li>Strict restriction of private database connection strings and service role credentials to server-only environments.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 10 */}
            <div id="retention" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                10. Data Retention
              </h2>
              <p>
                Account profiles, portfolio projects, and challenge submission records are maintained while your account remains active to provide continuous access to your statewide creative portfolio.
              </p>
              <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '0.85rem' }}>
                <em>[Note: Formal archival schedules and maximum inactivity retention periods are currently subject to periodic review by Valavan Academy administration.]</em>
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 11 */}
            <div id="user-rights" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                11. User Rights and Account Deletion Requests
              </h2>
              <p>Creators hold the following rights regarding their information:</p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Access & Correction:</strong> You may review and edit your personal information directly via your Profile Settings.</li>
                <li><strong>Content Removal:</strong> You may edit or delete your individual feed posts and portfolio showcases at any time.</li>
                <li><strong>Account Deletion:</strong> You may request the full deletion of your creator account, associated personal records, and submissions by submitting a formal request to our administrative desk.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 12 */}
            <div id="cookies" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                12. Cookies and Technical Data
              </h2>
              <p>
                TNCC utilizes essential browser cookies and local web storage strictly necessary for authentication sessions, remember-me functionality, and UI state preservation (e.g., active filters, dark/light theme preferences). We do not deploy third-party advertising tracking cookies or sell member behavioral data.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 13 */}
            <div id="updates" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                13. Policy Updates
              </h2>
              <p>
                We may revise this Privacy Policy periodically to reflect platform features, security improvements, or regulatory developments. When updates occur, the &quot;Last Updated&quot; timestamp at the top of this document will be amended. Significant modifications will be announced via community feed bulletins.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 14 */}
            <div id="contact" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                14. Contact Information
              </h2>
              <p>
                For privacy inquiries, account deletion requests, or data protection questions regarding the Tamil Nadu Creators Club, please contact our administrative desk:
              </p>
              <div
                style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                }}
              >
                <div><strong>Organizer:</strong> Valavan Academy</div>
                <div style={{ marginTop: '6px' }}>
                  <strong>Platform:</strong> Tamil Nadu Creators Club (TNCC)
                </div>
                <div style={{ marginTop: '6px' }}>
                  <strong>Community Admin:</strong> Suganesh (Creative Director & Administrator)
                </div>
                <div style={{ marginTop: '6px' }}>
                  <strong>Official Contact Channel:</strong>{' '}
                  <span style={{ color: 'var(--orange, #E84020)', fontWeight: 600 }}>
                    contact@valavanacademy.com
                  </span>{' '}
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>(Pending official domain email confirmation)</span>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <strong>Direct Inquiries:</strong> Accessible via TNCC Community In-App Support & Admin Hub.
                </div>
              </div>
            </div>

            {/* Bottom Return Button */}
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--navy, #0D2C5B)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={16} /> Return to Homepage
              </Link>
              <Link
                href="/terms"
                style={{
                  color: 'var(--orange, #E84020)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                View Terms & Conditions &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
