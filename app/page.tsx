'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHuddle } from './context/HuddleContext';

export default function RootIndexPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useHuddle();

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        router.replace('/app');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs animate-pulse">
          H
        </div>
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
