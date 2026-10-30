'use client';

import React, { useState } from 'react';
import { useCommunity } from '../../lib/community-context';
import { PostComment } from '../../lib/types';
import { X, Send } from 'lucide-react';

interface CommentsModalProps {
  postId: string;
  postAuthorUsername: string;
  onClose: () => void;
}

export default function CommentsModal({ postId, postAuthorUsername, onClose }: CommentsModalProps) {
  const { currentMember, getComments, addComment } = useCommunity();
  const [commentText, setCommentText] = useState('');
  const comments = getComments(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-sm text-[#0D2C5B]">Community Discussion</h3>
            <p className="text-[11px] text-gray-400">Post by @{postAuthorUsername}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs mt-1">Be the first Tamil Nadu creator to share your feedback!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-xs">
                <img
                  src={comment.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                  alt={comment.author.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0 mt-0.5"
                />
                <div className="flex-1 bg-[#F8F6F1] p-3 rounded-xl rounded-tl-none">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#0D2C5B]">{comment.author.full_name}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.comment_text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Composer */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
          <img
            src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
            alt="Current avatar"
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a constructive critique or thought..."
            className="flex-1 text-xs px-3 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 bg-[#0D2C5B] hover:bg-[#1B3F7E] disabled:opacity-40 text-white rounded-full transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
