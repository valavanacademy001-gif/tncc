import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { serverStore } from '@/lib/supabase/community-server-store';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { referral_code } = body;

    if (!referral_code || typeof referral_code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Referral code is required' }, { status: 400 });
    }

    const cleanCode = referral_code.trim().toUpperCase();

    // Query Supabase community_referral_codes
    const { data: dbCode, error } = await supabase
      .from('community_referral_codes')
      .select(`
        referral_code,
        community_members (
          full_name,
          username
        )
      `)
      .eq('referral_code', cleanCode)
      .single();

    if (!error && dbCode) {
      const mem = Array.isArray(dbCode.community_members) ? dbCode.community_members[0] : dbCode.community_members;
      return NextResponse.json({
        valid: true,
        referral_code: cleanCode,
        referrer_name: mem?.full_name || `@${mem?.username || 'member'}`,
      });
    }

    // Check serverStore
    const allMembers = serverStore.getMembers();
    const match = allMembers.find(
      (m) =>
        cleanCode === `TNCC-${m.username.toUpperCase().replace(/[^A-Z0-9]/g, '')}` ||
        cleanCode === `TNCC-${m.username.toUpperCase()}`
    );

    if (match) {
      return NextResponse.json({
        valid: true,
        referral_code: cleanCode,
        referrer_name: match.full_name,
      });
    }

    return NextResponse.json({ valid: false, message: 'Invalid or expired referral code' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
