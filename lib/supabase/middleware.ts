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
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ISSUE-02 / ISSUE-10: Server-side route protection for /community/admin
  if (request.nextUrl.pathname.startsWith('/community/admin')) {
    // Check Supabase session first
    const isSupabaseAdmin = user?.email && (
      user.email.toLowerCase() === 'suganeshsugu07@gmail.com' ||
      user.email.toLowerCase() === 'suganeshsugu07@gmailcom'
    );

    // Also check community admin session cookie for hybrid transition
    const adminSessionCookie = request.cookies.get('tncc_admin_session')?.value;
    const activeEmailCookie = request.cookies.get('tncc_active_user_email')?.value;
    const isCookieAdmin = (
      adminSessionCookie === 'true' ||
      (activeEmailCookie && activeEmailCookie.toLowerCase() === 'suganeshsugu07@gmail.com')
    );

    if (!user && !isCookieAdmin) {
      // Unauthenticated visitor -> redirect to community login with return URL
      const url = request.nextUrl.clone();
      url.pathname = '/community/auth';
      url.searchParams.set('mode', 'login');
      url.searchParams.set('next', '/community/admin');
      return NextResponse.redirect(url);
    }

    if (user && !isSupabaseAdmin && !isCookieAdmin) {
      // Authenticated non-admin member -> 403 Forbidden redirect
      const url = request.nextUrl.clone();
      url.pathname = '/community';
      url.searchParams.set('error', 'forbidden_admin_access_required');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
