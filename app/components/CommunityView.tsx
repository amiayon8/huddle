'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Search, 
  Tag, 
  HelpCircle, 
  Code, 
  Lightbulb, 
  Flame, 
  Send,
  X
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { CommunityPost } from '../types/huddle';
import { DuolingoMascot } from './DuolingoMascot';

export const CommunityView: React.FC = () => {
  const { posts, createCommunityPost, toggleUpvotePost, addReplyToPost } = useHuddle();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'question' | 'discussion' | 'code-review' | 'tip'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('question');
  const [postSkill, setPostSkill] = useState('sys-arch');
  const [replyText, setReplyText] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedFilter === 'all' || post.category === selectedFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) return;
    createCommunityPost(postTitle, postContent, postSkill, postCategory);
    setPostTitle('');
    setPostContent('');
    setNewPostModalOpen(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;
    addReplyToPost(postId, replyText);
    setReplyText('');
  };

  const getCategoryBadge = (category: CommunityPost['category']) => {
    switch (category) {
      case 'question':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-semibold"><HelpCircle className="w-3 h-3" /> Question</span>;
      case 'code-review':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 text-[10px] font-semibold"><Code className="w-3 h-3" /> Code Review</span>;
      case 'tip':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold"><Lightbulb className="w-3 h-3" /> Tip</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-semibold"><MessageSquare className="w-3 h-3" /> Discussion</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Skill Communities
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Discussions & Peer Q&A
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Focused conversations instead of endless social media feeds.
          </p>
        </div>

        <button
          onClick={() => setNewPostModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Pip Mascot Signal Banner */}
      <DuolingoMascot
        emotion="thinking"
        size="md"
        speechText="Pip's Signal Shield: Pure technical discussions, architecture reviews, and actionable tips. Zero toxic algorithm traps."
        showQuickActions={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, or code snippets..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'question', 'discussion', 'code-review', 'tip'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    selectedFilter === cat 
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat === 'all' ? 'All Posts' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map(post => {
              const isExpanded = expandedPostId === post.id;
              return (
                <div 
                  key={post.id}
                  className="p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-9 h-9 rounded-xl object-cover" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-zinc-500">{post.authorHandle}</span>
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                            {post.authorReputation} rep
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          In <strong className="text-zinc-600 dark:text-zinc-400 font-semibold">{post.skillTitle}</strong> • {post.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.isSolved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Solved
                        </span>
                      )}
                      {getCategoryBadge(post.category)}
                    </div>
                  </div>

                  <div>
                    <h3 
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                    >
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvotePost(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold transition-colors ${
                          post.userUpvoted 
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold hover:bg-zinc-200 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.repliesCount} Replies</span>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4 animate-in fade-in">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Replies ({post.replies?.length || 0})
                      </h4>

                      <div className="space-y-3">
                        {post.replies?.map(rep => (
                          <div 
                            key={rep.id}
                            className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                              rep.isHelpful 
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40' 
                                : 'bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800'
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
                                <span className="text-[10px] text-zinc-400">{rep.createdAt}</span>
                              </div>
                              {rep.isHelpful && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Helpful Answer
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {rep.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Write a helpful response..."
                          className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={() => handleAddReply(post.id)}
                          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Trending Topics
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  #system-design
                </div>
                <div className="text-[10px] text-zinc-500">42 discussions today</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  #nextjs-app-router
                </div>
                <div className="text-[10px] text-zinc-500">28 discussions today</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  #typescript-mechanics
                </div>
                <div className="text-[10px] text-zinc-500">19 discussions today</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Start a Discussion
              </h3>
              <button onClick={() => setNewPostModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. Best practices for caching in distributed queues"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Category</label>
                  <select
                    value={postCategory}
                    onChange={e => setPostCategory(e.target.value as CommunityPost['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="question">Question</option>
                    <option value="discussion">Discussion</option>
                    <option value="code-review">Code Review</option>
                    <option value="tip">Tip</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Skill Domain</label>
                  <select
                    value={postSkill}
                    onChange={e => setPostSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="sys-arch">System Architecture</option>
                    <option value="next-rsc">Next.js App Router</option>
                    <option value="ts-type-mechanics">TypeScript Mechanics</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Content</label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Provide context or code snippets..."
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
