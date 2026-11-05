'use client';

import React, { useState, useRef } from 'react';
import { useCommunity } from '../../lib/community-context';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Hash, 
  Layers, 
  Globe, 
  Check,
  UploadCloud,
  Loader2,
  HardDrive,
  AlertCircle,
  ExternalLink,
  Film
} from 'lucide-react';
import { parseGoogleDriveUrl, resolvePreviewImageUrl, isGoogleDriveUrl } from '@/lib/media/google-drive';

// 1 MB limit for images, 50 MB limit for videos
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

interface FeedComposerProps {
  onClose?: () => void;
  isInline?: boolean;
}

export default function FeedComposer({ onClose, isInline = false }: FeedComposerProps) {
  const { currentMember, createPost } = useCommunity();
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('portrait');
  const [category, setCategory] = useState<
    'Showcase' | 'Discussion' | 'Graphic Design' | 'Video Editing' | 'Photography' | 'AI Art' | 'Branding'
  >('Showcase');
  const [hashtags, setHashtags] = useState('#TNCCShowcase #TamilCreators');
  const [isShowcase, setIsShowcase] = useState(true);
  const [showMediaInput, setShowMediaInput] = useState(false);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Quick preset sample images for creators if they want ready demo assets
  const PRESET_IMAGES = [
    { label: 'Typography', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Branding', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cinematic', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'AI Visual', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Detect Google Drive Link
  const gdrive = parseGoogleDriveUrl(mediaUrl);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    const mime = file.type.toLowerCase();
    const isImage = ALLOWED_IMAGE_TYPES.includes(mime);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mime);

    // Validate MIME type
    if (!isImage && !isVideo) {
      const msg = `Unsupported file type "${file.name}". Please upload an image (JPG, PNG, WebP) or video (MP4, WebM, MOV).`;
      setUploadError(msg);
      return;
    }

    // Validate File Size
    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `Image file size exceeds the 1 MB limit (Selected: ${sizeMB} MB). Please choose a smaller image.`;
      setUploadError(msg);
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const msg = `Video file size exceeds the 50 MB limit (Selected: ${sizeMB} MB). Please upload a smaller video or share via Google Drive.`;
      setUploadError(msg);
      return;
    }

    // Set local immediate preview blob
    const localBlob = URL.createObjectURL(file);
    setPreviewBlobUrl(localBlob);
    setMediaType(isImage ? 'image' : 'video');
    setShowMediaInput(true);
    setIsUploading(true);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('member_id', currentMember?.id || 'anonymous');
      formData.append('bucket', 'community-media');

      setUploadProgress(40);

      const res = await fetch('/api/community/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload media to storage.');
      }

      setMediaUrl(data.url || data.publicUrl);
      setUploadProgress(100);
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError(err.message || 'Media upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClearMedia = () => {
    setMediaUrl('');
    setPreviewBlobUrl(null);
    setUploadError(null);
    setUploadProgress(0);
    setShowMediaInput(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || isUploading) return;

    const parsedHashtags = hashtags
      .split(' ')
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    createPost({
      caption,
      media_url: mediaUrl.trim() || undefined,
      media_type: mediaUrl.trim() ? mediaType : 'none',
      aspect_ratio: aspectRatio,
      hashtags: parsedHashtags,
      category,
      is_showcase: isShowcase,
    });

    setCaption('');
    handleClearMedia();
    if (onClose) onClose();
  };

  const content = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Header if modal */}
      {!isInline && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0D2C5B]">Create Community Post</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E84020]/10 text-[#E84020]">
              +10 XP
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        {/* Author row & Category selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={currentMember?.full_name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-xs font-bold text-[#0D2C5B] leading-tight">
                {currentMember?.full_name}
              </p>
              <p className="text-[11px] text-gray-400">
                @{currentMember?.username} · {currentMember?.location}
              </p>
            </div>
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="text-xs bg-[#F8F6F1] font-semibold text-[#0D2C5B] px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none"
          >
            <option value="Showcase">🎨 Showcase</option>
            <option value="Graphic Design">📐 Graphic Design</option>
            <option value="Video Editing">🎬 Video Editing</option>
            <option value="Photography">📷 Photography</option>
            <option value="AI Art">🤖 AI Art</option>
            <option value="Branding">🏷️ Branding</option>
            <option value="Discussion">💬 Discussion</option>
          </select>
        </div>

        {/* Text Area */}
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Share your creative process, latest design, video breakdown, or ask the community..."
          className="w-full text-sm text-[#0D2C5B] placeholder:text-gray-400 border-none focus:ring-0 focus:outline-none resize-none bg-transparent"
        />

        {/* Error Message Alert */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{uploadError}</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Media Upload & URL Section */}
        {(showMediaInput || mediaUrl || isUploading) && (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`p-3.5 bg-[#F8F6F1] rounded-2xl space-y-3 border transition-all ${
              isDragging ? 'border-[#E84020] bg-orange-50/50' : 'border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">
                  Attached Media {mediaType === 'video' ? '(Video)' : '(Image)'}
                </span>
                {isGoogleDriveUrl(mediaUrl) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    <HardDrive className="w-3 h-3 text-emerald-600" />
                    Google Drive
                  </span>
                )}
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-gray-500 mr-1">Aspect:</span>
                {(['portrait', 'square', 'landscape'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize font-medium ${
                      aspectRatio === ratio
                        ? 'bg-[#0D2C5B] text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {ratio === 'portrait' ? '4:5' : ratio === 'square' ? '1:1' : '16:9'}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 p-3 bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E84020]" />
                    Uploading to Supabase Storage...
                  </span>
                  <span className="font-bold text-[#0D2C5B]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0D2C5B] to-[#E84020] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Media URL Input or Direct Drop Prompt */}
            <div className="space-y-2">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  const parsed = parseGoogleDriveUrl(e.target.value);
                  if (parsed.isGoogleDrive) {
                    setMediaType('image'); // default to image or let user select
                  }
                }}
                placeholder="Paste direct URL or Google Drive share link (https://...)"
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
              />

              {/* Google Drive Sharing Notice */}
              {gdrive.isGoogleDrive && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Public link detected. Please ensure sharing is set to <strong>"Anyone with the link can view"</strong> in Drive.
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mediaType === 'image' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700'
                      }`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mediaType === 'video' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Media Preview Box */}
            {(previewBlobUrl || mediaUrl) && (
              <div className="relative rounded-xl overflow-hidden max-h-56 bg-black border border-gray-200 flex items-center justify-center">
                {mediaType === 'video' ? (
                  gdrive.isGoogleDrive ? (
                    <div className="p-6 text-center text-white flex flex-col items-center gap-2">
                      <Film className="w-8 h-8 text-[#E84020]" />
                      <p className="text-xs font-semibold">Google Drive Video Embed Ready</p>
                      <p className="text-[10px] text-gray-400">Will stream via Google Drive viewer in feed</p>
                    </div>
                  ) : (
                    <video
                      src={previewBlobUrl || mediaUrl}
                      controls
                      playsInline
                      className="max-h-56 w-full object-cover"
                    />
                  )
                ) : (
                  <img
                    src={previewBlobUrl || resolvePreviewImageUrl(mediaUrl)}
                    alt="Preview"
                    className="max-h-56 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={handleClearMedia}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-black/70 hover:bg-black text-white rounded-full text-xs transition-colors shadow-lg"
                  title="Remove media"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Demo Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <span className="text-[10px] text-gray-400 shrink-0">Sample Presets:</span>
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => {
                    setMediaUrl(img.url);
                    setPreviewBlobUrl(null);
                    setMediaType('image');
                  }}
                  className="text-[10px] font-medium bg-white hover:bg-orange-50 hover:text-[#E84020] px-2 py-1 rounded-md border border-gray-200 shrink-0 transition-colors"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags input */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F6F1] rounded-lg border border-gray-200 text-xs">
          <Hash className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#TamilDesign #MotionGraphics"
            className="w-full bg-transparent focus:outline-none text-[#0D2C5B]"
          />
        </div>

        {/* Automatic Portfolio Checkbox */}
        <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
          <input
            type="checkbox"
            checked={isShowcase}
            onChange={(e) => setIsShowcase(e.target.checked)}
            className="w-4 h-4 text-[#E84020] rounded border-gray-300 focus:ring-[#E84020]"
          />
          <span className="font-semibold text-gray-700">
            Showcase in My Portfolio automatically
          </span>
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            (No need to upload twice)
          </span>
        </label>

        {/* Action Toolbar & Submit */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Direct Image File Picker Button */}
            <button
              type="button"
              onClick={() => {
                imageInputRef.current?.click();
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mediaType === 'image' && (mediaUrl || previewBlobUrl)
                  ? 'bg-orange-50 text-[#E84020]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C5B]'
              }`}
              title="Upload Photo"
            >
              <ImageIcon className="w-4 h-4 text-[#E84020]" />
              <span className="inline">Photo</span>
            </button>

            {/* Direct Video File Picker Button */}
            <button
              type="button"
              onClick={() => {
                videoInputRef.current?.click();
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mediaType === 'video' && (mediaUrl || previewBlobUrl)
                  ? 'bg-orange-50 text-[#E84020]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#0D2C5B]'
              }`}
              title="Upload Video"
            >
              <Video className="w-4 h-4 text-[#0D2C5B]" />
              <span className="inline">Video</span>
            </button>

            {/* Toggle URL / Drive link input */}
            <button
              type="button"
              onClick={() => setShowMediaInput((prev) => !prev)}
              className="p-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-[#0D2C5B] transition-colors"
              title="Paste Link / Google Drive"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!caption.trim() || isUploading}
              className="px-5 py-2 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Post to Community</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-white/20 rounded-full font-extrabold">
                    +10 XP
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  if (isInline) {
    return content;
  }

  // Modal backdrop
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg animate-scale-up">{content}</div>
    </div>
  );
}
