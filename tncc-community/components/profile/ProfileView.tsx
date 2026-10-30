'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCommunity } from '../../lib/community-context';
import EditProfileModal from './EditProfileModal';
import PostCard from '../feed/PostCard';
import { 
  Edit3, 
  MapPin, 
  ExternalLink, 
  Trophy, 
  Award, 
  Sparkles, 
  FolderKanban, 
  Heart, 
  Calendar,
  Layers,
  CheckCircle2,
  FileCheck,
  MessageCircle,
  X
} from 'lucide-react';

export default function ProfileView() {
  const { currentMember, memberLevel, posts, challenges, getPortfolioProjects, getXPTransactions } = useCommunity();
  const [activeTab, setActiveTab] = useState<'posts' | 'portfolio' | 'challenges' | 'submissions' | 'achievements'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Derived user data
  const myPosts = posts.filter((p) => p.member_id === currentMember.id);
  const myPortfolio = getPortfolioProjects(currentMember.id);
  const myXPTransactions = getXPTransactions(currentMember.id);
  const totalLikes = myPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0);

  const tabs = [
    { key: 'posts', label: 'My Posts', count: myPosts.length, icon: Layers },
    { key: 'portfolio', label: 'My Portfolio', count: myPortfolio.length, icon: FolderKanban },
    { key: 'challenges', label: 'My Challenges', count: currentMember.challenges_count || 0, icon: Trophy },
    { key: 'submissions', label: 'XP History', count: myXPTransactions.length, icon: FileCheck },
    { key: 'achievements', label: 'Achievements', count: currentMember.wins_count || 0, icon: Award },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cover Banner */}
      <div className="relative rounded-3xl h-48 sm:h-64 overflow-hidden bg-gradient-to-r from-[#0D2C5B] via-[#1B3F7E] to-[#081A3A] shadow-md border border-gray-200">
        {currentMember?.cover_url && (
          <img
            src={currentMember.cover_url}
            alt="Cover"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/50 text-white backdrop-blur-md border border-white/20">
            Member ID: {currentMember?.member_id}
          </span>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm -mt-20 sm:-mt-24 relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <img
              src={currentMember?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'}
              alt={currentMember?.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-gray-100"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D2C5B]">
                  {currentMember?.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E84020] text-white">
                  Lvl {memberLevel.level}
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-500">
                @{currentMember?.username} · {currentMember?.location}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-500">
                <span className="text-[#00B5C8] font-bold">{memberLevel.title}</span>
                <span>•</span>
                <span>Tamil Nadu Creators Club Member</span>
              </div>
              <div className="flex items-center gap-3 pt-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[#0D2C5B] text-sm">
                    {currentMember?.followers_count ?? 320}
                  </span>
                  <span className="text-gray-500 font-medium">Followers</span>
                </div>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-[#0D2C5B] text-sm">
                    {currentMember?.following_count ?? 78}
                  </span>
                  <span className="text-gray-500 font-medium">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-[#F8F6F1] hover:bg-[#0D2C5B] text-[#0D2C5B] hover:text-white rounded-xl text-xs font-bold transition-all border border-gray-200 flex items-center gap-1.5 self-start sm:self-auto active:scale-95 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio */}
        {currentMember?.bio && (
          <p className="text-xs sm:text-sm text-gray-700 max-w-2xl leading-relaxed">
            {currentMember.bio}
          </p>
        )}

        {/* Skills & Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {currentMember?.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold bg-[#F8F6F1] text-gray-700 px-3 py-1 rounded-lg border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* External Links */}
          <div className="flex items-center gap-3 text-xs">
            {currentMember?.behance_url && (
              <a
                href={currentMember.behance_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0D2C5B] hover:text-[#00B5C8] flex items-center gap-1"
              >
                <span>Behance</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {currentMember?.instagram_url && (
              <a
                href={currentMember.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0D2C5B] hover:text-[#E84020] flex items-center gap-1"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {currentMember?.linkedin_url && (
              <a
                href={currentMember.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0D2C5B] hover:text-[#0D2C5B] flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4 border-t border-gray-100">
          <div className="p-3 bg-[#FFF8EC] rounded-2xl border border-orange-100 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Total XP</span>
            <p className="text-lg font-extrabold text-[#E84020] mt-0.5">⚡ {currentMember?.total_xp}</p>
          </div>
          <div className="p-3 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Followers</span>
            <p className="text-lg font-extrabold text-[#0D2C5B] mt-0.5">{currentMember?.followers_count ?? 320}</p>
          </div>
          <div className="p-3 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Posts</span>
            <p className="text-lg font-extrabold text-[#0D2C5B] mt-0.5">{myPosts.length}</p>
          </div>
          <div className="p-3 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Likes Earned</span>
            <p className="text-lg font-extrabold text-[#0D2C5B] mt-0.5">{totalLikes}</p>
          </div>
          <div className="p-3 bg-[#F8F6F1] rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] uppercase font-bold text-gray-500">Challenges</span>
            <p className="text-lg font-extrabold text-[#0D2C5B] mt-0.5">{currentMember?.challenges_count || 0}</p>
          </div>
          <div className="p-3 bg-[#E6F9FC] rounded-2xl border border-cyan-100 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">Podium Wins</span>
            <p className="text-lg font-extrabold text-[#00B5C8] mt-0.5">👑 {currentMember?.wins_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
                isActive
                  ? 'border-[#E84020] text-[#0D2C5B]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#E84020]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-[#0D2C5B] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {myPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-400">
                <p className="text-sm font-bold">No posts published yet</p>
                <p className="text-xs mt-1">Share your first creative project to the community feed and earn +10 XP!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                    className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col ${
                      selectedPost?.id === post.id
                        ? 'ring-2 ring-[#E84020] border-[#E84020] shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.media_url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80'}
                        alt={post.caption.slice(0, 30)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {post.is_showcase && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E84020] text-white shadow-sm">
                          Showcase
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1">
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-xs text-[#0D2C5B] line-clamp-1 group-hover:text-[#E84020] transition-colors">
                        {post.caption.slice(0, 45)}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-50">
                        <span className="font-semibold text-gray-500">{post.category}</span>
                        <span className="flex items-center gap-1 font-bold text-[#E84020]">
                          <Heart className="w-3 h-3 fill-[#E84020]" />
                          <span>{post.likes_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Click-to-view Details Section below grid */}
            {selectedPost && (
              <div className="mt-8 p-6 bg-white rounded-3xl border border-gray-200 shadow-xl space-y-4 animate-fade-in" id="post-detail-view">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPost.author?.avatar_url || currentMember?.avatar_url}
                      alt={selectedPost.author?.full_name || currentMember?.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#0D2C5B]">{selectedPost.author?.full_name || currentMember?.full_name}</h3>
                        <span className="px-2 py-0.5 bg-[#E84020]/10 text-[#E84020] text-[10px] font-bold rounded-full">
                          ⚡ {selectedPost.author?.total_xp || currentMember?.total_xp} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {selectedPost.author?.location || currentMember?.location} · {new Date(selectedPost.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    title="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {selectedPost.media_url && (
                    <div className="rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 max-h-[420px] flex items-center justify-center">
                      <img
                        src={selectedPost.media_url}
                        alt={selectedPost.caption}
                        className="w-full h-full max-h-[420px] object-contain"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0D2C5B] text-white">
                        {selectedPost.category}
                      </span>
                      <p className="text-sm text-gray-800 leading-relaxed mt-3 font-normal">
                        {selectedPost.caption}
                      </p>
                    </div>
                    {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedPost.hashtags.map((h: string, i: number) => (
                          <span key={i} className="text-xs font-semibold text-[#1B3F7E] bg-blue-50 px-2 py-0.5 rounded-md">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-600 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#E84020] fill-[#E84020]" />
                        {selectedPost.likes_count} Likes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        {selectedPost.comments_count} Comments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {myPortfolio.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-400">
                <p className="text-sm font-bold">Portfolio Showcase Empty</p>
                <p className="text-xs mt-1">
                  When you publish a post to the Feed and select &quot;Showcase&quot;, it automatically appears here!
                </p>
              </div>
            ) : (
              myPortfolio.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative group">
                    <img src={proj.preview_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-sm">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-xs text-[#0D2C5B] line-clamp-1">{proj.title}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{proj.description}</p>
                    <div className="pt-2 mt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                      <span className="text-[#E84020] font-bold">TNCC Verified</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">Participated</span>
              <h4 className="font-bold text-sm text-[#0D2C5B]">Social Media Poster Design Challenge</h4>
              <p className="text-xs text-gray-500">Entry recorded with +15 XP bonus. Results evaluating soon.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E84020] text-white">2nd Place Winner 🥈</span>
              <h4 className="font-bold text-sm text-[#0D2C5B]">Minimalist Coffee Brand Identity Challenge</h4>
              <p className="text-xs text-gray-500">Won 2nd place and awarded +60 XP bonus points!</p>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 font-bold text-xs text-[#0D2C5B]">
              XP Audit Trail (Anti-Farming Transaction Log)
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {myXPTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No XP transactions logged yet.</div>
              ) : (
                myXPTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{tx.reason}</p>
                      <p className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#E84020]/10 text-[#E84020] font-extrabold rounded-full">
                      +{tx.amount} XP
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-[#FFF8EC] to-white rounded-2xl border border-[#F5A623] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#0D2C5B] flex items-center justify-center font-extrabold text-lg">
                🥈
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0D2C5B]">Silver Trophy</h4>
                <p className="text-[11px] text-gray-500">2nd place in Coffee Branding</p>
                <span className="text-[10px] font-bold text-[#E84020]">+60 XP</span>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-[#E6F9FC] to-white rounded-2xl border border-[#00B5C8] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00B5C8] text-white flex items-center justify-center font-extrabold text-lg">
                🚀
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0D2C5B]">Early Pioneer</h4>
                <p className="text-[11px] text-gray-500">Founding Member of TNCC</p>
                <span className="text-[10px] font-bold text-[#00B5C8]">Verified</span>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-[#FFF0ED] to-white rounded-2xl border border-[#E84020] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E84020] text-white flex items-center justify-center font-extrabold text-lg">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#0D2C5B]">Active Creator</h4>
                <p className="text-[11px] text-gray-500">Published verified works</p>
                <span className="text-[10px] font-bold text-[#E84020]">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}
