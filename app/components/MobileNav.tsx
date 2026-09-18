"use client";

import React from "react";
import {
  Compass,
  Flame,
  Map as MapIcon,
  Users,
  User as UserIcon,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { ActiveTab } from "../types/huddle";

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHuddle();

  const navigationItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "dashboard", label: "Sprint", icon: Flame },
    { id: "growth_map", label: "Growth", icon: MapIcon },
    { id: "squad", label: "Squad", icon: Users },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-md px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
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
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] mt-1 leading-none font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
