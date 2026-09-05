'use client';

import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Shield, Bell, User as UserIcon, Bot, Check, LogOut, RotateCcw } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const SettingsModal: React.FC = () => {
  const { 
    settingsOpen, 
    setSettingsOpen, 
    user, 
    updateUserProfile, 
    theme, 
    setTheme, 
    openAuthModal,
    isDemo,
    logout,
    setResetDemoModalOpen 
  } = useHuddle();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'appearance' | 'notifications' | 'mascot'>('account');
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [careerMilestone, setCareerMilestone] = useState(user.careerMilestone);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [saved, setSaved] = useState(false);
  const [isPipDismissed, setIsPipDismissed] = useState(false);

  useEffect(() => {
    const syncDismissed = () => {
      if (typeof window !== 'undefined') {
        setIsPipDismissed(Boolean(localStorage.getItem('huddle_pip_dismissed')));
      }
    };
    syncDismissed();
    window.addEventListener('storage', syncDismissed);
    window.addEventListener('huddle_pip_visibility_change', syncDismissed);
    return () => {
      window.removeEventListener('storage', syncDismissed);
      window.removeEventListener('huddle_pip_visibility_change', syncDismissed);
    };
  }, []);

  const togglePipDismissal = () => {
    if (typeof window === 'undefined') return;
    if (isPipDismissed) {
      localStorage.removeItem('huddle_pip_dismissed');
      setIsPipDismissed(false);
    } else {
      localStorage.setItem('huddle_pip_dismissed', 'true');
      setIsPipDismissed(true);
    }
    window.dispatchEvent(new Event('huddle_pip_visibility_change'));
  };

  if (!settingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, bio, careerMilestone, primaryGoal });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await logout();
    setSettingsOpen(false);
    openAuthModal('welcome');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        
        <div className="w-full md:w-48 p-3.5 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Settings
            </span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="md:hidden p-1 rounded-lg text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'account' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            Profile & Career
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'privacy' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Privacy
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'appearance' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Appearance
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'notifications' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab('mascot')}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
              activeTab === 'mascot' ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Mascot
          </button>

          <div className="pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            {isDemo && (
              <button
                onClick={() => {
                  setSettingsOpen(false);
                  setResetDemoModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Full Reset</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 shrink-0">
                  Demo
                </span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="hidden md:flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 capitalize">
              {activeTab === 'account' ? 'Profile & Career Focus' : `${activeTab} Settings`}
            </h3>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'account' && (
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Career Target Milestone</label>
                <input
                  type="text"
                  value={careerMilestone}
                  onChange={e => setCareerMilestone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Primary Learning Goal</label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={e => setPrimaryGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {saved ? <Check className="w-3.5 h-3.5" /> : null}
                  {saved ? 'Saved Changes to Database' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-3 text-xs">
              <div className="font-medium text-zinc-700 dark:text-zinc-300">Theme Preference</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between font-semibold ${
                    theme === 'dark' ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Dark
                  </div>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>

                <button
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between font-semibold ${
                    theme === 'light' ? 'border-indigo-600 bg-indigo-50/20 text-indigo-600' : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Light
                  </div>
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Learning Privacy Active</div>
                <p className="text-zinc-500 leading-relaxed">
                  Your raw active skill roadmaps and decay meters remain strictly private to your account.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span>Micro-squad member check-ins</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span>Creator blueprint releases</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span>Daily practice progress alert</span>
                <input type="checkbox" defaultChecked className="accent-indigo-600" />
              </div>
            </div>
          )}

          {activeTab === 'mascot' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 p-2 rounded-2xl bg-white dark:bg-[#111218] border-2 border-indigo-500 shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
                  <img src="/mascot_idle.svg" alt="Pip AI" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Pip AI Engineering Companion
                  </h4>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Modeled after Duolingo's mascot philosophy — active on every page to encourage 1 daily deliberate practice action.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    <img src="/mascot_idle.svg" alt="Idle" className="w-4 h-4 object-contain" />
                    <span>Idle</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    <img src="/mascot_planning.svg" alt="Planning" className="w-4 h-4 object-contain" />
                    <span>Planning</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    <img src="/mascot_thinking.svg" alt="Thinking" className="w-4 h-4 object-contain" />
                    <span>Thinking</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    <img src="/mascot_success.svg" alt="Success" className="w-4 h-4 object-contain" />
                    <span>Success</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">Zero-Penalty Philosophy</div>
                <p className="text-[11px] leading-relaxed">
                  Pip never penalizes missed days. Reshuffling a 4-day sprint is always 100% free and supportive.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">Floating Mascot Badge</div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Show Pip assistant badge in the bottom-right corner of the screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={togglePipDismissal}
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 font-medium text-[11px] text-zinc-800 dark:text-zinc-200 cursor-pointer transition-colors"
                >
                  {isPipDismissed ? 'Restore Pip' : 'Dismiss Pip'}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
