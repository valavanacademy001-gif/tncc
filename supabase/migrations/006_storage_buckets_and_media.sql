-- ============================================================
-- 006_storage_buckets_and_media.sql
-- Direct Storage Buckets & Policies for TNCC Community Media
-- ============================================================

-- 1. Create or update 'community-media' bucket
-- Max file size: 50 MB (52,428,800 bytes)
-- Allowed types: JPG, PNG, WEBP, MP4, WEBM, MOV
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

-- 2. Create or update 'avatars' bucket (Max 1 MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 1048576,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 3. Storage access policies for 'community-media'
-- Public read access for community posts, challenges, and portfolios
DROP POLICY IF EXISTS "Public can view community media" ON storage.objects;
CREATE POLICY "Public can view community media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-media');

-- Authenticated upload access
DROP POLICY IF EXISTS "Authenticated users can upload community media" ON storage.objects;
CREATE POLICY "Authenticated users can upload community media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'community-media'
  );

-- Owner update policy
DROP POLICY IF EXISTS "Users can update their own media" ON storage.objects;
CREATE POLICY "Users can update their own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'community-media' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1] 
      OR auth.role() = 'service_role'
    )
  );

-- Owner delete policy
DROP POLICY IF EXISTS "Users can delete their own media" ON storage.objects;
CREATE POLICY "Users can delete their own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'community-media' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1] 
      OR auth.role() = 'service_role'
    )
  );

-- 4. Storage access policies for 'avatars'
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
  );
