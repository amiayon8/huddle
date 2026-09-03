"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, X, Award } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { fetchBingeQuiz } from "../lib/supabase";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const resolveSkillKey = (skillTitle: string): string => {
  const lower = skillTitle.toLowerCase();
  if (lower.includes("next") || lower.includes("react") || lower.includes("front")) {
    return "next-rsc";
  }
  if (lower.includes("type") || lower.includes("ts")) {
    return "ts-types";
  }
  if (lower.includes("ui") || lower.includes("design") || lower.includes("product")) {
    return "ui-micro";
  }
  return "sys-arch";
};

const buildFallbackQuiz = (skillTitle: string, taskTitle?: string): QuizQuestion => {
  if (skillTitle.toLowerCase().includes("next") || skillTitle.toLowerCase().includes("front")) {
    return {
      question: "Why do React Server Components improve application performance?",
      options: [
        "They render only on the client browser using WebSockets",
        "They execute purely on the server, keeping server-only code and heavy dependencies out of the client bundle",
        "They bypass the HTTP protocol completely",
        "They convert all JavaScript into static assembly bytecode"
      ],
      correctIndex: 1,
      explanation: "Server Components execute on the server and stream serialized UI to the browser, reducing JavaScript bundle size and speeding up page load times."
    };
  }

  if (skillTitle.toLowerCase().includes("type")) {
    return {
      question: "What is the primary utility of conditional types and the infer keyword in TypeScript?",
      options: [
        "To compile code faster by skipping type checks",
        "To extract and pattern-match types dynamically within type expressions",
        "To execute runtime assertions during browser rendering",
        "To replace standard JavaScript if-else statements"
      ],
      correctIndex: 1,
      explanation: "The infer keyword introduces a type variable within the true branch of a conditional type, enabling type extraction like ReturnType or Parameters."
    };
  }

  if (skillTitle.toLowerCase().includes("ui") || skillTitle.toLowerCase().includes("product")) {
    return {
      question: "Which CSS properties should be animated to achieve 60fps without layout recalculations?",
      options: [
        "width, height, and margin",
        "top, left, and padding",
        "transform and opacity",
        "display, visibility, and border"
      ],
      correctIndex: 2,
      explanation: "Transform and opacity can be composited directly on the GPU without triggering layout reflow or repaint cycles."
    };
  }

  const topic = taskTitle || skillTitle;
  return {
    question: `In professional engineering, what is the primary goal of practicing "${topic}"?`,
    options: [
      "To memorize syntax without understanding system tradeoffs",
      "To build production-grade, predictable solutions with minimal technical debt",
      "To avoid writing tests or architectural documentation",
      "To rely exclusively on default configuration templates"
    ],
    correctIndex: 1,
    explanation: "Deliberate practice focuses on building robust production architecture with clear tradeoffs and maintainable implementations."
  };
};

export const BingeQuizModal: React.FC = () => {
  const { showBingeQuizModal, setShowBingeQuizModal, ensureSurveyDone, sprint } =
    useHuddle();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeTask = sprint.tasks.find((t) => !t.completed) || sprint.tasks[0];
  const initialFallback = buildFallbackQuiz(sprint.skillTitle, activeTask?.title);

  const [quizData, setQuizData] = useState<QuizQuestion>(initialFallback);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const quizMap = await fetchBingeQuiz();
        const skillKey = resolveSkillKey(sprint.skillTitle);
        if (quizMap[skillKey]) {
          setQuizData(quizMap[skillKey]);
        } else {
          setQuizData(buildFallbackQuiz(sprint.skillTitle, activeTask?.title));
        }
      } catch {
        setQuizData(buildFallbackQuiz(sprint.skillTitle, activeTask?.title));
      }
    }

    if (showBingeQuizModal) {
      loadQuiz();
    }
  }, [showBingeQuizModal, sprint.skillTitle, activeTask?.title]);

  if (!showBingeQuizModal) return null;

  const quiz = quizData;

  const handleSubmit = () => {
    if (!ensureSurveyDone("verify quiz answers")) return;
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
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 p-1 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
              <img
                src={
                  !submitted
                    ? "/mascot_thinking.svg"
                    : isCorrect
                      ? "/mascot_success.svg"
                      : "/mascot_encouragement.svg"
                }
                alt="Pip"
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10.5px] font-medium">
                <Clock className="w-3 h-3" />
                <span>Concept check</span>
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                Quick check
              </h3>
              <p className="text-xs text-zinc-500">
                {sprint.skillTitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
            {quiz.question}
          </div>

          <div className="space-y-2">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle =
                "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300";

              if (submitted) {
                if (idx === quiz.correctIndex) {
                  optionStyle =
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold";
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300";
                }
              } else if (isSelected) {
                optionStyle =
                  "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-zinc-900 dark:text-zinc-100 font-semibold";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedOption(idx)}
                  disabled={submitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
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
            <div
              className={`p-3 rounded-xl text-xs space-y-1 ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                  : "bg-indigo-50 dark:bg-indigo-950/30 text-zinc-800 dark:text-zinc-200 border border-indigo-200 dark:border-indigo-900/50"
              }`}
            >
              <div className="font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isCorrect ? "Correct" : "Concept review"}</span>
              </div>
              <p className="leading-relaxed text-[11.5px]">{quiz.explanation}</p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-end gap-2.5">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedOption !== null
                  ? "bg-indigo-600 text-white shadow-xs hover:bg-indigo-700"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
