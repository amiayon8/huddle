"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  User,
  Code2,
  Copy,
  Check,
  X,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
} from "lucide-react";
import { UserProfile } from "@/app/types/huddle";
import { getUserAvatarUrl } from "@/app/lib/gravatar";

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const completedUsers = useMemo(
    () => usersList.filter((u) => u.surveyData && u.onboardingCompleted),
    [usersList],
  );
  const pendingUsers = useMemo(
    () => usersList.filter((u) => !u.surveyData || !u.onboardingCompleted),
    [usersList],
  );

  const uniqueProfessions = useMemo(() => {
    const set = new Set<string>();
    usersList.forEach((u) => {
      const prof =
        u.surveyData?.targetProfession || u.surveyData?.professionOther;
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
        const skillsMatch = survey?.startingSkills?.some((s) =>
          s.toLowerCase().includes(q),
        );
        const hobbiesMatch = survey?.hobbies?.some((h) =>
          h.toLowerCase().includes(q),
        );
        const subjectsMatch = survey?.subjects?.some((sub) =>
          sub.toLowerCase().includes(q),
        );
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4] uppercase tracking-wider">
              Total Profiles
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] flex items-center justify-center text-[#5420A6] dark:text-[#A9DAF5]">
              <User className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#06427D] dark:text-[#e6e9f7] tabular-nums">
            {usersList.length}
          </div>
          <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]">
            Registered in Supabase
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4] uppercase tracking-wider">
              Completed Surveys
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {completedUsers.length}
          </div>
          <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]">
            {Math.round(
              (completedUsers.length / Math.max(1, usersList.length)) * 100,
            )}
            % Intake Completion
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4] uppercase tracking-wider">
              Pending Surveys
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {pendingUsers.length}
          </div>
          <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]">In preview mode</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] shadow-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5D6080] dark:text-[#BBBCE4] uppercase tracking-wider">
              Target Professions
            </span>
            <div className="w-6 h-6 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] flex items-center justify-center text-[#5420A6] dark:text-[#A9DAF5]">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#06427D] dark:text-[#e6e9f7] tabular-nums">
            {uniqueProfessions.length}
          </div>
          <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]">
            Unique career ambitions
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5D6080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user, profession, skills, hobbies, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder-[#5D6080]/60 focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-[#f6f7fc] dark:bg-[#141d33] p-1 rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-[#06427D] dark:text-[#e6e9f7] shadow-xs"
                    : "text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4] dark:hover:text-[#e6e9f7]"
                }`}
              >
                All ({usersList.length})
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "completed"
                    ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4] dark:hover:text-[#e6e9f7]"
                }`}
              >
                Completed ({completedUsers.length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === "pending"
                    ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4] dark:hover:text-[#e6e9f7]"
                }`}
              >
                Pending ({pendingUsers.length})
              </button>
            </div>

            {uniqueStages.length > 0 && (
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 cursor-pointer"
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

      <div className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4] uppercase tracking-wider text-[10px] font-bold border-b border-[#dcdff2] dark:border-[#1d2c4e]">
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
            <tbody className="divide-y divide-[#dcdff2] dark:divide-[#1d2c4e]">
              {filteredUsers.map((u) => {
                const s = u.surveyData;
                const hasCompleted = Boolean(s && u.onboardingCompleted);
                const prof =
                  s?.targetProfession || s?.professionOther || "Not Specified";

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-[#f6f7fc]/80 dark:hover:bg-[#141d33]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getUserAvatarUrl(u, 64)}
                          alt={u.name}
                          className="w-8 h-8 rounded-xl object-cover bg-[#f6f7fc] dark:bg-[#141d33] shrink-0 border border-[#dcdff2] dark:border-[#1d2c4e]"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-[#06427D] dark:text-[#e6e9f7] truncate flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === "admin" && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5]">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-mono truncate">
                            {maskEmail(u.email, u.id)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {hasCompleted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] font-bold text-[11px]">
                          <Briefcase className="w-3 h-3 text-[#5420A6] dark:text-[#A9DAF5]" />
                          <span>{prof}</span>
                        </span>
                      ) : (
                        <span className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic text-[11px]">
                          Survey pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {s?.learningStage ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#06427D] dark:text-[#e6e9f7] text-xs">
                            {s.learningStage}
                          </div>
                          {s.age && (
                            <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]">
                              Age: {s.age} yrs
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic text-[11px]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {s?.startingSkills && s.startingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.startingSkills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-[#06427D] dark:text-[#e6e9f7] text-[10px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {s.startingSkills.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4] text-[10px]">
                              +{s.startingSkills.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic text-[11px]">
                          -
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {s?.hobbies && s.hobbies.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.hobbies.slice(0, 2).map((hobby, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] text-[10px] font-semibold border border-[#BBBCE4]/40 dark:border-[#1d2c4e]"
                            >
                              {hobby}
                            </span>
                          ))}
                          {s.hobbies.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4] text-[10px]">
                              +{s.hobbies.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic text-[11px]">
                          -
                        </span>
                      )}
                    </td>

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

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:border-[#5420A6] hover:bg-[#5420A6]/10 text-[#5420A6] dark:text-[#A9DAF5] font-bold text-xs transition-colors cursor-pointer"
                      >
                        Inspect Answers
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5D6080] dark:text-[#BBBCE4]">
                    No survey responses match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl shadow-2xl p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatarUrl(selectedUser, 80)}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#5420A6]/30"
                />
                <div>
                  <h3 className="text-base font-bold text-[#06427D] dark:text-[#BBBCE4] flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    <span className="text-xs font-normal text-[#5D6080] dark:text-[#BBBCE4]/70">
                      ({selectedUser.handle})
                    </span>
                  </h3>
                  <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60 font-mono">
                    User ID: {selectedUser.id}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4]/70 dark:hover:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 dark:hover:bg-[#141d33] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedUser.surveyData ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#5420A6]/10 via-[#BBBCE4]/15 to-transparent border border-[#5420A6]/20 dark:border-[#5420A6]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#5420A6] dark:text-[#BBBCE4] font-bold">
                    <Briefcase className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                    <span>Target Profession & Career Aspiration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60 uppercase font-semibold">
                        Target Profession
                      </div>
                      <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
                        {selectedUser.surveyData.targetProfession ||
                          selectedUser.surveyData.professionOther ||
                          "Not specified"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60 uppercase font-semibold">
                        Learning Stage
                      </div>
                      <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
                        {selectedUser.surveyData.learningStage ||
                          "Not specified"}
                      </div>
                    </div>
                    {selectedUser.surveyData.age && (
                      <div>
                        <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60 uppercase font-semibold">
                          Age
                        </div>
                        <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
                          {selectedUser.surveyData.age} years old
                        </div>
                      </div>
                    )}
                    {selectedUser.surveyData.completedAt && (
                      <div>
                        <div className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60 uppercase font-semibold">
                          Submitted Timestamp
                        </div>
                        <div className="text-xs font-medium text-[#5D6080] dark:text-[#BBBCE4]/80 mt-0.5 font-mono">
                          {new Date(
                            selectedUser.surveyData.completedAt,
                          ).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33]/50 border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2">
                  <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4] font-bold">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Selected Starting Skills & Foundations</span>
                  </div>
                  {selectedUser.surveyData.startingSkills &&
                  selectedUser.surveyData.startingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.startingSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#5420A6]/10 dark:bg-[#5420A6]/20 text-[#5420A6] dark:text-[#BBBCE4] border border-[#5420A6]/20 dark:border-[#5420A6]/30 text-xs font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic">
                      No specific starting skills selected.
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33]/50 border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2">
                  <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4] font-bold">
                    <GraduationCap className="w-4 h-4 text-[#06427D] dark:text-[#A9DAF5]" />
                    <span>Academic & Technical Subjects</span>
                  </div>
                  {selectedUser.surveyData.subjects &&
                  selectedUser.surveyData.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.subjects.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#A9DAF5]/20 dark:bg-[#A9DAF5]/10 text-[#06427D] dark:text-[#A9DAF5] border border-[#A9DAF5]/40 dark:border-[#A9DAF5]/20 text-xs font-semibold"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic">
                      No subjects selected.
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33]/50 border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2">
                  <div className="flex items-center gap-2 text-[#06427D] dark:text-[#BBBCE4] font-bold">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Hobbies & Creative Passions</span>
                  </div>
                  {selectedUser.surveyData.hobbies &&
                  selectedUser.surveyData.hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedUser.surveyData.hobbies.map((hb, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#BBBCE4]/25 dark:bg-[#BBBCE4]/10 text-[#5420A6] dark:text-[#BBBCE4] border border-[#BBBCE4]/40 dark:border-[#BBBCE4]/20 text-xs font-semibold"
                        >
                          {hb}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#5D6080] dark:text-[#BBBCE4]/60 italic">No hobbies selected.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#080c18] text-[#e6e9f7] border border-[#1d2c4e] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#BBBCE4]/70 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#A9DAF5]" />
                      <span>Raw Database Payload (`profiles.survey_data`)</span>
                    </span>
                    <button
                      onClick={() => handleCopyJson(selectedUser.surveyData)}
                      className="px-2 py-1 rounded bg-[#141d33] hover:bg-[#1d2c4e] text-[10px] font-mono text-[#BBBCE4] flex items-center gap-1 transition-colors cursor-pointer"
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
                  <pre className="p-3 rounded-lg bg-black/50 font-mono text-[10.5px] text-[#A9DAF5] overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(selectedUser.surveyData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Clock className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Survey Not Completed Yet
                </h4>
                <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/70 max-w-sm mx-auto">
                  This user has logged in but has not completed the 5-step
                  intake survey. Their account is currently operating in preview
                  mode.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
