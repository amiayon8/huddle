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
  Zap,
  Map as MapIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useHuddle } from "../context/HuddleContext";
import { ActiveTab } from "../types/huddle";
import { getUserAvatarUrl } from "../lib/gravatar";

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
    <header className="sticky top-0 z-40 w-full border-b border-[#dcdff2]/80 dark:border-[#1d2c4e]/80 bg-white/95 dark:bg-[#080c18]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] transition-colors focus:outline-none cursor-pointer relative shrink-0"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5420A6]" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0 select-none"
                title="Current streak"
              >
                <img
                  src="/icons/meteor-svgrepo-com.svg"
                  alt="Streak"
                  className="w-4 h-4 object-contain"
                />
                <span>{user.streak || 1}</span>
              </div>

              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#5420A6]/10 border border-[#5420A6]/20 text-[#5420A6] dark:text-[#BBBCE4] font-bold text-xs shrink-0 select-none"
                title="Mastery points"
              >
                <Zap className="w-4 h-4 fill-[#5420A6] text-[#5420A6] dark:fill-[#BBBCE4] dark:text-[#BBBCE4]" />
                <span>{user.reputation || 180} XP</span>
              </div>

              <button
                onClick={() => setActiveTab("squad")}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  activeTab === "squad"
                    ? "bg-[#BBBCE4]/20 dark:bg-[#5420A6]/25 border-[#BBBCE4] dark:border-[#5420A6]/70 text-[#5420A6] dark:text-[#A9DAF5] font-semibold"
                    : "bg-[#f8f9fd] dark:bg-[#0e1526] border-[#dcdff2]/80 dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#9aa0c4] hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
                }`}
                title="Accountability squad"
              >
                <Users className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                <span>Squad</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f8f9fd]/60 dark:bg-[#0e1526]/60 text-[#5D6080] dark:text-[#9aa0c4] text-xs hover:border-[#BBBCE4] dark:hover:border-[#5420A6]/60 transition-colors shrink-0 cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-[#BBBCE4]/30 dark:bg-[#141f36] rounded font-mono text-[#5D6080] dark:text-[#9aa0c4]">
              Ctrl K
            </kbd>
          </button>

          {isAuthenticated && (
            <div className="relative" ref={notificationMenuRef}>
              <button
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="relative p-2 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] transition-colors shrink-0 cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#5420A6]" />
                )}
              </button>

              {notificationDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20"
                    onClick={() => setNotificationDropdownOpen(false)}
                  />
                  <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-88 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-white dark:bg-[#0e1526] shadow-lg p-4 z-50 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2]/60 dark:border-[#1d2c4e]">
                      <h3 className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4]">
                        Notifications
                      </h3>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[11px] text-[#5420A6] dark:text-[#A9DAF5] font-medium">
                          {unreadNotificationCount} unread
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#5D6080] dark:text-[#9aa0c4]">
                          You are all caught up.
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markNotificationRead(notification.id)}
                            className={`p-3 rounded-lg cursor-pointer text-xs transition-colors ${
                              notification.read
                                ? "text-[#5D6080] dark:text-[#9aa0c4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36]"
                                : "bg-[#BBBCE4]/15 dark:bg-[#5420A6]/20 text-[#06427D] dark:text-[#e6e9f7] border border-[#BBBCE4]/50 dark:border-[#5420A6]/40"
                            }`}
                          >
                            <div className="font-medium text-[#06427D] dark:text-[#e6e9f7]">
                              {notification.title}
                            </div>
                            <div className="mt-0.5 leading-relaxed text-[11px] text-[#5D6080] dark:text-[#9aa0c4]">
                              {notification.description}
                            </div>
                            <div className="mt-1 text-[10px] text-[#5D6080]/70 dark:text-[#9aa0c4]/70">
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
            className="p-2 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] transition-colors shrink-0 cursor-pointer"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#A9DAF5]" />
            ) : (
              <Moon className="w-4 h-4 text-[#5420A6]" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="Open user profile menu"
              >
                <img
                  src={getUserAvatarUrl(user, 64)}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#dcdff2] dark:ring-[#1d2c4e]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#5D6080] hidden xs:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 sm:hidden bg-black/20"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-white dark:bg-[#0e1526] shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-3 py-2.5 border-b border-[#dcdff2]/60 dark:border-[#1d2c4e]">
                      <div className="font-semibold text-xs text-[#06427D] dark:text-[#BBBCE4] truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-[#5D6080] dark:text-[#9aa0c4] truncate mt-0.5">
                        {user.handle}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#5D6080] dark:text-[#9aa0c4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] hover:text-[#06427D] dark:hover:text-[#BBBCE4] text-left transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#5D6080]" />
                        <span>Profile and projects</span>
                      </button>

                      <button
                        onClick={() => {
                          setOnboardingActive(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#5D6080] dark:text-[#9aa0c4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] hover:text-[#06427D] dark:hover:text-[#BBBCE4] text-left transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-[#5D6080]" />
                        <span>Update skill preferences</span>
                      </button>

                      <button
                        onClick={() => {
                          setSettingsOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#5D6080] dark:text-[#9aa0c4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] hover:text-[#06427D] dark:hover:text-[#BBBCE4] text-left transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#5D6080]" />
                        <span>Settings</span>
                      </button>

                      <div className="my-1 border-t border-[#dcdff2]/60 dark:border-[#1d2c4e]" />

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
                className="px-3 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] text-xs font-medium text-[#06427D] dark:text-[#BBBCE4] hover:bg-[#f1f3fa] dark:hover:bg-[#141f36] transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="px-3 py-1.5 rounded-lg bg-[#5420A6] hover:bg-[#45188d] text-white dark:text-[#e6e9f7] text-xs font-medium transition-colors cursor-pointer shadow-sm"
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
