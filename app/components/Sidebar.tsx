"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Map as MapIcon,
  Compass,
  User as UserIcon,
  Sun,
  Moon,
  Settings,
  RotateCcw,
  LogOut,
  X,
  Sparkles,
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
    setOnboardingActive,
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

  // Exact 4 navigation items in the exact order shown in the design
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

  const renderNavItems = () => (
    <div className="space-y-1 px-3">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isMatch =
          (item.id === "dashboard" && (activeTab === "dashboard" || activeTab === "sprint" || activeTab === "overview")) ||
          (item.id === "growth_map" && (activeTab === "growth_map" || activeTab === "journey")) ||
          (item.id === "explore" && (activeTab === "explore" || activeTab === "creators")) ||
          (item.id === "profile" && activeTab === "profile");

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              isMatch
                ? "bg-[#22242a] text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-[#181a20]"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* 1. PERSISTENT DESKTOP SIDEBAR (Matches Screenshot Layout) */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 fixed inset-y-0 left-0 z-30 bg-[#0f1012] border-r border-zinc-800/80 select-none">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center">
          <div
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#2563eb] shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="w-2.5 h-2.5 rounded-xs bg-white/90" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Huddle
            </span>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 py-2 overflow-y-auto">
          {renderNavItems()}
        </div>

        {/* Footer Actions (Subtle & Clean) */}
        <div className="p-3 border-t border-zinc-800/80 space-y-1">
          <button
            onClick={() => setMascotOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-400 hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spark AI</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-1 text-zinc-500 text-xs">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:text-zinc-300 hover:bg-[#181a20] transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg hover:text-zinc-300 hover:bg-[#181a20] transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  router.push("/auth/login");
                }}
                className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE RESPONSIVE SIDEBAR DRAWER */}
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
        ref={mobileSidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-[#0f1012] border-r border-zinc-800/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Sidebar"
      >
        <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#2563eb] shadow-sm flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-xs bg-white/90" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Huddle
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          {renderNavItems()}
        </div>

        <div className="p-3 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setMascotOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-400 hover:bg-[#181a20] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spark AI Assistant</span>
          </button>
        </div>
      </aside>
    </>
  );
};
