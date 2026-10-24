"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const FloatingMascotBadge: React.FC = () => {
  const { setMascotOpen, sprint, activeTab } = useHuddle();
  const [speechBubble, setSpeechBubble] = useState<string>(
    "Hi! Ask me anything about today's topic or request code examples.",
  );
  const [showSpeech, setShowSpeech] = useState(true);

  useEffect(() => {
    const activeTask = sprint?.tasks?.find((t) => !t.completed);
    const totalTasks = sprint?.tasks?.length || 4;
    const completedCount =
      sprint?.tasks?.filter((t) => t.completed).length || 0;

    if (activeTab === "growth_map") {
      setSpeechBubble(
        "I'm keeping track of your overall learning path. Want to review how today's work connects to your next skill stage?",
      );
    } else if (activeTab === "squad") {
      setSpeechBubble(
        "Your squad is active! Check in or celebrate each other's milestone completions.",
      );
    } else if (activeTab === "explore") {
      setSpeechBubble(
        "Looking for new challenges? Pick any exercise and I will help you adapt it into your active practice.",
      );
    } else if (activeTask) {
      setSpeechBubble(
        `Working on "${activeTask.title}"? I have your step-by-step guidance and resources ready whenever you want to begin!`,
      );
    } else if (completedCount === totalTasks && totalTasks > 0) {
      setSpeechBubble(
        "You cleared all milestones for this focus! Ready to explore your next development stage together?",
      );
    } else {
      setSpeechBubble(
        "I'm Spark - your AI Companion. What skill or challenge would you like to tackle right now?",
      );
    }
    setShowSpeech(true);
  }, [activeTab, sprint?.tasks]);

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 flex items-end gap-3 select-none"
      aria-label="Spark Companion"
    >
      {showSpeech && (
        <div
          onClick={() => setMascotOpen(true)}
          className="relative max-w-xs bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl p-4 shadow-xl text-xs text-[#06427D] dark:text-[#BBBCE4] animate-in fade-in slide-in-from-right-2 duration-200 cursor-pointer hidden sm:block hover:border-[#5420A6] dark:hover:border-[#A9DAF5]/80 transition-all hover:scale-102"
        >
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#5420A6] dark:text-[#A9DAF5] mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Spark - Your AI Companion</span>
          </div>
          <p className="leading-relaxed text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7]">
            {speechBubble}
          </p>
        </div>
      )}

      <button
        onClick={() => setMascotOpen(true)}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-xl hover:shadow-2xl hover:border-[#5420A6] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center p-3 relative group"
        aria-label="Open Spark - Your AI Companion"
        title="Spark - Your AI Companion"
      >
        <img
          src="/mascot_idle.svg"
          alt="Spark"
          className="w-full h-full object-contain transition-transform group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#FFFFFF] dark:ring-[#0e1526] animate-pulse" />
      </button>
    </aside>
  );
};
