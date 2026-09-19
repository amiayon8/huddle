"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useHuddle } from "../../context/HuddleContext";

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, signup, setOnboardingActive, setActiveTab } =
    useHuddle();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    setSuccessMsg(null);
    setLoading(true);

    const res = await signup(email, password, fullName);
    if (!res.success) {
      setErrorMsg(res.error || "Unable to create account. Please check your details.");
      setLoading(false);
    } else {
      setSuccessMsg("Account created successfully. Setting up your workspace...");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirected_from_auth", "true");
      }
      setActiveTab("explore");
      setOnboardingActive(true);
      setTimeout(() => {
        router.push("/app?from=auth");
      }, 600);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm p-7 sm:p-9 space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-xs bg-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
              Create an account
            </h1>
            <p className="text-xs text-zinc-500">
              Start your deliberate practice plan.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-700 p-1 flex items-center justify-center">
            <img
              src="/mascot_planning.svg"
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Your plan includes practical exercises, architecture examples, and helpful code walkthroughs.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
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
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create account and continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-center text-xs text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
