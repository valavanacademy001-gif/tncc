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

    // Reject unauthenticated requests in production
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
      // Body may be empty
    }

    let activeMemberId = body.member_id || request.headers.get('x-tncc-member-id') || 'mem-current';
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

    // Mutex locking for concurrent like requests (prevent race conditions)
    const actionKey = `like_${postId}`;
    const acquired = serverStore.acquireXPLock(activeMemberId, actionKey);
    if (!acquired) {
      return NextResponse.json(
        { error: 'Conflict: Simultaneous request in progress. Please retry.' },
        { status: 409 }
      );
    }

    try {
      let supabaseSuccess = false;
      let liked = false;
      let likesCount = 0;
      let xpEarned = false;
      let message = '';

      // 1. Try Supabase RPC: toggle_post_like_and_award_xp
      const { data: rpcResult, error: rpcError } = await supabase.rpc('toggle_post_like_and_award_xp', {
        p_post_id: postId,
        p_liker_member_id: activeMemberId,
      });

      if (!rpcError && rpcResult) {
        liked = !!rpcResult.liked;
        likesCount = rpcResult.likes_count ?? 0;
        xpEarned = !!rpcResult.xp_earned;
        message = rpcResult.message || '';
        supabaseSuccess = true;
      }

      // 2. Synchronize with serverStore
      const storeResult = serverStore.toggleLike(postId, activeMemberId);

      if (!supabaseSuccess) {
        if (!storeResult.success) {
          return NextResponse.json({ error: storeResult.message || 'Post not found' }, { status: 404 });
        }
        liked = storeResult.liked;
        likesCount = storeResult.likesCount;
        xpEarned = storeResult.xpEarned;
        message = storeResult.message || '';
      }

      return NextResponse.json({
        success: true,
        liked,
        likes_count: likesCount,
        xp_earned: xpEarned,
        message,
      });
    } finally {
      serverStore.releaseXPLock(activeMemberId, actionKey);
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
