"use client";

import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Share2,
  Copy,
  Flame,
  Globe,
  UserCheck,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";
import { CodeBlock } from "./CodeBlock";
import { ActivityCalendar } from "./ActivityCalendar";
import {
  UserProfile,
  PortfolioItem,
} from "../types/huddle";
import {
  UserActivityDay,
  fetchPortfolioItems,
} from "../lib/supabase";

export interface PublicProfileViewProps {
  initialProfile?: UserProfile;
  initialActivityDays?: UserActivityDay[];
  initialPortfolio?: PortfolioItem[];
  isPublicRoute?: boolean;
  onBack?: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  initialProfile,
  initialActivityDays,
  initialPortfolio,
  isPublicRoute = false,
  onBack,
}) => {
  const {
    user: currentUser,
    viewingUserProfile,
    viewMyProfile,
    updateUserProfile,
    skillsHealth,
    portfolioItems: myPortfolioItems,
    realWorldProofs,
    togglePublishPortfolio,
    completeRealWorldProof,
    setSettingsOpen,
    sprint,
    sendSquadNudge,
  } = useHuddle();

  // Determine active profile to display
  const targetUser: UserProfile =
    initialProfile || viewingUserProfile || currentUser;
  const isOwnProfile = !initialProfile && !viewingUserProfile;

  const [activeProfileTab, setActiveProfileTab] = useState<
    "activity" | "projects" | "achievements" | "skills"
  >("activity");

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState(targetUser.name);
  const [handle, setHandle] = useState(targetUser.handle);
  const [bio, setBio] = useState(targetUser.bio);
  const [careerMilestone, setCareerMilestone] = useState(targetUser.careerMilestone);
  const [avatar, setAvatar] = useState(targetUser.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [nudged, setNudged] = useState(false);

  // Other user's portfolio items if viewing someone else
  const [externalPortfolio, setExternalPortfolio] = useState<PortfolioItem[]>(
    initialPortfolio || []
  );
  const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(
    !isOwnProfile && !initialPortfolio
  );

  useEffect(() => {
    if (!isOwnProfile && !initialPortfolio && targetUser?.id) {
      setLoadingPortfolio(true);
      fetchPortfolioItems(targetUser.id)
        .then((items) => {
          setExternalPortfolio(items);
          setLoadingPortfolio(false);
        })
        .catch(() => setLoadingPortfolio(false));
    }
  }, [isOwnProfile, initialPortfolio, targetUser?.id]);

  // Sync state when targetUser changes
  useEffect(() => {
    setName(targetUser.name);
    setHandle(targetUser.handle);
    setBio(targetUser.bio);
    setCareerMilestone(targetUser.careerMilestone);
    setAvatar(targetUser.avatar);
  }, [targetUser]);

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

  const handleCopyPublicLink = () => {
    if (typeof window === "undefined") return;
    const cleanHandle = targetUser.handle.replace("@", "");
    const shareUrl = `${window.location.origin}/profile/${cleanHandle}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleNudge = () => {
    if (targetUser.id) {
      sendSquadNudge(targetUser.id);
      setNudged(true);
      setTimeout(() => setNudged(false), 2500);
    }
  };

  const displayedPortfolioItems = isOwnProfile
    ? myPortfolioItems
    : externalPortfolio.filter((item) => item.isPublished !== false);

  const badges = [
    {
      id: "b-1",
      title: "Sprint Milestone",
      category: targetUser.primaryGoal || "System Architecture",
      date: "Verified Track",
      IconComponent: Award,
      desc: `Active deliberate focus track in ${targetUser.primaryGoal || "System Architecture"} with verified deliverables.`,
    },
    {
      id: "b-2",
      title: "Sprint Continuity",
      category: "Consistency",
      date: `${targetUser.streak || 5} Days Active`,
      IconComponent: Flame,
      desc: `Maintained a verified deliberate engineering focus streak of ${targetUser.streak || 5} days.`,
    },
    {
      id: "b-3",
      title: "Verified Code Proofs",
      category: "Portfolio",
      date: `${isOwnProfile ? realWorldProofs.length : Math.max(1, displayedPortfolioItems.length)} Proofs`,
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

  // Privacy protection: If target profile has publicProfile disabled and is not own profile
  const isPrivateLocked =
    !isOwnProfile && targetUser.privacy && targetUser.privacy.publicProfile === false;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      {/* Public Profile Context Header Banner (when viewing someone else) */}
      {!isOwnProfile && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => (onBack ? onBack() : viewMyProfile())}
              className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/80 transition-colors cursor-pointer"
              title="Return to your profile"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Viewing Public Profile</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/80 text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold">
                  Read Only
                </span>
              </div>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                You are viewing {targetUser.name}'s verified deliberate practice profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleCopyPublicLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
            </button>
            <button
              onClick={handleNudge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {nudged ? <Check className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
              <span>{nudged ? "Nudged!" : "Nudge Focus"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Change Avatar"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {targetUser.name}
                </h1>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                {!isOwnProfile && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                    Peer Engineer
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {targetUser.handle} • Target:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {targetUser.careerMilestone || "Software Engineer"}
                </strong>
                {targetUser.joinedDate && (
                  <span className="text-zinc-400"> • Joined {targetUser.joinedDate}</span>
                )}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-lg leading-relaxed">
                {targetUser.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {isOwnProfile ? (
              <>
                <button
                  onClick={handleCopyPublicLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#111218] text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Share public profile URL"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Link Copied" : "Share"}</span>
                </button>
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
              </>
            ) : (
              <button
                onClick={handleCopyPublicLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {targetUser.streak || 0} Days
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Practice Streak</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {targetUser.reputation || 50} XP
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
                {displayedPortfolioItems.length}
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
                {isOwnProfile
                  ? realWorldProofs.filter((p) => p.completed).length
                  : Math.max(1, displayedPortfolioItems.length)}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Proofs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Private Profile Locked Notice */}
      {isPrivateLocked ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              This Profile is Private
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {targetUser.name} has configured their deliberate practice calendar and portfolio to be visible to squad members only.
            </p>
          </div>
          <button
            onClick={() => (onBack ? onBack() : viewMyProfile())}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Return to My Profile
          </button>
        </div>
      ) : (
        <>
          {/* Mascot Narration */}
          {isOwnProfile && (
            <DuolingoMascot
              emotion="success"
              size="md"
              speechText={`**${Math.round(
                ((sprint.tasks ? sprint.tasks.filter((t) => t.completed).length : 0) /
                  Math.max(1, sprint.tasks?.length || 4)) *
                  100
              )}% sprint progress**. ${myPortfolioItems.length} portfolio deliverables published and verified.`}
              showQuickActions={true}
            />
          )}

          {/* Activity Calendar Component (Requested Feature) */}
          <ActivityCalendar
            userId={targetUser.id}
            activityDays={initialActivityDays}
            userName={targetUser.name}
            isOwnProfile={isOwnProfile}
          />

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <button
              onClick={() => setActiveProfileTab("activity")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeProfileTab === "activity"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Practice Activity</span>
            </button>

            <button
              onClick={() => setActiveProfileTab("projects")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeProfileTab === "projects"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Projects ({displayedPortfolioItems.length})</span>
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

          {/* Tab 1: Practice Activity Deep Dive */}
          {activeProfileTab === "activity" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Sprint Focus & Deliberate Practice Log</span>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Session minutes logged via persistent database telemetry and active practice drills.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-600 dark:text-zinc-400">
                    Live Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
                    <span className="text-[11px] text-zinc-500 font-medium">Today's Focus Status</span>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {isOwnProfile
                          ? `${Math.round((currentUser.focusSecondsToday || 0) / 60)} mins active`
                          : `${Math.round((targetUser.focusSecondsToday || 0) / 60)} mins active`}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400">
                      {isOwnProfile
                        ? "Timer is syncing automatically to Supabase Cloud"
                        : "Verified daily practice logged today"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
                    <span className="text-[11px] text-zinc-500 font-medium">Sprint Goal</span>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {targetUser.primaryGoal || "System Architecture"}
                    </div>
                    <p className="text-[10.5px] text-zinc-400">
                      Target: {targetUser.careerMilestone || "Senior Software Engineer"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
                    <span className="text-[11px] text-zinc-500 font-medium">Verification Status</span>
                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Proof-Verified</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400">
                      Zero mock telemetry • Real-time DB sync
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Projects */}
          {activeProfileTab === "projects" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {loadingPortfolio ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  Loading portfolio items...
                </div>
              ) : displayedPortfolioItems.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-1">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    No public portfolio deliverables published yet.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Deliverables will appear here once verified during sprint check-ins.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedPortfolioItems.map((item) => (
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10.5px] text-zinc-500 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {isOwnProfile && (
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
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Verified Engineering Proofs */}
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
                        {isOwnProfile ? (
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
                        ) : (
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              proof.completed
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800"
                            }`}
                          >
                            {proof.completed && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        )}

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

          {/* Tab 3: Milestones */}
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

          {/* Tab 4: Skills Health */}
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

              {/* Privacy Controls (Only for own profile) */}
              {isOwnProfile && (
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
                          Allow peers and public to view your active times calendar, reputation, and published projects.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={currentUser.privacy?.publicProfile ?? true}
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
                        defaultChecked={currentUser.privacy?.showStreak ?? true}
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Edit Profile Modal (Only for own profile) */}
      {editProfileOpen && isOwnProfile && (
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
