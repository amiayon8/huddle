"use client";

import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  Flame,
  Heart,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const ProgressShareModal: React.FC = () => {
  const { shareModalOpen, shareCardData, closeShareModal, sprint, user } =
    useHuddle();
  const [copied, setCopied] = useState(false);

  if (!shareModalOpen || !shareCardData) return null;

  const shareText = `🚀 Milestone Verified on Huddle!\nI just cleared "${shareCardData.milestoneTitle}" while leveling up ${shareCardData.skillTitle}.\n⚡ Streak: ${shareCardData.streak} days | ❤️ Skill Health: ${shareCardData.healthPercent}%\nVerified by Spark AI. Keep moving forward!`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-[#11131d] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Share2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold">Share Progress with Friends</h2>
          </div>

          <button
            onClick={closeShareModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Share Card Preview */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200/70 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-900/90 via-[#0f111a] to-[#16132b] text-white p-5 space-y-4 shadow-xl">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Card Top */}
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2.5">
              <img
                src={shareCardData.userAvatar || "/avatars/avatar-1.svg"}
                alt={shareCardData.userName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-400/40"
              />
              <div>
                <div className="font-bold text-xs leading-none">
                  {shareCardData.userName}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                  {shareCardData.userHandle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-indigo-200">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Huddle Verified</span>
            </div>
          </div>

          {/* Card Milestone */}
          <div className="space-y-1 relative pt-1">
            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold block">
              Craft Milestone
            </span>
            <h3 className="text-base font-black tracking-tight leading-snug text-white">
              {shareCardData.milestoneTitle}
            </h3>
            <p className="text-xs text-zinc-300">
              Track: <span className="font-semibold text-white">{shareCardData.skillTitle}</span>
            </p>
          </div>

          {/* Card Badges / Health bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-medium block">
                Skill Vitality
              </span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{shareCardData.healthPercent}% Optimal</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-zinc-400 font-medium block">
                Consistency Streak
              </span>
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{shareCardData.streak} Days Active</span>
              </div>
            </div>
          </div>

          {/* Card Footer Spark Seal */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <img
                src="/mascot_idle.svg"
                alt="Spark"
                className="w-4 h-4 object-contain"
              />
              <span>Coached by Spark AI</span>
            </div>
            <span className="font-mono text-zinc-500">huddle.app</span>
          </div>
        </div>

        {/* Sharing explanation note */}
        <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
          Share your proof with teammates or friends without competitive rank anxiety. Pure validation and craft growth.
        </p>

        {/* Copy / Share Actions */}
        <div className="space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Milestone Text to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Progress Card Text</span>
              </>
            )}
          </button>

          <button
            onClick={closeShareModal}
            className="w-full py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
