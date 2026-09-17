"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Play,
  FileCode,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  HelpCircle,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { SprintTask } from "../types/huddle";

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
  const [reflection, setReflection] = useState("");
  const [isCompletedState, setIsCompletedState] = useState(false);

  if (!isOpen || !task) return null;

  const handleComplete = () => {
    setIsCompletedState(true);
    if (!task.completed) {
      completeSprintTask(task.id, undefined, reflection);
    }
    setTimeout(() => {
      onClose();
      setIsCompletedState(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              Day 0{task.dayNumber} Drill
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{task.estimatedMinutes} mins</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-zinc-700 dark:text-zinc-300">
          {/* Title & Description */}
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Spark Advice Callout */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
            <img
              src="/mascot_idle.svg"
              alt="Pip"
              className="w-7 h-7 object-contain shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 text-[11px] uppercase tracking-wider block">
                Pip's Deliberate Tip
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 text-[11.5px] mt-0.5 leading-relaxed">
                Focus strictly on the mechanism at hand today. Don't worry about complete perfection—aim for understanding the core inputs, outputs, and edge-case behavior.
              </p>
            </div>
          </div>

          {/* Practice Steps Checklist */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Today's Execution Checklist</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-xs leading-relaxed">
                  Review the core architectural primitives and state transitions relevant to this task.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-xs leading-relaxed">
                  Implement the pattern locally or trace the code logic step-by-step through sample data.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <p className="text-xs leading-relaxed">
                  Verify error handling and note 1 practical scenario where this pattern prevents failure in production.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notes / Takeaway */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Personal Takeaway or Reflection (Optional):
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Mastered optimistic updates; cache revalidation prevents double writes."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Ask Spark Assistance trigger */}
          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                setMascotOpen(true);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask Sparkto explain this topic in detail</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleComplete}
            className={`px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${task.completed || isCompletedState
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {task.completed || isCompletedState
                ? "Cleared! (Completed)"
                : "Mark Day Cleared →"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
