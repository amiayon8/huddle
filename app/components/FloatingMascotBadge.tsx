"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { MessageSquare, X } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const FloatingMascotBadge: React.FC = () => {
  const { setMascotOpen, user, sprint, activeTab } = useHuddle();
  const [speechBubble, setSpeechBubble] = useState<string>(
    "Click me for personalized sprint coaching & survey-tailored tutoring!",
  );
  const [showSpeech, setShowSpeech] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);
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
          `Day ${sprint.currentDay}: Keep your ${user.streak}-day streak alive with 1 deliberate action!`,
        );
        break;
      case "journey":
        setSpeechBubble(
          `Mapping ${sprint.skillTitle} towards ${user.careerMilestone}! Tap nodes to study.`,
        );
        break;
      case "squad":
        setSpeechBubble(
          "Your micro-squad has zero toxic leaderboards. High-signal accountability!",
        );
        break;
      case "creators":
      case "explore":
        setSpeechBubble(
          "15-min creator blueprints from verified Staff Engineers. No doomscrolling.",
        );
        break;
      case "community":
        setSpeechBubble(
          "Have an architecture question? Ask the community or draft it with me!",
        );
        break;
      case "profile":
        setSpeechBubble(
          "Your private portfolio auto-assembles with each finished sprint task!",
        );
        break;
      default:
        setSpeechBubble(
          "Need a concept breakdown or 0-penalty reshuffle? Chat with Pip!",
        );
    }
    setShowSpeech(true);
  }, [
    activeTab,
    sprint.currentDay,
    sprint.skillTitle,
    user.streak,
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
    setIsBouncing(true);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: 0.9, y: 0.85 },
    });
    setTimeout(() => {
      setIsBouncing(false);
      setMascotOpen(true);
    }, 250);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Pip AI Assistant"
      className="fixed bottom-16 md:bottom-6 right-4 z-40 flex items-end gap-2.5 pointer-events-none select-none animate-in slide-in-from-bottom-4 duration-300"
    >
      {showSpeech && (
        <div className="pointer-events-auto relative max-w-[210px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#111218] border border-indigo-200 dark:border-indigo-900/60 shadow-xl text-zinc-800 dark:text-zinc-200 text-xs font-medium leading-snug animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Pip
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleDismiss}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                title="Dismiss Pip"
                aria-label="Dismiss Pip"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <p className="text-[11.5px] line-clamp-3">{speechBubble}</p>
          <div className="mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setMascotOpen(true)}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-2.5 h-2.5" />
              Chat now
            </button>
            <button
              onClick={handleDismiss}
              className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#111218] border-b border-r border-indigo-200 dark:border-indigo-900/60 transform rotate-45" />
        </div>
      )}

      <div className="pointer-events-auto relative group shrink-0">
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleDismiss();
          }}
          className="absolute -top-2 -left-2 z-10 w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
          title="Dismiss Pip"
          aria-label="Dismiss Pip"
        >
          <X className="w-2.5 h-2.5" />
        </button>
        <div
          onClick={handleMascotClick}
          className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
          title="Tap Pip for personalized coaching & survey-tailored chat"
        >
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 p-1 rounded-2xl bg-white/90 dark:bg-[#111218]/90 backdrop-blur-sm border-2 border-indigo-500 shadow-2xl flex items-center justify-center ${
              isBouncing ? "animate-bounce" : "group-hover:-translate-y-1"
            }`}
          >
            <img
              src="/mascot_idle.svg"
              alt="Pip"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500" />
          </span>
        </div>
      </div>
    </aside>
  );
};
