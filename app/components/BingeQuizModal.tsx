'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  X
} from 'lucide-react';
import { useHuddle } from '../context/HuddleContext';
import { sampleBingeQuiz } from '../data/initialData';

export const BingeQuizModal: React.FC = () => {
  const { showBingeQuizModal, setShowBingeQuizModal } = useHuddle();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!showBingeQuizModal) return null;

  const quiz = sampleBingeQuiz['sys-arch'] || {
    question: 'How do atomic Lua scripts in Redis protect against cache stampedes?',
    options: [
      'By allocating more network memory',
      'By running atomically in a single thread without race condition interleaving',
      'By removing query timeouts',
      'By compressing binary logs'
    ],
    correctIndex: 1,
    explanation: 'Redis executes Lua scripts atomically, guaranteeing no other write operation can slip between read and update steps.'
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    setShowBingeQuizModal(false);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const isCorrect = selectedOption === quiz.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/mascot_thinking.svg" 
              alt="Pip Mascot" 
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                <Clock className="w-3 h-3" />
                20-Min Check-in
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
                Mindful Check-in with Pip
              </h3>
              <p className="text-xs text-zinc-500">
                Testing your intake on today's core concept
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
            {quiz.question}
          </div>

          <div className="space-y-2">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300';
              
              if (submitted) {
                if (idx === quiz.correctIndex) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-zinc-900 dark:text-zinc-100 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedOption(idx)}
                  disabled={submitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {submitted && idx === quiz.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  )}
                  {submitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 animate-in fade-in duration-150 ${
              isCorrect 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                : 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-300'
            }`}>
              <div className="font-semibold flex items-center gap-1.5">
                <img 
                  src={isCorrect ? '/mascot_success.svg' : '/mascot_encouragement.svg'} 
                  alt="Pip" 
                  className="w-4 h-4 object-contain inline-block"
                />
                <span>{isCorrect ? 'Correct! Real mastery unlocked.' : 'Good try! Here is how it works:'}</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {quiz.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Focus session logged
          </span>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Verify Answer
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
