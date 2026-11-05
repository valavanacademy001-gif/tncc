import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import LeaderboardView from '@/tncc-community/components/leaderboard/LeaderboardView';

export const metadata = {
  title: 'Community Leaderboard — Tamil Nadu Creators Club',
  description: 'Live verified creative XP rankings for Tamil Nadu creators.',
};

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  let initialMembers: any[] = [];
  try {
    const supabase = await createClient();
    const { data: rpcLeaderboard, error: rpcError } = await supabase.rpc(
      'get_verified_community_leaderboard',
      { p_limit: 50 }
    );

    if (!rpcError && rpcLeaderboard && rpcLeaderboard.length > 0) {
      initialMembers = rpcLeaderboard;
    } else {
      const { data: dbMembers } = await supabase
        .from('community_members')
        .select('id, member_id, username, full_name, avatar_url, location, skills, total_xp, wins_count')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (dbMembers && dbMembers.length > 0) {
        initialMembers = dbMembers;
      }
    }
  } catch {
    // fallback
  }

  if (initialMembers.length === 0) {
    initialMembers = serverStore.getVerifiedLeaderboard(50);
  }

  return <LeaderboardView initialMembers={initialMembers} />;
}
