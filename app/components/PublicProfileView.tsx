"use client";

import React, { useState } from "react";
import {
  Award,
  Flame,
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
  Zap,
  CheckCircle2
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
    setOnboardingActive,
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
      desc: `Active focus sprint in ${sprint.skillTitle} with completed deliberate practice tasks.`
    },
    {
      id: "b-2",
      title: "Streak Champion",
      category: "Consistency",
      date: "Active Streak",
      IconComponent: Flame,
      desc: `Maintained a ${user.streak}-day continuous streak with daily deliberate practice.`
    },
    {
      id: "b-3",
      title: "Verified Code Proofs",
      category: "Portfolio",
      date: `${realWorldProofs.length} Proofs`,
      IconComponent: GitPullRequest,
      desc: `Completed architectural and code proof loops linked directly to GitHub.`
    },
    {
      id: "b-4",
      title: "Peer Collaborator",
      category: "Community",
      date: "Active Partner",
      IconComponent: MessageSquare,
      desc: "Shared knowledge and answered questions in community discussions."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Profile Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
              />
              <button
                onClick={() => setEditProfileOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </h1>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {user.handle} • Goal:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {user.careerMilestone}
                </strong>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-lg leading-relaxed">
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
              <span>Edit profile</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {user.streak} days
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Streak</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {user.reputation} XP
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Reputation</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Briefcase className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {portfolioItems.length}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Projects</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <GitPullRequest className="w-4 h-4 text-emerald-500" />
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

      {/* Pip Mascot Review */}
      <DuolingoMascot
        emotion="success"
        size="md"
        speechText={`**${user.streak} day streak**. ${portfolioItems.length} projects published.`}
        showQuickActions={true}
      />

      {/* Clean 3 Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveProfileTab("projects")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeProfileTab === "projects"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Projects ({portfolioItems.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab("achievements")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeProfileTab === "achievements"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Milestones ({badges.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab("skills")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeProfileTab === "skills"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Skills ({skillsHealth.length})</span>
        </button>
      </div>

      {/* Tab 1: Projects & Proofs */}
      {activeProfileTab === "projects" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Portfolio Artifacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <CodeBlock code={item.previewSnippet} />
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10.5px] text-zinc-500 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => togglePublishPortfolio(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
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
              </div>
            ))}
          </div>

          {/* Practical Engineering Proofs */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-indigo-500" />
                <span>Engineering proofs</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Verified with pull requests, benchmarks, and architecture records.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {realWorldProofs.map((proof) => (
                <div
                  key={proof.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    proof.completed
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                      : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeRealWorldProof(proof.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                        proof.completed
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-emerald-500"
                      }`}
                    >
                      {proof.completed && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
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
                          <span>View proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10.5px] font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shrink-0">
                    {proof.proofBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Badges & Milestones */}
      {activeProfileTab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
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

      {/* Tab 3: Skills & Growth */}
      {activeProfileTab === "skills" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsHealth.map((sh) => (
              <div
                key={sh.skillId}
                className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {sh.skillTitle}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {sh.category}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      sh.status === "optimal"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                        : sh.status === "maintaining"
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                          : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {sh.status === "optimal" ? "Mastered" : sh.status === "maintaining" ? "Practicing" : "Needs Review"} ({sh.healthPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
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

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Last practiced: {sh.lastPracticed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy & Visibility Settings Card */}
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>Profile Privacy & Sharing</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    Public Profile Visibility
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

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">
                    Show Streak to Squad Friends
                  </div>
                  <div className="text-zinc-500">
                    Share daily streak count with your 4 squad friends.
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

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Edit Profile
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Update your public display details
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
                  Choose Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {avatarPresets.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Avatar option"
                      onClick={() => setAvatar(preset)}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                        avatar === preset
                          ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-105"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Career Goal
                </label>
                <input
                  type="text"
                  required
                  value={careerMilestone}
                  onChange={(e) => setCareerMilestone(e.target.value)}
                  placeholder="e.g. Senior Systems Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Bio / Engineering Focus
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : null}
                  <span>
                    {savedSuccess ? "Saved!" : "Save Profile"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
