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
  Plus,
  Sparkles,
  ExternalLink,
  FileText,
  Check,
  Bell,
  ArrowRight,
  X,
  Compass,
  Settings,
  RefreshCw,
  UserMinus,
  UserCheck,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flag
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";
import { 
  SquadProjectDeliverable, 
  SquadCreatePayload, 
  SquadMember, 
  ReportReasonCategory 
} from "../types/huddle";

const quickCheckinTags = [
  "Completed today's deliberate practice",
  "Reviewing distributed cache RFC",
  "Benchmarking split-brain failover",
  "Deep dive into Postgres query planner",
  "Pair programming on idempotent worker"
];

const communityFilterTags = [
  "All Tracks",
  "System Architecture",
  "Next.js Full-Stack",
  "TypeScript Core",
  "Distributed Systems"
];

const standardFocusTracks = [
  "System Architecture",
  "Next.js Full-Stack",
  "TypeScript Core",
  "Frontend Architecture",
  "Distributed Systems & Cloud",
  "Machine Learning & AI"
];

export const SquadView: React.FC = () => {
  const {
    user,
    squad,
    macroSquad,
    checkInSquad,
    sendSquadNudge,
    sendSquadCheer,
    submitSquadProject,
    joinSquadByCode,
    createCustomSquad,
    removeSquadMember,
    updateSquadMemberRole,
    updateSquadSettings,
    regenerateSquadInviteCode,
    submitAnonymousSquadReport,
    shareProofToCommunity,
    congratulateMacroMilestone,
    setMascotOpen,
  } = useHuddle();

  const [activeSquadTab, setActiveSquadTab] = useState<"micro" | "macro">("micro");
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [checkinInput, setCheckinInput] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  const [selectedDeliverable, setSelectedDeliverable] = useState<SquadProjectDeliverable | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableNotes, setDeliverableNotes] = useState("");
  const [deliverableLink, setDeliverableLink] = useState("");

  const [isSquadSwitcherOpen, setIsSquadSwitcherOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinCodeFeedback, setJoinCodeFeedback] = useState<string | null>(null);
  const [switcherTab, setSwitcherTab] = useState<"switch" | "create">("switch");

  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadFocusSelect, setNewSquadFocusSelect] = useState("System Architecture");
  const [newSquadCustomFocus, setNewSquadCustomFocus] = useState("");
  const [newSquadGoal, setNewSquadGoal] = useState("");
  const [newSquadTarget, setNewSquadTarget] = useState(12);

  const [isSquadSettingsModalOpen, setIsSquadSettingsModalOpen] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsFocusSelect, setSettingsFocusSelect] = useState("System Architecture");
  const [settingsCustomFocus, setSettingsCustomFocus] = useState("");
  const [settingsGoal, setSettingsGoal] = useState("");
  const [settingsTarget, setSettingsTarget] = useState(12);
  const [isRegeneratingCode, setIsRegeneratingCode] = useState(false);

  const [memberToRemove, setMemberToRemove] = useState<SquadMember | null>(null);
  const [reportTargetMember, setReportTargetMember] = useState<SquadMember | null>(null);
  const [reportCategory, setReportCategory] = useState<ReportReasonCategory>("harassment");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [activeMemberMenuId, setActiveMemberMenuId] = useState<string | null>(null);

  const [selectedCommunityTag, setSelectedCommunityTag] = useState("All Tracks");
  const [isShareProofOpen, setIsShareProofOpen] = useState(false);
  const [proofTitleInput, setProofTitleInput] = useState("");
  const [proofTrackInput, setProofTrackInput] = useState("System Architecture");
  const [proofCustomTrack, setProofCustomTrack] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const userMember = squad.members.find((m) => m.id === user.id);
  const isUserCheckedIn = userMember?.checkedInToday ?? false;
  const isLeader = userMember?.role === "lead";

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(
      `Join my Huddle Micro-Squad with invite code: ${squad.inviteCode}`
    );
    setCopiedInvite(true);
    showToast(`Invite code ${squad.inviteCode} copied to clipboard`);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = checkinInput.trim() || "Completed today's deliberate practice session";
    checkInSquad(finalNote);
    setCheckinInput("");
    setIsEditingNote(false);
    showToast("Daily check-in verified with your squad");
  };

  const handleQuickTagClick = (tag: string) => {
    setCheckinInput(tag);
  };

  const handleCheerMember = (memberId: string, memberName: string) => {
    sendSquadCheer(memberId);
    showToast(`Sent high-five cheer to ${memberName}`);
  };

  const handleNudgeMember = (memberId: string, memberName: string) => {
    sendSquadNudge(memberId);
    showToast(`Sent gentle practice nudge to ${memberName}`);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim()) return;
    submitSquadProject(deliverableTitle.trim(), deliverableNotes.trim(), deliverableLink.trim() || undefined);
    setDeliverableTitle("");
    setDeliverableNotes("");
    setDeliverableLink("");
    setIsSubmitModalOpen(false);
    showToast("Deliverable registered in squad blueprint");
  };

  const handleJoinSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const success = joinSquadByCode(joinCodeInput.trim());
    if (success) {
      showToast(`Switched to squad ${joinCodeInput.trim().toUpperCase()}`);
      setJoinCodeInput("");
      setJoinCodeFeedback(null);
      setIsSquadSwitcherOpen(false);
    } else {
      setJoinCodeFeedback("Unable to find squad with this code.");
    }
  };

  const handleSelectPresetSquad = (presetCode: string) => {
    joinSquadByCode(presetCode);
    showToast(`Switched squad to ${presetCode}`);
    setIsSquadSwitcherOpen(false);
  };

  const handleCreateSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    const finalFocus =
      newSquadFocusSelect === "Custom"
        ? (newSquadCustomFocus.trim() || "Custom Track")
        : newSquadFocusSelect;
    const payload: SquadCreatePayload = {
      name: newSquadName.trim(),
      skillFocus: finalFocus,
      sharedGoal: newSquadGoal.trim() || `Complete ${newSquadTarget} deliberate practice sessions this week.`,
      targetProgress: newSquadTarget
    };
    createCustomSquad(payload);
    setNewSquadName("");
    setNewSquadGoal("");
    setNewSquadCustomFocus("");
    setNewSquadFocusSelect("System Architecture");
    setIsSquadSwitcherOpen(false);
    showToast(`Squad "${payload.name}" successfully created`);
  };

  const handleOpenSettingsModal = () => {
    setSettingsName(squad.name);
    const isPreset = standardFocusTracks.includes(squad.skillFocus);
    if (isPreset) {
      setSettingsFocusSelect(squad.skillFocus);
      setSettingsCustomFocus("");
    } else {
      setSettingsFocusSelect("Custom");
      setSettingsCustomFocus(squad.skillFocus);
    }
    setSettingsGoal(squad.sharedGoal);
    setSettingsTarget(squad.targetProgress);
    setIsSquadSettingsModalOpen(true);
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsName.trim()) return;
    const finalFocus =
      settingsFocusSelect === "Custom"
        ? (settingsCustomFocus.trim() || "Custom Track")
        : settingsFocusSelect;
    await updateSquadSettings({
      name: settingsName.trim(),
      skillFocus: finalFocus,
      sharedGoal: settingsGoal.trim() || `Complete ${settingsTarget} deliberate practice sessions this week.`,
      targetProgress: Number(settingsTarget) || 12
    });
    setIsSquadSettingsModalOpen(false);
    showToast("Squad settings updated");
  };

  const handleRegenerateInviteCode = async () => {
    setIsRegeneratingCode(true);
    const newCode = await regenerateSquadInviteCode();
    setIsRegeneratingCode(false);
    showToast(`New squad invite code: ${newCode}`);
  };

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;
    const targetName = memberToRemove.name;
    await removeSquadMember(memberToRemove.id);
    setMemberToRemove(null);
    showToast(`${targetName} removed from the squad`);
  };

  const handleToggleMemberRole = async (target: SquadMember) => {
    const nextRole: "member" | "lead" = target.role === "lead" ? "member" : "lead";
    await updateSquadMemberRole(target.id, nextRole);
    setActiveMemberMenuId(null);
    showToast(
      `${target.name} role updated to ${nextRole === "lead" ? "Squad Co-Lead" : "Squad Member"}`
    );
  };

  const handleOpenReportModal = (target: SquadMember) => {
    setReportTargetMember(target);
    setReportCategory("harassment");
    setReportDetails("");
    setActiveMemberMenuId(null);
  };

  const handleSubmitAnonymousReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTargetMember) return;
    setIsSubmittingReport(true);
    const res = await submitAnonymousSquadReport({
      squadId: squad.id,
      reportedMemberId: reportTargetMember.id,
      reportedMemberName: reportTargetMember.name,
      reasonCategory: reportCategory,
      details: reportDetails
    });
    setIsSubmittingReport(false);
    setReportTargetMember(null);
    if (res.success) {
      showToast("Report submitted anonymously to Trust & Safety");
    } else {
      showToast("Report submitted (saved locally)");
    }
  };


  const handleShareProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitleInput.trim()) return;
    const finalTrack =
      proofTrackInput === "Custom"
        ? (proofCustomTrack.trim() || "Custom Track")
        : proofTrackInput;
    shareProofToCommunity(proofTitleInput.trim(), finalTrack);
    setProofTitleInput("");
    setProofCustomTrack("");
    setIsShareProofOpen(false);
    showToast("Milestone proof shared to global circle");
  };

  const filteredMacroUpdates = selectedCommunityTag === "All Tracks"
    ? macroSquad.milestoneUpdates
    : macroSquad.milestoneUpdates.filter(
        (update) => update.skillTag.toLowerCase() === selectedCommunityTag.toLowerCase()
      );

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-16 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-xl border border-zinc-800 dark:border-zinc-200 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Squad Accountability
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Four peers practicing deliberate engineering every day. Zero toxic leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsSquadSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Squad Hub</span>
          </button>

          <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              onClick={() => setActiveSquadTab("micro")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSquadTab === "micro"
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Squad ({squad.members.length})</span>
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
              <span>Global Circle ({macroSquad.membersCount})</span>
            </button>
          </div>
        </div>
      </div>

      <DuolingoMascot
        emotion={isUserCheckedIn ? "success" : "encouragement"}
        size="md"
        speechText={
          isUserCheckedIn
            ? `Your check-in is verified for today. Squad progress is **${squad.currentProgress} of ${squad.targetProgress}** weekly sessions.`
            : `**${squad.currentProgress} of ${squad.targetProgress}** weekly sessions complete. Complete today's practice to register your check-in.`
        }
        showQuickActions={true}
      />

      {activeSquadTab === "micro" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {squad.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {squad.members.length} of 4 members
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Focus: <span className="text-zinc-800 dark:text-zinc-200 font-medium">{squad.skillFocus}</span> • Goal: {squad.sharedGoal}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isLeader && (
                  <button
                    onClick={handleOpenSettingsModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Squad Settings</span>
                  </button>
                )}
                <button
                  onClick={handleCopyInvite}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedInvite ? "Copied code" : `Invite: ${squad.inviteCode}`}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Weekly collaborative goal
                </span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {squad.currentProgress} of {squad.targetProgress} sessions ({Math.round((squad.currentProgress / squad.targetProgress) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (squad.currentProgress / squad.targetProgress) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>

          {!isUserCheckedIn || isEditingNote ? (
            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-[#111218] shadow-xs space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {isEditingNote ? "Update Today's Note" : "Today's Squad Check-In"}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Keep your 8-day streak alive and let your squad know what you explored today.
                    </p>
                  </div>
                </div>

                {isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickCheckinTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      checkinInput === tag
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCheckinSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  placeholder="What deliberate practice did you focus on today?"
                  value={checkinInput}
                  onChange={(e) => setCheckinInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isEditingNote ? "Save note" : "Check in now"}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Checked in for today
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Streak preserved (8 days)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 italic">
                    "{userMember?.recentEncouragement || "Completed today's deliberate practice"}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setCheckinInput(userMember?.recentEncouragement || "");
                  setIsEditingNote(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Edit note
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {squad.members.map((member) => {
              const isCurrentUser = member.id === user.id;

              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-xl border bg-white dark:bg-[#111218] shadow-xs flex flex-col justify-between space-y-3.5 transition-all ${
                    isCurrentUser
                      ? "border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-500/10"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white dark:border-zinc-900 rounded-full ${
                              member.checkedInToday ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate">
                            {member.handle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 relative">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold uppercase tracking-wider shrink-0 ${
                            member.role === "lead"
                              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          {member.role === "lead" ? "Lead" : "Member"}
                        </span>

                        {!isCurrentUser && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMemberMenuId((prev) =>
                                  prev === member.id ? null : member.id
                                )
                              }
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Member options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {activeMemberMenuId === member.id && (
                              <div className="absolute right-0 top-7 z-30 w-48 rounded-xl bg-white dark:bg-[#181920] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                                {isLeader && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleMemberRole(member)}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
                                    >
                                      {member.role === "lead" ? (
                                        <>
                                          <UserMinus className="w-3.5 h-3.5 text-zinc-400" />
                                          <span>Demote to Member</span>
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                                          <span>Promote to Co-Lead</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMemberToRemove(member);
                                        setActiveMemberMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                    >
                                      <UserMinus className="w-3.5 h-3.5" />
                                      <span>Remove from Squad</span>
                                    </button>

                                    <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/80" />
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleOpenReportModal(member)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-amber-600 dark:text-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Report Member</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 min-h-[46px] flex items-center">
                      <span className="italic text-[11px] leading-relaxed line-clamp-2">
                        "{member.recentEncouragement || (member.checkedInToday ? "Checked in for today" : "Pending today's check-in")}"
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{member.streak}d streak</span>
                    </div>

                    {isCurrentUser ? (
                      member.checkedInToday ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Checked in</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => checkInSquad("Completed today's deliberate practice")}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Check in
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenReportModal(member)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 border border-transparent hover:border-amber-200 dark:hover:border-amber-800/50 transition-colors cursor-pointer"
                          title="Report member anonymously"
                        >
                          <Flag className="w-3 h-3" />
                        </button>

                        {member.checkedInToday ? (
                          <button
                            type="button"
                            onClick={() => handleCheerMember(member.id, member.name)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>High five</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleNudgeMember(member.id, member.name)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 text-[10.5px] font-medium transition-colors cursor-pointer"
                          >
                            <Bell className="w-3 h-3 text-zinc-400" />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {squad.activeProject && (
              <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Squad Project
                      </h3>
                      <p className="text-[10.5px] text-zinc-500">
                        Collaborative engineering milestone
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

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Deliverables: <strong>{squad.activeProject.submissionsCount} of {squad.activeProject.totalMembers}</strong> submitted
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {Math.round((squad.activeProject.submissionsCount / squad.activeProject.totalMembers) * 100)}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (squad.activeProject.submissionsCount / squad.activeProject.totalMembers) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Member Deliverables
                  </div>
                  <div className="space-y-1.5">
                    {squad.activeProject.deliverables && squad.activeProject.deliverables.length > 0 ? (
                      squad.activeProject.deliverables.map((item) => (
                        <div
                          key={item.memberId}
                          className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.memberAvatar}
                              alt={item.memberName}
                              className="w-5 h-5 rounded-md object-cover"
                            />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {item.memberName}
                            </span>
                            <span className="text-zinc-500 truncate">
                              "{item.title}"
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedDeliverable(item)}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2 cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-zinc-400 py-1 italic">
                        No submissions yet. Be the first to submit.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => setMascotOpen(true)}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                  >
                    Draft with Pip AI
                  </button>

                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Submit Deliverable</span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Activity Stream</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium">
                  Micro-squad only
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {squad.activityPings.map((ping) => (
                  <div
                    key={ping.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={ping.memberAvatar}
                        alt={ping.memberName}
                        className="w-6 h-6 rounded-md object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {ping.memberName}
                        </span>{" "}
                        <span className="text-zinc-500">{ping.actionText}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0">
                      {ping.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleCheckinSubmit}
                className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800"
              >
                <input
                  type="text"
                  placeholder="Share a thought or link with squad..."
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

      {activeSquadTab === "macro" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {macroSquad.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {macroSquad.membersCount} engineers
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
                  {macroSquad.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsShareProofOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Share Verified Proof</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {communityFilterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedCommunityTag(tag)}
                  className={`text-[11px] px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedCommunityTag === tag
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Engineering Proofs
            </h3>

            <div className="space-y-2.5">
              {filteredMacroUpdates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={update.authorAvatar}
                      alt={update.authorName}
                      className="w-9 h-9 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {update.authorName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
                          {update.skillTag}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {update.timestamp}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                        {update.milestoneTitle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => congratulateMacroMilestone(update.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                      update.userCongratulated
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                        : "border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${update.userCongratulated ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                    <span>{update.congratsCount}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedDeliverable && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDeliverable.memberAvatar}
                  alt={selectedDeliverable.memberName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {selectedDeliverable.title}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    By {selectedDeliverable.memberName} • {selectedDeliverable.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Technical Blueprint Notes
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                {selectedDeliverable.notes}
              </p>
            </div>

            {selectedDeliverable.link && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-zinc-500 truncate">{selectedDeliverable.link}</span>
                <a
                  href={selectedDeliverable.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
                >
                  <span>Open RFC</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Submit Deliverable to Team Blueprint
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Register your technical contribution with your 4 squad peers.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cache Invalidation RFC & Partition Benchmark"
                  value={deliverableTitle}
                  onChange={(e) => setDeliverableTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Technical Summary / Notes
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize key architectural decisions, benchmark findings, or tradeoffs..."
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Repository or Document URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo-rfc"
                  value={deliverableLink}
                  onChange={(e) => setDeliverableLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Submit Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSquadSwitcherOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Squad Hub
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Current squad: <strong>{squad.name}</strong> ({squad.inviteCode})
                </p>
              </div>
              <button
                onClick={() => setIsSquadSwitcherOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/60">
              <button
                onClick={() => setSwitcherTab("switch")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  switcherTab === "switch"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Switch or Join Squad
              </button>
              <button
                onClick={() => setSwitcherTab("create")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  switcherTab === "create"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Create New Squad
              </button>
            </div>

            {switcherTab === "switch" && (
              <div className="space-y-4">
                <form onSubmit={handleJoinSquadSubmit} className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Join with Invite Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. HUDDLE-NEXT"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      Join
                    </button>
                  </div>
                  {joinCodeFeedback && (
                    <p className="text-xs text-rose-500">{joinCodeFeedback}</p>
                  )}
                </form>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Available Track Squads
                  </div>
                  <div className="space-y-2">
                    {presetAvailableSquads.map((preset) => {
                      const isCurrent = preset.id === squad.id;
                      return (
                        <div
                          key={preset.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                              <span>{preset.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-500 truncate">
                              {preset.skillFocus} • Code: {preset.inviteCode}
                            </div>
                          </div>

                          {!isCurrent && (
                            <button
                              onClick={() => handleSelectPresetSquad(preset.inviteCode)}
                              className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:border-zinc-300 transition-colors cursor-pointer shrink-0 ml-2"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {switcherTab === "create" && (
              <form onSubmit={handleCreateSquadSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Squad Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Core Architects"
                    value={newSquadName}
                    onChange={(e) => setNewSquadName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Skill Focus Track
                  </label>
                  <select
                    value={newSquadFocusSelect}
                    onChange={(e) => setNewSquadFocusSelect(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {standardFocusTracks.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                    <option value="Custom">Custom Track...</option>
                  </select>
                </div>

                {newSquadFocusSelect === "Custom" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Custom Skill Focus Track
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rust Systems Programming, Go Distributed Services"
                      value={newSquadCustomFocus}
                      onChange={(e) => setNewSquadCustomFocus(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Shared Weekly Goal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ship 12 deliberate practice sessions this week with zero pressure"
                    value={newSquadGoal}
                    onChange={(e) => setNewSquadGoal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSquadSwitcherOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Create Squad
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {isShareProofOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Share Milestone to Global Circle
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Publish your verified engineering proof to the 38-member global circle.
                </p>
              </div>
              <button
                onClick={() => setIsShareProofOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShareProofSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Milestone Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Implemented and benchmarked XFetch probabilistic early cache recomputation under 10k RPS load."
                  value={proofTitleInput}
                  onChange={(e) => setProofTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Track Category
                </label>
                <select
                  value={proofTrackInput}
                  onChange={(e) => setProofTrackInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="System Architecture">System Architecture</option>
                  <option value="Next.js Full-Stack">Next.js Full-Stack</option>
                  <option value="TypeScript Core">TypeScript Core</option>
                  <option value="Distributed Systems">Distributed Systems</option>
                  <option value="Custom">Custom Track...</option>
                </select>
              </div>

              {proofTrackInput === "Custom" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Custom Track Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rust Systems Architecture"
                    value={proofCustomTrack}
                    onChange={(e) => setProofCustomTrack(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareProofOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Publish Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSquadSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Squad Settings & Configuration
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update your squad parameters, target goals, and invite codes.
                </p>
              </div>
              <button
                onClick={() => setIsSquadSettingsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Skill Focus Track
                </label>
                <select
                  value={settingsFocusSelect}
                  onChange={(e) => setSettingsFocusSelect(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {standardFocusTracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                  <option value="Custom">Custom Track...</option>
                </select>
              </div>

              {settingsFocusSelect === "Custom" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Custom Skill Focus Track
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rust Systems Programming, Go Distributed Services"
                    value={settingsCustomFocus}
                    onChange={(e) => setSettingsCustomFocus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Weekly Target Sessions
                </label>
                <input
                  type="number"
                  min={4}
                  max={50}
                  value={settingsTarget}
                  onChange={(e) => setSettingsTarget(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Shared Weekly Objective
                </label>
                <textarea
                  rows={2}
                  value={settingsGoal}
                  onChange={(e) => setSettingsGoal(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    Invite Code: <span className="font-mono text-indigo-600 dark:text-indigo-400">{squad.inviteCode}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Regenerate if you need to invalidate older invites.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateInviteCode}
                  disabled={isRegeneratingCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingCode ? "animate-spin" : ""}`} />
                  Regenerate
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSquadSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Remove Member from Squad
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  This action removes the member from this squad workspace.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300">
              Are you sure you want to remove <span className="font-semibold text-zinc-900 dark:text-zinc-100">{memberToRemove.name}</span> (@{memberToRemove.handle})? They will lose access to this squad's shared practice logs, peer reviews, and deliverables.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveMember}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {reportTargetMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Submit Anonymous Report
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Reporting {reportTargetMember.name} (@{reportTargetMember.handle})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReportTargetMember(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-300">
                <span className="font-semibold">100% Anonymous Guarantee.</span> Your identity is never shared with {reportTargetMember.name} or squad leaders. Reports are routed directly to Trust & Safety.
              </div>
            </div>

            <form onSubmit={handleSubmitAnonymousReport} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Reason for Report
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: "harassment" as ReportReasonCategory, label: "Harassment or Hostile Behavior", desc: "Bullying, personal attacks, intimidation, or persistent unwelcome contact." },
                    { key: "inappropriate_content" as ReportReasonCategory, label: "Inappropriate or Offensive Content", desc: "Unprofessional language, derogatory remarks, or offensive media." },
                    { key: "spam_or_promotion" as ReportReasonCategory, label: "Spam or Commercial Promotion", desc: "Unsolicited sales pitches, repeated links, or automated messaging." },
                    { key: "inactivity_ghosting" as ReportReasonCategory, label: "Persistent Inactivity or Ghosting", desc: "Consistently missing agreed sprint deliverables and squad commitments." },
                    { key: "other" as ReportReasonCategory, label: "Other Policy Violation", desc: "Any other issue violating professional collaboration guidelines." }
                  ].map((item) => (
                    <label
                      key={item.key}
                      onClick={() => setReportCategory(item.key)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        reportCategory === item.key
                          ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 dark:border-indigo-500"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={item.key}
                        checked={reportCategory === item.key}
                        onChange={() => setReportCategory(item.key)}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="text-left">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context or specific instances to help review this report..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportTargetMember(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingReport ? "Submitting..." : "Submit Anonymous Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
