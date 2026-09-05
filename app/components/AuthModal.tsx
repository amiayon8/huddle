'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Check, ShieldCheck, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { signInUser, signUpUser, resetPasswordUser } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, authMode, setOnboardingActive, updateUserProfile, loginDemo } = useHuddle();
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup' | 'forgot'>(authMode || 'welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user, error } = await signUpUser(email, password, fullName);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        if (user) {
          updateUserProfile({ name: fullName || 'New Engineer', email });
          setSuccessMessage('Account created successfully!');
          setTimeout(() => {
            closeAuthModal();
            setOnboardingActive(true);
            setLoading(false);
          }, 600);
        }
      } else if (mode === 'login') {
        const { user, error } = await signInUser(email, password);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        if (user) {
          setSuccessMessage('Logged in successfully!');
          setTimeout(() => {
            closeAuthModal();
            setLoading(false);
          }, 600);
        }
      } else if (mode === 'forgot') {
        const res = await resetPasswordUser(email);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to dispatch password reset email.');
          setLoading(false);
          return;
        }
        setSuccessMessage(`Password reset instructions sent to ${email}`);
        setTimeout(() => {
          setMode('login');
          setLoading(false);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemo();
      setSuccessMessage('Logged in as Demo Engineer!');
      setTimeout(() => {
        closeAuthModal();
        setLoading(false);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to login demo account.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-5 sm:p-7 transition-colors">

        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 p-1 flex items-center justify-center shrink-0">
            <img src="/mascot_encouragement.svg" alt="Pip" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle • Pip Companion
            </h2>
            <p className="text-xs text-zinc-500">
              Deliberate practice with zero doomscrolling
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

        {mode === 'welcome' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Authentication
              </div>
              <p className="text-zinc-500 leading-relaxed">
                Sign up with your email to sync your 2–5 day sprints, private portfolio artifacts, and micro-squad accountability.
              </p>
            </div>

            <button
              onClick={() => setMode('signup')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMode('login')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs font-medium transition-colors"
            >
              <span>Log in with existing account</span>
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full py-2 flex items-center justify-center gap-2 text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <img src="/mascot_idle.svg" alt="Pip" className="w-4 h-4 object-contain" />
              <span>Continue as Demo Engineer</span>
            </button>
          </div>
        )}

        {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h3>

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'signup' ? (
                'Sign Up & Start Practice'
              ) : (
                'Log In'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode(mode === 'signup' ? 'login' : 'signup');
              }}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 pt-1"
            >
              {mode === 'signup' ? 'Already have an account? Log in' : 'Need an account? Sign up'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Reset Password
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Enter your account email to receive a password reset link.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 pt-1"
            >
              Back to log in
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
