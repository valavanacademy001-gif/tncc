import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { CommunityPost } from '@/tncc-community/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    // 1. Query Supabase community_saved_posts joined with community_posts
    const { data: savedRows, error: dbError } = await supabase
      .from('community_saved_posts')
      .select(`
        post_id,
        created_at,
        community_posts (
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
        )
      `)
      .eq('member_id', activeMemberId)
      .order('created_at', { ascending: false });

    if (!dbError && savedRows && savedRows.length > 0) {
      const posts: CommunityPost[] = savedRows
        .filter((r) => r.community_posts)
        .map((r: any) => {
          const p = r.community_posts;
          const mem = Array.isArray(p.community_members) ? p.community_members[0] : p.community_members;
          return {
            id: p.id,
            member_id: p.member_id,
            author: {
              username: mem?.username || 'creator',
              full_name: mem?.full_name || 'TNCC Creator',
              avatar_url: mem?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              location: mem?.location || 'Tamil Nadu',
              total_xp: mem?.total_xp || 0,
              followers_count: mem?.followers_count || 120,
            },
            caption: p.caption,
            media_url: p.media_url || undefined,
            media_type: p.media_type || 'none',
            aspect_ratio: p.aspect_ratio || 'square',
            hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
            category: p.category || 'Showcase',
            is_showcase: !!p.is_showcase,
            likes_count: p.likes_count || 0,
            comments_count: p.comments_count || 0,
            saves_count: p.saves_count || 0,
            created_at: p.created_at,
            is_liked: false,
            is_saved: true,
          };
        });

      return NextResponse.json({ success: true, posts });
    }

    // 2. Fallback to serverStore
    const savedIds = serverStore.getSavedPostIds(activeMemberId);
    const allPosts = serverStore.getPosts();
    const posts = allPosts
      .filter((p) => savedIds.includes(p.id))
      .map((p) => ({ ...p, is_saved: true }));

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
