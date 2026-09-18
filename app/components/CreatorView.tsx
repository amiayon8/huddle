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
  Zap,
  Video,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { CodeBlock } from "./CodeBlock";

export const CreatorView: React.FC = () => {
  const {
    creatorPosts,
    toggleLikeCreatorPost,
    toggleBookmarkCreatorPost,
    addExploreItemToSprinter,
    setMascotOpen,
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
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Explore topics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Short guides, ideas, and architecture references to inspire your
            next step.
          </p>
        </div>

        <button
          onClick={() => setMascotOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Ask Spark for ideas</span>
        </button>
      </div>

      <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/Huddle SVGs/01_happy.svg"
              alt="Spark"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <span className="text-xs text-zinc-500 font-medium block">
                Start a new skill
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-950 dark:text-white mt-0.5">
                Ready to explore a different discipline?
              </h2>
            </div>
          </div>
          <button
            onClick={() => setMascotOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Plan a new topic</span>
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Tell Spark what you want to master. We will create a clear,
          step-by-step weekly plan tailored to your available time.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-zinc-400 mr-1">Popular:</span>
          {[
            "React and Next.js App Router",
            "TypeScript Systems and Generics",
            "Python AI Agent Orchestration",
            "System Design and Scalability",
            "PostgreSQL Performance and Indexing",
            "Rust for Systems Engineering",
          ].map((skillName) => (
            <button
              key={skillName}
              onClick={() => {
                setMascotOpen(true);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
            >
              {skillName}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, topics, and authors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-2">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              No topics found matching your search.
            </p>
            <p className="text-xs text-zinc-500">
              Try adjusting your query or selecting another category above.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-6 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.creatorAvatar}
                    alt={post.creatorName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-950 dark:text-white truncate">
                        {post.creatorName}
                      </span>
                      <span className="text-xs text-zinc-400 truncate">
                        {post.creatorHandle}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {post.creatorTitle} • {post.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                    {post.skillTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                    <Video className="w-3 h-3 text-zinc-400" />
                    <span>{post.duration}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.description}
                </p>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800 flex items-start gap-3">
                  <img
                    src="/Huddle SVGs/01_happy.svg"
                    alt="Spark"
                    className="w-5 h-5 object-contain shrink-0 mt-0.5"
                  />
                  <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Key takeaway:
                    </strong>{" "}
                    Focus on understanding trade-offs before choosing an
                    implementation. Clear code is easier to maintain than clever
                    code.
                  </div>
                </div>

                {post.contentSnippet && (
                  <div className="pt-2">
                    <CodeBlock code={post.contentSnippet} />
                  </div>
                )}
              </div>

              {post.resourceLinks && post.resourceLinks.length > 0 && (
                <div className="p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 space-y-2">
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Attached resources</span>
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

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userLiked
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${post.userLiked ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmarkCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.bookmarked
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${post.bookmarked ? "fill-indigo-500 text-indigo-500" : ""}`}
                    />
                    <span>{post.bookmarked ? "Saved" : "Save"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAddToSprinter(post)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    addedPostId === post.id
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900"
                  }`}
                >
                  {addedPostId === post.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to your plan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to my plan</span>
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
