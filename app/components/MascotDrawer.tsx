'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  X,
  ArrowRight,
  Zap,
  RotateCcw,
  CheckCircle2,
  Send,
  Target,
  Bot
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { MarkdownRenderer } from './MarkdownRenderer';

export const MascotDrawer: React.FC = () => {
  const {
    mascotOpen,
    setMascotOpen,
    sprint,
    reshuffleSprint,
    user
  } = useHuddle();

  const [chatInput, setChatInput] = useState('');
  const [currentMascotEmotion, setCurrentMascotEmotion] = useState<string>('idle');
  const [messages, setMessages] = useState<Array<{ sender: 'pip' | 'user'; text: string; mascotSvg?: string }>>([
    {
      sender: 'pip',
      text: `Hey **${user.name.split(' ')[0]}**! Pip here.\n\nYou're working towards **${user.careerMilestone}**. I structured your 4-day sprint from Elena Rostova's vetted guides.\n\nAsk me any concept questions with mathematical notation (e.g. $O(\\log N)$ or algorithm complexity), or request a 0-penalty sprint reshuffle.`,
      mascotSvg: '/mascot_idle.svg'
    },
    {
      sender: 'pip',
      text: `You hit **80%** of your practice targets this week.\n\n> *“Consistency beats intensity every single time.”*\n\nHow can I help you today?`,
      mascotSvg: '/mascot_encouragement.svg'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!mascotOpen) return null;

  const mascotMap: Record<string, string> = {
    idle: '/mascot_idle.svg',
    encouragement: '/mascot_encouragement.svg',
    thinking: '/mascot_thinking.svg',
    deep_thinking: '/mascot_deep_thinking.svg',
    planning: '/mascot_planning.svg',
    success: '/mascot_success.svg',
    error: '/mascot_error.svg'
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isThinking) return;

    const userText = chatInput.trim();
    const updatedMessages = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setChatInput('');
    setIsThinking(true);
    setCurrentMascotEmotion('deep_thinking');

    try {
      const res = await fetch('/api/mascot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: user,
          sprintContext: sprint
        })
      });

      if (res.ok) {
        const data = await res.json();
        const emotionSvg = data.mascotSvg || '/mascot_encouragement.svg';

        if (emotionSvg.includes('success')) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 }
          });
        }

        setMessages(prev => [
          ...prev,
          {
            sender: 'pip',
            text: data.reply,
            mascotSvg: emotionSvg
          }
        ]);

        setCurrentMascotEmotion(
          emotionSvg.includes('planning') ? 'planning' :
            emotionSvg.includes('success') ? 'success' :
              emotionSvg.includes('deep') ? 'deep_thinking' : 'encouragement'
        );

        if (userText.toLowerCase().includes('reshuffle') || userText.toLowerCase().includes('busy') || userText.toLowerCase().includes('missed')) {
          reshuffleSprint(userText);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'pip',
          text: `I've got your back! Consistency beats intensity. Let's focus on **Day ${sprint.currentDay}** of your **${sprint.skillTitle}** sprint.`,
          mascotSvg: '/mascot_encouragement.svg'
        }
      ]);
      setCurrentMascotEmotion('encouragement');
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickReshuffle = () => {
    reshuffleSprint();
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 }
    });
    setMessages(prev => [
      ...prev,
      {
        sender: 'pip',
        text: 'Sprint reshuffled smoothly with **zero penalties**! Pick up Day 1 whenever you are ready.',
        mascotSvg: '/mascot_planning.svg'
      }
    ]);
    setCurrentMascotEmotion('planning');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">

      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setMascotOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full sm:w-[460px] bg-white dark:bg-[#0c0d12] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={mascotMap[currentMascotEmotion] || '/mascot_idle.svg'}
              alt="Pip Mascot"
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Pip AI Mascot
                </h3>
              </div>
              <p className="text-[11px] text-zinc-500">
                Sprint companion & concept tutor
              </p>
            </div>
          </div>

          <button
            onClick={() => setMascotOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-[13px]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'pip' && (
                <div className="shrink-0 pt-0.5">
                  <img
                    src={m.mascotSvg || '/mascot_idle.svg'}
                    alt="Pip"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              )}

              <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 rounded-bl-xs border border-zinc-200/60 dark:border-zinc-700/60'
                }`}>
                {m.sender === 'user' ? (
                  <span>{m.text}</span>
                ) : (
                  <MarkdownRenderer content={m.text} />
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2.5 text-zinc-500 text-xs py-2 pl-1">
              <img src="/mascot_deep_thinking.svg" alt="Thinking" className="w-7 h-7 object-contain animate-bounce" />
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-xs animate-pulse">
                Pip is formulating response...
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Input */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2.5">

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar">
            <button
              onClick={handleQuickReshuffle}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-indigo-500 transition-colors shrink-0 shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-indigo-500" />
              Reshuffle Sprint
            </button>

            <button
              onClick={() => setChatInput('Explain algorithm complexity using LaTeX formulas')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-indigo-500 transition-colors shrink-0 shadow-2xs"
            >
              <Zap className="w-3 h-3 text-indigo-500" />
              LaTeX Formula Demo
            </button>

            <button
              onClick={() => setChatInput('How does today step connect to my career milestone?')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-indigo-500 transition-colors shrink-0 shadow-2xs"
            >
              <Target className="w-3 h-3 text-indigo-500" />
              Career Goal
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Pip anything (LaTeX & Markdown enabled)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isThinking}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isThinking}
              className="p-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
