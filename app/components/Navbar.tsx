"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  Users,
  BookOpen,
  MessageSquare,
  User as UserIcon,
  CheckCircle2,
  Search,
  Bell,
  Moon,
  Sun,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
  RotateCcw,
  AlertCircle,
  Play,
  Pause,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useHuddle } from "../context/HuddleContext";
import { ActiveTab } from "../types/huddle";

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isDemo,
    logout,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setSearchOpen,
    setSettingsOpen,
    setResetDemoModalOpen,
    mascotOpen,
    setMascotOpen,
    notifications,
    markNotificationRead,
    secondsFocusedToday,
    isTimerRunning,
    isAppFocused,
    toggleFocusTimer,
    openAuthModal,
    setOnboardingActive,
    sprint,
  } = useHuddle();

  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const navigationItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "dashboard", label: "Learn", icon: Compass },
    { id: "squad", label: "Squad", icon: Users },
    { id: "explore", label: "Explore", icon: BookOpen },
    { id: "community", label: "Discussions", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  const formatFocusTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node;
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(targetNode)
      ) {
        setNotificationDropdownOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(targetNode)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#090a0f]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 md:gap-5 lg:gap-7 shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer shrink-0"
            aria-label="Huddle Home"
          >
            <img
              src="/logo_light.svg"
              alt="Huddle"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shadow-xs group-hover:opacity-90 transition-opacity dark:hidden"
            />
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shadow-xs group-hover:opacity-90 transition-opacity hidden dark:block"
            />
            <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
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
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          {isAuthenticated && (
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] sm:text-xs font-semibold shrink-0"
              title={`Sprint Progress: ${sprint?.tasks ? sprint.tasks.filter((t) => t.completed).length : 0}/${sprint?.tasks?.length || 4} milestones`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {Math.round(
                  ((sprint?.tasks ? sprint.tasks.filter((t) => t.completed).length : 0) /
                    Math.max(1, sprint?.tasks?.length || 4)) *
                    100,
                )}
                %
              </span>
            </div>
          )}

          {isAuthenticated && (
            <div
              onClick={toggleFocusTimer}
              className={`hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all shrink-0 ${
                isAppFocused && isTimerRunning
                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-500"
              }`}
              title={
                isTimerRunning
                  ? "Active Focus Timer (Click to pause)"
                  : "Timer Paused (Click to resume)"
              }
            >
              <Clock className="w-3 h-3 opacity-70" />
              <span className="text-[11px] tracking-tight">
                {formatFocusTime(secondsFocusedToday)}
              </span>
            </div>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shrink-0 cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Search...</span>
            <kbd className="hidden xl:inline-block px-1 py-0.2 text-[9px] bg-zinc-200/60 dark:bg-zinc-800/60 rounded text-zinc-500">
              ⌘K
            </kbd>
          </button>

          {user.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shrink-0 cursor-pointer"
              title="Open Admin Console"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Admin</span>
            </Link>
          )}

          {!user.onboardingCompleted && (
            <button
              onClick={() => setOnboardingActive(true)}
              className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              title="Intake survey required to unlock sprint actions"
            >
              <AlertCircle className="w-3 h-3 sm:hidden shrink-0" />
              <span className="hidden sm:inline">Survey Required</span>
              <span className="sm:hidden">Survey</span>
            </button>
          )}

          <button
            onClick={() => setMascotOpen(!mascotOpen)}
            className={`relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0 ${
              mascotOpen
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
            }`}
            title="Ask Pip AI"
            aria-label="Ask Pip AI"
          >
            <div className="w-5 h-5 relative shrink-0 transition-transform group-hover:scale-110">
              <img
                src="/mascot_idle.svg"
                alt="Pip"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hidden md:inline">
              Ask Pip
            </span>
          </button>

          {isAuthenticated && (
            <div className="relative" ref={notificationMenuRef}>
              <button
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="relative p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors shrink-0 cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </button>

              {notificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20 backdrop-blur-2xs"
                    onClick={() => setNotificationDropdownOpen(false)}
                  />
                  <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-88 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xl p-3.5 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Notifications
                      </h3>
                      <span className="text-[11px] text-zinc-500">
                        {unreadNotificationCount} unread
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationRead(notification.id)}
                          className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                            notification.read
                              ? "bg-transparent text-zinc-500 dark:text-zinc-400"
                              : "bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 border border-indigo-100/80 dark:border-indigo-900/40"
                          }`}
                        >
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {notification.title}
                          </div>
                          <div className="mt-0.5 leading-relaxed text-[11px] text-zinc-600 dark:text-zinc-400">
                            {notification.description}
                          </div>
                          <div className="mt-1 text-[10px] text-zinc-400">
                            {notification.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors shrink-0 cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-0.5 sm:p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="User profile menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-md object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                />
                <ChevronDown className="w-3 h-3 text-zinc-400 hidden xs:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20 backdrop-blur-2xs"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {user.name}
                        </div>
                        {isDemo && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {user.handle}
                      </div>
                    </div>

                    <div className="py-1">
                      <div
                        onClick={toggleFocusTimer}
                        className="lg:hidden w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Focus Time</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="font-mono">
                            {formatFocusTime(secondsFocusedToday)}
                          </span>
                          {isTimerRunning ? (
                            <Pause className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Play className="w-3 h-3 text-zinc-400" />
                          )}
                        </span>
                      </div>

                      <div
                        onClick={toggleTheme}
                        className="sm:hidden w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {theme === "dark" ? (
                            <Sun className="w-3.5 h-3.5" />
                          ) : (
                            <Moon className="w-3.5 h-3.5" />
                          )}
                          <span>Theme</span>
                        </span>
                        <span className="text-[10.5px] text-zinc-400 capitalize">
                          {theme}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Profile & Career
                      </button>

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setOnboardingActive(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>
                            {user.onboardingCompleted
                              ? "Retake Intake Survey"
                              : "Complete Intake Survey"}
                          </span>
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${
                            user.onboardingCompleted
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {user.onboardingCompleted ? "Done" : "Required"}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setSettingsOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </button>

                      {isDemo && (
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setResetDemoModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Full Reset</span>
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          await logout();
                          setProfileDropdownOpen(false);
                          openAuthModal("welcome");
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => openAuthModal("login")}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
