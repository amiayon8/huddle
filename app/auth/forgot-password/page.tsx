"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useHuddle } from "../../context/HuddleContext";
import { resetPasswordUser } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, setActiveTab } = useHuddle();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (!email) return;
    setErrorMessage(null);
    setLoading(true);

    const res = await resetPasswordUser(email);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || "Unable to send password recovery email.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center p-4 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm p-7 sm:p-9 space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="w-3 h-3 rounded-xs bg-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
              Reset your password
            </h1>
            <p className="text-xs text-zinc-500">
              Enter your account email to receive a recovery link.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-700 p-1 flex items-center justify-center">
            <img
              src="/Huddle SVGs/05_eureka_lightbulb.svg"
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Enter the email address registered with your account and we will send you instructions to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Password recovery link sent</span>
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed text-xs">
              If an account exists for <strong>{email}</strong>, you will receive an email shortly with instructions to choose a new password.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Send recovery link"
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
