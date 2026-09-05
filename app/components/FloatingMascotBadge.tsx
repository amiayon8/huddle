"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const FloatingMascotBadge: React.FC = () => {
  const { setMascotOpen, user, sprint, activeTab } = useHuddle();
  const [speechBubble, setSpeechBubble] = useState<string>(
    "Ask Pip for sprint guidance, architecture trade-offs, and code hints.",
  );
  const [showSpeech, setShowSpeech] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const syncDismissedStatus = () => {
      const isStoredDismissed =
        typeof window !== "undefined" &&
        Boolean(localStorage.getItem("huddle_pip_dismissed"));
      setIsDismissed(isStoredDismissed);
    };

    syncDismissedStatus();
    window.addEventListener("storage", syncDismissedStatus);
    window.addEventListener("huddle_pip_visibility_change", syncDismissedStatus);

    return () => {
      window.removeEventListener("storage", syncDismissedStatus);
      window.removeEventListener("huddle_pip_visibility_change", syncDismissedStatus);
    };
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case "dashboard":
      case "overview":
        setSpeechBubble(
          `Day ${sprint.currentDay}: 20 minutes today completes your daily milestone and advances your sprint progress.`,
        );
        break;
      case "journey":
        setSpeechBubble(
          `Mapping ${sprint.skillTitle} towards ${user.careerMilestone}. Select any milestone node to begin.`,
        );
        break;
      case "squad":
        setSpeechBubble(
          "Your 4-engineer micro-squad shares daily progress and project deliverables.",
        );
        break;
      case "creators":
      case "explore":
        setSpeechBubble(
          "15-minute engineering blueprints curated by verified practitioners with reproducible code.",
        );
        break;
      case "community":
        setSpeechBubble(
          "Discuss architecture trade-offs or request peer code reviews from the community.",
        );
        break;
      case "profile":
        setSpeechBubble(
          "Your verified portfolio proof artifacts are automatically compiled as you complete sprint tasks.",
        );
        break;
      default:
        setSpeechBubble(
          "Need an architecture breakdown or sprint reschedule? Ask Pip.",
        );
    }
    setShowSpeech(true);
  }, [
    activeTab,
    sprint.currentDay,
    sprint.skillTitle,
    user.careerMilestone,
  ]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("huddle_pip_dismissed", "true");
      window.dispatchEvent(new Event("huddle_pip_visibility_change"));
    }
    setIsDismissed(true);
  };

  const handleMascotClick = () => {
    setMascotOpen(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Pip AI Assistant"
      className="fixed bottom-16 md:bottom-6 right-4 z-40 flex items-end gap-2.5 pointer-events-none select-none animate-in slide-in-from-bottom-4 duration-200"
    >
      {showSpeech && (
        <div className="pointer-events-auto relative max-w-[220px] sm:max-w-[260px] p-3 rounded-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 shadow-lg text-zinc-800 dark:text-zinc-200 text-xs font-medium leading-snug animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Pip Assistant
            </span>
            <button
              onClick={handleDismiss}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
              title="Dismiss Pip"
              aria-label="Dismiss Pip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11.5px] text-zinc-600 dark:text-zinc-300 line-clamp-3">
            {speechBubble}
          </p>
          <div className="mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setMascotOpen(true)}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Ask Pip</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-auto relative group shrink-0">
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleDismiss();
          }}
          className="absolute -top-1.5 -left-1.5 z-10 w-4 h-4 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
          title="Dismiss Pip"
          aria-label="Dismiss Pip"
        >
          <X className="w-2.5 h-2.5" />
        </button>
        <div
          onClick={handleMascotClick}
          className="cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
          title="Pip Engineering Coach"
        >
          <div className="w-12 h-12 p-1.5 rounded-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center">
            <img
              src="/mascot_idle.svg"
              alt="Pip"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
