import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not remove auth.getUser() call.
  // It refreshes the session and keeps the user logged in.
  const { data: { user } } = await supabase.auth.getUser();

  // Protect authenticated-only routes
  const protectedPaths = ['/app', '/onboarding'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/community/auth';
    url.searchParams.set('mode', 'login');
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // ISSUE-02: Server-side route protection for /community/admin
  if (request.nextUrl.pathname.startsWith('/community/admin')) {
    // 1. Unauthenticated -> HTTP 307 redirect to /community/auth
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/community/auth';
      url.searchParams.set('mode', 'login');
      url.searchParams.set('next', '/community/admin');
      return NextResponse.redirect(url, { status: 307 });
    }

    // 2. Validate admin role against trusted server sources (no client cookie bypass)
    const cleanEmail = (user.email || '').toLowerCase().trim();
    const isSuperAdmin = (
      cleanEmail === 'suganeshsugu07@gmail.com' ||
      cleanEmail === 'suganeshsugu07@gmailcom'
    );

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

    if (!isSuperAdmin && !isDbAdmin) {
      // Authenticated non-admin member -> HTTP 307 Forbidden redirect
      const url = request.nextUrl.clone();
      url.pathname = '/community';
      url.searchParams.set('error', 'forbidden_admin_access_required');
      return NextResponse.redirect(url, { status: 307 });
    }
  }

  return supabaseResponse;
}
