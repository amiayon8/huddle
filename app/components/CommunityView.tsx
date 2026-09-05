"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Plus,
  Search,
  HelpCircle,
  Code,
  Lightbulb,
  Send,
  X,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { CommunityPost } from "../types/huddle";
import { DuolingoMascot } from "./DuolingoMascot";
import { FormattedContent } from "./CodeBlock";

export const CommunityView: React.FC = () => {
  const { posts, createCommunityPost, toggleUpvotePost, addReplyToPost } =
    useHuddle();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "question" | "discussion" | "code-review" | "tip"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] =
    useState<CommunityPost["category"]>("question");
  const [postSkill, setPostSkill] = useState("sys-arch");
  const [replyText, setReplyText] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedFilter === "all" || post.category === selectedFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    createCommunityPost(postTitle, postContent, postSkill, postCategory);
    setPostTitle("");
    setPostContent("");
    setNewPostModalOpen(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;
    addReplyToPost(postId, replyText);
    setReplyText("");
  };

  const getCategoryBadge = (category: CommunityPost["category"]) => {
    switch (category) {
      case "question":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
            <HelpCircle className="w-3 h-3" /> Question
          </span>
        );
      case "code-review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
            <Code className="w-3 h-3" /> Code Review
          </span>
        );
      case "tip":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
            <Lightbulb className="w-3 h-3" /> Tip
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium">
            <MessageSquare className="w-3 h-3" /> Discussion
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Technical Discussions & Q&A
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Peer engineering reviews, system architecture inquiries, and sprint
            insights.
          </p>
        </div>

        <button
          onClick={() => setNewPostModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Discussion</span>
        </button>
      </div>

      <DuolingoMascot
        emotion="thinking"
        size="md"
        speechText="Ask technical questions, propose architecture trade-offs, or request code reviews."
        showQuickActions={true}
      />

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions, architecture questions, or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
          {(
            ["all", "question", "discussion", "code-review", "tip"] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === cat
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {cat === "all"
                ? "All Discussions"
                : cat === "code-review"
                  ? "Code Review"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-1.5">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No discussions found matching your filter.
            </p>
            <p className="text-xs text-zinc-500">
              Be the first to ask a technical question or share an engineering tip.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <article
                key={post.id}
                className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 space-y-3.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {post.authorHandle}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        In <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.skillTitle}</span> • {post.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isSolved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    )}
                    {getCategoryBadge(post.category)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h2
                    onClick={() =>
                      setExpandedPostId(isExpanded ? null : post.id)
                    }
                    className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {post.title}
                  </h2>
                  <FormattedContent
                    content={post.content}
                    className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleUpvotePost(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        post.userUpvoted
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.upvotes} upvotes</span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedPostId(isExpanded ? null : post.id)
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.repliesCount || post.replies?.length || 0} replies</span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3 animate-in fade-in">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Replies ({post.replies?.length || 0})
                    </h3>

                    <div className="space-y-2">
                      {post.replies?.length === 0 ? (
                        <p className="text-xs text-zinc-500">No replies yet.</p>
                      ) : (
                        post.replies?.map((rep) => (
                          <div
                            key={rep.id}
                            className={`p-3 rounded-lg text-xs space-y-1.5 ${
                              rep.isHelpful
                                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40"
                                : "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={rep.authorAvatar}
                                  alt={rep.authorName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  {rep.authorName}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  {rep.createdAt}
                                </span>
                              </div>
                              {rep.isHelpful && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Solution
                                </span>
                              )}
                            </div>
                            <FormattedContent
                              content={rep.content}
                              className="text-zinc-700 dark:text-zinc-300"
                            />
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a technical response..."
                        className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAddReply(post.id)}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                New Technical Discussion
              </h2>
              <button
                onClick={() => setNewPostModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Topic Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Distributed cache invalidation strategies under split-brain"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) =>
                      setPostCategory(
                        e.target.value as CommunityPost["category"],
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="question">Question</option>
                    <option value="discussion">Discussion</option>
                    <option value="code-review">Code Review</option>
                    <option value="tip">Tip</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Skill Domain
                  </label>
                  <select
                    value={postSkill}
                    onChange={(e) => setPostSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="sys-arch">System Architecture</option>
                    <option value="next-rsc">Next.js App Router</option>
                    <option value="ts-type-mechanics">
                      TypeScript Mechanics
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Discussion Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Provide context, architectural alternatives considered, or code snippets..."
                  className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Publish Discussion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
