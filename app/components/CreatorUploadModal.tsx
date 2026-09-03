'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const CreatorUploadModal: React.FC = () => {
  const { creatorUploadModalOpen, setCreatorUploadModalOpen, publishCreatorPost } = useHuddle();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillTag, setSkillTag] = useState('System Architecture');
  const [contentSnippet, setContentSnippet] = useState('');
  const [resourceLink, setResourceLink] = useState('');

  if (!creatorUploadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    publishCreatorPost(title, description, skillTag, contentSnippet, resourceLink);
    setTitle('');
    setDescription('');
    setContentSnippet('');
    setResourceLink('');
  };

  const skillOptions = [
    'System Architecture',
    'Next.js App Router',
    'TypeScript Type Mechanics',
    'Product UI & Micro-interactions',
    'AI Engineering & Agents'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Creator Studio Upload
              </h3>
              <p className="text-xs text-zinc-500">
                Publish bite-sized engineering guides & blueprints
              </p>
            </div>
          </div>

          <button
            onClick={() => setCreatorUploadModalOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">

          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Tutorial Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 3 Ways Redis Lua Scripts Prevent Race Conditions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">
                Skill Category
              </label>
              <select
                value={skillTag}
                onChange={(e) => setSkillTag(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              >
                {skillOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-zinc-700 dark:text-zinc-300">
                Sponsorship / Partner Tag
              </label>
              <input
                type="text"
                placeholder="Verified Creator"
                defaultValue="Verified Huddle Creator"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              One-Sentence Synopsis
            </label>
            <input
              type="text"
              placeholder="Why standard transactions fail during high write concurrency, and how 6 lines of atomic Lua solve cache stampedes."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Bite-Sized Core Lesson / Code Snippet
            </label>
            <textarea
              rows={4}
              placeholder="When multiple servers read and update a Redis counter simultaneously, client-side math causes stale overwrites..."
              value={contentSnippet}
              onChange={(e) => setContentSnippet(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs "
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Downloadable Blueprint URL
            </label>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="url"
                placeholder="https://github.com/your-username/sample-template"
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreatorUploadModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Publish Guide
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
