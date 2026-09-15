"use client";

import React, { useState } from "react";
import {
  Shield,
  Heart,
  Flame,
  Clock,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProgressBarOfHealth: React.FC = () => {
  const { overallSkillHealth, skillsHealth, user, sprint, openPracticeSession } =
    useHuddle();
  const [expanded, setExpanded] = useState(false);

  const healthPercent = overallSkillHealth.percent;
  const isOptimal = healthPercent >= 80;
  const isMaintaining = healthPercent >= 50 && healthPercent < 80;

  // Health color mapping
  const healthGradient = isOptimal
    ? "from-emerald-500 via-teal-400 to-cyan-500"
    : isMaintaining
      ? "from-amber-500 via-yellow-400 to-orange-500"
      : "from-rose-600 via-red-500 to-amber-500";

  const glowShadow = isOptimal
    ? "shadow-[0_0_20px_rgba(16,185,129,0.35)]"
    : isMaintaining
      ? "shadow-[0_0_20px_rgba(245,158,11,0.35)]"
      : "shadow-[0_0_20px_rgba(239,68,68,0.4)]";

  const nextDrill = sprint?.tasks?.find((t) => !t.completed) || sprint?.tasks?.[0];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#11131d]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] transition-all">
      {/* Decorative ambient aura */}
      <div
        className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors ${
          isOptimal
            ? "bg-emerald-500/20"
            : isMaintaining
              ? "bg-amber-500/20"
              : "bg-rose-500/20"
        }`}
      />

      <div className="relative space-y-4">
        {/* Header line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                isOptimal
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400"
                  : isMaintaining
                    ? "bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80 text-amber-600 dark:text-amber-400"
                    : "bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-800/80 text-rose-600 dark:text-rose-400"
              }`}
            >
              <Heart className="w-4 h-4 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>Skill Health Bar</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOptimal
                        ? "bg-emerald-100/80 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40"
                        : isMaintaining
                          ? "bg-amber-100/80 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300/40"
                          : "bg-rose-100/80 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40"
                    }`}
                  >
                    {isOptimal
                      ? "Optimal Vitality"
                      : isMaintaining
                        ? "Maintaining Momentum"
                        : "Decay Warning"}
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Continuous indicator of deliberate engineering practice & consistency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-zinc-950 dark:text-white">
                {healthPercent}%
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                Vitality Index
              </span>
            </div>
          </div>
        </div>

        {/* Large Visual Health Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 sm:h-4 bg-zinc-100 dark:bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/60 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${healthGradient} ${glowShadow} transition-all duration-700 ease-out`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 px-0.5">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500 inline shrink-0" />
              <span>
                Decay Shield: <strong>{overallSkillHealth.daysUntilDecay} days</strong> remaining
              </span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Today's drill: +5% HP</span>
            </span>
          </div>
        </div>

        {/* Action & Motivation Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src="/mascot_idle.svg"
              alt="Spark"
              className="w-7 h-7 object-contain shrink-0"
            />
            <p className="text-zinc-700 dark:text-zinc-300 text-[11.5px] leading-relaxed">
              <strong>Spark's Health Rule:</strong> Huddle never zeroes your progress. Complete 1 short session every 72 hours to prevent decay and maintain peak recall.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{expanded ? "Hide Breakdown" : "Skill Breakdown"}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {nextDrill && (
              <button
                onClick={() => openPracticeSession(nextDrill, nextDrill.completed)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Boost Health (+5%)</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable breakdown for active skills */}
        {expanded && (
          <div className="pt-2 border-t border-zinc-100 dark:border-white/[0.06] space-y-2.5 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Active Skill Vitality Breakdown ({skillsHealth.length || 3} tracked)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(skillsHealth.length > 0
                ? skillsHealth
                : [
                    {
                      skillId: "1",
                      skillTitle: "System Architecture & Resilience",
                      category: "Architecture",
                      healthPercent: 94,
                      decayRate: "72h buffer",
                      lastPracticed: "Today",
                      status: "optimal" as const,
                    },
                    {
                      skillId: "2",
                      skillTitle: "Distributed Caching & Redis",
                      category: "Backend",
                      healthPercent: 88,
                      decayRate: "48h buffer",
                      lastPracticed: "Yesterday",
                      status: "optimal" as const,
                    },
                    {
                      skillId: "3",
                      skillTitle: "Concurrency & Event Streaming",
                      category: "Engineering",
                      healthPercent: 79,
                      decayRate: "24h buffer",
                      lastPracticed: "2 days ago",
                      status: "maintaining" as const,
                    },
                    {
                      skillId: "4",
                      skillTitle: "High-Throughput Microservices",
                      category: "Systems",
                      healthPercent: 85,
                      decayRate: "48h buffer",
                      lastPracticed: "Today",
                      status: "optimal" as const,
                    },
                  ]
              ).map((sh) => (
                <div
                  key={sh.skillId}
                  className="p-3 rounded-xl bg-white dark:bg-[#0e1017] border border-zinc-200/60 dark:border-zinc-800 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                      {sh.skillTitle}
                    </span>
                    <span className="font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {sh.healthPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sh.healthPercent >= 80
                          ? "bg-emerald-500"
                          : sh.healthPercent >= 60
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${sh.healthPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span>Practiced: {sh.lastPracticed}</span>
                    <span>{sh.decayRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
