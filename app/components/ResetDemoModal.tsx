'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RotateCcw, 
  LogOut, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const ResetDemoModal: React.FC = () => {
  const router = useRouter();
  const { 
    resetDemoModalOpen, 
    setResetDemoModalOpen, 
    resetDemoAccount,
    openAuthModal
  } = useHuddle();

  const [loadingAction, setLoadingAction] = useState<'reset_stay' | 'reset_logout' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!resetDemoModalOpen) return null;

  const handleReset = async (shouldLogout: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingAction(shouldLogout ? 'reset_logout' : 'reset_stay');

    try {
      const res = await resetDemoAccount(shouldLogout);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to reset demo account');
        setLoadingAction(null);
        return;
      }

      setSuccessMessage(
        shouldLogout 
          ? 'Demo account reset successfully! Signing out...' 
          : 'Demo account restored to pristine baseline state!'
      );

      setTimeout(() => {
        setLoadingAction(null);
        setResetDemoModalOpen(false);
        if (shouldLogout) {
          router.push('/auth/login');
          openAuthModal('welcome');
        }
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during reset.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 transition-colors">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loadingAction !== null}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img src="/mascot_planning.svg" alt="Pip Planning" className="w-full h-full object-contain drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Full Reset
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                Demo Sandbox
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pip will restore sandbox state back to pristine Day 1
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Description & Reset Checklist */}
        <div className="space-y-3 mb-6">
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            This will reset all progress and database state for the demo account (<code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200">alex@huddle.dev</code>):
          </p>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>4-Day System Architecture sprint checklist reset to Day 1</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Uncompleted sprint tasks ready for fresh deliberate practice</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Auto-assembled portfolio items cleared (retains baseline ADRs)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Micro-squad progress reset to 7/12 & extra pings cleared</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Focus timer & stats restored to baseline</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Reset & Sign Out */}
          <button
            onClick={() => handleReset(true)}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === 'reset_logout' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resetting & Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Full Reset & Sign Out</span>
              </>
            )}
          </button>

          {/* Reset & Stay In App */}
          <button
            onClick={() => handleReset(false)}
            disabled={loadingAction !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:bg-zinc-100 dark:active:bg-zinc-600 text-zinc-800 dark:text-zinc-100 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === 'reset_stay' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>Resetting Demo State...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset & Continue Exploring</span>
              </>
            )}
          </button>

          {/* Cancel */}
          <button
            onClick={handleClose}
            disabled={loadingAction !== null}
            className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
