"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { fetchSearchSuggestions } from "../lib/supabase";

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, setActiveTab, creators, posts } =
    useHuddle();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchSearchSuggestions().then((data) => {
      if (data && data.length > 0) setSuggestions(data);
    });
  }, []);

  if (!searchOpen) return null;

  const recentSearches =
    suggestions.length > 0
      ? suggestions.map((s) => s.title).slice(0, 4)
      : [
          "System Architecture",
          "Next.js App Router",
          "TypeScript Generics",
          "Sumaiya Kabir",
        ];

  const suggestedTopics =
    suggestions.length > 0
      ? suggestions
          .filter((s) => s.category === "Track")
          .map((s) => s.title)
      : [
          "System Design",
          "React Server Components",
          "TypeScript Fundamentals",
          "UI Micro-interactions",
        ];

  const filteredCreators = creators.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, guides, and creators..."
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!query ? (
            <>
              <div className="space-y-2.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Recent searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rs) => (
                    <button
                      key={rs}
                      onClick={() => setQuery(rs)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      {rs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-medium text-zinc-500 block">
                  Suggested topics
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setSearchOpen(false);
                        setActiveTab("explore");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {filteredCreators.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-zinc-500 block">
                    Creators
                  </span>
                  <div className="space-y-1.5">
                    {filteredCreators.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setActiveTab("explore");
                        }}
                        className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              {c.title}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-zinc-500 block">
                    Guides and topics
                  </span>
                  <div className="space-y-1.5">
                    {filteredPosts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setActiveTab("explore");
                        }}
                        className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {p.authorName} • {p.skillTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCreators.length === 0 && filteredPosts.length === 0 && (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No matching creators or topics found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
