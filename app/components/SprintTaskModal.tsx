"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  HelpCircle,
  ExternalLink,
  Video,
  FileText,
  BookOpen,
  FileCode,
  Check,
  Upload,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { SprintTask, TaskResource } from "../types/huddle";

interface SprintTaskModalProps {
  task: SprintTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SprintTaskModal: React.FC<SprintTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { completeSprintTask, setMascotOpen } = useHuddle();
  const [evidenceInput, setEvidenceInput] = useState("");
  const [reflection, setReflection] = useState("");
  const [subtasksState, setSubtasksState] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const sparkGuidance = task.sparkGuidance || {
    overview: `Focus on completing the core requirements for "${task.title}". Master the foundational mechanics before moving to production optimization.`,
    keySteps: [
      "Review the architectural concept and problem statement.",
      "Implement the step-by-step pattern using the provided resources.",
      "Verify edge cases and validate your output with concrete evidence.",
    ],
    proTip: "Keep your initial implementation focused and simple. Real understanding comes from deliberate iteration.",
  };

  const resources: TaskResource[] = task.resources || [
    {
      id: "res-default-1",
      type: "video",
      title: `${task.title} Walkthrough`,
      durationOrReadTime: "6 min video",
      description: "Visual breakdown and hands-on explanation of the core technique.",
    },
    {
      id: "res-default-2",
      type: "doc",
      title: "Technical Reference & Guidelines",
      durationOrReadTime: "4 min read",
      description: "Step-by-step specifications, common pitfalls, and edge cases.",
    },
    {
      id: "res-default-3",
      type: "tutorial",
      title: "Implementation Guide",
      durationOrReadTime: "Hands-on guide",
      description: "Practical exercises and self-check criteria for completion.",
    },
    {
      id: "res-default-4",
      type: "example",
      title: "Production Example & Teardown",
      durationOrReadTime: "Reference model",
      description: "Inspecting an approved implementation in a real-world scenario.",
    },
  ];

  const subtasks = task.subtasks || [
    {
      id: "sub-1",
      title: "Review the instructional materials and Spark's guidance",
      completed: false,
    },
    {
      id: "sub-2",
      title: "Complete the practical implementation or exercise locally",
      completed: false,
    },
    {
      id: "sub-3",
      title: "Prepare evidence or summary of your completed work",
      completed: false,
    },
  ];

  const evidencePrompt =
    task.evidenceRequirement?.prompt ||
    "Please provide a link, screenshot URL, or brief description of your completed work so Spark can confirm completion.";

  const toggleSubtask = (id: string) => {
    setSubtasksState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVerifyAndComplete = () => {
    if (!evidenceInput.trim() && !task.completed) {
      setVerificationFeedback("Please provide your evidence or a brief summary of your work for Spark to verify.");
      return;
    }

    setIsVerifying(true);
    setVerificationFeedback("Spark is verifying your completed work...");

    setTimeout(() => {
      completeSprintTask(task.id, undefined, reflection, evidenceInput.trim() || "Verified proof of completion");
      setIsVerifying(false);
      setVerificationFeedback("Spark verified your work! Task marked as completed.");
      setTimeout(() => {
        onClose();
        setVerificationFeedback(null);
      }, 900);
    }, 800);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/50 dark:border-indigo-800/50">
              Day {task.dayNumber}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{task.estimatedMinutes} minutes</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-700 dark:text-zinc-300">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {task.description}
            </p>
          </div>

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
                  <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Learning Resources ({resources.length})
              </h3>
              <span className="text-[11px] text-zinc-400">
                Matched to this exercise
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-2"
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

                  <div className="pt-1 flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                    <span>Open material</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Subtasks & Milestones
            </h3>

            <div className="space-y-2">
              {subtasks.map((sub) => {
                const isChecked = subtasksState[sub.id] ?? sub.completed;
                return (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubtask(sub.id)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 ${
                      isChecked
                        ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20"
                        : "border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 hover:border-zinc-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? "bg-emerald-600 text-white"
                          : "border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs ${
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
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Spark Completion Confirmation
              </h3>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {evidencePrompt}
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={evidenceInput}
                onChange={(e) => setEvidenceInput(e.target.value)}
                placeholder={task.evidenceRequirement?.placeholder || "Paste link, screenshot URL, or file reference..."}
                disabled={task.completed || isVerifying}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />

              <input
                type="text"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Optional takeaway (e.g. Learned how to isolate the action headline)"
                disabled={task.completed || isVerifying}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>

            {verificationFeedback && (
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                {verificationFeedback}
              </div>
            )}
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                onClose();
                setMascotOpen(true);
              }}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask Spark for interactive help on this task</span>
            </button>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/40 dark:bg-zinc-900/20 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleVerifyAndComplete}
            disabled={isVerifying || task.completed}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              task.completed
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            }`}
          >
            {task.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified & Completed</span>
              </>
            ) : (
              <>
                <span>{isVerifying ? "Verifying..." : "Submit Proof & Confirm"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
