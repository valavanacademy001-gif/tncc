import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

// GET: Retrieve all resources
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { data, error } = await auth.supabase
      .from('community_resources')
      .select('*')
      .order('created_at', { ascending: false });

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

// POST: Create a new resource
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
      resource_type,
      thumbnail_url,
      external_url,
      is_google_drive,
    } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json(
        { error: 'Validation failed: Title is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed: Description is required.' },
        { status: 400 }
      );
    }

    const validCategories = ['Downloads', 'Useful Websites', 'Feeds / Videos', 'Blog Posts'];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Validation failed: Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    if (!external_url || !external_url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Validation failed: A valid external URL (starting with http:// or https://) is required.' },
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
      category,
      resource_type: resource_type || 'Downloads',
      thumbnail_url: thumbnail_url.trim(),
      external_url: external_url.trim(),
      is_google_drive: Boolean(is_google_drive || external_url.includes('drive.google.com')),
      download_count: 0,
      published_date: new Date().toISOString(),
    };

    const { data, error } = await auth.supabase
      .from('community_resources')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Edit resource
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
        { error: 'Validation failed: Resource ID is required for update.' },
        { status: 400 }
      );
    }

    if (updates.external_url && !updates.external_url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Validation failed: Invalid resource external URL.' },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await auth.supabase
      .from('community_resources')
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

// DELETE: Remove resource
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
        { error: 'Validation failed: Resource ID is required.' },
        { status: 400 }
      );
    }

    const { error } = await auth.supabase
      .from('community_resources')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Resource ${id} deleted successfully.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

