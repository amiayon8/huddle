'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  ExternalLink,
  Sparkles,
  Check,
  Play,
  FileText,
  ListChecks,
  Award,
  Download
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';

export const StepDetailModal: React.FC = () => {
  const { selectedStepModal, setSelectedStepModal, completeStep } = useHuddle();
  const [completedChecklist, setCompletedChecklist] = useState<string[]>([]);
  const [stepCompleted, setStepCompleted] = useState(false);

  if (!selectedStepModal) return null;

  const step = selectedStepModal;

  const toggleCheckitem = (id: string) => {
    setCompletedChecklist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinishStep = () => {
    setStepCompleted(true);
    completeStep(step.id);
    setTimeout(() => {
      setSelectedStepModal(null);
      setStepCompleted(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Step {step.stepNumber} • {step.type}
          </div>

          <button
            onClick={() => setSelectedStepModal(null)}
            className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {step.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{step.estimatedMinutes} mins estimated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={step.creatorAvatar} alt={step.creatorName} className="w-4 h-4 rounded-full object-cover" />
              <span>Curated by {step.creatorName}</span>
            </div>
          </div>

          {step.contentMarkdown && (
            <div className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 space-y-3 leading-relaxed">
              <div className=" text-xs whitespace-pre-wrap">
                {step.contentMarkdown}
              </div>
            </div>
          )}

          {step.checklistItems && step.checklistItems.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-indigo-500" />
                Actionable Tasks
              </div>

              <div className="space-y-2">
                {step.checklistItems.map(item => {
                  const checked = item.completed || completedChecklist.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheckitem(item.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${checked
                          ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200'
                        }`}
                    >
                      <span>{item.text}</span>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 dark:border-zinc-600'
                        }`}>
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step.resourceUrl && (
            <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-semibold">
                <Download className="w-4 h-4 text-indigo-500" />
                Attached Code Resource Repository
              </div>
              <a
                href={step.resourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open Github <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={() => setSelectedStepModal(null)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Close
          </button>

          <button
            onClick={handleFinishStep}
            disabled={stepCompleted}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            {stepCompleted ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Step Finished (+25 rep)
              </span>
            ) : (
              'Complete This Step'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
