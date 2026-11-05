import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { PostComment } from '@/tncc-community/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const supabase = await createClient();

    // Query Supabase community_post_comments
    const { data: dbComments, error: dbError } = await supabase
      .from('community_post_comments')
      .select(`
        id,
        post_id,
        member_id,
        comment_text,
        created_at,
        community_members (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!dbError && dbComments && dbComments.length > 0) {
      const formattedComments: PostComment[] = dbComments.map((c: any) => {
        const mem = Array.isArray(c.community_members) ? c.community_members[0] : c.community_members;
        return {
          id: c.id,
          post_id: c.post_id,
          member_id: c.member_id,
          comment_text: c.comment_text,
          created_at: c.created_at,
          author: {
            username: mem?.username || 'creator',
            full_name: mem?.full_name || 'TNCC Creator',
            avatar_url: mem?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          },
        };
      });

      return NextResponse.json({
        success: true,
        source: 'supabase_postgres',
        comments: formattedComments,
      });
    }

    // Fallback to serverStore
    const comments = serverStore.getComments(postId);
    return NextResponse.json({
      success: true,
      source: 'server_store',
      comments,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

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

    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

    if (!user && !isMockAuth && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to comment.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { comment_text, member_id: clientMemberId } = body;

    // Input validation
    if (!comment_text || typeof comment_text !== 'string' || comment_text.trim().length < 1) {
      return NextResponse.json(
        { error: 'Validation failed: Comment text cannot be empty.' },
        { status: 400 }
      );
    }

    if (comment_text.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Validation failed: Comment exceeds maximum character limit of 1000 characters.' },
        { status: 400 }
      );
    }

    // Resolve authenticated member ID
    let activeMemberId = clientMemberId || request.headers.get('x-tncc-member-id') || 'mem-current';
    let author = {
      username: 'creator',
      full_name: 'TNCC Creator',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    };

    if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('id, username, full_name, avatar_url')
        .eq('user_id', user.id)
        .single();
      if (mem) {
        activeMemberId = mem.id;
        author = {
          username: mem.username,
          full_name: mem.full_name,
          avatar_url: mem.avatar_url,
        };
      }
    } else {
      const mem = serverStore.getMemberById(activeMemberId);
      if (mem) {
        author = {
          username: mem.username,
          full_name: mem.full_name,
          avatar_url: mem.avatar_url,
        };
      }
    }

    // 1. Try Supabase RPC add_post_comment
    const { data: rpcResult, error: rpcError } = await supabase.rpc('add_post_comment', {
      p_post_id: postId,
      p_member_id: activeMemberId,
      p_text: comment_text.trim(),
    });

    if (!rpcError && rpcResult && rpcResult.success) {
      serverStore.addComment(postId, activeMemberId, comment_text.trim());
      return NextResponse.json(
        {
          success: true,
          comment: rpcResult.comment,
          comments_count: rpcResult.comments_count,
        },
        { status: 201 }
      );
    }

    // 2. Direct Supabase insert
    const { data: insertedComment, error: insertError } = await supabase
      .from('community_post_comments')
      .insert({
        post_id: postId,
        member_id: activeMemberId,
        comment_text: comment_text.trim(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!insertError && insertedComment) {
      // Increment comment count on post
      await supabase.rpc('increment_post_comments_count', { p_post_id: postId }).catch(() => {});

      const formatted: PostComment = {
        id: insertedComment.id,
        post_id: postId,
        member_id: activeMemberId,
        comment_text: comment_text.trim(),
        created_at: insertedComment.created_at,
        author,
      };

      serverStore.addComment(postId, activeMemberId, comment_text.trim());

      return NextResponse.json(
        {
          success: true,
          comment: formatted,
        },
        { status: 201 }
      );
    }

    // 3. Fallback to serverStore
    const storeRes = serverStore.addComment(postId, activeMemberId, comment_text.trim());
    if (!storeRes.success) {
      return NextResponse.json({ error: storeRes.message || 'Failed to add comment' }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        comment: storeRes.comment,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

