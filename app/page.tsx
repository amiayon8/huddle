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
    <div className="min-h-screen bg-[#f6f7fc] dark:bg-[#080c18] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 p-1.5 rounded-2xl bg-white dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-xs flex items-center justify-center">
          <img
            src="/mascot_idle.svg"
            alt="Spark"
            className="w-full h-full object-contain opacity-90"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5D6080] dark:text-[#9aa0c4]">
          <div className="w-3 h-3 border-2 border-[#5420A6] border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}
