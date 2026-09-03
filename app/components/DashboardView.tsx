"use client";

import React, { useState } from "react";
import {
  Play,
  Users,
  Check,
  RotateCcw,
  FileCode,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  Trophy,
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
    completeSprintTask,
    reshuffleSprint,
    setActiveTab,
    setMascotOpen,
  } = useHuddle();

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}m ${remainderSecs < 10 ? "0" : ""}${remainderSecs}s`;
  };

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const sprintProgressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const activeTask =
    tasks.find((t) => !t.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  if (!activeTask) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-zinc-500">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading sprint...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Sprint Overview */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium text-[11px]">
            Sprint • Day {activeTask.dayNumber} of {sprint.durationDays}
          </span>

          <button
            onClick={() => reshuffleSprint()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors cursor-pointer"
            title="Move this practice without losing your streak"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reschedule</span>
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {sprint.skillTitle}
          </h1>
          <p className="text-xs text-zinc-500">
            Target: <span className="text-zinc-700 dark:text-zinc-300 font-medium">{sprint.careerMilestone}</span>
          </p>
        </div>

        {/* Primary Action */}
        <div className="pt-1">
          {!isSprintComplete ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={() => completeSprintTask(activeTask.id)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start practice • {activeTask.estimatedMinutes} min</span>
              </button>
              <span className="text-xs text-zinc-500">
                {activeTask.title}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sprint finished. {completedCount} of {totalTasks} days complete.</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>Progress</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {completedCount} of {totalTasks} days complete
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

      {/* Pip Mascot Guide */}
      <DuolingoMascot
        emotion={isSprintComplete ? "success" : "encouragement"}
        size="md"
        showQuickActions={true}
      />

      {/* Sequential Practice Path */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Practice path
            </h2>
            <p className="text-xs text-zinc-500">
              Daily 15-to-20 minute sessions.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {completedCount}/{totalTasks}
          </span>
        </div>

        {/* Path Nodes */}
        <div className="relative flex flex-col items-center space-y-8 py-2">
          {tasks.map((task, index) => {
            const isCompleted = task.completed;
            const isCurrent =
              !isCompleted &&
              (index === 0 || tasks[index - 1].completed);
            const isUpcoming = !isCompleted && !isCurrent;
            const isExpanded = expandedTaskId === task.id;

            const offsetClasses =
              index % 2 === 0 ? "sm:-translate-x-10" : "sm:translate-x-10";

            return (
              <div
                key={task.id}
                className={`relative flex flex-col items-center transition-all ${offsetClasses}`}
              >
                {index < tasks.length - 1 && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 -z-0" />
                )}

                {isCurrent && (
                  <div className="mb-1.5 flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-semibold tracking-wide">
                      Current
                    </span>
                  </div>
                )}

                {/* Node Button */}
                <button
                  onClick={() => completeSprintTask(task.id)}
                  className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : isCurrent
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white ring-4 ring-indigo-500/20 shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                  }`}
                  title={isCompleted ? "Completed" : "Start practice"}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Play className="w-4 h-4 ml-0.5" />
                  ) : (
                    <span className="text-sm">{task.dayNumber}</span>
                  )}
                </button>

                {/* Node Details */}
                <div className="mt-2 text-center max-w-xs space-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500">
                    <span>Day {task.dayNumber} • {task.estimatedMinutes} min</span>
                    {task.producesArtifact && (
                      <span className="p-0.5 rounded text-indigo-600 dark:text-indigo-400" title="Produces verified artifact">
                        <FileCode className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? "text-zinc-500 line-through"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <button
                    onClick={() =>
                      setExpandedTaskId(isExpanded ? null : task.id)
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                  >
                    <span>{isExpanded ? "Hide details" : "View details"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left text-xs space-y-1.5 animate-in fade-in">
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11.5px]">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800/60">
                        <img
                          src={task.creatorAvatar}
                          alt={task.creatorName}
                          className="w-3.5 h-3.5 rounded-full object-cover"
                        />
                        <span>By {task.creatorName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Capstone Milestone */}
          <div className="relative flex flex-col items-center pt-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isSprintComplete
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="mt-1.5 text-center">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block">
                Sprint proof
              </span>
              <span className="text-[11px] text-zinc-500">
                Saved to portfolio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Summary */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Squad</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {squad.currentProgress} of {squad.targetProgress} checked in this week.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("squad")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            View squad
          </button>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {squad.activityPings.slice(0, 2).map((ping) => (
            <div
              key={ping.id}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center gap-2.5 text-xs"
            >
              <img
                src={ping.memberAvatar}
                alt={ping.memberName}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate text-[11.5px]">
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
