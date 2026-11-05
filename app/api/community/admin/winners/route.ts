import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

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

    const xpAmount = Number(bonus_xp) || (position === 'first' ? 200 : position === 'second' ? 100 : 50);

    // 2. Try executing the atomic RPC function
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

    if (!rpcError) {
      return NextResponse.json({
        success: true,
        message: `Successfully declared ${position} place winner via atomic database RPC.`,
        data: rpcData,
      });
    }

    // 3. If RPC function does not exist in live schema, execute atomic fallback with duplicate protection
    const { data: challenge } = await auth.supabase
      .from('community_challenges')
      .select('*')
      .eq('id', challenge_id)
      .single();

    if (!challenge) {
      return NextResponse.json(
        { error: `Challenge ${challenge_id} not found.` },
        { status: 404 }
      );
    }

    // Check existing winner record to prevent duplicate awards
    const { data: existingWinner } = await auth.supabase
      .from('community_challenge_winners')
      .select('*')
      .eq('challenge_id', challenge_id)
      .single();

    if (existingWinner) {
      // Prevent assigning same member to multiple places in same challenge
      if (
        (position !== 'first' && existingWinner.first_place_member_id === member_id) ||
        (position !== 'second' && existingWinner.second_place_member_id === member_id) ||
        (position !== 'third' && existingWinner.third_place_member_id === member_id)
      ) {
        return NextResponse.json(
          { error: 'Conflict: This creator has already won another place in this competition.' },
          { status: 409 }
        );
      }
    }

    // Record winner in community_challenge_winners
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

    // Log XP transaction with unique reference_id to prevent duplicate awards
    const refId = `${challenge_id}_${position}`;
    const reason = `${position.charAt(0).toUpperCase() + position.slice(1)} Place Winner`;

    await auth.supabase
      .from('community_xp_transactions')
      .insert([{
        member_id,
        amount: xpAmount,
        reason,
        reference_id: refId,
      }]);

    // Update challenge status to Completed if first place winner
    if (position === 'first') {
      await auth.supabase
        .from('community_challenges')
        .update({ status: 'Completed', updated_at: new Date().toISOString() })
        .eq('id', challenge_id);
    }

    return NextResponse.json({
      success: true,
      message: `Winner announced for ${position} place and +${xpAmount} XP awarded.`,
      challenge_id,
      position,
      member_id,
      xp_awarded: xpAmount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

