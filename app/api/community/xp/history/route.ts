import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Support test/admin header or dev override when testing
    const queryMemberId = request.nextUrl.searchParams.get('member_id');
    const authHeader = request.headers.get('authorization') || '';

    let activeMemberId = queryMemberId;

    if (!activeMemberId && user) {
      // Find member by user_id
      const { data: member } = await supabase
        .from('community_members')
        .select('id, member_id, total_xp')
        .eq('user_id', user.id)
        .single();

      if (member) {
        activeMemberId = member.id;
      }
    }

    // Default to test member or first member if in local dev without active Supabase session
    if (!activeMemberId) {
      activeMemberId = 'mem-current';
    }

    // Try Supabase first
    const { data: dbTxs, error: dbError } = await supabase
      .from('community_xp_transactions')
      .select('*')
      .eq('member_id', activeMemberId)
      .order('created_at', { ascending: false });

    const member = serverStore.getMemberById(activeMemberId);

    if (!dbError && dbTxs && dbTxs.length > 0) {
      return NextResponse.json({
        success: true,
        member_id: activeMemberId,
        total_xp: member?.total_xp ?? 0,
        count: dbTxs.length,
        transactions: dbTxs,
      });
    }

    // Fall back to serverStore ledger
    const transactions = serverStore.getXPTransactionsForMember(activeMemberId);

    return NextResponse.json({
      success: true,
      member_id: activeMemberId,
      total_xp: member?.total_xp ?? 0,
      count: transactions.length,
      transactions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Security: Prevent direct client-side XP manipulation
export async function POST() {
  return NextResponse.json(
    {
      error: 'Forbidden: Direct XP ledger creation from client is prohibited. XP must be issued via verified server actions or administrator operations.',
    },
    { status: 403 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Forbidden: XP ledger is strictly immutable. Transaction updates are prohibited.',
    },
    { status: 403 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Forbidden: XP transactions cannot be deleted.',
    },
    { status: 403 }
  );
}
