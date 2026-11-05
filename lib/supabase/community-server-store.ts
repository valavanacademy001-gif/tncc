import { INITIAL_CHALLENGES, INITIAL_MEMBERS, INITIAL_POSTS } from '@/tncc-community/lib/community-db';
import { ChallengeSubmission, CommunityChallenge, CommunityMember, CommunityPost, PostComment, XPTransaction, ReferralRecord, MemberReferralSummary } from '@/tncc-community/lib/types';

// Global server memory store to maintain state across API routes when Supabase schema migrations are pending
declare global {
  var __tncc_server_submissions: ChallengeSubmission[] | undefined;
  var __tncc_server_challenges: CommunityChallenge[] | undefined;
  var __tncc_server_members: CommunityMember[] | undefined;
  var __tncc_server_posts: CommunityPost[] | undefined;
  var __tncc_server_comments: PostComment[] | undefined;
  var __tncc_server_saved_posts: Record<string, string[]> | undefined; // memberId -> postId[]
  var __tncc_server_referral_codes: Record<string, string> | undefined; // memberId -> code
  var __tncc_server_referrals: ReferralRecord[] | undefined;
  var __tncc_server_xp_transactions: XPTransaction[] | undefined;
  var __tncc_server_like_awards: Set<string> | undefined;
  var __tncc_server_post_likes: Record<string, string[]> | undefined;
  var __tncc_inflight_submissions: Set<string> | undefined;
  var __tncc_inflight_xp: Set<string> | undefined;
}

