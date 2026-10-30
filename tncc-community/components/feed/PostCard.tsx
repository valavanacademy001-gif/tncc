'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CommunityPost } from '../../lib/types';
import { useCommunity } from '../../lib/community-context';
import CommentsModal from './CommentsModal';
import ShareModal from './ShareModal';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Sparkles, 
  MoreHorizontal, 
  ExternalLink 
} from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave, isFollowing, toggleFollow, currentMember } = useCommunity();
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
      {/* 1. Header: Author details, follower count & Follow button */}
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
              <span>·</span>
              <span className="font-semibold text-gray-600">
                {post.author.followers_count ?? 240} followers
              </span>
            </div>
          </div>
        </Link>

        {/* Replaced duplicate showcase buttons with interactive Follow button */}
        <div className="flex items-center gap-2 shrink-0">
          {currentMember?.username !== post.author.username ? (
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
          ) : (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              You
            </span>
          )}
        </div>
      </div>

      {/* 2. Media Container (constrained to accurate ratio and max height) */}
      {post.media_url && (
        <div className={`relative w-full bg-[#0D2C5B]/5 overflow-hidden flex items-center justify-center mx-auto ${getAspectRatioClass(post.aspect_ratio)}`}>
          {post.media_type === 'video' ? (
            <video
              src={post.media_url}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={post.media_url}
              alt={post.caption.slice(0, 40)}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
              }}
            />
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
