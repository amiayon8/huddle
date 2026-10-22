"use client";

import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Search,
  Plus,
  ThumbsUp,
  Share2,
  Check,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { Community, CommunityPost, CommunityReply } from "../types/huddle";
import { getUserAvatarUrl } from "../lib/gravatar";

export const CommunityView: React.FC = () => {
  const {
    user,
    communities,
    posts,
    joinCommunity,
    leaveCommunity,
    createCommunityPost,
    toggleUpvotePost,
    addReplyToPost,
    setActiveTab,
  } = useHuddle();

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const [newPostCommunityId, setNewPostCommunityId] = useState<string>(
    communities[0]?.id || "comm-arch",
  );
  const [newPostCategory, setNewPostCategory] = useState<
    "discussion" | "question" | "idea" | "showcase"
  >("discussion");
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostTags, setNewPostTags] = useState<string>("");

  const joinedCommunities = communities.filter((c) => c.isJoined);

  const filteredPosts = posts.filter((post) => {
    const matchesCommunity =
      selectedCommunityId === "all" ||
      selectedCommunityId === "joined"
        ? selectedCommunityId === "joined"
          ? joinedCommunities.some((c) => c.id === post.communityId)
          : true
        : post.communityId === selectedCommunityId;

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCommunity && matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const targetCommunity = communities.find(
      (c) => c.id === newPostCommunityId,
    );

    const tagsArray = newPostTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createCommunityPost(
      newPostTitle.trim(),
      newPostContent.trim(),
      targetCommunity?.slug || "general",
      newPostCategory,
      newPostCommunityId,
      targetCommunity?.name,
      tagsArray.length > 0 ? tagsArray : targetCommunity?.tags.slice(0, 3),
    );

    setIsComposerOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
  };

  const handleSendReply = (postId: string) => {
    const text = replyInput[postId] || "";
    if (!text.trim()) return;

    addReplyToPost(postId, text.trim());
    setReplyInput((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCopyLink = (postId: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/app?tab=community&post=${postId}`,
      );
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const getCategoryBadge = (category: CommunityPost["category"]) => {
    switch (category) {
      case "question":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <HelpCircle className="w-3 h-3" />
            <span>Question</span>
          </span>
        );
      case "idea":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Lightbulb className="w-3 h-3" />
            <span>Proposal</span>
          </span>
        );
      case "showcase":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Showcase</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-3 h-3" />
            <span>Discussion</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Globe className="w-4 h-4" />
            <span>Open Forum & Topic Communities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white mt-0.5">
            Communities
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            Join topic-focused engineering communities, ask architectural
            questions, debate trade-offs, and share real-world implementation
            ideas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("squad")}
            className="duo-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>View Micro Squad</span>
          </button>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="duo-button-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Explore Communities ({communities.length})
          </h2>
          <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
            You are a member of {joinedCommunities.length} communities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {communities.map((community) => {
            const isSelected = selectedCommunityId === community.id;

            return (
              <div
                key={community.id}
                onClick={() =>
                  setSelectedCommunityId(
                    isSelected ? "all" : community.id,
                  )
                }
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs"
                    : "border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {community.category}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (community.isJoined) {
                          leaveCommunity(community.id);
                        } else {
                          joinCommunity(community.id);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        community.isJoined
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      }`}
                    >
                      {community.isJoined ? "Joined" : "Join"}
                    </button>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-white leading-snug mt-2">
                    {community.name}
                  </h3>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {community.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-zinc-400" />
                    <span>{community.memberCount} members</span>
                  </span>
                  <span className="font-mono text-[10px]">
                    {community.tags[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCommunityId("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedCommunityId === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              All Topics
            </button>

            <button
              onClick={() => setSelectedCommunityId("joined")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedCommunityId === "joined"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              My Communities ({joinedCommunities.length})
            </button>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

            {["all", "discussion", "question", "idea", "showcase"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {cat === "all" ? "All types" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions & questions..."
              className="w-full pl-8 pr-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] space-y-3">
            <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              No discussions found
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Be the first to post a question or architectural idea to this
              community.
            </p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="duo-button-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start Discussion</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const replies = post.replies || [];

              return (
                <div
                  key={post.id}
                  className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#111218] p-5 sm:p-6 shadow-xs transition-colors space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-950 dark:text-white">
                            {post.authorName}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {post.authorHandle}
                          </span>
                          {post.authorRole && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold">
                              {post.authorRole}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          <span>{post.communityName || post.skillTitle}</span>
                          <span>•</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {getCategoryBadge(post.category)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvotePost(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                          post.userUpvoted
                            ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                            : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${
                            post.userUpvoted ? "fill-indigo-600 dark:fill-indigo-400" : ""
                          }`}
                        />
                        <span>{post.upvotes}</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedPostId(isExpanded ? null : post.id)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{replies.length} replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyLink(post.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                      title="Copy link to thread"
                    >
                      {copiedPostId === post.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                      {replies.length > 0 && (
                        <div className="space-y-3">
                          {replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={reply.authorAvatar}
                                    alt={reply.authorName}
                                    className="w-5 h-5 rounded-md object-cover"
                                  />
                                  <span className="font-bold text-zinc-950 dark:text-white">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-[11px] text-zinc-400">
                                    {reply.authorHandle}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400">
                                  {reply.createdAt}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed pl-7">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyInput[post.id] || ""}
                          onChange={(e) =>
                            setReplyInput((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendReply(post.id);
                          }}
                          placeholder="Write a technical answer or constructive comment..."
                          className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                        />
                        <button
                          onClick={() => handleSendReply(post.id)}
                          className="duo-button-primary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111218] border-2 border-indigo-500 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  Start a Community Discussion
                </h3>
                <p className="text-xs text-zinc-500">
                  Share an idea, ask a question, or discuss architectural
                  trade-offs
                </p>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Target Community
                  </label>
                  <select
                    value={newPostCommunityId}
                    onChange={(e) => setNewPostCommunityId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <select
                    value={newPostCategory}
                    onChange={(e) =>
                      setNewPostCategory(
                        e.target.value as "discussion" | "question" | "idea" | "showcase",
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="question">Question</option>
                    <option value="idea">Proposal / Idea</option>
                    <option value="showcase">Showcase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Discussion Title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Dual-write outbox pattern vs listen/notify for CDC?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Content & Context
                </label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Provide detailed architectural background, trade-offs considered, and specific questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="e.g. PostgreSQL, CDC, Microservices"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="duo-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="duo-button-primary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
