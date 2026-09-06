"use client";

import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Code2,
  Copy,
  Check,
  X,
  Eye,
  EyeOff,
  Filter,
  Briefcase,
  GraduationCap,
  Heart,
  BookOpen,
} from "lucide-react";
import { UserProfile } from "@/app/types/huddle";

interface SurveysViewProps {
  usersList: UserProfile[];
  privacySafeMode: boolean;
  isRevealed: (id: string) => boolean;
  toggleRevealItem: (id: string) => void;
  maskEmail: (email: string, id?: string) => string;
  maskId: (id: string, customItemId?: string) => string;
  truncateId: (id: string) => string;
}

export const SurveysView: React.FC<SurveysViewProps> = ({
  usersList,
  privacySafeMode,
  isRevealed,
  toggleRevealItem,
  maskEmail,
  maskId,
  truncateId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Derive stats
  const completedUsers = useMemo(
    () => usersList.filter((u) => u.surveyData && u.onboardingCompleted),
    [usersList]
  );
  const pendingUsers = useMemo(
    () => usersList.filter((u) => !u.surveyData || !u.onboardingCompleted),
    [usersList]
  );

  const uniqueProfessions = useMemo(() => {
    const set = new Set<string>();
    usersList.forEach((u) => {
      const prof = u.surveyData?.targetProfession || u.surveyData?.professionOther;
      if (prof) set.add(prof);
    });
    return Array.from(set);
  }, [usersList]);

  const uniqueStages = useMemo(() => {
    const set = new Set<string>();
    usersList.forEach((u) => {
      if (u.surveyData?.learningStage) set.add(u.surveyData.learningStage);
    });
    return Array.from(set);
  }, [usersList]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const survey = u.surveyData;
      const isCompleted = Boolean(survey && u.onboardingCompleted);

      if (statusFilter === "completed" && !isCompleted) return false;
      if (statusFilter === "pending" && isCompleted) return false;

      if (stageFilter !== "all") {
        if (survey?.learningStage !== stageFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = u.name?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        const handleMatch = u.handle?.toLowerCase().includes(q);
        const profMatch =
          survey?.targetProfession?.toLowerCase().includes(q) ||
          survey?.professionOther?.toLowerCase().includes(q);
        const skillsMatch = survey?.startingSkills?.some((s) => s.toLowerCase().includes(q));
        const hobbiesMatch = survey?.hobbies?.some((h) => h.toLowerCase().includes(q));
        const subjectsMatch = survey?.subjects?.some((sub) => sub.toLowerCase().includes(q));
        return (
          nameMatch ||
          emailMatch ||
          handleMatch ||
          profMatch ||
          skillsMatch ||
          hobbiesMatch ||
          subjectsMatch
        );
      }

      return true;
    });
  }, [usersList, statusFilter, stageFilter, searchQuery]);

  const handleCopyJson = (data: any) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Telemetry Bento: Survey Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Total Profiles
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 dark:text-white tabular-nums">
            {usersList.length}
          </div>
          <div className="text-[10px] text-zinc-500">Registered in Supabase</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Completed Surveys
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {completedUsers.length}
          </div>
          <div className="text-[10px] text-zinc-500">
            {Math.round((completedUsers.length / Math.max(1, usersList.length)) * 100)}% Intake Completion
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Pending Surveys
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {pendingUsers.length}
          </div>
          <div className="text-[10px] text-zinc-500">In preview mode</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Target Professions
            </span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-950 dark:text-white tabular-nums">
            {uniqueProfessions.length}
          </div>
          <div className="text-[10px] text-zinc-500">Unique career ambitions</div>
        </div>
      </div>

      {/* Control Bar: Search & Filtering */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user, profession, skills, hobbies, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0b10] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-[#181a26] text-zinc-950 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                All ({usersList.length})
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "completed"
                    ? "bg-white dark:bg-[#181a26] text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Completed ({completedUsers.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "pending"
                    ? "bg-white dark:bg-[#181a26] text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                Pending ({pendingUsers.length})
              </button>
            </div>

            {/* Stage Dropdown */}
            {uniqueStages.length > 0 && (
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0b10] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="all">All Learning Stages</option>
                {uniqueStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Surveys Data Table */}
      <div className="rounded-2xl border border-zinc-200/70 dark:border-white/[0.07] bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100/70 dark:bg-white/[0.03] text-zinc-500 uppercase tracking-wider text-[10px] font-bold border-b border-zinc-200/60 dark:border-zinc-800/60">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Target Profession</th>
                <th className="py-3.5 px-4">Learning Stage</th>
                <th className="py-3.5 px-4">Starting Skills</th>
                <th className="py-3.5 px-4">Interests & Hobbies</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {filteredUsers.map((u) => {
                const s = u.surveyData;
                const hasCompleted = Boolean(s && u.onboardingCompleted);
                const prof = s?.targetProfession || s?.professionOther || "Not Specified";

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User Profile Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || "/avatars/avatar-1.svg"}
                          alt={u.name}
                          className="w-8 h-8 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-950 dark:text-zinc-100 truncate flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === "admin" && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono truncate">
                            {maskEmail(u.email, u.id)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Target Profession */}
                    <td className="py-3.5 px-4">
                      {hasCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/50 font-bold text-[11px]">
                          <Briefcase className="w-3 h-3 text-indigo-500" />
                          <span>{prof}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">Survey pending</span>
                      )}
                    </td>

                    {/* Stage & Age */}
                    <td className="py-3.5 px-4">
                      {s?.learningStage ? (
                        <div className="space-y-0.5">
                          <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                            {s.learningStage}
                          </div>
                          {s.age && (
                            <div className="text-[10px] text-zinc-400">
                              Age: {s.age} yrs
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Starting Skills */}
                    <td className="py-3.5 px-4">
                      {s?.startingSkills && s.startingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.startingSkills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {s.startingSkills.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px]">
                              +{s.startingSkills.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Hobbies & Subjects */}
                    <td className="py-3.5 px-4">
                      {s?.hobbies && s.hobbies.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.hobbies.slice(0, 2).map((hobby, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-medium border border-purple-100 dark:border-purple-900/30"
                            >
                              {hobby}
                            </span>
                          ))}
                          {s.hobbies.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px]">
                              +{s.hobbies.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {hasCompleted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Preview Only</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Inspect Answers
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No survey responses match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED USER SURVEY MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || "/avatars/avatar-1.svg"}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    <span className="text-xs font-normal text-zinc-400">
                      ({selectedUser.handle})
                    </span>
                  </h3>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    User ID: {selectedUser.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Survey Answers Breakdown */}
            {selectedUser.surveyData ? (
              <div className="space-y-4 text-xs">
                {/* Profession & Stage Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                    <Briefcase className="w-4 h-4" />
                    <span>Target Profession & Career Aspiration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Target Profession
                      </div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {selectedUser.surveyData.targetProfession || selectedUser.surveyData.professionOther || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        Learning Stage
                      </div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        {selectedUser.surveyData.learningStage || "Not specified"}
                      </div>
                    </div>
                    {selectedUser.surveyData.age && (
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Age
                        </div>
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                          {selectedUser.surveyData.age} years old
                        </div>
                      </div>
                    )}
                    {selectedUser.surveyData.completedAt && (
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Submitted Timestamp
                        </div>
                        <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-0.5 font-mono">
                          {new Date(selectedUser.surveyData.completedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Starting Skills */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Selected Starting Skills & Foundations</span>
                  </div>
                  {selectedUser.surveyData.startingSkills && selectedUser.surveyData.startingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.startingSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 italic">No specific starting skills selected.</p>
                  )}
                </div>

                {/* Academic / Technical Subjects */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
                    <GraduationCap className="w-4 h-4 text-sky-500" />
                    <span>Academic & Technical Subjects</span>
                  </div>
                  {selectedUser.surveyData.subjects && selectedUser.surveyData.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40 text-xs font-semibold"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 italic">No subjects selected.</p>
                  )}
                </div>

                {/* Hobbies & Creative Interests */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Hobbies & Creative Passions</span>
                  </div>
                  {selectedUser.surveyData.hobbies && selectedUser.surveyData.hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.hobbies.map((hb, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 text-xs font-semibold"
                        >
                          {hb}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 italic">No hobbies selected.</p>
                  )}
                </div>

                {/* Raw JSON Payload */}
                <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Raw Database Payload (`profiles.survey_data`)</span>
                    </span>
                    <button
                      onClick={() => handleCopyJson(selectedUser.surveyData)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/40 font-mono text-[10.5px] text-indigo-300 overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(selectedUser.surveyData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                  Survey Not Completed Yet
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  This user has logged in but has not completed the 5-step intake survey.
                  Their account is currently operating in preview mode.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
