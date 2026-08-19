'use client';

import React from 'react';
import { X, Users, BookOpen, Download, UserCheck, Check, ExternalLink, Play } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const CreatorDetailModal: React.FC = () => {
  const { selectedCreatorModal, setSelectedCreatorModal, toggleFollowCreator } = useHuddle();

  if (!selectedCreatorModal) return null;

  const creator = selectedCreatorModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{creator.name}</h3>
              <div className="text-xs text-zinc-500">{creator.handle} • {creator.title}</div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCreatorModal(null)}
            className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {creator.bio}
          </p>

          <div className="space-y-3">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Pinned Resources ({creator.pinnedResources.length})
            </div>

            <div className="space-y-2">
              {creator.pinnedResources.map(res => (
                <div key={res.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{res.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{res.type} • {res.duration}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-[11px]">
                    Access
                  </button>
                </div>
              ))}
            </div>
          </div>

          {creator.playlists.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Playlists & Curations
              </div>
              <div className="grid grid-cols-2 gap-3">
                {creator.playlists.map(pl => (
                  <div key={pl.id} className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{pl.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-1">{pl.itemsCount} items</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <span className="text-xs text-zinc-500">{creator.followersCount.toLocaleString()} Followers</span>
          <button
            onClick={() => toggleFollowCreator(creator.id)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold ${
              creator.isFollowing ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' : 'bg-indigo-600 text-white'
            }`}
          >
            {creator.isFollowing ? 'Following' : 'Follow Creator'}
          </button>
        </div>

      </div>
    </div>
  );
};
