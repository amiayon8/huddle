"use client";

import React from "react";
import {
  Check,
  Play,
  Lock,
  Clock,
  BookOpen,
  Award,
  FileText,
  Video,
  ListChecks,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { JourneyStep } from "../types/huddle";
import { DuolingoMascot } from "./DuolingoMascot";

export const JourneyView: React.FC = () => {
  const { roadmap, setSelectedStepModal } = useHuddle();

  const completedCount = roadmap.steps.filter(
    (s) => s.status === "completed",
  ).length;
  const progressPercent = Math.round(
    (completedCount / roadmap.totalSteps) * 100,
  );

  const getStepIcon = (type: JourneyStep["type"]) => {
    switch (type) {
      case "article":
        return FileText;
      case "video":
        return Video;
      case "checklist":
        return ListChecks;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Active Skill Journey
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {roadmap.skillTitle}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {completedCount} of {roadmap.totalSteps} steps completed •{" "}
            {progressPercent}% total progress
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-zinc-500">Roadmap Completion</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <DuolingoMascot
        emotion="planning"
        size="md"
        speechText={`Pip here. Every node in this **${roadmap.skillTitle}** journey is vetted by Staff Engineers. You've cleared **${completedCount}/${roadmap.totalSteps}** steps. Keep momentum going.`}
        showQuickActions={true}
      />

      <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Sprint Cadence Note
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
            You completed 2 steps this week. You are on track to reach the
            Event-Driven Patterns milestone.
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Roadmap Milestones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {roadmap.milestones.map((ms) => (
            <div
              key={ms.id}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                ms.reached
                  ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  ms.reached
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                }`}
              >
                {ms.reached ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>
              <div className="text-xs font-semibold">{ms.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          Timeline and Tasks
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
          {roadmap.steps.map((step) => {
            const Icon = getStepIcon(step.type);
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div key={step.id} className="relative group">
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : isCurrent
                        ? "bg-indigo-600 border-indigo-600 text-white ring-2 ring-indigo-500/20"
                        : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                </div>

                <div
                  onClick={() => setSelectedStepModal(step)}
                  className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all ${
                    isCurrent
                      ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs ring-1 ring-indigo-500/20"
                      : isCompleted
                        ? "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                        : "border-zinc-200 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          Step {step.stepNumber}
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700">
                          •
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          <span className="capitalize">{step.type}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {step.title}
                      </h4>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {step.estimatedMinutes}m
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStepModal(step);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isCurrent
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                            : isCompleted
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {isCurrent
                          ? "Start Task"
                          : isCompleted
                            ? "Review"
                            : "Locked"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <img
                        src={step.creatorAvatar}
                        alt={step.creatorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span>
                        Curated by{" "}
                        <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">
                          {step.creatorName}
                        </strong>
                      </span>
                    </div>

                    {step.completedAt && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Completed {step.completedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
