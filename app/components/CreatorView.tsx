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
import { getGravatarUrl } from "../lib/gravatar";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dcdff2] dark:border-[#1d2c4e] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#06427D] dark:text-[#e6e9f7]">
              Explore topics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4]/80 mt-1">
            Short guides, ideas, and architecture references to inspire your
            next step.
          </p>
        </div>

        <button
          onClick={() => setMascotOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-[#A9DAF5]" />
          <span>Ask Spark for ideas</span>
        </button>
      </div>

      <div className="p-6 sm:p-7 rounded-2xl bg-[#BBBCE4]/15 dark:bg-[#0e1526] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/mascot_idle.svg"
              alt="Spark"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div>
              <span className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/70 font-medium block">
                Start a new skill
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
                Ready to explore a different discipline?
              </h2>
            </div>
          </div>
          <button
            onClick={() => setMascotOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-[#A9DAF5]" />
            <span>Plan a new topic</span>
          </button>
        </div>

        <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80 leading-relaxed max-w-2xl">
          Tell Spark what you want to master. We will create a clear,
          step-by-step weekly plan tailored to your available time.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/60 mr-1">Popular:</span>
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
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] border border-[#dcdff2] dark:border-[#1d2c4e] hover:border-[#5420A6] dark:hover:border-[#A9DAF5] transition-colors cursor-pointer"
            >
              {skillName}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#5D6080] dark:text-[#BBBCE4]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, topics, and authors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] placeholder:text-[#5D6080]/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {skillTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? "bg-[#5420A6] text-[#FFFFFF]"
                  : "bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:border-[#5420A6] dark:hover:border-[#A9DAF5]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] space-y-2">
            <p className="text-sm font-medium text-[#06427D] dark:text-[#e6e9f7]">
              No topics found matching your search.
            </p>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/70">
              Try adjusting your query or selecting another category above.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 space-y-4 hover:border-[#5420A6] dark:hover:border-[#A9DAF5] transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.creatorAvatar?.includes("gravatar.com") ? post.creatorAvatar : getGravatarUrl(post.creatorHandle || post.creatorName, 80)}
                    alt={post.creatorName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#dcdff2] dark:ring-[#1d2c4e] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#06427D] dark:text-[#e6e9f7] truncate">
                        {post.creatorName}
                      </span>
                      <span className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/70 truncate">
                        {post.creatorHandle}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60 truncate mt-0.5">
                      {post.creatorTitle} • {post.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] text-[11px] font-medium">
                    {post.skillTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#5D6080] dark:text-[#BBBCE4]/70 px-2 py-0.5 rounded bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                    <Video className="w-3 h-3 text-[#5D6080]" />
                    <span>{post.duration}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold text-[#06427D] dark:text-[#e6e9f7] tracking-tight leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed">
                  {post.description}
                </p>

                <div className="p-3.5 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-start gap-3">
                  <img
                    src="/mascot_idle.svg"
                    alt="Spark"
                    className="w-5 h-5 object-contain shrink-0 mt-0.5"
                  />
                  <div className="text-xs text-[#06427D] dark:text-[#BBBCE4] leading-relaxed">
                    <strong className="font-semibold text-[#06427D] dark:text-[#e6e9f7]">
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
                <div className="p-3.5 rounded-xl bg-[#f6f7fc]/50 dark:bg-[#141d33]/50 border border-[#dcdff2] dark:border-[#1d2c4e] space-y-2">
                  <div className="text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7] flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
                    <span>Attached resources</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {post.resourceLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#5420A6] dark:text-[#A9DAF5] hover:underline font-medium"
                      >
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#dcdff2] dark:border-[#1d2c4e] text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeCreatorPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userLiked
                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 font-medium"
                        : "text-[#5D6080] dark:text-[#BBBCE4]/80 hover:bg-[#f6f7fc] dark:hover:bg-[#141d33]"
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
                        ? "text-[#5420A6] dark:text-[#A9DAF5] bg-[#BBBCE4]/20 dark:bg-[#141d33] font-medium"
                        : "text-[#5D6080] dark:text-[#BBBCE4]/80 hover:bg-[#f6f7fc] dark:hover:bg-[#141d33]"
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${post.bookmarked ? "fill-[#5420A6] dark:fill-[#A9DAF5]" : ""}`}
                    />
                    <span>{post.bookmarked ? "Saved" : "Save"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAddToSprinter(post)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    addedPostId === post.id
                      ? "bg-emerald-600 text-white"
                      : "bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF]"
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
