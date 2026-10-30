'use client';

import React, { useState } from 'react';
import { useCommunity } from '../../lib/community-context';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Hash, 
  Layers, 
  Globe, 
  Check 
} from 'lucide-react';

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

  // Quick preset sample images for creators if they want ready demo assets
  const PRESET_IMAGES = [
    { label: 'Typography', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Branding', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cinematic', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'AI Visual', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

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
    setMediaUrl('');
    if (onClose) onClose();
  };

  const content = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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

        {/* Media URL Input & Aspect Ratio Selector */}
        {(showMediaInput || mediaUrl) && (
          <div className="p-3 bg-[#F8F6F1] rounded-xl space-y-3 border border-gray-200 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-700">Attach Media URL</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-gray-500 mr-1">Aspect Ratio:</span>
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

            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste direct Image or Video URL (https://...)"
              className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
            />

            {/* Quick Demo Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-gray-400 shrink-0">Sample Presets:</span>
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => {
                    setMediaUrl(img.url);
                    setMediaType('image');
                  }}
                  className="text-[10px] font-medium bg-white hover:bg-orange-50 hover:text-[#E84020] px-2 py-1 rounded border border-gray-200 shrink-0 transition-colors"
                >
                  {img.label}
                </button>
              ))}
            </div>

            {/* Media Preview */}
            {mediaUrl && (
              <div className="relative rounded-lg overflow-hidden max-h-48 bg-gray-900 border border-gray-200 flex items-center justify-center">
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="max-h-48 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-white rounded-full text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
            <button
              type="button"
              onClick={() => {
                setShowMediaInput(true);
                setMediaType('image');
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mediaType === 'image' && mediaUrl
                  ? 'bg-orange-50 text-[#E84020]'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#0D2C5B]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMediaInput(true);
                setMediaType('video');
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mediaType === 'video' && mediaUrl
                  ? 'bg-orange-50 text-[#E84020]'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#0D2C5B]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Video</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!caption.trim()}
              className="px-5 py-2 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-full text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 active:scale-95"
            >
              <span>Post to Community</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-white/20 rounded-full font-extrabold">
                +10 XP
              </span>
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
