# TNCC Changelog

## [Unreleased] - 2026-11-05

### Added (GitHub Issue #3 - Consolidate Dual Auth & Migrate Community Auth to Supabase)
- **Unified Supabase Authentication Engine:**
  - Migrated Community Authentication from local browser `localStorage` to real Supabase Auth (`supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`).
  - Integrated `auth.users` with `community_members` and `profiles` using the user's UUID as foreign key.
  - Eliminated `localStorage` authentication spoofing and client-controlled `isAuthenticated` flags.
  - Synchronized auth state across root `UserProvider`, `CommunityProvider`, desktop Navbar, and `MobileMenu`.
- **Password Recovery & Auth Callback:**
  - Integrated real `supabase.auth.resetPasswordForEmail()` in `/community/auth` and `/(auth)/forgot-password`.
  - Added secure SSR code exchange route `/auth/callback`.
  - Added responsive `/reset-password` page with password strength meters and `supabase.auth.updateUser()`.
- **Email & Username Lookup Engine:**
  - Created `/api/community/auth/lookup` supporting both raw email and handle-based logins (e.g., `suganesh_admin` or `@suganesh_admin`).
  - Created `/api/community/auth/sync` for real-time member profile reconciliation and cookie management.
- **Server-Side Route Protection (Next.js Middleware):**
  - Enforced strict Supabase JWT verification on `/app`, `/onboarding`, and `/community/admin`.
  - Redirects unauthenticated visitors with 307 temporary redirect to `/community/auth?mode=login&next=...`.

### Added (GitHub Issue #4 & Referral & Earn System)
- **Supabase Migration 008:** Comprehensive Row Level Security (RLS) policies for all community tables (`community_members`, `community_posts`, `community_post_likes`, `community_post_comments`, `community_saved_posts`, `community_challenges`, `community_challenge_submissions`, `community_challenge_winners`, `community_resources`, `community_events`, `community_job_offers`, `community_xp_transactions`, `community_referral_codes`, `community_referrals`).
- **Admin Authorization Function:** Centralized `is_admin()` function with safe `search_path = public` and bootstrap admin table.
- **Referral & Earn System:**
  - Referral reward: **+50 XP** to referrer.
  - Strict anti-fraud trigger: **Zero XP at signup**, zero XP for email verification or profile setup. XP is awarded ONLY upon the referred member's first qualifying approved creative post or verified challenge entry.
  - Database-enforced self-referral prevention and single-attribution constraint.
  - Member referral dashboard in Profile / Community / Freelancer dashboard (`/community/referrals`).
  - Public creator VIP invite landing page (`/join?ref=CODE`).
  - Admin referral audit log and fraud rejection controls in `/community/admin`.
- **UI Enhancements:**
  - High-res 3D Gold, Silver, and Bronze medal assets rendered prominently on both Leaderboard and Challenge Winners podiums.
  - Streamlined mobile header: removed "COMMUNITY" badge and rank subtitle, leaving clean `⚡ {XP} XP`.
  - Streamlined creator follow button on feed post headers.
  - Double-tap to like on images and videos with animated heart burst.

### Added (GitHub Issue #5 - Community Feed, Posts, Likes, Comments & Bookmarks)
- **Supabase Migration 007:** Live PostgreSQL tables and constraints for `community_posts`, `community_post_likes`, `community_post_comments`, and `community_saved_posts`.
- **Atomic Database Functions:**
  - `publish_post_with_verified_xp`
  - `toggle_post_like_and_award_xp`
  - `toggle_post_save`
  - `add_post_comment`
  - `delete_post_comment`
  - `delete_community_post`
- **Next.js Backend API Routes:**
  - `GET /api/community/posts` (with pagination, filters, search)
  - `POST /api/community/posts` (validated publishing +10 XP)
  - `GET /api/community/posts/[id]`
  - `DELETE /api/community/posts/[id]` (ownership verified)
  - `POST /api/community/posts/[id]/like` (anti-farming +2 XP)
  - `GET /api/community/posts/[id]/comments`
  - `POST /api/community/posts/[id]/comments` (with validation)
  - `DELETE /api/community/posts/[id]/comments/[commentId]`
  - `POST /api/community/posts/[id]/save`
  - `GET /api/community/posts/saved`
- **Frontend Realtime Integration:**
  - Supabase Realtime channel subscription on `community_posts` and `community_post_likes`.
  - Immediate optimistic feedback for likes, comments, bookmarks, and deletions.
  - Delete controls on PostCard for author/admin.
  - Delete controls in CommentsModal for author/admin.
  - Full hybrid media integration (Supabase Storage + Google Drive preview).

