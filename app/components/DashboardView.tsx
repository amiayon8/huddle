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
  Target,
  ArrowRight,
  BookMarked,
  X,
  Clock,
  Layers,
  Activity,
  Flame,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

  const shouldReduceMotion = useReducedMotion();

  const [activeModalTask, setActiveModalTask] = useState<SprintTask | null>(
    null,
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedNodeTask, setSelectedNodeTask] = useState<SprintTask | null>(
    null,
  );
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isReshuffling, setIsReshuffling] = useState(false);

  const tasks = sprint?.tasks || [];
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length || 6;
  const isSprintComplete = totalTasks > 0 && completedCount === totalTasks;

  const activeTask =
    tasks.find((task) => !task.completed) ||
    (tasks.length > 0 ? tasks[tasks.length - 1] : null);

  const userSkill =
    sprint?.skillTitle || user.surveyData?.skill || "Software Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";
  const dailyTime = user.surveyData?.dailyTime || "20 mins / day";

  const squadMembersCount = squad?.members?.length || 4;
  const squadCheckedIn =
    squad?.members?.filter((member) => member.checkedInToday).length || 2;

  const isLessonCompleted = activeTask ? activeTask.completed : false;
  const isUserCheckedIn =
    squad?.members?.find((m) => m.id === user.id)?.checkedInToday || false;
  const isArtifactVerified = completedCount > 0;

  const completedProtocolsCount =
    (isLessonCompleted ? 1 : 0) +
    (isUserCheckedIn ? 1 : 0) +
    (isArtifactVerified ? 1 : 0);

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

  const handleReshuffleClick = async () => {
    setIsReshuffling(true);
    await reshuffleSprint();
    setTimeout(() => setIsReshuffling(false), 600);
  };

  // Days of consistency tracking for the 7-day strip
  const cadenceDays = [
    { label: "M", active: true },
    { label: "T", active: true },
    { label: "W", active: true },
    { label: "T", active: false, today: true },
    { label: "F", active: false },
    { label: "S", active: false },
    { label: "S", active: false },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 w-full pb-16">
      {/* ========================================================= */}
      {/* 1. EDITORIAL COMMAND CENTER & ARCHITECTURAL MASTHEAD       */}
      {/*    Expanded asymmetric layout utilizing horizontal space   */}
      {/* ========================================================= */}
      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm p-6 sm:p-8 lg:p-8 xl:p-9"
      >


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 pl-1 sm:pl-2 items-center">
          {/* Left Wing (lg:col-span-7 xl:col-span-7): Heading, Thesis, Progress Telemetry */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#5420A6]/10 text-[#5420A6] dark:text-[#A9DAF5] border border-[#5420A6]/20 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Sprint Run
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70">
                Unit 01 // Curriculum Spec // {userSkill}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#06427D] dark:text-[#e6e9f7] leading-tight">
                Deliberate Practice Sprints
              </h1>
              <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed max-w-2xl">
                Progress through sequential stepping-stone units, build
                production artifacts, and verify engineering proofs with your
                accountability cohort.
              </p>
            </div>

            {/* Linear Progress Telemetry */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Unit Mastery Telemetry
                </span>
                <span className="font-mono text-[11px] font-black text-[#5420A6] dark:text-[#A9DAF5]">
                  [{progressPercentage}% COMPLETE]
                </span>
              </div>

              {/* Solid Progress Bar (Zero Gradients) with discrete milestone markers */}
              <div className="relative w-full h-3 rounded-full bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5420A6] transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[#5D6080] dark:text-[#BBBCE4]/60 pt-0.5">
                <span>Start Unit</span>
                <span>Milestone {completedCount} / {totalTasks}</span>
                <span>Unit Capstone</span>
              </div>
            </div>
          </div>

          {/* Right Wing (lg:col-span-5 xl:col-span-5): Actions, 2x2 Telemetry Matrix & Primary CTA */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between gap-4 lg:border-l lg:border-[#dcdff2]/60 lg:dark:border-[#1d2c4e]/60 lg:pl-6 xl:pl-8">
            {/* Top Action buttons */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <button
                onClick={handleReshuffleClick}
                disabled={isReshuffling}
                className="px-3 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] hover:border-[#5420A6] text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4] dark:hover:text-[#e6e9f7] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                title="Reshuffle schedule without penalty"
              >
                <RotateCcw
                  className={`w-3.5 h-3.5 transition-transform ${isReshuffling ? "animate-spin" : ""}`}
                />
                <span>Reshuffle Plan</span>
              </button>

              <button
                onClick={() => setIsGuidebookOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#5420A6]/10 hover:bg-[#5420A6]/20 border border-[#5420A6]/30 text-[#5420A6] dark:text-[#A9DAF5] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Sprint Dossier</span>
              </button>
            </div>

            {/* 2x2 High-Precision Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70 flex items-center gap-1">
                  <Target className="w-3 h-3 text-[#5420A6] dark:text-[#A9DAF5]" />
                  <span>Tier</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5 truncate">
                  {userLevel}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#5420A6] dark:text-[#A9DAF5]" />
                  <span>Cadence</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5 truncate">
                  {dailyTime}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#5420A6] dark:text-[#A9DAF5]" />
                  <span>Proofs</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5 truncate">
                  {completedCount} of {totalTasks} Verified
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-[#5420A6] dark:text-[#A9DAF5]" />
                  <span>Status</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#5420A6] dark:text-[#A9DAF5] mt-0.5 truncate">
                  {isSprintComplete ? "Mastered" : "Active Focus"}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            {activeTask && (
              <button
                onClick={() => openTaskRunner(activeTask)}
                className="w-full py-3 px-4 rounded-xl bg-[#5420A6] hover:bg-[#5420A6]/90 text-[#FFFFFF] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Lesson {activeTask.dayNumber} (+20 XP)</span>
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* ========================================================= */}
      {/* 2. ASYMMETRIC MAIN DASHBOARD COMPOSITION                   */}
      {/*    Left: Roadmap Guidepost + Roadmap (100% UNCHANGED)     */}
      {/*    Right: Multi-Column Deliberate Practice Ledger         */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
        {/* LEFT WING: Stepping-Stone Pathway (Roadmap Area) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Editorial Section Anchor for Roadmap */}
          <div className="flex items-center justify-between px-2 pt-2 pb-1 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#5D6080] dark:text-[#BBBCE4]/80">
              <Layers className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
              <span>Pathway // Stepping-Stone Progression</span>
            </div>
            <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60 hidden sm:inline">
              Select node to practice
            </span>
          </div>

          {/* ======================================================== */}
          {/* STRICT ROADMAP PRESERVATION: KEPT EXACTLY AS ORIGINAL    */}
          {/* DO NOT ALTER SIZING, NODES, OFFSETS, OR ANIMATIONS HERE  */}
          {/* ======================================================== */}
          <div className="relative py-6 flex flex-col items-center overflow-visible">
            <div
              className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 dark:opacity-20"
              style={{
                width: "400px",
                height: "400px",
                filter: "blur(70px)",
                backgroundImage: "linear-gradient(#5420A6, #BBBCE4)",
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
                        <div className="px-3.5 py-1 rounded-full bg-[#5420A6] text-[#FFFFFF] font-black text-[11px] uppercase tracking-wider shadow-lg border border-[#A9DAF5]/50">
                          Start
                        </div>
                        <div className="w-2.5 h-2.5 bg-[#5420A6] rotate-45 -mt-1" />
                      </div>
                    )}

                    {isCompleted && (
                      <div className="absolute -top-5 z-10 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#06427D] text-[#06427D] dark:fill-[#A9DAF5] dark:text-[#A9DAF5] drop-shadow-xs" />
                        <Star className="w-4 h-4 fill-[#06427D] text-[#06427D] dark:fill-[#A9DAF5] dark:text-[#A9DAF5] -translate-y-1 drop-shadow-xs" />
                        <Star className="w-3.5 h-3.5 fill-[#06427D] text-[#06427D] dark:fill-[#A9DAF5] dark:text-[#A9DAF5] drop-shadow-xs" />
                      </div>
                    )}

                    <button
                      onClick={() => handleNodeClick(task)}
                      aria-label={`Milestone ${task.dayNumber}: ${task.title}`}
                      className={`duo-node-base ${isBossNode && !isLocked
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
                          <Lock className="w-6 h-6 text-[#5D6080]/60 dark:text-[#5D6080]" />
                        </div>
                      )}
                    </button>

                    <div className="mt-2.5 text-center max-w-[140px]">
                      <span className="block text-xs font-bold text-[#06427D] dark:text-[#e6e9f7] truncate">
                        Lesson {task.dayNumber}
                      </span>
                      <span className="block text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/70 line-clamp-1">
                        {task.title}
                      </span>
                    </div>

                    {isActive && (
                      <div
                        className={`hidden md:flex absolute top-0 w-56 items-center gap-2.5 animate-float-gentle z-20 ${horizontalOffset < 0
                          ? "left-full ml-3 flex-row-reverse"
                          : "right-full mr-3"
                          }`}
                        style={{ pointerEvents: "auto" }}
                      >
                        <div
                          onClick={() => setMascotOpen(true)}
                          className="relative p-3.5 rounded-2xl bg-white dark:bg-[#0e1526] border-2 border-[#BBBCE4]/50 dark:border-[#1d2c4e] shadow-md cursor-pointer group"
                        >
                          {horizontalOffset < 0 ? (
                            <div className="absolute top-6 -left-2 w-3 h-3 bg-white dark:bg-[#0e1526] border-b-2 border-l-2 border-[#BBBCE4]/50 dark:border-[#1d2c4e] rotate-45" />
                          ) : (
                            <div className="absolute top-6 -right-2 w-3 h-3 bg-white dark:bg-[#0e1526] border-t-2 border-r-2 border-[#BBBCE4]/50 dark:border-[#1d2c4e] rotate-45" />
                          )}
                          <p className="text-xs font-medium text-[#06427D] dark:text-[#BBBCE4] leading-snug">
                            Ready for Lesson {task.dayNumber}? Complete this
                            deliberate exercise to preserve your streak.
                          </p>
                          <span className="mt-1.5 inline-block text-[10px] font-bold text-[#5420A6] dark:text-[#A9DAF5] group-hover:underline">
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
                      <div className="relative z-30 mt-4 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0e1526] border-2 border-[#5420A6] shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5420A6] dark:text-[#A9DAF5]">
                              Lesson {task.dayNumber} •{" "}
                              {task.type.replace("_", " ")}
                            </span>
                            <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] leading-snug mt-0.5">
                              {task.title}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedNodeTask(null)}
                            className="p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/85 mt-3 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="mt-3 py-2 px-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/80 space-y-1">
                          <div className="flex justify-between">
                            <span>Estimated time:</span>
                            <span className="font-semibold text-[#06427D] dark:text-[#e6e9f7]">
                              {task.estimatedMinutes} minutes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <span className="font-semibold text-[#5420A6] dark:text-[#A9DAF5]">
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
                            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${isCompleted
                              ? "duo-button-success"
                              : isLocked
                                ? "duo-button-secondary opacity-60 cursor-not-allowed"
                                : "duo-button-primary shadow-lg shadow-[#5420A6]/25"
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
          {/* ======================================================== */}
          {/* END ROADMAP PRESERVATION                                 */}
          {/* ======================================================== */}
        </div>

        {/* RIGHT WING: The Deliberate Practice Ledger (Multi-Column Asymmetric Hub) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
          {/* ROW 1: Side-by-Side Accountability Pair (streak + Micro Squad) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 items-stretch">
            {/* 1. streak (STREAK ANCHOR) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
                  <h2 className="text-sm font-extrabold tracking-tight text-[#06427D] dark:text-[#e6e9f7] flex items-center gap-2">
                    <img
                      src="/icons/meteor-svgrepo-com.svg"
                      alt="Streak"
                      className="w-4 h-4 object-contain"
                    />
                    <span>Streak</span>
                  </h2>

                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#06427D] dark:text-[#e6e9f7]">
                      {String(user.streak || 1).padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
                      Day Deliberate Streak
                    </div>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <img
                      src="/icons/meteor-svgrepo-com.svg"
                      alt="Streak"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                </div>

                {/* 7-Day Consistency Cadence */}
                <div className="pt-1">
                  <div className="text-[10px] font-mono text-[#5D6080] dark:text-[#BBBCE4]/60 mb-1.5">
                    Last 7 Days Execution:
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cadenceDays.map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${day.active
                            ? "bg-amber-500 text-white"
                            : day.today
                              ? "border-2 border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080]/60 dark:text-[#BBBCE4]/40"
                            }`}
                        >
                          {day.active ? "✓" : ""}
                        </div>
                        <span className="text-[9px] font-mono text-[#5D6080] dark:text-[#BBBCE4]/50">
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/80 leading-relaxed border-t border-[#dcdff2]/60 dark:border-[#1d2c4e]/60 pt-2.5">
                Complete today's milestone before midnight to safeguard your streak.
              </p>
            </motion.div>

            {/* 2. ACCOUNTABILITY COLLECTIVE (MICRO SQUAD NEXUS) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
                  <h2 className="text-sm font-extrabold tracking-tight text-[#06427D] dark:text-[#e6e9f7] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                    <span>Micro Squad</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {squadCheckedIn}/{squadMembersCount} Active
                  </span>
                </div>

                {/* Squad Members Roster Visualizer */}
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                  <div className="flex items-center -space-x-2">
                    {Array.from({ length: squadMembersCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`relative w-7 h-7 rounded-full border-2 border-[#FFFFFF] dark:border-[#0e1526] flex items-center justify-center text-[10px] font-bold ${i < squadCheckedIn
                          ? "bg-[#5420A6] text-white"
                          : "bg-[#BBBCE4] text-[#06427D]"
                          }`}
                      >
                        {String.fromCharCode(65 + i)}
                        {i < squadCheckedIn && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#0e1526]" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                      Cohort Sync
                    </div>
                    <div className="text-[10px] font-mono text-[#5D6080] dark:text-[#BBBCE4]/70">
                      {Math.round((squadCheckedIn / squadMembersCount) * 100)}% attendance
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/80 leading-relaxed">
                  4-person deliberate practice squad sharing milestone updates and code reviews.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#dcdff2]/60 dark:border-[#1d2c4e]/60">
                <button
                  onClick={() => checkInSquad()}
                  className="duo-button-secondary py-2 px-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center"
                >
                  Check-in
                </button>
                <button
                  onClick={() => setActiveTab("squad")}
                  className="duo-button-primary py-2 px-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-center"
                >
                  <span>Squad Room</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>



          {/* ROW 3: SPARK MENTOR DISPATCH */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl border border-[#BBBCE4]/40 dark:border-[#1d2c4e] bg-[#BBBCE4]/10 dark:bg-[#141d33] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <img
                src="/mascot_planning.svg"
                alt="Spark"
                className="w-10 h-10 object-contain shrink-0 cursor-pointer drop-shadow-xs"
                onClick={() => setMascotOpen(true)}
              />
              <div>
                <h3 className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Spark Architecture Nudge
                </h3>
                <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/80">
                  Decompose Lesson {activeTask?.dayNumber || 1} with tailored AI guidance.
                </p>
              </div>
            </div>

            <button
              onClick={() => setMascotOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-[#5420A6]/30 bg-[#FFFFFF] dark:bg-[#0e1526] hover:bg-[#5420A6] hover:text-white text-[#5420A6] dark:text-[#A9DAF5] dark:hover:bg-[#5420A6] dark:hover:text-[#e6e9f7] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <span>Ask Spark Advice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. EXECUTIVE SPRINT DOSSIER (SPRINT BRIEF SPECIFICATION)   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isGuidebookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#5420A6] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col"
            >
              {/* Dossier Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#dcdff2] dark:border-[#1d2c4e] shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#5420A6]/10 text-[#5420A6] dark:text-[#A9DAF5] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#5420A6]/20">
                      Huddle Spec // Dossier 1.0
                    </span>
                    <span className="text-[11px] font-mono text-[#5D6080] dark:text-[#BBBCE4]/60">
                      Unit 01
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#06427D] dark:text-[#e6e9f7]">
                    Unit 1 Sprint Brief: {userSkill}
                  </h3>
                  <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
                    Core mental models, curriculum deliverables, and evaluation benchmarks.
                  </p>
                </div>
                <button
                  onClick={() => setIsGuidebookOpen(false)}
                  className="p-1.5 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] cursor-pointer"
                  title="Close dossier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Body */}
              <div className="space-y-5 overflow-y-auto pr-1 text-xs text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed flex-1">
                {/* Methodological Foundation */}
                <div className="p-4 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] space-y-1.5">
                  <h4 className="font-bold text-[#06427D] dark:text-[#A9DAF5] flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Primary Learning Objective</span>
                  </h4>
                  <p className="text-xs text-[#06427D] dark:text-[#BBBCE4] leading-relaxed">
                    Master practical implementation of {userSkill}. Each unit
                    requires tangible artifact submission and knowledge checks rather
                    than passive video consumption.
                  </p>
                </div>

                {/* Curriculum Milestones List */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-[#06427D] dark:text-[#e6e9f7] text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                    <span>Curriculum Milestones Manifest ({tasks.length})</span>
                  </h4>

                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc]/60 dark:bg-[#141d33]/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-[#5420A6]/10 dark:bg-[#5420A6]/20 border border-[#5420A6]/20 text-[#5420A6] dark:text-[#A9DAF5] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {task.dayNumber}
                          </span>
                          <div>
                            <div className="font-bold text-xs text-[#06427D] dark:text-[#e6e9f7]">
                              {task.title}
                            </div>
                            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/70">
                              {task.estimatedMinutes} mins • {task.type.replace("_", " ")}
                            </div>
                          </div>
                        </div>

                        {task.completed ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                            Verified
                          </span>
                        ) : task.id === activeTask?.id ? (
                          <span className="text-[10px] font-bold text-[#5420A6] dark:text-[#A9DAF5] bg-[#5420A6]/10 border border-[#5420A6]/30 px-2.5 py-1 rounded-full shrink-0">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#5D6080]/60 dark:text-[#BBBCE4]/50 shrink-0">
                            Queued
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Criteria */}
                <div className="p-3.5 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-[11px] space-y-1">
                  <span className="font-bold text-[#06427D] dark:text-[#e6e9f7] uppercase tracking-wider font-mono">
                    Unit Capstone Benchmark:
                  </span>
                  <p className="text-[#5D6080] dark:text-[#BBBCE4]/80">
                    Complete all sequential exercises and pass the final boss
                    challenge to unlock verified certification in your portfolio.
                  </p>
                </div>
              </div>

              {/* Dossier Footer */}
              <div className="pt-4 border-t border-[#dcdff2] dark:border-[#1d2c4e] shrink-0">
                <button
                  onClick={() => setIsGuidebookOpen(false)}
                  className="duo-button-primary w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Acknowledge & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal Runner */}
      <SprintTaskModal
        task={activeModalTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
};
