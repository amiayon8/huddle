"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Clock,
  Zap,
  Users,
  UserCheck,
  Award,
  Layers,
  Compass,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { fetchQuestionnaireConfig } from "../lib/supabase";

export const OnboardingFlow: React.FC = () => {
  const { onboardingActive, finishOnboarding, creators } = useHuddle();

  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "System Architecture",
  ]);
  const [experience, setExperience] = useState("Intermediate");
  const [commitment, setCommitment] = useState("20 mins / day");
  const [goal, setGoal] = useState("Build resilient production software");
  const [pace, setPace] = useState("Steady & Consistent");
  const [followedCreators, setFollowedCreators] = useState<string[]>(["cr-1"]);
  const [joinSquad, setJoinSquad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!onboardingActive) return null;

  const totalSteps = 9;

  const initialSkills = [
    {
      title: "System Architecture",
      category: "Engineering",
      desc: "Caching, rate limiting, and fault tolerance",
    },
    {
      title: "Next.js App Router & RSC",
      category: "Frontend",
      desc: "Server components, stream rendering, layouts",
    },
    {
      title: "TypeScript Type Mechanics",
      category: "Languages",
      desc: "Conditional types, mapped types, generics",
    },
    {
      title: "Product UI & Micro-interactions",
      category: "Design",
      desc: "Restrained typography, motion, spacing",
    },
    {
      title: "Database Partitioning & SQL",
      category: "Backend",
      desc: "Indexing, query tuning, sharding keys",
    },
    {
      title: "AI Engineering & Agents",
      category: "AI",
      desc: "Tool calling, prompt chains, evaluation",
    },
  ];

  const [skillsList, setSkillsList] = useState(initialSkills);

  useEffect(() => {
    let isMounted = true;
    fetchQuestionnaireConfig("skills").then((configs) => {
      if (isMounted && configs && configs.length > 0) {
        setSkillsList(
          configs.map((c) => ({
            title: c.title,
            category: c.badge || "Engineering",
            desc: c.description,
          })),
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
  const commitmentOptions = ["10 mins / day", "20 mins / day", "40 mins / day"];
  const goalOptions = [
    "Build resilient production software",
    "Prepare for senior engineering role",
    "Deep technical mastery of fundamentals",
    "Ship personal side projects",
  ];
  const paceOptions = [
    "Casual (3 days / week)",
    "Steady & Consistent (5 days / week)",
    "Intensive (Every day)",
  ];

  const toggleSkill = (title: string) => {
    setSelectedSkills((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const toggleCreator = (id: string) => {
    setFollowedCreators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        finishOnboarding(selectedSkills);
        setIsTransitioning(false);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo_light.svg"
              alt="Huddle"
              className="w-7 h-7 rounded-lg object-contain dark:hidden"
            />
            <img
              src="/logo.svg"
              alt="Huddle"
              className="w-7 h-7 rounded-lg object-contain hidden dark:block"
            />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="w-48 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Welcome to Huddle
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Huddle is built for deliberate, daily practice. Let us design
                your custom learning journey in a few simple choices.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  What skills are you working on?
                </h3>
                <p className="text-xs text-zinc-500">
                  Select one or more topics to build your active roadmaps.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillsList.map((sk) => {
                  const isSelected = selectedSkills.includes(sk.title);
                  return (
                    <div
                      key={sk.title}
                      onClick={() => toggleSkill(sk.title)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {sk.category}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="font-semibold text-sm mt-1 text-zinc-900 dark:text-zinc-100">
                        {sk.title}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 leading-snug">
                        {sk.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  What is your current experience level?
                </h3>
                <p className="text-xs text-zinc-500">
                  This adjusts task complexity and foundational reading
                  material.
                </p>
              </div>
              <div className="space-y-3">
                {experienceLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setExperience(lvl)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      experience === lvl
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <span>{lvl}</span>
                    {experience === lvl && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Weekly time commitment
                </h3>
                <p className="text-xs text-zinc-500">
                  How much focused time can you allocate per session?
                </p>
              </div>
              <div className="space-y-3">
                {commitmentOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCommitment(opt)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      commitment === opt
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>{opt}</span>
                    </div>
                    {commitment === opt && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  What is your primary goal?
                </h3>
                <p className="text-xs text-zinc-500">
                  We shape your roadmap milestones around this outcome.
                </p>
              </div>
              <div className="space-y-3">
                {goalOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      goal === g
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-indigo-500" />
                      <span>{g}</span>
                    </div>
                    {goal === g && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Preferred learning pace
                </h3>
                <p className="text-xs text-zinc-500">
                  Select how frequently Pip sends session reminders.
                </p>
              </div>
              <div className="space-y-3">
                {paceOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPace(p)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      pace === p
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-zinc-900 dark:text-zinc-100 font-semibold"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-indigo-500" />
                      <span>{p}</span>
                    </div>
                    {pace === p && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Suggested Creators
                </h3>
                <p className="text-xs text-zinc-500">
                  Follow domain experts whose guides appear directly inside your
                  journey steps.
                </p>
              </div>
              <div className="space-y-3">
                {creators.map((c) => {
                  const isFollowed = followedCreators.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCreator(c.id)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isFollowed
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                            {c.name}
                          </div>
                          <div className="text-xs text-zinc-500">{c.title}</div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                          isFollowed
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {isFollowed ? "Following" : "Follow"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Micro-Squad Preference
                </h3>
                <p className="text-xs text-zinc-500">
                  Squads are intimate groups of max 4 peers. No competitive
                  leaderboards.
                </p>
              </div>
              <div className="space-y-3">
                <div
                  onClick={() => setJoinSquad(true)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    joinSquad
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <div>
                      <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                        Join matching Micro-Squad (Async Engineers)
                      </div>
                      <div className="text-xs text-zinc-500">
                        Shares daily check-ins and warm peer encouragement.
                      </div>
                    </div>
                  </div>
                  {joinSquad && <Check className="w-4 h-4 text-indigo-600" />}
                </div>

                <div
                  onClick={() => setJoinSquad(false)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    !joinSquad
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:border-zinc-300"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      Learn solo for now
                    </div>
                    <div className="text-xs text-zinc-500">
                      You can join or invite a squad anytime later.
                    </div>
                  </div>
                  {!joinSquad && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Your Journey is Ready
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  We built your daily home around{" "}
                  {selectedSkills[0] || "System Architecture"}. Next step ready.
                </p>
              </div>

              {isTransitioning && (
                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Preparing your dashboard...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            onClick={handleBack}
            disabled={step === 1 || isTransitioning}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              step === 1
                ? "opacity-0 pointer-events-none"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {step === totalSteps ? "Enter Dashboard" : "Continue"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
