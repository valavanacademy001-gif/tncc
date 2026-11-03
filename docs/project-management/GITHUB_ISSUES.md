# TNCC — GitHub Issue Registry & Issue Drafts

> **GitHub CLI Integration Notice:**  
> The GitHub CLI (`gh`) is not currently installed/authenticated in the active environment.  
> As required by Phase 4, the issues below are fully drafted and structured according to standard GitHub Issue templates. Once `gh` or repository API credentials are authenticated, these can be directly created via `gh issue create`.

---

## Issue Summary Matrix

| ID | Title | Labels | Priority | Related Milestone |
|---|---|---|---|---|
| **ISSUE-01** | Critical Security: Remove hardcoded plain-text passwords and credential leakage in error messages | `security`, `bug`, `backend` | **P0** | Milestone 1 |
| **ISSUE-02** | Secure Admin Route Protection via Next.js Middleware and Supabase JWT | `security`, `bug`, `backend` | **P0** | Milestone 1 |
| **ISSUE-03** | Consolidate Dual Auth: Migrate Community Auth from LocalStorage to Supabase Auth | `backend`, `feature`, `database` | **P0** | Milestone 2 |
| **ISSUE-04** | Complete Supabase RLS Policies for Community Tables (INSERT, UPDATE, DELETE) | `database`, `security`, `backend` | **P0** | Milestone 2 |
| **ISSUE-05** | Wire Community Feed, Posts, Likes, and Comments to Supabase PostgreSQL | `frontend`, `backend`, `feature` | **P0** | Milestone 3 |
| **ISSUE-06** | Implement Direct Media Upload (1 MB Image / 50 MB Video) with Storage Bucket | `frontend`, `backend`, `feature` | **P0** | Milestone 3 |
| **ISSUE-07** | Fix Public Landing Page Broken Anchor (`#about`) and Missing Legal Routes (`/privacy`, `/terms`) | `bug`, `frontend`, `ui-ux` | **P1** | Milestone 1 |
| **ISSUE-08** | Implement Server-Side XP Transaction Ledger and Anti-Farming Verification | `backend`, `database`, `security` | **P1** | Milestone 4 |
| **ISSUE-09** | Enforce Challenge Submission Rules: Duplicate Submissions & Deadline Expiry | `backend`, `frontend`, `bug` | **P1** | Milestone 4 |
| **ISSUE-10** | Wire Admin Dashboard Actions to Live Supabase Backend | `frontend`, `backend`, `feature` | **P1** | Milestone 5 |
| **ISSUE-11** | Remove 14 MB Unoptimized GLB Model and Optimize 3D Asset Loading | `performance`, `enhancement` | **P2** | Milestone 6 |
| **ISSUE-12** | Implement Automated End-to-End Test Suite with Playwright | `testing`, `documentation` | **P2** | Milestone 7 |

---

## Detailed GitHub Issue Drafts

### ISSUE-01
- **TITLE:** Critical Security: Remove hardcoded plain-text passwords and credential leakage in error messages
- **DESCRIPTION:** The community database mock (`tncc-community/lib/community-db.ts`) contains hardcoded plain-text passwords for administrator and test accounts. Furthermore, when an incorrect password is entered for the admin email, the error message directly reveals the password: `"Incorrect admin password. Please enter Suganesh@tncc to access the admin workspace."`
- **CURRENT BEHAVIOUR:** Password is hardcoded in client-side bundle and printed openly in user error toast.
- **EXPECTED BEHAVIOUR:** Passwords must never exist in client-side source code. Credential validation must occur exclusively on the server using Supabase Auth with bcrypt hashing. Error messages must simply say "Invalid email or password."
- **STEPS TO REPRODUCE:**
  1. Open `/community/auth?mode=login` in a browser.
  2. Enter `suganeshsugu07@gmail.com` and type `wrongpassword`.
  3. Observe the error toast displaying the admin password in plain text.
- **ACCEPTANCE CRITERIA:**
  - [ ] No hardcoded passwords in any `.ts`, `.tsx`, or `.json` file.
  - [ ] Error messages do not distinguish between invalid email or invalid password.
  - [ ] Authentication passes through Supabase `signInWithPassword`.
