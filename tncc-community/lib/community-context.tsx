'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CommunityMember,
  CommunityPost,
  CommunityResource,
  CommunityChallenge,
  CommunityJobOffer,
  CommunityEvent,
  PostComment,
  ChallengeSubmission,
  XPTransaction,
  PortfolioProject,
  MemberRole,
} from './types';
import { communityDb } from './community-db';
import { XPEngine } from './xp-engine';
import { checkIsAdmin } from './admin-config';

export interface ToastMessage {
  id: string;
  type: 'success' | 'xp' | 'info' | 'error';
  title: string;
  message: string;
}

interface CommunityContextType {
  currentMember: CommunityMember;
  allMembers: CommunityMember[];
  posts: CommunityPost[];
  resources: CommunityResource[];
  challenges: CommunityChallenge[];
  jobs: CommunityJobOffer[];
  events: CommunityEvent[];
  toasts: ToastMessage[];
  memberLevel: {
    level: number;
    title: string;
    nextLevelXp: number;
    progressPercentage: number;
  };
  isAdmin: boolean;
  toggleAdminMode: (enable?: boolean) => void;
  updateProfile: (data: Partial<CommunityMember>) => void;
  createPost: (data: {
    caption: string;
    media_url?: string;
    media_type: 'image' | 'video' | 'none';
    aspect_ratio: 'square' | 'portrait' | 'landscape';
    hashtags: string[];
    category: CommunityPost['category'];
    is_showcase: boolean;
  }) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => PostComment;
  getComments: (postId: string) => PostComment[];
  submitChallenge: (data: {
    challenge_id: string;
    title: string;
    description?: string;
    submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
    submission_url: string;
  }) => void;
  getChallengeById: (id: string) => CommunityChallenge | undefined;
  getPortfolioProjects: (memberId: string) => PortfolioProject[];
  getXPTransactions: (memberId: string) => XPTransaction[];
  isFollowing: (memberIdOrUsername: string) => boolean;
  toggleFollow: (memberIdOrUsername: string) => void;
  dismissToast: (id: string) => void;
  refreshData: () => void;
  // --- Admin Methods ---
  addResource: (data: Omit<CommunityResource, 'id'>) => void;
  updateResource: (id: string, data: Partial<CommunityResource>) => void;
  deleteResource: (id: string) => void;
  addJob: (data: Omit<CommunityJobOffer, 'id'>) => void;
  updateJob: (id: string, data: Partial<CommunityJobOffer>) => void;
  deleteJob: (id: string) => void;
  addEvent: (data: Omit<CommunityEvent, 'id'>) => void;
  updateEvent: (id: string, data: Partial<CommunityEvent>) => void;
  deleteEvent: (id: string) => void;
  addChallenge: (data: Omit<CommunityChallenge, 'id'>) => void;
  updateChallenge: (id: string, data: Partial<CommunityChallenge>) => void;
  deleteChallenge: (id: string) => void;
  pickChallengeWinner: (challengeId: string, position: 'first' | 'second' | 'third', submissionId: string) => void;
  getAllSubmissions: () => ChallengeSubmission[];
  updateMemberRole: (memberId: string, role: MemberRole) => void;
  deleteMember: (memberId: string) => void;
  awardBonusXP: (memberId: string, amount: number, reason: string) => void;
  getAdminReports: () => any;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [currentMember, setCurrentMember] = useState<CommunityMember>(communityDb.getCurrentMember());
  const [allMembers, setAllMembers] = useState<CommunityMember[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [jobs, setJobs] = useState<CommunityJobOffer[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadAll = () => {
    communityDb.init();
    const curr = communityDb.getCurrentMember();
    setCurrentMember(curr);
    setAllMembers(communityDb.getMembers());
    setPosts(communityDb.getPosts());
    setResources(communityDb.getResources());
    setChallenges(communityDb.getChallenges());
    setJobs(communityDb.getJobs());
    setEvents(communityDb.getEvents());

    // Check admin status
    if (typeof window !== 'undefined') {
      const demoFlag = localStorage.getItem('tncc_admin_demo') === 'true';
      const isRoleAdmin = curr?.role === 'admin';
      const hasEmailAuth = checkIsAdmin(curr?.username ? `${curr.username}@gmail.com` : undefined, demoFlag || isRoleAdmin);
      setIsAdmin(hasEmailAuth);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadAll();
  }, []);

  const toggleAdminMode = (enable?: boolean) => {
    const newVal = enable !== undefined ? enable : !isAdmin;
    setIsAdmin(newVal);
    if (typeof window !== 'undefined') {
      if (newVal) {
        localStorage.setItem('tncc_admin_demo', 'true');
        communityDb.updateMemberRole(currentMember.id, 'admin');
      } else {
        localStorage.removeItem('tncc_admin_demo');
        communityDb.updateMemberRole(currentMember.id, 'member');
      }
    }
    loadAll();
    addToast({
      type: 'info',
      title: newVal ? '🛡️ Admin Access Active' : 'User Mode Restored',
      message: newVal
        ? 'Full administrator editing privileges unlocked across TNCC.'
        : 'Viewing TNCC as standard creator.',
    });
  };

  const updateProfile = (data: Partial<CommunityMember>) => {
    const updated = communityDb.updateProfile(data);
    setCurrentMember(updated);
    setAllMembers(communityDb.getMembers());
    setPosts(communityDb.getPosts());
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your creator profile details have been saved.',
    });
  };

