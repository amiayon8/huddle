"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useHuddle } from "../../context/HuddleContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo, authLoading } = useHuddle();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("redirected_from_auth", "true");
        }
        router.push("/app?from=auth");
      } else {
        setErrorMsg(
          (res && res.error) ||
            "Please check your email and password and try again.",
        );
      }
    } catch {
      setErrorMsg("Unable to connect. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await loginDemo();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirected_from_auth", "true");
      }
      router.push("/app?from=auth");
    } catch {
      setErrorMsg("Unable to sign in with the demo account right now.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7fc] dark:bg-[#080c18] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#5420A6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fc] dark:bg-[#080c18] flex items-center justify-center p-4 selection:bg-[#5420A6] selection:text-white dark:selection:text-[#BBBCE4]">
      <div className="w-full max-w-md bg-white dark:bg-[#0e1526] border border-[#dcdff2]/80 dark:border-[#1d2c4e]/80 rounded-2xl shadow-sm p-7 sm:p-9 space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Huddle"
            className="w-8 h-8 rounded-lg object-contain shrink-0"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#06427D] dark:text-[#BBBCE4]">
              Welcome back
            </h1>
            <p className="text-xs text-[#5D6080] dark:text-[#9aa0c4]">
              Sign in to continue where you left off.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#A9DAF5]/15 dark:bg-[#06427D]/20 border border-[#A9DAF5]/40 dark:border-[#1d2c4e] flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#0e1526] border border-[#dcdff2] dark:border-[#1d2c4e] p-1 flex items-center justify-center">
            <img
              src="/mascot_idle.svg"
              alt="Spark"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-[#06427D] dark:text-[#BBBCE4] leading-relaxed">
            A focused 20 minutes today keeps your momentum going and deepens what you learned yesterday.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#06427D] dark:text-[#BBBCE4]">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5D6080]/60 dark:text-[#9aa0c4]/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-white dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder-[#8488ab] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#06427D] dark:text-[#BBBCE4]">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#5420A6] dark:text-[#A9DAF5] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5D6080]/60 dark:text-[#9aa0c4]/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-white dark:bg-[#141d33] text-xs text-[#06427D] dark:text-[#e6e9f7] placeholder-[#8488ab] focus:outline-none focus:ring-1 focus:ring-[#5420A6]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#5420A6] hover:bg-[#45188d] disabled:opacity-50 text-white dark:text-[#e6e9f7] font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-[#dcdff2] dark:border-[#1d2c4e] w-full" />
          <span className="bg-white dark:bg-[#0e1526] px-3 text-xs text-[#5D6080] dark:text-[#9aa0c4] absolute">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full py-2.5 rounded-xl border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f1f3fa] dark:hover:bg-[#151e36] text-[#06427D] dark:text-[#BBBCE4] font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue with demo account</span>
        </button>

        <div className="text-center text-xs text-[#5D6080] dark:text-[#9aa0c4] pt-1">
          Do not have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[#5420A6] dark:text-[#A9DAF5] font-medium hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
