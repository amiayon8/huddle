"use client";

import React from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
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
  const completedTasksCount = sprint.tasks
    ? sprint.tasks.filter((t) => t.completed).length
    : 0;
  const totalTasksCount = sprint.tasks?.length || 4;
  const progressPercent = Math.round(
    (completedTasksCount / totalTasksCount) * 100,
  );
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
      className={`rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-4 sm:p-5 transition-colors ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex items-center gap-3 sm:block shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] p-1 flex items-center justify-center border border-[#BBBCE4]/40 dark:border-[#1d2c4e]">
            <img
              src={currentSvg}
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="sm:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                Spark
              </span>
              <span className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
                AI Companion
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="hidden sm:flex items-center justify-between gap-2 pb-1 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                Spark
              </span>
              <span className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
                Your AI Companion
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#5D6080] dark:text-[#BBBCE4]">
              Lesson {sprint.currentDay || 1} • {progressPercent}% progress
            </span>
          </div>

          <div className="text-xs sm:text-[13px] text-[#06427D] dark:text-[#BBBCE4] leading-relaxed">
            <MarkdownRenderer content={defaultSpeech} />
          </div>

          {showQuickActions && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-[#5420A6]/20"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Ask Spark</span>
              </button>

              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] hover:border-[#5420A6] text-xs font-medium transition-colors cursor-pointer"
              >
                <span>{primaryHobby} analogy</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>

              <button
                onClick={() => setMascotOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] hover:border-[#5420A6] text-xs font-medium transition-colors cursor-pointer"
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
