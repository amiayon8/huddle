"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProgressBarOfHealth: React.FC = () => {
  const { user, sprint } = useHuddle();
  const [expanded, setExpanded] = useState(false);

  const tasks = sprint?.tasks || [];
  const totalTasks = tasks.length || 6;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userLevel = user.surveyData?.level || "Intermediate";
  const skillTitle =
    sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const dailyTime = user.surveyData?.dailyTime || "30 mins / day";

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 space-y-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Your progress
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {userLevel}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">
              •
            </span>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              {dailyTime}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Current topic:{" "}
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">
              {skillTitle}
            </span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
            {progressPercent}%
          </span>
          <span className="block text-[11px] text-zinc-500">
            {completedTasks} of {totalTasks} completed
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span
            className={
              completedTasks >= 1
                ? "text-zinc-700 dark:text-zinc-300 font-medium"
                : ""
            }
          >
            Foundation
          </span>
          <span
            className={
              completedTasks >= Math.ceil(totalTasks / 2)
                ? "text-zinc-700 dark:text-zinc-300 font-medium"
                : ""
            }
          >
            Practice
          </span>
          <span
            className={
              completedTasks >= totalTasks
                ? "text-zinc-700 dark:text-zinc-300 font-medium"
                : ""
            }
          >
            Review
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {completedTasks === totalTasks
            ? "You have completed every milestone for this topic. Feel free to review your work or pick a new area to explore."
            : `You have completed ${completedTasks} of ${totalTasks} daily milestones. A short session today will keep you right on track.`}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
        >
          <span>{expanded ? "Hide details" : "View details"}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 animate-in fade-in duration-100">
          <div className="text-[11px] font-medium text-zinc-500">
            Milestones breakdown
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2.5 ${
                  t.completed
                    ? "border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300"
                    : "border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    Day {t.dayNumber}
                  </span>
                  <span className="truncate font-medium block">
                    {t.title}
                  </span>
                </div>
                {t.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
