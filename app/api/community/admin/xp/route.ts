import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

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

    // Try RPC function first
    const { data: rpcData, error: rpcError } = await auth.supabase.rpc(
      'award_admin_bonus_xp',
      {
        p_member_id: member_id,
        p_amount: xpAmount,
        p_reason: reason.trim(),
      }
    );

    if (!rpcError) {
      return NextResponse.json({
        success: true,
        message: `+${xpAmount} XP credited to creator via database RPC.`,
        data: rpcData,
      });
    }

    // Direct transaction fallback
    const refId = `admin_bonus_${Date.now()}`;
    await auth.supabase
      .from('community_xp_transactions')
      .insert([{
        member_id,
        amount: xpAmount,
        reason: reason.trim(),
        reference_id: refId,
      }]);

    return NextResponse.json({
      success: true,
      message: `Successfully awarded +${xpAmount} XP for "${reason.trim()}".`,
      member_id,
      amount: xpAmount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

