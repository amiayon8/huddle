import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchPublicProfile,
} from "../../lib/supabase";
import { PublicProfileView } from "../../components/PublicProfileView";
import { ArrowLeft, Sparkles, LogIn, Compass } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const { profile } = await fetchPublicProfile(decodedId);

  if (!profile) {
    return {
      title: "Profile Not Found | Huddle",
      description: "Deliberate practice engineer profile on Huddle.",
    };
  }

  return {
    title: `${profile.name} (${profile.handle}) | Huddle Engineering Profile`,
    description: `${profile.bio || `Explore deliberate practice activity, active focus times, and verified engineering proofs by ${profile.name} on Huddle.`}`,
    openGraph: {
      title: `${profile.name} | Huddle Engineering Profile`,
      description: `Target: ${profile.careerMilestone || "Software Engineer"} • ${profile.streak || 0} Day Practice Streak`,
      images: [profile.avatar || "/avatars/avatar-1.svg"],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const { profile, portfolio, activityDays } = await fetchPublicProfile(decodedId);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mx-auto flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Engineer Profile Not Found
          </h1>
          <p className="text-xs text-zinc-500">
            The profile for "{decodedId}" does not exist or has been removed. Check the handle or explore active peers in Huddle.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/app"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Go to Huddle Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 font-sans transition-colors">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-[#090a0f]/80 border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold tracking-tight text-sm hover:opacity-85 transition-opacity"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight">Huddle</span>
            </Link>

            <span className="text-zinc-300 dark:text-zinc-700">/</span>

            <span className="text-xs text-zinc-500 font-medium truncate">
              {profile.handle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Profile View Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <PublicProfileView
          initialProfile={profile}
          initialActivityDays={activityDays}
          initialPortfolio={portfolio}
          isPublicRoute={true}
        />
      </main>
    </div>
  );
}
