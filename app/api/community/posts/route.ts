import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { CommunityPost } from '@/tncc-community/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '30', 10), 1), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const offset = (page - 1) * limit;
    const category = searchParams.get('category');
    const isShowcase = searchParams.get('showcase') === 'true';
    const isSavedOnly = searchParams.get('saved') === 'true';
    const searchQuery = (searchParams.get('search') || '').toLowerCase().trim();
    const authorUsername = searchParams.get('username');

    // 1. Identify requesting member for like and save state
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let activeMemberId: string | null = null;
    let likedPostIds = new Set<string>();
    let savedPostIds = new Set<string>();

    if (user) {
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (member) {
        activeMemberId = member.id;
      }
    }

    // Also check mock or query member_id for fallback/testing
    const headerMemberId = request.headers.get('x-tncc-member-id');
    if (!activeMemberId && headerMemberId) {
      activeMemberId = headerMemberId;
    }

    if (activeMemberId) {
      // Fetch user's likes
      const { data: userLikes } = await supabase
        .from('community_post_likes')
        .select('post_id')
        .eq('member_id', activeMemberId);

      if (userLikes) {
        userLikes.forEach((l) => likedPostIds.add(l.post_id));
      }

      // Fetch user's saved bookmarks
      const { data: userSaves } = await supabase
        .from('community_saved_posts')
        .select('post_id')
        .eq('member_id', activeMemberId);

      if (userSaves) {
        userSaves.forEach((s) => savedPostIds.add(s.post_id));
      }
    }

    // 2. Query Supabase community_posts
    let query = supabase
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
      `, { count: 'exact' });

    if (category && category !== 'All' && category !== 'All Categories') {
      query = query.eq('category', category);
    }

    if (isShowcase) {
      query = query.eq('is_showcase', true);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: dbPosts, error: dbError, count: totalCount } = await query;

    if (!dbError && dbPosts && dbPosts.length > 0) {
      const formattedPosts: CommunityPost[] = dbPosts.map((p: any) => {
        const mem = Array.isArray(p.community_members) ? p.community_members[0] : p.community_members;
        const postAuthor = {
          username: mem?.username || 'creator',
          full_name: mem?.full_name || 'TNCC Creator',
          avatar_url: mem?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          location: mem?.location || 'Tamil Nadu',
          total_xp: mem?.total_xp || 0,
          followers_count: mem?.followers_count || 120,
        };

        const isLiked = likedPostIds.has(p.id);
        const isSaved = savedPostIds.has(p.id);

        return {
          id: p.id,
          member_id: p.member_id,
          author: postAuthor,
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
          is_liked: isLiked,
          is_saved: isSaved,
        };
      });

      // Filter by search query if present
      let finalPosts = formattedPosts;
      if (searchQuery) {
        finalPosts = finalPosts.filter(
          (p) =>
            p.caption.toLowerCase().includes(searchQuery) ||
            p.author.full_name.toLowerCase().includes(searchQuery) ||
            p.author.username.toLowerCase().includes(searchQuery) ||
            p.hashtags.some((t) => t.toLowerCase().includes(searchQuery))
        );
      }

      if (isSavedOnly) {
        finalPosts = finalPosts.filter((p) => p.is_saved);
      }

      if (authorUsername) {
        finalPosts = finalPosts.filter(
          (p) => p.author.username.toLowerCase() === authorUsername.toLowerCase()
        );
      }

      return NextResponse.json({
        success: true,
        source: 'supabase_postgres',
        posts: finalPosts,
        pagination: {
          page,
          limit,
          total: totalCount || finalPosts.length,
          hasMore: (offset + finalPosts.length) < (totalCount || 0),
        },
      });
    }

    // 3. Fallback to resilient serverStore
    let storePosts = serverStore.getPosts();

    // Map likes/saves for serverStore
    if (activeMemberId) {
      const savedIds = serverStore.getSavedPostIds(activeMemberId);
      storePosts = storePosts.map((p) => ({
        ...p,
        is_saved: savedIds.includes(p.id),
      }));
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      storePosts = storePosts.filter((p) => p.category === category);
    }
    if (isShowcase) {
      storePosts = storePosts.filter((p) => p.is_showcase || p.category === 'Showcase');
    }
    if (isSavedOnly) {
      storePosts = storePosts.filter((p) => p.is_saved);
    }
    if (authorUsername) {
      storePosts = storePosts.filter((p) => p.author.username.toLowerCase() === authorUsername.toLowerCase());
    }
    if (searchQuery) {
      storePosts = storePosts.filter(
        (p) =>
          p.caption.toLowerCase().includes(searchQuery) ||
          p.author.full_name.toLowerCase().includes(searchQuery) ||
          p.author.username.toLowerCase().includes(searchQuery) ||
          p.hashtags.some((t) => t.toLowerCase().includes(searchQuery))
      );
    }

    const paginated = storePosts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      source: 'server_store',
      posts: paginated,
      pagination: {
        page,
        limit,
        total: storePosts.length,
        hasMore: (offset + paginated.length) < storePosts.length,
      },
    });
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

    // Check authorization header or session
    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');

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
      category = 'Showcase',
      hashtags = [],
      is_showcase = false,
      member_id: clientMemberId,
    } = body;

    // Strict input validation
    if (!caption || typeof caption !== 'string' || caption.trim().length < 2) {
      return NextResponse.json(
        { error: 'Validation failed: Caption must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    if (caption.trim().length > 2500) {
      return NextResponse.json(
        { error: 'Validation failed: Caption exceeds maximum character limit (2500 characters).' },
        { status: 400 }
      );
    }

    // Resolve authenticated member ID
    let activeMemberId = clientMemberId || 'mem-current';
    let authorDetails = {
      username: 'creator',
      full_name: 'TNCC Creator',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      location: 'Tamil Nadu',
      total_xp: 0,
      followers_count: 120,
    };

    if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('id, username, full_name, avatar_url, location, total_xp, followers_count')
        .eq('user_id', user.id)
        .single();
      if (mem) {
        activeMemberId = mem.id;
        authorDetails = {
          username: mem.username,
          full_name: mem.full_name,
          avatar_url: mem.avatar_url,
          location: mem.location || 'Tamil Nadu',
          total_xp: mem.total_xp || 0,
          followers_count: mem.followers_count || 120,
        };
      }
    } else {
      const mem = serverStore.getMemberById(activeMemberId);
      if (mem) {
        authorDetails = {
          username: mem.username,
          full_name: mem.full_name,
          avatar_url: mem.avatar_url,
          location: mem.location || 'Tamil Nadu',
          total_xp: mem.total_xp || 0,
          followers_count: mem.followers_count || 120,
        };
      }
    }

    const cleanHashtags = Array.isArray(hashtags)
      ? hashtags.map((h: string) => (h.startsWith('#') ? h : `#${h}`))
      : [];

    let newPostId = `post-${Date.now()}`;
    let xpAwarded = 10;
    let newTotalXP = (authorDetails.total_xp || 0) + 10;
    let savedToSupabase = false;

    // 1. Try Supabase RPC: publish_post_with_verified_xp
    const { data: rpcResult, error: rpcError } = await supabase.rpc('publish_post_with_verified_xp', {
      p_member_id: activeMemberId,
      p_caption: caption.trim(),
      p_media_url: media_url.trim(),
      p_media_type: media_type,
      p_aspect_ratio: aspect_ratio,
      p_category: category,
      p_hashtags: cleanHashtags,
      p_is_showcase: !!is_showcase,
    });

    if (!rpcError && rpcResult && rpcResult.success) {
      newPostId = rpcResult.post_id || newPostId;
      xpAwarded = rpcResult.xp_awarded ?? 10;
      newTotalXP = rpcResult.new_total_xp ?? newTotalXP;
      savedToSupabase = true;
    } else {
      // 2. Direct Supabase table insert
      const { data: insertedPost, error: insertError } = await supabase
        .from('community_posts')
        .insert({
          member_id: activeMemberId,
          caption: caption.trim(),
          media_url: media_url.trim(),
          media_type,
          aspect_ratio,
          category,
          hashtags: cleanHashtags,
          is_showcase: !!is_showcase,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!insertError && insertedPost) {
        newPostId = insertedPost.id;
        savedToSupabase = true;

        // Award +10 XP server-side in Supabase ledger
        const actionRef = `post_${newPostId}`;
        await supabase.from('community_xp_transactions').insert({
          member_id: activeMemberId,
          amount: 10,
          reason: 'Published Community Post',
          reference_id: actionRef,
          transaction_type: 'post_creation',
          created_at: new Date().toISOString(),
        });

        // Increment member posts_count and XP
        await supabase
          .from('community_members')
          .update({
            total_xp: newTotalXP,
            posts_count: 1, // trigger or manual
          })
          .eq('id', activeMemberId);
      }
    }

    // 3. Mirror in serverStore for high availability
    const newPost: CommunityPost = {
      id: newPostId,
      member_id: activeMemberId,
      author: authorDetails,
      caption: caption.trim(),
      media_url: media_url.trim() || undefined,
      media_type,
      aspect_ratio,
      likes_count: 0,
      comments_count: 0,
      saves_count: 0,
      category,
      hashtags: cleanHashtags,
      is_showcase: !!is_showcase,
      is_liked: false,
      is_saved: false,
      created_at: new Date().toISOString(),
    };

    serverStore.addPost(newPost);
    serverStore.updateMember(activeMemberId, {
      posts_count: ((serverStore.getMemberById(activeMemberId)?.posts_count) || 0) + 1,
    });
    serverStore.awardXP(activeMemberId, 10, 'Published Community Post', `post_${newPostId}`, 'post_creation');

    // 4. Referral Qualifying Activity Check (Part B): First Creative Post triggers +50 XP to Referrer
    try {
      await supabase.rpc('evaluate_and_reward_referral', {
        p_referred_member_id: activeMemberId,
        p_activity_type: 'post',
        p_activity_id: newPostId,
      });
    } catch {
      // Continue seamlessly
    }
    serverStore.evaluateAndRewardReferral(activeMemberId, 'post', newPostId);

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        xpAwarded,
        new_total_xp: newTotalXP,
        savedToSupabase,
        message: 'Post successfully published to TNCC community feed.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
