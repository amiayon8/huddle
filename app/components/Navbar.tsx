'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Layers, 
  Compass, 
  Users, 
  MessageSquare, 
  BarChart3, 
  UserCheck
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { ActiveTab } from '../types/huddle';

export const Navbar: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    setSearchOpen, 
    setSettingsOpen, 
    mascotOpen, 
    setMascotOpen,
    notifications,
    markNotificationRead,
    openAuthModal
  } = useHuddle();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'creators', label: 'Creators', icon: UserCheck },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-indigo-500 transition-colors">
              H
            </div>
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Search skills, creators...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-zinc-200/60 dark:bg-zinc-800/60 rounded text-zinc-500 dark:text-zinc-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setMascotOpen(!mascotOpen)}
            className={`relative p-2 rounded-xl border text-xs font-medium transition-colors ${
              mascotOpen 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
            title="Mascot Pip Guidance"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Notifications
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer text-xs transition-colors ${
                        n.read 
                          ? 'bg-transparent text-zinc-500 dark:text-zinc-400' 
                          : 'bg-indigo-50/40 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 border border-indigo-100 dark:border-indigo-900/40'
                      }`}
                    >
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {n.title}
                      </div>
                      <div className="mt-0.5 leading-relaxed text-[11px]">
                        {n.description}
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-400">
                        {n.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-0.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
              />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {user.handle}
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Public Profile
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('welcome');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Switch Account
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