- **AFFECTED FILES:**
  - `tncc-community/lib/community-db.ts`
  - `tncc-community/lib/admin-config.ts`
  - `app/community/auth/page.tsx`
- **DEPENDENCIES:** ISSUE-03
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Attempt sign-in with bad password; verify generic error response. Search codebase for string `Suganesh@tncc` to ensure 0 matches.

---

### ISSUE-02
- **TITLE:** Secure Admin Route Protection via Next.js Middleware and Supabase JWT
- **DESCRIPTION:** `/community/admin` is not protected in `middleware.ts`. The route responds with HTTP 200 to raw unauthenticated requests. Admin gating is executed purely client-side via React state (`isAdmin`), which checks `localStorage.getItem('tncc_active_user_email')`. Any visitor can bypass this restriction by setting this key in DevTools.
- **CURRENT BEHAVIOUR:** Client-only check; route is exposed publicly.
- **EXPECTED BEHAVIOUR:** Next.js middleware must intercept requests to `/community/admin`, verify the user's Supabase session and role, and redirect non-admin users to `/community/auth` with a 307 redirect.
- **STEPS TO REPRODUCE:**
  1. In a private browser window, open DevTools console.
  2. Run `localStorage.setItem('tncc_active_user_email', 'suganeshsugu07@gmail.com')`.
  3. Navigate to `/community/admin`.
  4. The full admin UI renders without authenticating against Supabase.
- **ACCEPTANCE CRITERIA:**
  - [ ] `middleware.ts` protects `/community/admin`.
  - [ ] Server validates `role === 'admin'` before rendering any admin UI or SSR payload.
  - [ ] Client cannot manipulate localStorage to gain admin access.
- **AFFECTED FILES:**
  - `middleware.ts`
  - `lib/supabase/middleware.ts`
  - `app/community/admin/page.tsx`
- **DEPENDENCIES:** ISSUE-03, ISSUE-04
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Send unauthenticated `curl -I http://localhost:3000/community/admin`; verify HTTP 307 redirect to `/community/auth`.

---

### ISSUE-03
- **TITLE:** Consolidate Dual Auth: Migrate Community Auth from LocalStorage to Supabase Auth
- **DESCRIPTION:** The application currently maintains two separate authentication models: legacy marketplace auth (`lib/user-context.tsx`) connected to Supabase Auth, and community auth (`tncc-community/lib/community-context.tsx`) connected to browser `localStorage`. Logging in on `/community/auth` does not sign in with Supabase, leaving `useUser().isAuthenticated === false` on the root layout and navbar.
- **CURRENT BEHAVIOUR:** Member login only creates client-side localStorage state; Supabase Auth is bypassed.
- **EXPECTED BEHAVIOUR:** A single unified authentication flow using Supabase Auth. Community sign-up creates an `auth.users` record and inserts into `community_members`. Session cookies keep the user logged in across the public site, dashboard, and community.
- **STEPS TO REPRODUCE:**
  1. Register a user at `/community/auth?mode=register`.
  2. Navigate back to `/`.
  3. Observe Navbar still displays "Sign in" and "Join Free".
- **ACCEPTANCE CRITERIA:**
  - [ ] `registerMember` calls `supabase.auth.signUp`.
  - [ ] `loginMember` calls `supabase.auth.signInWithPassword`.
  - [ ] Session is synced between root `UserProvider` and `CommunityProvider`.
  - [ ] Forgot password triggers `supabase.auth.resetPasswordForEmail`.
- **AFFECTED FILES:**
  - `tncc-community/lib/community-context.tsx`
  - `tncc-community/lib/community-db.ts`
  - `lib/user-context.tsx`
  - `app/community/auth/page.tsx`
- **DEPENDENCIES:** ISSUE-04
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Register user; verify entry in Supabase `auth.users` and `community_members` table. Verify navbar reflects active user status.

---

