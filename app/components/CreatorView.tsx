"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Bookmark,
  Heart,
  ExternalLink,
  Plus,
  FileCode,
  Search,
  Check
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { DuolingoMascot } from "./DuolingoMascot";
import { CodeBlock } from "./CodeBlock";

export const CreatorView: React.FC = () => {
  const {
    creators,
    creatorPosts,
    toggleLikeCreatorPost,
    toggleBookmarkCreatorPost,
    toggleFollowCreator,
    setCreatorUploadModalOpen,
    setMascotOpen,
  } = useHuddle();

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const skillTags = [
    "All",
    ...Array.from(new Set(creatorPosts.map((p) => p.skillTag).filter(Boolean))),
  ];

  const filteredPosts = creatorPosts.filter((p) => {
    const matchesTag = selectedTag === "All" || p.skillTag === selectedTag;
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Engineering guides
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Short technical walkthroughs with working code.
          </p>
        </div>

        <button
          onClick={() => setCreatorUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New guide</span>
        </button>
      </div>

      {/* Pip Mascot Guidance */}
      <DuolingoMascot
        emotion="deep_thinking"
        size="md"
        speechText="Guides take 15 minutes and include reproducible code."
        showQuickActions={true}
      />

      {/* Contributors Row */}
      <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Contributors
            </h2>
            <p className="text-xs text-zinc-500">
              Authors and engineering mentors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {creators.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {c.title}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    {c.followersCount.toLocaleString()} followers
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleFollowCreator(c.id)}
                className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  c.isFollowing
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                }`}
              >
                {c.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Topic Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, topics, or authors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {skillTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No guides found matching your search.
            </p>
            <p className="text-xs text-zinc-500">
              Try searching for different keywords or select a different topic tag.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              {/* Creator Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.creatorAvatar}
                    alt={post.creatorName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {post.creatorName}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {post.creatorHandle}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {post.creatorTitle} • {post.createdAt}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                  {post.duration}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.description}
                </p>

                {post.contentSnippet && (
                  <CodeBlock code={post.contentSnippet} />
                )}
              </div>

              {/* Attached Blueprint Resources */}
              {post.resourceLinks && post.resourceLinks.length > 0 && (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Resources</span>
                  </div>
                  {post.resourceLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userLiked
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${post.userLiked ? "fill-rose-500" : ""}`}
                    />
                    <span>{post.likesCount} helpful</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.bookmarked
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${post.bookmarked ? "fill-indigo-500" : ""}`}
                    />
                    <span>{post.bookmarked ? "Saved" : "Save"}</span>
                  </button>
                </div>

                <button
                  onClick={() => setMascotOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                >
                  Ask Pip
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
