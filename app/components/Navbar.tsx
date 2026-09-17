"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  BookOpen,
  User as UserIcon,
  CheckCircle2,
  Search,
  Bell,
  Moon,
  Sun,
  Settings,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Menu,
  TrendingUp,
  Flame,
  Map as MapIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useHuddle } from "../context/HuddleContext";
import { ActiveTab } from "../types/huddle";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    logout,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setSearchOpen,
    setSettingsOpen,
    mascotOpen,
    setMascotOpen,
    notifications,
    markNotificationRead,
    setSidebarOpen,
    setOnboardingActive,
    sprint,
  } = useHuddle();

  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
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
      { id: "dashboard", label: "Sprint", icon: Flame },
      { id: "growth_map", label: "Growth map", icon: MapIcon },
      { id: "explore", label: "Explore", icon: Compass },
      { id: "profile", label: "Profile", icon: UserIcon },
    ];

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

  const totalTasks = sprint?.tasks?.length || 6;
  const completedCount = sprint?.tasks ? sprint.tasks.filter((t) => t.completed).length : 0;
  const progressPercent = Math.round((completedCount / Math.max(1, totalTasks)) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#090a0f]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 lg:gap-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer relative shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer shrink-0"
            aria-label="Huddle Home"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2563eb] shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="w-2.5 h-2.5 rounded-xs bg-white/90" />
            </div>
            <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white tracking-tight">
              Huddle
            </span>
          </button>

          {/* Core Navigation: Sprint & Explore only */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isMatch =
                (item.id === "dashboard" && (activeTab === "dashboard" || activeTab === "sprint" || activeTab === "overview")) ||
                (item.id === "explore" && (activeTab === "explore" || activeTab === "creators")) ||
                (item.id === "growth_map" && (activeTab === "growth_map" || activeTab === "journey")) ||
                (item.id === "profile" && activeTab === "profile");
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isMatch
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Overall Sprint Progress Pill */}
          {isAuthenticated && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold shrink-0"
              title={`Overall Skill Progress: ${completedCount}/${totalTasks} days`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{progressPercent}% Cleared</span>
            </div>
          )}

          {/* Quick Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shrink-0 cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Search...</span>
            <kbd className="hidden xl:inline-block px-1 text-[9px] bg-zinc-200/60 dark:bg-zinc-800/60 rounded text-zinc-500">
              ⌘K
            </kbd>
          </button>

          {/* Feature 7: Ask Spark AI Chatbot Trigger */}
          <button
            onClick={() => setMascotOpen(!mascotOpen)}
            className={`flex relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0 ${mascotOpen
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20 shadow-xs"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30"
              }`}
            title="Ask Spark AI Chatbot"
            aria-label="Ask Spark AI Chatbot"
          >
            <div className="w-5 h-5 relative shrink-0 transition-transform group-hover:scale-110">
              <img
                src="/mascot_idle.svg"
                alt="Pip"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hidden sm:inline">
              Ask Pip
            </span>
          </button>

          {/* Feature 4: Smart Notifications */}
          {isAuthenticated && (
            <div className="relative" ref={notificationMenuRef}>
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors shrink-0 cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
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
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Learning Notifications</span>
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
                          className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${notification.read
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors shrink-0 cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Profile Menu */}
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
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {user.handle}
                      </div>
                    </div>

                    <div className="py-1">
                      {/* Your Profile */}
                      <button
                        onClick={() => {
                          setActiveTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Profile (Skills & Projects)</span>
                      </button>

                      {/* Retake Personalization */}
                      <button
                        onClick={() => {
                          setOnboardingActive(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake Personalization</span>
                        </span>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400">
                          5 Steps
                        </span>
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => {
                          setSettingsOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>

                      {/* Sign Out */}
                      <button
                        onClick={async () => {
                          await logout();
                          setProfileDropdownOpen(false);
                          router.push("/auth/login");
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => router.push("/auth/login")}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
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
