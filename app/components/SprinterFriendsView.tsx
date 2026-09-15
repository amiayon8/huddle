"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Heart,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send,
  Share2,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const SprinterFriendsView: React.FC = () => {
  const { friends, addFriend, cheerFriend, nudgeFriend, user } = useHuddle();
  const [addHandleInput, setAddHandleInput] = useState("");
  const [addStatusMessage, setAddStatusMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addHandleInput.trim()) return;
    const res = addFriend(addHandleInput);
    setAddStatusMessage({ success: res.success, text: res.message });
    if (res.success) {
      setAddHandleInput("");
      setTimeout(() => {
        setIsAddOpen(false);
        setAddStatusMessage(null);
      }, 1500);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#11131d]/90 backdrop-blur-xl p-5 sm:p-6 space-y-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <span>Sprinter Friends</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                Healthy Social Momentum
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              See teammates moving forward without toxic public leaderboards.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Sprinter Friend</span>
        </button>
      </div>

      {/* Add Friend Form Drawer */}
      {isAddOpen && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Add Friend by Handle or Invite Code
            </span>
            <span className="text-[11px] text-zinc-400">
              Your code: <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">HUDDLE-{user.id.slice(-4).toUpperCase()}</code>
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={addHandleInput}
              onChange={(e) => setAddHandleInput(e.target.value)}
              placeholder="e.g. @elenar or HUDDLE-7A2B"
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Add Friend
            </button>
          </div>
          {addStatusMessage && (
            <p
              className={`text-xs ${
                addStatusMessage.success
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {addStatusMessage.text}
            </p>
          )}
        </form>
      )}

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="p-4 rounded-xl bg-white dark:bg-[#0e1017] border border-zinc-200/70 dark:border-zinc-800/70 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0e1017]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {friend.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 truncate">
                      {friend.handle}
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                    {friend.currentSkill}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{friend.streak}d streak</span>
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>
                  Day {friend.dayNumber} of {friend.totalDays}
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {friend.progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${friend.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Activity snippet & Quick reaction */}
            <div className="flex items-center justify-between pt-1 text-xs border-t border-zinc-100 dark:border-zinc-800/60">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate pr-2">
                {friend.statusText}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => cheerFriend(friend.id)}
                  disabled={friend.cheeredToday}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    friend.cheeredToday
                      ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 cursor-default"
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-950/80 text-zinc-700 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-300"
                  }`}
                  title="Send supportive cheer"
                >
                  <Heart className={`w-3 h-3 ${friend.cheeredToday ? "fill-current text-purple-500" : ""}`} />
                  <span>{friend.cheeredToday ? "Cheered 🎉" : "Cheer"}</span>
                </button>

                <button
                  onClick={() => nudgeFriend(friend.id)}
                  disabled={friend.nudgedToday}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    friend.nudgedToday
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-default"
                      : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                  title="Send a friendly practice reminder"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{friend.nudgedToday ? "Nudged ⚡" : "Nudge"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
