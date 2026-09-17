"use client";

import React, { useState } from "react";
import {
  Play,
  Check,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Target,
  BookOpen,
  Zap,
  Bell,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { ProgressBarOfHealth } from "./ProgressBarOfHealth";
import { SprintTaskModal } from "./SprintTaskModal";
import { SprintTask } from "../types/huddle";

export const DashboardView: React.FC = () => {
  const {
    user,
    sprint,
    reshuffleSprint,
    activeNudge,
    dismissActiveNudge,
    setDailyNudgeModalOpen,
    setMascotOpen,
  } = useHuddle();

  const [activeModalTask, setActiveModalTask] = useState<SprintTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length || 6;
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  // Determine Today's active task (first uncompleted task or last task if complete)
  const todayTask =
    tasks.find((task) => !task.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  const openTaskRunner = (task: SprintTask) => {
    setActiveModalTask(task);
    setIsTaskModalOpen(true);
  };

  const userSkill = sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";
  const userGoal = user.surveyData?.goal || user.primaryGoal || "Build real-world projects";
  const dailyTime = user.surveyData?.dailyTime || "30 mins / day";
  const learningPreference = user.surveyData?.learningPreference || "Hands-on projects & practice";

  if (!todayTask) {
    return (
      <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <div className="w-10 h-10 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Syncing Sprint Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Feature 6: Visual Progress Bar of Skill Development */}
      <ProgressBarOfHealth />

      {/* Feature 4: Smart Notification Reminder Banner */}
      {activeNudge && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-purple-500/10 border border-amber-200/70 dark:border-amber-900/50 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Pip's Learning Reminder
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-[10px] text-zinc-500">{activeNudge.timeText}</span>
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium text-xs truncate sm:whitespace-normal">
                {activeNudge.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setDailyNudgeModalOpen(true)}
              className="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-white/60 dark:bg-zinc-900/60 text-amber-900 dark:text-amber-200 font-semibold text-[11px] hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Adjust Time
            </button>
            <button
              onClick={dismissActiveNudge}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[11px] font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Feature 3: AI Skill Sprinter (Pip's Personalized Sprint Synthesis) */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#11131d]/90 backdrop-blur-xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] tracking-wide uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400" />
                </span>
                AI Skill Sprinter
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs">
                Pip's Adaptive Path
              </span>
            </div>

            <button
              onClick={() => reshuffleSprint()}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              title="Reshuffle or regenerate sprint"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adapt Sprint</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
                {userSkill}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex flex-wrap items-center gap-2">
                <span>Goal:</span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-bold text-xs">
                  {userGoal}
                </span>
                <span>•</span>
                <span>Level: <strong>{userLevel}</strong></span>
                <span>•</span>
                <span>Pace: <strong>{dailyTime}</strong></span>
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-center flex-1 sm:flex-initial">
                <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Cleared
                </span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  {completedCount} / {totalTasks} Days
                </span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-center flex-1 sm:flex-initial">
                <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Streak
                </span>
                <span className="text-sm font-black text-amber-500 flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{user.streak || 1}d</span>
                </span>
              </div>
            </div>
          </div>

          {/* Today's Recommended Drill Banner */}
          {!isSprintComplete ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/70 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Today's Focus • Day {todayTask.dayNumber}</span>
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {todayTask.title}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {todayTask.description}
                </p>
              </div>

              <button
                onClick={() => openTaskRunner(todayTask)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Today's Drill</span>
                <span className="text-indigo-200 font-normal">
                  ({todayTask.estimatedMinutes}m)
                </span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Sprint Cleared Successfully!</div>
                  <div className="text-emerald-700/80 dark:text-emerald-300/80 font-normal">
                    All {totalTasks} daily milestones completed. Sparkis ready for your next skill sprint!
                  </div>
                </div>
              </div>

              <button
                onClick={() => reshuffleSprint()}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Sprint</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature 5: Adaptive Skill Sprint (Simple 5-7 Day Path) */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#11131d]/90 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.06] pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Adaptive Skill Sprint ({totalTasks}-Day Path)</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Today is highlighted and active; future days stay simple and greyed.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 tabular-nums">
            {completedCount}/{totalTasks} Cleared
          </span>
        </div>

        {/* The 5-7 Day Sprint Path */}
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isCompleted = task.completed;
            const isToday = task.id === todayTask?.id && !isCompleted;
            const isFuture = !isCompleted && !isToday;
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${isToday
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10"
                    : isCompleted
                      ? "border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10 opacity-90"
                      : "border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-900/20 opacity-60"
                  }`}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Day status badge / button */}
                    <button
                      onClick={() => !isFuture && openTaskRunner(task)}
                      disabled={isFuture}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isCompleted
                          ? "bg-emerald-600 text-white shadow-xs cursor-pointer"
                          : isToday
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400 cursor-pointer animate-pulse"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                        }`}
                      title={
                        isCompleted
                          ? "Review completed drill"
                          : isToday
                            ? "Today's Active Drill"
                            : "Future Day (Simple / Greyed)"
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : isToday ? (
                        <span className="text-xs font-bold font-mono">0{task.dayNumber}</span>
                      ) : (
                        <Lock className="w-4 h-4 opacity-50" />
                      )}
                    </button>

                    {/* Day Info */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[11px] font-semibold ${isToday ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500 dark:text-zinc-400"}`}>
                          Day 0{task.dayNumber} • {task.estimatedMinutes}m
                        </span>

                        {isToday && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                            TODAY
                          </span>
                        )}

                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            CLEARED
                          </span>
                        )}

                        {isFuture && (
                          <span className="text-[10px] text-zinc-400">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold truncate ${isToday
                            ? "text-zinc-950 dark:text-white font-bold"
                            : isCompleted
                              ? "text-zinc-600 dark:text-zinc-300 line-through decoration-zinc-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions on right */}
                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    {isToday && (
                      <button
                        onClick={() => openTaskRunner(task)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Start Today</span>
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        onClick={() => openTaskRunner(task)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    )}

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
                  <div className="px-5 pb-4 pt-2 border-t border-zinc-100 dark:border-white/[0.06] text-xs space-y-2 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span>Curated by {task.creatorName}</span>
                      <span>Estimated focus: {task.estimatedMinutes} minutes</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Execution Modal */}
      <SprintTaskModal
        task={activeModalTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
