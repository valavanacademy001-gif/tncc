import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AUTHORIZED_ADMIN_EMAILS } from '@/tncc-community/lib/admin-config';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Suite — Tamil Nadu Creators Club',
  description: 'Administrative management console for TNCC community operations.',
};

/**
 * Server Component Gate for Admin Dashboard.
 * Enforces server-side authorization BEFORE any admin HTML or data is rendered.
 * - Unauthenticated users are redirected to /community/auth?mode=login&next=/community/admin
 * - Authenticated non-admin members are redirected to /community?error=forbidden_admin_access_required
 * - Verified administrators render the interactive AdminDashboardClient
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // 1. Unauthenticated requests -> Server-side HTTP redirect to /community/auth
  if (!user || authError) {
    redirect('/community/auth?mode=login&next=/community/admin');
  }

  // 2. Authenticated user authorization verification
  const cleanEmail = (user.email || '').toLowerCase().trim();
  const isSuperAdmin = AUTHORIZED_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail);

  let isDbAdmin = false;
  try {
    const { data: member } = await supabase
      .from('community_members')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (member?.role === 'admin') {
      isDbAdmin = true;
    }
  } catch {
    // Database check fallback
  }

  // 3. Authenticated normal members -> Server-side redirect to community with error query
  if (!isSuperAdmin && !isDbAdmin) {
    redirect('/community?error=forbidden_admin_access_required');
  }

  // 4. Authorized admin -> Render admin dashboard client
  return <AdminDashboardClient />;
}
