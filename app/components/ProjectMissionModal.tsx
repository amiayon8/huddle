"use client";

import React, { useState } from "react";
import {
  X,
  Trophy,
  Code,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  BookOpen,
  Send,
  Copy,
  Check,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { CodeBlock } from "./CodeBlock";

export const ProjectMissionModal: React.FC = () => {
  const {
    projectMissionModalOpen,
    selectedProjectMission,
    closeProjectMission,
    submitProjectMission,
  } = useHuddle();

  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!projectMissionModalOpen || !selectedProjectMission) return null;

  const mission = selectedProjectMission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      submitProjectMission(
        mission.id,
        submissionLink || "https://github.com/alexchen/distributed-cache-proxy",
        submissionNotes || "Implemented dual-tier caching with single-flight mutex and Prometheus metrics.",
      );
      setSubmitting(false);
    }, 600);
  };

  const handleCopyCode = () => {
    if (mission.starterCode && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(mission.starterCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-[#11131d] shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Real-World Project Mission
                </span>
                <span className="text-zinc-400 text-xs">•</span>
                <span className="text-xs text-zinc-500 font-medium">
                  {mission.skillCategory}
                </span>
              </div>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mt-0.5">
                {mission.title}
              </h2>
            </div>
          </div>

          <button
            onClick={closeProjectMission}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Scenario & Objective */}
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Production Scenario</span>
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
              {mission.scenario}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
              Core Engineering Objective
            </h3>
            <p className="text-zinc-700 dark:text-zinc-200 text-xs leading-relaxed font-medium">
              {mission.objective}
            </p>
          </div>

          {/* Deliverables & Rubric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Required Deliverables</span>
              </h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11.5px]">
                {mission.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 shrink-0 font-bold">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Acceptance Rubric</span>
              </h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11.5px]">
                {mission.rubric.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Starter Code Block if provided */}
          {mission.starterCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Starter Implementation</span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Starter</span>
                    </>
                  )}
                </button>
              </div>
              <CodeBlock
                code={mission.starterCode}
                language={mission.starterCodeLang || "typescript"}
              />
            </div>
          )}

          {/* Submission Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 dark:text-white">
                Submit Project Deliverable
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Reward: {mission.badge} (+8% Health Bar)
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="GitHub Repo URL, PR, or Live Demo link (e.g. https://github.com/...)"
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
              />

              <textarea
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                rows={2}
                placeholder="Architectural trade-offs, benchmarks, or performance findings..."
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Verifying with Spark..." : "Submit Project Mission to Portfolio"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
