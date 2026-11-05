import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';

// GET: Administrative overview statistics
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const [
      { count: membersCount },
      { count: challengesCount },
      { count: resourcesCount },
      { count: submissionsCount },
      { count: jobsCount },
      { count: eventsCount },
    ] = await Promise.all([
      auth.supabase.from('community_members').select('*', { count: 'exact', head: true }),
      auth.supabase.from('community_challenges').select('*', { count: 'exact', head: true }),
      auth.supabase.from('community_resources').select('*', { count: 'exact', head: true }),
      auth.supabase.from('community_challenge_submissions').select('*', { count: 'exact', head: true }),
      auth.supabase.from('community_job_offers').select('*', { count: 'exact', head: true }),
      auth.supabase.from('community_events').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total_members: membersCount || 0,
        active_challenges: challengesCount || 0,
        total_resources: resourcesCount || 0,
        total_submissions: submissionsCount || 0,
        total_jobs: jobsCount || 0,
        total_events: eventsCount || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

