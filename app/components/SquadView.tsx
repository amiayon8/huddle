"use client";

import React, { useState } from "react";
import { Copy, Check, Plus, Shield, Clock, CheckCircle2 } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const SquadView: React.FC = () => {
  const {
    user,
    squad,
    checkInSquad,
    sendSquadCheer,
    sendSquadNudge,
    joinSquadByCode,
    createCustomSquad,
  } = useHuddle();

  const [inviteCopied, setInviteCopied] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadGoal, setNewSquadGoal] = useState("");

  const copyInviteCode = () => {
    if (typeof navigator !== "undefined" && squad.inviteCode) {
      navigator.clipboard.writeText(squad.inviteCode);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    setJoinSuccess("");

    if (!joinCodeInput.trim()) {
      setJoinError("Please enter a valid squad invite code.");
      return;
    }

    const success = joinSquadByCode(joinCodeInput.trim());
    if (success) {
      setJoinSuccess("Successfully joined the squad.");
      setJoinCodeInput("");
      setTimeout(() => {
        setIsJoinModalOpen(false);
        setJoinSuccess("");
      }, 1200);
    } else {
      setJoinError("Squad code not found. Please check and try again.");
    }
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;

    createCustomSquad({
      name: newSquadName.trim(),
      skillFocus: squad.skillFocus || "General Practice",
      sharedGoal:
        newSquadGoal.trim() || "Complete daily practice milestones together.",
      targetProgress: 12,
    });

    setIsCreateModalOpen(false);
    setNewSquadName("");
    setNewSquadGoal("");
  };

  const members =
    squad.members && squad.members.length > 0
      ? squad.members
      : [
          {
            id: user.id || "user-me",
            name: user.name || "Ayon",
            handle: user.handle || "@sarkerayon",
            avatar: user.avatar || "/mascot_idle.svg",
            role: "lead" as const,
            completedToday: true,
            checkedInToday: true,
            weeklyMilestonesCompleted: 3,
            currentStreak: user.streak || 1,
            lastCheckInTime: "10 mins ago",
          },
          {
            id: "member-2",
            name: "Rahat Chowdhury",
            handle: "@rahat.infra",
            avatar: "/avatars/avatar-3.svg",
            role: "member" as const,
            completedToday: true,
            checkedInToday: true,
            weeklyMilestonesCompleted: 2,
            currentStreak: 4,
            lastCheckInTime: "1 hour ago",
          },
          {
            id: "member-3",
            name: "Nusrat Jahan",
            handle: "@nusrat.jahan",
            avatar: "/avatars/avatar-2.svg",
            role: "member" as const,
            completedToday: false,
            checkedInToday: false,
            weeklyMilestonesCompleted: 2,
            currentStreak: 3,
            lastCheckInTime: "Yesterday",
          },
        ];

  const recentPings =
    squad.activityPings && squad.activityPings.length > 0
      ? squad.activityPings
      : [
          {
            id: "ping-1",
            memberId: "member-2",
            memberName: "Rahat Chowdhury",
            memberAvatar: "/avatars/avatar-3.svg",
            actionText: "completed today's practice milestone",
            timestamp: "1 hour ago",
            type: "task_completed" as const,
          },
          {
            id: "ping-2",
            memberId: user.id || "user-me",
            memberName: user.name || "Alex",
            memberAvatar: user.avatar || "/mascot_idle.svg",
            actionText: "checked in for the day",
            timestamp: "Today",
            type: "check_in" as const,
          },
        ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-zinc-500">
            Accountability & Community
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white mt-0.5">
            Your Squad
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Join with code
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create squad</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/50 dark:border-indigo-800/50">
                {squad.skillFocus || "Active Focus"}
              </span>
              <span className="text-xs text-zinc-400">
                {members.length} members
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
              {squad.name || "Engineering Crew"}
            </h2>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl">
              {squad.sharedGoal ||
                "Complete daily deliberate practice sessions and stay consistent together."}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={copyInviteCode}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 cursor-pointer"
              title="Copy invite code"
            >
              <span>{squad.inviteCode || "HUDDLE-SYS-01"}</span>
              {inviteCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            <button
              onClick={() => checkInSquad()}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Check In</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Squad Members</span>
            <span>Today's Milestone</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {members.map((member) => {
              const isCurrentUser = member.id === user.id;

              return (
                <div
                  key={member.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar || "/mascot_idle.svg"}
                      alt={member.name}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                            You
                          </span>
                        )}
                        {member.role === "lead" && (
                          <Shield className="w-3 h-3 text-indigo-500" />
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {member.handle} •{" "}
                        {member.weeklyMilestonesCompleted || 0} completed this
                        week
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {member.completedToday ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/50 dark:border-emerald-800/40">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>In progress</span>
                      </span>
                    )}

                    {!isCurrentUser && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => sendSquadCheer(member.id)}
                          className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs transition-colors cursor-pointer"
                        >
                          Cheer
                        </button>
                        {!member.completedToday && (
                          <button
                            onClick={() => sendSquadNudge(member.id)}
                            className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs transition-colors cursor-pointer"
                          >
                            Nudge
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-8 space-y-4 transition-colors">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
          Recent Activity
        </h3>

        <div className="space-y-2.5">
          {recentPings.map((ping) => (
            <div
              key={ping.id}
              className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={ping.memberAvatar || "/mascot_idle.svg"}
                  alt={ping.memberName}
                  className="w-6 h-6 rounded-lg object-cover"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {ping.memberName}
                  </strong>{" "}
                  {ping.actionText}
                </span>
              </div>

              <span className="text-zinc-400 text-[11px]">
                {ping.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsJoinModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Join a Squad
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Enter the invite code provided by your teammate or squad lead to
              join their group.
            </p>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="e.g. HUDDLE-SYS-01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {joinError && (
                <div className="text-xs text-rose-600 dark:text-rose-400">
                  {joinError}
                </div>
              )}

              {joinSuccess && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  {joinSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white">
              Create a Squad
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Start a new accountability group and invite friends or colleagues
              to practice together.
            </p>

            <form onSubmit={handleCreateSquad} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Frontend Architecture Guild"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Shared Goal
                </label>
                <input
                  type="text"
                  value={newSquadGoal}
                  onChange={(e) => setNewSquadGoal(e.target.value)}
                  placeholder="e.g. Complete our weekly sprint milestones without misses"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
