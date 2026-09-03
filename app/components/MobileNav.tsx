'use client';

import React from 'react';
import { Layers, Compass, Users, BookOpen, User as UserIcon, MessageSquare, Briefcase } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { ActiveTab } from '../types/huddle';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHuddle();

  const items: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Learn', icon: Compass },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'creators', label: 'Explore', icon: BookOpen },
    { id: 'community', label: 'Discussions', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: UserIcon }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-md px-1 py-1.5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all duration-150 focus:outline-none ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className={`p-1 rounded-md transition-colors ${
                isActive ? 'bg-indigo-50 dark:bg-indigo-950/50' : 'bg-transparent'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] font-medium tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
