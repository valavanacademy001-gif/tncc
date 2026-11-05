import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { CommunityPost } from '@/tncc-community/lib/types';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: dbPosts, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbPosts && dbPosts.length > 0) {
      return NextResponse.json({ success: true, posts: dbPosts });
    }

    const posts = serverStore.getPosts();
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
        { error: 'Unauthorized: You must be logged in to publish a community post.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      caption,
      media_url = '',
      media_type = 'none',
      aspect_ratio = 'square',
      category = 'Creative Showcase',
      hashtags = [],
      is_showcase = false,
      member_id: clientMemberId,
    } = body;

    if (!caption || typeof caption !== 'string' || caption.trim().length < 2) {
      return NextResponse.json(
        { error: 'Validation failed: Caption must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    // Resolve authenticated member ID
    let activeMemberId = clientMemberId || 'mem-current';
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

    const member = serverStore.getMemberById(activeMemberId) || serverStore.getMembers()[0];
    const newPostId = `post-${Date.now()}`;

    const newPost: CommunityPost = {
      id: newPostId,
      member_id: member.id,
      author: {
        username: member.username,
        full_name: member.full_name,
        avatar_url: member.avatar_url,
        location: member.location,
        total_xp: member.total_xp || 0,
        followers_count: member.followers_count,
      },
      caption: caption.trim(),
      media_url: media_url.trim(),
      media_type,
      aspect_ratio,
      likes_count: 0,
      comments_count: 0,
      category,
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      is_showcase: !!is_showcase,
      is_liked: false,
      is_saved: false,
      saves_count: 0,
      created_at: new Date().toISOString(),
    };

    // Store post in server store
    serverStore.addPost(newPost);

    // Increment member posts count
    serverStore.updateMember(member.id, {
      posts_count: (member.posts_count || 0) + 1,
    });

    // Server-Side XP Award (+10 XP) with Anti-Duplicate Ledger Entry
    const xpRef = `post_${newPostId}`;
    const xpResult = serverStore.awardXP(
      member.id,
      10,
      'Published Community Post',
      xpRef,
      'post_creation'
    );

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        xpAwarded: xpResult.success ? 10 : 0,
        new_total_xp: xpResult.newTotalXP,
        message: 'Post published and verified XP credited to creator.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
