import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// (Next.js 16: middleware → proxy 규칙)
// 모든 요청에서 Supabase 세션을 갱신하고, 비로그인 사용자는 /login 으로 보낸다.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAuthRoute = path === '/login' || path.startsWith('/auth');

  // 로그인 안 했는데 인증 페이지가 아니면 → 로그인으로
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // 로그인 했는데 로그인 페이지면 → 홈으로
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  // 정적 파일·이미지·API는 제외
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
