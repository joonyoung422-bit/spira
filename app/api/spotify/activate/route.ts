import { NextRequest, NextResponse } from 'next/server';
import { pendingTokens } from '../callback/route';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'missing key' }, { status: 400 });

  const entry = pendingTokens.get(key);
  if (!entry) return NextResponse.json({ error: 'invalid or expired key' }, { status: 400 });

  // Single-use: delete immediately
  pendingTokens.delete(key);

  // Expire keys older than 60 seconds just in case
  if (Date.now() - entry.createdAt > 60_000) {
    return NextResponse.json({ error: 'key expired' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('sp_access', entry.access, {
    httpOnly: true,
    maxAge: entry.expiresIn,
    path: '/',
    sameSite: 'lax',
  });
  response.cookies.set('sp_refresh', entry.refresh, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 60,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
