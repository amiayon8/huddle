'use client';

import React from 'react';
import { Sparkles, X, ArrowRight, Zap, CheckCircle2, HeartHandshake, SlidersHorizontal } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const MascotDrawer: React.FC = () => {
  const { mascotOpen, setMascotOpen, mascotMessages, setSelectedStepModal, roadmap, completeStep } = useHuddle();

  if (!mascotOpen) return null;

  const currentStep = roadmap.steps.find(s => s.status === 'current') || roadmap.steps[2];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Pip Mascot Support
              </h3>
              <p className="text-[11px] text-zinc-500">
                Your supportive learning companion
              </p>
            </div>
          </div>

          <button
            onClick={() => setMascotOpen(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              <HeartHandshake className="w-4 h-4 text-indigo-500" />
              Daily Reflection
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Nice work. You are on a 5-day streak. That is another step finished this week.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              Journey Pacing Suggestion
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You are moving faster than expected this week. Want to shorten tomorrow session duration from 25m to 15m?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setMascotOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Shorten session
              </button>
              <button
                onClick={() => setMascotOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Keep current pace
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Recommended Next Action
            </div>
            <div className="text-xs text-zinc-500">
              {currentStep.title} ({currentStep.estimatedMinutes} mins)
            </div>
            <button
              onClick={() => {
                setMascotOpen(false);
                setSelectedStepModal(currentStep);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold"
            >
              Start Session Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 text-center">
        Pip provides proactive guidance, not intrusive prompt bots.
      </div>

    </div>
  );
};
