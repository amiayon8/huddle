'use client';

import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Award, 
  Calendar, 
  Activity, 
  Lock, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const ProgressView: React.FC = () => {
  const { user, skillsHealth, roadmap } = useHuddle();

  const activityWeeks = Array.from({ length: 16 }, (_, i) => {
    return Array.from({ length: 7 }, (_, j) => {
      const activeScore = ((i * 7 + j) % 5);
      return activeScore;
    });
  });

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Private Learning Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Progress & Consistency
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Detailed skill health metrics and activity heatmaps remain private to you.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          Private View
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {user.streak} days
          </div>
          <p className="text-xs text-zinc-500">
            Max streak: {user.maxStreak} days • 1 streak protection active
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>Reputation Score</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {user.reputation} pts
          </div>
          <p className="text-xs text-zinc-500">
            Earned via completed steps and helpful community replies
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>Total Steps</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            18 steps
          </div>
          <p className="text-xs text-zinc-500">
            Across 4 skill tracks
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            16-Week Consistency Matrix
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Visualization of daily practice sessions without streak anxiety
          </p>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-max">
            {activityWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((level, dIdx) => {
                  const colors = [
                    'bg-zinc-100 dark:bg-zinc-800',
                    'bg-indigo-200 dark:bg-indigo-950',
                    'bg-indigo-400 dark:bg-indigo-800',
                    'bg-indigo-600 dark:bg-indigo-600',
                    'bg-indigo-700 dark:bg-indigo-500'
                  ];
                  return (
                    <div 
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded-sm ${colors[level]} transition-colors`}
                      title={`Week ${wIdx + 1}, Day ${dIdx + 1}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
            <div className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-950" />
            <div className="w-3 h-3 rounded-sm bg-indigo-400 dark:bg-indigo-800" />
            <div className="w-3 h-3 rounded-sm bg-indigo-600 dark:bg-indigo-600" />
          </div>
          <span>More active</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Skill Health Decay Status
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Skills decay slowly over time without practice to encourage periodic maintenance.
          </p>
        </div>

        <div className="space-y-4">
          {skillsHealth.map(sh => (
            <div key={sh.skillId} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {sh.skillTitle}
                  </span>
                  <span className="text-zinc-400 ml-2">({sh.category})</span>
                </div>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  {sh.healthPercent}% Health
                </div>
              </div>

              <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    sh.status === 'optimal' ? 'bg-emerald-500' : sh.status === 'maintaining' ? 'bg-indigo-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${sh.healthPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Decay rate: {sh.decayRate}</span>
                <span>Last practiced: {sh.lastPracticed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Monthly Recap
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          In August, you completed 6 System Architecture steps, reached 2 milestones, and maintained an 88% average health score across your tracks.
        </p>
      </div>

    </div>
  );
};
