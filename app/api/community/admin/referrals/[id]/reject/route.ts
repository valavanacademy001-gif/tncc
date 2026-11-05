import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/supabase/admin-auth';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = auth.supabase;
  try {
    const { id: referralId } = await params;
    const body = await request.json();
    const { reason = 'Fraudulent or suspicious activity detected' } = body;

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