if (!global.__tncc_server_submissions) {
  global.__tncc_server_submissions = [
    {
      id: 'sub-1',
      challenge_id: 'chal-1',
      member_id: 'mem-2',
      author: {
        username: 'anand_editor',
        full_name: 'Anand Kumar',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
      title: 'Thirukkural Typography & Kinetic Poster',
      description: 'Handcrafted Tamil glyphs infused with contemporary neon gradients.',
      submission_type: 'image',
      submission_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      preview_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      status: 'pending',
      admin_feedback: '',
      submitted_at: '2026-11-01T10:00:00Z',
    },
    {
      id: 'sub-2',
      challenge_id: 'chal-1',
      member_id: 'mem-3',
      author: {
        username: 'kavitha_motion',
        full_name: 'Kavitha S.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      title: 'Madurai Meenakshi Minimalist 3D Vector',
      description: 'Temple architecture recreated in isometric vector style.',
      submission_type: 'portfolio',
      submission_url: 'https://behance.net/gallery/demo-tamil-temple',
      preview_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      status: 'pending',
      admin_feedback: '',
      submitted_at: '2026-11-02T12:00:00Z',
    },
  ];
}

if (!global.__tncc_server_challenges) {
  global.__tncc_server_challenges = [...INITIAL_CHALLENGES];
}

if (!global.__tncc_server_members) {
  global.__tncc_server_members = JSON.parse(JSON.stringify(INITIAL_MEMBERS));
}

if (!global.__tncc_server_posts) {
  global.__tncc_server_posts = JSON.parse(JSON.stringify(INITIAL_POSTS));
}

// Seed historical verified XP transactions
if (!global.__tncc_server_xp_transactions) {
  global.__tncc_server_xp_transactions = [
    {
      id: 'xp-init-1',
      member_id: 'mem-current',
      amount: 50,
      reason: 'Welcome Onboarding Bonus',
      reference_id: 'init_welcome_current',
      created_at: '2026-03-01T10:00:00Z',
    },
    {
      id: 'xp-init-2',
      member_id: 'mem-current',
      amount: 10,
      reason: 'Published Community Post',
      reference_id: 'post_post-3',
      created_at: '2026-03-05T12:00:00Z',
    },
    {
      id: 'xp-init-3',
      member_id: 'mem-current',
      amount: 15,
      reason: 'Challenge Participation',
      reference_id: 'challenge_part_chal-2',
      created_at: '2026-03-10T15:30:00Z',
    },
    {
      id: 'xp-init-4',
      member_id: 'mem-current',
      amount: 60,
      reason: 'Challenge Winner (SECOND Place): Minimalist Coffee Brand Identity Challenge',
      reference_id: 'chal-2',
      created_at: '2026-03-15T18:00:00Z',
    },
    {
      id: 'xp-init-5',
      member_id: 'mem-admin-suganesh',
      amount: 1500,
      reason: 'Administrator Founder & Platform Launch Merit XP',
      reference_id: 'init_founder_suganesh',
      created_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 'xp-init-6',
      member_id: 'mem-1',
      amount: 840,
      reason: 'Verified Creative Community Contributions & Showcase Works',
      reference_id: 'init_karthik_history',
      created_at: '2026-02-01T00:00:00Z',
    },
    {
      id: 'xp-init-7',
      member_id: 'mem-2',
      amount: 620,
      reason: 'Verified Community Typography & Motion Submissions',
      reference_id: 'init_anand_history',
      created_at: '2026-02-15T00:00:00Z',
    },
    {
      id: 'xp-init-8',
      member_id: 'mem-3',
      amount: 490,
      reason: 'Verified 3D Vector & Digital Illustration Awards',
      reference_id: 'init_kavitha_history',
      created_at: '2026-02-20T00:00:00Z',
    },
  ];
}

if (!global.__tncc_server_like_awards) {
  global.__tncc_server_like_awards = new Set<string>();
}

if (!global.__tncc_server_post_likes) {
  global.__tncc_server_post_likes = {};
}

if (!global.__tncc_inflight_submissions) {
  global.__tncc_inflight_submissions = new Set<string>();
}

if (!global.__tncc_inflight_xp) {
  global.__tncc_inflight_xp = new Set<string>();
}

export const serverStore = {
  // --- Mutex Locking ---
  acquireSubmissionLock(challengeId: string, memberId: string): boolean {
    const key = `${challengeId}:${memberId}`;
    if (!global.__tncc_inflight_submissions) {
      global.__tncc_inflight_submissions = new Set<string>();
    }
    if (global.__tncc_inflight_submissions.has(key)) {
      return false;
    }
    global.__tncc_inflight_submissions.add(key);
    return true;
  },

  releaseSubmissionLock(challengeId: string, memberId: string): void {
    const key = `${challengeId}:${memberId}`;
    if (global.__tncc_inflight_submissions) {
      global.__tncc_inflight_submissions.delete(key);
    }
  },

  acquireXPLock(memberId: string, actionKey: string): boolean {
    const key = `${memberId}:${actionKey}`;
    if (!global.__tncc_inflight_xp) {
      global.__tncc_inflight_xp = new Set<string>();
    }
    if (global.__tncc_inflight_xp.has(key)) {
      return false;
    }
    global.__tncc_inflight_xp.add(key);
    return true;
  },

  releaseXPLock(memberId: string, actionKey: string): void {
    const key = `${memberId}:${actionKey}`;
    if (global.__tncc_inflight_xp) {
      global.__tncc_inflight_xp.delete(key);
    }
  },

  // --- Submissions ---
  getSubmissions(): ChallengeSubmission[] {
    return global.__tncc_server_submissions || [];
  },

  getSubmissionById(id: string): ChallengeSubmission | undefined {
    return (global.__tncc_server_submissions || []).find((s) => s.id === id);
  },

  findSubmission(challengeId: string, memberId: string): ChallengeSubmission | undefined {
    return (global.__tncc_server_submissions || []).find(
      (s) => s.challenge_id === challengeId && s.member_id === memberId
    );
  },

  addSubmission(sub: ChallengeSubmission): void {
    if (!global.__tncc_server_submissions) global.__tncc_server_submissions = [];
    global.__tncc_server_submissions = [sub, ...global.__tncc_server_submissions];
  },

  updateSubmission(id: string, updates: Partial<ChallengeSubmission>): ChallengeSubmission | null {
    if (!global.__tncc_server_submissions) return null;
    const idx = global.__tncc_server_submissions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const updated = { ...global.__tncc_server_submissions[idx], ...updates };
    global.__tncc_server_submissions[idx] = updated;
    return updated;
  },

  // --- Challenges ---
  getChallenge(id: string): CommunityChallenge | undefined {
    return (global.__tncc_server_challenges || []).find((c) => c.id === id);
  },

  getAllChallenges(): CommunityChallenge[] {
    return global.__tncc_server_challenges || [];
  },

  // --- Members ---
  getMembers(): CommunityMember[] {
    return global.__tncc_server_members || [];
  },

  getMemberById(id: string): CommunityMember | undefined {
    return (global.__tncc_server_members || []).find((m) => m.id === id || m.member_id === id);
  },

  getMemberByEmail(email: string): CommunityMember | undefined {
    const lower = email.toLowerCase().trim();
    return (global.__tncc_server_members || []).find(
      (m) => m.email && m.email.toLowerCase().trim() === lower
    );
  },

  updateMember(id: string, updates: Partial<CommunityMember>): CommunityMember | null {
    if (!global.__tncc_server_members) return null;
    const idx = global.__tncc_server_members.findIndex((m) => m.id === id || m.member_id === id);
    if (idx === -1) return null;
    const updated = { ...global.__tncc_server_members[idx], ...updates };
    global.__tncc_server_members[idx] = updated;
    return updated;
  },

  // --- Posts ---
  getPosts(): CommunityPost[] {
    return global.__tncc_server_posts || [];
  },

  getPostById(id: string): CommunityPost | undefined {
    return (global.__tncc_server_posts || []).find((p) => p.id === id);
  },

  addPost(post: CommunityPost): CommunityPost {
    if (!global.__tncc_server_posts) global.__tncc_server_posts = [];
    global.__tncc_server_posts = [post, ...global.__tncc_server_posts];
    return post;
  },

  updatePost(id: string, updates: Partial<CommunityPost>): CommunityPost | null {
    if (!global.__tncc_server_posts) return null;
    const idx = global.__tncc_server_posts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...global.__tncc_server_posts[idx], ...updates };
    global.__tncc_server_posts[idx] = updated;
    return updated;
  },

  deletePost(id: string, requesterMemberId: string, isAdmin: boolean = false): { success: boolean; message?: string } {
    if (!global.__tncc_server_posts) return { success: false, message: 'Post not found' };
    const post = this.getPostById(id);
    if (!post) return { success: false, message: 'Post not found' };

    if (post.member_id !== requesterMemberId && !isAdmin) {
      return { success: false, message: 'Unauthorized: You can only delete your own posts' };
    }

    global.__tncc_server_posts = global.__tncc_server_posts.filter((p) => p.id !== id);

    // Also remove comments and likes for this post
    if (global.__tncc_server_comments) {
      global.__tncc_server_comments = global.__tncc_server_comments.filter((c) => c.post_id !== id);
    }
    if (global.__tncc_server_post_likes) {
      delete global.__tncc_server_post_likes[id];
    }

    // Decrement author's posts_count
    const author = this.getMemberById(post.member_id);
    if (author) {
      this.updateMember(author.id, {
        posts_count: Math.max(0, (author.posts_count || 1) - 1),
      });
    }

    return { success: true, message: 'Post deleted' };
  },

  // --- Comments ---
  getComments(postId: string): PostComment[] {
    return (global.__tncc_server_comments || []).filter((c) => c.post_id === postId);
  },

  addComment(
    postId: string,
    memberId: string,
    text: string
  ): { success: boolean; comment?: PostComment; message?: string } {
    const post = this.getPostById(postId);
    if (!post) return { success: false, message: 'Post not found' };

    const member = this.getMemberById(memberId) || this.getMembers()[0];
    const newComment: PostComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      post_id: postId,
      member_id: member.id,
      author: {
        username: member.username,
        full_name: member.full_name,
        avatar_url: member.avatar_url,
      },
      comment_text: text.trim(),
      created_at: new Date().toISOString(),
    };

    if (!global.__tncc_server_comments) global.__tncc_server_comments = [];
    global.__tncc_server_comments.push(newComment);

    // Increment comments_count on post
    this.updatePost(postId, {
      comments_count: (post.comments_count || 0) + 1,
    });

    return { success: true, comment: newComment };
  },

  deleteComment(
    commentId: string,
    requesterMemberId: string,
    isAdmin: boolean = false
  ): { success: boolean; message?: string } {
    if (!global.__tncc_server_comments) return { success: false, message: 'Comment not found' };
    const comment = global.__tncc_server_comments.find((c) => c.id === commentId);
    if (!comment) return { success: false, message: 'Comment not found' };

    if (comment.member_id !== requesterMemberId && !isAdmin) {
      return { success: false, message: 'Unauthorized: You can only delete your own comments' };
    }

    global.__tncc_server_comments = global.__tncc_server_comments.filter((c) => c.id !== commentId);

    // Decrement comments_count on post
    const post = this.getPostById(comment.post_id);
    if (post) {
      this.updatePost(comment.post_id, {
        comments_count: Math.max(0, (post.comments_count || 1) - 1),
      });
    }

    return { success: true, message: 'Comment deleted' };
  },

  // --- Bookmarks / Saved Posts ---
  toggleSave(
    postId: string,
    memberId: string
  ): { success: boolean; saved: boolean; savesCount: number; message?: string } {
    const post = this.getPostById(postId);
    if (!post) return { success: false, saved: false, savesCount: 0, message: 'Post not found' };

    if (!global.__tncc_server_saved_posts) {
      global.__tncc_server_saved_posts = {};
    }

    const savedList = global.__tncc_server_saved_posts[memberId] || [];
    const isSaved = savedList.includes(postId);

    if (isSaved) {
      global.__tncc_server_saved_posts[memberId] = savedList.filter((id) => id !== postId);
      const newCount = Math.max(0, (post.saves_count || 1) - 1);
      this.updatePost(postId, { saves_count: newCount, is_saved: false });
      return { success: true, saved: false, savesCount: newCount, message: 'Post removed from bookmarks' };
    } else {
      global.__tncc_server_saved_posts[memberId] = [...savedList, postId];
      const newCount = (post.saves_count || 0) + 1;
      this.updatePost(postId, { saves_count: newCount, is_saved: true });
      return { success: true, saved: true, savesCount: newCount, message: 'Post saved to bookmarks' };
    }
  },

  getSavedPostIds(memberId: string): string[] {
    return (global.__tncc_server_saved_posts && global.__tncc_server_saved_posts[memberId]) || [];
  },

  // --- XP Ledger Operations ---
  getXPTransactionsForMember(memberId: string): XPTransaction[] {
    return (global.__tncc_server_xp_transactions || [])
      .filter((tx) => tx.member_id === memberId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getAllXPTransactions(): XPTransaction[] {
    return (global.__tncc_server_xp_transactions || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  /**
   * Atomic Server-Side XP Award with Duplicate & Farm Protection
   */
  awardXP(
    memberId: string,
    amount: number,
    reason: string,
    referenceId?: string,
    transactionType: string = 'xp_reward'
  ): { success: boolean; duplicate: boolean; message?: string; transaction?: XPTransaction; newTotalXP?: number } {
    if (amount <= 0 || amount > 1000) {
      return { success: false, duplicate: false, message: 'XP amount must be between 1 and 1000' };
    }

    const member = this.getMemberById(memberId);
    if (!member) {
      return { success: false, duplicate: false, message: `Member ${memberId} not found` };
    }

    // Check duplicate transaction: (member_id, reason, reference_id)
    if (!global.__tncc_server_xp_transactions) {
      global.__tncc_server_xp_transactions = [];
    }

    const isDuplicate = global.__tncc_server_xp_transactions.some(
      (tx) =>
        tx.member_id === memberId &&
        tx.reason === reason &&
        (referenceId ? tx.reference_id === referenceId : true)
    );

    if (isDuplicate) {
      return {
        success: false,
        duplicate: true,
        message: 'Duplicate XP transaction prevented by idempotency constraint',
        newTotalXP: member.total_xp,
      };
    }

    // Insert transaction
    const newTx: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      member_id: memberId,
      amount,
      reason,
      reference_id: referenceId,
      created_at: new Date().toISOString(),
    };

    global.__tncc_server_xp_transactions = [newTx, ...global.__tncc_server_xp_transactions];

    // Atomically increment member balance
    const newTotalXP = (member.total_xp || 0) + amount;
    this.updateMember(member.id, { total_xp: newTotalXP });

    return {
      success: true,
      duplicate: false,
      transaction: newTx,
      newTotalXP,
    };
  },

  /**
   * Like / Unlike with Anti-Farming XP Verification
   */
  toggleLike(
    postId: string,
    likerMemberId: string
  ): { success: boolean; liked: boolean; likesCount: number; xpEarned: boolean; message?: string } {
    const post = this.getPostById(postId);
    if (!post) {
      return { success: false, liked: false, likesCount: 0, xpEarned: false, message: 'Post not found' };
    }

    if (!global.__tncc_server_post_likes) {
      global.__tncc_server_post_likes = {};
    }
    if (!global.__tncc_server_like_awards) {
      global.__tncc_server_like_awards = new Set<string>();
    }

    const likers = global.__tncc_server_post_likes[postId] || [];
    const isCurrentlyLiked = likers.includes(likerMemberId);

    if (isCurrentlyLiked) {
      // UNLIKE
      global.__tncc_server_post_likes[postId] = likers.filter((id) => id !== likerMemberId);
      const newCount = Math.max(0, (post.likes_count || 1) - 1);
      this.updatePost(postId, { likes_count: newCount, is_liked: false });
      return {
        success: true,
        liked: false,
        likesCount: newCount,
        xpEarned: false,
        message: 'Post unliked',
      };
    } else {
      // LIKE
      global.__tncc_server_post_likes[postId] = [...likers, likerMemberId];
      const newCount = (post.likes_count || 0) + 1;
      this.updatePost(postId, { likes_count: newCount, is_liked: true });

      // ANTI-FARMING RULE 1: Self-likes do not award XP
      if (post.member_id === likerMemberId) {
        return {
          success: true,
          liked: true,
          likesCount: newCount,
          xpEarned: false,
          message: 'Self-like appreciated but does not award XP (anti-farming)',
        };
      }

      // ANTI-FARMING RULE 2: Liking and unliking does not repeatedly award XP
      const awardKey = `${postId}:${likerMemberId}`;
      if (global.__tncc_server_like_awards.has(awardKey)) {
        return {
          success: true,
          liked: true,
          likesCount: newCount,
          xpEarned: false,
          message: 'Like recorded (XP already awarded previously for this interaction)',
        };
      }

      // Award +2 XP to the author of the post
      const ref = `like_${postId}_${likerMemberId}`;
      const awardResult = this.awardXP(
        post.member_id,
        2,
        'Received Like on Post',
        ref,
        'like_received'
      );

      if (awardResult.success) {
        global.__tncc_server_like_awards.add(awardKey);
        return {
          success: true,
          liked: true,
          likesCount: newCount,
          xpEarned: true,
          message: '+2 XP awarded to creator for community appreciation',
        };
      }

      return {
        success: true,
        liked: true,
        likesCount: newCount,
        xpEarned: false,
      };
    }
  },

  // --- Leaderboard ---
  getVerifiedLeaderboard(limit: number = 50): CommunityMember[] {
    const members = [...this.getMembers()];
    return members.sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0)).slice(0, limit);
  },

  // --- Referral & Earn System (Part B) ---
  getOrCreateReferralCode(memberId: string): string {
    if (!global.__tncc_server_referral_codes) {
      global.__tncc_server_referral_codes = {};
    }

    if (global.__tncc_server_referral_codes[memberId]) {
      return global.__tncc_server_referral_codes[memberId];
    }

    const member = this.getMemberById(memberId);
    const cleanUsername = member
      ? member.username.toUpperCase().replace(/[^A-Z0-9]/g, '')
      : 'CREATOR';
    const code = `TNCC-${cleanUsername}`;

    // Guarantee uniqueness
    let finalCode = code;
    const existing = Object.values(global.__tncc_server_referral_codes);
    if (existing.includes(finalCode)) {
      finalCode = `${code}${Math.floor(1000 + Math.random() * 9000)}`;
    }

    global.__tncc_server_referral_codes[memberId] = finalCode;
    return finalCode;
  },

  registerReferralSignup(
    referredMemberId: string,
    referralCode: string
  ): { success: boolean; message: string; referrerId?: string } {
    if (!global.__tncc_server_referrals) {
      global.__tncc_server_referrals = [];
    }
    if (!global.__tncc_server_referral_codes) {
      global.__tncc_server_referral_codes = {};
    }

    const cleanCode = referralCode.trim().toUpperCase();

    // 1. Find referrer by code
    let referrerId: string | undefined;
    for (const [mId, c] of Object.entries(global.__tncc_server_referral_codes)) {
      if (c === cleanCode) {
        referrerId = mId;
        break;
      }
    }

    // Check seed members
    if (!referrerId) {
      const match = this.getMembers().find(
        (m) =>
          cleanCode === `TNCC-${m.username.toUpperCase().replace(/[^A-Z0-9]/g, '')}` ||
          cleanCode === `TNCC-${m.username.toUpperCase()}`
      );
      if (match) {
        referrerId = match.id;
        global.__tncc_server_referral_codes[match.id] = cleanCode;
      }
    }

    if (!referrerId) {
      return { success: false, message: 'Invalid referral code' };
    }

    // 2. Prevent self-referral
    if (referrerId === referredMemberId) {
      return { success: false, message: 'Self-referral is prohibited' };
    }

    // 3. Prevent duplicate referral attribution (one referrer per account)
    const existing = global.__tncc_server_referrals.find((r) => r.referred_member_id === referredMemberId);
    if (existing) {
      return { success: false, message: 'Member is already attributed to a referrer' };
    }

    // 4. Record referral as pending_activity (ZERO XP AT SIGNUP)
    const referredMember = this.getMemberById(referredMemberId);
    const newRef: ReferralRecord = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      referrer_member_id: referrerId,
      referred_member_id: referredMemberId,
      referred_member_name: referredMember?.full_name || 'New Member',
      referral_code: cleanCode,
      status: 'pending_activity',
      reward_xp: 50,
      created_at: new Date().toISOString(),
    };

    global.__tncc_server_referrals.push(newRef);
    return {
      success: true,
      message: 'Referral attribution successfully recorded as pending_activity',
      referrerId,
    };
  },

  evaluateAndRewardReferral(
    referredMemberId: string,
    activityType: 'post' | 'challenge',
    activityId: string
  ): { rewarded: boolean; reward_xp?: number; referrerId?: string; message?: string } {
    if (!global.__tncc_server_referrals) {
      return { rewarded: false, message: 'No referrals recorded' };
    }

    const ref = global.__tncc_server_referrals.find(
      (r) => r.referred_member_id === referredMemberId && r.status === 'pending_activity'
    );

    if (!ref) {
      return { rewarded: false, message: 'No pending referral eligible for reward' };
    }

    // Award +50 XP to REFERRER only
    const txRef = `referral_bonus_${ref.id}`;
    const xpResult = this.awardXP(
      ref.referrer_member_id,
      50,
      'Referral Bonus: Member Completed First Creative Activity',
      txRef,
      'referral_bonus'
    );

    if (!xpResult.success && !xpResult.duplicate) {
      return { rewarded: false, message: 'Failed to record XP transaction' };
    }

    // Update referral record to rewarded
    ref.status = 'rewarded';
    ref.qualifying_activity_type = activityType;
    ref.qualifying_activity_id = activityId;
    ref.rewarded_transaction_id = txRef;
    ref.rewarded_at = new Date().toISOString();

    return {
      rewarded: true,
      reward_xp: 50,
      referrerId: ref.referrer_member_id,
      message: '+50 XP awarded to referrer for qualifying creative activity',
    };
  },

  getMemberReferralSummary(memberId: string): MemberReferralSummary {
    const code = this.getOrCreateReferralCode(memberId);
    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://tncc.vercel.app';
    const shareUrl = `${domain}/join?ref=${code}`;

    const referrals = (global.__tncc_server_referrals || []).filter(
      (r) => r.referrer_member_id === memberId
    );

    const pendingCount = referrals.filter((r) => r.status === 'pending_activity').length;
    const successfulCount = referrals.filter((r) => r.status === 'rewarded').length;
    const totalXP = successfulCount * 50;

    return {
      referral_code: code,
      share_url: shareUrl,
      total_invited: referrals.length,
      pending_count: pendingCount,
      successful_count: successfulCount,
      total_referral_xp: totalXP,
      history: referrals,
    };
  },

  getAllReferrals(): ReferralRecord[] {
    return global.__tncc_server_referrals || [];
  },

  rejectReferral(referralId: string, reason: string): { success: boolean; message?: string } {
    if (!global.__tncc_server_referrals) {
      return { success: false, message: 'No referrals found' };
    }
    const ref = global.__tncc_server_referrals.find((r) => r.id === referralId);
    if (!ref) {
      return { success: false, message: 'Referral not found' };
    }

    ref.status = 'rejected';
    ref.rejection_reason = reason;
    return { success: true, message: 'Referral marked as rejected' };
  },
};
