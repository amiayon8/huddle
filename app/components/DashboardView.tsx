'use client';

import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Activity, 
  Flame, 
  Award, 
  Clock, 
  BookOpen, 
  Zap, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { JourneyStep, CreatorProfile } from '../types/huddle';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    skillsHealth, 
    roadmap, 
    squad, 
    posts, 
    creators, 
    setActiveTab, 
    setSelectedStepModal,
    setSelectedCreatorModal,
    checkInSquad,
    completeStep
  } = useHuddle();

  const currentStep = roadmap.steps.find(s => s.status === 'current') || roadmap.steps[2];

  const handleStartNextStep = () => {
    setSelectedStepModal(currentStep);
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Your squad has been active today. Let us take your next step.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{user.streak} day streak</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>{user.reputation} rep</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              What to do next
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              {currentStep.title}
            </h2>
            
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>{currentStep.estimatedMinutes} mins estimated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span className="capitalize">{currentStep.type} guide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <img 
                  src={currentStep.creatorAvatar} 
                  alt={currentStep.creatorName} 
                  className="w-4 h-4 rounded-full object-cover" 
                />
                <span>By {currentStep.creatorName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleStartNextStep}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              Take the next step
            </button>

            <button
              onClick={() => setActiveTab('journey')}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-sm font-medium transition-colors"
            >
              View Roadmap
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
              Pip Mascot Note
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
              Nice work. You are on a 5-day streak. Your Event-Driven Architecture session is concise and actionable today.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartNextStep}
          className="self-start sm:self-auto text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
        >
          Start 18m session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Skill Health
                </h3>
                <p className="text-xs text-zinc-500">
                  Decay protection based on recent practice frequency
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('progress')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Detailed analytics
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {skillsHealth.map(sh => (
                <div key={sh.skillId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {sh.skillTitle}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[11px]">
                        Last: {sh.lastPracticed}
                      </span>
                      <span className={`font-semibold ${
                        sh.status === 'optimal' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : sh.status === 'maintaining' 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {sh.healthPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        sh.status === 'optimal' 
                          ? 'bg-emerald-500' 
                          : sh.status === 'maintaining' 
                          ? 'bg-indigo-600' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${sh.healthPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Recent Creator Resources
                </h3>
                <p className="text-xs text-zinc-500">
                  Guides and blueprints from creators you follow
                </p>
              </div>
              <button
                onClick={() => setActiveTab('creators')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Browse all
              </button>
            </div>

            <div className="space-y-3">
              {creators[0].pinnedResources.map(res => (
                <div 
                  key={res.id}
                  onClick={() => setSelectedCreatorModal(creators[0])}
                  className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Elena Rostova • {res.duration}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-8">
          
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {squad.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  {squad.members.length} / 4 members intimate squad
                </p>
              </div>
              <button
                onClick={() => setActiveTab('squad')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Squad Hub
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-600 dark:text-zinc-400">Weekly Squad Goal</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {squad.currentProgress} / {squad.targetProgress} steps
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${(squad.currentProgress / squad.targetProgress) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {squad.members.map(m => (
                <div key={m.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={m.avatar} 
                      alt={m.name} 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {m.checkedInToday ? 'Checked in today' : 'Pending check-in'}
                      </div>
                    </div>
                  </div>

                  {m.id === user.id ? (
                    <button
                      onClick={() => checkInSquad('Completed Today Step!')}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-semibold"
                    >
                      Checked In
                    </button>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.checkedInToday 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {m.streak}d streak
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Daily Achievements
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Squad Check-in Completed
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Maintained team accountability
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                <div className="w-5 h-5 rounded-full border-2 border-indigo-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Finish Step 3: Event-Driven Patterns
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    18 minute estimated practice
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
