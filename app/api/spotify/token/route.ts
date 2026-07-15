import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const access = request.cookies.get('sp_access')?.value;
  if (access) return NextResponse.json({ token: access });

  const refresh = request.cookies.get('sp_refresh')?.value;
  if (!refresh) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: 'refresh_failed' }, { status: 401 });

  const { access_token, expires_in } = await res.json();

  const response = NextResponse.json({ token: access_token });
  response.cookies.set('sp_access', access_token, {
    httpOnly: true,
    maxAge: expires_in,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
