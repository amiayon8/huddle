"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Heart,
  ExternalLink,
  Plus,
  FileCode,
  Search,
  Check,
  BookOpen,
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
    ...Array.from(
      new Set(creatorPosts.map((post) => post.skillTag).filter(Boolean)),
    ),
  ];

  const filteredPosts = creatorPosts.filter((post) => {
    const matchesTag = selectedTag === "All" || post.skillTag === selectedTag;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.creatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Engineering Guides & Walkthroughs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Practical system architecture, concurrency, and performance patterns
            with verified code.
          </p>
        </div>

        <button
          onClick={() => setCreatorUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Contribute Guide</span>
        </button>
      </div>

      <DuolingoMascot
        emotion="deep_thinking"
        size="md"
        speechText="Engineering guides take 15 minutes to review and include reproducible code solutions."
        showQuickActions={true}
      />

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, architecture topics, or authors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {skillTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Featured Mentors & Authors
          </span>
          <span className="text-[11px] text-zinc-400">
            {creators.length} verified contributors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {creator.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {creator.title}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleFollowCreator(creator.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 cursor-pointer ${
                  creator.isFollowing
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {creator.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-1.5">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No guides match your search criteria.
            </p>
            <p className="text-xs text-zinc-500">
              Try adjusting your query or selecting another technical topic tag.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 sm:p-6 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.creatorAvatar}
                    alt={post.creatorName}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
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

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
                    {post.skillTag}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {post.duration}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.description}
                </p>

                {post.contentSnippet && (
                  <div className="pt-1">
                    <CodeBlock code={post.contentSnippet} />
                  </div>
                )}
              </div>

              {post.resourceLinks && post.resourceLinks.length > 0 && (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                  <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Attached Blueprints & References</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {post.resourceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userLiked
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${post.userLiked ? "fill-rose-500" : ""}`}
                    />
                    <span>{post.likesCount} helpful</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.bookmarked
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  Discuss with Pip
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
