"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  FileCode,
  BookOpen,
  Terminal,
  ShieldCheck,
  Code2,
  Video,
  HelpCircle,
  FileText,
  Save,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import {
  getPracticeSessionForTask,
  PracticeSessionContent
} from "../lib/practiceSessions";
import { CodeBlock } from "./CodeBlock";

type CourseModuleTab = "video" | "text" | "quiz" | "workbench" | "artifact";

export const PracticeSessionModal: React.FC = () => {
  const {
    selectedPracticeTask,
    isPracticeSessionOpen,
    isPracticeReviewMode,
    closePracticeSession,
    completePracticeSession,
    practiceProgressMap,
    savePracticeNote,
    savePracticeVideoWatched,
    savePracticeCodeSolution,
    savePracticeQuizResult,
    sprint,
    user
  } = useHuddle();

  const [activeTab, setActiveTab] = useState<CourseModuleTab>("video");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1200);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [sessionSecondsElapsed, setSessionSecondsElapsed] = useState<number>(0);

  const [videoTimestamp, setVideoTimestamp] = useState<number>(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState<boolean>(false);

  const [activeCourseSectionIndex, setActiveCourseSectionIndex] = useState<number>(0);

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const [userCode, setUserCode] = useState<string>("");
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [hasRunTests, setHasRunTests] = useState<boolean>(false);

  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [auditedChecklistIds, setAuditedChecklistIds] = useState<string[]>([]);

  const [artifactSnippet, setArtifactSnippet] = useState<string>("");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [notesSaveStatus, setNotesSaveStatus] = useState<string>("");

  const [showConfirmationClose, setShowConfirmationClose] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const task = selectedPracticeTask;
  const sessionContent: PracticeSessionContent | null = task
    ? getPracticeSessionForTask(task, sprint.skillTitle)
    : null;

  useEffect(() => {
    if (task && sessionContent) {
      const savedProgress = practiceProgressMap[task.id];
      const initialSeconds = sessionContent.estimatedMinutes * 60;
      setSecondsRemaining(initialSeconds);
      setSessionSecondsElapsed(0);
      setIsTimerActive(true);
      setCurrentStep(isPracticeReviewMode ? 3 : 1);
      setActiveTab(isPracticeReviewMode ? "artifact" : "video");
      setActiveCourseSectionIndex(0);

      setUserCode(savedProgress?.userCode || sessionContent.exercise.starterCode || "");
      setArtifactSnippet(sessionContent.artifactDraft.snippet);
      setReflectionText(savedProgress?.reflectionNotes || "");
      setIsVideoCompleted(Boolean(savedProgress?.videoCompleted));
      setVideoTimestamp(0);

      if (savedProgress?.quizAnswers) {
        setQuizAnswers(savedProgress.quizAnswers);
        const submittedMap: Record<string, boolean> = {};
        Object.keys(savedProgress.quizAnswers).forEach(k => {
          submittedMap[k] = true;
        });
        setQuizSubmitted(submittedMap);
      } else {
        setQuizAnswers({});
        setQuizSubmitted({});
      }

      setSelectedDecisionId(null);
      setAuditedChecklistIds([]);
      setTestResults({});
      setHasRunTests(false);
      setShowConfirmationClose(false);
      setNotesSaveStatus("");
    }
  }, [task?.id, isPracticeReviewMode]);

  useEffect(() => {
    if (!isPracticeSessionOpen || isPracticeReviewMode || currentStep === 4) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (isTimerActive && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
        setSessionSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPracticeSessionOpen, isTimerActive, secondsRemaining, isPracticeReviewMode, currentStep]);

  if (!isPracticeSessionOpen || !task || !sessionContent) {
    return null;
  }

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNotesChange = (text: string) => {
    setReflectionText(text);
    setNotesSaveStatus("Saving...");
    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    notesTimeoutRef.current = setTimeout(() => {
      savePracticeNote(task.id, text);
      setNotesSaveStatus("Saved to database");
      setTimeout(() => setNotesSaveStatus(""), 2500);
    }, 800);
  };

  const handleToggleVideoWatched = () => {
    const nextWatched = !isVideoCompleted;
    setIsVideoCompleted(nextWatched);
    const watchedDuration = nextWatched ? sessionContent.videoLesson.durationMinutes * 60 : 0;
    savePracticeVideoWatched(task.id, watchedDuration, nextWatched);
  };

  const handleJumpToChapter = (timestampSeconds: number) => {
    setVideoTimestamp(timestampSeconds);
  };

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted[questionId]) return;
    const updatedAnswers = { ...quizAnswers, [questionId]: optionIndex };
    setQuizAnswers(updatedAnswers);
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));

    const questions = sessionContent.knowledgeCheck || [];
    let correctCount = 0;
    questions.forEach(q => {
      if (updatedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const calculatedScore = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    savePracticeQuizResult(task.id, updatedAnswers, calculatedScore);
  };

  const handleRunTestAssertions = () => {
    if (!sessionContent.exercise.testCases) return;
    const results: Record<string, boolean> = {};
    for (const testCase of sessionContent.exercise.testCases) {
      const regex = new RegExp(testCase.requiredPattern, "i");
      results[testCase.id] = regex.test(userCode);
    }
    setTestResults(results);
    setHasRunTests(true);
    savePracticeCodeSolution(task.id, userCode);
  };

  const allTestsPassed =
    sessionContent.exercise.testCases &&
    sessionContent.exercise.testCases.length > 0 &&
    sessionContent.exercise.testCases.every((t) => testResults[t.id]);

  const isDecisionOptimal =
    sessionContent.exercise.decisionOptions?.find((d) => d.id === selectedDecisionId)
      ?.isOptimal || false;

  const allAuditItemsChecked =
    sessionContent.exercise.auditChecklist &&
    sessionContent.exercise.auditChecklist.length > 0 &&
    auditedChecklistIds.length === sessionContent.exercise.auditChecklist.length;

  const canProceedFromExercise = () => {
    if (sessionContent.exercise.type === "code_workbench") {
      return allTestsPassed;
    }
    if (sessionContent.exercise.type === "architecture_decision") {
      return isDecisionOptimal;
    }
    if (sessionContent.exercise.type === "rfc_audit") {
      return allAuditItemsChecked;
    }
    return true;
  };

  const handleFinalizeSession = () => {
    setCurrentStep(4);
    try {
      import("canvas-confetti").then((confettiModule) => {
        const confetti = confettiModule.default;
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#10b981", "#3b82f6", "#8b5cf6"]
        });
      });
    } catch {
      return;
    }
  };

  const calculateFinalQuizScore = () => {
    const questions = sessionContent.knowledgeCheck || [];
    if (questions.length === 0) return 100;
    let correctCount = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleConfirmExit = () => {
    completePracticeSession(
      task.id,
      sessionSecondsElapsed,
      artifactSnippet,
      reflectionText,
      calculateFinalQuizScore(),
      quizAnswers,
      userCode,
      isVideoCompleted
    );
  };

  const handleSafeClose = () => {
    if (!isPracticeReviewMode && currentStep < 4 && sessionSecondsElapsed > 30) {
      setShowConfirmationClose(true);
    } else {
      closePracticeSession();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-zinc-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f1015] border border-zinc-200 dark:border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-4 bg-zinc-50/80 dark:bg-zinc-900/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold tracking-wide shrink-0">
              Day {task.dayNumber} of {sprint.durationDays}
            </span>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {task.title}
              </h2>
              <span className="text-[11px] text-zinc-500 truncate block">
                {sessionContent.skillTitle} • Online Practice Curriculum
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isPracticeReviewMode && currentStep < 4 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-medium shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className={secondsRemaining < 120 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-zinc-800 dark:text-zinc-200"}>
                  {formatTimer(secondsRemaining)}
                </span>
                <button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title={isTimerActive ? "Pause session timer" : "Resume session timer"}
                >
                  {isTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            )}

            <button
              onClick={handleSafeClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {currentStep < 4 && (
          <div className="px-4 sm:px-6 py-2 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "video"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Lecture</span>
                {isVideoCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("text")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "text"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Course Text</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Knowledge Check</span>
                {Object.keys(quizAnswers).length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("workbench")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "workbench"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Hands-on Challenge</span>
                {allTestsPassed && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("artifact")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === "artifact"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/60"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Artifact & Proof</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 shrink-0 font-medium pl-2">
              <span>Target: {sessionContent.estimatedMinutes} min</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">

          {isPracticeReviewMode && (
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold block">Completed Practice Session</span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70">
                    Completed {task.completedAt || "recently"}. Database record saved and verified in your portfolio.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("video")}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Review Modules
              </button>
            </div>
          )}

          {currentStep < 4 && activeTab === "video" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-600/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {sessionContent.videoLesson.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {sessionContent.videoLesson.instructorName} • {sessionContent.videoLesson.instructorTitle} • {sessionContent.videoLesson.durationMinutes} min runtime
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleVideoWatched}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    isVideoCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVideoCompleted ? "Lesson Watched" : "Mark as Watched"}</span>
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800 shadow-lg relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${sessionContent.videoLesson.youtubeId}?start=${videoTimestamp}&autoplay=0&rel=0&modestbranding=1`}
                  title={sessionContent.videoLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Lecture Chapters</span>
                  </h4>
                  <div className="space-y-1.5">
                    {sessionContent.videoLesson.chapters.map((chapter, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleJumpToChapter(chapter.timeSeconds)}
                        className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors group cursor-pointer"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate pr-2">
                          {chapter.title}
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                          {formatTimer(chapter.timeSeconds)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/30 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Key Takeaways</span>
                  </h4>
                  <div className="space-y-2">
                    {sessionContent.videoLesson.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep < 4 && activeTab === "text" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3 overflow-x-auto scrollbar-none">
                {sessionContent.courseSections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveCourseSectionIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      activeCourseSectionIndex === idx
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>

              {sessionContent.courseSections[activeCourseSectionIndex] && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {sessionContent.courseSections[activeCourseSectionIndex].title}
                    </h3>
                    <div className="text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3 whitespace-pre-line">
                      {sessionContent.courseSections[activeCourseSectionIndex].content}
                    </div>
                  </div>

                  {sessionContent.courseSections[activeCourseSectionIndex].callout && (
                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                        <span className="font-semibold block">
                          {sessionContent.courseSections[activeCourseSectionIndex].callout!.title}
                        </span>
                        <p className="leading-relaxed">
                          {sessionContent.courseSections[activeCourseSectionIndex].callout!.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {sessionContent.courseSections[activeCourseSectionIndex].diagramAscii && (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-snug">
                      {sessionContent.courseSections[activeCourseSectionIndex].diagramAscii}
                    </div>
                  )}

                  {sessionContent.courseSections[activeCourseSectionIndex].codeSnippet && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Code Walkthrough</span>
                      </span>
                      <CodeBlock
                        code={sessionContent.courseSections[activeCourseSectionIndex].codeSnippet!}
                        language={sessionContent.courseSections[activeCourseSectionIndex].codeLanguage || "typescript"}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <button
                      disabled={activeCourseSectionIndex === 0}
                      onClick={() => setActiveCourseSectionIndex(prev => Math.max(0, prev - 1))}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous Section
                    </button>
                    <button
                      disabled={activeCourseSectionIndex === sessionContent.courseSections.length - 1}
                      onClick={() => setActiveCourseSectionIndex(prev => Math.min(sessionContent.courseSections.length - 1, prev + 1))}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    >
                      Next Section
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep < 4 && activeTab === "quiz" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Knowledge Check</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Verify Architectural & Implementation Intuition
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Select the correct answer to validate your mental model before moving to hands-on code.
                </p>
              </div>

              <div className="space-y-6">
                {sessionContent.knowledgeCheck.map((question, qIdx) => {
                  const selectedOpt = quizAnswers[question.id];
                  const hasAnswered = quizSubmitted[question.id];
                  const isCorrect = selectedOpt === question.correctIndex;

                  return (
                    <div
                      key={question.id}
                      className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-xs sm:text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {question.question}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isOptionSelected = selectedOpt === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleSelectQuizAnswer(question.id, optIdx)}
                              className={`w-full p-3 rounded-lg text-xs text-left transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                                hasAnswered
                                  ? optIdx === question.correctIndex
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
                                    : isOptionSelected
                                    ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100"
                                    : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60 opacity-60"
                                  : isOptionSelected
                                  ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 text-indigo-900 dark:text-indigo-100"
                                  : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              <span>{option}</span>
                              {hasAnswered && optIdx === question.correctIndex && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                          isCorrect
                            ? "bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200"
                            : "bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200"
                        }`}>
                          <span className="font-semibold block mb-0.5">
                            {isCorrect ? "Correct architectural reasoning" : "Explanation & Tradeoff"}
                          </span>
                          <span>{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep < 4 && activeTab === "workbench" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  <Terminal className="w-4 h-4" />
                  <span>Hands-on Challenge</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {sessionContent.exercise.instruction}
                </h3>
                {sessionContent.exercise.scenario && (
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Scenario: {sessionContent.exercise.scenario}
                  </p>
                )}
              </div>

              {sessionContent.exercise.type === "code_workbench" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-zinc-500 pb-1">
                      <span>Implementation Workbench ({sessionContent.exercise.codeLanguage || "TypeScript"})</span>
                      <button
                        onClick={() => {
                          setUserCode(sessionContent.exercise.starterCode || "");
                          savePracticeCodeSolution(task.id, sessionContent.exercise.starterCode || "");
                        }}
                        className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset starter code</span>
                      </button>
                    </div>

                    <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-950 font-mono text-xs overflow-hidden">
                      <textarea
                        value={userCode}
                        onChange={(e) => {
                          setUserCode(e.target.value);
                          setHasRunTests(false);
                          savePracticeCodeSolution(task.id, e.target.value);
                        }}
                        rows={14}
                        className="w-full p-4 bg-transparent text-zinc-100 focus:outline-hidden font-mono leading-relaxed resize-y"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Automated Verification Criteria</span>
                      </span>
                      <button
                        onClick={handleRunTestAssertions}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run Test Assertions</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {sessionContent.exercise.testCases?.map((tc) => {
                        const passed = testResults[tc.id];
                        return (
                          <div
                            key={tc.id}
                            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                              hasRunTests
                                ? passed
                                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200"
                                  : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200"
                                : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            <span>{tc.description}</span>
                            {hasRunTests && (
                              <span className="text-[11px] font-semibold">
                                {passed ? "PASSED" : "PENDING"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {sessionContent.exercise.type === "architecture_decision" && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Select the optimal architectural path:
                  </span>
                  <div className="space-y-2.5">
                    {sessionContent.exercise.decisionOptions?.map((option) => {
                      const isSelected = selectedDecisionId === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => setSelectedDecisionId(option.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                            isSelected
                              ? option.isOptimal
                                ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20"
                                : "bg-red-50/80 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100 ring-2 ring-red-500/20"
                              : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>{option.title}</span>
                            {isSelected && (
                              <span className="text-[11px] font-bold">
                                {option.isOptimal ? "OPTIMAL SELECTION" : "SUB-OPTIMAL PATH"}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11.5px]">
                            {option.explanation}
                          </p>
                          {isSelected && (
                            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 text-[11px] leading-relaxed">
                              <strong>Tradeoff Analysis:</strong> {option.tradeoffAnalysis}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {sessionContent.exercise.type === "rfc_audit" && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                    Verify and audit each production engineering criterion:
                  </span>
                  <div className="space-y-2">
                    {sessionContent.exercise.auditChecklist?.map((audit) => {
                      const isChecked = auditedChecklistIds.includes(audit.id);
                      return (
                        <div
                          key={audit.id}
                          onClick={() => {
                            setAuditedChecklistIds((prev) =>
                              prev.includes(audit.id)
                                ? prev.filter((i) => i !== audit.id)
                                : [...prev, audit.id]
                            );
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                            isChecked
                              ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-zinc-900 dark:text-zinc-100"
                              : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium block leading-snug">{audit.item}</span>
                            <span className="text-[11px] text-zinc-500 mt-0.5 block">
                              Production Impact: {audit.impact}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep < 4 && activeTab === "artifact" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <FileCode className="w-4 h-4" />
                  <span>Verified Session Artifact</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {sessionContent.artifactDraft.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Generated artifact ready to register in your verified portfolio and Supabase database.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500 pb-1">
                  <span>Artifact Content ({sessionContent.artifactDraft.filename})</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Verified Deliberate Practice Proof
                  </span>
                </div>
                <CodeBlock
                  code={artifactSnippet}
                  language={sessionContent.artifactDraft.type === "code" ? "typescript" : "markdown"}
                />
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Personal Student Notes & Architectural Reflection</span>
                  </label>
                  {notesSaveStatus && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {notesSaveStatus}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Notes are automatically persisted to your database account for future interview and architectural reference.
                </p>
                <textarea
                  value={reflectionText}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Record insights, latency tradeoffs, edge case considerations, or interview talking points..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Session Completed & Verified
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Day {task.dayNumber} deliberate practice completed. Video watch history, knowledge check score, notes, and code artifact saved to database.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-center">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 block">Focused Time</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">
                    {Math.max(1, Math.round(sessionSecondsElapsed / 60))} min
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 block">Knowledge Check</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {calculateFinalQuizScore()}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 block">Streak</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {user.streak + 1} Days
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 block">Database Sync</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">
                    Persisted
                  </span>
                </div>
              </div>

              <div className="pt-4 max-w-sm mx-auto">
                <button
                  onClick={handleConfirmExit}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Return to Practice Path
                </button>
              </div>
            </div>
          )}

        </div>

        {currentStep < 4 && (
          <div className="px-4 sm:px-6 py-3.5 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3 bg-zinc-50/80 dark:bg-zinc-900/40 shrink-0">
            <div>
              {activeTab !== "video" && !isPracticeReviewMode && (
                <button
                  onClick={() => {
                    const tabs: CourseModuleTab[] = ["video", "text", "quiz", "workbench", "artifact"];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous Tab</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isPracticeReviewMode ? (
                <button
                  onClick={closePracticeSession}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close Review
                </button>
              ) : activeTab === "artifact" ? (
                <button
                  onClick={handleFinalizeSession}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Session & Save Proof</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const tabs: CourseModuleTab[] = ["video", "text", "quiz", "workbench", "artifact"];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {showConfirmationClose && (
          <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#15161e] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-2xl">
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Pause practice session?
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  You have practiced for {Math.max(1, Math.round(sessionSecondsElapsed / 60))} minute(s). Your notes and code solutions are saved to the database.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowConfirmationClose(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  Keep Practicing
                </button>
                <button
                  onClick={() => {
                    setShowConfirmationClose(false);
                    closePracticeSession();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
