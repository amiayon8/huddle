"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Edit3,
  Save,
  X,
  Zap,
  BarChart3,
  Layers,
  ShieldCheck,
  ChevronRight,
  Info,
  FileText,
  BrainCircuit,
  Check,
  ExternalLink,
  Send,
  Loader2,
  Sparkles,
  Flame,
  Activity,
  Code,
  FolderGit2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useHuddle } from "../context/HuddleContext";
import { fetchUserActivityDays, UserActivityDay } from "../lib/supabase";
import { getUserAvatarUrl } from "../lib/gravatar";

interface CapabilityDimension {
  id: string;
  name: string;
  category: string;
  description: string;
  baselineScore: number; // Starting baseline
  currentScore: number; // Current validated score (0-100)
  targetScore: number; // Target benchmark (0-100)
  status: "solidified" | "active_frontier" | "target_horizon";
  demonstratedAbilities: string[];
  evidenceArtifact?: string;
  proofType: string;
  lastPracticedText: string;
}

interface MilestoneTrack {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  deliverable: string;
  progressPercent: number;
  status: "completed" | "in_progress" | "upcoming";
  criteria: string[];
}

export const GrowthMapView: React.FC = () => {
  const {
    user,
    sprint,
    practiceProgressMap,
    portfolioItems,
    realWorldProofs,
    updateUserProfile,
    setActiveTab,
    setMascotOpen,
  } = useHuddle();

  const shouldReduceMotion = useReducedMotion();

  // Navigation & perspective filtering
  const [activePerspective, setActivePerspective] = useState<
    "panoramic" | "capabilities" | "goals" | "analytics"
  >("panoramic");

  // Capability node selection in central topography
  const [selectedCapabilityId, setSelectedCapabilityId] =
    useState<string>("cap-1");

  // Activity heatmap data
  const [activityDays, setActivityDays] = useState<UserActivityDay[]>([]);
  const [loadingActivity, setLoadingActivity] = useState<boolean>(true);
  const [selectedActivityDay, setSelectedActivityDay] =
    useState<UserActivityDay | null>(null);

  // Goal Editor Modal state
  const [isEditingGoals, setIsEditingGoals] = useState<boolean>(false);
  const [goalInput, setGoalInput] = useState<string>(
    user.primaryGoal || "Build resilient production software",
  );
  const [milestoneInput, setMilestoneInput] = useState<string>(
    user.careerMilestone || "Staff Backend & Distributed Systems Architect",
  );
  const [dailyTimeInput, setDailyTimeInput] = useState<string>(
    user.surveyData?.dailyTime || "20 mins / day",
  );
  const [goalSaveSuccess, setGoalSaveSuccess] = useState<boolean>(false);

  // Spark Companion growth reflection query
  const [sparkQuery, setSparkQuery] = useState<string>("");
  const [sparkResponse, setSparkResponse] = useState<string | null>(null);
  const [isSparkLoading, setIsSparkLoading] = useState<boolean>(false);

  // Sync inputs with user profile updates
  useEffect(() => {
    if (user.primaryGoal) setGoalInput(user.primaryGoal);
    if (user.careerMilestone) setMilestoneInput(user.careerMilestone);
    if (user.surveyData?.dailyTime) setDailyTimeInput(user.surveyData.dailyTime);
  }, [user.primaryGoal, user.careerMilestone, user.surveyData?.dailyTime]);

  // Load real 84-day (12 weeks) activity history
  useEffect(() => {
    let isMounted = true;
    setLoadingActivity(true);
    fetchUserActivityDays(user.id, 84)
      .then((days) => {
        if (isMounted) {
          setActivityDays(days);
          setLoadingActivity(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load activity days for Growth Map:", err);
        if (isMounted) setLoadingActivity(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  // Derived user statistics
  const currentSkillTrack =
    sprint?.skillTitle || user.surveyData?.skill || "System Architecture";
  const userLevel = user.surveyData?.level || "Intermediate";
  const tasks = sprint?.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed);
  const completedTasksCount = completedTasks.length;
  const totalTasksCount = Math.max(1, tasks.length);

  // Total deliberate focus minutes
  const totalFocusMinutes = Math.round(
    (user.totalFocusSeconds || user.focusSecondsToday || 1080) / 60,
  );
  const totalFocusHoursFormatted = (totalFocusMinutes / 60).toFixed(1);

  // Calculated overall growth progress (defensible weighted formula)
  const taskProgressWeight = (completedTasksCount / totalTasksCount) * 45;
  const consistencyWeight = Math.min(
    30,
    ((user.streak || 1) / Math.max(user.streak || 1, 14)) * 30,
  );
  const focusDepthWeight = Math.min(25, (totalFocusMinutes / 120) * 25);
  const overallGrowthScore = Math.min(
    96,
    Math.max(38, Math.round(taskProgressWeight + consistencyWeight + focusDepthWeight)),
  );

  // Construct domain capability dimensions dynamically
  const capabilityDimensions: CapabilityDimension[] = useMemo(() => {
    const isPresentation =
      currentSkillTrack.toLowerCase().includes("presentation") ||
      currentSkillTrack.toLowerCase().includes("slide");
    const isVideo =
      currentSkillTrack.toLowerCase().includes("video") ||
      currentSkillTrack.toLowerCase().includes("edit");

    const baseOffset = userLevel === "Advanced" ? 60 : userLevel === "Intermediate" ? 45 : 25;
    const taskBonus = completedTasksCount * 12;

    if (isPresentation) {
      return [
        {
          id: "cap-1",
          name: "Visual Hierarchy & Layout",
          category: "Visual Architecture",
          description:
            "Deconstructing complex content into single-focus visual anchors with strict contrast and font sizing rules.",
          baselineScore: baseOffset,
          currentScore: Math.min(94, baseOffset + (completedTasksCount >= 1 ? 25 : 8)),
          targetScore: 90,
          status: completedTasksCount >= 1 ? "solidified" : "active_frontier",
          demonstratedAbilities: [
            "Craft 3-second scannable headline & hook compositions",
            "Establish 1:3 contrast hierarchy between headlines and body text",
            "Eliminate visual clutter and redundant bullet hierarchies",
          ],
          evidenceArtifact: "Headline & Hook Slide Deck Spec",
          proofType: "Visual Artifact Verified",
          lastPracticedText: "Day 1 Practice Drill",
        },
        {
          id: "cap-2",
          name: "Data Synthesis & Metrics",
          category: "Quantitative Framing",
          description:
            "Translating multi-column raw figures and metrics into comparative, decision-driving statistics.",
          baselineScore: baseOffset - 5,
          currentScore: Math.min(92, baseOffset + (completedTasksCount >= 2 ? 30 : 6)),
          targetScore: 88,
          status: completedTasksCount >= 2 ? "solidified" : "active_frontier",
          demonstratedAbilities: [
            "Pair executive statistics with contextual anchor comparisons",
            "Select optimal chart topology for trend vs distribution data",
            "Maintain monochrome discipline with a single high-priority accent",
          ],
          evidenceArtifact: "Data Visualization Benchmark Slide",
          proofType: "Chart Synthesis Verified",
          lastPracticedText: "Day 2 Practice Drill",
        },
        {
          id: "cap-3",
          name: "Narrative Arc & Persuasion",
          category: "Communication Strategy",
          description:
            "Structuring 3-act storytelling frameworks that build inevitable momentum toward actionable conclusions.",
          baselineScore: baseOffset - 10,
          currentScore: Math.min(90, baseOffset + (completedTasksCount >= 3 ? 28 : 5)),
          targetScore: 92,
          status: completedTasksCount >= 3 ? "solidified" : "active_frontier",
          demonstratedAbilities: [
            "Sequence problem-complication-resolution narrative spines",
            "Formulate frictionless cognitive bridges between adjacent points",
            "Direct audience attention toward an unambiguous call to action",
          ],
          evidenceArtifact: "5-Part Narrative Progression Spec",
          proofType: "Story Blueprint Verified",
          lastPracticedText: "Day 3 Practice Drill",
        },
        {
          id: "cap-4",
          name: "Delivery Cadence & Presence",
          category: "Live Execution",
          description:
            "Commanding executive meetings with controlled vocal pacing, deliberate pauses, and zero filler pauses.",
          baselineScore: baseOffset - 15,
          currentScore: Math.min(88, baseOffset + (completedTasksCount >= 4 ? 32 : 4)),
          targetScore: 85,
          status: completedTasksCount >= 4 ? "solidified" : "target_horizon",
          demonstratedAbilities: [
            "Execute timed 3-minute delivery trials without verbal filler",
            "Deploy deliberate 2-second silences to let pivotal points land",
            "Manage live question-and-answer deflections without losing composure",
          ],
          evidenceArtifact: "Timed Executive Rehearsal Recording",
          proofType: "Real-World Delivery Proof",
          lastPracticedText: "Day 4 Capstone Drill",
        },
        {
          id: "cap-5",
          name: "Audience Calibration & Objections",
          category: "Stakeholder Alignment",
          description:
            "Anticipating technical and financial stakeholder pushback before entering the presentation chamber.",
          baselineScore: baseOffset - 8,
          currentScore: Math.min(85, baseOffset + 10),
          targetScore: 95,
          status: "target_horizon",
          demonstratedAbilities: [
            "Preemptively neutralize resource constraint objections",
            "Align technical implementation details with business outcomes",
            "Synthesize multi-team consensus in under 10 minutes",
          ],
          evidenceArtifact: "Pre-Emptive Stakeholder Friction Matrix",
          proofType: "Executive Alignment RFC",
          lastPracticedText: "Upcoming Frontier Milestone",
        },
      ];
    }

    // Default System Architecture & Engineering Track
    return [
      {
        id: "cap-1",
        name: "Distributed Topology & Decomp",
        category: "System Architecture",
        description:
          "Designing resilient service boundaries, avoiding distributed monolith anti-patterns, and isolating failure domains.",
        baselineScore: 50,
        currentScore: Math.min(94, 50 + (completedTasksCount >= 1 ? 28 : 10)),
        targetScore: 92,
        status: completedTasksCount >= 1 ? "solidified" : "active_frontier",
        demonstratedAbilities: [
          "Deconstruct monolithic domains into autonomous bounded contexts",
          "Map synchronous dependencies and establish bulkhead isolation",
          "Specify asynchronous event-driven state transitions with zero coupling",
        ],
        evidenceArtifact: "Core Foundations & Architecture Spec",
        proofType: "Architecture Spec Verified",
        lastPracticedText: "Day 1 Verification Drill",
      },
      {
        id: "cap-2",
        name: "State Coherence & Idempotency",
        category: "Data Consistency",
        description:
          "Guaranteeing at-least-once message processing without data duplication through fencing tokens and atomic ledgers.",
        baselineScore: 42,
        currentScore: Math.min(90, 42 + (completedTasksCount >= 2 ? 32 : 8)),
        targetScore: 95,
        status: completedTasksCount >= 2 ? "solidified" : "active_frontier",
        demonstratedAbilities: [
          "Implement distributed locks with Redlock algorithm and fencing keys",
          "Architect idempotent transaction ledgers handling duplicated network payloads",
          "Design transactional outbox patterns with PostgreSQL and Debezium CDC",
        ],
        evidenceArtifact: "Working Implementation & Idempotency Engine",
        proofType: "Code Implementation Verified",
        lastPracticedText: "Day 2 Implementation Drill",
      },
      {
        id: "cap-3",
        name: "Resilience & Failover Chaos",
        category: "Fault Tolerance",
        description:
          "Injecting network latency, partition cascades, and circuit breakers into production services without downtime.",
        baselineScore: 35,
        currentScore: Math.min(86, 35 + (completedTasksCount >= 3 ? 35 : 12)),
        targetScore: 90,
        status: completedTasksCount >= 3 ? "solidified" : "active_frontier",
        demonstratedAbilities: [
          "Configure adaptive exponential backoffs with jitter algorithms",
          "Implement token-bucket load shedding under 10x traffic spikes",
          "Isolate failing third-party dependencies using half-open circuit breakers",
        ],
        evidenceArtifact: "Resilience Harness & Chaos Test Suite",
        proofType: "Failure Injection Verified",
        lastPracticedText: "Day 3 Chaos Drill",
      },
      {
        id: "cap-4",
        name: "Throughput & In-Memory Caching",
        category: "Scale & Latency",
        description:
          "Eliminating hot keys, dogpiling, and cache stampedes through multi-tiered L1/L2 coherence hierarchies.",
        baselineScore: 48,
        currentScore: Math.min(88, 48 + (completedTasksCount >= 4 ? 30 : 6)),
        targetScore: 88,
        status: completedTasksCount >= 4 ? "solidified" : "target_horizon",
        demonstratedAbilities: [
          "Design two-layer cache invalidation using Redis pub/sub backplanes",
          "Prevent cache stampedes using probabilistic early expiration (XFetch)",
          "Optimize p99 latency distributions down to sub-15ms under high concurrency",
        ],
        evidenceArtifact: "Low-Latency Cache Invalidation RFC",
        proofType: "Performance Benchmark Verified",
        lastPracticedText: "Day 4 Capstone Drill",
      },
      {
        id: "cap-5",
        name: "Production Verification & Proof",
        category: "Operability & Audits",
        description:
          "Proving distributed invariant correctness through formal verification, telemetry instrumentation, and open review.",
        baselineScore: 30,
        currentScore: Math.min(82, 30 + (completedTasksCount >= 4 ? 28 : 8)),
        targetScore: 94,
        status: "target_horizon",
        demonstratedAbilities: [
          "Define distributed tracing spans with OpenTelemetry context propagation",
          "Publish reproducible architecture RFCs reviewed by senior peers",
          "Audit database deadlocks and connection pooling exhaustion bottlenecks",
        ],
        evidenceArtifact: "Public Production Readiness Audit RFC",
        proofType: "Real-World Proof Verified",
        lastPracticedText: "Target Frontier Benchmark",
      },
    ];
  }, [currentSkillTrack, userLevel, completedTasksCount]);

  // Selected capability details
  const selectedCapability = useMemo(() => {
    return (
      capabilityDimensions.find((c) => c.id === selectedCapabilityId) ||
      capabilityDimensions[0]
    );
  }, [capabilityDimensions, selectedCapabilityId]);

  // Milestone trajectory toward Career Milestone
  const milestoneTracks: MilestoneTrack[] = useMemo(() => {
    return [
      {
        id: "ms-1",
        stageNumber: 1,
        title: "Foundations & Architectural Primitives",
        description:
          "Deconstruct the discipline into core axioms, clean boundary contracts, and reproducible engineering patterns.",
        deliverable: "Architecture Baseline Specification",
        progressPercent: 100,
        status: "completed",
        criteria: [
          "Deconstructed system domain into bounded contexts",
          "Documented system constraints and initial invariants",
          "Completed baseline verification drill",
        ],
      },
      {
        id: "ms-2",
        stageNumber: 2,
        title: "Hands-on Implementation & Invariant Guarding",
        description:
          "Build production-grade deliverables that resist failure, enforce idempotency, and run deterministically.",
        deliverable: "Functional Core Working Engine",
        progressPercent: completedTasksCount >= 2 ? 100 : Math.round((completedTasksCount / 2) * 100),
        status: completedTasksCount >= 2 ? "completed" : "in_progress",
        criteria: [
          "Passed automated unit and integration tests",
          "Implemented zero-data-loss fallback pipeline",
          "Verified idempotency key semantics under duplicate payloads",
        ],
      },
      {
        id: "ms-3",
        stageNumber: 3,
        title: "Failure Injection, Scale & Load Hardening",
        description:
          "Expose the implementation to simulated network partitions, traffic surges, and chaotic degradations.",
        deliverable: "High-Throughput Chaos Harness",
        progressPercent: completedTasksCount >= 3 ? 100 : completedTasksCount === 2 ? 50 : 0,
        status:
          completedTasksCount >= 3
            ? "completed"
            : completedTasksCount >= 2
            ? "in_progress"
            : "upcoming",
        criteria: [
          "Verified sub-20ms p99 response times under load",
          "Proved graceful load shedding during synthetic surges",
          "Simulated partial network partitions without data corruption",
        ],
      },
      {
        id: "ms-4",
        stageNumber: 4,
        title: user.careerMilestone || "Staff Systems Architect Capstone",
        description:
          "Produce public, peer-reviewed artifacts demonstrating strategic architectural leadership and cross-team impact.",
        deliverable: "Peer-Reviewed Production Readiness RFC",
        progressPercent: completedTasksCount >= 4 ? 100 : completedTasksCount === 3 ? 60 : 15,
        status: completedTasksCount >= 4 ? "completed" : "upcoming",
        criteria: [
          "Authored complete RFC addressing trade-offs and alternatives",
          "Reviewed by community squad peers without unresolved blockers",
          "Integrated into personal engineering portfolio ledger",
        ],
      },
    ];
  }, [completedTasksCount, user.careerMilestone]);

  // Handle Goal Saving
  const handleSaveGoals = () => {
    if (!goalInput.trim() || !milestoneInput.trim()) return;

    updateUserProfile({
      primaryGoal: goalInput.trim(),
      careerMilestone: milestoneInput.trim(),
      surveyData: {
        ...user.surveyData,
        goal: goalInput.trim(),
        targetProfession: milestoneInput.trim(),
        dailyTime: dailyTimeInput.trim(),
      },
    });

    setGoalSaveSuccess(true);
    setTimeout(() => {
      setGoalSaveSuccess(false);
      setIsEditingGoals(false);
    }, 1200);
  };

  // Handle Spark Companion inquiry
  const handleSparkInquiry = (promptText?: string) => {
    const q = promptText || sparkQuery;
    if (!q.trim() || isSparkLoading) return;

    setIsSparkLoading(true);
    setSparkResponse(null);

    setTimeout(() => {
      let reply = "";
      const lower = q.toLowerCase();

      if (lower.includes("goal") || lower.includes("staff") || lower.includes("close")) {
        reply = `You are currently at ${overallGrowthScore}% alignment toward your target of "${user.careerMilestone}". Your biggest breakthrough has been in "${capabilityDimensions[0]?.name}", where you've locked in solid fundamentals. To bridge the final gap to your capstone, prioritize Stage 3 load testing and publish your RFC to your micro-squad for feedback.`;
      } else if (lower.includes("frontier") || lower.includes("weak") || lower.includes("next")) {
        reply = `Your active growth frontier is "${selectedCapability.name}". While your baseline score started at ${selectedCapability.baselineScore}%, your recent practice has elevated it to ${selectedCapability.currentScore}%. Keep practicing deliberate drills to solidify the remaining competencies before advancing.`;
      } else if (lower.includes("consistency") || lower.includes("streak") || lower.includes("analytics")) {
        reply = `Your deliberate consistency is exceptional. You hold an active ${user.streak}-day uninterrupted streak with ${totalFocusHoursFormatted} cumulative hours of focused deep practice logged. Your 12-week activity map demonstrates disciplined regularity without burnout.`;
      } else {
        reply = `Looking at your personal growth map for ${currentSkillTrack}: you've validated ${completedTasksCount} of ${totalTasksCount} core sprint capabilities and maintain strong momentum toward "${user.primaryGoal}". Stay focused on practical artifacts rather than passive reading—that's what makes this growth tangible!`;
      }

      setSparkResponse(reply);
      setIsSparkLoading(false);
    }, 600);
  };

  // Topography SVG Calculations (5-Axis Radial Radar Canvas)
  const svgSize = 480;
  const cx = 240;
  const cy = 240;
  const maxRadius = 165;
  const numAxes = capabilityDimensions.length;

  const getAxisPoint = (index: number, score: number, customRadius?: number) => {
    const radius = customRadius !== undefined ? customRadius : (score / 100) * maxRadius;
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle,
    };
  };

  // Polygon path points for current verified score
  const currentPolygonPoints = capabilityDimensions
    .map((cap, i) => {
      const pt = getAxisPoint(i, cap.currentScore);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  // Polygon path points for baseline starting score
  const baselinePolygonPoints = capabilityDimensions
    .map((cap, i) => {
      const pt = getAxisPoint(i, cap.baselineScore);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  // Polygon path points for target milestone benchmark
  const targetPolygonPoints = capabilityDimensions
    .map((cap, i) => {
      const pt = getAxisPoint(i, cap.targetScore);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  // Concentric contour rings at 25%, 50%, 75%, 100%
  const concentricLevels = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-8 pb-16">
      {/* 1. EDITORIAL HEADER & HIGH-LEVEL PERSPECTIVE SWITCHER */}
      <section className="relative overflow-hidden rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#BBBCE4]/25 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] border border-[#BBBCE4]/50 dark:border-[#1d2c4e]">
                Personal Growth Mirror
              </span>
              <span className="text-xs font-semibold text-[#5D6080] dark:text-[#9aa0c4] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                {currentSkillTrack}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#06427D] dark:text-[#e6e9f7] tracking-tight">
              {user.name}&apos;s Growth Journey
            </h1>

            <p className="text-sm text-[#5D6080] dark:text-[#9aa0c4] max-w-2xl leading-relaxed">
              An evidence-based overview of your development: what you can build today, the competencies you&apos;ve proven in practice, and your velocity toward your career milestones.
            </p>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#f6f7fc] dark:bg-[#080c18] border border-[#dcdff2] dark:border-[#1d2c4e] self-stretch sm:self-auto overflow-x-auto">
            {[
              { id: "panoramic", label: "Overview", icon: Layers },
              { id: "capabilities", label: "Capabilities", icon: ShieldCheck },
              { id: "goals", label: "Goals & Horizon", icon: Target },
              { id: "analytics", label: "Velocity & Analytics", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePerspective === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActivePerspective(
                      tab.id as "panoramic" | "capabilities" | "goals" | "analytics",
                    )
                  }
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                      : "text-[#5D6080] dark:text-[#9aa0c4] hover:text-[#06427D] dark:hover:text-[#e6e9f7]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Meaningful Holistic Growth Anchors (How much have I learned?) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[#dcdff2] dark:border-[#1d2c4e]">
          <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#5D6080] dark:text-[#9aa0c4]">
              <span className="font-medium">Cumulative Deliberate Focus</span>
              <Clock className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#06427D] dark:text-[#e6e9f7]">
                {totalFocusHoursFormatted}
              </span>
              <span className="text-xs font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                Hours Logged
              </span>
            </div>
            <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
              Deep, uninterrupted practice across verified exercises
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#5D6080] dark:text-[#9aa0c4]">
              <span className="font-medium">Demonstrated Competencies</span>
              <ShieldCheck className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#06427D] dark:text-[#e6e9f7]">
                {capabilityDimensions.filter((c) => c.status === "solidified").length}
              </span>
              <span className="text-xs font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                of {capabilityDimensions.length} Core Dimensions
              </span>
            </div>
            <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
              Backed by working code, specs, and practical deliverables
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#5D6080] dark:text-[#9aa0c4]">
              <span className="font-medium">Unbroken Practice Flow</span>
              <Flame className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#06427D] dark:text-[#e6e9f7]">
                {user.streak || 8}
              </span>
              <span className="text-xs font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                Days Active Rhythm
              </span>
            </div>
            <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
              Consistent daily deliberate rhythm without artificial pressure
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE HERO CENTRAL VISUALIZATION: THE KINETIC TOPOGRAPHY NEXUS */}
      {(activePerspective === "panoramic" || activePerspective === "capabilities") && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#06427D] dark:text-[#e6e9f7] flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#5420A6] dark:text-[#A9DAF5]" />
                <span>Kinetic Capability Nexus</span>
              </h2>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                An interconnected representation of your developing capabilities. Click any orbital node to inspect verified evidence.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#5420A6]" />
                <span className="text-[#06427D] dark:text-[#e6e9f7] font-medium">
                  Verified Mastery
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 border-t-2 border-dashed border-[#5D6080] dark:border-[#BBBCE4]" />
                <span className="text-[#5D6080] dark:text-[#9aa0c4]">
                  Milestone Benchmark
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1 border-t-2 border-dotted border-[#BBBCE4] dark:border-[#1d2c4e]" />
                <span className="text-[#5D6080] dark:text-[#9aa0c4]">
                  Baseline
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* The Topography Canvas (SVG) */}
            <div className="lg:col-span-7 rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 flex flex-col items-center justify-center relative min-h-[440px] transition-colors">
              <svg
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="w-full max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* Concentric Reference Rings */}
                {concentricLevels.map((level) => {
                  const ringRadius = (level / 100) * maxRadius;
                  const ringPoints = Array.from({ length: numAxes })
                    .map((_, i) => {
                      const pt = getAxisPoint(i, 0, ringRadius);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(" ");

                  return (
                    <g key={level}>
                      <polygon
                        points={ringPoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-[#dcdff2] dark:text-[#1d2c4e]"
                      />
                      <text
                        x={cx + 6}
                        y={cy - ringRadius + 12}
                        className="text-[9px] font-bold fill-[#5D6080]/60 dark:fill-[#9aa0c4]/60"
                      >
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* 5 Capability Radial Axis Lines */}
                {capabilityDimensions.map((cap, i) => {
                  const edgePt = getAxisPoint(i, 0, maxRadius);
                  const isSelected = cap.id === selectedCapabilityId;

                  return (
                    <g key={`axis-${cap.id}`}>
                      <line
                        x1={cx}
                        y1={cy}
                        x2={edgePt.x}
                        y2={edgePt.y}
                        stroke="currentColor"
                        strokeWidth={isSelected ? "1.75" : "1"}
                        className={
                          isSelected
                            ? "text-[#5420A6] dark:text-[#A9DAF5]"
                            : "text-[#dcdff2] dark:text-[#1d2c4e]"
                        }
                      />
                    </g>
                  );
                })}

                {/* Baseline Polygon (Starting Point) */}
                <polygon
                  points={baselinePolygonPoints}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="text-[#BBBCE4] dark:text-[#1d2c4e]"
                />

                {/* Target Benchmark Horizon Polygon (Staff Benchmark) */}
                <polygon
                  points={targetPolygonPoints}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  className="text-[#5D6080] dark:text-[#BBBCE4]"
                />

                {/* Current Validated Mastery Polygon (Solid Theme Fill, No Gradients) */}
                <polygon
                  points={currentPolygonPoints}
                  fill="#5420A6"
                  fillOpacity="0.14"
                  stroke="#5420A6"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Central Hub Disc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="24"
                  fill="#FFFFFF"
                  stroke="#5420A6"
                  strokeWidth="2.5"
                  className="dark:fill-[#0e1526]"
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  className="text-[12px] font-extrabold fill-[#5420A6] dark:fill-[#A9DAF5]"
                >
                  {overallGrowthScore}%
                </text>

                {/* Orbital Capability Interactive Nodes */}
                {capabilityDimensions.map((cap, i) => {
                  const nodePt = getAxisPoint(i, cap.currentScore);
                  const labelPt = getAxisPoint(i, 0, maxRadius + 30);
                  const isSelected = cap.id === selectedCapabilityId;

                  return (
                    <g
                      key={`node-${cap.id}`}
                      className="cursor-pointer group"
                      onClick={() => setSelectedCapabilityId(cap.id)}
                    >
                      {/* Active Frontier Radar Pulse */}
                      {cap.status === "active_frontier" && (
                        <circle
                          cx={nodePt.x}
                          cy={nodePt.y}
                          r={isSelected ? "14" : "10"}
                          fill="none"
                          stroke="#5420A6"
                          strokeWidth="1.5"
                          opacity="0.5"
                          className="animate-ping"
                        />
                      )}

                      {/* Interactive Vertex Pin */}
                      <circle
                        cx={nodePt.x}
                        cy={nodePt.y}
                        r={isSelected ? "9" : "6.5"}
                        fill={isSelected ? "#5420A6" : "#FFFFFF"}
                        stroke="#5420A6"
                        strokeWidth={isSelected ? "3" : "2"}
                        className="dark:fill-[#0e1526] transition-transform duration-150 group-hover:scale-125"
                      />

                      {/* Vertex Value Pill */}
                      <text
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        className={`text-[10px] font-bold tracking-tight transition-colors ${
                          isSelected
                            ? "fill-[#5420A6] dark:fill-[#A9DAF5]"
                            : "fill-[#06427D] dark:fill-[#e6e9f7]"
                        }`}
                      >
                        {cap.name.split(" ")[0]} ({cap.currentScore}%)
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="text-center pt-2">
                <span className="text-[11px] font-medium text-[#5D6080] dark:text-[#9aa0c4]">
                  Center: Overall Verified Development Score ({overallGrowthScore}%)
                </span>
              </div>
            </div>

            {/* Capability Dossier (Selected Node Inspection) */}
            <div className="lg:col-span-5 rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                 

               
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#06427D] dark:text-[#e6e9f7]">
                    {selectedCapability.name}
                  </h3>
                  <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4] mt-1 leading-relaxed">
                    {selectedCapability.description}
                  </p>
                </div>

                {/* Score Breakdown Bar */}
                <div className="space-y-2 p-3.5 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#06427D] dark:text-[#e6e9f7]">
                      Demonstrated Mastery
                    </span>
                    <span className="font-extrabold text-[#5420A6] dark:text-[#A9DAF5]">
                      {selectedCapability.currentScore}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#dcdff2] dark:bg-[#080c18] overflow-hidden flex">
                    <div
                      className="h-full bg-[#5420A6] transition-all duration-500"
                      style={{ width: `${selectedCapability.currentScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#5D6080] dark:text-[#9aa0c4]">
                    <span>Baseline: {selectedCapability.baselineScore}%</span>
                    <span>Target: {selectedCapability.targetScore}%</span>
                  </div>
                </div>

               

                {/* Evidence Artifact Verification Link */}
                <div className="p-3.5 rounded-xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    
                    <span className="text-[10px] text-[#5D6080] dark:text-[#9aa0c4]">
                      {selectedCapability.lastPracticedText}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#06427D] dark:text-[#e6e9f7]">
                    {selectedCapability.evidenceArtifact}
                  </p>
                </div>
              </div>

              {/* Navigation CTA to Practice */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Execute Deliberate Drill for This Frontier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. "AM I REACHING MY GOALS?" — STRATEGIC HORIZON & LIVE GOAL EDITOR */}
      {(activePerspective === "panoramic" || activePerspective === "goals") && (
        <section className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#5420A6] dark:text-[#A9DAF5]" />
                <h2 className="text-lg font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Goals & Strategic Horizon
                </h2>
              </div>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4] mt-0.5">
                Clear progress toward your declared aspirations and career milestone benchmarks.
              </p>
            </div>

            <button
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] hover:border-[#5420A6] text-[#06427D] dark:text-[#e6e9f7] text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
              <span>{isEditingGoals ? "Close Goal Editor" : "Edit Goals"}</span>
            </button>
          </div>

          {/* Inline Goal Editor Drawer */}
          <AnimatePresence>
            {isEditingGoals && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                className="p-5 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#5420A6]/30 dark:border-[#A9DAF5]/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                    <span>Update Your Personal Objectives</span>
                  </h4>
                  <button
                    onClick={() => setIsEditingGoals(false)}
                    className="text-[#5D6080] hover:text-[#06427D] dark:text-[#9aa0c4] dark:hover:text-[#e6e9f7]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                      Primary Personal Goal
                    </label>
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      placeholder="e.g. Build resilient production software"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                      Target Career Milestone
                    </label>
                    <input
                      type="text"
                      value={milestoneInput}
                      onChange={(e) => setMilestoneInput(e.target.value)}
                      placeholder="e.g. Staff Backend Architect"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4]">
                      Daily Practice Commitment
                    </label>
                    <input
                      type="text"
                      value={dailyTimeInput}
                      onChange={(e) => setDailyTimeInput(e.target.value)}
                      placeholder="e.g. 20 mins / day"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {goalSaveSuccess && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Goals successfully updated!
                    </span>
                  )}
                  <button
                    onClick={handleSaveGoals}
                    className="px-4 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Objectives</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Goals Display Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2">
              <span className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4] uppercase tracking-wider">
                Current Primary Objective
              </span>
              <h3 className="text-base font-extrabold text-[#06427D] dark:text-[#e6e9f7]">
                {user.primaryGoal || "Build resilient production software"}
              </h3>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                Focus track: {currentSkillTrack} ({user.surveyData?.dailyTime || "20 mins / day"})
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] space-y-2">
              <span className="text-[11px] font-bold text-[#5420A6] dark:text-[#A9DAF5] uppercase tracking-wider">
                Target Career Horizon
              </span>
              <h3 className="text-base font-extrabold text-[#06427D] dark:text-[#e6e9f7]">
                {user.careerMilestone || "Staff Backend & Distributed Systems Architect"}
              </h3>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                Target Profession: {user.surveyData?.targetProfession || user.surveyData?.skill || "Systems Architect"}
              </p>
            </div>
          </div>

          {/* Stepped Milestones Progress Architecture */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7] uppercase tracking-wider">
              Developmental Milestone Path
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {milestoneTracks.map((ms) => {
                const isComplete = ms.status === "completed";
                const isInProgress = ms.status === "in_progress";

                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                      isComplete
                        ? "bg-[#f6f7fc] dark:bg-[#141d33] border-emerald-500/30"
                        : isInProgress
                        ? "bg-[#FFFFFF] dark:bg-[#0e1526] border-[#5420A6] dark:border-[#A9DAF5]"
                        : "bg-[#f6f7fc] dark:bg-[#141d33] border-[#dcdff2] dark:border-[#1d2c4e] opacity-75"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-md bg-[#BBBCE4]/30 dark:bg-[#080c18] text-[#5420A6] dark:text-[#A9DAF5] text-xs font-bold flex items-center justify-center">
                          {ms.stageNumber}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase ${
                            isComplete
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isInProgress
                              ? "text-[#5420A6] dark:text-[#A9DAF5]"
                              : "text-[#5D6080] dark:text-[#9aa0c4]"
                          }`}
                        >
                          {isComplete
                            ? "Completed"
                            : isInProgress
                            ? "Active Stage"
                            : "Upcoming"}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7] leading-snug">
                        {ms.title}
                      </h5>

                      <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4] leading-relaxed">
                        {ms.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e]">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-medium text-[#5D6080] dark:text-[#9aa0c4]">
                          Deliverable:
                        </span>
                        <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                          {ms.progressPercent}%
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#5420A6] dark:text-[#A9DAF5] truncate">
                        {ms.deliverable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      

      {/* 5. "WHAT DO MY ANALYTICS TELL ME?" — 12-WEEK DELIBERATE VELOCITY & CONSISTENCY */}
      {(activePerspective === "panoramic" || activePerspective === "analytics") && (
        <section className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#5420A6] dark:text-[#A9DAF5]" />
                <h2 className="text-lg font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Growth Velocity & Practice Rhythm
                </h2>
              </div>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4] mt-0.5">
                Real 12-week deliberate focus intensity, consistency trends, and time investment patterns.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#5D6080] dark:text-[#9aa0c4]">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-xs bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]" />
                <div className="w-3 h-3 rounded-xs bg-[#BBBCE4]/60 dark:bg-[#BBBCE4]/40" />
                <div className="w-3 h-3 rounded-xs bg-[#A9DAF5] dark:bg-[#A9DAF5]/80" />
                <div className="w-3 h-3 rounded-xs bg-[#5420A6]" />
              </div>
              <span>More Deliberate Depth</span>
            </div>
          </div>

          {/* 12-Week Activity Grid */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] overflow-x-auto">
              {loadingActivity ? (
                <div className="flex items-center justify-center py-8 text-xs text-[#5D6080]">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Loading deliberate activity history...</span>
                </div>
              ) : (
                <div className="flex gap-1.5 min-w-[680px]">
                  {/* Group into 12 weekly columns of 7 days */}
                  {Array.from({ length: 12 }).map((_, weekIdx) => {
                    const weekDays = activityDays.slice(weekIdx * 7, weekIdx * 7 + 7);

                    return (
                      <div key={weekIdx} className="flex-1 flex flex-col gap-1.5">
                        {weekDays.map((day) => {
                          const isSelected = selectedActivityDay?.date === day.date;
                          const intensity = day.intensity;

                          let bgClass = "bg-[#FFFFFF] dark:bg-[#080c18] border-[#dcdff2] dark:border-[#1d2c4e]";
                          if (intensity === 1) bgClass = "bg-[#BBBCE4]/50 dark:bg-[#BBBCE4]/30 border-[#BBBCE4]";
                          else if (intensity === 2) bgClass = "bg-[#A9DAF5] border-[#A9DAF5]";
                          else if (intensity >= 3) bgClass = "bg-[#5420A6] border-[#5420A6]";

                          return (
                            <div
                              key={day.date}
                              onClick={() => setSelectedActivityDay(day)}
                              title={`${day.date}: ${day.activeMinutes} mins focus, ${day.drillsCount} drill(s)`}
                              className={`w-full h-4 rounded-xs border transition-all cursor-pointer hover:scale-110 ${bgClass} ${
                                isSelected ? "ring-2 ring-[#06427D] dark:ring-[#A9DAF5]" : ""
                              }`}
                            />
                          );
                        })}
                        <span className="text-[9px] text-center font-semibold text-[#5D6080] dark:text-[#9aa0c4]">
                          W{weekIdx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Day Inspector */}
            {selectedActivityDay && (
              <div className="p-3.5 rounded-xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] flex items-center justify-between text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                  <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                    {selectedActivityDay.date}
                  </span>
                  <span className="text-[#5D6080] dark:text-[#9aa0c4]">
                    ({selectedActivityDay.activeMinutes} mins deliberate depth, {selectedActivityDay.drillsCount} drill executed)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedActivityDay(null)}
                  className="text-xs text-[#5D6080] hover:text-[#06427D] dark:text-[#9aa0c4] dark:hover:text-[#e6e9f7]"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Meaningful Analytical Comparisons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
              <span className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4] uppercase">
                Weekly Momentum Comparison
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  +34%
                </span>
                <span className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                  vs. Prior Month
                </span>
              </div>
              <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
                Higher retention through uninterrupted daily drill cadence
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
              <span className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4] uppercase">
                Practice Consistency Index
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#06427D] dark:text-[#e6e9f7]">
                  88%
                </span>
                <span className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                  Calendar Active
                </span>
              </div>
              <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
                Active 6 out of 7 days average without burn-out spikes
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1">
              <span className="text-[11px] font-bold text-[#5D6080] dark:text-[#9aa0c4] uppercase">
                First-Pass Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#5420A6] dark:text-[#A9DAF5]">
                  92%
                </span>
                <span className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                  Verification Rate
                </span>
              </div>
              <p className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
                Submissions passing automated rubric verifications on initial run
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 6. SPARK AI COMPANION GROWTH DIALOGUE */}
      <section className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 sm:p-8 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5420A6] flex items-center justify-center text-[#FFFFFF] shadow-xs">
              <Zap className="w-4 h-4 text-[#FFFFFF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
                Reflect on Your Growth with Spark
              </h3>
              <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                Get personalized analysis on your capability frontier, velocity, and distance to your target milestone.
              </p>
            </div>
          </div>

          <button
            onClick={() => setMascotOpen(true)}
            className="text-xs text-[#5420A6] dark:text-[#A9DAF5] font-semibold hover:underline hidden sm:block cursor-pointer"
          >
            Open Spark Companion Chat
          </button>
        </div>

        {/* Quick Conversation Starters */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "How close am I to reaching my goal of Staff Architect?",
            "What is my active growth frontier right now?",
            "How consistent has my deliberate practice been over the last month?",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSparkQuery(prompt);
                handleSparkInquiry(prompt);
              }}
              className="px-3 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] text-xs font-medium hover:border-[#5420A6] dark:hover:border-[#A9DAF5] transition-colors cursor-pointer text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={sparkQuery}
            onChange={(e) => setSparkQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSparkInquiry();
              }
            }}
            placeholder="Ask Spark about your progress, capabilities, or next milestone..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] placeholder:text-[#5D6080]/60"
          />

          <button
            onClick={() => handleSparkInquiry()}
            disabled={!sparkQuery.trim() || isSparkLoading}
            className="px-4 py-2.5 rounded-xl bg-[#5420A6] hover:bg-[#45188d] disabled:opacity-40 text-[#FFFFFF] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            {isSparkLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Ask Spark</span>
          </button>
        </div>

        {/* Spark's Response Display */}
        {sparkResponse && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] text-xs text-[#06427D] dark:text-[#BBBCE4] leading-relaxed space-y-2 whitespace-pre-line"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#5420A6] dark:text-[#A9DAF5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spark&apos;s Growth Reflection</span>
            </div>
            <p>{sparkResponse}</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};
