'use client';

import React, { useState } from 'react';
import { X, Sun, Moon, Shield, Bell, User as UserIcon, Sparkles, Check } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const SettingsModal: React.FC = () => {
  const { settingsOpen, setSettingsOpen, user, updateUserProfile, theme, setTheme } = useHuddle();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'appearance' | 'mascot'>('account');
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [saved, setSaved] = useState(false);

  if (!settingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        
        <div className="w-full md:w-56 p-4 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1">
          <div className="flex items-center justify-between pb-3 md:pb-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Settings
            </span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="md:hidden p-1 rounded-lg text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'account' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Account Profile
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'privacy' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy & Learning Shield
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'notifications' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'appearance' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Sun className="w-4 h-4" />
            Appearance
          </button>

          <button
            onClick={() => setActiveTab('mascot')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeTab === 'mascot' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Mascot Preferences
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 capitalize">
              {activeTab} Settings
            </h3>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab === 'account' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {saved ? <Check className="w-4 h-4" /> : null}
                {saved ? 'Saved Changes' : 'Save Profile'}
              </button>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Select Theme</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                    theme === 'dark' ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Dark Mode
                  </div>
                  {theme === 'dark' && <Check className="w-4 h-4 text-indigo-600" />}
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                    theme === 'light' ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Light Mode
                  </div>
                  {theme === 'light' && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Learning Privacy Enabled</div>
                <p className="text-zinc-500 leading-relaxed">
                  Your raw active skill learning roadmaps and decay meters remain strictly private to your account.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span>Squad member check-ins</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span>Followed creator uploads</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span>Next step ready reminders</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
            </div>
          )}

          {activeTab === 'mascot' && (
            <div className="space-y-4 text-xs">
              <p className="text-zinc-500 leading-relaxed">
                Pip mascot provides supportive reflections and pacing recommendations without interrupting your flow.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 font-semibold text-indigo-900 dark:text-indigo-300">
                Supportive Tone: Friendly Friend (Default)
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
