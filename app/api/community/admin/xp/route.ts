import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';
import { serverStore } from '@/lib/supabase/community-server-store';

// POST: Award admin bonus XP to a creator
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { member_id, amount, reason } = body;

    if (!member_id) {
      return NextResponse.json(
        { error: 'Validation failed: member_id is required.' },
        { status: 400 }
      );
    }

    const xpAmount = Number(amount);
    if (isNaN(xpAmount) || xpAmount <= 0 || xpAmount > 1000) {
      return NextResponse.json(
        { error: 'Validation failed: XP amount must be a number between 1 and 1000.' },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      return NextResponse.json(
        { error: 'Validation failed: A valid reason (at least 3 characters) is required.' },
        { status: 400 }
      );
    }

    // Try Supabase RPC function first
    try {
      const { data: rpcData, error: rpcError } = await auth.supabase.rpc(
        'award_admin_bonus_xp',
        {
          p_member_id: member_id,
          p_amount: xpAmount,
          p_reason: reason.trim(),
        }
      );

      if (!rpcError && rpcData) {
        // Also sync to serverStore
        serverStore.awardXP(member_id, xpAmount, reason.trim(), `admin_bonus_${Date.now()}`, 'admin_merit');
        return NextResponse.json({
          success: true,
          message: `+${xpAmount} XP credited to creator via database RPC.`,
          data: rpcData,
        });
      }
    } catch {
      // Supabase RPC unavailable, fallback below
    }

    // Try Supabase direct table insert
    const refId = `admin_bonus_${Date.now()}`;
    try {
      await auth.supabase
        .from('community_xp_transactions')
        .insert([{
          member_id,
          amount: xpAmount,
          reason: reason.trim(),
          reference_id: refId,
        }]);
    } catch {
      // Table insert unavailable, fallback to serverStore
    }

    // Resilient serverStore commit
    const result = serverStore.awardXP(
      member_id,
      xpAmount,
      reason.trim(),
      refId,
      'admin_merit'
    );

    return NextResponse.json({
      success: true,
      message: `Successfully awarded +${xpAmount} XP for "${reason.trim()}".`,
      member_id,
      amount: xpAmount,
      new_total_xp: result.newTotalXP,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
