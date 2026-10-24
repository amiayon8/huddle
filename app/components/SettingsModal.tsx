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
      <div className="w-full max-w-xl bg-[#FFFFFF] dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        <div className="w-full md:w-48 p-4 border-b md:border-b-0 md:border-r border-[#dcdff2] dark:border-[#1d2c4e] bg-[#f6f7fc]/80 dark:bg-[#141d33]/50 space-y-1 shrink-0">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Settings
            </span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="md:hidden p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "account"
                ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-[#5420A6] dark:text-[#A9DAF5] shadow-xs font-bold"
                : "text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/10 dark:hover:bg-[#1d2c4e]/50 hover:text-[#06427D]"
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile and goals</span>
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "appearance"
                ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-[#5420A6] dark:text-[#A9DAF5] shadow-xs font-bold"
                : "text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/10 dark:hover:bg-[#1d2c4e]/50 hover:text-[#06427D]"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab("assistant")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
              activeTab === "assistant"
                ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-[#5420A6] dark:text-[#A9DAF5] shadow-xs font-bold"
                : "text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/10 dark:hover:bg-[#1d2c4e]/50 hover:text-[#06427D]"
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
                  ? "bg-[#FFFFFF] dark:bg-[#1d2c4e] text-[#5420A6] dark:text-[#A9DAF5] shadow-xs font-bold"
                  : "text-[#5D6080] dark:text-[#BBBCE4] hover:bg-[#BBBCE4]/10 dark:hover:bg-[#1d2c4e]/50 hover:text-[#06427D]"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sample data</span>
            </button>
          )}

          <div className="pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e]">
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
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
            <h3 className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
              {activeTab === "account" && "Profile and learning goals"}
              {activeTab === "appearance" && "Appearance and theme"}
              {activeTab === "assistant" && "Spark - AI Companion preferences"}
              {activeTab === "demo" && "Sample data options"}
            </h3>
            <button
              onClick={() => setSettingsOpen(false)}
              className="hidden md:block p-1 rounded-lg text-[#5D6080] hover:text-[#06427D] dark:hover:text-[#BBBCE4] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTab === "account" && (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#06427D] dark:text-[#BBBCE4]">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 focus:border-[#5420A6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#06427D] dark:text-[#BBBCE4]">
                  Short bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your background and what you are learning."
                  className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder:text-[#5D6080]/60 focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 focus:border-[#5420A6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#06427D] dark:text-[#BBBCE4]">
                  Target role or milestone
                </label>
                <input
                  type="text"
                  value={careerMilestone}
                  onChange={(e) => setCareerMilestone(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer, Architect"
                  className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder:text-[#5D6080]/60 focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 focus:border-[#5420A6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#06427D] dark:text-[#BBBCE4]">
                  Primary focus
                </label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Build production architectures, master concurrency"
                  className="w-full px-3 py-2 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder:text-[#5D6080]/60 focus:outline-none focus:ring-2 focus:ring-[#5420A6]/30 focus:border-[#5420A6]"
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
                  className="px-4 py-2 rounded-xl bg-[#5420A6] hover:bg-[#45188d] text-[#FFFFFF] text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-[#5420A6]/20"
                >
                  Save changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4 text-xs">
              <p className="text-[#5D6080] dark:text-[#BBBCE4]">
                Choose the interface theme that is easiest on your eyes.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer ${
                    theme === "light"
                      ? "border-[#5420A6] bg-[#BBBCE4]/15 dark:bg-[#141d33]"
                      : "border-[#dcdff2] dark:border-[#1d2c4e] hover:border-[#5420A6]"
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="font-bold block text-[#06427D] dark:text-[#e6e9f7]">
                      Light
                    </span>
                    <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]">
                      Clean white surfaces with high contrast
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer ${
                    theme === "dark"
                      ? "border-[#5420A6] bg-[#BBBCE4]/15 dark:bg-[#141d33]"
                      : "border-[#dcdff2] dark:border-[#1d2c4e] hover:border-[#5420A6]"
                  }`}
                >
                  <Moon className="w-5 h-5 text-[#A9DAF5]" />
                  <div>
                    <span className="font-bold block text-[#06427D] dark:text-[#e6e9f7]">
                      Dark
                    </span>
                    <span className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4]">
                      Calm, reduced brightness for night sessions
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === "assistant" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]">
                <div>
                  <span className="font-bold block text-[#06427D] dark:text-[#e6e9f7]">
                    Floating Spark companion button
                  </span>
                  <p className="text-[#5D6080] dark:text-[#BBBCE4] text-[11px] mt-0.5">
                    Show the floating Spark companion button in the bottom right
                    corner for quick access.
                  </p>
                </div>

                <button
                  onClick={toggleSparkDismissal}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    !isSparkDismissed
                      ? "bg-[#5420A6]"
                      : "bg-[#dcdff2] dark:bg-[#1d2c4e]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#FFFFFF] dark:bg-[#e6e9f7] transition-transform ${
                      !isSparkDismissed ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "demo" && isDemo && (
            <div className="space-y-4 text-xs">
              <p className="text-[#5D6080] dark:text-[#BBBCE4] leading-relaxed">
                You are currently exploring a demo account. You can reset your
                practice history, sample deliverables, and progress back to
                their initial state at any time.
              </p>

              <button
                onClick={() => {
                  setSettingsOpen(false);
                  setResetDemoModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] text-[#06427D] dark:text-[#e6e9f7] font-semibold transition-colors cursor-pointer"
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
