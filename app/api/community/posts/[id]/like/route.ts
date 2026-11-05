import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check for authorization header or session
    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

    // Reject unauthenticated requests
    if (!user && !isMockAuth && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to like posts.' },
        { status: 401 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is acceptable
    }

    let activeMemberId = body.member_id || 'mem-current';
    if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (mem) {
        activeMemberId = mem.id;
      }
    }

    // Mutex locking for concurrent like requests
    const actionKey = `like_${postId}`;
    const acquired = serverStore.acquireXPLock(activeMemberId, actionKey);
    if (!acquired) {
      return NextResponse.json(
        { error: 'Conflict: Simultaneous request in progress. Please retry.' },
        { status: 409 }
      );
    }

    try {
      // Execute verified like toggle with anti-farming protections
      const result = serverStore.toggleLike(postId, activeMemberId);

      if (!result.success) {
        return NextResponse.json({ error: result.message || 'Post not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        liked: result.liked,
        likes_count: result.likesCount,
        xp_earned: result.xpEarned,
        message: result.message,
      });
    } finally {
      serverStore.releaseXPLock(activeMemberId, actionKey);
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

