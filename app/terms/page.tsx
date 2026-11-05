import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Scale, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Tamil Nadu Creators Club (TNCC)',
  description: 'Review the Terms and Conditions and Community Code of Conduct governing participation in the Tamil Nadu Creators Club.',
};

export default function TermsPage() {
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
                color: 'var(--orange, #E84020)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              <Scale size={14} /> Legal Agreement
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
              Terms & Conditions
            </h1>

            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', maxWidth: '640px' }}>
              These Terms and Conditions govern your access to and use of the Tamil Nadu Creators Club (TNCC) platform, community programs, challenges, and related digital services.
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
                Summary of Terms
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
                <li><a href="#acceptance" style={{ color: 'inherit', textDecoration: 'none' }}>1. Introduction & Acceptance</a></li>
                <li><a href="#eligibility" style={{ color: 'inherit', textDecoration: 'none' }}>2. Member Eligibility</a></li>
                <li><a href="#accounts" style={{ color: 'inherit', textDecoration: 'none' }}>3. Accounts & Responsibilities</a></li>
                <li><a href="#guidelines" style={{ color: 'inherit', textDecoration: 'none' }}>4. Community Guidelines</a></li>
                <li><a href="#ugc" style={{ color: 'inherit', textDecoration: 'none' }}>5. User-Generated Content</a></li>
                <li><a href="#ip" style={{ color: 'inherit', textDecoration: 'none' }}>6. Intellectual Property</a></li>
                <li><a href="#moderation" style={{ color: 'inherit', textDecoration: 'none' }}>7. Content Moderation</a></li>
                <li><a href="#challenges" style={{ color: 'inherit', textDecoration: 'none' }}>8. Challenges & Contests</a></li>
                <li><a href="#xp-system" style={{ color: 'inherit', textDecoration: 'none' }}>9. XP, Points & Leaderboards</a></li>
                <li><a href="#resources" style={{ color: 'inherit', textDecoration: 'none' }}>10. Resources & External Links</a></li>
                <li><a href="#prohibited" style={{ color: 'inherit', textDecoration: 'none' }}>11. Prohibited Activities</a></li>
                <li><a href="#termination" style={{ color: 'inherit', textDecoration: 'none' }}>12. Suspension & Termination</a></li>
                <li><a href="#availability" style={{ color: 'inherit', textDecoration: 'none' }}>13. Service Availability</a></li>
                <li><a href="#liability" style={{ color: 'inherit', textDecoration: 'none' }}>14. Limitation of Liability</a></li>
                <li><a href="#amendments" style={{ color: 'inherit', textDecoration: 'none' }}>15. Changes to Terms</a></li>
                <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>16. Contact Information</a></li>
              </ol>
            </div>

            {/* Section 1 */}
            <div id="acceptance" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                1. Introduction and Acceptance
              </h2>
              <p>
                Welcome to the <strong>Tamil Nadu Creators Club (TNCC)</strong>, an initiative organized and operated by <strong>Valavan Academy</strong>. By accessing our website, creating a member account, posting to the community feed, submitting challenge entries, or utilizing any platform resources, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.
              </p>
              <p style={{ marginTop: '12px' }}>
                If you do not agree to these terms, you must refrain from registering an account or participating in TNCC activities.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 2 */}
            <div id="eligibility" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                2. Member Eligibility
              </h2>
              <p>
                TNCC welcomes visual artists, graphic designers, video editors, 3D modelers, motion artists, animators, typographers, UI/UX designers, and creative students primarily based in or connected to Tamil Nadu.
              </p>
              <p style={{ marginTop: '12px' }}>
                You must be at least 13 years of age to register an account. If you are under the legal age of majority in your jurisdiction, you affirm that you have obtained permission from a parent or legal guardian to participate.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 3 */}
            <div id="accounts" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                3. Member Accounts and Responsibilities
              </h2>
              <p>When creating and maintaining an account, you agree to:</p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Provide accurate, truthful information regarding your identity and creative portfolio.</li>
                <li>Maintain the confidentiality of your login credentials and password.</li>
                <li>Promptly notify administrators if you suspect unauthorized access to your account.</li>
                <li>Accept full responsibility for all activities, submissions, and comments published under your profile.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 4 */}
            <div id="guidelines" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                4. Community Guidelines & Code of Conduct
              </h2>
              <p>
                TNCC is committed to providing a professional, respectful, and encouraging environment. All creators must adhere to our Community Code of Conduct:
              </p>
              <div
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  color: '#166534',
                }}
              >
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Mutual Respect:</strong> Treat every fellow creator with dignity regardless of experience level, background, or geographic location.</li>
                  <li><strong>Constructive Critique:</strong> Feedback on artwork should be respectful, actionable, and aimed at helping artists refine their craft.</li>
                  <li><strong>No Harassment or Hate Speech:</strong> Bullying, abusive comments, defamatory language, discrimination, or stalking will result in immediate permanent expulsion.</li>
                  <li><strong>Professional Integrity:</strong> No spamming, self-promotional link flooding, or unauthorized solicitation in community discussion threads.</li>
                </ul>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 5 */}
            <div id="ugc" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                5. User-Generated Content
              </h2>
              <p>
                You retain all copyright and moral rights in the original creative artwork, videos, compositions, typography, and case studies you post to the platform.
              </p>
              <p style={{ marginTop: '12px' }}>
                By submitting or publishing content to TNCC, you grant the platform a worldwide, non-exclusive, royalty-free license to display, reproduce, format, and showcase your artwork within our community feed, marketing reels, competition recap reels, and statewide creative directories, always with proper creator attribution.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 6 */}
            <div id="ip" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                6. Intellectual Property & Zero-Plagiarism Warranty
              </h2>
              <p>
                You warrant that all work submitted under your profile is your own original creation or that you possess explicit written authorization, valid commercial licenses, or fair-use rights for any included third-party fonts, stock photos, sound effects, or 3D assets.
              </p>
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '16px',
                  fontSize: '0.88rem',
                  color: '#991B1B',
                }}
              >
                <strong>Plagiarism Prohibition:</strong> Uploading another artist&apos;s work without attribution, tracing copyrighted illustrations, submitting templates as original designs, or falsely claiming authorship is strictly grounds for immediate disqualification and account termination.
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 7 */}
            <div id="moderation" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                7. Content Moderation & Editorial Discretion
              </h2>
              <p>
                TNCC administrators reserve the right, but do not assume the continuous obligation, to review, moderate, unpublish, or delete any content or comment that violates these terms, infringes intellectual property, or compromises community safety, without prior notice.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 8 */}
            <div id="challenges" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                8. Challenges and Competitions
              </h2>
              <p>
                TNCC frequently hosts creative challenges (such as Tamil Typography, Minimalist Poster Design, Motion Graphic Sequences). Participation is governed by the following rules:
              </p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>One Entry Per Member:</strong> Unless a challenge brief explicitly states otherwise, members may submit only one official entry per competition. Duplicate submissions are automatically rejected.</li>
                <li><strong>Deadlines:</strong> All entries must be received before the deadline timestamp verified by server UTC time. Entries submitted after the cutoff are automatically disqualified.</li>
                <li><strong>Judging:</strong> Challenge winners are evaluated by designated creative directors or community panels based on concept originality, craftsmanship, visual hierarchy, and execution.</li>
                <li><strong>Prizes:</strong> Cash rewards, software licenses, or bonus XP are awarded as specified in the individual competition brief. Prizes are non-transferable.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 9 */}
            <div id="xp-system" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                9. XP, Points and Leaderboards
              </h2>
              <p>
                Creative Experience Points (XP) represent a non-monetary community gamification and reputation metric earned through verified contributions (e.g., approved posts: +10 XP, community likes: +2 XP, challenge participation: +15 XP, competition winners: +30 to +100 XP).
              </p>
              <p style={{ marginTop: '12px' }}>
                XP has no monetary, legal, or redeemable cash value outside of specific, officially sponsored competition prizes. Attempting to artificially manipulate XP balances through console scripts, self-likes, vote rings, or duplicate bot submissions is prohibited and results in immediate XP forfeiture.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 10 */}
            <div id="resources" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                10. Resources and External Links
              </h2>
              <p>
                TNCC shares design assets, starter templates, Google Drive project folders, and curated creative links for educational and professional advancement. All third-party software, fonts, and assets are provided on an &quot;as-is&quot; basis. You are responsible for verifying that your use of third-party assets complies with their respective creator licenses.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 11 */}
            <div id="prohibited" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                11. Prohibited Activities
              </h2>
              <p>You agree not to engage in any of the following prohibited behaviors:</p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Interfering with or disrupting platform servers, networks, or database endpoints.</li>
                <li>Attempting to bypass authentication, elevate role privileges, or access administrative tools without authorization.</li>
                <li>Scraping, crawling, or downloading other members&apos; portfolios or user data in bulk without prior written permission.</li>
                <li>Uploading malicious payloads, virus-infected archives, or unapproved script files.</li>
                <li>Impersonating TNCC administrators, Valavan Academy staff, or another creator.</li>
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 12 */}
            <div id="termination" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                12. Account Suspension and Termination
              </h2>
              <p>
                TNCC administrators reserve the right to suspend or permanently terminate your account and remove your portfolio from the platform if you breach these Terms and Conditions, violate the Community Code of Conduct, or engage in activity that harms the community or platform integrity.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 13 */}
            <div id="availability" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                13. Service Availability & Maintenance
              </h2>
              <p>
                While we strive for high uptime and smooth performance, TNCC is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We do not warrant that platform operations will be uninterrupted, error-free, or entirely secure from external disruptions or cloud hosting outages.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 14 */}
            <div id="liability" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                14. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, Valavan Academy, TNCC organizers, and their affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to, use of, or inability to access the platform.
              </p>
              <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '0.85rem' }}>
                <em>[Note: Standard statutory liability clauses subject to formal legal review by Valavan Academy legal counsel.]</em>
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 15 */}
            <div id="amendments" style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                15. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms and Conditions at our sole discretion. Any changes become effective immediately upon posting to this URL. Continued use of the platform after updates constitutes acceptance of the amended terms.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '32px 0' }} />

            {/* Section 16 */}
            <div id="contact" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy, #0D2C5B)', marginBottom: '12px' }}>
                16. Contact Information
              </h2>
              <p>
                For questions regarding these Terms and Conditions, competition rules, or community policies, please contact our administrative desk:
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
                  <strong>Administrative Inquiries:</strong>{' '}
                  <span style={{ color: 'var(--orange, #E84020)', fontWeight: 600 }}>
                    contact@valavanacademy.com
                  </span>{' '}
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>(Pending official domain confirmation)</span>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <strong>Community In-App Desk:</strong> Accessible via TNCC Creator Dashboard.
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
                href="/privacy"
                style={{
                  color: 'var(--cyan, #00B5C8)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                View Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
