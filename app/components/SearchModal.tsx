'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Users, UserCheck, Flame, ArrowRight } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { fetchSearchSuggestions } from '../lib/supabase';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, setActiveTab, creators, posts } = useHuddle();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    fetchSearchSuggestions().then((data) => {
      if (data && data.length > 0) setSuggestions(data);
    });
  }, []);

  if (!searchOpen) return null;

  const recentSearches = suggestions.length > 0
    ? suggestions.map(s => s.title).slice(0, 4)
    : ['System Architecture', 'Next.js App Router', 'Advanced TypeScript', 'Elena Rostova'];

  const suggestedTopics = suggestions.length > 0
    ? suggestions.filter(s => s.category === 'Track').map(s => `#${s.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)
    : ['#system-design', '#react-server-components', '#typescript-mechanics', '#ui-micro-interactions'];

  const filteredCreators = creators.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search skills, creators, topics, resources..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!query ? (
            <>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Recent Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(rs => (
                    <button
                      key={rs}
                      onClick={() => setQuery(rs)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    >
                      {rs}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Suggested Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        setSearchOpen(false);
                        setActiveTab('community');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
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
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Creators
                  </div>
                  <div className="space-y-2">
                    {filteredCreators.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setActiveTab('creators');
                        }}
                        className="p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-xl object-cover" />
                          <div>
                            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</div>
                            <div className="text-[10px] text-zinc-500">{c.title}</div>
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
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Discussions
                  </div>
                  <div className="space-y-2">
                    {filteredPosts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setActiveTab('community');
                        }}
                        className="p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{p.authorName} • {p.skillTitle}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
