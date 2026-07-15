export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state',
  });

  return Response.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