### ISSUE-04
- **TITLE:** Complete Supabase RLS Policies for Community Tables (INSERT, UPDATE, DELETE)
- **DESCRIPTION:** Migration `002_community_platform.sql` enables Row Level Security (RLS) on all 14 `community_*` tables, but only defines `SELECT` policies. There are zero policies permitting `INSERT`, `UPDATE`, or `DELETE`. When the frontend is connected to Supabase, all mutations will be rejected by PostgreSQL.
- **CURRENT BEHAVIOUR:** Tables have RLS enabled with only public read access; writes will throw RLS permission errors.
- **EXPECTED BEHAVIOUR:** Comprehensive RLS policies allowing authenticated users to create posts, like, comment, bookmark, and submit challenges, while restricting admin actions (announcing winners, managing resources, awarding bonus XP) to users with `role = 'admin'`.
- **STEPS TO REPRODUCE:**
  1. Attempt an `INSERT` on `community_posts` with an authenticated client.
  2. PostgreSQL returns error: `new row violates row-level security policy for table "community_posts"`.
- **ACCEPTANCE CRITERIA:**
  - [ ] SQL migration `003_community_rls_policies.sql` created.
  - [ ] Policies defined for `community_posts`, `community_post_likes`, `community_post_comments`, `community_saved_posts`, `community_resources`, `community_challenges`, `community_challenge_submissions`, `community_xp_transactions`.
  - [ ] Admin check helper function `is_admin()` implemented in SQL.
- **AFFECTED FILES:**
  - `supabase/migrations/002_community_platform.sql`
  - `supabase/migrations/003_community_rls_policies.sql`
- **DEPENDENCIES:** None
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Run test insertions as member and as non-member; verify allowed and blocked operations match expectations.

---

### ISSUE-05
- **TITLE:** Wire Community Feed, Posts, Likes, and Comments to Supabase PostgreSQL
- **DESCRIPTION:** The community feed currently stores and fetches posts, likes, comments, and saves strictly in browser `localStorage`. Real users on separate devices cannot see each other's posts or interact.
- **CURRENT BEHAVIOUR:** Feed data is isolated to each user's local browser storage.
- **EXPECTED BEHAVIOUR:** Posts, likes, comments, and bookmarks are queried and mutated directly against Supabase PostgreSQL tables `community_posts`, `community_post_likes`, `community_post_comments`, and `community_saved_posts`.
- **ACCEPTANCE CRITERIA:**
  - [ ] Creating a post inserts a record into `community_posts`.
  - [ ] Liking a post inserts into `community_post_likes` and increments `likes_count`.
  - [ ] Comments are saved in `community_post_comments`.
  - [ ] Data is visible across different browsers and devices.
- **AFFECTED FILES:**
  - `tncc-community/lib/community-db.ts`
  - `tncc-community/lib/community-context.tsx`
  - `app/community/page.tsx`
- **DEPENDENCIES:** ISSUE-03, ISSUE-04
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Create a post in Browser A; verify that Browser B (logged in as different user) sees the post on refresh.

---

### ISSUE-06
- **TITLE:** Implement Direct Media Upload (1 MB Image / 50 MB Video) with Storage Bucket
- **DESCRIPTION:** The specification mandates direct file upload capabilities with a 1 MB image upload limit and a 50 MB video upload limit. Currently, `FeedComposer.tsx` only has an `<input type="url">` where users can type a web link. No file upload, MIME type checking, or storage bucket integration exists.
- **CURRENT BEHAVIOUR:** Feed composer only accepts pasted URLs.
- **EXPECTED BEHAVIOUR:** Creators can select local image or video files. Client validates file size (≤1 MB for images, ≤50 MB for videos) and MIME types. Files are uploaded directly to Supabase Storage bucket `community-media`, returning the public URL.
- **ACCEPTANCE CRITERIA:**
  - [ ] Drag-and-drop / file picker integrated into `FeedComposer.tsx`.
  - [ ] Oversized images (>1 MB) rejected with clear error toast.
  - [ ] Oversized videos (>50 MB) rejected with clear error toast.
  - [ ] Invalid MIME types rejected.
  - [ ] Successful upload attaches public CDN URL to post.
- **AFFECTED FILES:**
  - `tncc-community/components/feed/FeedComposer.tsx`
  - `components/ui/ImageUpload.tsx`
  - `supabase/migrations/003_storage_buckets.sql`
- **DEPENDENCIES:** ISSUE-04
- **PRIORITY:** P0 – Critical
- **TESTING REQUIREMENTS:** Upload a 1.2 MB PNG -> expect rejection. Upload a 500 KB PNG -> expect success. Upload a 55 MB MP4 -> expect rejection. Upload a 20 MB MP4 -> expect success.

