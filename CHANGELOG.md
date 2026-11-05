# TNCC Changelog

## [Unreleased] - 2026-11-05

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
