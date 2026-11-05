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

  // 1. Unauthenticated -> 401 Unauthorized
  if (!user || authError) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Authentication required. Please sign in as an administrator.',
      supabase,
    };
  }

  // 2. Verified Super Admin email check
  const userEmail = (user.email || '').toLowerCase().trim();
  const isSuperAdmin = AUTHORIZED_ADMIN_EMAILS.some(
    (email) => email.toLowerCase().trim() === userEmail
  );

  if (isSuperAdmin) {
    return { authorized: true, status: 200, user, supabase };
  }

  // 3. Database admin verification via community_admins table
  try {
    const { data: adminRecord } = await supabase
      .from('community_admins')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminRecord) {
      return { authorized: true, status: 200, user, supabase };
    }
  } catch {
    // Table may not yet be provisioned
  }

  // 4. Database admin verification via community_members table
  try {
    const { data: member } = await supabase
      .from('community_members')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (member && member.role === 'admin') {
      return { authorized: true, status: 200, user, supabase };
    }
  } catch {
    // Fallback
  }

  // 5. Authenticated non-admin member -> 403 Forbidden
  return {
    authorized: false,
    status: 403,
    error: 'Forbidden: You do not have administrative privileges.',
    user,
    supabase,
  };
}

