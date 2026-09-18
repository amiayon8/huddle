"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sun,
  Moon,
  Bell,
  User as UserIcon,
  Bot,
  Check,
  LogOut,
  RotateCcw,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";

export const SettingsModal: React.FC = () => {
  const router = useRouter();
  const {
    settingsOpen,
    setSettingsOpen,
    user,
    updateUserProfile,
    theme,
    setTheme,
    isDemo,
    logout,
    setResetDemoModalOpen,
  } = useHuddle();

  const [activeTab, setActiveTab] = useState<
    "account" | "appearance" | "notifications" | "assistant" | "demo"
  >("account");
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [careerMilestone, setCareerMilestone] = useState(user.careerMilestone);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [saved, setSaved] = useState(false);
  const [isSparkDismissed, setIsSparkDismissed] = useState(false);

  useEffect(() => {
    const syncDismissed = () => {
      if (typeof window !== "undefined") {
        setIsSparkDismissed(
          Boolean(localStorage.getItem("huddle_spark_dismissed")),
        );
      }
    };
    syncDismissed();
    window.addEventListener("storage", syncDismissed);
    window.addEventListener("huddle_spark_visibility_change", syncDismissed);
    return () => {
      window.removeEventListener("storage", syncDismissed);
      window.removeEventListener(
        "huddle_spark_visibility_change",
        syncDismissed,
      );
    };
  }, []);

  const toggleSparkDismissal = () => {
    if (typeof window === "undefined") return;
    if (isSparkDismissed) {
      localStorage.removeItem("huddle_spark_dismissed");
      setIsSparkDismissed(false);
    } else {
      localStorage.setItem("huddle_spark_dismissed", "true");
      setIsSparkDismissed(true);
    }
    window.dispatchEvent(new Event("huddle_spark_visibility_change"));
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
    router.push("/auth/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        <div className="w-full md:w-48 p-4 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1 shrink-0">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
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
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "account"
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile and goals</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "appearance"
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab("assistant")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "assistant"
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Spark - AI Companion</span>
          </button>

          {isDemo && (
            <button
              onClick={() => setActiveTab("demo")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                activeTab === "demo"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sample data</span>
            </button>
          )}

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {activeTab === "account" && "Profile and learning goals"}
              {activeTab === "appearance" && "Appearance and theme"}
              {activeTab === "assistant" && "Spark - AI Companion preferences"}
              {activeTab === "demo" && "Sample data options"}
            </h3>
            <button
              onClick={() => setSettingsOpen(false)}
              className="hidden md:block p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === "account" && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Short bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your background and what you are learning."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Target role or milestone
                </label>
                <input
                  type="text"
                  value={careerMilestone}
                  onChange={(e) => setCareerMilestone(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer, Architect"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Primary focus
                </label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Build production architectures, master concurrency"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                {saved && (
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4 text-xs">
              <p className="text-zinc-500">
                Choose the interface theme that is easiest on your eyes.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer ${
                    theme === "light"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="font-medium block text-zinc-900 dark:text-zinc-100">
                      Light
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Clean white surfaces with high contrast
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer ${
                    theme === "dark"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="font-medium block text-zinc-900 dark:text-zinc-100">
                      Dark
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Calm, reduced brightness for night sessions
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === "assistant" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                <div>
                  <span className="font-medium block text-zinc-900 dark:text-zinc-100">
                    Floating Spark companion button
                  </span>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Show the floating Spark companion button in the bottom right
                    corner for quick access.
                  </p>
                </div>

                <button
                  onClick={toggleSparkDismissal}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    !isSparkDismissed
                      ? "bg-indigo-600"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      !isSparkDismissed ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "demo" && isDemo && (
            <div className="space-y-4 text-xs">
              <p className="text-zinc-500 leading-relaxed">
                You are currently exploring a demo account. You can reset your
                practice history, sample deliverables, and progress back to
                their initial state at any time.
              </p>

              <button
                onClick={() => {
                  setSettingsOpen(false);
                  setResetDemoModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium transition-colors cursor-pointer"
              >
                Reset demo workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
