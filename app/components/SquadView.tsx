'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  CheckCircle2, 
  Send, 
  UserPlus, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  ShieldAlert,
  Clock,
  Award
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const SquadView: React.FC = () => {
  const { squad, user, checkInSquad, sendSquadNudge } = useHuddle();
  const [encouragementText, setEncouragementText] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentUserMember = squad.members.find(m => m.id === user.id);
  const hasCheckedIn = currentUserMember?.checkedInToday;

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkInSquad(encouragementText || 'Completed today session step!');
    setEncouragementText('');
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(squad.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            Micro-Squad (Intimate 4-Member Group)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {squad.name}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Focus: {squad.skillFocus} • {squad.members.length} / 4 members
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Weekly Squad Goal
            </h3>
            <p className="text-xs text-zinc-500">
              {squad.sharedGoal}
            </p>
          </div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {squad.currentProgress} / {squad.targetProgress} steps
          </div>
        </div>

        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(squad.currentProgress / squad.targetProgress) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
          <span>Target deadline: Sunday</span>
          <span>No competitive leaderboards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Squad Roster & Daily Check-ins
          </h3>

          <div className="space-y-4">
            {squad.members.map(member => (
              <div 
                key={member.id}
                className={`p-5 rounded-3xl border transition-all ${
                  member.checkedInToday 
                    ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900' 
                    : 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-700" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {member.name}
                        </span>
                        <span className="text-xs text-zinc-500">{member.handle}</span>
                        {member.role === 'lead' && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                            Lead
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                          <Flame className="w-3 h-3 fill-amber-500" />
                          {member.streak}d streak
                        </span>
                        <span>•</span>
                        <span>{member.checkedInToday ? `Checked in ${member.lastCheckIn}` : 'Pending today'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {member.checkedInToday ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Checked In
                      </div>
                    ) : member.id === user.id ? (
                      <button
                        onClick={handleCheckInSubmit}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                      >
                        Check In Now
                      </button>
                    ) : (
                      <button
                        onClick={() => sendSquadNudge(member.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors"
                      >
                        Send Nudge
                      </button>
                    )}
                  </div>
                </div>

                {member.recentEncouragement && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>"{member.recentEncouragement}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Daily Check-in Logger
            </h3>
            
            {hasCheckedIn ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Checked in for today
                </div>
                <p>Great job keeping your squad momentum strong!</p>
              </div>
            ) : (
              <form onSubmit={handleCheckInSubmit} className="space-y-3">
                <p className="text-xs text-zinc-500">
                  Share a brief note with your 3 squad peers on what you practiced today.
                </p>
                <textarea
                  rows={3}
                  value={encouragementText}
                  onChange={e => setEncouragementText(e.target.value)}
                  placeholder="e.g. Completed step 3 on Event-Driven Architecture..."
                  className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Log Check-in
                </button>
              </form>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Squad Design Philosophy
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Huddle squads are limited to 4 members so everyone feels visible without performance anxiety.
            </p>
          </div>
        </div>

      </div>

      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Invite Squad Member
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Share this invite code with a colleague or friend learning System Architecture.
            </p>

            <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              <span>{squad.inviteCode}</span>
              <button
                onClick={handleCopyInvite}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setInviteModalOpen(false)}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
