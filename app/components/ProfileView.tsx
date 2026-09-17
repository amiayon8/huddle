"use client";

import React from "react";
import {
  User,
  CheckCircle2,
  FolderGit2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Layers,
  Code,
  Check,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProfileView: React.FC = () => {
  const { user, sprint, setActiveTab, setMascotOpen } = useHuddle();

  const completedTasks = sprint?.tasks?.filter((t) => t.completed) || [];
  const currentSkill = sprint?.skillTitle || user.surveyData?.skill || "Modern Web Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";

  // Skills completed and in progress
  const skills = [
    {
      id: "skill-current",
      name: currentSkill,
      level: userLevel,
      status: completedTasks.length === (sprint?.tasks?.length || 6) ? "Completed" : "In Progress",
      progress: Math.round((completedTasks.length / Math.max(1, sprint?.tasks?.length || 6)) * 100),
      completedTasksCount: completedTasks.length,
      totalTasksCount: sprint?.tasks?.length || 6,
      category: "Active Sprint",
      verifiedDate: "Active Today",
    },
    {
      id: "skill-foundation",
      name: "JavaScript Event Loop & Concurrency",
      level: "Intermediate",
      status: "Completed",
      progress: 100,
      completedTasksCount: 6,
      totalTasksCount: 6,
      category: "Core Web Fundamentals",
      verifiedDate: "Verified 2 weeks ago",
    },
    {
      id: "skill-react-patterns",
      name: "React Component Composition & Hooks",
      level: "Intermediate",
      status: "Completed",
      progress: 100,
      completedTasksCount: 7,
      totalTasksCount: 7,
      category: "Frontend Engineering",
      verifiedDate: "Verified last month",
    },
  ];

  // Completed projects / deliverables (nothing else)
  const completedProjects = [
    ...completedTasks.map((t) => ({
      id: `proj-${t.id}`,
      title: t.artifactTitle || t.title,
      summary: t.realWorldActionDescription || t.description,
      skillTag: currentSkill,
      completedAt: t.completedAt ? `Completed on ${new Date(t.completedAt).toLocaleDateString()}` : "Completed during current sprint",
      type: "Interactive Production Drill",
      criteria: ["Clean type-safe implementation", "Production ready architecture"],
    })),
    {
      id: "proj-prev-1",
      title: "Optimistic State Mutation Pipeline",
      summary: "Built a zero-latency UI update system with rollbacks and conflict resolution for async server actions.",
      skillTag: "React Component Composition & Hooks",
      completedAt: "Completed Oct 24",
      type: "Production Architecture",
      criteria: ["Instant UI feedback", "Network failure rollback", "State machine transition guard"],
    },
    {
      id: "proj-prev-2",
      title: "Custom Async Microtask Queue Profiler",
      summary: "Implemented an in-browser task scheduler measuring macrotask starvation and event loop delays under heavy DOM mutations.",
      skillTag: "JavaScript Event Loop & Concurrency",
      completedAt: "Completed Sep 12",
      type: "Performance Benchmark",
      criteria: ["High-resolution timing API", "Heap allocation monitor", "Zero layout thrashing"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-150">
      {/* Profile Header: Pure & Focused */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e1017] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/mascot_idle.svg"}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                  {userLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {user.handle} • Focusing on <strong className="text-zinc-800 dark:text-zinc-200">{currentSkill}</strong>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Joined {user.joinedDate || "Recent"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {user.streak || 1}-day active learning streak
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Back to Sprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Skills (Completed & In Progress) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              Skills ({skills.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            Verified mastery via daily deliberate practice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0e1017] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {skill.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      skill.status === "Completed"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {skill.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Level: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{skill.level}</span>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Deliverables</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {skill.completedTasksCount} / {skill.totalTasksCount} ({skill.progress}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    }`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{skill.verifiedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Projects Completed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              Projects Completed ({completedProjects.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            Real-world deliverables & engineering drills
          </span>
        </div>

        <div className="space-y-3">
          {completedProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0e1017] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {proj.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
                    {proj.type}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {proj.completedAt}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {proj.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-semibold text-zinc-400">
                  Skill: <strong className="text-indigo-600 dark:text-indigo-400">{proj.skillTag}</strong>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.criteria?.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      <Check className="w-2.5 h-2.5" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
