'use client';

import React, { useState, useEffect } from 'react';
import { useCommunity } from '../../lib/community-context';
import { PostComment } from '../../lib/types';
import { X, Send, Trash2, Loader2 } from 'lucide-react';

interface CommentsModalProps {
  postId: string;
  postAuthorUsername: string;
  onClose: () => void;
}

export default function CommentsModal({ postId, postAuthorUsername, onClose }: CommentsModalProps) {
  const { currentMember, getComments, addComment, deleteComment, isAdmin } = useCommunity();
  const [commentText, setCommentText] = useState('');
  const [liveComments, setLiveComments] = useState<PostComment[]>(getComments(postId));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments from live backend
  useEffect(() => {
    let active = true;
    const fetchPostComments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/community/posts/${postId}/comments`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.success && Array.isArray(data.comments)) {
            setLiveComments(data.comments);
          }
        }
      } catch (err) {
        console.warn('Failed to load live comments, using cached list:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPostComments();
    return () => {
      active = false;
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = commentText.trim();
    if (!cleanText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newComment = addComment(postId, cleanText);
      setLiveComments((prev) => [...prev, newComment]);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Delete this comment?')) {
      deleteComment(postId, commentId);
      setLiveComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1D2430] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-[#303846] flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#303846]">
          <div>
            <h3 className="font-bold text-sm text-[#0D2C5B] dark:text-[#F5F7FA]">Community Discussion</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-400">Post by @{postAuthorUsername}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#171C24] transition-colors cursor-pointer"
            aria-label="Close comments"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-[160px]">
          {isLoading && liveComments.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#0D2C5B] dark:text-[#00B5C8]" />
            </div>
          ) : liveComments.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs mt-1">Be the first Tamil Nadu creator to share your feedback!</p>
            </div>
          ) : (
            liveComments.map((comment) => {
              const canDelete =
                comment.member_id === currentMember?.id ||
                comment.author.username === currentMember?.username ||
                isAdmin;

              return (
                <div key={comment.id} className="flex items-start gap-3 text-xs group">
                  <img
                    src={comment.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={comment.author.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-100 dark:border-[#303846] shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-[#F8F6F1] dark:bg-[#171C24] p-3 rounded-xl rounded-tl-none relative border border-transparent dark:border-[#303846]/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0D2C5B] dark:text-[#00B5C8]">{comment.author.full_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{comment.comment_text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 dark:border-[#303846] bg-gray-50 dark:bg-[#171C24] flex items-center gap-2">
          <img
            src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
            alt="Current avatar"
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={1000}
            placeholder="Add a constructive critique or thought..."
            className="flex-1 text-xs px-3 py-2 bg-white dark:bg-[#1D2430] text-[#0D2C5B] dark:text-[#F5F7FA] placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-full border border-gray-200 dark:border-[#303846] focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className="p-2 bg-[#0D2C5B] dark:bg-[#00B5C8] hover:bg-[#1B3F7E] dark:hover:bg-[#009fb0] disabled:opacity-40 text-white dark:text-[#101318] rounded-full transition-colors shrink-0 cursor-pointer"
            aria-label="Send comment"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
