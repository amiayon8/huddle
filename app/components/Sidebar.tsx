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
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer ${
              isMatch
                ? "bg-[#BBBCE4]/20 dark:bg-[#5420A6]/25 text-[#5420A6] dark:text-[#BBBCE4] font-bold border-2 border-[#BBBCE4] dark:border-[#5420A6]/70 shadow-xs"
                : "text-[#5D6080] dark:text-[#9aa0c4] hover:text-[#06427D] dark:hover:text-[#BBBCE4] hover:bg-[#BBBCE4]/10 dark:hover:bg-[#141f36] border-2 border-transparent font-medium"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
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
      <aside className="hidden md:flex flex-col w-60 lg:w-64 fixed inset-y-0 left-0 z-30 bg-[#f8f9fd]/90 dark:bg-[#0b101e] border-r border-[#dcdff2]/80 dark:border-[#1d2c4e]/80 select-none">
        <div className="h-16 px-6 flex items-center">
          <div
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-7 h-7 rounded-lg object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="font-semibold text-base text-[#06427D] dark:text-[#BBBCE4] tracking-tight">
              Huddle
            </span>
          </div>
        </div>

        <div className="flex-1 py-3 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-3 border-t border-[#dcdff2]/80 dark:border-[#1d2c4e]/80 space-y-1">
          <button
            onClick={() => setMascotOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#5420A6] dark:text-[#A9DAF5] hover:bg-[#5420A6]/10 dark:hover:bg-[#5420A6]/20 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Spark - Your AI Companion</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-2 text-[#5D6080] dark:text-[#9aa0c4] text-xs">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg hover:text-[#06427D] dark:hover:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 dark:hover:bg-[#141f36] transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#A9DAF5]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5420A6]" />
              )}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg hover:text-[#06427D] dark:hover:text-[#BBBCE4] hover:bg-[#BBBCE4]/20 dark:hover:bg-[#141f36] transition-colors cursor-pointer"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] bg-white dark:bg-[#0e1526] border-r border-[#dcdff2]/80 dark:border-[#1d2c4e]/80 shadow-xl flex flex-col transition-transform duration-200 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation drawer"
      >
        <div className="h-14 px-5 border-b border-[#dcdff2]/60 dark:border-[#1d2c4e] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-7 h-7 rounded-lg object-contain shrink-0"
            />
            <span className="font-semibold text-base text-[#06427D] dark:text-[#BBBCE4] tracking-tight">
              Huddle
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:text-[#9aa0c4] dark:hover:text-[#BBBCE4] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto">{renderNavItems()}</div>

        <div className="p-4 border-t border-[#dcdff2]/60 dark:border-[#1d2c4e]">
          <button
            onClick={() => {
              setMascotOpen(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#5420A6] dark:text-[#A9DAF5] hover:bg-[#5420A6]/10 dark:hover:bg-[#5420A6]/20 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Spark - Your AI Companion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
