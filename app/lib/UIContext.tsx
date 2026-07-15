'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UIContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  chatOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  // 데스크탑에서 채팅창을 오른쪽에 고정(도킹)할지 여부.
  // Home 화면에서는 false로 두어 채팅을 닫아두고 버튼으로만 연다.
  chatDocked: boolean;
  setChatDocked: (v: boolean) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDocked, setChatDockedState] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleChat = useCallback(() => setChatOpen(v => !v), []);
  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const setChatDocked = useCallback((v: boolean) => setChatDockedState(v), []);

  return (
    <UIContext.Provider value={{
      sidebarOpen, toggleSidebar, closeSidebar,
      chatOpen, toggleChat, openChat, closeChat,
      chatDocked, setChatDocked,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
