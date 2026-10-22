"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Check,
  Video,
  Award,
  ChevronLeft,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { SprintTask, PracticeKnowledgeQuestion } from "../types/huddle";
import {
  getVideoLessonForTask,
  getKnowledgeCheckForTask,
} from "../lib/practiceCourseContent";

interface SprintTaskModalProps {
  task: SprintTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SprintTaskModal: React.FC<SprintTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { completeSprintTask, sprint, user } = useHuddle();
  const [stage, setStage] = useState<"video" | "test">("video");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStage("video");
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setHasAnswered(false);
      setCorrectAnswersCount(0);
      setTestFinished(false);
      setIsSubmitting(false);
    }
  }, [isOpen, task?.id]);

  const skillTitle =
    sprint?.skillTitle || user?.surveyData?.skill || "System Architecture";

  const videoLesson = useMemo(() => {
    if (!task) return null;
    return getVideoLessonForTask(skillTitle, task.dayNumber);
  }, [skillTitle, task]);

  const questions: PracticeKnowledgeQuestion[] = useMemo(() => {
    if (!task) return [];
    const retrieved = getKnowledgeCheckForTask(skillTitle, task.dayNumber);
    if (retrieved && retrieved.length > 0) {
      return retrieved;
    }
    return [
      {
        id: "q-fallback-1",
        question: `What is the key takeaway from the ${task.title} lesson?`,
        options: [
          "Apply isolated components with bounded consistency and clear boundaries.",
          "Couple all layers directly together without interface contracts.",
          "Disable automated regression suites in production pipelines.",
          "Bypass storage caching layers entirely under heavy concurrent load.",
        ],
        correctIndex: 0,
        explanation:
          "Production systems maintain strict separation of concerns, robust isolation, and deterministic contracts between layers.",
      },
    ];
  }, [skillTitle, task]);

  if (!isOpen || !task || !videoLesson) return null;

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setTestFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectAnswersCount(0);
    setTestFinished(false);
  };

  const handleCompleteExercise = () => {
    setIsSubmitting(true);
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((module) => {
        const confettiFn = module.default;
        confettiFn({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      });
    }

    completeSprintTask(
      task.id,
      undefined,
      "Completed video lesson and verified knowledge check.",
      "Video watched and test passed.",
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/50 dark:border-indigo-800/50">
              Lesson {task.dayNumber}
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 text-[11px] font-semibold">
              <button
                onClick={() => setStage("video")}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  stage === "video"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 "
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>1. Video</span>
              </button>
              <button
                onClick={() => setStage("test")}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  stage === "test"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Test</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{videoLesson.durationMinutes} min</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-zinc-800 dark:text-zinc-200 flex-1">
          {stage === "video" ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {videoLesson.title}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Watch the masterclass breakdown before testing your
                  understanding.
                </p>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800 shadow-inner">
                {videoLesson.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoLesson.youtubeId}?rel=0&modestbranding=1`}
                    title={videoLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950 text-zinc-300">
                    <Video className="w-12 h-12 text-indigo-400 mb-3" />
                    <p className="font-semibold text-sm">{videoLesson.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {videoLesson.durationMinutes} minutes instruction
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={videoLesson.instructorAvatar}
                    alt={videoLesson.instructorName}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {videoLesson.instructorName}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {videoLesson.instructorTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                    Duration
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {videoLesson.durationMinutes} minutes
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {!testFinished ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Knowledge Test
                      </span>
                      <h3 className="text-xs text-zinc-500 dark:text-zinc-400">
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                      </h3>
                    </div>
                    <div className="w-28 sm:w-36 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
                    <p className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;

                      let optionCardClass =
                        "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-indigo-400 dark:hover:border-indigo-600";
                      let badgeClass =
                        "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300";

                      if (hasAnswered) {
                        if (isCorrect) {
                          optionCardClass =
                            "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100";
                          badgeClass = "bg-emerald-600 text-white";
                        } else if (isSelected && !isCorrect) {
                          optionCardClass =
                            "border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100";
                          badgeClass = "bg-rose-600 text-white";
                        } else {
                          optionCardClass =
                            "border-zinc-200 dark:border-zinc-800 opacity-50";
                        }
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${optionCardClass}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeClass}`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium leading-snug flex-1">
                            {option}
                          </span>
                          {hasAnswered && isCorrect && (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[3]" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1 animate-in fade-in duration-150">
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                        Explanation
                      </span>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-zinc-950 dark:text-white">
                      Test Completed
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                      You answered {correctAnswersCount} out of{" "}
                      {questions.length} questions correctly.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                    <span>Mastery Verified</span>
                    <span>+20 XP</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/60 dark:bg-zinc-900/40 shrink-0">
          {stage === "video" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => setStage("test")}
                className="duo-button-primary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <span>Continue to Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStage("video")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Review Video</span>
              </button>

              {!testFinished ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={!hasAnswered}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    hasAnswered
                      ? "duo-button-primary shadow-sm"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {isLastQuestion ? "View Test Results" : "Next Question"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRetakeTest}
                    className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  <button
                    onClick={handleCompleteExercise}
                    disabled={isSubmitting}
                    className="duo-button-success px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Completing..."
                        : "Complete Exercise (+20 XP)"}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
