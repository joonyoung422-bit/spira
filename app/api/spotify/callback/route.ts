import { NextRequest, NextResponse } from 'next/server';

// In-memory store: exchangeKey → { access_token, refresh_token, expires_in }
// Entries are single-use and expire after 60 seconds
export const pendingTokens = new Map<string, {
  access: string;
  refresh: string;
  expiresIn: number;
  createdAt: number;
}>();

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect('http://localhost:3000/?spotify=error');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    return NextResponse.redirect('http://localhost:3000/?spotify=error');
  }

  const { access_token, refresh_token, expires_in } = await res.json();

  // Store tokens with a random key; client will exchange this key for cookies
  const key = crypto.randomUUID();
  pendingTokens.set(key, {
    access: access_token,
    refresh: refresh_token,
    expiresIn: expires_in,
    createdAt: Date.now(),
  });

  return NextResponse.redirect(`http://localhost:3000/?sp_ready=${key}`);
}
