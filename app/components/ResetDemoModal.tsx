"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ResetDemoModal: React.FC = () => {
  const router = useRouter();
  const {
    resetDemoModalOpen,
    setResetDemoModalOpen,
    resetDemoAccount,
  } = useHuddle();

  const [loadingAction, setLoadingAction] = useState<
    "reset_stay" | "reset_logout" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!resetDemoModalOpen) return null;

  const handleReset = async (shouldLogout: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingAction(shouldLogout ? "reset_logout" : "reset_stay");

    try {
      const res = await resetDemoAccount(shouldLogout);
      if (!res.success) {
        setErrorMessage(res.error || "Unable to reset demo workspace.");
        setLoadingAction(null);
        return;
      }

      setSuccessMessage(
        shouldLogout
          ? "Demo workspace reset. Signing out..."
          : "Demo workspace returned to starting state.",
      );

      setTimeout(() => {
        setLoadingAction(null);
        setResetDemoModalOpen(false);
        if (shouldLogout) {
          router.push("/auth/login");
        }
      }, 600);
    } catch {
      setErrorMessage("An unexpected error occurred during reset.");
      setLoadingAction(null);
    }
  };

  const handleClose = () => {
    if (loadingAction) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setResetDemoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl shadow-xl p-6 sm:p-7">
        <button
          onClick={handleClose}
          disabled={loadingAction !== null}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] transition-colors disabled:opacity-40 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#BBBCE4]/20 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] p-1 flex items-center justify-center shrink-0">
            <img
              src="/mascot_planning.svg"
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Reset sample data
            </h2>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
              Return your workspace and sample lessons to their starting state.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed">
            This will restore the demo account to its initial state:
          </p>

          <div className="p-3.5 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5] shrink-0" />
              <span>Resets your weekly plan back to Day 1</span>
            </div>
            <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5] shrink-0" />
              <span>Clears completed lesson marks so you can practice again</span>
            </div>
            <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5] shrink-0" />
              <span>Restores focus time metrics and progress counters</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleReset(false)}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-[#5420A6]/20"
          >
            {loadingAction === "reset_stay" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resetting workspace...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset and continue exploring</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleReset(true)}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] text-[#06427D] dark:text-[#e6e9f7] text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === "reset_logout" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resetting and signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Reset and sign out</span>
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            disabled={loadingAction !== null}
            className="w-full py-2 text-center text-xs text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
