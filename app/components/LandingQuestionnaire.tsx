'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Target, 
  Clock, 
  Zap, 
  Cpu, 
  Layers, 
  Code2, 
  Palette, 
  Bot, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const LandingQuestionnaire: React.FC = () => {
  const { finishOnboarding } = useHuddle();

  const [step, setStep] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState('System Architecture');
  const [experience, setExperience] = useState('Intermediate');
  const [commitment, setCommitment] = useState('20 mins / day');
  const [goal, setGoal] = useState('Build resilient production software');
  const [isFinishing, setIsFinishing] = useState(false);

  const totalSteps = 4;

  const skillOptions = [
    {
      id: 'sys-arch',
      title: 'System Architecture',
      desc: 'Distributed caching, event queues & zero-downtime scaling',
      icon: Cpu,
      badge: 'Popular'
    },
    {
      id: 'next-rsc',
      title: 'Next.js App Router & RSC',
      desc: 'Server components, stream rendering & modern architecture',
      icon: Layers,
      badge: 'Frontend'
    },
    {
      id: 'ts-type-mechanics',
      title: 'TypeScript Type Mechanics',
      desc: 'Mapped types, conditional inference & type-safe DSLs',
      icon: Code2,
      badge: 'Advanced'
    },
    {
      id: 'ui-micro',
      title: 'Product UI & Micro-interactions',
      desc: 'Restrained typography, motion curves & polished UX',
      icon: Palette,
      badge: 'Design'
    },
    {
      id: 'ai-agents',
      title: 'AI Engineering & Agentic Workflows',
      desc: 'Tool calling, prompt chains & deterministic evaluation',
      icon: Bot,
      badge: 'New'
    }
  ];

  const experienceOptions = [
    {
      level: 'Beginner',
      subtitle: 'Starting from fundamentals and core mental models',
      pace: 'Guided walkthroughs and foundational principles'
    },
    {
      level: 'Intermediate',
      subtitle: 'Have built production features, aiming for architectural depth',
      pace: 'High-leverage patterns & practical implementation'
    },
    {
      level: 'Advanced',
      subtitle: 'Technical leadership, performance optimization & trade-offs',
      pace: 'Deep technical analysis & distributed architectures'
    }
  ];

  const commitmentOptions = [
    {
      time: '10 mins / day',
      desc: 'Quick daily mental model check-in',
      label: 'Light'
    },
    {
      time: '20 mins / day',
      desc: 'Actionable lesson plus 1 implementation task',
      label: 'Recommended'
    },
    {
      time: '30+ mins / day',
      desc: 'Deep focus with code blueprints and ADR logs',
      label: 'Deep Focus'
    }
  ];

  const goalOptions = [
    {
      title: 'Build resilient production software',
      desc: 'Master systems that scale under real-world traffic and load',
      icon: Target
    },
    {
      title: 'Prepare for senior engineering role',
      desc: 'Strengthen system design, trade-off communication and depth',
      icon: ShieldCheck
    },
    {
      title: 'Ship personal projects with velocity',
      desc: 'Gain the confidence to architect and ship end-to-end features',
      icon: Zap
    }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      setIsFinishing(true);
      setTimeout(() => {
        finishOnboarding([selectedSkill]);
        setIsFinishing(false);
      }, 500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    finishOnboarding([selectedSkill]);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans transition-colors">
      
      {/* Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            H
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle
            </span>
            <span className="block text-[10.5px] text-zinc-500">
              Deliberate Skill Practice
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Skip to Dashboard →
        </button>
      </header>

      {/* Main Form */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8">
        
        {/* Progress bar */}
        <div className="mb-6 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Craft */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Step 1: Choose Your Craft
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                What skill do you want to master?
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                We'll tailor your daily 1-step learning roadmap around this primary focus.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {skillOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedSkill === opt.title;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSkill(opt.title)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                            {opt.title}
                          </span>
                          <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Step 2: Experience Baseline
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                What is your experience in {selectedSkill}?
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                We'll adjust the depth and technical complexity of your daily guides.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {experienceOptions.map(opt => {
                const isSelected = experience === opt.level;
                return (
                  <button
                    key={opt.level}
                    onClick={() => setExperience(opt.level)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                        {opt.level}
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {opt.subtitle}
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                        • {opt.pace}
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Commitment */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Step 3: Daily Rhythm
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                How much time can you commit daily?
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Consistency beats intensity. Short daily habits prevent skill decay.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {commitmentOptions.map(opt => {
                const isSelected = commitment === opt.time;
                return (
                  <button
                    key={opt.time}
                    onClick={() => setCommitment(opt.time)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {opt.time}
                        </span>
                        <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {opt.label}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Goal */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                Step 4: Target Outcome
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                What is your primary career goal?
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                We'll prioritize relevant capstones and sprint checklists for this goal.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {goalOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = goal === opt.title;
                return (
                  <button
                    key={opt.title}
                    onClick={() => setGoal(opt.title)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {opt.title}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {opt.desc}
                        </div>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1 || isFinishing}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              step === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {isFinishing ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Preparing dashboard...</span>
              </span>
            ) : step === totalSteps ? (
              <>
                <span>Enter Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </main>

      {/* Footer Info */}
      <footer className="max-w-2xl w-full mx-auto text-center text-xs text-zinc-400 py-2">
        <span>A calm, deliberate space for daily engineering mastery.</span>
      </footer>

    </div>
  );
};
