"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, ChevronRight } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface DuolingoMascotProps {
  emotion?:
    | "idle"
    | "encouragement"
    | "thinking"
    | "deep_thinking"
    | "planning"
    | "success"
    | "error";
  speechText?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showQuickActions?: boolean;
  className?: string;
}

export const DuolingoMascot: React.FC<DuolingoMascotProps> = ({
  emotion = "encouragement",
  speechText,
  size = "md",
  showQuickActions = true,
  className = "",
}) => {
  const { setMascotOpen, sprint, user } = useHuddle();

  const mascotMap: Record<string, string> = {
    idle: "/mascot_idle.svg",
    encouragement: "/mascot_encouragement.svg",
    thinking: "/mascot_thinking.svg",
    deep_thinking: "/mascot_deep_thinking.svg",
    planning: "/mascot_planning.svg",
    success: "/mascot_success.svg",
    error: "/mascot_error.svg",
  };

  const currentSvg = mascotMap[emotion] || "/mascot_idle.svg";
  const completedTasksCount = sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0;
  const totalTasksCount = sprint.tasks?.length || 4;
  const progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);
  const defaultSpeech =
    speechText ||
    sprint.mascotNarration ||
    `**${progressPercent}% sprint progress**. 20 minutes today advances your deliberate practice.`;

  const survey = user?.surveyData;
  const primaryHobby = survey?.hobbies?.[0] || "Architecture";
  const targetProfession =
    survey?.targetProfession || user?.careerMilestone || "Senior Engineer";

  return (
    <div
      className={`rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-4 sm:p-5 transition-colors ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center gap-3 sm:block shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-1 flex items-center justify-center border border-zinc-200/60 dark:border-zinc-700/60">
            <img
              src={currentSvg}
              alt="Pip AI"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="sm:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Pip
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Sprint Guide
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="hidden sm:flex items-center justify-between gap-2 pb-1 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Pip AI
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Sprint Coach
              </span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500">
              Day {sprint.currentDay || 1} • {progressPercent}% progress
            </span>
          </div>

          <div className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <MarkdownRenderer content={defaultSpeech} />
          </div>

          {showQuickActions && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Ask Pip</span>
              </button>

              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>{primaryHobby} analogy</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>

              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>{targetProfession} context</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
