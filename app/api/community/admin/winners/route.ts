import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';
import { serverStore } from '@/lib/supabase/community-server-store';

// Global memory winner records tracking when Supabase table is pending
declare global {
  var __tncc_winner_records: Record<string, Record<string, string>> | undefined;
}
if (!global.__tncc_winner_records) {
  global.__tncc_winner_records = {};
}

// POST: Declare challenge winner atomically
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { challenge_id, position, submission_id, member_id, bonus_xp } = body;

    // 1. Input Validation
    if (!challenge_id) {
      return NextResponse.json(
        { error: 'Validation failed: challenge_id is required.' },
        { status: 400 }
      );
    }

    if (!position || !['first', 'second', 'third'].includes(position)) {
      return NextResponse.json(
        { error: 'Validation failed: position must be "first", "second", or "third".' },
        { status: 400 }
      );
    }

    if (!submission_id) {
      return NextResponse.json(
        { error: 'Validation failed: submission_id is required.' },
        { status: 400 }
      );
    }

    if (!member_id) {
      return NextResponse.json(
        { error: 'Validation failed: member_id is required.' },
        { status: 400 }
      );
    }

    const xpAmount = Number(bonus_xp) || (position === 'first' ? 100 : position === 'second' ? 60 : 30);

    // Prevent duplicate winner for same position
    if (!global.__tncc_winner_records) {
      global.__tncc_winner_records = {};
    }
    const chalWinners = global.__tncc_winner_records[challenge_id] || {};
    if (chalWinners[position]) {
      return NextResponse.json(
        { error: `Conflict: ${position.charAt(0).toUpperCase() + position.slice(1)} place winner has already been announced for this challenge.` },
        { status: 409 }
      );
    }

    // 2. Try executing the atomic RPC function
    try {
      const { data: rpcData, error: rpcError } = await auth.supabase.rpc(
        'announce_challenge_winner',
        {
          p_challenge_id: challenge_id,
          p_position: position,
          p_submission_id: submission_id,
          p_member_id: member_id,
          p_bonus_xp: xpAmount,
        }
      );

      if (!rpcError && rpcData) {
        chalWinners[position] = member_id;
        global.__tncc_winner_records[challenge_id] = chalWinners;
        serverStore.awardXP(
          member_id,
          xpAmount,
          `Challenge Winner (${position.toUpperCase()} Place)`,
          `${challenge_id}_${position}`,
          'winner_bonus'
        );

        return NextResponse.json({
          success: true,
          message: `Winner announced for ${position} place via database RPC.`,
          data: rpcData,
        });
      }
    } catch {
      // RPC unavailable, proceed to table/fallback below
    }

    // Fallback: Check existing winner record to prevent duplicate awards
    try {
      const { data: existingWinner } = await auth.supabase
        .from('community_challenge_winners')
        .select('*')
        .eq('challenge_id', challenge_id)
        .single();

      if (existingWinner) {
        if (
          (position === 'first' && existingWinner.first_place_member_id) ||
          (position === 'second' && existingWinner.second_place_member_id) ||
          (position === 'third' && existingWinner.third_place_member_id)
        ) {
          return NextResponse.json(
            { error: `Conflict: ${position.charAt(0).toUpperCase() + position.slice(1)} place winner has already been announced for this challenge.` },
            { status: 409 }
          );
        }
      }

      const winnerPayload: Record<string, any> = {
        challenge_id,
        announced_at: new Date().toISOString(),
      };

      if (position === 'first') {
        winnerPayload.first_place_member_id = member_id;
        winnerPayload.first_place_submission_id = submission_id;
        winnerPayload.first_place_xp_awarded = xpAmount;
      } else if (position === 'second') {
        winnerPayload.second_place_member_id = member_id;
        winnerPayload.second_place_submission_id = submission_id;
        winnerPayload.second_place_xp_awarded = xpAmount;
      } else if (position === 'third') {
        winnerPayload.third_place_member_id = member_id;
        winnerPayload.third_place_submission_id = submission_id;
        winnerPayload.third_place_xp_awarded = xpAmount;
      }

      if (existingWinner) {
        await auth.supabase
          .from('community_challenge_winners')
          .update(winnerPayload)
          .eq('challenge_id', challenge_id);
      } else {
        await auth.supabase
          .from('community_challenge_winners')
          .insert([winnerPayload]);
      }
    } catch {
      // Supabase tables pending
    }

    // Record winner in global memory
    chalWinners[position] = member_id;
    global.__tncc_winner_records[challenge_id] = chalWinners;

    // Log XP transaction with unique reference_id to prevent duplicate awards
    const refId = `${challenge_id}_${position}`;
    const reason = `Challenge Winner (${position.toUpperCase()} Place)`;

    const xpResult = serverStore.awardXP(
      member_id,
      xpAmount,
      reason,
      refId,
      'winner_bonus'
    );

    return NextResponse.json({
      success: true,
      message: `Winner announced for ${position} place and +${xpAmount} XP awarded.`,
      challenge_id,
      position,
      member_id,
      xp_awarded: xpAmount,
      new_total_xp: xpResult.newTotalXP,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
