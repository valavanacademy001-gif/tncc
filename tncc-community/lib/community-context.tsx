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
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => PostComment;
  deleteComment: (postId: string, commentId: string) => void;
  getComments: (postId: string) => PostComment[];
  submitChallenge: (data: {
    challenge_id: string;
    title: string;
    description?: string;
    submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
    submission_url: string;
    is_update?: boolean;
  }) => Promise<{ success: boolean; error?: string; submission?: ChallengeSubmission }>;
  getMemberSubmission: (challengeId: string) => ChallengeSubmission | undefined;
  getChallengeById: (id: string) => CommunityChallenge | undefined;
  getPortfolioProjects: (memberId: string) => PortfolioProject[];
  getXPTransactions: (memberId: string) => XPTransaction[];
  isFollowing: (memberIdOrUsername: string) => boolean;
  toggleFollow: (memberIdOrUsername: string) => void;
  dismissToast: (id: string) => void;
  refreshData: () => void;
  // --- Authentication Methods ---
  registerMember: (data: {
    full_name: string;
    username: string;
    email: string;
    password?: string;
    location?: string;
    skills?: string[];
  }) => CommunityMember;
  loginMember: (emailOrUsername: string, password?: string) => { success: boolean; member?: CommunityMember; error?: string };
  signOutMember: () => void;
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
  reviewSubmission: (submissionId: string, status: 'approved' | 'rejected', feedback?: string) => Promise<boolean>;
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

  const fetchLivePosts = async () => {
    try {
      const curr = communityDb.getCurrentMember();
      const res = await fetch('/api/community/posts?limit=50', {
        headers: curr?.id ? { 'x-tncc-member-id': curr.id } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        }
      }
    } catch (err) {
      console.warn('Live posts fetch warning, using local state:', err);
    }
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

    // Strict Admin check: strictly suganeshsugu07@gmail.com
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('tncc_active_user_email') || curr?.email || (curr?.username ? `${curr.username}@gmail.com` : undefined);
      const isAuthorized = checkIsAdmin(activeEmail);
      setIsAdmin(isAuthorized);
    }

    // Refresh live posts from backend
    fetchLivePosts();
  };

  useEffect(() => {
    setMounted(true);
    loadAll();

    // Supabase Realtime subscription for cross-device & multi-browser sync
    let channel: any = null;
    try {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        import('@/lib/supabase/client').then(({ createClient }) => {
          const supabase = createClient();
          channel = supabase
            .channel('realtime_community_feed')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'community_posts' },
              () => {
                fetchLivePosts();
              }
            )
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'community_post_likes' },
              () => {
                fetchLivePosts();
              }
            )
            .subscribe();
        });
      }
    } catch (err) {
      console.warn('Realtime subscription not initialized:', err);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {
          // cleanup
        }
      }
    };
  }, []);

  const registerMember = (data: {
    full_name: string;
    username: string;
    email: string;
    password?: string;
    location?: string;
    skills?: string[];
  }) => {
    const newMember = communityDb.registerMember(data);
    loadAll();
    addToast({
      type: 'success',
      title: 'Welcome to TNCC!',
      message: `Account created successfully for ${newMember.full_name}`,
    });
    return newMember;
  };

  const loginMember = (emailOrUsername: string, password?: string) => {
    const res = communityDb.loginMember(emailOrUsername, password);
    if (res.success && res.member) {
      loadAll();
      addToast({
        type: 'success',
        title: res.member.role === 'admin' ? '🛡️ Admin Authenticated' : 'Welcome Back!',
        message: `Signed in as ${res.member.full_name}`,
      });
    }
    return res;
  };

  const signOutMember = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tncc_current_member_id');
      localStorage.removeItem('tncc_active_user_email');
      localStorage.removeItem('tncc_admin_demo');
      localStorage.removeItem('tncc_user');
      localStorage.removeItem('tncc_session');
    }
    loadAll();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out.',
    });
  };

  const toggleAdminMode = (enable?: boolean) => {
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem('tncc_active_user_email') || currentMember?.email;
      if (!checkIsAdmin(activeEmail)) {
        addToast({
          type: 'error',
          title: 'Access Restricted',
          message: 'Admin access is strictly restricted to suganeshsugu07@gmail.com.',
        });
        return;
      }
    }
    const newVal = enable !== undefined ? enable : !isAdmin;
    setIsAdmin(newVal);
    loadAll();
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

  const createPost = async (data: {
    caption: string;
    media_url?: string;
    media_type: 'image' | 'video' | 'none';
    aspect_ratio: 'square' | 'portrait' | 'landscape';
    hashtags: string[];
    category: CommunityPost['category'];
    is_showcase: boolean;
  }) => {
    // 1. Optimistic update
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

    // 2. Persist to live Supabase backend
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tncc-member-id': curr.id,
        },
        body: JSON.stringify({
          ...data,
          member_id: curr.id,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.post) {
          fetchLivePosts();
        }
      }
    } catch (e) {
      console.warn('Server sync error for post:', e);
    }
  };

  const deletePost = async (postId: string): Promise<void> => {
    // 1. Optimistic removal
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    communityDb.deletePost(postId);

    addToast({
      type: 'info',
      title: 'Post Removed',
      message: 'Your post was successfully deleted.',
    });

    // 2. Persist to Supabase
    try {
      const curr = communityDb.getCurrentMember();
      await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-tncc-member-id': curr.id,
        },
      });
      fetchLivePosts();
    } catch (e) {
      console.warn('Server delete error for post:', e);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const curr = communityDb.getCurrentMember();

      // 1. Optimistic toggle
      const res = communityDb.toggleLike(postId);
      setPosts(communityDb.getPosts());

      // 2. Send to live Supabase backend
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tncc-member-id': curr.id,
        },
        body: JSON.stringify({ member_id: curr.id }),
      });

      if (response.ok) {
        const serverData = await response.json();
        if (serverData.success) {
          if (serverData.xp_earned) {
            setAllMembers(communityDb.getMembers());
            addToast({
              type: 'xp',
              title: '+2 XP Earned!',
              message: 'Creator received community appreciation.',
            });
          }
          // Reconcile likes count & liked state
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, is_liked: serverData.liked, likes_count: serverData.likes_count }
                : p
            )
          );
        }
      } else if (res.xpEarned) {
        addToast({
          type: 'xp',
          title: '+2 XP Earned!',
          message: 'Creator received community appreciation.',
        });
      }
    } catch (e) {
      console.error('Like toggle error:', e);
    }
  };

  const toggleSave = async (postId: string) => {
    const curr = communityDb.getCurrentMember();

    // 1. Optimistic toggle
    const saved = communityDb.toggleSave(postId);
    setPosts(communityDb.getPosts());
    addToast({
      type: 'info',
      title: saved ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      message: saved ? 'Post saved to your creative collection.' : 'Removed.',
    });

    // 2. Persist to Supabase
    try {
      const response = await fetch(`/api/community/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tncc-member-id': curr.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? { ...p, is_saved: data.saved, saves_count: data.saves_count }
                : p
            )
          );
        }
      }
    } catch (e) {
      console.warn('Server toggleSave error:', e);
    }
  };

  const addComment = (postId: string, text: string): PostComment => {
    const curr = communityDb.getCurrentMember();

    // 1. Optimistic comment
    const comment = communityDb.addComment(postId, text);
    setPosts(communityDb.getPosts());
    addToast({
      type: 'success',
      title: 'Comment Added',
      message: 'Your critique has been shared.',
    });

    // 2. Persist to live Supabase backend
    try {
      fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tncc-member-id': curr.id,
        },
        body: JSON.stringify({
          comment_text: text,
          member_id: curr.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.comments_count !== undefined) {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId ? { ...p, comments_count: data.comments_count } : p
              )
            );
          }
        })
        .catch((e) => console.warn('Server comment sync error:', e));
    } catch (e) {
      console.warn('Comment sync error:', e);
    }

    return comment;
  };

  const deleteComment = (postId: string, commentId: string) => {
    const curr = communityDb.getCurrentMember();

    // 1. Optimistic delete
    communityDb.deleteComment(postId, commentId);
    setPosts(communityDb.getPosts());
    addToast({
      type: 'info',
      title: 'Comment Deleted',
      message: 'Your comment has been removed.',
    });

    // 2. Persist to Supabase
    try {
      fetch(`/api/community/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'x-tncc-member-id': curr.id,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.comments_count !== undefined) {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId ? { ...p, comments_count: data.comments_count } : p
              )
            );
          }
        })
        .catch((e) => console.warn('Server deleteComment sync error:', e));
    } catch (e) {
      console.warn('Delete comment error:', e);
    }
  };

  const getComments = (postId: string): PostComment[] => {
    return communityDb.getComments(postId);
  };

  const submitChallenge = async (data: {
    challenge_id: string;
    title: string;
    description?: string;
    submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
    submission_url: string;
    is_update?: boolean;
  }): Promise<{ success: boolean; error?: string; submission?: ChallengeSubmission }> => {
    // 1. Live Backend Submission via API
    try {
      const res = await fetch('/api/community/challenges/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tncc-user-email': currentMember?.email || 'test001@gmail.com',
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        addToast({
          type: 'info',
          title: res.status === 409 ? 'Duplicate Submission' : 'Submission Blocked',
          message: resData.error || 'Challenge submission was not accepted.',
        });
        return { success: false, error: resData.error };
      }

      // 2. Synchronize client local state upon backend confirmation
      const result = communityDb.submitChallenge(data);
      setChallenges([...communityDb.getChallenges()]);
      setAllMembers([...communityDb.getMembers()]);
      const curr = communityDb.getCurrentMember();
      setCurrentMember({ ...curr });

      addToast({
        type: data.is_update ? 'success' : 'xp',
        title: data.is_update ? 'Entry Updated' : `+${result.xpAwarded} XP Awarded!`,
        message: data.is_update
          ? 'Your challenge submission has been successfully updated.'
          : 'Challenge submission entered successfully for review.',
      });

      return { success: true, submission: result.submission };
    } catch (err: any) {
      // Local fallback with duplicate and deadline verification
      try {
        const result = communityDb.submitChallenge(data);
        setChallenges([...communityDb.getChallenges()]);
        setAllMembers([...communityDb.getMembers()]);
        const curr = communityDb.getCurrentMember();
        setCurrentMember({ ...curr });

        addToast({
          type: data.is_update ? 'success' : 'xp',
          title: data.is_update ? 'Entry Updated' : `+${result.xpAwarded} XP Awarded!`,
          message: data.is_update
            ? 'Your challenge submission has been successfully updated.'
            : 'Challenge submission entered successfully for review.',
        });

        return { success: true, submission: result.submission };
      } catch (localErr: any) {
        addToast({
          type: 'info',
          title: 'Submission Blocked',
          message: localErr.message || 'Unable to submit entry.',
        });
        return { success: false, error: localErr.message };
      }
    }
  };

  const getMemberSubmission = (challengeId: string) => {
    if (!currentMember) return undefined;
    return communityDb.getSubmissionForMember(challengeId, currentMember.id);
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
  const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    'x-tncc-admin-role': 'admin',
    'x-tncc-user-email': currentMember?.email || 'suganeshsugu07@gmail.com',
  });

  const addResource = async (data: Omit<CommunityResource, 'id'>) => {
    try {
      await fetch('/api/community/admin/resources', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Backend sync warning for addResource:', e);
    }
    communityDb.addResource(data);
    setResources(communityDb.getResources());
    addToast({
      type: 'success',
      title: 'Resource Published',
      message: `"${data.title}" is now available in Community Resources.`,
    });
  };

  const updateResource = async (id: string, data: Partial<CommunityResource>) => {
    try {
      await fetch('/api/community/admin/resources', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, ...data }),
      });
    } catch (e) {
      console.warn('Backend sync warning for updateResource:', e);
    }
    communityDb.updateResource(id, data);
    setResources(communityDb.getResources());
    addToast({
      type: 'success',
      title: 'Resource Updated',
      message: 'Changes saved successfully.',
    });
  };

  const deleteResource = async (id: string) => {
    try {
      await fetch(`/api/community/admin/resources?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
    } catch (e) {
      console.warn('Backend sync warning for deleteResource:', e);
    }
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

  const addChallenge = async (data: Omit<CommunityChallenge, 'id'>) => {
    try {
      await fetch('/api/community/admin/challenges', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Backend sync warning for addChallenge:', e);
    }
    communityDb.addChallenge(data);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'success',
      title: 'New Competition Live',
      message: `"${data.title}" is open for submissions.`,
    });
  };

  const updateChallenge = async (id: string, data: Partial<CommunityChallenge>) => {
    try {
      await fetch('/api/community/admin/challenges', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, ...data }),
      });
    } catch (e) {
      console.warn('Backend sync warning for updateChallenge:', e);
    }
    communityDb.updateChallenge(id, data);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'success',
      title: 'Challenge Updated',
      message: 'Competition details saved.',
    });
  };

  const deleteChallenge = async (id: string) => {
    try {
      await fetch(`/api/community/admin/challenges?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
    } catch (e) {
      console.warn('Backend sync warning for deleteChallenge:', e);
    }
    communityDb.deleteChallenge(id);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: 'info',
      title: 'Challenge Removed',
      message: 'Competition deleted.',
    });
  };

  const pickChallengeWinner = async (
    challengeId: string,
    position: 'first' | 'second' | 'third',
    submissionId: string
  ) => {
    const sub = communityDb.getAllSubmissions().find((s) => s.id === submissionId);
    const chal = communityDb.getChallengeById(challengeId);
    const bonusXp = position === 'first' 
      ? (chal?.bonus_xp_first || 200) 
      : position === 'second' 
      ? (chal?.bonus_xp_second || 100) 
      : (chal?.bonus_xp_third || 50);

    try {
      if (sub) {
        await fetch('/api/community/admin/winners', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify({
            challenge_id: challengeId,
            position,
            submission_id: submissionId,
            member_id: sub.member_id,
            bonus_xp: bonusXp,
          }),
        });
      }
    } catch (e) {
      console.warn('Backend sync warning for pickChallengeWinner:', e);
    }
    communityDb.pickChallengeWinner(challengeId, position, submissionId);
    setChallenges(communityDb.getChallenges());
    setAllMembers(communityDb.getMembers());
    addToast({
      type: 'xp',
      title: 'Winner Declared!',
      message: `${position.toUpperCase()} place winner selected & cash bounty XP credited!`,
    });
  };

  const reviewSubmission = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    feedback?: string
  ): Promise<boolean> => {
    try {
      await fetch('/api/community/admin/submissions', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          submission_id: submissionId,
          status,
          admin_feedback: feedback,
        }),
      });
    } catch (e) {
      console.warn('Backend sync warning for reviewSubmission:', e);
    }
    communityDb.reviewSubmission(submissionId, status, feedback);
    setChallenges(communityDb.getChallenges());
    addToast({
      type: status === 'approved' ? 'success' : 'info',
      title: status === 'approved' ? 'Submission Approved' : 'Submission Rejected',
      message: `Submission status set to ${status}.`,
    });
    return true;
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

  const awardBonusXP = async (memberId: string, amount: number, reason: string) => {
    try {
      await fetch('/api/community/admin/xp', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          member_id: memberId,
          amount,
          reason,
        }),
      });
    } catch (e) {
      console.warn('Backend sync warning for awardBonusXP:', e);
    }
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
        deletePost,
        toggleLike,
        toggleSave,
        addComment,
        deleteComment,
        getComments,
        submitChallenge,
        getMemberSubmission,
        getChallengeById,
        getPortfolioProjects,
        getXPTransactions,
        isFollowing,
        toggleFollow,
        dismissToast,
        refreshData: loadAll,
        // Auth
        registerMember,
        loginMember,
        signOutMember,
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
        reviewSubmission,
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
