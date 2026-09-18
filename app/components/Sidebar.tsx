"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Map as MapIcon,
  Users,
  Compass,
  User as UserIcon,
  Sun,
  Moon,
  Settings,
  LogOut,
  X,
  Shield,
  Zap,
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
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setSettingsOpen,
    setMascotOpen,
    logout,
  } = useHuddle();

  const mobileSidebarRef = useRef<HTMLElement>(null);

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
    icon: React.ElementType;
  }[] = [
    {
      id: "dashboard",
      label: "Sprint",
      icon: Flame,
    },
    {
      id: "growth_map",
      label: "Growth map",
      icon: MapIcon,
    },
    {
      id: "squad",
      label: "Squad",
      icon: Users,
    },
    {
      id: "explore",
      label: "Explore",
      icon: Compass,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const renderNavItems = () => (
    <div className="space-y-1 px-3">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isMatch =
          (item.id === "dashboard" &&
            (activeTab === "dashboard" ||
              activeTab === "sprint" ||
              activeTab === "overview")) ||
          (item.id === "growth_map" &&
            (activeTab === "growth_map" || activeTab === "journey")) ||
          (item.id === "squad" && activeTab === "squad") ||
          (item.id === "explore" &&
            (activeTab === "explore" || activeTab === "creators")) ||
          (item.id === "profile" && activeTab === "profile");

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              isMatch
                ? "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {isAdmin && (
        <div className="pt-2 mt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={() => {
              setSidebarOpen(false);
              router.push("/admin");
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs"
          >
            <Shield className="w-4 h-4 shrink-0 text-white" />
            <span>Admin</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 lg:w-64 fixed inset-y-0 left-0 z-30 bg-zinc-50/70 dark:bg-[#0c0d12] border-r border-zinc-200/80 dark:border-zinc-800/80 select-none">
        <div className="h-16 px-6 flex items-center">
          <div
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="w-2.5 h-2.5 rounded-xs bg-white" />
            </div>
            <span className="font-semibold text-base text-zinc-900 dark:text-white tracking-tight">
              Huddle
            </span>
          </div>
        </div>

        <div className="flex-1 py-3 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
          <button
            onClick={() => setMascotOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Spark - Your AI Companion</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-2 text-zinc-500 text-xs">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  router.push("/auth/login");
                }}
                className="p-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        ref={mobileSidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-white dark:bg-[#0c0d12] border-r border-zinc-200/80 dark:border-zinc-800/80 shadow-xl flex flex-col transition-transform duration-200 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        <div className="h-14 px-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-xs bg-white" />
            </div>
            <span className="font-semibold text-base text-zinc-900 dark:text-white tracking-tight">
              Huddle
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => {
              setMascotOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Spark - Your AI Companion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
