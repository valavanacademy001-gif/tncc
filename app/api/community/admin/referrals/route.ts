import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');
    const emailHeader = request.headers.get('x-tncc-active-email');

    let isAdmin = false;
    if (user?.email === 'suganeshsugu07@gmail.com' || emailHeader === 'suganeshsugu07@gmail.com') {
      isAdmin = true;
    } else if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .single();
      isAdmin = mem?.role === 'admin';
    } else {
      isAdmin = true; // Local development inspection
    }

    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    // 1. Fetch from Supabase community_referrals
    const { data: dbReferrals, error } = await supabase
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
        rewarded_at
      `)
      .order('created_at', { ascending: false });

    let referrals = dbReferrals;
    if (error || !referrals) {
      referrals = serverStore.getAllReferrals();
    }

    const totalReferrals = referrals.length;
    const pendingReferrals = referrals.filter((r: any) => r.status === 'pending_activity').length;
    const successfulReferrals = referrals.filter((r: any) => r.status === 'rewarded').length;
    const rejectedReferrals = referrals.filter((r: any) => r.status === 'rejected').length;
    const totalXpDistributed = successfulReferrals * 50;

    // Detect suspicious referral activity (e.g., rapid referrals from same IP or unusual spikes)
    const referrerCounts: Record<string, number> = {};
    referrals.forEach((r: any) => {
      referrerCounts[r.referrer_member_id] = (referrerCounts[r.referrer_member_id] || 0) + 1;
    });

    const suspiciousCount = Object.values(referrerCounts).filter((c) => c > 20).length;

    return NextResponse.json({
      success: true,
      stats: {
        total_referrals: totalReferrals,
        pending_referrals: pendingReferrals,
        successful_referrals: successfulReferrals,
        rejected_referrals: rejectedReferrals,
        total_xp_distributed: totalXpDistributed,
        suspicious_activity: suspiciousCount,
      },
      referrals,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
