# TNCC Security Audit & Row Level Security (RLS) Report

**Audit Target:** Community Feed Security & Access Controls (Issue #5)  
**Standard:** Zero Trust Server-Side Authorization  

---

## 1. Row Level Security Policies Verified

| Table | Policy Name | Command | Policy Rule / Check |
| :--- | :--- | :--- | :--- |
| `community_posts` | Public read community_posts | `SELECT` | `USING (true)` |
| `community_posts` | Members insert own posts | `INSERT` | `WITH CHECK (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_posts` | Members and admin update own posts | `UPDATE` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_posts` | Members and admin delete own posts | `DELETE` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_post_likes` | Public read community_post_likes | `SELECT` | `USING (true)` |
| `community_post_likes` | Members insert own likes | `INSERT` | `WITH CHECK (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_post_likes` | Members delete own likes | `DELETE` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_post_comments`| Public read community_post_comments | `SELECT` | `USING (true)` |
| `community_post_comments`| Members insert own comments | `INSERT` | `WITH CHECK (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_post_comments`| Members and admin delete own comments | `DELETE` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_saved_posts` | Members read own saved posts | `SELECT` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_saved_posts` | Members insert own saved posts | `INSERT` | `WITH CHECK (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_saved_posts` | Members delete own saved posts | `DELETE` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_members` | Public read members profile | `SELECT` | `USING (true)` |
| `community_members` | Members update own profile fields | `UPDATE` | `USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin())` |
| `community_xp_transactions` | Members read own XP transactions | `SELECT` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_xp_transactions` | Clients cannot modify ledger | `INSERT, UPDATE, DELETE` | `FORBIDDEN` (Immutable append-only via server service-role RPCs) |
| `community_referral_codes` | Members read own or by code | `SELECT` | `USING (true)` |
| `community_referrals` | Referrers read own referrals | `SELECT` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = referrer_member_id) OR is_admin())` |
| `community_challenges` | Public read challenges | `SELECT` | `USING (true)` |
| `community_challenges` | Admin manage challenges | `ALL` | `USING (is_admin())` |
| `community_challenge_submissions` | Members read own or approved | `SELECT` | `USING (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id) OR is_admin())` |
| `community_challenge_submissions` | Members submit own entries | `INSERT` | `WITH CHECK (auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id))` |
| `community_resources` | Public read resources | `SELECT` | `USING (true)` |
| `community_resources` | Admin manage resources | `ALL` | `USING (is_admin())` |

---

## 2. Anti-Farming & Concurrency Protections

1. **Self-Like Anti-Farming:** A creator liking their own post receives visual like state confirmation, but the XP engine rejects awarding XP (`xp_earned: false`).
2. **Re-Like Anti-Farming:** Unliking and re-liking the same post does not re-award XP. Once the idempotency record exists in the ledger, repeat requests return `xp_earned: false`.
3. **Double-Click & Mutex Concurrency:** Server-side mutex locking (`acquireXPLock` / database unique constraints) prevents concurrent simultaneous duplicate like records.
4. **Ownership Verification on Deletion:** Attempting to delete another member's post or comment returns `HTTP 403 Forbidden` (`Unauthorized: You can only delete your own posts/comments`).
5. **Referral Fraud Prevention:**
   - 0 XP at signup, profile setup, or email verification.
   - Referrer reward (+50 XP) is triggered strictly on the referred member's first approved creative post or verified challenge entry.
   - Self-referrals are prevented by database-level `CHECK (referrer_member_id <> referred_member_id)`.
   - Single referrer attribution enforced via `UNIQUE (referred_member_id)`.
   - Admins can review and reject suspicious referrals via Admin Dashboard.

---

## 3. Unified Supabase Authentication Security (Issue #3)

1. **Elimination of Client-Side LocalStorage Spoofing:**
   - Client-controlled authentication flags (`isAuthenticated: true` in localStorage) completely removed.
   - Supabase Auth session (`auth.users`) is the sole source of truth across all providers (`UserProvider`, `CommunityProvider`).
2. **Server-Side Route Protection:**
   - Protected routes (`/app`, `/onboarding`, `/community/admin`) enforce Supabase JWT validation via Next.js Middleware.
   - Unauthenticated access returns HTTP 307 temporary redirect to `/community/auth?mode=login&next=...`.
   - Unauthorized member access to admin routes is rejected with HTTP 403 Forbidden.
3. **Password Security & Recovery:**
   - Plain-text passwords never stored or logged.
   - Password reset uses cryptographically signed, single-use auth codes via Supabase Auth email redirect (`/auth/callback?next=/reset-password`).
   - New password update enforced through secure `supabase.auth.updateUser()`.


