"use client";

import React, { useState } from "react";
import {
  X,
  Bell,
  Clock,
  CheckCircle2,
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

  const timeOptions: {
    id: "morning" | "lunch" | "evening" | "night";
    label: string;
    time: string;
  }[] = [
    { id: "morning", label: "Morning", time: "09:00 AM" },
    { id: "lunch", label: "Midday", time: "01:00 PM" },
    { id: "evening", label: "Evening", time: "07:00 PM" },
    { id: "night", label: "Late evening", time: "10:00 PM" },
  ];

  const vibeOptions: {
    id: "encouraging" | "witty" | "minimal";
    title: string;
    desc: string;
    sample: string;
  }[] = [
    {
      id: "encouraging",
      title: "Supportive",
      desc: "Thoughtful and encouraging, celebrating steady progress.",
      sample:
        "15 minutes today keeps your momentum going and builds on what you practiced yesterday.",
    },
    {
      id: "witty",
      title: "Casual",
      desc: "Friendly and relaxed, with zero pressure.",
      sample:
        "Whenever you have a break today, there is a short exercise waiting for you.",
    },
    {
      id: "minimal",
      title: "Concise",
      desc: "Direct and simple, straight to today's focus.",
      sample:
        "Day 2 lesson is ready whenever you have 15 minutes.",
    },
  ];

  const handleTestTrigger = () => {
    triggerInstantNudge();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-6 sm:p-7 shadow-xl space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                Daily reminders
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                A gentle check-in timed to when you prefer to focus.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDailyNudgeModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Enable reminders
            </span>
            <p className="text-xs text-zinc-500">
              At most one notification per day, timed to your schedule.
            </p>
          </div>

          <button
            onClick={() =>
              updateDailyNudgeSettings({ enabled: !dailyNudgeSettings.enabled })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              dailyNudgeSettings.enabled
                ? "bg-indigo-600"
                : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                dailyNudgeSettings.enabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {dailyNudgeSettings.enabled && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-2.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Preferred time of day</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {timeOptions.map((opt) => {
                  const isSelected = dailyNudgeSettings.timeOfDay === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        updateDailyNudgeSettings({ timeOfDay: opt.id })
                      }
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200"
                          : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111218] text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="font-medium text-xs">{opt.label}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {opt.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Reminder tone
              </label>

              <div className="space-y-2">
                {vibeOptions.map((vibe) => {
                  const isSelected = dailyNudgeSettings.vibe === vibe.id;
                  return (
                    <div
                      key={vibe.id}
                      onClick={() =>
                        updateDailyNudgeSettings({ vibe: vibe.id })
                      }
                      className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                          : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-zinc-900 dark:text-zinc-100">
                          {vibe.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {vibe.desc}
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1.5 italic">
                        "{vibe.sample}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTestTrigger}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                {testSent ? "Sample reminder triggered" : "Preview sample reminder"}
              </button>

              <button
                onClick={() => setDailyNudgeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
