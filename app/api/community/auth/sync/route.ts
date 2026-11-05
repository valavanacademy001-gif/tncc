import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { communityServerStore } from '@/lib/supabase/community-server-store';
import { checkIsAdmin, AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';
import { CommunityMember } from '@/tncc-community/lib/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete('tncc_active_user_email');
      response.cookies.delete('tncc_member_id');
      response.cookies.delete('tncc_admin_session');
      return response;
    }

    const cleanEmail = (user.email || '').toLowerCase().trim();
    const isAdmin = AUTHORIZED_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail);

    let member: CommunityMember | undefined = undefined;

    // 1. Try querying Supabase community_members table
    try {
      const { data: dbMember } = await supabase
        .from('community_members')
        .select('*')
        .or(`user_id.eq.${user.id},email.ilike.${cleanEmail}`)
        .maybeSingle();

      if (dbMember) {
        member = {
          ...dbMember,
          skills: Array.isArray(dbMember.skills) ? dbMember.skills : ['Creator'],
        };
      }
    } catch {
      // Table may not yet be provisioned
    }

    // 2. Fallback to server store
    if (!member) {
      member = communityServerStore.getMembers().find(
        (m) => (m.email && m.email.toLowerCase() === cleanEmail) || m.id === `mem-${user.id.slice(0, 8)}`
      );
    }

    // 3. If member record does not exist at all, auto-provision linked record
    if (!member) {
      const metadata = user.user_metadata || {};
      const generatedUsername = (metadata.username || cleanEmail.split('@')[0] || `creator_${user.id.slice(0, 6)}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      const newMember: CommunityMember = {
        id: `mem-${user.id.slice(0, 8)}`,
        member_id: `TNCC-2026-${String(Date.now()).slice(-4)}`,
        user_id: user.id,
        username: generatedUsername,
        full_name: metadata.full_name || cleanEmail.split('@')[0] || 'Creator',
        email: cleanEmail,
        avatar_url: metadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        bio: metadata.bio || 'Tamil Nadu creator crafting impactful visuals and stories.',
        location: metadata.location || 'Chennai, Tamil Nadu',
        skills: Array.isArray(metadata.skills) && metadata.skills.length > 0 ? metadata.skills : ['Creator', 'Visual Design'],
        total_xp: isAdmin ? 1520 : 50,
        role: isAdmin ? 'admin' : 'member',
        created_at: new Date().toISOString(),
        posts_count: 0,
        wins_count: 0,
        challenges_count: 0,
        followers_count: 0,
        following_count: 0,
      };

      // Attempt to save to Supabase community_members table
      try {
        await supabase.from('community_members').upsert({
          id: user.id,
          user_id: user.id,
          member_id: newMember.member_id,
          username: newMember.username,
          full_name: newMember.full_name,
          email: newMember.email,
          avatar_url: newMember.avatar_url,
          cover_url: newMember.cover_url,
          bio: newMember.bio,
          location: newMember.location,
          skills: newMember.skills,
          total_xp: newMember.total_xp,
          role: newMember.role,
        }, { onConflict: 'user_id' });
      } catch {
        // Ignored if table not created
      }

      // Also ensure profiles table has user
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: newMember.full_name,
          username: newMember.username,
          avatar_url: newMember.avatar_url,
          location: newMember.location,
          bio: newMember.bio,
          onboarding_complete: true,
        }, { onConflict: 'id' });
      } catch {
        // Ignored
      }

      // Add to server store
      const all = communityServerStore.getMembers();
      if (!all.some((m) => m.email && m.email.toLowerCase() === cleanEmail)) {
        all.unshift(newMember);
      }
      member = newMember;
    }

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: cleanEmail,
      },
      member,
      isAdmin,
    });

    // Set cookies for SSR route protection and API headers
    response.cookies.set('tncc_active_user_email', cleanEmail, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    });
    response.cookies.set('tncc_member_id', member.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    });
    if (isAdmin) {
      response.cookies.set('tncc_admin_session', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
      });
    } else {
      response.cookies.delete('tncc_admin_session');
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Support POST as well for explicit triggers
  return GET(request);
}
