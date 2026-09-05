"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useHuddle } from "../../context/HuddleContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, login, loginDemo, setActiveTab } = useHuddle();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirected_from_auth", "true");
      }
      setActiveTab("explore");
      router.push("/app?from=auth");
    }
  }, [isAuthenticated, authLoading, router, setActiveTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid email or password");
      setLoading(false);
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirected_from_auth", "true");
      }
      setActiveTab("explore");
      router.push("/app?from=auth");
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await loginDemo();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirected_from_auth", "true");
    }
    setActiveTab("explore");
    router.push("/app?from=auth");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo_light.svg"
            alt="Huddle"
            className="w-9 h-9 rounded-xl object-contain shadow-xs dark:hidden"
          />
          <img
            src="/logo.svg"
            alt="Huddle"
            className="w-9 h-9 rounded-xl object-contain shadow-xs hidden dark:block"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back to Huddle
            </h1>
            <p className="text-xs text-zinc-500">
              Log in to continue your deliberate focus sprint
            </p>
          </div>
        </div>

        {/* Pip Welcome */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3.5">
          <div className="relative shrink-0 w-12 h-12">
            <img
              src="/mascot_encouragement.svg"
              alt="Pip"
              className="w-full h-full object-contain drop-shadow-xs transition-transform hover:scale-110"
            />
          </div>
          <div className="text-xs text-zinc-700 dark:text-zinc-300">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block text-[11px] uppercase tracking-wider">
              Pip Companion
            </span>
            <span>
              Consistency beats intensity! Log in to resume your active 4-day
              sprint.
            </span>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Demo Login</span>
          </button>

          <p className="text-center text-xs text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
