"use client";

import React, { useState } from "react";
import {
  Users,
  Send,
  CheckCircle2,
  Copy,
  Flame,
  MessageSquare,
  Globe,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";

export const SquadView: React.FC = () => {
  const {
    user,
    squad,
    macroSquad,
    checkInSquad,
    sendSquadNudge,
    congratulateMacroMilestone,
    setMascotOpen,
  } = useHuddle();

  const [activeSquadTab, setActiveSquadTab] = useState<"micro" | "macro">(
    "micro",
  );
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [checkinInput, setCheckinInput] = useState("");

  const userMember = squad.members.find((m) => m.id === user.id);
  const isUserCheckedIn = userMember?.checkedInToday ?? false;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(
      `Join my Huddle Micro-Squad with invite code: ${squad.inviteCode}`,
    );
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkInSquad(checkinInput || "Completed today’s sprint task!");
    setCheckinInput("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Squad
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Daily peer accountability. Check in after each practice.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveSquadTab("micro")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSquadTab === "micro"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squad (4 members)</span>
          </button>

          <button
            onClick={() => setActiveSquadTab("macro")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSquadTab === "macro"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Community</span>
          </button>
        </div>
      </div>

      {/* Pip Squad Intelligence */}
      <DuolingoMascot
        emotion="encouragement"
        size="md"
        speechText={`**${squad.currentProgress} of ${squad.targetProgress}** weekly check-ins complete.`}
        showQuickActions={true}
      />

      {/* Micro-Squad View */}
      {activeSquadTab === "micro" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Squad Hero Banner */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {squad.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {squad.members.length} of 4 members
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Focus: <span className="text-zinc-700 dark:text-zinc-300 font-medium">{squad.skillFocus}</span> • Weekly goal: {squad.targetProgress} sessions
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyInvite}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-300 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>
                    {copiedInvite ? "Copied" : `Invite: ${squad.inviteCode}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Shared Goal Progress */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Weekly goal
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {squad.currentProgress} of {squad.targetProgress} sessions
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (squad.currentProgress / squad.targetProgress) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {squad.members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      {member.checkedInToday && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {member.handle}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60 min-h-[38px] flex items-center">
                    <span className="italic text-[11px]">
                      "
                      {member.recentEncouragement ||
                        (member.checkedInToday
                          ? "Checked in today"
                          : "No check-in yet")}
                      "
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{member.streak}d streak</span>
                  </div>

                  {member.id === user.id ? (
                    isUserCheckedIn ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        Checked in
                      </span>
                    ) : (
                      <button
                        onClick={() => checkInSquad("Completed Today Step!")}
                        className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Check in
                      </button>
                    )
                  ) : (
                    !member.checkedInToday && (
                      <button
                        onClick={() => sendSquadNudge(member.id)}
                        className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Nudge
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Squad Project */}
            {squad.activeProject && (
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                      <img
                        src="/mascot_planning.svg"
                        alt="Pip"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Squad project
                      </h3>
                      <p className="text-[10.5px] text-zinc-500">
                        Collaborative milestone
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Due {squad.activeProject.deadline}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {squad.activeProject.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {squad.activeProject.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Submissions:{" "}
                    <strong>
                      {squad.activeProject.submissionsCount} of {squad.activeProject.totalMembers}
                    </strong>
                  </span>
                  <button
                    onClick={() => setMascotOpen(true)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Draft with Pip
                  </button>
                </div>
              </div>
            )}

            {/* Activity Feed */}
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  Activity
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium">
                  Squad only
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {squad.activityPings.map((ping) => (
                  <div
                    key={ping.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={ping.memberAvatar}
                        alt={ping.memberName}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {ping.memberName}
                        </span>{" "}
                        <span className="text-zinc-500">{ping.actionText}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                      {ping.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Note Form */}
              <form
                onSubmit={handleCheckinSubmit}
                className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800"
              >
                <input
                  type="text"
                  placeholder="Send note to squad..."
                  value={checkinInput}
                  onChange={(e) => setCheckinInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Community View */}
      {activeSquadTab === "macro" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {macroSquad.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {macroSquad.membersCount} members
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-xl">
                  {macroSquad.description}
                </p>
              </div>

              <div className="px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
                {macroSquad.trackCategory}
              </div>
            </div>
          </div>

          {/* Recent Proofs */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Recent proofs
            </h3>

            <div className="space-y-2">
              {macroSquad.milestoneUpdates.map((up) => (
                <div
                  key={up.id}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={up.authorAvatar}
                      alt={up.authorName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {up.authorName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
                          {up.skillTag}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {up.milestoneTitle}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {up.timestamp}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => congratulateMacroMilestone(up.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      up.userCongratulated
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${up.userCongratulated ? "fill-white" : ""}`}
                    />
                    <span>{up.congratsCount}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
