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
  Play,
  Sparkles,
  Zap,
  Flame,
  Compass,
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
    addExploreItemToSprinter,
  } = useHuddle();

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addedPostId, setAddedPostId] = useState<string | null>(null);

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

  const handleAddToSprinter = (post: (typeof creatorPosts)[0]) => {
    addExploreItemToSprinter(post.title, post.creatorName, 15);
    setAddedPostId(post.id);
    setTimeout(() => setAddedPostId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
              Explore Feed
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              Curiosity + Entertainment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Short skill-based videos, architecture blueprints, and learning ideas you can casually discover & add to your Sprinter.
          </p>
        </div>

        <button
          onClick={() => setCreatorUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Contribute Blueprint</span>
        </button>
      </div>

      {/* Spark Mascot Guidance */}
      <DuolingoMascot
        emotion="deep_thinking"
        size="md"
        speechText="Browse short 5-15 minute engineering videos and patterns below. Tap **Add to Sprinter** on any topic to weave it directly into your daily practice!"
        showQuickActions={true}
      />

      {/* Search & Topic Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search short videos, distributed patterns, or authors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {skillTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? "bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Mentors */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#11131d]/90 backdrop-blur-xl p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Mentors & Staff Engineers</span>
          </span>
          <span className="text-[11px] text-zinc-400">
            {creators.length} verified creators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
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

      {/* Feed Cards */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-1.5">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No skill bites match your search criteria.
            </p>
            <p className="text-xs text-zinc-500">
              Try adjusting your query or selecting another technical topic tag.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#11131d]/90 backdrop-blur-xl p-5 sm:p-6 space-y-4 hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]"
            >
              {/* Card Author & Meta */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.creatorAvatar}
                    alt={post.creatorName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-zinc-950 dark:text-white truncate">
                        {post.creatorName}
                      </span>
                      <span className="text-xs text-zinc-400 truncate">
                        {post.creatorHandle}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {post.creatorTitle} • {post.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wide">
                    {post.skillTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Play className="w-3 h-3 fill-current text-indigo-500" />
                    <span>{post.duration}</span>
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {post.description}
                </p>

                {/* Spark's Key Takeaway Callout */}
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
                  <img
                    src="/mascot_idle.svg"
                    alt="Spark"
                    className="w-5 h-5 object-contain shrink-0 mt-0.5"
                  />
                  <div className="text-[11.5px] text-amber-950 dark:text-amber-200 leading-snug">
                    <strong className="font-bold">Spark's Takeaway:</strong> Master the trade-offs between memory overhead vs. read latency before implementing this in production.
                  </div>
                </div>

                {post.contentSnippet && (
                  <div className="pt-1">
                    <CodeBlock code={post.contentSnippet} />
                  </div>
                )}
              </div>

              {/* Resource Links */}
              {post.resourceLinks && post.resourceLinks.length > 0 && (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
                  <div className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
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

              {/* Card Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userLiked
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${post.userLiked ? "fill-rose-500" : ""}`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.bookmarked
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${post.bookmarked ? "fill-indigo-500" : ""}`}
                    />
                    <span>{post.bookmarked ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={() => setMascotOpen(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer pl-1"
                  >
                    Discuss with Spark
                  </button>
                </div>

                {/* Primary Action: Add to AI Skill Sprinter */}
                <button
                  onClick={() => handleAddToSprinter(post)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-xs ${
                    addedPostId === post.id
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                  }`}
                >
                  {addedPostId === post.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Added to Sprinter!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Add to AI Skill Sprinter</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

