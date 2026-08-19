'use client';

import React from 'react';
import { useHuddle } from './context/HuddleContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './components/DashboardView';
import { JourneyView } from './components/JourneyView';
import { SquadView } from './components/SquadView';
import { CommunityView } from './components/CommunityView';
import { CreatorView } from './components/CreatorView';
import { ProgressView } from './components/ProgressView';
import { PublicProfileView } from './components/PublicProfileView';
import { AuthModal } from './components/AuthModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MascotDrawer } from './components/MascotDrawer';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { StepDetailModal } from './components/StepDetailModal';
import { CreatorDetailModal } from './components/CreatorDetailModal';

export default function Home() {
  const { activeTab } = useHuddle();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'journey':
        return <JourneyView />;
      case 'squad':
        return <SquadView />;
      case 'community':
        return <CommunityView />;
      case 'creators':
        return <CreatorView />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <PublicProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12">
        {renderActiveView()}
      </main>

      <MobileNav />

      <AuthModal />
      <OnboardingFlow />
      <MascotDrawer />
      <SearchModal />
      <SettingsModal />
      <StepDetailModal />
      <CreatorDetailModal />
    </div>
  );
}
