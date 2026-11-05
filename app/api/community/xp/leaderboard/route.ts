import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);
    const supabase = await createClient();

    // 1. Try Supabase RPC
    const { data: rpcLeaderboard, error: rpcError } = await supabase.rpc(
      'get_verified_community_leaderboard',
      { p_limit: limit }
    );

    if (!rpcError && rpcLeaderboard && rpcLeaderboard.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'supabase_rpc',
        count: rpcLeaderboard.length,
        members: rpcLeaderboard,
      });
    }

    // 2. Try Supabase direct query
    const { data: dbMembers, error: dbError } = await supabase
      .from('community_members')
      .select('id, member_id, username, full_name, avatar_url, location, skills, total_xp, wins_count')
      .order('total_xp', { ascending: false })
      .limit(limit);

    if (!dbError && dbMembers && dbMembers.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'supabase_table',
        count: dbMembers.length,
        members: dbMembers,
      });
    }

    // 3. Resilient serverStore fallback
    const members = serverStore.getVerifiedLeaderboard(limit);

    return NextResponse.json({
      success: true,
      source: 'server_store',
      count: members.length,
      members,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
