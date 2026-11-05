import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/community';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Error exchanging auth code for session:', error);
    } catch (err) {
      console.error('Auth callback exception:', err);
    }
  }

  // If code exchange fails or missing, redirect to auth page with notification
  return NextResponse.redirect(`${origin}/community/auth?error=auth_callback_failed`);
}
