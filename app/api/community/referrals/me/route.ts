import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let activeMemberId = request.headers.get('x-tncc-member-id') || 'mem-test001';
    let memberUsername = 'creator';

    if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('id, username')
        .eq('user_id', user.id)
        .single();
      if (mem) {
        activeMemberId = mem.id;
        memberUsername = mem.username;
      }
    } else {
      const mem = serverStore.getMemberById(activeMemberId);
      if (mem) {
        memberUsername = mem.username;
      }
    }

    // 1. Try Supabase get_or_create_referral_code RPC
    let referralCode: string | null = null;
    const { data: rpcCode, error: rpcError } = await supabase.rpc('get_or_create_referral_code', {
      p_member_id: activeMemberId,
    });

    if (!rpcError && rpcCode) {
      referralCode = rpcCode;
    } else {
      referralCode = serverStore.getOrCreateReferralCode(activeMemberId);
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://tncc.vercel.app';
    const shareUrl = `${domain}/join?ref=${referralCode}`;

    // 2. Fetch referral records from Supabase
    const { data: dbReferrals, error: dbError } = await supabase
      .from('community_referrals')
      .select(`
        id,
        referrer_member_id,
        referred_member_id,
        referral_code,
        status,
        qualifying_activity_type,
        qualifying_activity_id,
        reward_xp,
        rewarded_transaction_id,
        rejection_reason,
        created_at,
        rewarded_at,
        community_members!community_referrals_referred_member_id_fkey (
          full_name,
          username
        )
      `)
      .eq('referrer_member_id', activeMemberId)
      .order('created_at', { ascending: false });

    if (!dbError && dbReferrals) {
      const history = dbReferrals.map((r: any) => ({
        id: r.id,
        referrer_member_id: r.referrer_member_id,
        referred_member_id: r.referred_member_id,
        referred_member_name: r.community_members?.full_name || `@${r.community_members?.username || 'member'}`,
        referral_code: r.referral_code,
        status: r.status,
        qualifying_activity_type: r.qualifying_activity_type,
        qualifying_activity_id: r.qualifying_activity_id,
        reward_xp: r.reward_xp,
        rewarded_transaction_id: r.rewarded_transaction_id,
        rejection_reason: r.rejection_reason,
        created_at: r.created_at,
        rewarded_at: r.rewarded_at,
      }));

      const pendingCount = history.filter((r) => r.status === 'pending_activity').length;
      const successfulCount = history.filter((r) => r.status === 'rewarded').length;
      const totalReferralXP = successfulCount * 50;

      return NextResponse.json({
        success: true,
        source: 'supabase_postgres',
        summary: {
          referral_code: referralCode,
          share_url: shareUrl,
          total_invited: history.length,
          pending_count: pendingCount,
          successful_count: successfulCount,
          total_referral_xp: totalReferralXP,
          history,
        },
      });
    }

    // 3. Fallback to serverStore
    const summary = serverStore.getMemberReferralSummary(activeMemberId);
    return NextResponse.json({
      success: true,
      source: 'server_store',
      summary,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
