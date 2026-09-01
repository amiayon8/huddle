'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  MessageSquare, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DuolingoMascotProps {
  emotion?: 'idle' | 'encouragement' | 'thinking' | 'deep_thinking' | 'planning' | 'success' | 'error';
  speechText?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showQuickActions?: boolean;
  className?: string;
}

export const DuolingoMascot: React.FC<DuolingoMascotProps> = ({
  emotion = 'encouragement',
  speechText,
  size = 'lg',
  showQuickActions = true,
  className = ''
}) => {
  const { setMascotOpen, sprint, user, reshuffleSprint } = useHuddle();
  const [isBouncing, setIsBouncing] = useState(false);
  const [interactiveEmotion, setInteractiveEmotion] = useState(emotion);

  const mascotMap: Record<string, string> = {
    idle: '/mascot_idle.svg',
    encouragement: '/mascot_encouragement.svg',
    thinking: '/mascot_thinking.svg',
    deep_thinking: '/mascot_deep_thinking.svg',
    planning: '/mascot_planning.svg',
    success: '/mascot_success.svg',
    error: '/mascot_error.svg'
  };

  const handleMascotPoke = () => {
    setIsBouncing(true);
    setInteractiveEmotion('success');

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b']
    });

    setTimeout(() => {
      setIsBouncing(false);
      setInteractiveEmotion(emotion);
    }, 1000);
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-18 h-18 sm:w-20 sm:h-20',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    hero: 'w-28 h-28 sm:w-32 sm:h-32'
  };

  const currentSvg = mascotMap[interactiveEmotion] || mascotMap[emotion] || '/mascot_idle.svg';
  const defaultSpeech = speechText || sprint.mascotNarration || `You're on a **${user.streak}-day streak**. One focused action today keeps skill decay at zero.`;

  return (
    <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 ${className}`}>
      
      {/* Animated Mascot Character */}
      <div 
        onClick={handleMascotPoke}
        className="relative group cursor-pointer shrink-0 flex flex-col items-center select-none"
        title="Tap Pip for encouragement"
      >
        <div className={`relative ${sizeClasses[size]} transition-transform duration-200 ${
          isBouncing ? 'animate-bounce' : 'group-hover:scale-105 group-active:scale-95'
        }`}>
          <img 
            src={currentSvg} 
            alt="Pip Mascot" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Mascot Ground Shadow */}
        <div className="w-12 h-1.5 rounded-full bg-zinc-900/15 dark:bg-black/40 blur-[1px] mt-0.5" />
      </div>

      {/* Speech Balloon with Pointer Tail */}
      <div className="flex-1 w-full relative">
        <div className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2.5">
          
          {/* Speech Bubble Arrow Tail for Desktop (Left) */}
          <div className="hidden sm:block absolute top-5 -left-2.5 w-0 h-0 border-t-[7px] border-t-transparent border-r-[10px] border-r-zinc-200 dark:border-r-zinc-800 border-b-[7px] border-b-transparent" />
          <div className="hidden sm:block absolute top-5 -left-2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[10px] border-r-white dark:border-r-[#111218] border-b-[7px] border-b-transparent" />

          {/* Speech Bubble Header */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Pip Daily Coaching
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-semibold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {user.streak}d streak
              </span>
            </div>

            <button
              onClick={() => setMascotOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Ask Pip</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Markdown & LaTeX Content */}
          <div className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <MarkdownRenderer content={defaultSpeech} />
          </div>

          {/* Quick Action Pills */}
          {showQuickActions && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMascotOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium shadow-xs transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat with AI Mascot</span>
              </button>

              <button
                onClick={() => reshuffleSprint()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-zinc-500" />
                <span>Reshuffle Sprint</span>
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
