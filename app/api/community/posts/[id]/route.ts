import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();

    const { data: dbPost, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        member_id,
        caption,
        media_url,
        media_type,
        aspect_ratio,
        hashtags,
        category,
        is_showcase,
        likes_count,
        comments_count,
        saves_count,
        created_at,
        community_members (
          id,
          username,
          full_name,
          avatar_url,
          location,
          total_xp,
          followers_count
        )
      `)
      .eq('id', postId)
      .single();

    if (!error && dbPost) {
      const mem = Array.isArray(dbPost.community_members)
        ? dbPost.community_members[0]
        : dbPost.community_members;
      return NextResponse.json({
        success: true,
        post: {
          ...dbPost,
          author: {
            username: mem?.username || 'creator',
            full_name: mem?.full_name || 'TNCC Creator',
            avatar_url: mem?.avatar_url,
            location: mem?.location || 'Tamil Nadu',
            total_xp: mem?.total_xp || 0,
            followers_count: mem?.followers_count || 120,
          },
        },
      });
    }

    const post = serverStore.getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check authorization header or session
    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

    if (!user && !isMockAuth && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to delete a post.' },
        { status: 401 }
      );
    }

    let activeMemberId = request.headers.get('x-tncc-member-id') || 'mem-current';
    let isAdmin = false;

    if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('id, role')
        .eq('user_id', user.id)
        .single();
      if (mem) {
        activeMemberId = mem.id;
        isAdmin = mem.role === 'admin';
      }
    } else {
      const mem = serverStore.getMemberById(activeMemberId);
      isAdmin = mem?.role === 'admin';
    }

    // Try Supabase RPC delete_community_post
    const { data: rpcResult, error: rpcError } = await supabase.rpc('delete_community_post', {
      p_post_id: postId,
      p_member_id: activeMemberId,
    });

    if (!rpcError && rpcResult && rpcResult.success) {
      serverStore.deletePost(postId, activeMemberId, true);
      return NextResponse.json({ success: true, message: 'Post successfully deleted' });
    }

    // Direct Supabase delete with ownership check
    const { data: existingPost } = await supabase
      .from('community_posts')
      .select('member_id')
      .eq('id', postId)
      .single();

    if (existingPost) {
      if (existingPost.member_id !== activeMemberId && !isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: You can only delete your own posts.' },
          { status: 403 }
        );
      }

      await supabase.from('community_posts').delete().eq('id', postId);
    }

    // Synchronize serverStore
    const storeRes = serverStore.deletePost(postId, activeMemberId, isAdmin);
    if (!storeRes.success && !existingPost) {
      return NextResponse.json({ error: storeRes.message || 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
