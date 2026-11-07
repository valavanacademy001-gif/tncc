'use client';

import React, { useState, useRef } from 'react';
import { useCommunity } from '../../lib/community-context';
import { CommunityMember } from '../../lib/types';
import { InstagramIcon, LinkedinIcon, BehanceIcon } from '../common/SocialLinks';
import { X, Save, Upload, Link as LinkIcon, Camera, Globe, Loader2, UploadCloud, AlertCircle } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { currentMember, updateProfile } = useCommunity();
  const [fullName, setFullName] = useState(currentMember?.full_name || '');
  const [username, setUsername] = useState(currentMember?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(currentMember?.avatar_url || '');
  const [coverUrl, setCoverUrl] = useState(currentMember?.cover_url || '');
  const [bio, setBio] = useState(currentMember?.bio || '');
  const [location, setLocation] = useState(currentMember?.location || 'Chennai, Tamil Nadu');
  const [skills, setSkills] = useState((currentMember?.skills || []).join(', '));
  const [behanceUrl, setBehanceUrl] = useState(currentMember?.behance_url || '');
  const [instagramUrl, setInstagramUrl] = useState(currentMember?.instagram_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentMember?.linkedin_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(currentMember?.website_url || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const avatarFileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    setAvatarError(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type.toLowerCase())) {
      setAvatarError('Avatar must be JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setAvatarError(`Avatar size exceeds 1 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'avatars');
      formData.append('member_id', currentMember?.id || 'anonymous');

      const res = await fetch('/api/community/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload avatar.');
      }
      setAvatarUrl(data.url || data.publicUrl);
    } catch (err: any) {
      setAvatarError(err.message || 'Avatar upload failed.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateProfile({
      full_name: fullName.trim(),
      username: username.trim(),
      avatar_url: avatarUrl.trim(),
      cover_url: coverUrl.trim(),
      bio: bio.trim(),
      location: location.trim(),
      skills: skillsList,
      behance_url: behanceUrl.trim() || undefined,
      instagram_url: instagramUrl.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1D2430] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-[#303846] overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#303846]">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#0D2C5B] dark:text-[#F5F7FA]">Edit Creator Profile</h3>
            <p className="text-xs text-gray-400">Update your public identity on Tamil Nadu Creators Club</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#171C24] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Avatar Image</label>
                <button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={() => avatarFileRef.current?.click()}
                  className="text-[11px] font-bold text-[#E84020] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload (≤1 MB)</span>
                </button>
              </div>

              <input
                ref={avatarFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAvatarUpload(e.target.files[0]);
                  }
                }}
              />

              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Paste URL or click Upload"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />

              {uploadingAvatar && (
                <p className="text-[10px] text-[#0D2C5B] dark:text-[#F5F7FA] font-semibold mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-[#E84020]" />
                  Uploading photo to storage...
                </p>
              )}

              {avatarError && (
                <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  {avatarError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Cover Banner URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Creative Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Typography, DaVinci Resolve, Poster Design"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the Tamil Nadu creator community about your creative focus, clients, and passions..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="pt-2 border-t border-gray-100 dark:border-[#303846]">
            <h4 className="text-xs font-bold text-[#0D2C5B] dark:text-[#F5F7FA] mb-3">Portfolio & Social Handles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#0057FF] mb-1">
                  <BehanceIcon className="w-3.5 h-3.5" />
                  <span>Behance Portfolio</span>
                </label>
                <input
                  type="url"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
                  placeholder="https://behance.net/username"
                  className="w-full text-xs px-3 py-2 bg-[#F8F6F1] dark:bg-[#171C24] dark:text-[#F5F7FA] rounded-lg border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#E1306C] mb-1">
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram Profile</span>
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full text-xs px-3 py-2 bg-[#F8F6F1] dark:bg-[#171C24] dark:text-[#F5F7FA] rounded-lg border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#0A66C2] mb-1">
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full text-xs px-3 py-2 bg-[#F8F6F1] dark:bg-[#171C24] dark:text-[#F5F7FA] rounded-lg border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#0D2C5B] dark:text-[#F5F7FA] mb-1">
                  <Globe className="w-3.5 h-3.5 text-[#00B5C8]" />
                  <span>Personal Website</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full text-xs px-3 py-2 bg-[#F8F6F1] dark:bg-[#171C24] dark:text-[#F5F7FA] rounded-lg border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
                />
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
