"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHuddle } from "../context/HuddleContext";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { MobileNav } from "../components/MobileNav";
import { DashboardView } from "../components/DashboardView";
import { CreatorView } from "../components/CreatorView";
import { LandingQuestionnaire } from "../components/LandingQuestionnaire";
import { GrowthMapView } from "../components/GrowthMapView";
import { SquadView } from "../components/SquadView";
import { ProfileView } from "../components/ProfileView";
import { AuthModal } from "../components/AuthModal";
import { MascotDrawer } from "../components/MascotDrawer";
import { SearchModal } from "../components/SearchModal";
import { SettingsModal } from "../components/SettingsModal";
import { ResetDemoModal } from "../components/ResetDemoModal";
import { FloatingMascotBadge } from "../components/FloatingMascotBadge";
import { DailyNudgeModal } from "../components/DailyNudgeModal";

export default function AppPage() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    user,
    onboardingActive,
    setOnboardingActive,
    hasSkippedToPreview,
    isAuthenticated,
    authLoading,
    closeAuthModal,
  } = useHuddle();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    closeAuthModal();
  }, [closeAuthModal]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam === "explore") {
      setActiveTab("explore");
    } else if (tabParam === "growth_map") {
      setActiveTab("growth_map");
    } else if (tabParam === "squad") {
      setActiveTab("squad");
    } else if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("dashboard");
    }
  }, [setActiveTab]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if ((!user.onboardingCompleted && !hasSkippedToPreview) || onboardingActive) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
        <LandingQuestionnaire />
        <AuthModal />
        <SearchModal />
        <SettingsModal />
        <MascotDrawer />
        <ResetDemoModal />
        <DailyNudgeModal />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
      case "sprint":
      case "overview":
        return <DashboardView />;
      case "explore":
      case "creators":
        return <CreatorView />;
      case "growth_map":
      case "journey":
        return <GrowthMapView />;
      case "squad":
        return <SquadView />;
      case "profile":
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors md:pl-60 lg:pl-64 pb-16 md:pb-0">
      <Navbar />

      {!user.onboardingCompleted && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 sm:px-6">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
              <img
                src="/mascot_planning.svg"
                alt="Spark"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>
                Your skill profile has not been customized yet. Personalize your topics and schedule whenever you are ready.
              </span>
            </div>
            <button
              onClick={() => setOnboardingActive(true)}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              Personalize (1 min)
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        {renderActiveView()}
      </main>

      <Sidebar />
      <MobileNav />
      <FloatingMascotBadge />

      <AuthModal />
      <MascotDrawer />
      <SearchModal />
      <SettingsModal />
      <ResetDemoModal />
      <DailyNudgeModal />
    </div>
  );
}
