"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  Sparkles,
  Zap,
  Share2,
  ArrowRight,
  X,
  CheckCircle2,
  Heart,
  Flame,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const CelebrationModal: React.FC = () => {
  const {
    celebrationModalOpen,
    celebrationData,
    closeCelebration,
    openShareModal,
    sprint,
    user,
  } = useHuddle();

  useEffect(() => {
    if (celebrationModalOpen) {
      // Fire festive multi-colored confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b"],
        });
      } catch (e) {
        // Fallback gracefully if canvas-confetti is not loaded
      }
    }
  }, [celebrationModalOpen]);

  if (!celebrationModalOpen || !celebrationData) return null;

  const handleShareClick = () => {
    closeCelebration();
    openShareModal({
      milestoneTitle: celebrationData.title,
      skillTitle: sprint.skillTitle,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-[#11131d] p-6 sm:p-7 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeCelebration}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Celebration Glow */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent rounded-t-3xl pointer-events-none" />

        {/* Spark Celebration Avatar */}
        <div className="relative pt-2 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/15 border border-indigo-500/30 p-3 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <img
                src="/mascot_success.svg"
                alt="Spark Celebrating"
                className="w-full h-full object-contain animate-bounce duration-1000"
              />
            </div>
            <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md">
              ✨
            </span>
          </div>
        </div>

        {/* Title & Speech */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
            <Trophy className="w-3 h-3 text-amber-500" />
            <span>Milestone Verified</span>
          </span>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            {celebrationData.title}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto">
            {celebrationData.subtitle}
          </p>
        </div>

        {/* Stat Rewards Badge */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Skill Health
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
              <Heart className="w-3 h-3 fill-current" />
              <span>+{celebrationData.healthBoost || 5}% HP</span>
            </span>
          </div>

          <div className="space-y-0.5 border-x border-zinc-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Streak Active
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-current" />
              <span>{user.streak || 8} Days</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
              Proof Artifact
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>
        </div>

        {/* Spark's Direct Reflection */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-left flex items-start gap-2.5">
          <img
            src="/mascot_idle.svg"
            alt="Spark"
            className="w-6 h-6 object-contain shrink-0 mt-0.5"
          />
          <p className="text-[11.5px] text-amber-950 dark:text-amber-200 leading-snug">
            <strong>Spark:</strong> "Fantastic focus today, {user.name.split(" ")[0]}! Every small milestone adds up to true craft mastery. Take a quick breather or share with your squad!"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleShareClick}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Progress with Friends</span>
          </button>

          <button
            onClick={closeCelebration}
            className="w-full py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};
