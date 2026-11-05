import { INITIAL_CHALLENGES } from '@/tncc-community/lib/community-db';
import { ChallengeSubmission, CommunityChallenge } from '@/tncc-community/lib/types';

// Global server memory store to maintain state across API routes when Supabase schema migrations are pending
declare global {
  var __tncc_server_submissions: ChallengeSubmission[] | undefined;
  var __tncc_server_challenges: CommunityChallenge[] | undefined;
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

// In-flight mutex set to prevent simultaneous concurrent duplicate submissions
declare global {
  var __tncc_inflight_submissions: Set<string> | undefined;
}

if (!global.__tncc_inflight_submissions) {
  global.__tncc_inflight_submissions = new Set<string>();
}

export const serverStore = {
  acquireSubmissionLock(challengeId: string, memberId: string): boolean {
    const key = `${challengeId}:${memberId}`;
    if (!global.__tncc_inflight_submissions) {
      global.__tncc_inflight_submissions = new Set<string>();
    }
    if (global.__tncc_inflight_submissions.has(key)) {
      return false; // Lock acquisition failed (concurrent request in progress)
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

  getChallenge(id: string): CommunityChallenge | undefined {
    return (global.__tncc_server_challenges || []).find((c) => c.id === id);
  },

  getAllChallenges(): CommunityChallenge[] {
    return global.__tncc_server_challenges || [];
  },
};
