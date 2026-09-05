"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  GitPullRequest,
  FileCode,
  Activity,
  Settings,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  X,
  Camera,
  Calendar,
  Lock,
  MessageSquare,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";
import { CodeBlock } from "./CodeBlock";

export const PublicProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    skillsHealth,
    portfolioItems,
    realWorldProofs,
    togglePublishPortfolio,
    completeRealWorldProof,
    setSettingsOpen,
    sprint,
  } = useHuddle();

  const [activeProfileTab, setActiveProfileTab] = useState<
    "projects" | "achievements" | "skills"
  >("projects");

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio);
  const [careerMilestone, setCareerMilestone] = useState(user.careerMilestone);
  const [avatar, setAvatar] = useState(user.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarPresets = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
    "/avatars/avatar-5.svg",
    "/avatars/avatar-6.svg",
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      handle,
      bio,
      careerMilestone,
      avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditProfileOpen(false);
    }, 800);
  };

  const badges = [
    {
      id: "b-1",
      title: "Sprint Milestone",
      category: sprint.skillTitle,
      date: "Current Track",
      IconComponent: Award,
      desc: `Active deliberate focus sprint in ${sprint.skillTitle} with verified deliverables.`,
    },
    {
      id: "b-2",
      title: "Sprint Progress",
      category: "Consistency",
      date: `${Math.round(((sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0) / Math.max(1, sprint.tasks?.length || 4)) * 100)}% Complete`,
      IconComponent: CheckCircle2,
      desc: `Completed ${sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0} of ${sprint.tasks?.length || 4} deliberate practice milestones in ${sprint.skillTitle}.`,
    },
    {
      id: "b-3",
      title: "Verified Code Proofs",
      category: "Portfolio",
      date: `${realWorldProofs.length} Proofs`,
      IconComponent: GitPullRequest,
      desc: "Completed architectural and code proof loops linked directly to GitHub.",
    },
    {
      id: "b-4",
      title: "Technical Collaborator",
      category: "Community",
      date: "Active Partner",
      IconComponent: MessageSquare,
      desc: "Shared peer reviews and answered questions in technical discussions.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
              />
              <button
                onClick={() => setEditProfileOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {user.name}
                </h1>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {user.handle} • Target:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {user.careerMilestone}
                </strong>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-lg leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(((sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0) / Math.max(1, sprint.tasks?.length || 4)) * 100)}%
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Progress</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {user.reputation} XP
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Reputation</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {portfolioItems.length}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Projects</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {realWorldProofs.filter((p) => p.completed).length}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Proofs</div>
            </div>
          </div>
        </div>
      </div>

      <DuolingoMascot
        emotion="success"
        size="md"
        speechText={`**${Math.round(((sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0) / Math.max(1, sprint.tasks?.length || 4)) * 100)}% sprint progress**. ${portfolioItems.length} portfolio deliverables published and verified.`}
        showQuickActions={true}
      />

      <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveProfileTab("projects")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeProfileTab === "projects"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Projects ({portfolioItems.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab("achievements")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeProfileTab === "achievements"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Milestones ({badges.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab("skills")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeProfileTab === "skills"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Skills ({skillsHealth.length})</span>
        </button>
      </div>

      {activeProfileTab === "projects" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {item.date}
                    </span>
                  </div>

                  <h2 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h2>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <CodeBlock code={item.previewSnippet} />
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10.5px] text-zinc-500 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => togglePublishPortfolio(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      item.isPublished
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {item.isPublished ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    <span>{item.isPublished ? "Public" : "Private"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-indigo-500" />
                <span>Verified Engineering Proofs</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Proof loops verified through benchmark tests and architecture reviews.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {realWorldProofs.map((proof) => (
                <div
                  key={proof.id}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                    proof.completed
                      ? "bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40"
                      : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeRealWorldProof(proof.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                        proof.completed
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                      }`}
                    >
                      {proof.completed && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </button>

                    <div>
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                        {proof.title}
                      </div>
                      <div className="text-[11.5px] text-zinc-500">
                        {proof.description}
                      </div>
                      {proof.externalLink && (
                        <a
                          href={proof.externalLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-0.5"
                        >
                          <span>View proof artifact</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-[10.5px] font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shrink-0">
                    {proof.proofBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeProfileTab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
          {badges.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-4 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                <b.IconComponent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {b.title}
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">
                    {b.date}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {b.category}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeProfileTab === "skills" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {skillsHealth.map((sh) => (
              <div
                key={sh.skillId}
                className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      {sh.skillTitle}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {sh.category}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                      sh.status === "optimal"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                        : sh.status === "maintaining"
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {sh.status === "optimal"
                      ? "Mastered"
                      : sh.status === "maintaining"
                        ? "Practicing"
                        : "Review Needed"}{" "}
                    ({sh.healthPercent}%)
                  </span>
                </div>

                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sh.status === "optimal"
                        ? "bg-emerald-500"
                        : sh.status === "maintaining"
                          ? "bg-indigo-600"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${sh.healthPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Last practiced: {sh.lastPracticed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>Profile Visibility Controls</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Public Engineering Profile
                  </div>
                  <div className="text-zinc-500">
                    Allow peers to view your reputation, published portfolio pieces, and badges.
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user.privacy.publicProfile}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Share Progress with Micro-Squad
                  </div>
                  <div className="text-zinc-500">
                    Display deliberate practice progress in squad check-in activity.
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user.privacy.showStreak}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    Edit Profile
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Update your public display identity
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditProfileOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleProfileSave}
              className="p-5 overflow-y-auto space-y-4 text-xs"
            >
              <div className="space-y-2">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {avatarPresets.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Avatar preset"
                      onClick={() => setAvatar(preset)}
                      className={`w-11 h-11 rounded-lg object-cover cursor-pointer transition-all border-2 ${
                        avatar === preset
                          ? "border-indigo-600 ring-2 ring-indigo-600/30"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Milestone
                </label>
                <input
                  type="text"
                  required
                  value={careerMilestone}
                  onChange={(e) => setCareerMilestone(e.target.value)}
                  placeholder="e.g. Senior Systems Architect"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Engineering Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{savedSuccess ? "Saved" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
