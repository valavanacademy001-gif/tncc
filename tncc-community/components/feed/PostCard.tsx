'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityPost } from '../../lib/types';
import { useCommunity } from '../../lib/community-context';
import CommentsModal from './CommentsModal';
import ShareModal from './ShareModal';
import FeedVideoPlayer from './FeedVideoPlayer';
import { resolvePreviewImageUrl, isGoogleDriveUrl } from '@/lib/media/google-drive';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Sparkles, 
  MoreHorizontal, 
  ExternalLink,
  HardDrive,
  Trash2
} from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave, isFollowing, toggleFollow, currentMember, deletePost, isAdmin } = useCommunity();
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const lastTapRef = useRef<number>(0);
  const lastTriggerRef = useRef<number>(0);
  const heartTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    };
  }, []);

  const handleDoubleTapLike = () => {
    const now = Date.now();
    if (now - lastTriggerRef.current < 350) return;
    lastTriggerRef.current = now;

    if (!post.is_liked) {
      toggleLike(post.id);
    }

    setShowHeartBurst(true);
    if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    heartTimerRef.current = setTimeout(() => {
      setShowHeartBurst(false);
    }, 800);
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    if (timeSinceLastTap > 0 && timeSinceLastTap < 300) {
      handleDoubleTapLike();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Aspect ratio helper with max-height limits
  const getAspectRatioClass = (ratio: CommunityPost['aspect_ratio']) => {
    switch (ratio) {
      case 'portrait':
        return 'aspect-[4/5] max-h-[540px]';
      case 'landscape':
        return 'aspect-[16/9] max-h-[340px]';
      case 'square':
      default:
        return 'aspect-square max-h-[480px]';
    }
  };

  return (
    <article
      id={post.id}
      className="max-w-[540px] w-full mx-auto bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* 1. Header: Author details & Follow button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <Link
          href={`/community/portfolio/${post.author.username}`}
          className="flex items-center gap-3 group min-w-0"
        >
          <img
            src={post.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={post.author.full_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-[#0D2C5B]/20 transition-all shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#0D2C5B] group-hover:text-[#E84020] transition-colors truncate">
                {post.author.full_name}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#E84020]/10 text-[#E84020] shrink-0">
                ⚡ {post.author.total_xp}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 truncate mt-0.5">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{post.author.location.split(',')[0]}</span>
            </div>
          </div>
        </Link>

        {/* Replaced duplicate showcase buttons with interactive Follow button */}
        <div className="flex items-center gap-2 shrink-0">
          {currentMember?.username !== post.author.username ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFollow(post.author.username);
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm ${
                  isFollowing(post.author.username)
                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-gray-200'
                    : 'bg-[#0D2C5B] text-white hover:bg-[#E84020]'
                }`}
              >
                {isFollowing(post.author.username) ? 'Following' : '+ Follow'}
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Admin: Delete this post?')) {
                      deletePost(post.id);
                    }
                  }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Admin Delete Post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                You
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete your post?')) {
                    deletePost(post.id);
                  }
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete your post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Media Container (constrained to accurate ratio and max height, with double tap to like & video player) */}
      {post.media_url && (
        <div className="relative w-full">
          {post.media_type === 'video' ? (
            <div className="relative w-full">
              <FeedVideoPlayer
                src={post.media_url}
                aspectRatioClass={getAspectRatioClass(post.aspect_ratio)}
                onDoubleTap={handleDoubleTapLike}
              />
              {/* Double-tap animated heart feedback for video */}
              <AnimatePresence>
                {showHeartBurst && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div className="p-4 rounded-full bg-black/40 backdrop-blur-xs shadow-2xl flex items-center justify-center">
                      <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-[#E84020] text-white drop-shadow-xl" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div 
              className={`relative w-full bg-[#0D2C5B]/5 overflow-hidden flex items-center justify-center mx-auto select-none touch-manipulation cursor-pointer ${getAspectRatioClass(post.aspect_ratio)}`}
              onDoubleClick={handleDoubleTapLike}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={resolvePreviewImageUrl(post.media_url)}
                alt={post.caption.slice(0, 40)}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Google Drive indicator badge if applicable */}
              {isGoogleDriveUrl(post.media_url) && (
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1 z-10">
                  <HardDrive className="w-3 h-3 text-emerald-400" />
                  <span>Drive</span>
                </div>
              )}

              {/* Double-tap animated heart feedback */}
              <AnimatePresence>
                {showHeartBurst && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div className="p-4 rounded-full bg-black/40 backdrop-blur-xs shadow-2xl flex items-center justify-center">
                      <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-[#E84020] text-white drop-shadow-xl" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* 3. Interaction Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => toggleLike(post.id)}
            className="flex items-center gap-1.5 text-xs font-semibold group transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                post.is_liked
                  ? 'fill-[#E84020] text-[#E84020]'
                  : 'text-gray-600 group-hover:text-[#E84020]'
              }`}
            />
            <span className={post.is_liked ? 'text-[#E84020] font-bold' : 'text-gray-600'}>
              {post.likes_count}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0D2C5B] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments_count}</span>
          </button>

          {/* Share Button (opens WhatsApp, Instagram, Facebook, X options) */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0D2C5B] transition-colors group"
            title="Share post"
          >
            <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="text-[11px]">Share</span>
          </button>
        </div>

        {/* Bookmark / Save Button */}
        <button
          onClick={() => toggleSave(post.id)}
          className="text-gray-500 hover:text-[#0D2C5B] transition-colors"
          title="Save to bookmarks"
        >
          <Bookmark
            className={`w-5 h-5 transition-all ${
              post.is_saved ? 'fill-[#0D2C5B] text-[#0D2C5B]' : ''
            }`}
          />
        </button>
      </div>

      {/* 4. Caption & Hashtags */}
      <div className="px-4 pb-4 space-y-2">
        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
          <Link
            href={`/community/portfolio/${post.author.username}`}
            className="font-bold text-[#0D2C5B] mr-2 hover:underline"
          >
            {post.author.username}
          </Link>
          {post.caption}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-[#1B3F7E] hover:text-[#E84020] cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className="pt-1 text-[10px] text-gray-400">
          {new Date(post.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Comments Modal Popup */}
      {showComments && (
        <CommentsModal
          postId={post.id}
          postAuthorUsername={post.author.username}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Share Modal Popup */}
      {showShareModal && (
        <ShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </article>
  );
}
