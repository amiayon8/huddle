'use client';

import React from 'react';
import { 
  User as UserIcon, 
  Award, 
  Flame, 
  ShieldCheck, 
  MessageSquare, 
  UserCheck, 
  CheckCircle2, 
  Share2, 
  Lock
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const PublicProfileView: React.FC = () => {
  const { user, creators, setSettingsOpen } = useHuddle();

  const badges = [
    { id: 'b-1', title: 'Caching Foundations', category: 'Engineering Milestone', date: 'August 2026' },
    { id: 'b-2', title: 'Helpful Community Answer', category: 'Peer Support', date: 'August 2026' },
    { id: 'b-3', title: 'Async Squad Partner', category: 'Micro-Squad Consistency', date: 'July 2026' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover ring-4 ring-zinc-100 dark:ring-zinc-800" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </h1>
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{user.handle} • Member since {user.joinedDate}</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 max-w-md leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Edit Profile & Privacy
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.reputation}</span>
            <span className="text-zinc-500">Reputation Score</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{user.streak} days</span>
            <span className="text-zinc-500">Active Streak</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100">12</span>
            <span className="text-zinc-500">Community Answers</span>
          </div>
        </div>

      </div>

      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Learning Privacy Shield: Active raw skill track titles are hidden from public view.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            Earned Achievement Badges
          </h3>

          <div className="space-y-3">
            {badges.map(b => (
              <div 
                key={b.id}
                className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {b.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {b.category}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-400 font-semibold">
                  {b.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-500" />
            Followed Domain Creators
          </h3>

          <div className="space-y-3">
            {creators.filter(c => c.isFollowing).map(creator => (
              <div 
                key={creator.id}
                className="p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-8 h-8 rounded-xl object-cover" 
                  />
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {creator.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {creator.title}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Following
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