---

### ISSUE-07
- **TITLE:** Fix Public Landing Page Broken Anchor (`#about`) and Missing Legal Routes (`/privacy`, `/terms`)
- **DESCRIPTION:** 
  1. The Navbar and Footer link to `#about`, but no component has `id="about"`. The corresponding section `CommunityStory.tsx` has `id="pillars"`, so clicking the link does nothing.
  2. Footer links to `/privacy` and `/terms` return 404 Not Found.
- **CURRENT BEHAVIOUR:** Broken anchor scroll and 404 pages.
- **EXPECTED BEHAVIOUR:** `#about` scrolls smoothly to the Valavan Academy / About TNCC section. `/privacy` and `/terms` render branded legal compliance pages.
- **ACCEPTANCE CRITERIA:**
  - [ ] `components/sections/CommunityStory.tsx` includes `id="about"`.
  - [ ] `app/privacy/page.tsx` created with TNCC privacy policy.
  - [ ] `app/terms/page.tsx` created with TNCC terms and conditions.
- **AFFECTED FILES:**
  - `components/sections/CommunityStory.tsx`
  - `app/privacy/page.tsx`
  - `app/terms/page.tsx`
- **DEPENDENCIES:** None
- **PRIORITY:** P1 – High
- **TESTING REQUIREMENTS:** Click `#about` in Navbar; verify viewport scrolls to section. Click Privacy Policy and Terms in footer; verify HTTP 200 and branded layout.

---

### ISSUE-08
- **TITLE:** Implement Server-Side XP Transaction Ledger and Anti-Farming Verification
- **DESCRIPTION:** The XP system currently updates `total_xp` in browser `localStorage`. Any user can modify their XP score or level in DevTools. Self-like and duplicate XP checks are only enforced client-side.
- **CURRENT BEHAVIOUR:** XP logic is unshielded in client JavaScript.
- **EXPECTED BEHAVIOUR:** XP is treated as an immutable transaction ledger in PostgreSQL (`community_xp_transactions`). Total XP is calculated via database triggers or secure PostgreSQL RPC functions. Duplicate actions are prevented by database UNIQUE constraints `(member_id, reason, reference_id)`.
- **ACCEPTANCE CRITERIA:**
  - [ ] XP transactions inserted via secure PostgreSQL function `award_member_xp(...)`.
  - [ ] Self-like XP rejected at database level.
  - [ ] Unique constraints prevent duplicate post creation XP or duplicate challenge participation XP.
  - [ ] Leaderboard view queries database directly.
- **AFFECTED FILES:**
  - `supabase/migrations/002_community_platform.sql`
  - `tncc-community/lib/xp-engine.ts`
  - `tncc-community/lib/community-db.ts`
- **DEPENDENCIES:** ISSUE-04
- **PRIORITY:** P1 – High
- **TESTING REQUIREMENTS:** Attempt to invoke `award_member_xp` twice for the same post ID; verify second attempt is ignored and does not increment XP.

---

### ISSUE-09
- **TITLE:** Enforce Challenge Submission Rules: Duplicate Submissions & Deadline Expiry
- **DESCRIPTION:** In `tncc-community/components/challenges/ChallengeSubmissionModal.tsx` and `community-db.ts`, members can submit multiple entries to the same challenge without restrictions. Furthermore, submissions are accepted even if the challenge status is `Submission Closed` or `Completed`.
- **CURRENT BEHAVIOUR:** No duplicate submission blocking; no deadline validation on submit.
- **EXPECTED BEHAVIOUR:**
  - Members can submit only one entry per challenge (or update an existing submission).
  - Submissions are rejected if the current timestamp exceeds `submission_deadline` or challenge status is not `Active`.
- **ACCEPTANCE CRITERIA:**
  - [ ] Frontend disables "Submit Entry" button if challenge is closed or expired.
  - [ ] Database enforces unique constraint `(challenge_id, member_id)`.
  - [ ] Friendly UI message shown when an entry has already been submitted ("Update Submission" mode).
- **AFFECTED FILES:**
  - `tncc-community/components/challenges/ChallengeSubmissionModal.tsx`
  - `app/community/challenges/[id]/page.tsx`
  - `tncc-community/lib/community-db.ts`
