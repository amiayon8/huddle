"use client";

import React, { useState } from "react";
import {
  Play,
  Users,
  Check,
  RotateCcw,
  FileCode,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Video,
  ArrowRight,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";

export const DashboardView: React.FC = () => {
  const {
    user,
    sprint,
    squad,
    secondsFocusedToday,
    isTimerRunning,
    isAppFocused,
    toggleFocusTimer,
    openPracticeSession,
    practiceProgressMap,
    reshuffleSprint,
    setActiveTab,
  } = useHuddle();

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const formatFocusTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
  };

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const sprintProgressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const activeTask =
    tasks.find((task) => !task.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  if (!activeTask) {
    return (
      <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-zinc-500">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading sprint...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[11px] tracking-wide uppercase">
              Day {activeTask.dayNumber} of {sprint.durationDays}
            </span>
            <span className="text-zinc-400 dark:text-zinc-500">•</span>
            <span className="text-zinc-500 font-medium text-xs">
              {sprint.skillTitle}
            </span>
          </div>

          <button
            onClick={() => reshuffleSprint()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors cursor-pointer"
            title="Reschedule sprint without losing progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reschedule</span>
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {sprint.skillTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Target milestone:{" "}
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">
              {sprint.careerMilestone}
            </span>
          </p>
        </div>

        <div className="pt-2">
          {!isSprintComplete ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={() => openPracticeSession(activeTask, false)}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Day {activeTask.dayNumber} Practice</span>
                <span className="text-indigo-200 font-normal">
                  ({activeTask.estimatedMinutes} min)
                </span>
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {activeTask.title}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Sprint completed. {completedCount} of {totalTasks} deliverables
                verified.
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Sprint Progress</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {completedCount} of {totalTasks} days completed (
              {sprintProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${sprintProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <DuolingoMascot
        emotion={isSprintComplete ? "success" : "encouragement"}
        size="md"
        showQuickActions={true}
      />

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              4-Day Sprint Schedule
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Daily structured deliberate practice modules with verified
              deliverables.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {completedCount}/{totalTasks} Complete
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isCompleted = task.completed;
            const isCurrent =
              !isCompleted && (index === 0 || tasks[index - 1].completed);
            const isExpanded = expandedTaskId === task.id;
            const progress = practiceProgressMap[task.id];

            return (
              <div
                key={task.id}
                className={`rounded-lg border transition-all ${
                  isCurrent
                    ? "border-indigo-500/60 bg-indigo-50/20 dark:bg-indigo-950/15"
                    : isCompleted
                      ? "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20"
                      : "border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-[#111218]"
                }`}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => openPracticeSession(task, isCompleted)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
                      }`}
                      title={
                        isCompleted
                          ? "Review completed practice"
                          : "Start practice"
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <span className="text-xs font-semibold">
                          {task.dayNumber}
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-500">
                          Day {task.dayNumber} • {task.estimatedMinutes} min
                        </span>
                        {task.producesArtifact && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            <FileCode className="w-3 h-3" />
                            <span>Artifact</span>
                          </span>
                        )}
                        {progress?.videoCompleted && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            Watched
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-600 text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold truncate ${
                          isCompleted
                            ? "text-zinc-500 dark:text-zinc-400 line-through"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <button
                      onClick={() => openPracticeSession(task, isCompleted)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isCompleted
                          ? "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                          : isCurrent
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {isCompleted ? "Review" : "Start"}
                    </button>

                    <button
                      onClick={() =>
                        setExpandedTaskId(isExpanded ? null : task.id)
                      }
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-2.5">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {task.description}
                    </p>

                    {progress?.reflectionNotes && (
                      <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px]">
                          Saved Reflection:
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs italic">
                          {progress.reflectionNotes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                      <img
                        src={task.creatorAvatar}
                        alt={task.creatorName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>Curated by {task.creatorName}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSprintComplete
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Capstone Sprint Deliverable
                </span>
                <span className="text-[11px] text-zinc-500">
                  Verified proof artifact saved to your engineering profile.
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("profile")}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Micro-Squad Sync
            </h3>
            <span className="text-xs text-zinc-400">•</span>
            <span className="text-xs text-zinc-500">
              {squad.currentProgress}/{squad.targetProgress} active
            </span>
          </div>

          <button
            onClick={() => setActiveTab("squad")}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Open Squad Room
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {squad.activityPings.slice(0, 2).map((ping) => (
            <div
              key={ping.id}
              className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3 text-xs"
            >
              <img
                src={ping.memberAvatar}
                alt={ping.memberName}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-xs">
                  {ping.memberName}
                </div>
                <div className="text-zinc-500 text-[11px] truncate">
                  {ping.actionText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
