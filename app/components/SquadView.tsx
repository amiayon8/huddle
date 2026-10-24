"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Plus,
  Shield,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Bell,
  MessageSquare,
  Globe,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { getGravatarUrl, getUserAvatarUrl } from "../lib/gravatar";

export const SquadView: React.FC = () => {
  const {
    user,
    squad,
    checkInSquad,
    sendSquadCheer,
    sendSquadNudge,
    joinSquadByCode,
    createCustomSquad,
    squadDiscussions,
    sendSquadDiscussionMessage,
    setActiveTab,
  } = useHuddle();

  const [inviteCopied, setInviteCopied] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadGoal, setNewSquadGoal] = useState("");

  const [discussionInput, setDiscussionInput] = useState("");
  const [discussionType, setDiscussionType] = useState<
    "standup" | "blocker" | "message" | "celebration"
  >("standup");
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);

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

  const handleSendDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    sendSquadDiscussionMessage(discussionInput.trim(), discussionType);
    setDiscussionInput("");
  };

  const handleCheerMember = (memberId: string, memberName: string) => {
    sendSquadCheer(memberId);
    setCheerNotice(`Sent a cheer to ${memberName}.`);
    setTimeout(() => setCheerNotice(null), 2500);
  };

  const handleNudgeMember = (memberId: string, memberName: string) => {
    sendSquadNudge(memberId);
    setCheerNotice(`Sent an accountability nudge to ${memberName}.`);
    setTimeout(() => setCheerNotice(null), 2500);
  };

  const members =
    squad.members && squad.members.length > 0
      ? squad.members
      : [
          {
            id: user.id || "user-me",
            name: user.name || "Ayon",
            handle: user.handle || "@sarkerayon",
            avatar: getUserAvatarUrl(user, 72),
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
            avatar: getGravatarUrl("rahat.infra@example.com", 72),
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
            avatar: getGravatarUrl("nusrat.jahan@example.com", 72),
            role: "member" as const,
            completedToday: false,
            checkedInToday: false,
            weeklyMilestonesCompleted: 2,
            currentStreak: 3,
            lastCheckInTime: "Yesterday",
          },
        ];

  const completedTodayCount = members.filter((m) => m.completedToday).length;
  const executionRate = Math.round(
    (completedTodayCount / Math.max(1, members.length)) * 100,
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5420A6] dark:text-[#A9DAF5]">
            <Users className="w-4 h-4" />
            <span>4-Person Micro Squad • Accountability & Peer Momentum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
            Micro Squad
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4]/80 mt-1 max-w-2xl leading-relaxed">
            A small 4-person circle to check in on each other, monitor daily
            practice progress, exchange standup notes, and maintain constructive
            peer accountability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("community")}
            className="duo-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
            <span>Browse Communities</span>
          </button>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs font-medium text-[#06427D] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 transition-colors cursor-pointer"
          >
            Join with code
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="duo-button-primary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {cheerNotice && (
        <div className="p-3 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] text-[#06427D] dark:text-[#BBBCE4] text-xs font-medium animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5] shrink-0" />
          <span>{cheerNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] space-y-1">
          <div className="text-[11px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/70 uppercase tracking-wider">
            Today's Squad Rate
          </div>
          <div className="text-2xl font-black text-[#06427D] dark:text-[#e6e9f7]">
            {completedTodayCount} of {members.length} Completed
          </div>
          <div className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
            {executionRate}% daily milestone completion rate
          </div>
          <div className="w-full bg-[#dcdff2] dark:bg-[#080c18] h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${executionRate}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] space-y-1">
          <div className="text-[11px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/70 uppercase tracking-wider">
            Shared Weekly Target
          </div>
          <div className="text-2xl font-black text-[#5420A6] dark:text-[#A9DAF5]">
            {squad.currentProgress || 8} / {squad.targetProgress || 12}
          </div>
          <div className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
            Milestones verified by members this sprint
          </div>
          <div className="w-full bg-[#dcdff2] dark:bg-[#080c18] h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#5420A6] h-full rounded-full transition-all"
              style={{
                width: `${Math.round(((squad.currentProgress || 8) / (squad.targetProgress || 12)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] space-y-1">
          <div className="text-[11px] font-bold text-[#5D6080] dark:text-[#BBBCE4]/70 uppercase tracking-wider">
            Squad Focus Track
          </div>
          <div className="text-lg font-bold text-[#06427D] dark:text-[#e6e9f7] truncate">
            {squad.name || "Engineering Crew"}
          </div>
          <div className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75 truncate">
            {squad.skillFocus || "System Architecture"}
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="font-mono text-[#5D6080] dark:text-[#BBBCE4]/60">
              Code: {squad.inviteCode || "HUDDLE-SYS-01"}
            </span>
            <button
              onClick={copyInviteCode}
              className="text-[#5420A6] dark:text-[#A9DAF5] font-semibold hover:underline cursor-pointer"
            >
              {inviteCopied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
              <div>
                <h2 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Member Performance & Development
                </h2>
                <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75">
                  Individual consistency and progress check-ins
                </p>
              </div>

              <button
                onClick={() => checkInSquad()}
                className="duo-button-primary px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Check In</span>
              </button>
            </div>

            <div className="divide-y divide-[#dcdff2] dark:divide-[#1d2c4e]">
              {members.map((member) => {
                const isCurrentUser = member.id === user.id;

                return (
                  <div
                    key={member.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getUserAvatarUrl(member, 72)}
                        alt={member.name}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-[#dcdff2] dark:ring-[#1d2c4e]"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#06427D] dark:text-[#e6e9f7]">
                            {member.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] font-semibold">
                              You
                            </span>
                          )}
                          {member.role === "lead" && (
                            <Shield className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/70 mt-0.5">
                          <span>{member.handle}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                            <img
                              src="/icons/meteor-svgrepo-com.svg"
                              alt="Streak"
                              className="w-3.5 h-3.5 object-contain"
                            />
                            <span>{member.currentStreak || 1}d</span>
                          </span>
                          <span>•</span>
                          <span>
                            {member.weeklyMilestonesCompleted || 0} this week
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      {member.completedToday ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/50 dark:border-emerald-800/40">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Completed Today</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/50 dark:border-amber-800/40">
                          <Clock className="w-3 h-3" />
                          <span>In progress</span>
                        </span>
                      )}

                      {!isCurrentUser && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              handleCheerMember(member.id, member.name)
                            }
                            className="px-2.5 py-1 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#BBBCE4]/20 text-[#06427D] dark:text-[#BBBCE4] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cheer
                          </button>
                          {!member.completedToday && (
                            <button
                              onClick={() =>
                                handleNudgeMember(member.id, member.name)
                              }
                              className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Send an accountability ping"
                            >
                              <Bell className="w-3 h-3" />
                              <span>Nudge</span>
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

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
              <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                <span>Squad Discussions & Standups</span>
              </h3>
              <span className="text-[11px] font-semibold text-[#5D6080] dark:text-[#BBBCE4]/60">
                Small group only
              </span>
            </div>

            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75 leading-relaxed">
              Post daily standups, ask questions, or flag blockers for your 3
              peers.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {squadDiscussions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#5D6080] dark:text-[#BBBCE4]/60">
                  No squad messages yet. Say hello to your squad!
                </div>
              ) : (
                squadDiscussions.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-5 h-5 rounded-md object-cover"
                        />
                        <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                          {msg.senderName}
                        </span>
                        {msg.type === "blocker" && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Blocker
                          </span>
                        )}
                        {msg.type === "standup" && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#BBBCE4]/30 text-[#5420A6] dark:text-[#A9DAF5] border border-[#BBBCE4]/40">
                            Standup
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60">
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed pl-7">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendDiscussion}
              className="pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e] space-y-2.5"
            >
              <div className="flex items-center gap-1.5 text-xs">
                {(["standup", "blocker", "message"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDiscussionType(type)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                      discussionType === type
                        ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                        : "bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={discussionInput}
                  onChange={(e) => setDiscussionInput(e.target.value)}
                  placeholder="Share a standup note or ask your squad..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder:text-[#5D6080]/60 focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                />
                <button
                  type="submit"
                  className="duo-button-primary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsJoinModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#0e1526] border-2 border-[#5420A6] rounded-3xl p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Join a Micro Squad
            </h3>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80 leading-relaxed">
              Enter the invite code from your 3 accountability peers to join
              their squad.
            </p>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="e.g. HUDDLE-SYS-01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] font-mono focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
              />

              {joinError && (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {joinError}
                </div>
              )}

              {joinSuccess && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {joinSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="duo-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="duo-button-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#0e1526] border-2 border-[#5420A6] rounded-3xl p-6 shadow-xl z-10 space-y-4">
            <h3 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Create a Micro Squad
            </h3>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80 leading-relaxed">
              Start a new 4-person accountability group and share code to
              practice together.
            </p>

            <form onSubmit={handleCreateSquad} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Squad Name
                </label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Distributed Core Squad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Shared Weekly Goal
                </label>
                <input
                  type="text"
                  value={newSquadGoal}
                  onChange={(e) => setNewSquadGoal(e.target.value)}
                  placeholder="e.g. Complete our daily deliberate milestones without misses"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="duo-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="duo-button-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
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
