'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { createClient } from '../lib/supabase/client';
import { load, writeLocalRaw, setServerPusher, empty } from '../lib/store';
import { pullAppData, upsertAppData } from '../lib/appDataSync';
import type { AppData } from '../lib/types';

const UID_KEY = 'spira_uid';

// 로그인 후 서버(app_data)와 로컬(localStorage)을 동기화한다.
// - 서버에 데이터 있으면 → 로컬을 서버 데이터로 교체
// - 서버가 비어 있고 로컬에 (로그인 전) 데이터가 있으면 → 서버로 이전(1회 마이그레이션)
// - 이후 모든 변경은 디바운스로 서버에 자동 저장
export default function SyncProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [supabase] = useState(() => createClient());
  const [synced, setSynced] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setSynced(false);
      setServerPusher(null);
      return;
    }
    let cancelled = false;

    (async () => {
      const uid = user.id;
      const server = await pullAppData(supabase, uid);
      if (cancelled) return;

      if (server && Array.isArray(server.workspaces) && server.workspaces.length > 0) {
        // 서버가 정본 — 로컬을 서버 데이터로 교체
        try { writeLocalRaw(server); } catch { /* 용량 초과여도 서버 데이터 기준으로 진행 */ }
        localStorage.setItem(UID_KEY, uid);
      } else {
        // 서버 비어 있음
        const prevUid = localStorage.getItem(UID_KEY);
        const localData = load();
        const localHasData = (localData.workspaces?.length ?? 0) > 0;
        if (localHasData && (!prevUid || prevUid === uid)) {
          // 이 사용자의 기존 로컬 데이터(로그인 전 포함)를 서버로 이전
          await upsertAppData(supabase, uid, localData);
          localStorage.setItem(UID_KEY, uid);
        } else {
          // 다른 사용자의 로컬이거나 로컬도 비어 있음 → 빈 상태로 시작
          try { writeLocalRaw(empty); } catch { /* ignore */ }
          localStorage.setItem(UID_KEY, uid);
        }
      }

      // 이후 변경사항을 디바운스(800ms)로 서버에 저장
      setServerPusher((d: AppData) => {
        if (pushTimer.current) clearTimeout(pushTimer.current);
        pushTimer.current = setTimeout(() => { upsertAppData(supabase, uid, d); }, 800);
      });

      if (!cancelled) setSynced(true);
    })();

    return () => {
      cancelled = true;
      setServerPusher(null);
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [user, loading, supabase]);

  // 인증 확인 중이거나, 로그인했지만 아직 동기화 전 → 로딩 화면
  if (loading || (user && !synced)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Spira" className="w-9 h-auto animate-pulse" />
          <p className="text-[13px]" style={{ color: '#9AA39D' }}>불러오는 중…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
