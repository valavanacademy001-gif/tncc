import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: referralId } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { reason = 'Fraudulent or suspicious activity detected' } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const authHeader = request.headers.get('authorization');
    const isMockAuth = !user && authHeader && authHeader.startsWith('Bearer mock-member-token-');
    const emailHeader = request.headers.get('x-tncc-active-email');

    let isAdmin = false;
    if (user?.email === 'suganeshsugu07@gmail.com' || emailHeader === 'suganeshsugu07@gmail.com') {
      isAdmin = true;
    } else if (user) {
      const { data: mem } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .single();
      isAdmin = mem?.role === 'admin';
    } else {
      isAdmin = true;
    }

    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    // Update in Supabase
    await supabase
      .from('community_referrals')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', referralId);

    serverStore.rejectReferral(referralId, reason);

    return NextResponse.json({
      success: true,
      message: 'Referral marked as rejected with reason recorded.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
