"use client";

import React, { useState } from "react";
import {
  Check,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bell,
  Users,
  Video,
  FileText,
  BookOpen,
  FileCode,
  ExternalLink,
  Upload,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { ProgressBarOfHealth } from "./ProgressBarOfHealth";
import { SprintTaskModal } from "./SprintTaskModal";
import { SprintTask, TaskResource } from "../types/huddle";

export const DashboardView: React.FC = () => {
  const {
    user,
    sprint,
    reshuffleSprint,
    activeNudge,
    dismissActiveNudge,
    setDailyNudgeModalOpen,
    setActiveTab,
    squad,
    checkInSquad,
    completeSprintTask,
  } = useHuddle();

  const [activeModalTask, setActiveModalTask] = useState<SprintTask | null>(
    null,
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [inlineEvidence, setInlineEvidence] = useState<Record<string, string>>(
    {},
  );
  const [inlineVerifying, setInlineVerifying] = useState<
    Record<string, boolean>
  >({});
  const [inlineFeedback, setInlineFeedback] = useState<Record<string, string>>(
    {},
  );
  const [inlineSubtasks, setInlineSubtasks] = useState<Record<string, boolean>>(
    {},
  );

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length || 6;
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  const todayTask =
    tasks.find((task) => !task.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  const openTaskRunner = (task: SprintTask) => {
    setActiveModalTask(task);
    setIsTaskModalOpen(true);
  };

  const userSkill =
    sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";
  const userGoal =
    user.surveyData?.goal || user.primaryGoal || "Build real-world projects";
  const dailyTime = user.surveyData?.dailyTime || "30 mins / day";

  const toggleSubtaskInline = (subtaskId: string) => {
    setInlineSubtasks((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }));
  };

  const handleInlineSubmitEvidence = (task: SprintTask) => {
    const evidenceText = inlineEvidence[task.id] || "";
    if (!evidenceText.trim() && !task.completed) {
      setInlineFeedback((prev) => ({
        ...prev,
        [task.id]:
          "Please provide a link, screenshot, or completed work description for Spark to verify.",
      }));
      return;
    }

    setInlineVerifying((prev) => ({ ...prev, [task.id]: true }));
    setInlineFeedback((prev) => ({
      ...prev,
      [task.id]: "Spark is evaluating your submission...",
    }));

    setTimeout(() => {
      completeSprintTask(
        task.id,
        undefined,
        undefined,
        evidenceText.trim() || "Verified proof of completion",
      );
      setInlineVerifying((prev) => ({ ...prev, [task.id]: false }));
      setInlineFeedback((prev) => ({
        ...prev,
        [task.id]: "Spark verified your work! Task marked as completed.",
      }));
    }, 850);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-3.5 h-3.5 text-rose-500" />;
      case "doc":
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case "tutorial":
        return <BookOpen className="w-3.5 h-3.5 text-amber-500" />;
      case "example":
      case "file":
      default:
        return <FileCode className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  if (!todayTask) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-zinc-500">Loading your plan...</span>
      </div>
    );
  }

  const squadMembersCount = squad?.members?.length || 4;
  const squadCheckedIn =
    squad?.members?.filter((m) => m.checkedInToday).length || 1;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150 select-none">
      <ProgressBarOfHealth />

      {activeNudge && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Daily reminder
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-zinc-500">{activeNudge.timeText}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {activeNudge.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setDailyNudgeModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Change time
            </button>
            <button
              onClick={dismissActiveNudge}
              className="px-2.5 py-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500">
              Active Sprint • Short-term execution
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {userSkill}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 pt-1">
              <span>Goal:</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {userGoal}
              </span>
              <span>•</span>
              <span>Level: {userLevel}</span>
              <span>•</span>
              <span>Pace: {dailyTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">
                  Completed
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {completedCount} of {totalTasks} milestones
                </span>
              </div>
              <div className="h-7 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">
                  Progress
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {Math.round((completedCount / Math.max(1, totalTasks)) * 100)}
                  %
                </span>
              </div>
            </div>

            <button
              onClick={() => reshuffleSprint()}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Adjust your plan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {squad?.name || "Sprint Accountability Squad"}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/30">
                  {squadCheckedIn} of {squadMembersCount} active
                </span>
              </div>
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                Practice alongside peers focusing on{" "}
                {squad?.skillFocus || userSkill}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => checkInSquad()}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Daily Check-in
            </button>
            <button
              onClick={() => setActiveTab("squad")}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Open Squad</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
              Today's Execution
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Structured tasks with Spark's guidance, curated resources, and
              proof-based completion.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {completedCount} of {totalTasks} completed
          </span>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => {
            const isCompleted = task.completed;
            const isToday = task.id === todayTask?.id && !isCompleted;
            const isExpanded =
              expandedTaskId === task.id ||
              (isToday && expandedTaskId === null);

            const sparkGuidance = task.sparkGuidance || {
              overview: `Understand the core requirements for "${task.title}". Complete the steps with deliberate attention to detail before verifying your work.`,
              keySteps: [
                "Review the architectural concept and problem statement.",
                "Implement the pattern step by step using the provided resources.",
                "Verify edge cases and validate your output with concrete evidence.",
              ],
              proTip:
                "Keep your initial implementation clean and simple. Practical clarity comes with repetition.",
            };

            const resources: TaskResource[] = task.resources || [
              {
                id: `res-${task.id}-1`,
                type: "video",
                title: `${task.title} Walkthrough`,
                durationOrReadTime: "6 min video",
                description:
                  "Visual explanation of the core technique and implementation steps.",
              },
              {
                id: `res-${task.id}-2`,
                type: "doc",
                title: "Technical Specification & Edge Cases",
                durationOrReadTime: "4 min read",
                description:
                  "Best practices, common failure modes, and verification criteria.",
              },
              {
                id: `res-${task.id}-3`,
                type: "tutorial",
                title: "Step-by-Step Exercise Guide",
                durationOrReadTime: "5 min guide",
                description:
                  "Structured workflow to implement and test the deliverable.",
              },
              {
                id: `res-${task.id}-4`,
                type: "example",
                title: "Production Reference Model",
                durationOrReadTime: "Reference model",
                description:
                  "Inspecting an approved implementation in a real-world scenario.",
              },
            ];

            const subtasks = task.subtasks || [
              {
                id: `sub-${task.id}-1`,
                title: "Review instructional resources and Spark's guidance",
                completed: false,
              },
              {
                id: `sub-${task.id}-2`,
                title: "Execute the task requirements and verify edge cases",
                completed: false,
              },
              {
                id: `sub-${task.id}-3`,
                title: "Prepare proof of completion for Spark verification",
                completed: false,
              },
            ];

            const evidencePrompt =
              task.evidenceRequirement?.prompt ||
              "Please provide a link, screenshot URL, or brief description of your completed work so Spark can verify completion.";

            return (
              <div
                key={task.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isToday
                    ? "border-indigo-500/80 dark:border-indigo-500/60 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xs"
                    : isCompleted
                      ? "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111218]"
                      : "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20"
                }`}
              >
                <div
                  onClick={() => setExpandedTaskId(isExpanded ? "" : task.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                        isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : isToday
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>Day {task.dayNumber}</span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                          {task.estimatedMinutes} mins • Guided by{" "}
                          {task.creatorName}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Today's focus
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-semibold leading-snug ${
                          isToday
                            ? "text-zinc-950 dark:text-white"
                            : isCompleted
                              ? "text-zinc-700 dark:text-zinc-300"
                              : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTaskRunner(task);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-medium cursor-pointer transition-colors"
                    >
                      Full view
                    </button>

                    <div className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-5 bg-white/50 dark:bg-[#111218]/50">
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                      <div className="flex items-center gap-2 font-semibold text-indigo-700 dark:text-indigo-300 text-xs">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Spark's Instructions</span>
                      </div>

                      <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {sparkGuidance.overview}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                          How to complete this task:
                        </span>
                        <ul className="space-y-1">
                          {sparkGuidance.keySteps.map((step, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300 text-xs"
                            >
                              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {sparkGuidance.proTip && (
                        <div className="pt-2 border-t border-indigo-100/80 dark:border-indigo-900/30 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                          <span className="font-semibold">Pro tip:</span>
                          <span>{sparkGuidance.proTip}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          Relevant Learning Resources ({resources.length})
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Matched to this task
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {resources.map((res) => (
                          <div
                            key={res.id}
                            className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                                  {getResourceIcon(res.type)}
                                </div>
                                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                                  {res.type}
                                </span>
                              </div>
                              {res.durationOrReadTime && (
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {res.durationOrReadTime}
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-snug">
                                {res.title}
                              </h4>
                              {res.description && (
                                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                                  {res.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-1 flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer">
                              <span>Open resource</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        Subtasks & Milestones
                      </span>

                      <div className="space-y-1.5">
                        {subtasks.map((sub) => {
                          const isChecked =
                            inlineSubtasks[sub.id] ?? sub.completed;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => toggleSubtaskInline(sub.id)}
                              className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-2.5 text-xs ${
                                isChecked
                                  ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20"
                                  : "border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20"
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors shrink-0 ${
                                  isChecked
                                    ? "bg-emerald-600 text-white"
                                    : "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                                }`}
                              >
                                {isChecked && (
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                )}
                              </div>
                              <span
                                className={`${
                                  isChecked
                                    ? "line-through text-zinc-400 dark:text-zinc-500"
                                    : "text-zinc-800 dark:text-zinc-200 font-medium"
                                }`}
                              >
                                {sub.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          Task Completion Evidence
                        </h4>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {evidencePrompt}
                      </p>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={inlineEvidence[task.id] || ""}
                          onChange={(e) =>
                            setInlineEvidence((prev) => ({
                              ...prev,
                              [task.id]: e.target.value,
                            }))
                          }
                          placeholder={
                            task.evidenceRequirement?.placeholder ||
                            "Paste link, screenshot URL, or file reference..."
                          }
                          disabled={task.completed || inlineVerifying[task.id]}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                        />

                        <button
                          onClick={() => handleInlineSubmitEvidence(task)}
                          disabled={task.completed || inlineVerifying[task.id]}
                          className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                            task.completed
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                          }`}
                        >
                          {task.completed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified Complete</span>
                            </>
                          ) : (
                            <>
                              <span>
                                {inlineVerifying[task.id]
                                  ? "Verifying..."
                                  : "Submit Proof"}
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>

                      {inlineFeedback[task.id] && (
                        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                          {inlineFeedback[task.id]}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SprintTaskModal
        task={activeModalTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
