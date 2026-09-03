'use client';

import React from 'react';
import { Sparkles, X, ArrowRight, Lock, ShieldAlert } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const SurveyPromptModal: React.FC = () => {
  const { 
    surveyPromptModalOpen, 
    setSurveyPromptModalOpen, 
    surveyActionAttempted, 
    setOnboardingActive 
  } = useHuddle();

  if (!surveyPromptModalOpen) return null;

  const handleStartSurvey = () => {
    setSurveyPromptModalOpen(false);
    setOnboardingActive(true);
  };

  const handleDismiss = () => {
    setSurveyPromptModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-amber-300 dark:border-amber-900/60 rounded-2xl shadow-2xl p-6 sm:p-7 transition-colors animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Stay in Preview Mode"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Pip Mascot */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <img 
              src="/mascot_planning.svg" 
              alt="Pip Mascot" 
              className="w-full h-full object-contain drop-shadow-xs" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                <Lock className="w-2.5 h-2.5" />
                Action Locked
              </span>
            </div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
              Intake Survey Required
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Must complete survey to perform actions
            </p>
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-1 mb-4 leading-relaxed">
          <p className="font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Cannot {surveyActionAttempted || 'perform this action'} yet</span>
          </p>
          <p className="text-[11.5px] opacity-90">
            Huddle personalizes your 4-day sprint, squad check-ins, and Pip AI concept breakdowns based on your 5-step intake survey. You can browse in preview mode, but actions are locked until completed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleStartSurvey}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 hover:translate-x-0.5 active:translate-x-0 cursor-pointer"
          >
            <span>Complete 1-Minute Survey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2 text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Continue Browsing (Preview Mode)
          </button>
        </div>

      </div>
    </div>
  );
};
