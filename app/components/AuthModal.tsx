"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRight,
  Check,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { signInUser, signUpUser, resetPasswordUser } from "../lib/supabase";

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    closeAuthModal,
    authMode,
    setOnboardingActive,
    updateUserProfile,
    loginDemo,
    isAuthenticated,
  } = useHuddle();
  const [mode, setMode] = useState<"welcome" | "login" | "signup" | "forgot">(
    authMode || "welcome",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (authMode) {
      setMode(authMode);
    }
  }, [authMode]);

  if (!authModalOpen || isAuthenticated) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { user, error } = await signUpUser(email, password, fullName);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        if (user) {
          updateUserProfile({ name: fullName || "Engineer", email });
          setSuccessMessage("Account created successfully.");
          setTimeout(() => {
            closeAuthModal();
            setOnboardingActive(true);
            setLoading(false);
          }, 500);
        }
      } else if (mode === "login") {
        const { user, error } = await signInUser(email, password);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        if (user) {
          setSuccessMessage("Signed in successfully.");
          setTimeout(() => {
            closeAuthModal();
            setLoading(false);
          }, 500);
        }
      } else if (mode === "forgot") {
        const res = await resetPasswordUser(email);
        if (!res.success) {
          setErrorMessage(res.error || "Unable to send password reset email.");
          setLoading(false);
          return;
        }
        setSuccessMessage(`Password reset link sent to ${email}`);
        setTimeout(() => {
          setMode("login");
          setLoading(false);
        }, 1200);
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      setSuccessMessage("Signed in with demo account.");
      setTimeout(() => {
        closeAuthModal();
        setLoading(false);
      }, 400);
    } catch {
      setErrorMessage("Unable to open demo account.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-7">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 flex items-center justify-center shrink-0">
            <img
              src="/mascot_idle.svg"
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Huddle
            </h2>
            <p className="text-xs text-zinc-500">
              Hands-on deliberate practice for engineers.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {mode === "welcome" && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Sign in or create an account to save your study plans, track your daily progress, and resume anytime.
            </div>

            <button
              onClick={() => setMode("signup")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Create an account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMode("login")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Sign in with existing account</span>
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full py-2 flex items-center justify-center gap-2 text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <span>Continue with demo account</span>
            </button>
          </div>
        )}

        {(mode === "login" || mode === "signup") && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h3>

            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
              ) : mode === "signup" ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode(mode === "signup" ? "login" : "signup");
              }}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 pt-1 cursor-pointer"
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "Do not have an account? Create one"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Reset your password
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Enter your email address and we will send you instructions to reset your password.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 pt-1 cursor-pointer"
            >
              Return to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
