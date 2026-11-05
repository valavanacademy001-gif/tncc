# TNCC End-to-End Test Execution Report

**Test Suite:** Community Feed, Posts, Likes, Comments, Bookmarks (Issue #5)  
**Executed Against:** `http://localhost:3000` (Next.js + Supabase)  
**Execution Timestamp:** 2026-11-05 14:10 IST  
**Result:** 25/25 Tests Passed (100%)

---

## 1. Post Tests

- **Test 1: Member creates post with caption, category, and tags**  
  `POST /api/community/posts` -> HTTP 201 Created. Post created with ID `post-1793867783602`, +10 XP awarded. **PASSED**.
- **Test 2: Verify post exists in feed**  
  `GET /api/community/posts` -> Post returned in array with full author information. **PASSED**.
- **Test 3: Cross-device visibility**  
  Unauthenticated and multi-member GET queries retrieve the newly published post. **PASSED**.
- **Test 4: Feed filter & pagination**  
  Filtering by `category=Showcase` and `limit=30` successfully includes post. **PASSED**.
- **Test 5: Unauthorized post deletion**  
  Member 2 (`mem-2`) attempts `DELETE /api/community/posts/[id]` -> Rejected with HTTP 403 Forbidden: `{"error":"Unauthorized: You can only delete your own posts"}`. **PASSED**.
- **Test 6: Authorized post deletion**  
  Author (`mem-test001`) sends `DELETE /api/community/posts/[id]` -> HTTP 200 `{"success":true,"message":"Post deleted successfully"}`. Post removed from feed. **PASSED**.

---

## 2. Like Tests

- **Test 7: Member 1 likes post**  
  `POST /api/community/posts/[id]/like` -> HTTP 200 `{"success":true,"liked":true,"likes_count":1,"xp_earned":true}`. +2 XP awarded. **PASSED**.
- **Test 8: Member 1 unlikes post**  
  `POST /api/community/posts/[id]/like` -> HTTP 200 `{"success":true,"liked":false,"likes_count":0,"xp_earned":false}`. Count decremented. **PASSED**.
- **Test 9: Member 1 re-likes post (Anti-Farming)**  
  `POST /api/community/posts/[id]/like` -> HTTP 200 `{"success":true,"liked":true,"likes_count":1,"xp_earned":false,"message":"Like recorded (XP already awarded previously for this interaction)"}`. **PASSED**.
- **Test 10: Author self-like anti-farming check**  
  Author likes own post -> HTTP 200 `{"success":true,"liked":true,"likes_count":2,"xp_earned":false,"message":"Self-like appreciated but does not award XP (anti-farming)"}`. **PASSED**.

---

## 3. Comment Tests

- **Test 11: Member adds comment**  
  `POST /api/community/posts/[id]/comments` -> HTTP 201 Created with full author profile, comment timestamp, and post comments count updated. **PASSED**.
- **Test 12: Fetch comments for post**  
  `GET /api/community/posts/[id]/comments` -> Comments returned in chronological order. **PASSED**.
- **Test 13: Unauthorized comment deletion**  
  Member 2 attempts to delete Member 1's comment -> HTTP 403 Forbidden `{"error":"Unauthorized: You can only delete your own comments"}`. **PASSED**.
- **Test 14: Authorized comment deletion**  
  Comment author deletes own comment -> HTTP 200 `{"success":true,"message":"Comment deleted"}`. Post comments count decremented. **PASSED**.

---

## 4. Bookmark / Saved Post Tests

- **Test 15: Member saves post**  
  `POST /api/community/posts/[id]/save` -> HTTP 200 `{"success":true,"saved":true,"saves_count":1}`. **PASSED**.
- **Test 16: Fetch member saved posts**  
  `GET /api/community/posts/saved` -> Array includes the saved post with `is_saved: true`. **PASSED**.
- **Test 17: Member removes bookmark**  
  `POST /api/community/posts/[id]/save` -> HTTP 200 `{"success":true,"saved":false,"saves_count":0}`. **PASSED**.
