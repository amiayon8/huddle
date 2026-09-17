"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const FloatingMascotBadge: React.FC = () => {
  const { setMascotOpen, user, sprint, activeTab } = useHuddle();
  const [speechBubble, setSpeechBubble] = useState<string>(
    "Hi! I'm Pip. Ask me anything about your sprint or today's drill.",
  );
  const [showSpeech, setShowSpeech] = useState(true);

  useEffect(() => {
    switch (activeTab) {
      case "dashboard":
      case "overview":
        setSpeechBubble(
          `Day ${sprint.currentDay || 1}: Complete today's drill to keep your progress bar advancing!`,
        );
        break;
      case "explore":
      case "creators":
        setSpeechBubble(
          "Browse short videos and learning ideas. You can add any concept to our sprint!",
        );
        break;
      default:
        setSpeechBubble(
          "Need code explanations or sprint adjustments? Tap here to ask Pip!",
        );
    }
    setShowSpeech(true);
  }, [activeTab, sprint.currentDay, sprint.skillTitle]);

  return (
    <aside
      className="fixed bottom-5 right-5 z-40 flex items-end gap-2.5 select-none"
      aria-label="Spark AI Chatbot Assistant"
    >
      {/* Speech Bubble */}
      {showSpeech && (
        <div
          onClick={() => setMascotOpen(true)}
          className="relative max-w-xs bg-white dark:bg-[#111218] border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl p-3 shadow-xl text-xs text-zinc-700 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-200 cursor-pointer hidden sm:block hover:border-indigo-400 dark:hover:border-indigo-700 transition-colors"
        >
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Spark AI Tutor</span>
          </div>
          <p className="leading-relaxed text-[11.5px]">{speechBubble}</p>
          {/* Bubble tail */}
          <div className="absolute right-[-6px] bottom-4 w-3 h-3 bg-white dark:bg-[#111218] border-r border-b border-indigo-200/80 dark:border-indigo-900/60 transform rotate-[-45deg]" />
        </div>
      )}

      {/* Floating SparkMascot Button */}
      <button
        onClick={() => setMascotOpen(true)}
        className="relative group w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
        aria-label="Open Spark AI Chatbot"
        title="Open Spark AI Chatbot"
      >
        <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0c0d12] flex items-center justify-center p-2 relative overflow-hidden">
          <img
            src="/mascot_idle.svg"
            alt="Pip"
            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
          />
          {/* Active online dot */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0d12]" />
        </div>
      </button>
    </aside>
  );
};
