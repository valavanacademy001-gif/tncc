# TNCC Database Audit Report

**Audit Target:** Community Feed, Posts, Likes, Comments, Saved Bookmarks  
**Supabase Schema:** PostgreSQL  
**Migration Reference:** `007_community_feed_posts_likes_comments_rls.sql`

---

## 1. Verified Database Tables

### A. `community_posts`
- **Columns:** `id (UUID PK)`, `member_id (UUID FK)`, `caption (TEXT)`, `media_url (TEXT)`, `media_type (TEXT)`, `aspect_ratio (TEXT)`, `hashtags (TEXT[])`, `category (TEXT)`, `is_showcase (BOOLEAN)`, `likes_count (INT)`, `comments_count (INT)`, `saves_count (INT)`, `created_at (TIMESTAMPTZ)`, `updated_at (TIMESTAMPTZ)`
- **Constraints:**
  - Foreign key to `community_members(id)` with `ON DELETE CASCADE`.
  - Checks: `media_type IN ('image', 'video', 'none')`, `aspect_ratio IN ('square', 'portrait', 'landscape')`.
- **Indexes:**
  - `idx_community_posts_created_at` (DESC)
  - `idx_community_posts_member_id`
  - `idx_community_posts_category`
  - `idx_community_posts_is_showcase`

### B. `community_post_likes`
- **Columns:** `id (UUID PK)`, `post_id (UUID FK)`, `member_id (UUID FK)`, `created_at (TIMESTAMPTZ)`
- **Unique Constraint:** `CONSTRAINT unique_post_member_like UNIQUE (post_id, member_id)` – prevents duplicate likes at DB engine level.
- **Indexes:** `idx_community_post_likes_post`, `idx_community_post_likes_member`.

### C. `community_post_comments`
- **Columns:** `id (UUID PK)`, `post_id (UUID FK)`, `member_id (UUID FK)`, `comment_text (TEXT)`, `created_at (TIMESTAMPTZ)`, `updated_at (TIMESTAMPTZ)`
- **Indexes:** `idx_community_post_comments_post (post_id, created_at ASC)`, `idx_community_post_comments_member`.

### D. `community_saved_posts`
- **Columns:** `id (UUID PK)`, `post_id (UUID FK)`, `member_id (UUID FK)`, `created_at (TIMESTAMPTZ)`
- **Unique Constraint:** `CONSTRAINT unique_saved_post UNIQUE (post_id, member_id)` – prevents duplicate bookmark rows.
- **Indexes:** `idx_community_saved_posts_member`, `idx_community_saved_posts_post`.

---

## 2. Stored Procedures & Atomic RPCs

1. `publish_post_with_verified_xp`: Atomically creates post and inserts verified +10 XP ledger transaction.
2. `toggle_post_like_and_award_xp`: Atomically toggles like and awards +2 XP with anti-farming guards.
3. `toggle_post_save`: Atomically adds/removes bookmark and updates post `saves_count`.
4. `add_post_comment`: Atomically inserts comment and increments post `comments_count`.
5. `delete_post_comment`: Verifies ownership and deletes comment, decrementing `comments_count`.
6. `delete_community_post`: Verifies ownership and deletes post and associated cascades.
7. `get_or_create_referral_code`: Generates deterministic unique referral code for member.
8. `record_referral_signup`: Records pending referral attribution with zero XP reward.
9. `evaluate_and_reward_referral`: Verifies first qualifying creative activity (post or challenge submission) and awards exactly +50 XP to the referrer via the XP ledger.

---

## 3. Referral & Earn Tables (Migration 008)

### A. `community_referral_codes`
- **Columns:** `id (UUID PK)`, `member_id (UUID FK)`, `code (TEXT UNIQUE)`, `created_at (TIMESTAMPTZ)`
- **Constraint:** One permanent unique code per member.

### B. `community_referrals`
- **Columns:** `id (UUID PK)`, `referrer_member_id (UUID FK)`, `referred_member_id (UUID FK)`, `referral_code (TEXT)`, `status (TEXT)`, `reward_xp (INT DEFAULT 50)`, `reward_transaction_id (UUID FK)`, `first_activity_type (TEXT)`, `first_activity_id (TEXT)`, `created_at (TIMESTAMPTZ)`, `rewarded_at (TIMESTAMPTZ)`
- **Anti-Fraud Constraints:**
  - `UNIQUE (referred_member_id)`: Guarantees a referred user can only ever have one referrer.
  - `CHECK (referrer_member_id <> referred_member_id)`: Self-referral is strictly forbidden.
  - `status IN ('pending_activity', 'rewarded', 'rejected')`.


