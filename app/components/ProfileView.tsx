"use client";

import React from "react";
import {
  CheckCircle2,
  FolderGit2,
  Calendar,
  ArrowRight,
  Award,
  Check,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProfileView: React.FC = () => {
  const { user, sprint, setActiveTab } = useHuddle();

  const completedTasks = sprint?.tasks?.filter((t) => t.completed) || [];
  const currentSkill =
    sprint?.skillTitle || user.surveyData?.skill || "Modern Web Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";

  const skills = [
    {
      id: "skill-current",
      name: currentSkill,
      level: userLevel,
      status:
        completedTasks.length === (sprint?.tasks?.length || 6)
          ? "Completed"
          : "In progress",
      progress: Math.round(
        (completedTasks.length / Math.max(1, sprint?.tasks?.length || 6)) * 100,
      ),
      completedTasksCount: completedTasks.length,
      totalTasksCount: sprint?.tasks?.length || 6,
      category: "Active focus",
      verifiedDate: "Active today",
    },
    {
      id: "skill-foundation",
      name: "JavaScript Event Loop and Concurrency",
      level: "Intermediate",
      status: "Completed",
      progress: 100,
      completedTasksCount: 6,
      totalTasksCount: 6,
      category: "Web fundamentals",
      verifiedDate: "Completed 2 weeks ago",
    },
    {
      id: "skill-react-patterns",
      name: "React Component Composition and Hooks",
      level: "Intermediate",
      status: "Completed",
      progress: 100,
      completedTasksCount: 7,
      totalTasksCount: 7,
      category: "Frontend engineering",
      verifiedDate: "Completed last month",
    },
  ];

  const completedProjects = [
    ...completedTasks.map((t) => ({
      id: `proj-${t.id}`,
      title: t.artifactTitle || t.title,
      summary: t.realWorldActionDescription || t.description,
      skillTag: currentSkill,
      completedAt: t.completedAt
        ? `Completed on ${new Date(t.completedAt).toLocaleDateString()}`
        : "Completed during current sprint",
      type: "Practical exercise",
      criteria: [
        "Type-safe implementation",
        "Clean architecture and error boundaries",
      ],
    })),
    {
      id: "proj-prev-1",
      title: "Optimistic State Mutation Pipeline",
      summary:
        "Built a zero-latency UI update system with rollbacks and conflict resolution for asynchronous actions.",
      skillTag: "React Component Composition and Hooks",
      completedAt: "Completed Oct 24",
      type: "Architecture project",
      criteria: [
        "Instant UI feedback",
        "Network failure rollback",
        "Deterministic state guards",
      ],
    },
    {
      id: "proj-prev-2",
      title: "Async Task Queue Profiler",
      summary:
        "Implemented an in-browser task scheduler measuring event loop delays under heavy DOM mutations.",
      skillTag: "JavaScript Event Loop and Concurrency",
      completedAt: "Completed Sep 12",
      type: "Performance benchmark",
      criteria: [
        "High-resolution timing",
        "Memory allocation monitoring",
        "Smooth rendering",
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150 select-none">
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111218] border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/avatars/avatar-1.svg"}
              alt={user.name}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                  {userLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                {user.handle} • Currently focusing on{" "}
                <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {currentSkill}
                </strong>
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Member since {user.joinedDate || "recently"}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Return to dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-zinc-500" />
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Skills ({skills.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            Active and completed topics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {skill.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      skill.status === "Completed"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {skill.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Level: {skill.level}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Progress</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {skill.completedTasksCount} of {skill.totalTasksCount} lessons
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      skill.status === "Completed"
                        ? "bg-emerald-600 dark:bg-emerald-500"
                        : "bg-indigo-600 dark:bg-indigo-500"
                    }`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{skill.verifiedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-zinc-500" />
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Completed exercises ({completedProjects.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            Code and architecture projects you have built
          </span>
        </div>

        <div className="space-y-3">
          {completedProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#111218] border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {proj.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {proj.type}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {proj.completedAt}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {proj.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-zinc-400">
                  Topic:{" "}
                  <strong className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {proj.skillTag}
                  </strong>
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.criteria?.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800"
                    >
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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
