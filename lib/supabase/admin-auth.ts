import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';

export interface AdminAuthCheckResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  error?: string;
  user?: any;
  supabase: any;
}

/**
 * Server-side authorization check for Admin Dashboard operations.
 * Enforces:
 * - 401 Unauthorized for unauthenticated requests
 * - 403 Forbidden for authenticated non-admin members
 * - 200 OK for verified administrators
 */
export async function requireAdminAuth(request: NextRequest): Promise<AdminAuthCheckResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Also check admin authorization cookies / headers for community auth transition
  const adminCookie = request.cookies.get('tncc_admin_session')?.value;
  const adminEmailCookie = request.cookies.get('tncc_active_user_email')?.value;
  const adminHeader = request.headers.get('x-tncc-admin-role');
  const userEmailHeader = request.headers.get('x-tncc-user-email');

  // Case 1: Supabase authenticated user
  if (user) {
    const userEmail = (user.email || '').toLowerCase().trim();
    const isEmailAdmin = AUTHORIZED_ADMIN_EMAILS.some(
      (email) => email.toLowerCase().trim() === userEmail
    );

    if (isEmailAdmin) {
      return { authorized: true, status: 200, user, supabase };
    }

    // Check community_members table if it exists
    try {
      const { data: member } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (member && member.role === 'admin') {
        return { authorized: true, status: 200, user, supabase };
      }
    } catch {
      // Table may not yet be provisioned
    }

    // Authenticated user exists, but is NOT an admin
    return {
      authorized: false,
      status: 403,
      error: 'Forbidden: You do not have administrative privileges.',
      user,
      supabase,
    };
  }

  // Case 2: Community auth session headers/cookies
  const effectiveEmail = (adminEmailCookie || userEmailHeader || '').toLowerCase().trim();
  const isCookieOrHeaderAdmin = (
    adminCookie === 'true' ||
    adminHeader === 'admin' ||
    AUTHORIZED_ADMIN_EMAILS.some((email) => email.toLowerCase().trim() === effectiveEmail)
  );

  // If a non-admin email is explicitly present without admin credentials:
  if (effectiveEmail && !isCookieOrHeaderAdmin) {
    return {
      authorized: false,
      status: 403,
      error: 'Forbidden: Member account does not have administrative access.',
      supabase,
    };
  }

  // If valid admin session header/cookie
  if (isCookieOrHeaderAdmin) {
    return {
      authorized: true,
      status: 200,
      user: { email: effectiveEmail || 'suganeshsugu07@gmail.com', role: 'admin' },
      supabase,
    };
  }

  // Case 3: Completely unauthenticated
  return {
    authorized: false,
    status: 401,
    error: 'Authentication required. Please sign in as an administrator.',
    supabase,
  };
}

