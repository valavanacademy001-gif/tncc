import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

// GET: Retrieve challenge submissions
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challenge_id');

    let query = auth.supabase
      .from('community_challenge_submissions')
      .select('*, community_members(id, username, full_name, avatar_url)')
      .order('submitted_at', { ascending: false });

    if (challengeId) {
      query = query.eq('challenge_id', challengeId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Review submission (Approve / Reject / Feedback)
export async function PUT(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { submission_id, status, admin_feedback } = body;

    if (!submission_id) {
      return NextResponse.json(
        { error: 'Validation failed: submission_id is required.' },
        { status: 400 }
      );
    }

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Validation failed: status must be "approved", "rejected", or "pending".' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (typeof admin_feedback === 'string') {
      updatePayload.admin_feedback = admin_feedback.trim();
    }

    const { data, error } = await auth.supabase
      .from('community_challenge_submissions')
      .update(updatePayload)
      .eq('id', submission_id)
      .select('*, community_members(id, username, full_name, avatar_url)')
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Submission marked as ${status}.`,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

