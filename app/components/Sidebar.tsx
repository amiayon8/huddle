"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Users,
  BookOpen,
  MessageSquare,
  User as UserIcon,
  Shield,
  Clock,
  Play,
  Pause,
  Sun,
  Moon,
  Settings,
  RotateCcw,
  LogOut,
  X,
  Flame,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { ActiveTab } from "../types/huddle";

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const {
    sidebarOpen,
    setSidebarOpen,
    user,
    isAuthenticated,
    isDemo,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setSettingsOpen,
    setResetDemoModalOpen,
    setMascotOpen,
    setOnboardingActive,
    secondsFocusedToday,
    isTimerRunning,
    toggleFocusTimer,
    sprint,
    logout,
    viewMyProfile,
  } = useHuddle();

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const navigationItems: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "dashboard",
      label: "Learn & Practice",
      description: "Daily sprint drills & deliverables",
      icon: Compass,
    },
    {
      id: "squad",
      label: "My Micro-Squad",
      description: "Peer check-ins & standups",
      icon: Users,
    },
    {
      id: "explore",
      label: "Explore Curriculum",
      description: "Guides, drills & creator paths",
      icon: BookOpen,
    },
    {
      id: "community",
      label: "Discussions",
      description: "Architecture & code reviews",
      icon: MessageSquare,
    },
    {
      id: "profile",
      label: "Profile & Career",
      description: "Milestones, proofs & reputation",
      icon: UserIcon,
    },
  ];

  const formatFocusTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
  };

  const completedCount = sprint?.tasks
    ? sprint.tasks.filter((t) => t.completed).length
    : 0;
  const totalTasks = Math.max(1, sprint?.tasks?.length || 4);
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const handleNavClick = (tabId: ActiveTab) => {
    if (tabId === "profile") {
      viewMyProfile();
    } else {
      setActiveTab(tabId);
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[340px] bg-white/95 dark:bg-[#0b0c12]/95 backdrop-blur-2xl border-r border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation Sidebar"
      >
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="relative px-4 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo_light.svg"
                alt="Huddle"
                className="w-6 h-6 object-contain dark:hidden"
              />
              <img
                src="/logo.svg"
                alt="Huddle"
                className="w-6 h-6 object-contain hidden dark:block"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  Huddle
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
                  v0.9
                </span>
              </div>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                Deliberate Practice Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
          {isAuthenticated && (
            <div className="p-3 rounded-xl bg-zinc-50/90 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {user.name}
                    </span>
                    {user.role === "admin" && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shrink-0">
                        Admin
                      </span>
                    )}
                    {isDemo && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                        Demo
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {user.handle}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5" />
                  {user.streak || 1} Day Streak
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Rep:{" "}
                  <strong className="text-zinc-800 dark:text-zinc-200">
                    {user.reputation || 120}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={toggleFocusTimer}
                className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    Focus
                  </span>
                  {isTimerRunning ? (
                    <Pause className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Play className="w-3 h-3 text-zinc-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="mt-1 text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {formatFocusTime(secondsFocusedToday)}
                </div>
                <div className="text-[9.5px] text-zinc-400 flex items-center gap-1 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isTimerRunning
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-zinc-400"
                    }`}
                  />
                  {isTimerRunning ? "Running" : "Paused"}
                </div>
              </div>

              <div
                onClick={() => handleNavClick("dashboard")}
                className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer hover:border-indigo-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                    Sprint
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {progressPercent}%
                  </span>
                </div>
                <div className="mt-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {completedCount}/{totalTasks} Drills
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {!user.onboardingCompleted && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Intake Survey Required
                  </div>
                  <p className="text-[10.5px] text-amber-800 dark:text-amber-300 leading-tight mt-0.5">
                    Drill actions are locked until your 5-step intake survey is
                    completed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setOnboardingActive(true);
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Complete Survey (1 min)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-1">
            <div className="px-1 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Navigation
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isOverviewMatch =
                (item.id === "dashboard" || item.id === "overview") &&
                (activeTab === "dashboard" || activeTab === "overview");
              const isExploreMatch =
                (item.id === "creators" || item.id === "explore") &&
                (activeTab === "creators" || activeTab === "explore");
              const isActive =
                activeTab === item.id || isOverviewMatch || isExploreMatch;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/10 dark:bg-zinc-900/10"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold leading-none">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 truncate ${
                        isActive
                          ? "text-zinc-300 dark:text-zinc-600"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900 shrink-0" />
                  )}
                </button>
              );
            })}

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-indigo-200/70 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-left transition-colors group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <Shield className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold leading-none flex items-center gap-1.5">
                    <span>Admin Console</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-200">
                      Master
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-0.5">
                    User & Squad governance
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-200/70 dark:border-indigo-800/60 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center relative shrink-0">
                <img
                  src="/mascot_idle.svg"
                  alt="Pip"
                  className="w-7 h-7 object-contain"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <span>Pip AI Companion</span>
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  Instant drill hints, code reviews & feedback
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSidebarOpen(false);
                setMascotOpen(true);
              }}
              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ask Pip a Question</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-2 shrink-0">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/60 text-xs">
            <span className="font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Theme Appearance</span>
            </span>
            <button
              onClick={toggleTheme}
              className="px-2 py-1 rounded-md bg-white dark:bg-zinc-700 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 shadow-2xs hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors cursor-pointer capitalize"
            >
              {theme}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setSidebarOpen(false);
                setSettingsOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            {isDemo ? (
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setResetDemoModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-amber-200/80 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  setSidebarOpen(false);
                  await logout();
                  router.push("/auth/login");
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-rose-200/80 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
