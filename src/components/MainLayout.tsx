'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import PersistentAudioDock from './PersistentAudioDock';
import { useAudioPlayer } from './AudioPlayerContext';
import { WeeklyActivity } from '@/lib/types';

export default function MainLayout({
  children,
  activities = [],
}: {
  children: React.ReactNode;
  activities?: WeeklyActivity[];
}) {
  const pathname = usePathname();
  const { isDockVisible, isMinimized } = useAudioPlayer();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  const hasFullDock = isDockVisible && !isMinimized && pathname !== '/radio';
  const hasMiniDock = isDockVisible && isMinimized && pathname !== '/radio';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 transition-all ${hasFullDock ? 'pb-24 sm:pb-20' : hasMiniDock ? 'pb-8' : 'pb-0'}`}>
        {children}
      </main>
      <Footer initialActivities={activities} />
      <PersistentAudioDock />
    </div>
  );
}
