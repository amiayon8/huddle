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
      <div className="relative w-full max-w-lg rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-7 shadow-xl space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4 border-b border-[#dcdff2] dark:border-[#1d2c4e] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#BBBCE4]/20 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] flex items-center justify-center text-[#5420A6] dark:text-[#A9DAF5]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
                Daily reminders
              </h2>
              <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
                A gentle check-in timed to when you prefer to focus.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDailyNudgeModalOpen(false)}
            className="p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Enable reminders
            </span>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]">
              At most one notification per day, timed to your schedule.
            </p>
          </div>

          <button
            onClick={() =>
              updateDailyNudgeSettings({ enabled: !dailyNudgeSettings.enabled })
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              dailyNudgeSettings.enabled
                ? "bg-[#5420A6]"
                : "bg-[#dcdff2] dark:bg-[#1d2c4e]"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#FFFFFF] dark:bg-[#e6e9f7] transition-transform ${
                dailyNudgeSettings.enabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {dailyNudgeSettings.enabled && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
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
                          ? "border-[#5420A6] bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] font-bold"
                          : "border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33]/50 text-[#06427D] dark:text-[#e6e9f7] hover:border-[#5420A6]"
                      }`}
                    >
                      <div className="font-semibold text-xs">{opt.label}</div>
                      <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
                        {opt.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4]">
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
                          ? "border-[#5420A6] bg-[#BBBCE4]/15 dark:bg-[#141d33]"
                          : "border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33]/50 hover:border-[#5420A6]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#06427D] dark:text-[#e6e9f7]">
                          {vibe.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
                        {vibe.desc}
                      </p>
                      <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/90 mt-1.5 italic">
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
                className="text-xs text-[#5420A6] dark:text-[#A9DAF5] hover:underline font-semibold cursor-pointer"
              >
                {testSent ? "Sample reminder triggered" : "Preview sample reminder"}
              </button>

              <button
                onClick={() => setDailyNudgeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-[#5420A6]/20"
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
