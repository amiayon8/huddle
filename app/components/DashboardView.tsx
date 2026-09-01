'use client';

import React from 'react';
import {
  Play,
  Sparkles,
  Users,
  Flame,
  Award,
  Zap,
  Compass,
  User,
  ChevronRight,
  Check,
  RotateCcw,
  Pause,
  FileCode,
  AlertCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { DuolingoMascot } from './DuolingoMascot';

export const DashboardView: React.FC = () => {
  const {
    user,
    sprint,
    squad,
    secondsFocusedToday,
    isTimerRunning,
    isAppFocused,
    toggleFocusTimer,
    setShowBingeQuizModal,
    completeSprintTask,
    reshuffleSprint,
    setActiveTab,
    setMascotOpen
  } = useHuddle();

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}m ${remainderSecs < 10 ? '0' : ''}${remainderSecs}s`;
  };

  const completedSprintTasks = sprint.tasks.filter(t => t.completed).length;
  const sprintProgressPercent = Math.round((completedSprintTasks / sprint.tasks.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12 animate-in fade-in duration-200">

      {/* Top Header & Focus Utilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Focus on today’s deliberate action. No algorithmic scrolling, just steady craft.
          </p>
        </div>

        {/* Focus Run Timer Box */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isAppFocused && isTimerRunning
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300'
            : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-500'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAppFocused && isTimerRunning ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            <div>
              <span className=" text-xs font-semibold">{formatTime(secondsFocusedToday)}</span>
              <span className="text-[10px] text-zinc-500 ml-1.5">
                {isAppFocused && isTimerRunning ? 'Focused' : 'Paused'}
              </span>
            </div>

            <button
              onClick={toggleFocusTimer}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-0.5"
              title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{user.streak}d streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-medium">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>{user.reputation} rep</span>
          </div>
        </div>
      </div>

      {/* Screen-Time Limiter Pause Alert */}
      {!isAppFocused && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Focus timer paused while outside the app. Resumed upon returning.</span>
          </div>
          <button
            onClick={() => setShowBingeQuizModal(true)}
            className="text-[11px] font-semibold underline shrink-0 hover:text-amber-900"
          >
            Take 20m comprehension check →
          </button>
        </div>
      )}

      {/* Active 2-5 Day Sprint Checklist Card */}
      <div className="p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs font-semibold">
                {sprint.durationDays}-Day Sprint
              </span>
              <span className="text-xs text-zinc-500">
                Towards: <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{sprint.careerMilestone}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 pt-1">
              Active Focus: {sprint.skillTitle}
            </h2>
          </div>

          <button
            onClick={() => reshuffleSprint()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 text-xs font-medium transition-colors self-start sm:self-auto"
            title="Reshuffle sprint without penalties"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reshuffle Schedule</span>
          </button>
        </div>

        {/* Progress Task Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Sprint Task Progress</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{sprintProgressPercent}% Complete ({completedSprintTasks}/{sprint.tasks.length})</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${sprintProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Day-by-Day Sprint Tasks */}
        <div className="space-y-2.5 pt-1">
          {sprint.tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${task.completed
                ? 'bg-zinc-50/50 dark:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/80 opacity-75'
                : 'bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/80 shadow-xs'
                }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => completeSprintTask(task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 shrink-0 ${task.completed
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-300 dark:border-zinc-600 hover:border-indigo-600 bg-white dark:bg-zinc-800'
                    }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      Day {task.dayNumber}
                    </span>
                    <h3 className={`font-semibold text-sm text-zinc-900 dark:text-zinc-100 ${task.completed ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 pt-0.5">
                    <div className="flex items-center gap-1">
                      <span>{task.estimatedMinutes}m</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <img src={task.creatorAvatar} alt={task.creatorName} className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span>{task.creatorName}</span>
                    </div>
                    {task.producesArtifact && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                          <FileCode className="w-3 h-3" />
                          Produces artifact
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {!task.completed ? (
                  <button
                    onClick={() => completeSprintTask(task.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Complete Day {task.dayNumber}
                  </button>
                ) : (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Done ({task.completedAt || 'Today'})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bigger Better Duolingo-Style Mascot Coaching */}
      <DuolingoMascot
        emotion="encouragement"
        size="lg"
        showQuickActions={true}
      />

      {/* Micro-Squad Live Activity Strip */}
      <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Micro-Squad Activity Stream
            </h3>
            <p className="text-xs text-zinc-500">
              Private 4-person friend circle. Ticking tasks auto-notifies your squad without leaderboard pressure.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('squad')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
          >
            Squad Hub →
          </button>
        </div>

        <div className="space-y-2">
          {squad.activityPings.slice(0, 3).map(ping => (
            <div
              key={ping.id}
              className="p-2.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={ping.memberAvatar}
                  alt={ping.memberName}
                  className="w-6 h-6 rounded-md object-cover"
                />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {ping.memberName}
                  </span>{' '}
                  <span className="text-zinc-500">
                    {ping.actionText}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                {ping.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Pathways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div
          onClick={() => setActiveTab('profile')}
          className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Career Portfolio & Timeline
              </div>
              <div className="text-xs text-zinc-500">
                Auto-assembled artifacts & proof loops
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
        </div>

        <div
          onClick={() => setActiveTab('creators')}
          className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Explore Vetted Creator Feed
              </div>
              <div className="text-xs text-zinc-500">
                Bite-sized guides & downloadable code
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
        </div>
      </div>

    </div>
  );
};
