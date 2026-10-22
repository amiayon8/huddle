"use client";

import React, { useState } from "react";
import {
  Check,
  RotateCcw,
  CheckCircle2,
  Users,
  BookOpen,
  FileCode,
  Award,
  Lock,
  Trophy,
  Play,
  Sparkles,
  Star,
  Zap,
  Flame,
  Target,
  ArrowRight,
  BookMarked,
  X,
  ExternalLink,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { SprintTaskModal } from "./SprintTaskModal";
import { SprintTask } from "../types/huddle";

export const DashboardView: React.FC = () => {
  const {
    user,
    sprint,
    reshuffleSprint,
    setActiveTab,
    squad,
    checkInSquad,
    setMascotOpen,
  } = useHuddle();

  const [activeModalTask, setActiveModalTask] = useState<SprintTask | null>(
    null,
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedNodeTask, setSelectedNodeTask] = useState<SprintTask | null>(
    null,
  );
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length || 6;
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  const activeTask =
    tasks.find((task) => !task.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  const activeTaskIndex = activeTask
    ? tasks.findIndex((task) => task.id === activeTask.id)
    : 0;

  const userSkill =
    sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";
  const dailyTime = user.surveyData?.dailyTime || "20 mins / day";

  const squadMembersCount = squad?.members?.length || 4;
  const squadCheckedIn =
    squad?.members?.filter((member) => member.checkedInToday).length || 2;

  const openTaskRunner = (task: SprintTask) => {
    setActiveModalTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNodeClick = (task: SprintTask) => {
    if (selectedNodeTask?.id === task.id) {
      openTaskRunner(task);
    } else {
      setSelectedNodeTask(task);
    }
  };

  const getNodeHorizontalOffset = (index: number) => {
    const pattern = [0, 48, 68, 12, -48, -68, -12];
    return pattern[index % pattern.length];
  };

  const getTaskIcon = (task: SprintTask, isBossNode: boolean) => {
    if (isBossNode) {
      return <Trophy className="w-8 h-8 text-amber-900" />;
    }
    if (task.completed) {
      return <Check className="w-8 h-8 stroke-[3.5] text-white" />;
    }
    if (task.type === "build") {
      return <FileCode className="w-7 h-7 text-white" />;
    }
    if (task.type === "real_world_proof") {
      return <Award className="w-7 h-7 text-white" />;
    }
    return <BookOpen className="w-7 h-7 text-white" />;
  };

  const progressPercentage = Math.round(
    (completedCount / Math.max(1, totalTasks)) * 100,
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-xl border-b-6 border-indigo-950">
            <div
              className="pointer-events-none absolute -top-24 -right-24 z-0"
              style={{
                width: "400px",
                height: "400px",
                filter: "blur(70px)",
                backgroundImage: "linear-gradient(#6366f1, #7bc3bf)",
                animation: "rotate 5s linear infinite",
                opacity: "1",
                borderRadius: "30% 70% 70% 30%/30% 30% 70% 70%",
              }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unit 1 • {userSkill}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Deliberate Practice Sprints
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                  Progress through sequential stepping-stone units, build
                  production artifacts, and verify verified engineering proofs.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-indigo-200">
                  <span className="font-semibold">{userLevel}</span>
                  <span>•</span>
                  <span>{dailyTime}</span>
                  <span>•</span>
                  <span>
                    {completedCount} of {totalTasks} milestones completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <button
                  onClick={() => setIsGuidebookOpen(true)}
                  className="duo-button-secondary px-4 py-2.5 rounded-2xl bg-white text-indigo-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookMarked className="w-4 h-4 text-indigo-600" />
                  <span>Sprint Brief</span>
                </button>

                <button
                  onClick={() => reshuffleSprint()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-indigo-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reshuffle schedule without penalty"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reshuffle plan</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span>Unit Mastery</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/25 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative py-6 flex flex-col items-center overflow-visible">
            <div
              className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 dark:opacity-20"
              style={{
                width: "400px",
                height: "400px",
                filter: "blur(70px)",
                backgroundImage: "linear-gradient(#6366f1, #7bc3bf)",
                animation: "rotate 5s linear infinite",
                borderRadius: "30% 70% 70% 30%/30% 30% 70% 70%",
              }}
            />

            <div className="w-full max-w-md space-y-14 relative z-10">
              {tasks.map((task, index) => {
                const isCompleted = task.completed;
                const isActive =
                  task.id === activeTask?.id &&
                  !isCompleted &&
                  !isSprintComplete;
                const isLocked = !isCompleted && !isActive;
                const isBossNode = index === tasks.length - 1;
                const horizontalOffset = getNodeHorizontalOffset(index);
                const isSelected = selectedNodeTask?.id === task.id;

                return (
                  <div
                    key={task.id}
                    className="relative flex flex-col items-center"
                    style={{
                      transform: `translateX(${horizontalOffset}px)`,
                    }}
                  >
                    {isActive && (
                      <div className="absolute -top-11 z-20 animate-bounce flex flex-col items-center pointer-events-none">
                        <div className="px-3.5 py-1 rounded-full bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg border border-indigo-400">
                          Start
                        </div>
                        <div className="w-2.5 h-2.5 bg-indigo-600 rotate-45 -mt-1" />
                      </div>
                    )}

                    {isCompleted && (
                      <div className="absolute -top-5 z-10 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-xs" />
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 -translate-y-1 drop-shadow-xs" />
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-xs" />
                      </div>
                    )}

                    <button
                      onClick={() => handleNodeClick(task)}
                      aria-label={`Milestone ${task.dayNumber}: ${task.title}`}
                      className={`duo-node-base ${
                        isBossNode && !isLocked
                          ? "w-24 h-24 duo-node-trophy"
                          : isCompleted
                            ? "w-20 h-20 duo-node-completed"
                            : isActive
                              ? "w-22 h-22 duo-node-active animate-pulse-ripple"
                              : "w-20 h-20 duo-node-locked"
                      }`}
                    >
                      {getTaskIcon(task, isBossNode && !isCompleted)}

                      {isLocked && !isBossNode && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                        </div>
                      )}
                    </button>

                    <div className="mt-2.5 text-center max-w-[140px]">
                      <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        Lesson {task.dayNumber}
                      </span>
                      <span className="block text-[11px] text-zinc-500 line-clamp-1">
                        {task.title}
                      </span>
                    </div>

                    {isActive && (
                      <div
                        className="hidden md:flex absolute top-0 -left-64 w-56 items-center gap-3 animate-float-gentle"
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          onClick={() => setMascotOpen(true)}
                          className="relative p-3.5 rounded-2xl bg-white dark:bg-[#111218] border-2 border-indigo-100 dark:border-indigo-900 shadow-md cursor-pointer group"
                        >
                          <div className="absolute top-6 -right-2 w-3 h-3 bg-white dark:bg-[#111218] border-t-2 border-r-2 border-indigo-100 dark:border-indigo-900 rotate-45" />
                          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                            Ready for Lesson {task.dayNumber}? Complete this
                            deliberate exercise to preserve your streak.
                          </p>
                          <span className="mt-1.5 inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                            Ask Spark advice →
                          </span>
                        </div>
                        <img
                          src="/mascot_encouragement.svg"
                          alt="Spark"
                          className="w-14 h-14 object-contain shrink-0 drop-shadow-sm cursor-pointer"
                          onClick={() => setMascotOpen(true)}
                        />
                      </div>
                    )}

                    {isSelected && (
                      <div className="relative z-30 mt-4 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#111218] border-2 border-indigo-500 shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Lesson {task.dayNumber} •{" "}
                              {task.type.replace("_", " ")}
                            </span>
                            <h3 className="text-sm font-bold text-zinc-950 dark:text-white leading-snug mt-0.5">
                              {task.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedNodeTask(null)}
                            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="mt-3 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Estimated time:</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {task.estimatedMinutes} minutes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              Video Lesson & Knowledge Test
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={() => {
                              setSelectedNodeTask(null);
                              openTaskRunner(task);
                            }}
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                              isCompleted
                                ? "duo-button-success"
                                : isLocked
                                  ? "duo-button-secondary opacity-60 cursor-not-allowed"
                                  : "duo-button-primary shadow-lg shadow-indigo-500/25"
                            }`}
                            disabled={isLocked}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Review Submission</span>
                              </>
                            ) : isLocked ? (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>Locked Milestone</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-white" />
                                <span>Start Exercise (+20 XP)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Daily Quests</span>
              </h2>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                Resets daily
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Complete Lesson {activeTask?.dayNumber || 1} exercise
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>+20 XP</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: isSprintComplete ? "100%" : "30%" }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Check in with Squad
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>+10 XP</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Verify 1 Artifact deliverable
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>+25 XP</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: completedCount > 0 ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Accountability Squad</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {squadCheckedIn}/{squadMembersCount} Active
              </span>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Your 4-person deliberate practice squad sharing milestone updates
              and mutual check-ins.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => checkInSquad()}
                className="duo-button-secondary flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Daily Check-in
              </button>
              <button
                onClick={() => setActiveTab("squad")}
                className="duo-button-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <span>Squad</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                  {user.streak || 1} Day Deliberate Streak
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Execute daily deliberate practice to protect your streak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGuidebookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#111218] border-2 border-indigo-500 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    Unit 1 Sprint Brief: {userSkill}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Core mental models and deliverables for this sprint
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGuidebookOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                  Primary Learning Objective
                </h4>
                <p>
                  Master end-to-end implementation for {userSkill}. Rather than
                  passively browsing lectures, each unit step requires hands-on
                  verification and tangible artifact proof.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 dark:text-white">
                  Curriculum Milestones
                </h4>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-[10px]">
                          {task.dayNumber}
                        </span>
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-white">
                            {task.title}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {task.estimatedMinutes} mins • {task.type}
                          </div>
                        </div>
                      </div>
                      {task.completed ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-400">
                          Upcoming
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setIsGuidebookOpen(false)}
                className="duo-button-primary w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      <SprintTaskModal
        task={activeModalTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
