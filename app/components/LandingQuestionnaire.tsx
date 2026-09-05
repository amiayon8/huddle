"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Clock,
  Zap,
  Cpu,
  Layers,
  Code2,
  Palette,
  Bot,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Loader2,
  BookOpen,
  Gamepad2,
  Music,
  Activity,
  PenTool,
  Compass,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { UserSurveyData } from "../types/huddle";
import { fetchQuestionnaireConfig } from "../lib/supabase";

interface DynamicQuestionData {
  question: string;
  subtitle: string;
  mascotEmotion:
    | "idle"
    | "encouragement"
    | "thinking"
    | "deep_thinking"
    | "planning"
    | "success"
    | "error";
  mascotNote: string;
  isMultiple: boolean;
  options: Array<{
    id: string;
    title: string;
    desc: string;
    badge?: string;
  }>;
}

export const LandingQuestionnaire: React.FC = () => {
  const { finishOnboarding, setHasSkippedToPreview, setOnboardingActive } =
    useHuddle();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Question 1: Favourite Subjects (Multiple)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Computer Science/ICT",
  ]);
  const [subjectsOther, setSubjectsOther] = useState("");
  const [subjectsOtherActive, setSubjectsOtherActive] = useState(false);

  // Question 2: Hobbies
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(["Gaming"]);
  const [hobbiesOther, setHobbiesOther] = useState("");
  const [hobbiesOtherActive, setHobbiesOtherActive] = useState(false);

  // Question 3: Age & Stage
  const [ageInput, setAgeInput] = useState<string>("22");
  const [selectedAge, setSelectedAge] = useState<string>(
    "Early Career / Rising Engineer",
  );
  const [ageOther, setAgeOther] = useState("");
  const [ageOtherActive, setAgeOtherActive] = useState(false);

  // Helper to compute stage from age or birthyear input
  const getStageFromInput = (val: string) => {
    const num = parseInt(val.trim(), 10);
    if (isNaN(num) || num <= 0) {
      return {
        age: null,
        stage: "Please enter age or birth year",
        badge: "Input Required",
      };
    }
    const currentYear = 2026;
    let computedAge: number;
    if (num > 1900 && num <= currentYear) {
      computedAge = currentYear - num;
    } else if (num < 120) {
      computedAge = num;
    } else {
      return {
        age: null,
        stage: "Please enter valid age or birth year",
        badge: "Check Input",
      };
    }

    if (computedAge < 18) {
      return {
        age: computedAge,
        stage: "Student / Early Explorer",
        badge: "Explorer (<18)",
      };
    } else if (computedAge <= 24) {
      return {
        age: computedAge,
        stage: "Early Career / Rising Engineer",
        badge: "Rising (18–24)",
      };
    } else if (computedAge <= 34) {
      return {
        age: computedAge,
        stage: "Mid-Level / Skill Upskilling",
        badge: "Core (25–34)",
      };
    } else {
      return {
        age: computedAge,
        stage: "Senior / Leadership & Staff Track",
        badge: "Staff (35+)",
      };
    }
  };

  const calculatedStage = getStageFromInput(ageInput);

  // Question 4: Profession (AI Dynamic)
  const [selectedProfession, setSelectedProfession] = useState<string>("");
  const [professionOther, setProfessionOther] = useState("");
  const [professionOtherActive, setProfessionOtherActive] = useState(false);

  // Question 5: Skills (AI Dynamic, Multiple)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsOther, setSkillsOther] = useState("");
  const [skillsOtherActive, setSkillsOtherActive] = useState(false);

  // Dynamic question data fetched from AI
  const [dynamicQuestion, setDynamicQuestion] =
    useState<DynamicQuestionData | null>(null);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Mascot emotion map
  const mascotMap: Record<string, string> = {
    idle: "/mascot_idle.svg",
    encouragement: "/mascot_encouragement.svg",
    thinking: "/mascot_thinking.svg",
    deep_thinking: "/mascot_deep_thinking.svg",
    planning: "/mascot_planning.svg",
    success: "/mascot_success.svg",
    error: "/mascot_error.svg",
  };

  const defaultSubjects = [
    {
      id: "science",
      title: "Science",
      desc: "Physics, natural systems, scientific inquiry & empirical modeling",
      badge: "Analytical",
    },
    {
      id: "business",
      title: "Business",
      desc: "Economics, strategy, commerce, marketing & entrepreneurship",
      badge: "Commercial",
    },
    {
      id: "humanities",
      title: "Humanities/Arts",
      desc: "Philosophy, literature, history, creative design & language",
      badge: "Creative",
    },
    {
      id: "cs-ict",
      title: "Computer Science/ICT",
      desc: "Algorithms, programming, distributed systems & internet tech",
      badge: "Technical",
    },
    {
      id: "math",
      title: "Mathematics",
      desc: "Abstract logic, calculus, discrete structures & quantitative proof",
      badge: "Logic",
    },
  ];

  const [baseSubjects, setBaseSubjects] = useState(defaultSubjects);

  useEffect(() => {
    let isMounted = true;
    fetchQuestionnaireConfig("subjects").then((configs) => {
      if (isMounted && configs && configs.length > 0) {
        setBaseSubjects(
          configs.map((c) => ({
            id: c.id,
            title: c.title,
            desc: c.description,
            badge: c.badge || "Core",
          })),
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch AI dynamic question data whenever step changes to 2, 3, 4, or 5
  useEffect(() => {
    if (step === 1) {
      setDynamicQuestion(null);
      return;
    }

    const fetchDynamicQuestion = async () => {
      setIsLoadingDynamic(true);
      try {
        const res = await fetch("/api/questionnaire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step,
            answers: {
              subjects: selectedSubjects,
              subjectsOther: subjectsOtherActive ? subjectsOther : undefined,
              hobbies: selectedHobbies,
              hobbiesOther: hobbiesOtherActive ? hobbiesOther : undefined,
              age: selectedAge,
              ageOther: ageOtherActive ? ageOther : undefined,
              profession: selectedProfession,
              professionOther: professionOtherActive
                ? professionOther
                : undefined,
              skills: selectedSkills,
              skillsOther: skillsOtherActive ? skillsOther : undefined,
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDynamicQuestion(json.data);

            // Auto-select first option if none selected for single-choice steps
            if (step === 4 && !selectedProfession && json.data.options?.[0]) {
              setSelectedProfession(json.data.options[0].title);
            }
            if (
              step === 5 &&
              selectedSkills.length === 0 &&
              json.data.options?.[0]
            ) {
              setSelectedSkills([json.data.options[0].title]);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load dynamic question from AI:", e);
      } finally {
        setIsLoadingDynamic(false);
      }
    };

    fetchDynamicQuestion();
  }, [step]);

  // Toggle multi-select item
  const toggleSelection = (
    list: string[],
    setList: (val: string[]) => void,
    item: string,
  ) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Complete Onboarding
      setIsFinishing(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });

      const finalSkills = [
        ...selectedSkills,
        ...(skillsOtherActive && skillsOther.trim()
          ? [skillsOther.trim()]
          : []),
      ];
      const targetMilestone =
        professionOtherActive && professionOther.trim()
          ? professionOther.trim()
          : selectedProfession || "Software Engineer";

      const surveyPayload: UserSurveyData = {
        subjects: selectedSubjects,
        subjectsOther: subjectsOtherActive ? subjectsOther : undefined,
        hobbies: selectedHobbies,
        hobbiesOther: hobbiesOtherActive ? hobbiesOther : undefined,
        age: calculatedStage.age ? `${calculatedStage.age}` : ageInput,
        ageInput: ageInput,
        learningStage: calculatedStage.stage,
        targetProfession: targetMilestone,
        professionOther: professionOtherActive ? professionOther : undefined,
        startingSkills:
          finalSkills.length > 0 ? finalSkills : ["System Architecture"],
        skillsOther: skillsOtherActive ? skillsOther : undefined,
        completedAt: new Date().toISOString(),
      };

      setTimeout(() => {
        finishOnboarding(
          finalSkills.length > 0 ? finalSkills : ["System Architecture"],
          targetMilestone,
          surveyPayload,
        );
        setIsFinishing(false);
      }, 700);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setHasSkippedToPreview(true);
    setOnboardingActive(false);
  };

  // Determine current mascot emotion and note
  const currentMascotEmotion = isLoadingDynamic
    ? "deep_thinking"
    : dynamicQuestion?.mascotEmotion ||
      (step === 1
        ? "planning"
        : step === 2
          ? "encouragement"
          : step === 3
            ? "thinking"
            : step === 4
              ? "deep_thinking"
              : "success");

  const currentMascotNote =
    dynamicQuestion?.mascotNote ||
    (step === 1
      ? "Pick your favourite subjects! I'll generate customized questions and career paths tailored to your passions."
      : step === 2
        ? "Hobbies reveal your natural flow state. Let me know what you love doing outside study!"
        : step === 3
          ? "Every age is prime time for deliberate practice. 15 minutes a day builds unstoppable proof."
          : step === 4
            ? "Pip curated these high-leverage roles matching your background and passions."
            : "Choose which skills you want to conquer in your initial 4-day sprint!");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans transition-colors selection:bg-indigo-600 selection:text-white">
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo_light.svg"
            alt="Huddle"
            className="w-9 h-9 rounded-xl object-contain shadow-xs dark:hidden"
          />
          <img
            src="/logo.svg"
            alt="Huddle"
            className="w-9 h-9 rounded-xl object-contain shadow-xs hidden dark:block"
          />
          <div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle • Dynamic Intake
            </span>
            <span className="block text-[10.5px] text-zinc-500">
              AI Tailored Deliberate Practice
            </span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          disabled={isLoadingDynamic || isFinishing}
          className="text-xs font-medium text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
          title="Browse in preview mode (actions locked until survey completed)"
        >
          Skip to Preview Mode →
        </button>
      </header>

      {/* Main Questionnaire Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-6 sm:py-8">
        {/* Step Progress Bar */}
        <div className="mb-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Question {step} of {totalSteps}
            </span>
            <span className="text-[11px] font-mono">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Pip AI Guidance Card */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-4 shadow-2xs transition-all">
          <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 p-1 rounded-2xl bg-white/80 dark:bg-[#111218]/80 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs flex items-center justify-center">
            <img
              src={mascotMap[currentMascotEmotion] || "/mascot_idle.svg"}
              alt="Pip"
              className="w-full h-full object-contain drop-shadow-xs transition-transform hover:scale-105"
            />
          </div>
          <div className="text-xs text-zinc-700 dark:text-zinc-300 flex-1">
            <div className="font-semibold text-indigo-600 dark:text-indigo-400 text-[11px] uppercase tracking-wider mb-0.5">
              Pip Intake Tutor
            </div>
            <p className="leading-relaxed text-[12px]">
              {isLoadingDynamic ? (
                <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating tailored questions with AI based on your inputs...
                </span>
              ) : (
                currentMascotNote
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Question Render Area (Blocked when AI is thinking) */}
        {isLoadingDynamic ? (
          <div className="py-10 px-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 select-none pointer-events-none">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-3xl bg-white dark:bg-[#111218] border-2 border-indigo-500 shadow-xl flex items-center justify-center animate-bounce">
                <img
                  src="/mascot_deep_thinking.svg"
                  alt="Pip AI Thinking"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
              </span>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pip AI is Thinking</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Calibrating Step {step}...
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Pip is computing relevant pathways based on your background. All
                inputs are temporarily locked to ensure accuracy.
              </p>
            </div>

            {/* Skeleton placeholders */}
            <div className="w-full max-w-md space-y-2.5 pt-2">
              <div className="h-14 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900/40 animate-pulse flex items-center px-4 gap-3">
                <div className="w-5 h-5 rounded-md bg-indigo-200 dark:bg-indigo-900/60" />
                <div className="h-3.5 w-40 bg-indigo-200/80 dark:bg-indigo-900/60 rounded" />
              </div>
              <div className="h-14 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900/40 animate-pulse delay-100 flex items-center px-4 gap-3">
                <div className="w-5 h-5 rounded-md bg-indigo-200 dark:bg-indigo-900/60" />
                <div className="h-3.5 w-48 bg-indigo-200/80 dark:bg-indigo-900/60 rounded" />
              </div>
              <div className="h-14 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900/40 animate-pulse delay-200 flex items-center px-4 gap-3">
                <div className="w-5 h-5 rounded-md bg-indigo-200 dark:bg-indigo-900/60" />
                <div className="h-3.5 w-32 bg-indigo-200/80 dark:bg-indigo-900/60 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Question Title & Subtitle */}
            <div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {step === 1 && "1) Favourite Subject"}
                {step === 2 && "2) Hobby & Passions"}
                {step === 3 && "3) Age & Stage"}
                {step === 4 && "4) Target Profession (AI Curated)"}
                {step === 5 && "5) Starting Skills (AI Tailored)"}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
                {step === 1
                  ? "What is your favourite subject? (Multiple)"
                  : step === 3
                    ? "How would you describe your current learning stage?"
                    : dynamicQuestion?.question ||
                      (step === 2
                        ? "What is your hobby?"
                        : step === 4
                          ? "What do you want to be (profession)?"
                          : "Which skill do you want to start with? (Multiple)")}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {step === 1
                  ? "Select all subjects that spark your curiosity. Plus specify custom subjects in Other."
                  : step === 3
                    ? "Pip tunes your sprint intensity, schedule rhythms, and daily depth to match where you are right now."
                    : dynamicQuestion?.subtitle ||
                      "Pip calibrates your daily sprint options around this answer."}
              </p>
            </div>

            {/* Options Grid */}
            <div className="space-y-2.5 pt-1">
              {/* Step 3: Plain Number Input or Birth Year Input Card */}
              {step === 3 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111218] border-2 border-indigo-500/40 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <label
                          htmlFor="age-birthyear-input"
                          className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 block"
                        >
                          Enter your Age or Birth Year
                        </label>
                        <p className="text-[11px] text-zinc-500">
                          Type your age (e.g. 22) or birth year (e.g. 2004)
                        </p>
                      </div>
                    </div>
                    {calculatedStage.age && (
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {calculatedStage.age} years old
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      id="age-birthyear-input"
                      type="number"
                      min={10}
                      max={2026}
                      placeholder="e.g. 22 or 2004"
                      value={ageInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAgeInput(val);
                        const computed = getStageFromInput(val);
                        if (computed.age) {
                          setSelectedAge(
                            `${computed.stage} (${computed.age} yrs old)`,
                          );
                          setAgeOtherActive(false);
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-all"
                    />
                  </div>

                  {/* Real-time Stage Result Display */}
                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300">
                        Calibrated Stage:{" "}
                        <strong>{calculatedStage.stage}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                      {calculatedStage.badge}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pt-1">
                    Or select a learning stage:
                  </div>
                </div>
              )}

              {/* Step 1: Base Subjects */}
              {step === 1 &&
                baseSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.title);
                  return (
                    <button
                      key={sub.id}
                      onClick={() =>
                        toggleSelection(
                          selectedSubjects,
                          setSelectedSubjects,
                          sub.title,
                        )
                      }
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                              {sub.title}
                            </span>
                            <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                              {sub.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {sub.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

              {/* Steps 2-5: Dynamic Options from AI */}
              {step > 1 &&
                dynamicQuestion?.options?.map((opt) => {
                  const isMulti = dynamicQuestion.isMultiple;
                  const isSelected = isMulti
                    ? step === 2
                      ? selectedHobbies.includes(opt.title)
                      : selectedSkills.includes(opt.title)
                    : step === 3
                      ? selectedAge === opt.title
                      : selectedProfession === opt.title;

                  const handleSelect = () => {
                    if (step === 2) {
                      toggleSelection(
                        selectedHobbies,
                        setSelectedHobbies,
                        opt.title,
                      );
                    } else if (step === 3) {
                      setSelectedAge(opt.title);
                      setAgeOtherActive(false);
                    } else if (step === 4) {
                      setSelectedProfession(opt.title);
                      setProfessionOtherActive(false);
                    } else if (step === 5) {
                      toggleSelection(
                        selectedSkills,
                        setSelectedSkills,
                        opt.title,
                      );
                    }
                  };

                  return (
                    <button
                      key={opt.id}
                      onClick={handleSelect}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                              {opt.title}
                            </span>
                            {opt.badge && (
                              <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

              {/* Custom "Other: ________" Option Card on EVERY Step */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  (step === 1 && subjectsOtherActive) ||
                  (step === 2 && hobbiesOtherActive) ||
                  (step === 3 && ageOtherActive) ||
                  (step === 4 && professionOtherActive) ||
                  (step === 5 && skillsOtherActive)
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`other-check-step-${step}`}
                    checked={
                      step === 1
                        ? subjectsOtherActive
                        : step === 2
                          ? hobbiesOtherActive
                          : step === 3
                            ? ageOtherActive
                            : step === 4
                              ? professionOtherActive
                              : skillsOtherActive
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (step === 1) setSubjectsOtherActive(checked);
                      if (step === 2) setHobbiesOtherActive(checked);
                      if (step === 3) setAgeOtherActive(checked);
                      if (step === 4) setProfessionOtherActive(checked);
                      if (step === 5) setSkillsOtherActive(checked);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                  <label
                    htmlFor={`other-check-step-${step}`}
                    className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer shrink-0"
                  >
                    Other:
                  </label>
                  <input
                    type="text"
                    placeholder="Type your own custom answer..."
                    value={
                      step === 1
                        ? subjectsOther
                        : step === 2
                          ? hobbiesOther
                          : step === 3
                            ? ageOther
                            : step === 4
                              ? professionOther
                              : skillsOther
                    }
                    onFocus={() => {
                      if (step === 1) setSubjectsOtherActive(true);
                      if (step === 2) setHobbiesOtherActive(true);
                      if (step === 3) setAgeOtherActive(true);
                      if (step === 4) setProfessionOtherActive(true);
                      if (step === 5) setSkillsOtherActive(true);
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (step === 1) {
                        setSubjectsOther(val);
                        setSubjectsOtherActive(true);
                      }
                      if (step === 2) {
                        setHobbiesOther(val);
                        setHobbiesOtherActive(true);
                      }
                      if (step === 3) {
                        setAgeOther(val);
                        setAgeOtherActive(true);
                      }
                      if (step === 4) {
                        setProfessionOther(val);
                        setProfessionOtherActive(true);
                      }
                      if (step === 5) {
                        setSkillsOther(val);
                        setSkillsOtherActive(true);
                      }
                    }}
                    className="flex-1 bg-transparent border-b border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Footer */}
      <footer className="max-w-xl w-full mx-auto flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleBack}
          disabled={step === 1 || isFinishing || isLoadingDynamic}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 hidden sm:inline">
            {isLoadingDynamic
              ? "AI Calibrating..."
              : step === totalSteps
                ? "Ready to assemble sprint"
                : `Next: Question ${step + 1}`}
          </span>
          <button
            onClick={handleNext}
            disabled={isFinishing || isLoadingDynamic}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 hover:translate-x-0.5 active:translate-x-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isFinishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Assembling Your Sprint...</span>
              </>
            ) : isLoadingDynamic ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Thinking...</span>
              </>
            ) : step === totalSteps ? (
              <>
                <span>Launch My 4-Day Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
