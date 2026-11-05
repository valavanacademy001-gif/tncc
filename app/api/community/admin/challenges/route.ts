import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

// GET: Retrieve all challenges
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { data, error } = await auth.supabase
      .from('community_challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        message: 'Database query failed or table not yet provisioned in Supabase.',
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create a new challenge
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      thumbnail_url,
      prizes,
      xp_reward,
      bonus_xp_first,
      bonus_xp_second,
      bonus_xp_third,
      submission_deadline,
      status,
      requirements,
      rules,
      reference_images,
    } = body;

    // Input Validation
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Validation failed: Title is required (minimum 3 characters).' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed: Description is required.' },
        { status: 400 }
      );
    }

    if (!submission_deadline || isNaN(Date.parse(submission_deadline))) {
      return NextResponse.json(
        { error: 'Validation failed: A valid submission deadline date is required.' },
        { status: 400 }
      );
    }

    if (!thumbnail_url || !thumbnail_url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Validation failed: A valid thumbnail URL is required.' },
        { status: 400 }
      );
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category: category || 'Design & Motion',
      thumbnail_url: thumbnail_url.trim(),
      prizes: prizes || {
        first: '₹15,000 Cash + 200 XP',
        second: '₹7,500 Cash + 100 XP',
        third: '₹3,000 Cash + 50 XP',
      },
      xp_reward: Number(xp_reward) || 15,
      bonus_xp_first: Number(bonus_xp_first) || 200,
      bonus_xp_second: Number(bonus_xp_second) || 100,
      bonus_xp_third: Number(bonus_xp_third) || 50,
      submission_deadline: new Date(submission_deadline).toISOString(),
      status: status || 'Active',
      requirements: requirements || ['Original creative work', 'Tamil cultural relevance'],
      rules: rules || ['Strictly original designs', 'Submit before deadline'],
      reference_images: reference_images || [thumbnail_url],
    };

    const { data, error } = await auth.supabase
      .from('community_challenges')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: 'Failed to insert challenge into community_challenges table.',
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Edit existing challenge
export async function PUT(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Validation failed: Challenge ID is required for update.' },
        { status: 400 }
      );
    }

    // Format deadline if present
    if (updates.submission_deadline) {
      if (isNaN(Date.parse(updates.submission_deadline))) {
        return NextResponse.json(
          { error: 'Validation failed: Invalid submission deadline date.' },
          { status: 400 }
        );
      }
      updates.submission_deadline = new Date(updates.submission_deadline).toISOString();
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from('community_challenges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

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

// DELETE: Remove challenge
export async function DELETE(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Validation failed: Challenge ID is required.' },
        { status: 400 }
      );
    }

    const { error } = await auth.supabase
      .from('community_challenges')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Challenge ${id} deleted successfully.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

