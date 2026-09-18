"use client";

import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Send,
  Target,
  Layers,
  Award,
  Loader2,
  Flame,
  Zap,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

interface GrowthStage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  status: "completed" | "active" | "upcoming" | "future";
  competencies: string[];
  sparkInsight: string;
  milestoneProject: string;
}

export const GrowthMapView: React.FC = () => {
  const { user, sprint, setActiveTab, setMascotOpen } = useHuddle();

  const [selectedStageId, setSelectedStageId] = useState<string>("stage-2");
  const [askSparkQuery, setAskSparkQuery] = useState("");
  const [sparkResponse, setSparkResponse] = useState<string | null>(null);
  const [isLoadingSpark, setIsLoadingSpark] = useState(false);

  const skillName =
    sprint?.skillTitle ||
    user.surveyData?.skill ||
    "Modern Software Architecture";
  const targetRole =
    user.surveyData?.targetProfession ||
    user.careerMilestone ||
    "Senior Engineer";
  const userGoal =
    user.surveyData?.goal ||
    user.primaryGoal ||
    "Build production-ready systems";

  const stages: GrowthStage[] = [
    {
      id: "stage-1",
      stageNumber: 1,
      title: "Core Foundations & Mental Models",
      subtitle:
        "Building the intuitive vocabulary and basic execution principles",
      status: "completed",
      competencies: [
        "Core domain terminology and structural principles",
        "Understanding state lifecycles and standard inputs",
        "Writing clean, single-responsibility logic",
      ],
      sparkInsight:
        "You built solid mechanical intuition in this stage. Having clear mental models makes solving complex system failures significantly easier.",
      milestoneProject: "Single Component Lifecycle Harness",
    },
    {
      id: "stage-2",
      stageNumber: 2,
      title: "Applied Execution & Component Patterns",
      subtitle:
        "Where your active sprint lives: turning knowledge into verified proof",
      status: "active",
      competencies: [
        "Translating abstract specs into working deliverables",
        "Composing decoupled modules and handling async boundaries",
        "Submitting verified proof of completion for daily tasks",
      ],
      sparkInsight:
        "You are actively working here today. Every daily sprint task you verify directly deepens your muscle memory for real-world scenarios.",
      milestoneProject: "Interactive State Mutation Pipeline",
    },
    {
      id: "stage-3",
      stageNumber: 3,
      title: "Production Resilience & Edge Cases",
      subtitle:
        "Preparing for real-world failures, high throughput, and latency",
      status: "upcoming",
      competencies: [
        "Graceful degradation, offline sync, and optimistic rollbacks",
        "Observability, high-resolution metrics, and logging",
        "Defensive error boundaries and contract verification",
      ],
      sparkInsight:
        "Once your active sprint is cleared, you will transition here. This is the difference between writing code that works and building systems that endure.",
      milestoneProject: "Fault-Tolerant Event Stream Pipeline",
    },
    {
      id: "stage-4",
      stageNumber: 4,
      title: "Mastery & Architectural Leadership",
      subtitle:
        "Driving system-wide decisions, mentoring, and technical standards",
      status: "future",
      competencies: [
        "Cross-boundary system design and trade-off evaluation",
        "Drafting Request for Comments (RFC) specifications",
        "Mentoring squad members and establishing best practices",
      ],
      sparkInsight:
        "This long-term horizon connects directly to your goal of becoming a recognized leader in your craft.",
      milestoneProject: "Distributed Architecture RFC & Production Blueprint",
    },
  ];

  const selectedStage =
    stages.find((s) => s.id === selectedStageId) || stages[1];

  const handleAskSpark = async (queryText?: string) => {
    const query = queryText || askSparkQuery;
    if (!query.trim() || isLoadingSpark) return;

    setIsLoadingSpark(true);
    setSparkResponse(null);

    try {
      const response = await fetch("/api/mascot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          userContext: {
            name: user.name,
            currentSkill: skillName,
            currentDay: sprint?.currentDay || 2,
            targetRole,
            goal: userGoal,
          },
        }),
      });

      const data = await response.json();
      setSparkResponse(
        data.reply ||
          "Here is how this connects to your journey: by mastering your current execution tasks, you build the required foundation to advance directly into Stage 3 resilience.",
      );
    } catch {
      setSparkResponse(
        `Here is a practical solution for your growth journey in ${skillName}:\n\n1. **Focus on today's execution**: Complete your active milestone with verified evidence.\n2. **Connect to Stage 2**: Your current sprint builds the hands-on proof required to unlock Stage 3.\n3. **Long-Term Target**: Consistently clearing 4-day sprints directly prepares you for ${targetRole}.`,
      );
    } finally {
      setIsLoadingSpark(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Compass className="w-4 h-4" />
            <span>Growth Map • Long-Term Direction & Development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white tracking-tight mt-1">
            Where Your Learning Is Taking You
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            While your <strong>Sprint</strong> focuses on what you execute
            today, your <strong>Growth Map</strong> shows the long-term
            progression path toward your target goal of{" "}
            <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
              {targetRole}
            </strong>
            .
          </p>
        </div>

        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Flame className="w-4 h-4" />
          <span>Switch to Today's Sprint</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                Active Sprint Connection
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Stage 2 In Progress
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Today's sprint drill:{" "}
              <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
                {sprint?.tasks?.find((t) => !t.completed)?.title ||
                  "Active Practice Milestone"}
              </strong>
              . Completing this unlocks next-tier architectural resilience.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-3.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          Execute Today's Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const isSelected = stage.id === selectedStageId;
          const isCurrentActive = stage.status === "active";
          const isDone = stage.status === "completed";

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-[#111218] shadow-md"
                  : isCurrentActive
                    ? "border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 hover:border-indigo-400"
                    : isDone
                      ? "border-emerald-200/80 dark:border-emerald-900/40 bg-white dark:bg-[#111218]"
                      : "border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Stage {stage.stageNumber}
                  </span>
                  {isDone && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passed</span>
                    </span>
                  )}
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 animate-pulse">
                      Active Sprint
                    </span>
                  )}
                  {stage.status === "upcoming" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Next Step
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-zinc-950 dark:text-white leading-snug">
                  {stage.title}
                </h3>

                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span>View competencies</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
              <span>Stage {selectedStage.stageNumber} Deep Dive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mt-1">
              {selectedStage.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {selectedStage.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Focus: {skillName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Core Competencies Developed in This Stage
            </h4>

            <div className="space-y-2.5">
              {selectedStage.competencies.map((comp, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                    {comp}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>
                  Capstone Deliverable for Stage {selectedStage.stageNumber}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {selectedStage.milestoneProject}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200">
                    Spark's Stage Guidance
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    How this aligns with your bigger journey
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {selectedStage.sparkInsight}
              </p>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#111218] border border-indigo-100/70 dark:border-indigo-900/30 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-[11px]">
                  Immediate Action to Take:
                </span>
                <p className="leading-relaxed text-[11px]">
                  Execute today's scheduled lesson in your Sprint. That lesson
                  directly fulfills competency #{selectedStage.stageNumber} for
                  this developmental tier.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("dashboard")}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Go to Today's Execution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                Ask Spark About Your Growth Journey
              </h3>
              <p className="text-xs text-zinc-500">
                Ask detailed questions about your roadmap, career milestones, or
                how today's learning fits in.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMascotOpen(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline hidden sm:block"
          >
            Open Full Chat
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "How does today's milestone contribute to my bigger goal?",
            "What competencies do I need before moving to Stage 3?",
            "How does this roadmap prepare me for a Senior Engineer role?",
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setAskSparkQuery(prompt);
                handleAskSpark(prompt);
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={askSparkQuery}
            onChange={(e) => setAskSparkQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAskSpark();
              }
            }}
            placeholder="Ask Spark a detailed question about your growth path..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
          />

          <button
            onClick={() => handleAskSpark()}
            disabled={!askSparkQuery.trim() || isLoadingSpark}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isLoadingSpark ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Ask Spark</span>
          </button>
        </div>

        {sparkResponse && (
          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed animate-in fade-in duration-200 space-y-2 whitespace-pre-line">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300 text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Spark - Your AI Companion</span>
            </div>
            <p>{sparkResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
