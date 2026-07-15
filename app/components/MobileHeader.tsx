'use client';
import { useUI } from '../lib/UIContext';

export default function MobileHeader() {
  const { toggleSidebar, toggleChat } = useUI();

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-sm border-b border-neutral-200 flex items-center justify-between px-4 z-30">
      <button
        onClick={toggleSidebar}
        className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        aria-label="메뉴 열기"
      >
        <span className="w-5 h-px bg-neutral-900 block" />
        <span className="w-5 h-px bg-neutral-900 block" />
        <span className="w-5 h-px bg-neutral-900 block" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Spira" className="h-5 w-auto" />

      <button
        onClick={toggleChat}
        className="w-9 h-9 flex items-center justify-center"
        aria-label="AI 채팅 열기"
      >
        <svg className="w-5 h-5 text-neutral-700" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
