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
import { ResetDemoModal } from '../components/ResetDemoModal';
import { FloatingMascotBadge } from '../components/FloatingMascotBadge';
import { SurveyPromptModal } from '../components/SurveyPromptModal';
import { PracticeSessionModal } from '../components/PracticeSessionModal';

export default function AppPage() {
  const router = useRouter();
  const { activeTab, user, onboardingActive, setOnboardingActive, hasSkippedToPreview, isAuthenticated, authLoading } = useHuddle();

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

  // If user has not completed questionnaire and has not skipped to preview, or questionnaire triggered
  if ((!user.onboardingCompleted && !hasSkippedToPreview) || onboardingActive) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
        <LandingQuestionnaire />
        <AuthModal />
        <SearchModal />
        <SettingsModal />
        <MascotDrawer />
        <BingeQuizModal />
        <ResetDemoModal />
        <SurveyPromptModal />
        <PracticeSessionModal />
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

      {/* Preview Mode Alert Banner if Survey Incomplete */}
      {!user.onboardingCompleted && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 sm:px-6">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <img src="/mascot_planning.svg" alt="Pip" className="w-5 h-5 object-contain shrink-0" />
              <span>
                <strong>Intake Survey Incomplete (Preview Mode):</strong> Actions are locked until you complete the 5-step intake survey.
              </span>
            </div>
            <button
              onClick={() => setOnboardingActive(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Complete Survey Now (1 min) →
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12">
        {renderActiveView()}
      </main>

      <MobileNav />
      <FloatingMascotBadge />

      <AuthModal />
      <MascotDrawer />
      <SearchModal />
      <SettingsModal />
      <StepDetailModal />
      <CreatorDetailModal />
      <CreatorUploadModal />
      <BingeQuizModal />
      <ResetDemoModal />
      <SurveyPromptModal />
      <PracticeSessionModal />
    </div>
  );
}
