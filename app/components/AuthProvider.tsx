'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
  // 창 포커스/주기적 재요청 비활성화 — dev 서버 재시작 중 세션 폴링 실패(ClientFetchError) 방지
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
