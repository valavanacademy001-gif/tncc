# TNCC — Complete Security Audit & Vulnerability Assessment

**Audit Scope:** Full Application Stack (Frontend, Next.js Middleware, Community Layer, Database RLS, Storage)  
**Classification Standard:** OWASP Top 10 Web Application Security Risks  
**Date:** November 3, 2026  

---

## 1. Vulnerability Findings Matrix

| Finding ID | Vulnerability Title | OWASP Category | Severity | Status |
|---|---|---|---|---|
| **SEC-01** | Hardcoded Plain-Text Passwords in Client Bundle | A02: Cryptographic Failures | **CRITICAL (CVSS 9.8)** | Unresolved |
| **SEC-02** | Credential Leakage in Client Error Response | A07: Identification and Authentication Failures | **CRITICAL (CVSS 9.1)** | Unresolved |
| **SEC-03** | Missing Server-Side Middleware on Admin Route (`/community/admin`) | A01: Broken Access Control | **CRITICAL (CVSS 9.3)** | Unresolved |
| **SEC-04** | Client-Side Role Spoofing via `localStorage` | A01: Broken Access Control | **HIGH (CVSS 8.2)** | Unresolved |
| **SEC-05** | Missing PostgreSQL RLS Mutation Policies | A01: Broken Access Control | **HIGH (CVSS 7.5)** | Unresolved |
| **SEC-06** | Unverified Client-Side XP Ledger (State Tampering) | A08: Software and Data Integrity Failures | **HIGH (CVSS 7.1)** | Unresolved |
| **SEC-07** | Lack of Server-Side File Upload Limits and MIME Validation | A04: Insecure Design | **MEDIUM (CVSS 6.5)** | Unresolved |
| **SEC-08** | Missing CSRF / Rate Limiting on Community Auth Forms | A07: Identification and Authentication Failures | **MEDIUM (CVSS 5.3)** | Unresolved |

---

## 2. In-Depth Vulnerability Analysis

### SEC-01 & SEC-02: Hardcoded Plain-Text Passwords & Credential Leakage

- **Location:** `tncc-community/lib/community-db.ts` (Lines 31, 55, 1166, 1179, 1201-1224)
- **Description:**
  Plain-text passwords for the administrative account and test account are explicitly declared in the source code.
  Furthermore, when a user enters an incorrect password for `suganeshsugu07@gmail.com`, the error message explicitly returns the plaintext password to the user interface.
- **Exploitation Scenario:**
  Any attacker can inspect the client-side JavaScript bundle using browser DevTools, search for `password`, or simply submit an erroneous password to receive the valid admin password directly in the response toast.
- **Remediation:**
  1. Immediately purge all plain-text passwords and mock credential checks from `community-db.ts`.
  2. Implement Supabase Auth (`supabase.auth.signInWithPassword`), ensuring credentials are encrypted in transit via TLS and hashed with bcrypt on Supabase servers.
  3. Replace all verbose error messages with generic responses: `"Invalid email or password."`

---

### SEC-03 & SEC-04: Broken Admin Access Control & Role Spoofing

- **Location:** `middleware.ts`, `lib/supabase/middleware.ts`, `app/community/admin/page.tsx`
- **Description:**
  1. Next.js `middleware.ts` only lists `['/app', '/onboarding']` as protected paths.
  2. The administrative workspace `/community/admin` has NO server-side protection. An HTTP GET request returns status 200 with the full client bundle.
  3. Access control is enforced purely by client-side React code:
     ```ts
     const activeEmail = localStorage.getItem('tncc_active_user_email') || ...;
     const isAuthorized = checkIsAdmin(activeEmail);
     ```
- **Exploitation Scenario:**
  An unauthenticated attacker opens the browser console, runs `localStorage.setItem('tncc_active_user_email', 'suganeshsugu07@gmail.com')`, and refreshes `/community/admin`. The client-side gate passes and exposes all admin management interfaces.
- **Remediation:**
  1. Add `/community/admin` to `protectedPaths` in `middleware.ts`.
  2. In Next.js middleware or server layout, verify that `session.user.email === 'suganeshsugu07@gmail.com'` or check the user's role against the database before serving the page.

---

### SEC-05: Missing Supabase RLS Write Policies

- **Location:** `supabase/migrations/002_community_platform.sql`
- **Description:**
  All 14 `community_*` tables have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`, but only `SELECT` policies are defined.
  There are zero policies for `INSERT`, `UPDATE`, or `DELETE`.
- **Impact:**
  While this protects existing data from being modified via the public anon key, it will completely block legitimate application features once connected to Supabase.
- **Remediation:**
  Deploy migration `003_community_rls_policies.sql` containing granular role-based policies:
  - Members can only insert/update/delete their own posts, comments, likes, and submissions.
  - Only users with verified `admin` role can insert/update/delete resources, challenges, winners, and events.

---

### SEC-06: Client-Side XP Ledger & Score Manipulation

- **Location:** `tncc-community/lib/xp-engine.ts`, `tncc-community/lib/community-db.ts`
- **Description:**
  Member XP, levels, and transaction logs are stored directly in browser `localStorage`.
- **Exploitation Scenario:**
  A member can execute `communityDb.awardXP(currentMember.id, 100000, 'Free XP')` in the browser console, instantly jumping to the top of the statewide leaderboard and obtaining the "Legend" badge without participating in community activities.
- **Remediation:**
  1. XP calculation and ledger writing must reside exclusively on the server.
  2. Create a PostgreSQL stored function `award_member_xp` executable only by server actions or database triggers upon verified actions (e.g. post created, submission approved).
  3. Prohibit direct client writes to `community_xp_transactions` and the `total_xp` column.

---

### SEC-07: Media System File Upload Security

- **Location:** `tncc-community/components/feed/FeedComposer.tsx`
- **Description:**
  Currently, the community post composer only accepts typed string URLs. Once direct file upload is implemented, strict controls are necessary to prevent unrestricted file upload vulnerabilities (e.g. uploading malicious HTML/SVG or oversized payloads that exhaust bandwidth).
- **Remediation:**
  1. Enforce client-side pre-validation: reject images > 1 MB, reject videos > 50 MB.
  2. Enforce Supabase Storage bucket policy restrictions:
     - `allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']`
     - `file_size_limit = 52428800` (50 MB)
  3. Sanitize file names to prevent path traversal or special character injection.

---

## 3. Environment Variables & Secret Hygiene

- **Audited Files:** `.env.example`, `.env.local`
- **Keys Inspected:**
  - `NEXT_PUBLIC_SUPABASE_URL` — Public client configuration (Safe).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anonymous API key, governed by RLS (Safe).
- **Finding:** No private service role keys or database connection strings are exposed in client-accessible variables.
- **Recommendation:** Maintain this practice; never prefix service role keys with `NEXT_PUBLIC_`.