- **DEPENDENCIES:** ISSUE-04
- **PRIORITY:** P1 – High
- **TESTING REQUIREMENTS:** Set challenge deadline to yesterday; attempt submission; verify rejection. Submit entry for an active challenge, then attempt a second submission; verify duplicate warning.

---

### ISSUE-10
- **TITLE:** Wire Admin Dashboard Actions to Live Supabase Backend
- **DESCRIPTION:** All operations in `/community/admin` (creating challenges, publishing resources, reviewing submissions, announcing winners, awarding bonus XP) only mutate the admin's local browser memory.
- **CURRENT BEHAVIOUR:** Admin management changes do not persist to the server or propagate to other users.
- **EXPECTED BEHAVIOUR:** Admin mutations write directly to Supabase tables, secured by `role = 'admin'` RLS policies and server-side authentication.
- **ACCEPTANCE CRITERIA:**
  - [ ] Adding/editing/deleting a challenge mutates `community_challenges`.
  - [ ] Adding/editing/deleting a resource mutates `community_resources`.
  - [ ] Announcing winners records in `community_challenge_winners` and awards winner bonus XP atomically.
  - [ ] Non-admin callers receive 403 Forbidden.
- **AFFECTED FILES:**
  - `app/community/admin/page.tsx`
  - `tncc-community/lib/community-context.tsx`
  - `tncc-community/lib/community-db.ts`
- **DEPENDENCIES:** ISSUE-02, ISSUE-04
- **PRIORITY:** P1 – High
- **TESTING REQUIREMENTS:** Admin creates a challenge in Browser A; open Browser B as standard member; verify new challenge appears immediately in `/community/challenges`.

---

### ISSUE-11
- **TITLE:** Remove 14 MB Unoptimized GLB Model and Optimize 3D Asset Loading
- **DESCRIPTION:** The repository root and `public/` folder contain `regional_map_logo (3).glb`, which is 14.05 MB. The active component `Hero3DLogo.tsx` uses `regional_map_logo.glb?v=4` (4.39 MB). The unused 14 MB asset causes repository bloat. Furthermore, `regional_map_logo.glb` can be further compressed using meshopt/draco to under 2 MB for faster mobile loading.
- **CURRENT BEHAVIOUR:** Unused 14 MB file stored in repo; 4.39 MB model loaded on initial page view.
- **EXPECTED BEHAVIOUR:** Remove unused duplicate file; optimize active GLB file for minimal bandwidth.
- **ACCEPTANCE CRITERIA:**
  - [ ] `regional_map_logo (3).glb` removed from repository.
  - [ ] Active GLB verified to load cleanly with Draco decoder.
- **AFFECTED FILES:**
  - `regional_map_logo (3).glb` (root)
  - `public/regional_map_logo (3).glb`
- **DEPENDENCIES:** None
- **PRIORITY:** P2 – Medium
- **TESTING REQUIREMENTS:** Verify 3D logo still renders and mouse interaction works without error.

---

### ISSUE-12
- **TITLE:** Implement Automated End-to-End Test Suite with Playwright
- **DESCRIPTION:** The project currently lacks an automated browser-based E2E test suite. Manual smoke testing across routes is time-consuming and prone to regressions.
- **CURRENT BEHAVIOUR:** No automated test runner configured in `package.json`.
- **EXPECTED BEHAVIOUR:** Install `@playwright/test` and create automated test suites covering public landing page responsiveness, registration, feed posting, challenge submissions, and admin access control.
- **ACCEPTANCE CRITERIA:**
  - [ ] Playwright installed as devDependency.
  - [ ] `playwright.config.ts` configured for desktop and mobile viewports.
  - [ ] Test cases created for:
    - Landing page render & anchor links
    - Community feed interactions
    - Admin access restriction
    - Responsive viewports (1440px, 1280px, 768px, 390px, 360px)
  - [ ] `npm run test:e2e` script added to `package.json`.
- **AFFECTED FILES:**
  - `package.json`
  - `playwright.config.ts`
  - `tests/e2e/*.spec.ts`
- **DEPENDENCIES:** None
- **PRIORITY:** P2 – Medium
- **TESTING REQUIREMENTS:** Run `npm run test:e2e`; verify all test specs execute and pass.
