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

    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

    if (!user && !isMockAuth && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to bookmark posts.' },
        { status: 401 }
      );
    }

    let activeMemberId = request.headers.get('x-tncc-member-id') || 'mem-current';
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

    // 1. Try Supabase RPC toggle_post_save
    const { data: rpcResult, error: rpcError } = await supabase.rpc('toggle_post_save', {
      p_post_id: postId,
      p_member_id: activeMemberId,
    });

    if (!rpcError && rpcResult) {
      serverStore.toggleSave(postId, activeMemberId);
      return NextResponse.json({
        success: true,
        saved: rpcResult.saved,
        saves_count: rpcResult.saves_count,
        message: rpcResult.message,
      });
    }

    // 2. Direct Supabase operation
    const { data: existingSave } = await supabase
      .from('community_saved_posts')
      .select('id')
      .eq('post_id', postId)
      .eq('member_id', activeMemberId)
      .single();

    let saved = false;
    if (existingSave) {
      await supabase.from('community_saved_posts').delete().eq('id', existingSave.id);
      saved = false;
    } else {
      await supabase.from('community_saved_posts').insert({
        post_id: postId,
        member_id: activeMemberId,
        created_at: new Date().toISOString(),
      });
      saved = true;
    }

    // 3. Fallback/Sync to serverStore
    const storeRes = serverStore.toggleSave(postId, activeMemberId);

    return NextResponse.json({
      success: true,
      saved: storeRes.saved,
      saves_count: storeRes.savesCount,
      message: storeRes.saved ? 'Saved to bookmarks' : 'Removed from bookmarks',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
