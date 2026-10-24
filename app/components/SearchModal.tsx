"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { fetchSearchSuggestions } from "../lib/supabase";
import { getGravatarUrl } from "../lib/gravatar";

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
      <div className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc]/80 dark:bg-[#141d33]/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, guides, and creators..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#06427D] dark:text-[#e6e9f7] placeholder-[#5D6080]/60 focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!query ? (
            <>
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4] block">
                  Recent searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rs) => (
                    <button
                      key={rs}
                      onClick={() => setQuery(rs)}
                      className="px-3 py-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc] dark:bg-[#141d33] text-xs font-medium text-[#06427D] dark:text-[#e6e9f7] hover:border-[#5420A6] transition-colors cursor-pointer"
                    >
                      {rs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4] block">
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
                      className="px-3 py-1.5 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] border border-[#BBBCE4]/40 dark:border-[#1d2c4e] text-[#5420A6] dark:text-[#A9DAF5] text-xs font-semibold hover:bg-[#BBBCE4]/30 transition-colors cursor-pointer"
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
                  <span className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4] block">
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
                        className="p-3 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33]/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar?.includes("gravatar.com") ? c.avatar : getGravatarUrl(c.handle || c.name, 64)}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#dcdff2] dark:border-[#1d2c4e]"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7]">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]">
                              {c.title}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#5420A6] dark:text-[#A9DAF5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#06427D] dark:text-[#BBBCE4] block">
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
                        className="p-3 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33]/60 cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-semibold text-[#06427D] dark:text-[#e6e9f7]">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] mt-0.5">
                          {p.authorName} • {p.skillTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCreators.length === 0 && filteredPosts.length === 0 && (
                <div className="py-8 text-center text-xs text-[#5D6080] dark:text-[#BBBCE4]">
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
