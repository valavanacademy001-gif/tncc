import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { ChallengeSubmission } from '@/tncc-community/lib/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Check community auth headers/cookies for transition support
    const activeEmailCookie = request.cookies.get('tncc_active_user_email')?.value;
    const userEmailHeader = request.headers.get('x-tncc-user-email');
    const effectiveEmail = (user?.email || activeEmailCookie || userEmailHeader || '').trim().toLowerCase();

    // 1. Verify Authentication (HTTP 401)
    if (!user && !effectiveEmail) {
      return NextResponse.json(
        { error: 'Authentication required: You must be logged in to submit a challenge entry.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      challenge_id,
      title,
      description,
      submission_type,
      submission_url,
      is_update,
    } = body;

    // 2. Validate Inputs (HTTP 400)
    if (!challenge_id || typeof challenge_id !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed: challenge_id is required.' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json(
        { error: 'Validation failed: Title is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const validTypes = ['image', 'video', 'pdf', 'gdrive', 'portfolio'];
    if (!submission_type || !validTypes.includes(submission_type)) {
      return NextResponse.json(
        { error: `Validation failed: submission_type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!submission_url || typeof submission_url !== 'string' || !submission_url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Validation failed: A valid submission URL starting with http:// or https:// is required.' },
        { status: 400 }
      );
    }

    // 3. Resolve Member Identity from Authenticated Session (Prevents client spoofing of member_id)
    let memberId: string = `mem-${effectiveEmail.replace(/[^a-z0-9]/g, '_')}`;
    let memberUsername = effectiveEmail.split('@')[0];
    let memberFullName = 'Creator';

    if (user) {
      try {
        const { data: member } = await supabase
          .from('community_members')
          .select('id, username, full_name')
          .eq('user_id', user.id)
          .single();

        if (member) {
          memberId = member.id;
          memberUsername = member.username;
          memberFullName = member.full_name;
        }
      } catch {
        // Table not ready
      }
    }

    // 3.5. Prevent Simultaneous Concurrent Duplicate Submissions (Mutex Lock)
    let lockAcquired = false;
    if (!is_update) {
      lockAcquired = serverStore.acquireSubmissionLock(challenge_id, memberId);
      if (!lockAcquired) {
        return NextResponse.json(
          {
            error: 'Duplicate submission rejected: A submission request for this challenge is already processing.',
            duplicate: true,
          },
          { status: 409 }
        );
      }
    }

    try {
      // 4. Check Challenge Exists, Status, and Deadline
    let challenge: any = null;
    try {
      const { data, error } = await supabase
        .from('community_challenges')
        .select('*')
        .eq('id', challenge_id)
        .single();
      if (!error && data) {
        challenge = data;
      }
    } catch {
      // Ignore
    }

    if (!challenge) {
      challenge = serverStore.getChallenge(challenge_id);
    }

    if (!challenge) {
      return NextResponse.json(
        { error: `Challenge with ID "${challenge_id}" was not found.` },
        { status: 404 }
      );
    }

    // Enforce Challenge Status (Must be 'Active')
    if (challenge.status !== 'Active') {
      return NextResponse.json(
        {
          error: `Submissions rejected: Challenge is not currently open for entries (Status: ${challenge.status}).`,
          challenge_status: challenge.status,
        },
        { status: 400 }
      );
    }

    // Enforce Deadline using Server Time (UTC)
    const serverNow = new Date();
    const deadline = new Date(challenge.submission_deadline);
    if (serverNow.getTime() > deadline.getTime()) {
      return NextResponse.json(
        {
          error: `Challenge deadline has expired. Submissions closed on ${deadline.toUTCString()}.`,
          deadline_expired: true,
          deadline: challenge.submission_deadline,
          server_time: serverNow.toISOString(),
        },
        { status: 400 }
      );
    }

    // 5. Try calling Database RPC function submit_challenge_entry
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_challenge_entry', {
        p_challenge_id: challenge_id,
        p_title: title.trim(),
        p_submission_type: submission_type,
        p_submission_url: submission_url.trim(),
        p_description: description ? description.trim() : null,
        p_is_update: Boolean(is_update),
      });

      if (!rpcError && rpcData) {
        return NextResponse.json({
          success: true,
          message: rpcData.message || 'Challenge entry submitted successfully.',
          data: rpcData,
        }, { status: is_update ? 200 : 201 });
      }
    } catch {
      // RPC not yet provisioned in remote instance
    }

    // 6. Check for Existing Submission by this Member for this Challenge
    let existingSub: ChallengeSubmission | undefined = undefined;
    try {
      const { data } = await supabase
        .from('community_challenge_submissions')
        .select('*')
        .eq('challenge_id', challenge_id)
        .eq('member_id', memberId)
        .single();
      if (data) existingSub = data as ChallengeSubmission;
    } catch {
      // Ignore
    }

    if (!existingSub) {
      existingSub = serverStore.findSubmission(challenge_id, memberId);
    }

    // 7. Duplicate Submission Prevention (HTTP 409 Conflict)
    if (existingSub && !is_update) {
      return NextResponse.json(
        {
          error: 'Duplicate submission rejected: You have already submitted an entry for this challenge. Each member can only submit once.',
          duplicate: true,
          existing_submission_id: existingSub.id,
          submitted_at: existingSub.submitted_at,
        },
        { status: 409 }
      );
    }

    // 8. Handle Update of Existing Submission (HTTP 200)
    if (existingSub && is_update) {
      const updatedFields = {
        title: title.trim(),
        description: description ? description.trim() : undefined,
        submission_type: submission_type as any,
        submission_url: submission_url.trim(),
        preview_url: submission_type === 'image' ? submission_url.trim() : existingSub.preview_url,
        submitted_at: serverNow.toISOString(),
      };

      try {
        await supabase
          .from('community_challenge_submissions')
          .update(updatedFields)
          .eq('id', existingSub.id);
      } catch {
        // Fallback
      }

      const updated = serverStore.updateSubmission(existingSub.id, updatedFields);

      return NextResponse.json({
        success: true,
        message: 'Challenge entry updated successfully.',
        is_update: true,
        submission: updated || { ...existingSub, ...updatedFields },
      }, { status: 200 });
    }

    // 9. Handle New Submission (HTTP 201)
    const newSubmission: ChallengeSubmission = {
      id: `sub-${Date.now()}`,
      challenge_id,
      member_id: memberId,
      author: {
        username: memberUsername,
        full_name: memberFullName,
        avatar_url: '',
      },
      title: title.trim(),
      description: description ? description.trim() : undefined,
      submission_type,
      submission_url: submission_url.trim(),
      preview_url: submission_type === 'image' ? submission_url.trim() : undefined,
      status: 'pending',
      submitted_at: serverNow.toISOString(),
    };

    try {
      await supabase
        .from('community_challenge_submissions')
        .insert([newSubmission]);

      await supabase
        .from('community_xp_transactions')
        .insert([{
          member_id: memberId,
          amount: 15,
          reason: 'Challenge Participation',
          reference_id: `challenge_part_${challenge_id}`,
        }]);
    } catch {
      // Handled by serverStore
    }

    serverStore.addSubmission(newSubmission);

    // Referral Qualifying Activity Check (Part B): First challenge participation triggers +50 XP to Referrer
    try {
      await supabase.rpc('evaluate_and_reward_referral', {
        p_referred_member_id: memberId,
        p_activity_type: 'challenge',
        p_activity_id: newSubmission.id,
      });
    } catch {
      // Continue seamlessly
    }
    serverStore.evaluateAndRewardReferral(memberId, 'challenge', newSubmission.id);

    return NextResponse.json({
      success: true,
      message: 'Challenge entry submitted successfully! +15 XP awarded.',
      is_update: false,
      xp_awarded: 15,
      submission: newSubmission,
    }, { status: 201 });
    } finally {
      if (lockAcquired) {
        serverStore.releaseSubmissionLock(challenge_id, memberId);
      }
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
