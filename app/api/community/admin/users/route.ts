import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';
import { CommunityMember } from '@/tncc-community/lib/types';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const activeEmail = (
    request.cookies.get('tncc_active_user_email')?.value ||
    request.headers.get('x-tncc-user-email') ||
    user?.email ||
    ''
  ).toLowerCase().trim();

  const adminSession = request.cookies.get('tncc_admin_session')?.value;
  const isSuperAdmin = AUTHORIZED_ADMIN_EMAILS.some((e) => e.toLowerCase() === activeEmail);

  if (isSuperAdmin || adminSession === 'true') {
    return { authorized: true, user, activeEmail };
  }

  if (user) {
    try {
      const { data: member } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member?.role === 'admin') {
        return { authorized: true, user, activeEmail };
      }
    } catch {}
  }

  return { authorized: false, user: null, activeEmail: '' };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: dbMembers, error } = await supabase
      .from('community_members')
      .select('*')
      .order('total_xp', { ascending: false });

    if (!error && Array.isArray(dbMembers) && dbMembers.length > 0) {
      return NextResponse.json({ success: true, members: dbMembers });
    }

    // Fallback to serverStore
    return NextResponse.json({ success: true, members: serverStore.getMembers() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      email,
      role = 'member',
      occupation = 'Creator & Designer',
      phone = '',
      gender = 'Male',
      age = 22,
      dob = '',
      location = 'Tamil Nadu',
      login_streak = 0,
      learning_stage = 'Stage 0: Free Member',
      total_xp = 50,
      avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      cover_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      bio = 'Tamil Nadu creator crafting impactful visuals and stories.',
      skills = ['Creator', 'Visual Design'],
      username: customUsername,
    } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: 'Full name and email address are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (customUsername || cleanEmail.split('@')[0] || `creator_${Date.now().toString().slice(-4)}`)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');

    const newId = `mem-${Date.now()}`;
    const newMemberId = `TNCC-2026-${String(Date.now()).slice(-3)}`;

    const memberData: CommunityMember = {
      id: newId,
      member_id: newMemberId,
      username: cleanUsername,
      full_name: full_name.trim(),
      email: cleanEmail,
      avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      cover_url: cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      bio: bio.trim(),
      location: location.trim(),
      skills: Array.isArray(skills) ? skills : [skills],
      total_xp: Number(total_xp) || 50,
      role: role as any,
      created_at: new Date().toISOString(),
      occupation: occupation.trim(),
      phone: phone.trim(),
      gender,
      age: Number(age) || undefined,
      dob: dob || undefined,
      login_streak: Number(login_streak) || 0,
      learning_stage,
      posts_count: 0,
      wins_count: 0,
      challenges_count: 0,
      followers_count: 120,
      following_count: 50,
    };

    // 1. Persist to Supabase
    const supabase = await createClient();
    try {
      await supabase.from('community_members').upsert({
        id: memberData.id,
        member_id: memberData.member_id,
        username: memberData.username,
        full_name: memberData.full_name,
        email: memberData.email,
        avatar_url: memberData.avatar_url,
        cover_url: memberData.cover_url,
        bio: memberData.bio,
        location: memberData.location,
        skills: memberData.skills,
        total_xp: memberData.total_xp,
        role: memberData.role,
        created_at: memberData.created_at,
      });
    } catch {
      // Ignored if table lacks certain columns
    }

    // 2. Persist to serverStore
    serverStore.addMember(memberData);

    return NextResponse.json({
      success: true,
      member: memberData,
      message: 'New creator successfully assigned to community.',
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required for updating.' }, { status: 400 });
    }

    const supabase = await createClient();
    try {
      await supabase
        .from('community_members')
        .update({
          full_name: updates.full_name,
          username: updates.username,
          email: updates.email,
          role: updates.role,
          location: updates.location,
          bio: updates.bio,
          skills: updates.skills,
          total_xp: updates.total_xp,
          avatar_url: updates.avatar_url,
          cover_url: updates.cover_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch {}

    // Update serverStore
    serverStore.updateMember(id, updates);
    const updated = serverStore.getMemberById(id);

    return NextResponse.json({
      success: true,
      member: updated,
      message: 'Creator profile successfully updated.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
