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
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5420A6] dark:text-[#A9DAF5]">
            <Compass className="w-4 h-4" />
            <span>Growth Map • Long-Term Direction & Development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#06427D] dark:text-[#e6e9f7] tracking-tight mt-1">
            Where Your Learning Is Taking You
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4]/80 mt-1 max-w-2xl leading-relaxed">
            While your <strong>Sprint</strong> focuses on what you execute
            today, your <strong>Growth Map</strong> shows the long-term
            progression path toward your target goal of{" "}
            <strong className="text-[#06427D] dark:text-[#BBBCE4] font-medium">
              {targetRole}
            </strong>
            .
          </p>
        </div>

        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-4 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Flame className="w-4 h-4 text-[#A9DAF5]" />
          <span>Switch to Today's Sprint</span>
        </button>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#0e1526] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5420A6] text-[#FFFFFF] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs sm:text-sm text-[#06427D] dark:text-[#e6e9f7]">
                Active Sprint Connection
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#BBBCE4]/30 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5]">
                Stage 2 In Progress
              </span>
            </div>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80 mt-0.5">
              Today's sprint drill:{" "}
              <strong className="text-[#06427D] dark:text-[#e6e9f7] font-medium">
                {sprint?.tasks?.find((t) => !t.completed)?.title ||
                  "Active Practice Milestone"}
              </strong>
              . Completing this unlocks next-tier architectural resilience.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-3.5 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 text-xs font-medium transition-colors cursor-pointer shrink-0"
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
                  ? "border-[#5420A6] dark:border-[#A9DAF5] ring-2 ring-[#5420A6]/20 bg-[#FFFFFF] dark:bg-[#0e1526] shadow-md"
                  : isCurrentActive
                    ? "border-[#BBBCE4] dark:border-[#1d2c4e] bg-[#BBBCE4]/10 dark:bg-[#141d33] hover:border-[#5420A6]"
                    : isDone
                      ? "border-emerald-300 dark:border-emerald-900/40 bg-[#FFFFFF] dark:bg-[#0e1526]"
                      : "border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#0e1526]/60 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/70 uppercase tracking-wider">
                    Stage {stage.stageNumber}
                  </span>
                  {isDone && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passed</span>
                    </span>
                  )}
                  {isCurrentActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#BBBCE4]/30 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] animate-pulse">
                      Active Sprint
                    </span>
                  )}
                  {stage.status === "upcoming" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4]/80">
                      Next Step
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#06427D] dark:text-[#e6e9f7] leading-snug">
                  {stage.title}
                </h3>

                <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/75 leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e] text-[11px] font-medium text-[#5420A6] dark:text-[#A9DAF5] flex items-center justify-between">
                <span>View competencies</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5420A6] dark:text-[#A9DAF5]">
              <Layers className="w-4 h-4" />
              <span>Stage {selectedStage.stageNumber} Deep Dive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#06427D] dark:text-[#e6e9f7] mt-1">
              {selectedStage.title}
            </h2>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75 mt-0.5">
              {selectedStage.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-xs font-medium text-[#06427D] dark:text-[#BBBCE4]">
              Focus: {skillName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7] uppercase tracking-wider">
              Core Competencies Developed in This Stage
            </h4>

            <div className="space-y-2.5">
              {selectedStage.competencies.map((comp, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-md bg-[#BBBCE4]/30 dark:bg-[#0e1526] text-[#5420A6] dark:text-[#A9DAF5] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-[#06427D] dark:text-[#e6e9f7] leading-relaxed font-medium">
                    {comp}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7] mb-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>
                  Capstone Deliverable for Stage {selectedStage.stageNumber}
                </span>
              </div>
              <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
                {selectedStage.milestoneProject}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#5420A6] flex items-center justify-center text-[#FFFFFF]">
                  <Zap className="w-4 h-4 text-[#FFFFFF]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#06427D] dark:text-[#A9DAF5]">
                    Spark's Stage Guidance
                  </h4>
                  <span className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/70">
                    How this aligns with your bigger journey
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed">
                {selectedStage.sparkInsight}
              </p>

              <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] text-xs text-[#5D6080] dark:text-[#BBBCE4] space-y-1">
                <span className="font-semibold text-[#06427D] dark:text-[#e6e9f7] block text-[11px]">
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
              className="w-full py-2.5 px-4 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Go to Today's Execution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BBBCE4]/20 dark:bg-[#141d33] border border-[#BBBCE4]/50 dark:border-[#1d2c4e] flex items-center justify-center text-[#5420A6] dark:text-[#A9DAF5]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
                Ask Spark About Your Growth Journey
              </h3>
              <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75">
                Ask detailed questions about your roadmap, career milestones, or
                how today's learning fits in.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMascotOpen(true)}
            className="text-xs text-[#5420A6] dark:text-[#A9DAF5] font-medium hover:underline hidden sm:block"
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
              className="px-3 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] text-xs font-medium hover:border-[#5420A6] dark:hover:border-[#A9DAF5] transition-colors cursor-pointer text-left"
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] placeholder:text-[#5D6080]/60"
          />

          <button
            onClick={() => handleAskSpark()}
            disabled={!askSparkQuery.trim() || isLoadingSpark}
            className="px-4 py-2.5 rounded-xl bg-[#5420A6] hover:bg-[#45188d] disabled:opacity-40 text-[#FFFFFF] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
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
          <div className="p-4 rounded-xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] text-xs text-[#06427D] dark:text-[#BBBCE4] leading-relaxed animate-in fade-in duration-200 space-y-2 whitespace-pre-line">
            <div className="flex items-center gap-1.5 font-semibold text-[#5420A6] dark:text-[#A9DAF5] text-xs">
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
