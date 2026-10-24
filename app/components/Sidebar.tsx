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
  Globe,
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
      label: "Micro Squad",
      icon: Users,
    },
    {
      id: "community",
      label: "Communities",
      icon: Globe,
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
          (item.id === "community" &&
            (activeTab === "community" || activeTab === "macro_squad")) ||
          (item.id === "explore" &&
            (activeTab === "explore" || activeTab === "creators")) ||
          (item.id === "profile" && activeTab === "profile");

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
              isMatch
                ? "bg-[#5420A6]/10 dark:bg-[#5420A6]/20 text-[#5420A6] dark:text-[#c4b5fd] font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 transition-colors ${isMatch ? "text-[#5420A6] dark:text-[#c4b5fd]" : "text-slate-400 dark:text-slate-500"}`} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {isAdmin && (
        <div className="pt-2 mt-2 border-t border-[#dcdff2]/60 dark:border-[#1d2c4e]/60">
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
      <aside className="hidden md:flex flex-col w-56 lg:w-60 fixed inset-y-0 left-0 z-30 bg-white/80 dark:bg-[#090d16]/90 backdrop-blur-md border-r border-slate-200/70 dark:border-slate-800/80 select-none">
        <div className="h-14 px-5 flex items-center">
          <div
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-6 h-6 rounded-md object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Huddle
            </span>
          </div>
        </div>

        <div className="flex-1 py-2 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-3 border-t border-slate-200/70 dark:border-slate-800/80 space-y-1">
          <button
            onClick={() => setMascotOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#5420A6] dark:hover:text-[#c4b5fd] hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#c4b5fd]" />
            <span>AI Companion</span>
          </button>

          <div className="flex items-center justify-between px-1.5 pt-1.5 text-slate-500 dark:text-slate-400 text-xs">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                className="p-1.5 rounded-md hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
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
        className={`fixed inset-y-0 left-0 z-50 w-60 max-w-[85vw] bg-white dark:bg-[#090d16] border-r border-slate-200/80 dark:border-slate-800/80 shadow-2xl flex flex-col transition-transform duration-200 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        <div className="h-14 px-5 border-b border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-6 h-6 rounded-md object-contain shrink-0"
            />
            <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Huddle
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 py-3 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-3 border-t border-slate-200/70 dark:border-slate-800/80">
          <button
            onClick={() => {
              setMascotOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#5420A6] dark:hover:text-[#c4b5fd] hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#c4b5fd]" />
            <span>AI Companion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
