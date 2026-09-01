'use client';

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Award, 
  Flame, 
  ShieldCheck, 
  Briefcase,
  GitPullRequest,
  FileCode,
  Activity,
  BookOpen,
  Calendar,
  Settings,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
  Edit3,
  X,
  Camera
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const PublicProfileView: React.FC = () => {
  const { 
    user, 
    updateUserProfile,
    skillsHealth, 
    creators, 
    portfolioItems, 
    realWorldProofs, 
    careerTimeline, 
    togglePublishPortfolio, 
    completeRealWorldProof,
    setSettingsOpen, 
    setSelectedCreatorModal,
    setOnboardingActive 
  } = useHuddle();

  const [activeProfileTab, setActiveProfileTab] = useState<'portfolio' | 'timeline' | 'skills' | 'achievements' | 'creators' | 'overview'>('portfolio');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [bio, setBio] = useState(user.bio);
  const [careerMilestone, setCareerMilestone] = useState(user.careerMilestone);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [avatar, setAvatar] = useState(user.avatar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      handle,
      bio,
      careerMilestone,
      primaryGoal,
      avatar
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditProfileOpen(false);
    }, 800);
  };

  const badges = [
    { 
      id: 'b-1', 
      title: 'Caching Foundations', 
      category: 'System Architecture', 
      date: 'August 2026', 
      icon: '⚡',
      desc: 'Distributed caching trade-offs, invalidation strategies, and stampede defense.'
    },
    { 
      id: 'b-2', 
      title: 'Helpful Community Answer', 
      category: 'Peer Support', 
      date: 'August 2026', 
      icon: '💬',
      desc: 'Solution on Serverless Postgres connection pooling marked helpful.'
    },
    { 
      id: 'b-3', 
      title: 'Squad Partner', 
      category: 'Consistency', 
      date: 'July 2026', 
      icon: '🤝',
      desc: 'Maintained 5 consecutive days of shared team check-ins.'
    },
    { 
      id: 'b-4', 
      title: 'RSC Stream Rendering', 
      category: 'Frontend Performance', 
      date: 'June 2026', 
      icon: '🚀',
      desc: 'Mastered React Server Components and suspense layout streaming.'
    }
  ];

  const followedCreators = creators.filter(c => c.isFollowing);
  const creatorUploads = followedCreators.flatMap(c => 
    c.pinnedResources.map(r => ({ ...r, creatorName: c.name, creatorAvatar: c.avatar, creatorHandle: c.handle, creatorObj: c }))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-12 animate-in fade-in duration-200">
      
      {/* Profile Header Hero */}
      <div className="p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 shadow-2xs" 
              />
              <button
                onClick={() => setEditProfileOpen(true)}
                className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </h1>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {user.handle} • Target: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{user.careerMilestone}</strong>
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-lg leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setOnboardingActive(true)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Change Focus
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex flex-wrap items-center gap-6 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.streak}d</span>
            <span className="text-zinc-400">Streak</span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{portfolioItems.length}</span>
            <span className="text-zinc-400">Artifacts</span>
          </div>

          <div className="flex items-center gap-2">
            <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{realWorldProofs.filter(p => p.completed).length}</span>
            <span className="text-zinc-400">Verified Proofs</span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.reputation}</span>
            <span className="text-zinc-400">Reputation</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Synchronized directly with your Supabase database record
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditProfileOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              
              {/* Avatar Preset Selector */}
              <div className="space-y-2">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {avatarPresets.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Avatar option"
                      onClick={() => setAvatar(preset)}
                      className={`w-11 h-11 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                        avatar === preset 
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-105' 
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Target Career Milestone
                </label>
                <input
                  type="text"
                  value={careerMilestone}
                  onChange={e => setCareerMilestone(e.target.value)}
                  placeholder="e.g. Staff Distributed Systems Architect"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Primary Learning Goal
                </label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={e => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Master Caching & Async Pipelines"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Bio / Engineering Focus
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{savedSuccess ? 'Updated in Database' : 'Save Profile'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-zinc-200 dark:border-zinc-800 pb-1 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveProfileTab('portfolio')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'portfolio'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Portfolio</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('timeline')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'timeline'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('skills')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'skills'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Skill Health</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('achievements')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'achievements'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Achievements</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('creators')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'creators'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Saved Resources</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            activeProfileTab === 'overview'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Privacy</span>
        </button>
      </div>

      {/* Tab 1: Portfolio & Proofs */}
      {activeProfileTab === 'portfolio' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {portfolioItems.map(item => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/60 dark:border-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
                    <pre>{item.previewSnippet}</pre>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => togglePublishPortfolio(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      item.isPublished 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.isPublished ? 'Public' : 'Private'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Verified Proofs */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-indigo-500" />
                Verified Proofs
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Practical engineering actions (GitHub PRs, cold outreach, public ADRs).
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {realWorldProofs.map(proof => (
                <div 
                  key={proof.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    proof.completed 
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40' 
                      : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeRealWorldProof(proof.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                        proof.completed 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-emerald-500'
                      }`}
                    >
                      {proof.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>

                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                        {proof.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {proof.description}
                      </div>
                      {proof.externalLink && (
                        <a 
                          href={proof.externalLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-0.5"
                        >
                          <span>View external proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0">
                    {proof.proofBadge}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Career Timeline */}
      {activeProfileTab === 'timeline' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-5">
            <div className="relative pl-5 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900/60">
              {careerTimeline.map(entry => (
                <div key={entry.id} className="relative space-y-0.5">
                  <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-[#111218]" />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {entry.date}
                    </span>
                    {entry.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                        {entry.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {entry.title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Skill Decay */}
      {activeProfileTab === 'skills' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {skillsHealth.map(sh => (
              <div 
                key={sh.skillId}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {sh.skillTitle.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                        {sh.skillTitle}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {sh.category}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold capitalize ${
                    sh.status === 'optimal'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      : sh.status === 'maintaining'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                  }`}>
                    {sh.status} ({sh.healthPercent}%)
                  </span>
                </div>

                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      sh.status === 'optimal' 
                        ? 'bg-emerald-500' 
                        : sh.status === 'maintaining' 
                        ? 'bg-indigo-600' 
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${sh.healthPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Practiced: {sh.lastPracticed}</span>
                  </div>
                  <span>Decay: {sh.decayRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Achievements */}
      {activeProfileTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
          {badges.map(b => (
            <div 
              key={b.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-lg flex items-center justify-center shrink-0">
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {b.title}
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">
                    {b.date}
                  </span>
                </div>
                <div className="text-[10.5px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {b.category}
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Saved Creator Resources */}
      {activeProfileTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
          {creatorUploads.map(res => (
            <div 
              key={res.id}
              onClick={() => setSelectedCreatorModal(res.creatorObj)}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-semibold uppercase">
                    {res.type}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {res.duration}
                  </span>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                  {res.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <img 
                    src={res.creatorAvatar} 
                    alt={res.creatorName} 
                    className="w-5 h-5 rounded-full object-cover" 
                  />
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    {res.creatorName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                  <span>View Guide</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Privacy */}
      {activeProfileTab === 'overview' && (
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs space-y-4 animate-in fade-in duration-200">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Privacy Settings
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Public Profile Visibility
                </div>
                <div className="text-[11px] text-zinc-500">
                  Allow peers to view your reputation, published portfolio pieces, and badges.
                </div>
              </div>
              <input 
                type="checkbox" 
                defaultChecked={user.privacy.publicProfile} 
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" 
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Show Streak to Micro-Squad
                </div>
                <div className="text-[11px] text-zinc-500">
                  Share daily streak count with your 4 squad members.
                </div>
              </div>
              <input 
                type="checkbox" 
                defaultChecked={user.privacy.showStreak} 
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
