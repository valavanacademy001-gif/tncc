# TNCC — Project Changelog

All notable changes, architectural audits, and quality assurance milestones for the Tamil Nadu Creators Club (TNCC) repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
