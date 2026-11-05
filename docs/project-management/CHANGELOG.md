# TNCC — Project Changelog

All notable changes, architectural audits, and quality assurance milestones for the Tamil Nadu Creators Club (TNCC) repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.0] - 2026-11-05 (GitHub Issue #9 – Challenge Submission Rules & Deadlines)

### Added
- **Database Migration 004 (`supabase/migrations/004_challenge_submissions_and_deadlines.sql`):**
  - Database unique constraint `unique_member_challenge_submission UNIQUE (challenge_id, member_id)` preventing duplicate submissions.
  - Atomic PostgreSQL RPC function `submit_challenge_entry` checking authentication, resolving member from `auth.uid()`, enforcing active challenge status, verifying server UTC deadline expiry, idempotently crediting participation XP (+15 XP), and supporting update-in-place.
  - Granular RLS policies restricting INSERT and UPDATE to active challenges before deadline expiry.
- **Challenge Submission API (`app/api/community/challenges/submit/route.ts`):**
  - Enforces server-side authentication (HTTP 401).
  - Enforces challenge status ('Active') and server UTC deadline validation (HTTP 400).
  - Enforces duplicate submission prevention (HTTP 409 Conflict) with concurrency mutex lock to block simultaneous requests.
  - Supports updating existing entries without creating secondary records or duplicate XP awards (HTTP 200).
  - Ignores client-supplied `member_id` to prevent user impersonation.
- **Server Store & Mutex (`lib/supabase/community-server-store.ts`):**
  - Added atomic in-flight mutex lock (`acquireSubmissionLock`, `releaseSubmissionLock`) for concurrent duplicate request mitigation.
- **Frontend Submission UX (`ChallengeSubmissionModal.tsx` & `challenges/[id]/page.tsx`):**
  - Clear deadline-expired banners and locked state when past deadline.
  - Pre-populates existing entry when updating.
  - Inline error alert box displaying server error messages without silently closing modal.
  - Loading state with spinner (`isSubmitting`) preventing repeated clicks.

---

## [0.2.0] - 2026-11-05 (GitHub Issue #10 – Admin Dashboard Supabase Integration)

### Added
- **Database Migration 003 (`supabase/migrations/003_community_admin_and_rls.sql`):**
  - Schema provisioning for `community_challenges`, `community_resources`, `community_challenge_submissions`, `community_challenge_winners`, `community_xp_transactions`, `community_job_offers`, and `community_events`.
  - Added submission review columns: `status` ('pending' | 'approved' | 'rejected'), `admin_feedback` TEXT, and `reviewed_at` TIMESTAMPTZ.
  - Added PostgreSQL atomic RPC function `announce_challenge_winner` with strict anti-duplicate winner guards and idempotent XP ledger crediting.
  - Added PostgreSQL atomic RPC function `award_admin_bonus_xp` for merit-based creator rewards.
  - Added complete Row Level Security (RLS) policies enforcing admin-only mutations (`is_admin()`) for challenges, resources, winners, jobs, events, and submission reviews.
- **Server API Route Handlers (`app/api/community/admin/`):**
  - `challenges/route.ts`: GET, POST, PUT, DELETE with server-side validation and Supabase mutation persistence.
  - `resources/route.ts`: GET, POST, PUT, DELETE with category and URL validation.
  - `submissions/route.ts`: GET, PUT for submission status reviews and reviewer feedback notes.
  - `winners/route.ts`: POST executing atomic winner declaration, bonus XP crediting, and duplicate award prevention.
  - `xp/route.ts`: POST for awarding admin merit bonus XP.
  - `reports/route.ts`: GET for aggregate administrative telemetry from Supabase.
- **Server-Side Authorization Helper (`lib/supabase/admin-auth.ts`):**
  - Centralized authentication check enforcing HTTP 401 for unauthenticated calls and HTTP 403 for non-admin members.
- **Server-Side Route Middleware Protection (`lib/supabase/middleware.ts`):**
  - Added route guard for `/community/admin` intercepting unauthorized requests with HTTP 307 redirect to `/community/auth?mode=login&next=/community/admin`.

### Changed
- **Admin Dashboard UI (`app/community/admin/page.tsx`):**
  - Added Delete Challenge action with destructive confirmation.
  - Added full submission review interface (Approve, Reject, and Feedback drawer).
  - Added 1st, 2nd, and 3rd place winner declaration buttons and duplicate prevention checks.
  - Added multi-podium display for 1st, 2nd, and 3rd place winners on challenge cards.
  - Connected `reviewSubmission` to live backend.
- **Community Context (`tncc-community/lib/community-context.tsx`):**
  - Wired `addChallenge`, `updateChallenge`, `deleteChallenge`, `addResource`, `updateResource`, `deleteResource`, `pickChallengeWinner`, `reviewSubmission`, and `awardBonusXP` to call live Supabase API endpoints.

---

## [Unreleased] - 2026-11-03

### Added
- **Complete Project Audit & QA Documentation Suite:**
  - `docs/project-management/PROJECT_AUDIT.md`: Complete architectural analysis, technology stack inspection, and health assessment.
  - `docs/project-management/FEATURE_STATUS.md`: Feature-by-feature classification of public pages, auth, community dashboard, XP engine, admin tools, media system, and security.
  - `docs/project-management/GITHUB_ISSUES.md`: 12 prioritized GitHub Issue drafts (ISSUE-01 to ISSUE-12) formatted with acceptance criteria, reproduction steps, and testing requirements.
  - `docs/project-management/IMPLEMENTATION_ROADMAP.md`: Structured 7-milestone implementation plan from critical security stabilization to launch readiness.
  - `docs/project-management/DATABASE_AUDIT.md`: In-depth analysis of PostgreSQL migrations (`001_initial_schema.sql` and `002_community_platform.sql`), missing RLS policies, triggers, and functions.
  - `docs/project-management/SECURITY_AUDIT.md`: Vulnerability assessment identifying CVSS critical risks (SEC-01 to SEC-08) including credential leaks, middleware gaps, and client-side XP manipulation.
  - `docs/project-management/E2E_TEST_REPORT.md`: Detailed test results across 11 test suites (public website, auth, feed, challenges, XP, portfolio, admin, responsive layouts).
  - `docs/project-management/SMOKE_TEST_REPORT.md`: Complete 25-step smoke test report verifying the full end-to-end user and admin journey.
  - `docs/project-management/NEXT_STEPS.md`: Immediate action plan and prioritized execution order.
  - `docs/project-management/CHANGELOG.md`: Project change record.

### Audited & Verified
- **TypeScript Compilation:** Checked entire codebase with `npx tsc --noEmit` — 0 errors detected.
- **Route Availability:** Probed 16 primary routes via automated Node HTTP client — verified HTTP 200 on public/community routes, HTTP 307 on legacy `/app` protected paths.
- **Static Asset Verification:** 22 local JavaScript, CSS, and font assets confirmed loading with HTTP 200; WebP/DRACO 3D model `/regional_map_logo.glb?v=4` confirmed loading cleanly.
- **Responsive Layout Verification:** Audited layout rendering and CSS media queries across 5 target breakpoints (1440px, 1280px, 768px, 390px, 360px).

### Identified Issues
- **SEC-01 / ISSUE-01:** Hardcoded plain-text passwords in `community-db.ts` and credential leakage in error toast response.
- **SEC-03 / ISSUE-02:** Missing Next.js Middleware route protection on `/community/admin`.
- **ISSUE-03:** Dual authentication disconnect between legacy Supabase Auth and client-side `localStorage` community auth.
- **ISSUE-04:** Missing `INSERT`, `UPDATE`, `DELETE` Row Level Security policies in `002_community_platform.sql`.
- **ISSUE-06:** Community feed composer lacks direct file upload, 1 MB image limit check, and 50 MB video limit check.
- **ISSUE-07:** Public landing page `#about` anchor broken; footer links `/privacy` and `/terms` return 404.

