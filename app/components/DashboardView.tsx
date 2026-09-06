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
  Sparkles,
  Flame,
  Target,
  Trophy,
  ShieldCheck,
  BookOpen,
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
      <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          <Sparkles className="w-4 h-4 text-indigo-500 absolute inset-0 m-auto animate-pulse" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Syncing Sprint Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Top Hero Sprint Card with Glassmorphic Accent */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#11131d]/90 backdrop-blur-xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] tracking-wide uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400"></span>
                </span>
                Day {activeTask.dayNumber} of {sprint.durationDays}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs">
                {sprint.skillTitle}
              </span>
            </div>

            <button
              onClick={() => reshuffleSprint()}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              title="Reschedule sprint without losing progress"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-300" />
              <span>Reshuffle Sprint</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {sprint.skillTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <span>Target Milestone:</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 font-semibold text-xs">
                {sprint.careerMilestone}
              </span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Delivered
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {completedCount} / {totalTasks} Days
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Today's Deep Focus
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {formatFocusTime(secondsFocusedToday)}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Sprint Streak
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {user?.streak || 1} Days Active
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button or Success Banner */}
          <div className="pt-2">
            {!isSprintComplete ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/60 dark:border-indigo-900/40">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Next Recommended Drill
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {activeTask.title}
                  </div>
                </div>

                <button
                  onClick={() => openPracticeSession(activeTask, false)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Practice Session</span>
                  <span className="text-indigo-200 font-normal">
                    ({activeTask.estimatedMinutes}m)
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">
                    Sprint Completed Successfully!
                  </div>
                  <div className="text-emerald-700/80 dark:text-emerald-300/80 font-normal">
                    All {totalTasks} deliverables verified and added to your
                    career portfolio.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar with Glow */}
          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Curriculum Completion</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {sprintProgressPercent}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                style={{ width: `${sprintProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pip Mascot Companion */}
      <DuolingoMascot
        emotion={isSprintComplete ? "success" : "encouragement"}
        size="md"
        showQuickActions={true}
      />

      {/* 4-Day Sprint Schedule Timeline */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#11131d]/90 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.06] pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>4-Day Deliberate Practice Schedule</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Daily structured modules with verified engineering deliverables.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 tabular-nums">
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
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isCurrent
                    ? "border-indigo-500/80 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm"
                    : isCompleted
                      ? "border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-85 hover:opacity-100"
                      : "border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => openPracticeSession(task, isCompleted)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isCurrent
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30"
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
                        <span className="text-xs font-bold font-mono">
                          0{task.dayNumber}
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                          Day {task.dayNumber} • {task.estimatedMinutes}m drill
                        </span>
                        {task.producesArtifact && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            <FileCode className="w-3 h-3 text-indigo-500" />
                            <span>Artifact</span>
                          </span>
                        )}
                        {progress?.videoCompleted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                            Watched
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold truncate ${
                          isCompleted
                            ? "text-zinc-400 dark:text-zinc-500 line-through"
                            : "text-zinc-950 dark:text-zinc-100"
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <button
                      onClick={() => openPracticeSession(task, isCompleted)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                          : isCurrent
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
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
                  <div className="px-5 pb-4 pt-2 border-t border-zinc-100 dark:border-white/[0.06] text-xs space-y-3 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {task.description}
                    </p>

                    {progress?.reflectionNotes && (
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0c0d12] border border-zinc-200/60 dark:border-zinc-800 space-y-1 shadow-xs">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Saved Reflection</span>
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs italic">
                          "{progress.reflectionNotes}"
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

          {/* Capstone Deliverable Card */}
          <div className="rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSprintComplete
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60"
                }`}
              >
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Capstone Sprint Deliverable
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Verified proof artifact automatically showcased on your public
                  engineering portfolio.
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("profile")}
              className="px-3.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Micro-Squad Peer Sync */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#11131d]/90 backdrop-blur-xl p-6 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Micro-Squad Sync Room
              </h3>
              <span className="text-[11px] text-zinc-500">
                {squad.name} • {squad.currentProgress}/{squad.targetProgress}{" "}
                milestones completed
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("squad")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Open Squad Room</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {squad.activityPings.slice(0, 2).map((ping) => (
            <div
              key={ping.id}
              className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/60 flex items-center gap-3 text-xs"
            >
              <img
                src={ping.memberAvatar}
                alt={ping.memberName}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-xs">
                  {ping.memberName}
                </div>
                <div className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate">
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

