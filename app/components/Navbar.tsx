"use client";

import React, { useState } from "react";
import {
  Compass,
  Users,
  BookOpen,
  MessageSquare,
  User as UserIcon,
  Flame,
  Search,
  Bell,
  Moon,
  Sun,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
  RotateCcw,
  CheckCircle2,
  LogIn,
} from "lucide-react";
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
  } = useHuddle();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType }[] =
    [
      { id: "dashboard", label: "Learn", icon: Compass },
      { id: "squad", label: "Squad", icon: Users },
      { id: "creators", label: "Explore", icon: BookOpen },
      { id: "community", label: "Discussions", icon: MessageSquare },
      { id: "profile", label: "Profile", icon: UserIcon },
    ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs < 10 ? "0" : ""}${remainingSecs}s`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#090a0f]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Primary Navigation */}
        <div className="flex items-center gap-7">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
          >
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:opacity-90 transition-opacity"
            />
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Streak Counter Badge (Duolingo-style) */}
          {isAuthenticated && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
              title={`${user.streak} days daily practice streak`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.streak}</span>
            </div>
          )}

          {/* Functional Focus Timer Widget */}
          {isAuthenticated && (
            <div
              onClick={toggleFocusTimer}
              className={`hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
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
                {formatTime(secondsFocusedToday)}
              </span>
            </div>
          )}

          {/* Quick Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Search...</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 text-[9px] bg-zinc-200/60 dark:bg-zinc-800/60 rounded text-zinc-500">
              ⌘K
            </kbd>
          </button>

          {/* Survey Required Pill if Not Completed */}
          {!user.onboardingCompleted && (
            <button
              onClick={() => setOnboardingActive(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              title="Intake survey required to unlock sprint actions"
            >
              <span>Survey Required</span>
            </button>
          )}

          {/* Mascot Pip Assistant Trigger */}
          <button
            onClick={() => setMascotOpen(!mascotOpen)}
            className={`relative px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 group cursor-pointer ${
              mascotOpen
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
            }`}
            title="Ask Pip AI"
          >
            <div className="w-5 h-5 relative shrink-0 transition-transform group-hover:scale-110">
              <img
                src="/mascot_idle.svg"
                alt="Pip"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hidden sm:inline">
              Ask Pip
            </span>
          </button>

          {/* Notification Button */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xl p-3.5 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Notifications
                    </h3>
                    <span className="text-[11px] text-zinc-500">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                          n.read
                            ? "bg-transparent text-zinc-500 dark:text-zinc-400"
                            : "bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 border border-indigo-100/80 dark:border-indigo-900/40"
                        }`}
                      >
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {n.title}
                        </div>
                        <div className="mt-0.5 leading-relaxed text-[11px] text-zinc-600 dark:text-zinc-400">
                          {n.description}
                        </div>
                        <div className="mt-1 text-[10px] text-zinc-400">
                          {n.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-md object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                />
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
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
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Profile & Career
                    </button>
                    <button
                      onClick={() => {
                        setOnboardingActive(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
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
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
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
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left transition-colors"
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
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
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
