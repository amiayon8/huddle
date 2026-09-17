"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  Volume2,
  Smile,
  Shield,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const DailyNudgeModal: React.FC = () => {
  const {
    dailyNudgeModalOpen,
    setDailyNudgeModalOpen,
    dailyNudgeSettings,
    updateDailyNudgeSettings,
    triggerInstantNudge,
  } = useHuddle();

  const [testSent, setTestSent] = useState(false);

  if (!dailyNudgeModalOpen) return null;

  const timeOptions: { id: "morning" | "lunch" | "evening" | "night"; label: string; time: string; icon: string }[] = [
    { id: "morning", label: "Morning Momentum", time: "09:00 AM", icon: "☕" },
    { id: "lunch", label: "Lunchtime Focus", time: "01:00 PM", icon: "🥪" },
    { id: "evening", label: "Evening Winddown", time: "07:00 PM", icon: "🌆" },
    { id: "night", label: "Night Owl Sprint", time: "10:00 PM", icon: "🌙" },
  ];

  const vibeOptions: { id: "encouraging" | "witty" | "minimal"; title: string; desc: string; sample: string }[] = [
    {
      id: "encouraging",
      title: "Warm & Supportive",
      desc: "Positive, habit-building, celebrates small wins.",
      sample: "⚡ Pip: 15 minutes today keeps your sprint momentum intact and shields your mastery progress!",
    },
    {
      id: "witty",
      title: "Fun & Playful",
      desc: "Fun, friendly analogies to keep learning enjoyable.",
      sample: "☕ Pip: Coffee is brewed! Just 1 quick drill today whenever you're ready—zero pressure.",
    },
    {
      id: "minimal",
      title: "Direct & Gentle",
      desc: "One sentence, no demands, straight to today's focus.",
      sample: "🎯 Pip: Day 2 sprint drill ready whenever you have 15 minutes.",
    },
  ];

  const currentSample = vibeOptions.find((v) => v.id === dailyNudgeSettings.vibe)?.sample || vibeOptions[0].sample;

  const handleTestTrigger = () => {
    triggerInstantNudge();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <span>Daily Learning Nudge</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                  Zero Guilt
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Sparkreminds you at the right time in a fun, non-demanding way.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDailyNudgeModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Enable Daily Nudges
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Never spammy. Maximum 1 prompt per day, timed to your peak focus window.
            </p>
          </div>

          <button
            onClick={() =>
              updateDailyNudgeSettings({ enabled: !dailyNudgeSettings.enabled })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${dailyNudgeSettings.enabled
                ? "bg-indigo-600"
                : "bg-zinc-300 dark:bg-zinc-700"
              }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${dailyNudgeSettings.enabled ? "translate-x-5" : ""
                }`}
            />
          </button>
        </div>

        {/* Time of Day options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Optimal Study Rhythm</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateDailyNudgeSettings({ timeOfDay: opt.id })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${dailyNudgeSettings.timeOfDay === opt.id
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#0c0d12]"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-[10px] font-mono font-semibold text-zinc-400">
                    {opt.time}
                  </span>
                </div>
                <div className="text-xs font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Vibe selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            <span>Spark's Tone & Personality</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {vibeOptions.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => updateDailyNudgeSettings({ vibe: vibe.id })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${dailyNudgeSettings.vibe === vibe.id
                    ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#0c0d12]"
                  }`}
              >
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {vibe.title}
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                  {vibe.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Nudge Preview</span>
            </span>
            <span className="text-[10px] text-zinc-400">Notification Card</span>
          </div>
          <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
            {currentSample}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleTestTrigger}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{testSent ? "Dispatched!" : "Test Nudge Now"}</span>
          </button>

          <button
            type="button"
            onClick={() => setDailyNudgeModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
