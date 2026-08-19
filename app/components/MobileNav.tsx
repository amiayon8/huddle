'use client';

import React from 'react';
import { Layers, Compass, Users, MessageSquare, BarChart3, UserCheck } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { ActiveTab } from '../types/huddle';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHuddle();

  const items: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Layers },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'community', label: 'Topics', icon: MessageSquare },
    { id: 'creators', label: 'Creators', icon: UserCheck },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-1.5 py-1.5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 focus:outline-none ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 dark:bg-indigo-950/60' : 'bg-transparent'
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
