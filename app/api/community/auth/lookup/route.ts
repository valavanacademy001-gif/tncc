import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { communityServerStore } from '@/lib/supabase/community-server-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = (body.emailOrUsername || '').trim();

    if (!identifier) {
      return NextResponse.json({ error: 'Email or username is required' }, { status: 400 });
    }

    // If identifier is an email (contains @ in the middle, not just a leading @ for handle)
    if (identifier.includes('@') && !identifier.startsWith('@')) {
      let clean = identifier.toLowerCase();
      if (clean.endsWith('@gmailcom')) {
        clean = clean.replace('@gmailcom', '@gmail.com');
      }
      return NextResponse.json({ success: true, email: clean });
    }

    const cleanUsername = identifier.toLowerCase().replace(/^@/, '');

    // 1. Try querying Supabase community_members table
    try {
      const supabase = await createClient();
      const { data: member } = await supabase
        .from('community_members')
        .select('email')
        .ilike('username', cleanUsername)
        .maybeSingle();

      if (member?.email) {
        return NextResponse.json({ success: true, email: member.email.toLowerCase() });
      }
    } catch (dbErr) {
      // Table fallback
    }

    // 2. Try looking up in server store
    const member = communityServerStore.getMembers().find(
      (m) => m.username.toLowerCase() === cleanUsername
    );

    if (member?.email) {
      return NextResponse.json({ success: true, email: member.email.toLowerCase() });
    }

    return NextResponse.json({
      success: false,
      error: `No registered account found with username @${cleanUsername}`,
    }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lookup failed' }, { status: 500 });
  }
}
