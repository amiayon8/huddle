"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
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
  Menu,
  Flame,
  Map as MapIcon,
  Users,
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
    notifications,
    markNotificationRead,
    setSidebarOpen,
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
  const completedCount = sprint?.tasks
    ? sprint.tasks.filter((t) => t.completed).length
    : 0;
  const progressPercent = Math.round(
    (completedCount / Math.max(1, totalTasks)) * 100,
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#090a0f]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer relative shrink-0"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer shrink-0"
            aria-label="Huddle home"
          >
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-7 h-7 rounded-lg object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-semibold text-base text-zinc-900 dark:text-white tracking-tight">
              Huddle
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setActiveTab("squad")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "squad"
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200/70 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
                title="Access your accountability squad"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Squad</span>
              </button>

              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium shrink-0"
                title={`${completedCount} of ${totalTasks} daily milestones completed`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                <span>
                  {completedCount} of {totalTasks} completed
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shrink-0 cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-200/60 dark:bg-zinc-800 rounded font-mono text-zinc-500">
              Ctrl K
            </kbd>
          </button>

          {isAuthenticated && (
            <div className="relative" ref={notificationMenuRef}>
              <button
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="relative p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0 cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </button>

              {notificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20"
                    onClick={() => setNotificationDropdownOpen(false)}
                  />
                  <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-88 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-lg p-4 z-50 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Notifications
                      </h3>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {unreadNotificationCount} unread
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-zinc-500">
                          You are all caught up.
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationRead(notification.id)}
                            className={`p-3 rounded-lg cursor-pointer text-xs transition-colors ${
                              notification.read
                                ? "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                : "bg-indigo-50/50 dark:bg-indigo-950/20 text-zinc-900 dark:text-zinc-100 border border-indigo-100/70 dark:border-indigo-900/30"
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
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shrink-0 cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="Open user profile menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                />
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden xs:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {user.handle}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-left transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-zinc-500" />
                        <span>Profile and projects</span>
                      </button>

                      <button
                        onClick={() => {
                          setOnboardingActive(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-left transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-zinc-500" />
                        <span>Update skill preferences</span>
                      </button>

                      <button
                        onClick={() => {
                          setSettingsOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-left transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-zinc-500" />
                        <span>Settings</span>
                      </button>

                      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                      <button
                        onClick={async () => {
                          await logout();
                          setProfileDropdownOpen(false);
                          router.push("/auth/login");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => router.push("/auth/login")}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
