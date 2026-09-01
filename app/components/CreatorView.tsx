'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  BookOpen,
  Bookmark,
  Heart,
  ExternalLink,
  Plus,
  FileCode
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const CreatorView: React.FC = () => {
  const {
    creators,
    creatorPosts,
    toggleLikeCreatorPost,
    toggleBookmarkCreatorPost,
    toggleFollowCreator,
    setCreatorUploadModalOpen,
    setMascotOpen
  } = useHuddle();

  const [selectedTag, setSelectedTag] = useState<string>('All');

  const skillTags = [
    'All',
    'System Architecture',
    'Next.js App Router',
    'Product UI & Micro-interactions',
    'TypeScript Type Mechanics'
  ];

  const filteredPosts = selectedTag === 'All'
    ? creatorPosts
    : creatorPosts.filter(p => p.skillTag === selectedTag);

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-12 animate-in fade-in duration-200">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Explore Creator Guides
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Bite-sized engineering tutorials & blueprints. Tag-organized without algorithmic doomscrolling.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCreatorUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Tutorial</span>
          </button>
        </div>
      </div>

      {/* Featured Creators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Featured Domain Experts
          </h2>
          <span className="text-[11px] text-zinc-400">
            Vetted for actionable practice
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {creators.map(c => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {c.title}
                  </div>
                  {c.sponsorPartner && (
                    <span className="inline-block px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[9.5px] font-semibold mt-1">
                      {c.sponsorPartner}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                <span className="text-zinc-400">
                  {c.followersCount.toLocaleString()} learners
                </span>
                <button
                  onClick={() => toggleFollowCreator(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${c.isFollowing
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                >
                  {c.isFollowing ? 'Following' : '+ Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar">
        {skillTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${selectedTag === tag
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Creator Posts Feed */}
      <div className="space-y-3.5">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            {/* Author */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.creatorAvatar}
                  alt={post.creatorName}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      {post.creatorName}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {post.creatorHandle}
                    </span>
                    {post.sponsorBadge && (
                      <span className="px-2 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                        {post.sponsorBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {post.creatorTitle} • {post.createdAt}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium">
                {post.duration}
              </span>
            </div>

            {/* Content Title & Snippet */}
            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.description}
              </p>

              {post.contentSnippet && (
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/60 dark:border-zinc-800  text-[11.5px] text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
                  {post.contentSnippet}
                </div>
              )}
            </div>

            {/* Blueprints */}
            {post.resourceLinks && post.resourceLinks.length > 0 && (
              <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/40 space-y-1">
                <div className="text-[10.5px] font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <FileCode className="w-3 h-3" />
                  Attached Production Blueprints:
                </div>
                {post.resourceLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    <span>• {link.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLikeCreatorPost(post.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${post.userLiked
                      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-rose-500' : ''}`} />
                  <span>{post.likesCount} Helpful</span>
                </button>

                <button
                  onClick={() => toggleBookmarkCreatorPost(post.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${post.bookmarked
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${post.bookmarked ? 'fill-indigo-500' : ''}`} />
                  <span>{post.bookmarked ? 'Bookmarked' : 'Bookmark to Sprint'}</span>
                </button>
              </div>

              <button
                onClick={() => setMascotOpen(true)}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Build into AI Sprint</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
