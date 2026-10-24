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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5420A6]/10 text-[#5420A6] dark:text-[#A9DAF5] border border-[#5420A6]/20">
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
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5420A6] dark:text-[#A9DAF5]">
            <Globe className="w-4 h-4" />
            <span>Open Forum & Topic Communities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#06427D] dark:text-[#e6e9f7] mt-0.5">
            Communities
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6080] dark:text-[#BBBCE4]/80 mt-1 max-w-2xl leading-relaxed">
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
            <Users className="w-3.5 h-3.5 text-[#5420A6] dark:text-[#A9DAF5]" />
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

      <div className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#5D6080] dark:text-[#BBBCE4]/70">
            Explore Communities ({communities.length})
          </h2>
          <span className="text-[11px] font-medium text-[#5420A6] dark:text-[#A9DAF5]">
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
                    ? "border-[#5420A6] bg-[#BBBCE4]/20 dark:bg-[#141d33] shadow-xs"
                    : "border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18]/50 hover:border-[#5420A6] dark:hover:border-[#A9DAF5]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#BBBCE4]/30 dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4]">
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        community.isJoined
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] shadow-xs"
                      }`}
                    >
                      {community.isJoined ? "Joined" : "Join"}
                    </button>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-[#06427D] dark:text-[#e6e9f7] leading-snug mt-2">
                    {community.name}
                  </h3>

                  <p className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/75 mt-1 line-clamp-2 leading-relaxed">
                    {community.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#dcdff2]/60 dark:border-[#1d2c4e] flex items-center justify-between text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#5D6080] dark:text-[#BBBCE4]/60" />
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
                  ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                  : "bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
              }`}
            >
              All Topics
            </button>

            <button
              onClick={() => setSelectedCommunityId("joined")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedCommunityId === "joined"
                  ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                  : "bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
              }`}
            >
              My Communities ({joinedCommunities.length})
            </button>

            <div className="h-4 w-px bg-[#dcdff2] dark:bg-[#1d2c4e] mx-1 hidden sm:block" />

            {["all", "discussion", "question", "idea", "showcase"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#BBBCE4]/30 dark:bg-[#141d33] text-[#06427D] dark:text-[#e6e9f7] font-bold"
                    : "text-[#5D6080] hover:text-[#06427D] dark:text-[#BBBCE4]/70 dark:hover:text-[#BBBCE4]"
                }`}
              >
                {cat === "all" ? "All types" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#5D6080] dark:text-[#BBBCE4]/60 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions & questions..."
              className="w-full pl-8 pr-3.5 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder:text-[#5D6080]/60 focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] space-y-3">
            <MessageSquare className="w-8 h-8 text-[#5D6080] dark:text-[#BBBCE4]/60 mx-auto" />
            <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
              No discussions found
            </h3>
            <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/75 max-w-sm mx-auto">
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
                  className="rounded-3xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 shadow-xs transition-colors space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-[#dcdff2] dark:ring-[#1d2c4e]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#06427D] dark:text-[#e6e9f7]">
                            {post.authorName}
                          </span>
                          <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/70 font-medium">
                            {post.authorHandle}
                          </span>
                          {post.authorRole && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] font-semibold">
                              {post.authorRole}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60 mt-0.5">
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
                    <h3 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7] leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5D6080] dark:text-[#BBBCE4] mt-2 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#f6f7fc] dark:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] border border-[#dcdff2] dark:border-[#1d2c4e]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#dcdff2]/70 dark:border-[#1d2c4e] flex items-center justify-between text-xs text-[#5D6080] dark:text-[#BBBCE4]/70">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvotePost(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer ${
                          post.userUpvoted
                            ? "bg-[#BBBCE4]/20 dark:bg-[#141d33] border-[#5420A6] text-[#5420A6] dark:text-[#A9DAF5]"
                            : "border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:bg-[#f6f7fc] dark:hover:bg-[#141d33]"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${
                            post.userUpvoted ? "fill-[#5420A6] dark:fill-[#A9DAF5]" : ""
                          }`}
                        />
                        <span>{post.upvotes}</span>
                      </button>

                      <button
                        onClick={() =>
                          setExpandedPostId(isExpanded ? null : post.id)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] text-[#5D6080] dark:text-[#BBBCE4]/80 hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] font-bold text-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{replies.length} replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyLink(post.id)}
                      className="p-1.5 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] transition-colors cursor-pointer"
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
                    <div className="pt-4 border-t border-[#dcdff2] dark:border-[#1d2c4e] space-y-4">
                      {replies.length > 0 && (
                        <div className="space-y-3">
                          {replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="p-3.5 rounded-2xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={reply.authorAvatar}
                                    alt={reply.authorName}
                                    className="w-5 h-5 rounded-md object-cover"
                                  />
                                  <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]/60">
                                    {reply.authorHandle}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#5D6080] dark:text-[#BBBCE4]/60">
                                  {reply.createdAt}
                                </span>
                              </div>
                              <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed pl-7">
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
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] placeholder:text-[#5D6080]/60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] dark:bg-[#0e1526] border-2 border-[#5420A6] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
              <div>
                <h3 className="text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Start a Community Discussion
                </h3>
                <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4]/80">
                  Share an idea, ask a question, or discuss architectural
                  trade-offs
                </p>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                    Target Community
                  </label>
                  <select
                    value={newPostCommunityId}
                    onChange={(e) => setNewPostCommunityId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                  >
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                    Category
                  </label>
                  <select
                    value={newPostCategory}
                    onChange={(e) =>
                      setNewPostCategory(
                        e.target.value as "discussion" | "question" | "idea" | "showcase",
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="question">Question</option>
                    <option value="idea">Proposal / Idea</option>
                    <option value="showcase">Showcase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Discussion Title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Dual-write outbox pattern vs listen/notify for CDC?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Content & Context
                </label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Provide detailed architectural background, trade-offs considered, and specific questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="e.g. PostgreSQL, CDC, Microservices"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#080c18] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-1 focus:ring-[#5420A6] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e]">
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