  const createPost = (data: {
    caption: string;
    media_url?: string;
    media_type: 'image' | 'video' | 'none';
    aspect_ratio: 'square' | 'portrait' | 'landscape';
    hashtags: string[];
    category: CommunityPost['category'];
    is_showcase: boolean;
  }) => {
    const result = communityDb.createPost(data);
    setPosts(communityDb.getPosts());
    setAllMembers(communityDb.getMembers());
    const curr = communityDb.getCurrentMember();
    setCurrentMember({ ...curr });

    addToast({
      type: 'xp',
      title: `+${result.xpAwarded} XP Earned!`,
      message: 'Creative post published to TNCC statewide feed.',
    });
  };

  const toggleLike = (postId: string) => {
    try {
      const res = communityDb.toggleLike(postId);
      setPosts(communityDb.getPosts());
      if (res.xpEarned) {
        setAllMembers(communityDb.getMembers());
        addToast({
          type: 'xp',
          title: '+2 XP Earned!',
          message: 'Creator received community appreciation.',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSave = (postId: string) => {
    const saved = communityDb.toggleSave(postId);
    setPosts(communityDb.getPosts());
    addToast({
      type: 'info',
      title: saved ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      message: saved ? 'Post saved to your creative collection.' : 'Removed.',
    });
  };

  const addComment = (postId: string, text: string): PostComment => {
    const comment = communityDb.addComment(postId, text);
    setPosts(communityDb.getPosts());
    addToast({
      type: 'success',
      title: 'Comment Added',
      message: 'Your critique has been shared.',
    });
    return comment;
  };

  const getComments = (postId: string): PostComment[] => {
    return communityDb.getComments(postId);
  };

  const submitChallenge = (data: {
    challenge_id: string;
    title: string;
    description?: string;
    submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
    submission_url: string;
  }) => {
    const result = communityDb.submitChallenge(data);
    setChallenges(communityDb.getChallenges());
    setAllMembers(communityDb.getMembers());
    const curr = communityDb.getCurrentMember();
    setCurrentMember({ ...curr });

    addToast({
      type: 'xp',
      title: `+${result.xpAwarded} XP Awarded!`,
      message: 'Challenge submission entered successfully for review.',
    });
  };

  const getChallengeById = (id: string) => {
    return communityDb.getChallengeById(id);
  };

  const getPortfolioProjects = (memberId: string) => {
    return communityDb.getPortfolioProjectsForMember(memberId);
  };

  const getXPTransactions = (memberId: string) => {
    return communityDb.getXPTransactionsForMember(memberId);
  };

  const isFollowing = (memberIdOrUsername: string) => {
    return communityDb.isFollowing(memberIdOrUsername);
  };

  const toggleFollow = (memberIdOrUsername: string) => {
    const res = communityDb.toggleFollow(memberIdOrUsername);
    setAllMembers(communityDb.getMembers());
    setPosts(communityDb.getPosts());
    const curr = communityDb.getCurrentMember();
    setCurrentMember({ ...curr });

    if (res.targetMember) {
      addToast({
        type: 'info',
        title: res.isFollowing ? `Following ${res.targetMember.full_name}` : `Unfollowed ${res.targetMember.full_name}`,
        message: res.isFollowing
          ? 'You will see their latest works on your creator feed.'
          : 'You are no longer following this creator.',
      });
    }
  };

  // --- Admin Implementations ---
  const addResource = (data: Omit<CommunityResource, 'id'>) => {
    communityDb.addResource(data);
    setResources(communityDb.getResources());
    addToast({
      type: 'success',
      title: 'Resource Published',
      message: `"${data.title}" is now available in Community Resources.`,
    });
  };

  const updateResource = (id: string, data: Partial<CommunityResource>) => {
    communityDb.updateResource(id, data);
    setResources(communityDb.getResources());
    addToast({
      type: 'success',
      title: 'Resource Updated',
      message: 'Changes saved successfully.',
    });
  };

  const deleteResource = (id: string) => {
    communityDb.deleteResource(id);
    setResources(communityDb.getResources());
    addToast({
      type: 'info',
      title: 'Resource Deleted',
      message: 'Resource removed from library.',
    });
  };

  const addJob = (data: Omit<CommunityJobOffer, 'id'>) => {
    communityDb.addJob(data);
    setJobs(communityDb.getJobs());
    addToast({
      type: 'success',
      title: 'Hiring Post Live',
      message: `"${data.title}" at ${data.company_name} is published.`,
    });
  };

  const updateJob = (id: string, data: Partial<CommunityJobOffer>) => {
    communityDb.updateJob(id, data);
    setJobs(communityDb.getJobs());
    addToast({
      type: 'success',
      title: 'Job Updated',
      message: 'Job details updated.',
    });
  };

  const deleteJob = (id: string) => {
    communityDb.deleteJob(id);
    setJobs(communityDb.getJobs());
    addToast({
      type: 'info',
      title: 'Job Removed',
      message: 'Job posting deleted.',
    });
  };

  const addEvent = (data: Omit<CommunityEvent, 'id'>) => {
    communityDb.addEvent(data);
    setEvents(communityDb.getEvents());
    addToast({
      type: 'success',
      title: 'Event Scheduled',
      message: `"${data.title}" is now published.`,
    });
  };

  const updateEvent = (id: string, data: Partial<CommunityEvent>) => {
    communityDb.updateEvent(id, data);
    setEvents(communityDb.getEvents());
    addToast({
      type: 'success',
      title: 'Event Updated',
      message: 'Event details updated.',
    });
  };

  const deleteEvent = (id: string) => {
    communityDb.deleteEvent(id);
    setEvents(communityDb.getEvents());
    addToast({
      type: 'info',
      title: 'Event Cancelled',
      message: 'Event removed from schedule.',
    });
  };

  const addChallenge = (data: Omit<CommunityChallenge, 'id'>) => {
    communityDb.addChallenge(data);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'success',
      title: 'New Competition Live',
      message: `"${data.title}" is open for submissions.`,
    });
  };

  const updateChallenge = (id: string, data: Partial<CommunityChallenge>) => {
    communityDb.updateChallenge(id, data);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'success',
      title: 'Challenge Updated',
      message: 'Competition details saved.',
    });
  };

  const deleteChallenge = (id: string) => {
    communityDb.deleteChallenge(id);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'info',
      title: 'Challenge Removed',
      message: 'Competition deleted.',
    });
  };

  const pickChallengeWinner = (
    challengeId: string,
    position: 'first' | 'second' | 'third',
    submissionId: string
  ) => {
    communityDb.pickChallengeWinner(challengeId, position, submissionId);
    setChallenges(communityDb.getChallenges());
    setAllMembers(communityDb.getMembers());
    addToast({
      type: 'xp',
      title: 'Winner Declared!',
      message: `${position.toUpperCase()} place winner selected & cash bounty XP credited!`,
    });
  };

  const getAllSubmissions = () => {
    return communityDb.getAllSubmissions();
  };

  const updateMemberRole = (memberId: string, role: MemberRole) => {
    communityDb.updateMemberRole(memberId, role);
    setAllMembers(communityDb.getMembers());
    addToast({
      type: 'info',
      title: 'Role Updated',
      message: `Member status updated to ${role}.`,
    });
  };

  const deleteMember = (memberId: string) => {
    communityDb.deleteMember(memberId);
    setAllMembers(communityDb.getMembers());
    addToast({
      type: 'info',
      title: 'Member Removed',
      message: 'Creator profile removed from directory.',
    });
  };

  const awardBonusXP = (memberId: string, amount: number, reason: string) => {
    communityDb.awardXP(memberId, amount, reason);
    setAllMembers(communityDb.getMembers());
    const curr = communityDb.getCurrentMember();
    setCurrentMember({ ...curr });
    addToast({
      type: 'xp',
      title: `+${amount} XP Awarded`,
      message: reason,
    });
  };

  const getAdminReports = () => {
    return communityDb.getAdminReports();
  };

  const memberLevel = XPEngine.calculateLevel(currentMember?.total_xp || 0);

  return (
    <CommunityContext.Provider
      value={{
        currentMember,
        allMembers,
        posts,
        resources,
        challenges,
        jobs,
        events,
        toasts,
        memberLevel,
        isAdmin,
        toggleAdminMode,
        updateProfile,
        createPost,
        toggleLike,
        toggleSave,
        addComment,
        getComments,
        submitChallenge,
        getChallengeById,
        getPortfolioProjects,
        getXPTransactions,
        isFollowing,
        toggleFollow,
        dismissToast,
        refreshData: loadAll,
        // Admin
        addResource,
        updateResource,
        deleteResource,
        addJob,
        updateJob,
        deleteJob,
        addEvent,
        updateEvent,
        deleteEvent,
        addChallenge,
        updateChallenge,
        deleteChallenge,
        pickChallengeWinner,
        getAllSubmissions,
        updateMemberRole,
        deleteMember,
        awardBonusXP,
        getAdminReports,
      }}
    >
      {children}

      {/* Global Interactive Notification Toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-up transition-all ${
              toast.type === 'xp'
                ? 'bg-[#0D2C5B] text-white border-[#E84020]'
                : toast.type === 'success'
                ? 'bg-[#0D2C5B]/95 text-white border-[#00B5C8]'
                : 'bg-white text-[#0D2C5B] border-gray-200'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                toast.type === 'xp'
                  ? 'bg-[#E84020] text-white shadow-md'
                  : 'bg-[#00B5C8] text-white'
              }`}
            >
              {toast.type === 'xp' ? '⚡' : '✓'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm leading-tight">{toast.title}</h4>
              <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/60 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
