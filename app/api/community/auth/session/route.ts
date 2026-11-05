import { NextResponse, type NextRequest } from 'next/server';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || '').toLowerCase().trim();
    const memberId = body.memberId || '';
    const isAdmin = Boolean(
      body.isAdmin ||
      AUTHORIZED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === email)
    );

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, email, memberId, isAdmin });

    // Set cookies for Edge Middleware and Server Component access
    response.cookies.set('tncc_active_user_email', email, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (memberId) {
      response.cookies.set('tncc_member_id', memberId, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (isAdmin) {
      response.cookies.set('tncc_admin_session', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    } else {
      response.cookies.delete('tncc_admin_session');
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('tncc_active_user_email');
  response.cookies.delete('tncc_member_id');
  response.cookies.delete('tncc_admin_session');
  return response;
}
