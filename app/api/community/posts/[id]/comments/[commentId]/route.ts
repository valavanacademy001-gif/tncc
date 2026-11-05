import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

    if (!user && !isMockAuth && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to delete comments.' },
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

    // Try Supabase RPC delete_post_comment
    const { data: rpcResult, error: rpcError } = await supabase.rpc('delete_post_comment', {
      p_comment_id: commentId,
      p_member_id: activeMemberId,
    });

    if (!rpcError && rpcResult && rpcResult.success) {
      serverStore.deleteComment(commentId, activeMemberId, true);
      return NextResponse.json({
        success: true,
        message: 'Comment deleted',
        comments_count: rpcResult.comments_count,
      });
    }

    // Direct delete from community_post_comments
    const { data: existingComment } = await supabase
      .from('community_post_comments')
      .select('member_id, post_id')
      .eq('id', commentId)
      .single();

    if (existingComment) {
      if (existingComment.member_id !== activeMemberId && !isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: You can only delete your own comments.' },
          { status: 403 }
        );
      }

      await supabase.from('community_post_comments').delete().eq('id', commentId);
      await supabase
        .from('community_posts')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', existingComment.post_id);
    }

    const storeRes = serverStore.deleteComment(commentId, activeMemberId, isAdmin);
    if (!storeRes.success) {
      const status = storeRes.message?.includes('Unauthorized') ? 403 : 404;
      return NextResponse.json({ error: storeRes.message || 'Failed to delete comment' }, { status });
    }

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
