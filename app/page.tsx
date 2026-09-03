"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHuddle } from "./context/HuddleContext";

export default function RootIndexPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useHuddle();

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        router.replace("/app");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 p-1 rounded-2xl bg-white dark:bg-[#111218] border border-indigo-200 dark:border-indigo-800/60 shadow-lg flex items-center justify-center animate-bounce">
          <img
            src="/mascot_idle.svg"
            alt="Pip"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Starting Huddle with Pip...</span>
        </div>
      </div>
    </div>
  );
}
