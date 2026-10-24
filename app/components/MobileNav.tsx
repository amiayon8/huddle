"use client";

import React from "react";
import {
  Compass,
  Flame,
  Map as MapIcon,
  Users,
  Globe,
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
    { id: "community", label: "Forum", icon: Globe },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF]/95 dark:bg-[#0e1526]/95 backdrop-blur-md px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors">
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
            (item.id === "community" &&
              (activeTab === "community" || activeTab === "macro_squad")) ||
            (item.id === "profile" && activeTab === "profile");

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "text-[#5420A6] dark:text-[#A9DAF5] font-bold"
                  : "text-[#5D6080] dark:text-[#BBBCE4] hover:text-[#06427D] dark:hover:text-[#e6e9f7]"
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
