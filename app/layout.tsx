import type { Metadata } from 'next';
import './globals.css';
import './tokens/spira-tokens.css';
import Sidebar from './components/Sidebar';
import AIChatButton from './components/AIChatButton';
import MainShell from './components/MainShell';
import MobileHeader from './components/MobileHeader';
import { ChatProvider } from './lib/ChatContext';
import { TimerProvider } from './lib/TimerContext';
import { UIProvider } from './lib/UIContext';
import AuthProvider from './components/AuthProvider';
import AppContextBridge from './components/AppContextBridge';

export const metadata: Metadata = {
  title: 'Spira',
  description: '1인 창업가를 위한 사업 운영 OS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" />
      </head>
      <body className="bg-[#F8F8F8] text-neutral-900 antialiased font-sans">
        <AuthProvider>
        <TimerProvider>
          <UIProvider>
          <ChatProvider>
            <Sidebar />
            <MobileHeader />
            <MainShell>{children}</MainShell>
            <AppContextBridge />
            <AIChatButton />
          </ChatProvider>
          </UIProvider>
        </TimerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
