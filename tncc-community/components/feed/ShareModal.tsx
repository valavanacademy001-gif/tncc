'use client';

import React, { useState } from 'react';
import { CommunityPost } from '../../lib/types';
import { X, Check, Copy, Share2, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  post: CommunityPost;
  onClose: () => void;
}

export default function ShareModal({ post, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedForInstagram, setCopiedForInstagram] = useState(false);

  // Construct absolute URL safely on client
  const postUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/community#${post.id}`
    : `https://tncc.in/community#${post.id}`;

  const shareText = `Check out this creative work by ${post.author.full_name} (@${post.author.username}) on Tamil Nadu Creators Club (TNCC): "${post.caption.slice(0, 80)}..."\n\n${postUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstagramShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopiedForInstagram(true);
      setTimeout(() => setCopiedForInstagram(false), 3000);
    }
  };

  const shareChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      subtitle: 'Share to chat or status',
      iconBg: 'bg-[#25D366] text-white',
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
      },
    },
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: 'Copy link for Story / DM',
      iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      action: handleInstagramShare,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      subtitle: 'Post to feed or group',
      iconBg: 'bg-[#1877F2] text-white',
      iconSvg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
      },
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      subtitle: 'Post to your timeline',
      iconBg: 'bg-black text-white',
      iconSvg: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 overflow-hidden relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0D2C5B]/10 flex items-center justify-center text-[#0D2C5B]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0D2C5B]">Share Post</h3>
              <p className="text-[11px] text-gray-500">Share this creative work with fellow creators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Snippet Preview */}
        <div className="my-4 p-3 bg-[#F8F6F1] rounded-2xl border border-gray-200 flex items-center gap-3">
          <img
            src={post.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={post.author.full_name}
            className="w-10 h-10 rounded-full object-cover border border-white shadow-sm shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-[#0D2C5B] truncate">{post.author.full_name}</span>
              <span className="text-[10px] text-gray-400">@{post.author.username}</span>
            </div>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{post.caption}</p>
          </div>
        </div>

        {/* Social Sharing Channels */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          {shareChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={ch.action}
              className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left group active:scale-98"
            >
              <div className={`w-9 h-9 rounded-xl ${ch.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                {ch.iconSvg}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#0D2C5B] block truncate group-hover:text-[#E84020] transition-colors">
                  {ch.name}
                </span>
                <span className="text-[10px] text-gray-400 block truncate">
                  {ch.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Instagram Copy Toast feedback */}
        {copiedForInstagram && (
          <div className="mb-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 flex items-center gap-2 text-xs text-[#bc1888] font-bold animate-fade-in">
            <Check className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Link copied! Open Instagram and paste in your Story sticker or DM.</span>
          </div>
        )}

        {/* Copy Link Direct Bar */}
        <div className="pt-3 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 pl-3 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="text"
              readOnly
              value={postUrl}
              className="flex-1 min-w-0 bg-transparent text-xs text-gray-600 select-all outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0D2C5B] hover:bg-[#E84020] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
