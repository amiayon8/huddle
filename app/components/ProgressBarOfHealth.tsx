"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProgressBarOfHealth: React.FC = () => {
  const { user, sprint } = useHuddle();
  const [expanded, setExpanded] = useState(false);

  const tasks = sprint?.tasks || [];
  const totalTasks = tasks.length || 6;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Calculate overall skill progress percentage
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userLevel = user.surveyData?.level || "Intermediate";
  const skillTitle = sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const dailyTime = user.surveyData?.dailyTime || "30 mins / day";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#11131d]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] transition-all">
      {/* Decorative ambient glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Skill Development Progress
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300">
                  {userLevel}
                </span>
                <span className="text-zinc-400 dark:text-zinc-600 hidden sm:inline">•</span>
                <span className="text-[11px] text-zinc-500 hidden sm:inline">
                  {dailyTime}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Current Focus: <strong className="text-zinc-800 dark:text-zinc-200">{skillTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-indigo-600 dark:text-indigo-400">
                {progressPercent}%
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                Overall Mastery
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 sm:h-3.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_16px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>

          {/* Milestones markers along the bar */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 pt-0.5">
            <span className={completedTasks >= 1 ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}>
              01. Foundation
            </span>
            <span className={completedTasks >= 3 ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}>
              03. Implementation
            </span>
            <span className={completedTasks >= totalTasks ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}>
              0{totalTasks}. Production Proof
            </span>
          </div>
        </div>

        {/* SparkMotivation Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/40 text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src="/mascot_idle.svg"
              alt="Pip"
              className="w-7 h-7 object-contain shrink-0"
            />
            <p className="text-zinc-700 dark:text-zinc-300 text-[11.5px] leading-relaxed">
              <strong>Pip's Growth Rule:</strong> {completedTasks} of {totalTasks} sprint deliverables verified. Complete today's drill to advance your overall skill mastery!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{expanded ? "Hide Breakdown" : "View Breakdown"}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Sprint Breakdown */}
        {expanded && (
          <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.06] space-y-2 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Sprint Roadmap Milestones ({completedTasks}/{totalTasks} Cleared)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${t.completed
                      ? "border-emerald-300/40 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                      : "border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400"
                    }`}
                >
                  <span className="font-bold font-mono text-[10px]">
                    Day 0{t.dayNumber}
                  </span>
                  <span className="truncate flex-1 font-medium">
                    {t.title}
                  </span>
                  {t.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
