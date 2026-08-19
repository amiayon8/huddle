'use client';

import React from 'react';
import { 
  UserCheck, 
  Users, 
  BookOpen, 
  Download, 
  Play, 
  Check, 
  ExternalLink, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { CreatorProfile } from '../types/huddle';

export const CreatorView: React.FC = () => {
  const { creators, toggleFollowCreator, setSelectedCreatorModal } = useHuddle();

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            Creator Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Domain Experts & Curators
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Guides and code blueprints curated directly inside your skill steps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map(creator => (
          <div 
            key={creator.id}
            className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between space-y-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" 
                  />
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      {creator.name}
                    </h3>
                    <div className="text-xs text-zinc-500">{creator.handle}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowCreator(creator.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    creator.isFollowing
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {creator.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {creator.title}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {creator.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {creator.skillsTaught.map(sk => (
                  <span 
                    key={sk} 
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {creator.followersCount.toLocaleString()} followers
                </span>
                <span>{creator.pinnedResources.length} pinned resources</span>
              </div>

              <div className="space-y-2">
                {creator.pinnedResources.slice(0, 2).map(res => (
                  <div 
                    key={res.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                      {res.duration}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedCreatorModal(creator)}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
              >
                View Full Profile & Resources
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
