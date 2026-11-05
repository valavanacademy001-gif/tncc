import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { referred_member_id, referral_code } = body;

    if (!referred_member_id || !referral_code) {
      return NextResponse.json(
        { error: 'referred_member_id and referral_code are required' },
        { status: 400 }
      );
    }

    const cleanCode = referral_code.trim().toUpperCase();

    // 1. Try Supabase record_referral_signup RPC
    const { data: rpcResult, error: rpcError } = await supabase.rpc('record_referral_signup', {
      p_referred_member_id: referred_member_id,
      p_referral_code: cleanCode,
    });

    if (!rpcError && rpcResult && rpcResult.success) {
      serverStore.registerReferralSignup(referred_member_id, cleanCode);
      return NextResponse.json({
        success: true,
        message: 'Referral attributed successfully as pending_activity (zero XP awarded at signup).',
        referrer_id: rpcResult.referrer_id,
      });
    }

    // 2. Fallback to serverStore
    const storeRes = serverStore.registerReferralSignup(referred_member_id, cleanCode);
    if (!storeRes.success) {
      return NextResponse.json({ error: storeRes.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Referral attributed successfully as pending_activity (zero XP awarded at signup).',
      referrer_id: storeRes.referrerId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

