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
        <div className="w-12 h-12 p-1.5 rounded-2xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center">
          <img
            src="/mascot_idle.svg"
            alt="Pip"
            className="w-full h-full object-contain opacity-90"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}
