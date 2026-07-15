'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../lib/useStore';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useUI } from '../lib/UIContext';

const nav = [
  { href: '/', label: 'Home', icon: '/home_icon.svg' },
  { href: '/task', label: 'Task', icon: '/task_icon.svg' },
  { href: '/programs', label: 'Goals', icon: '/goals_icon.svg' },
  { href: '/resources', label: 'Resources', icon: '/resources_icon.svg' },
  { href: '/plan', label: 'Plan', icon: '/plan_icon.svg' },
];

function NavIcon({ src, active }: { src: string; active: boolean }) {
  return (
    <span
      aria-hidden
      className="w-5 h-5 transition-colors"
      style={{
        backgroundColor: active ? '#002929' : '#AAAAAA',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
}

export default function Sidebar() {
  const path = usePathname();
  const { data, ready, allWorkspaces, switchWorkspace, addWorkspace } = useStore();
  const { data: session, status } = useSession();
  const { sidebarOpen, closeSidebar } = useUI();
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const wsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!wsOpen && !userOpen) return;
    const handler = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) { setWsOpen(false); setAdding(false); setNewName(''); }
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [wsOpen, userOpen]);

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addWorkspace(name);
    setNewName('');
    setAdding(false);
    setWsOpen(false);
  };

  const workspaceName = ready ? data.workspace?.name : null;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={closeSidebar} />
      )}

      <aside
        style={{ boxShadow: 'var(--spira-shadow-lg)', border: '1px solid var(--spira-border-subtle)' }}
        className={`fixed top-4 bottom-4 z-50 w-[72px] py-6 bg-white rounded-full flex flex-col items-center transition-[left] duration-300 ease-in-out ${sidebarOpen ? 'left-4' : 'left-[-110px]'} lg:left-4`}
      >
        {/* 로고 (클릭 → 워크스페이스 전환) */}
        <div className="relative pb-4" ref={wsRef}>
          <button
            onClick={() => { if (workspaceName) { setWsOpen(o => !o); setAdding(false); setNewName(''); } }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-neutral-100 transition-colors"
            title={workspaceName ?? 'Spira'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Spira" className="w-6 h-auto" />
          </button>

          {wsOpen && (
            <div className="absolute left-full top-4 ml-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-20">
              <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">워크스페이스</p>
              {allWorkspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => { switchWorkspace(ws.id); setWsOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left hover:bg-neutral-100 transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ws.id === data.workspace?.id ? 'bg-violet-600' : 'bg-neutral-300'}`} />
                  <span className={ws.id === data.workspace?.id ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>{ws.name}</span>
                </button>
              ))}
              <div className="border-t border-neutral-200">
                {adding ? (
                  <div className="px-3 py-2">
                    <input
                      ref={inputRef}
                      className="w-full bg-neutral-100 rounded-md px-2 py-1.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-violet-600"
                      placeholder="워크스페이스 이름"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAdd();
                        if (e.key === 'Escape') { setAdding(false); setNewName(''); }
                      }}
                    />
                    <div className="flex gap-1.5 mt-1.5">
                      <button onClick={handleAdd} disabled={!newName.trim()} className="flex-1 py-1 text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-md text-neutral-900 transition-colors">추가</button>
                      <button onClick={() => { setAdding(false); setNewName(''); }} className="flex-1 py-1 text-xs text-neutral-400 hover:text-neutral-800 transition-colors">취소</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAdding(true)} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors">
                    <span>+</span><span>새 워크스페이스</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 로고 하단 헤어라인 구분선 */}
        <div className="w-8 h-px mb-5" style={{ backgroundColor: 'var(--spira-border)' }} />

        {/* 네비게이션 아이콘 (중앙 정렬) */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-[22px]">
          {nav.map(({ href, label, icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                title={label}
                aria-label={label}
                style={active ? { backgroundColor: '#9DFE3B', boxShadow: 'var(--spira-glow-lime)' } : undefined}
                className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-colors ${
                  active ? '' : 'hover:bg-neutral-100'
                }`}
              >
                <NavIcon src={icon} active={active} />
              </Link>
            );
          })}
        </nav>

        {/* 유저 아바타 (최하단) */}
        <div className="relative" ref={userRef}>
          {status === 'loading' ? (
            <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
          ) : session?.user ? (
            <>
              <button onClick={() => setUserOpen(o => !o)} className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 hover:ring-2 hover:ring-neutral-200 transition-all flex items-center justify-center bg-white" title={session.user.name ?? '계정'}>
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm font-extrabold" style={{ background: 'var(--spira-grad-avatar)', color: '#16211E' }}>{session.user.name?.[0] ?? 'S'}</span>
                )}
              </button>
              {userOpen && (
                <div className="absolute left-full bottom-0 ml-2 w-52 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-20">
                  <div className="px-3 py-2.5 border-b border-neutral-100">
                    <p className="text-xs font-medium text-neutral-800 truncate">{session.user.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{session.user.email}</p>
                  </div>
                  <button onClick={() => signOut()} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-neutral-600 hover:bg-neutral-100 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    로그아웃
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => signIn('google')} title="Google로 로그인" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
