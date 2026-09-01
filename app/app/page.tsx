'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHuddle } from '../context/HuddleContext';
import { Navbar } from '../components/Navbar';
import { MobileNav } from '../components/MobileNav';
import { DashboardView } from '../components/DashboardView';
import { JourneyView } from '../components/JourneyView';
import { SquadView } from '../components/SquadView';
import { CommunityView } from '../components/CommunityView';
import { CreatorView } from '../components/CreatorView';
import { ProgressView } from '../components/ProgressView';
import { PublicProfileView } from '../components/PublicProfileView';
import { LandingQuestionnaire } from '../components/LandingQuestionnaire';
import { AuthModal } from '../components/AuthModal';
import { MascotDrawer } from '../components/MascotDrawer';
import { SearchModal } from '../components/SearchModal';
import { SettingsModal } from '../components/SettingsModal';
import { StepDetailModal } from '../components/StepDetailModal';
import { CreatorDetailModal } from '../components/CreatorDetailModal';
import { CreatorUploadModal } from '../components/CreatorUploadModal';
import { BingeQuizModal } from '../components/BingeQuizModal';

export default function AppPage() {
  const router = useRouter();
  const { activeTab, user, onboardingActive, isAuthenticated, authLoading } = useHuddle();

  // Route protection: If not logged in, redirect from /app to /auth/login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // If user has not completed questionnaire or is changing focus
  if (!user.onboardingCompleted || onboardingActive) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
        <LandingQuestionnaire />
        <AuthModal />
        <SearchModal />
        <SettingsModal />
        <MascotDrawer />
        <BingeQuizModal />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'journey':
        return <JourneyView />;
      case 'squad':
      case 'macro_squad':
        return <SquadView />;
      case 'community':
        return <CommunityView />;
      case 'creators':
      case 'explore':
        return <CreatorView />;
      case 'progress':
      case 'profile':
        return <PublicProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12">
        {renderActiveView()}
      </main>

      <MobileNav />

      <AuthModal />
      <MascotDrawer />
      <SearchModal />
      <SettingsModal />
      <StepDetailModal />
      <CreatorDetailModal />
      <CreatorUploadModal />
      <BingeQuizModal />
    </div>
  );
}
