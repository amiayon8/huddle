"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  X,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Send,
  Bot,
  Plus,
  History,
  MessageSquare,
  Trash2,
  Clock,
  ArrowLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PipChatMessage, PipChatSession } from "../types/huddle";
import { addMascotMessageToDb } from "../lib/supabase";

export const MascotDrawer: React.FC = () => {
  const {
    mascotOpen,
    setMascotOpen,
    sprint,
    reshuffleSprint,
    user,
    ensureSurveyDone,
  } = useHuddle();

  const [chatInput, setChatInput] = useState("");
  const [currentMascotEmotion, setCurrentMascotEmotion] =
    useState<string>("idle");
  const [isThinking, setIsThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<PipChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const mascotMap: Record<string, string> = {
    idle: "/mascot_idle.svg",
    encouragement: "/mascot_encouragement.svg",
    thinking: "/mascot_thinking.svg",
    deep_thinking: "/mascot_deep_thinking.svg",
    planning: "/mascot_planning.svg",
    success: "/mascot_success.svg",
    error: "/mascot_error.svg",
  };

  const getStorageKey = () => `huddle_pip_sessions_${user.id || "user-1"}`;

  // Helper to generate personalized default messages tailored to user survey & sprint
  const createDefaultMessages = (): PipChatMessage[] => {
    const firstName = user.name ? user.name.split(" ")[0] : "Engineer";
    const milestone =
      user.surveyData?.targetProfession ||
      user.careerMilestone ||
      "Staff Software Engineer";
    const skill = sprint?.skillTitle || "System Architecture";
    const hobbies = user.surveyData?.hobbies?.length
      ? user.surveyData.hobbies.join(", ")
      : "technology";
    const subjects = user.surveyData?.subjects?.length
      ? user.surveyData.subjects.join(", ")
      : "computing";
    const completedTasks = sprint?.tasks
      ? sprint.tasks.filter((t) => t.completed).length
      : 0;
    const totalTasks = sprint?.tasks ? sprint.tasks.length : 4;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return [
      {
        id: `msg-${Date.now()}-1`,
        sender: "pip",
        text: `I'm Pip, your engineering mentor for this sprint on **${skill}**.\n\nWe focus on short, deliberate technical practice. You're building towards **${milestone}** with analogies drawn from **${hobbies}** and **${subjects}** when helpful.`,
        mascotSvg: "/mascot_idle.svg",
        timestamp: currentTime,
      },
      {
        id: `msg-${Date.now()}-2`,
        sender: "pip",
        text: `Day ${sprint.currentDay} of ${sprint.durationDays || 4}. ${completedTasks} of ${totalTasks} tasks complete.\n\nAsk me technical questions about today's practice, review code, or request a schedule adjustment.`,
        mascotSvg: "/mascot_encouragement.svg",
        timestamp: currentTime,
      },
    ];
  };

  // Load chat sessions from localStorage on mount or when user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = getStorageKey();

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: PipChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to parse Pip chat sessions from localStorage:", e);
    }

    // Initialize with first default session
    const initialSession: PipChatSession = {
      id: `sess-${Date.now()}`,
      title: `Sprint Focus: ${sprint.skillTitle}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: createDefaultMessages(),
      skillFocus: sprint.skillTitle,
    };

    setSessions([initialSession]);
    setCurrentSessionId(initialSession.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([initialSession]));
    } catch (e) {
      console.error("Failed to write initial Pip session to localStorage:", e);
    }
  }, [user.id]);

  // Persist sessions to localStorage whenever they change
  const saveSessions = (updated: PipChatSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save Pip sessions:", e);
      }
    }
  };

  // Find active session
  const activeSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current && !showHistory) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isThinking, showHistory]);

  // Create a brand new chat session
  const handleStartNewChat = () => {
    const newSession: PipChatSession = {
      id: `sess-${Date.now()}`,
      title: `Discussion #${sessions.length + 1}: ${sprint.skillTitle}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: createDefaultMessages(),
      skillFocus: sprint.skillTitle,
    };

    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newSession.id);
    setShowHistory(false);
    setCurrentMascotEmotion("idle");
  };

  // Switch to a previous chat session
  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowHistory(false);
  };

  // Delete a chat session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== sessionId);

    if (remaining.length === 0) {
      const freshSession: PipChatSession = {
        id: `sess-${Date.now()}`,
        title: `Sprint Focus: ${sprint.skillTitle}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: createDefaultMessages(),
        skillFocus: sprint.skillTitle,
      };
      saveSessions([freshSession]);
      setCurrentSessionId(freshSession.id);
    } else {
      saveSessions(remaining);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(remaining[0].id);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isThinking) return;
    if (!ensureSurveyDone("chat with Pip")) return;

    const userText = chatInput.trim();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMsg: PipChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: userText,
      timestamp: currentTime,
    };

    const updatedMessages = [...messages, newUserMsg];

    // Auto-update session title if it is still generic
    let sessionTitle = activeSession?.title || "Engineering Discussion";
    if (
      sessionTitle.startsWith("Sprint Focus") ||
      sessionTitle.startsWith("Discussion #")
    ) {
      sessionTitle =
        userText.length > 36 ? `${userText.slice(0, 36)}...` : userText;
    }

    const updatedSession: PipChatSession = {
      ...(activeSession || {
        id: `sess-${Date.now()}`,
        createdAt: new Date().toISOString(),
        skillFocus: sprint.skillTitle,
      }),
      title: sessionTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
    };

    const nextSessions = sessions.map((s) =>
      s.id === updatedSession.id ? updatedSession : s,
    );
    saveSessions(nextSessions);

    setChatInput("");
    setIsThinking(true);
    setCurrentMascotEmotion("deep_thinking");

    try {
      const res = await fetch("/api/mascot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send entire structured conversation history for full contextual memory
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          userProfile: user,
          surveyData: user.surveyData,
          sprintContext: sprint,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const emotionSvg = data.mascotSvg || "/mascot_encouragement.svg";

        if (emotionSvg.includes("success")) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
          });
        }

        const newPipMsg: PipChatMessage = {
          id: `msg-${Date.now()}-pip`,
          sender: "pip",
          text: data.reply,
          mascotSvg: emotionSvg,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        addMascotMessageToDb(
          { id: newPipMsg.id, context: "chat", text: newPipMsg.text },
          user.id,
        );

        const finalMessages = [...updatedMessages, newPipMsg];
        const finalSession: PipChatSession = {
          ...updatedSession,
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
        };

        saveSessions(
          sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
        );

        setCurrentMascotEmotion(
          emotionSvg.includes("planning")
            ? "planning"
            : emotionSvg.includes("success")
              ? "success"
              : emotionSvg.includes("deep")
                ? "deep_thinking"
                : "encouragement",
        );

        if (
          userText.toLowerCase().includes("reshuffle") ||
          userText.toLowerCase().includes("busy") ||
          userText.toLowerCase().includes("missed")
        ) {
          reshuffleSprint(userText);
        }
      } else {
        throw new Error("API request failed");
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: PipChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        sender: "pip",
        text: `I've got your back! Consistency beats intensity. Let's focus on **Day ${sprint.currentDay}** of your **${sprint.skillTitle}** sprint.`,
        mascotSvg: "/mascot_encouragement.svg",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...updatedMessages, fallbackMsg];
      const finalSession: PipChatSession = {
        ...updatedSession,
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
      };
      saveSessions(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
      );
      setCurrentMascotEmotion("encouragement");
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickReshuffle = () => {
    reshuffleSprint();
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
    });

    const reshuffleMsg: PipChatMessage = {
      id: `msg-${Date.now()}-reshuffle`,
      sender: "pip",
      text: "Sprint reshuffled smoothly with **zero penalties**! Pick up Day 1 whenever you are ready.",
      mascotSvg: "/mascot_planning.svg",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const finalMessages = [...messages, reshuffleMsg];
    if (activeSession) {
      const finalSession: PipChatSession = {
        ...activeSession,
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
      };
      saveSessions(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
      );
    }
    setCurrentMascotEmotion("planning");
  };

  if (!mascotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setMascotOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full sm:w-[500px] bg-white dark:bg-[#0c0d12] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-13 h-13 sm:w-15 sm:h-15 p-1.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 flex items-center justify-center shadow-xs">
                <img
                  src={mascotMap[currentMascotEmotion] || "/mascot_idle.svg"}
                  alt="Pip"
                  className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
                />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c0d12]"
                title="Pip is active"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  Pip AI
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  Online
                </span>
              </div>
              <p
                className="text-[11px] text-zinc-500 truncate max-w-[170px] sm:max-w-[210px]"
                title={activeSession?.title}
              >
                {showHistory
                  ? "Conversation History"
                  : activeSession?.title || "Sprint companion & concept tutor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* New Chat Button */}
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Start a new chat session"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">New</span>
            </button>

            {/* History Toggle Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                showHistory
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400"
              }`}
              title="View past conversations"
            >
              <History className="w-3.5 h-3.5" />
              <span className="text-[10.5px] px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono">
                {sessions.length}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setMascotOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switch: History List OR Active Chat Stream */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                  Previous Conversations ({sessions.length})
                </h4>
              </div>
              <button
                onClick={handleStartNewChat}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Discussion</span>
              </button>
            </div>

            <p className="text-[11.5px] text-zinc-500 pb-2">
              Select any past discussion to reopen it with complete contextual
              memory and prior dialogue history.
            </p>

            <div className="space-y-2.5">
              {sessions.map((sess) => {
                const isActive = sess.id === currentSessionId;
                const dateFormatted = new Date(
                  sess.updatedAt,
                ).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={sess.id}
                    onClick={() => handleSelectSession(sess.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${
                      isActive
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <h5 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {sess.title}
                        </h5>
                        {isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10.5px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{dateFormatted}</span>
                        </span>
                        <span>•</span>
                        <span>{sess.messages.length} messages</span>
                        {sess.skillFocus && (
                          <>
                            <span>•</span>
                            <span className="truncate">{sess.skillFocus}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete this chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-[13px]">
            {messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "pip" && (
                  <div className="shrink-0 flex flex-col items-center pt-0.5 select-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 p-1 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center transition-transform hover:scale-105 shadow-2xs">
                      <img
                        src={m.mascotSvg || "/mascot_idle.svg"}
                        alt="Pip"
                        className="w-full h-full object-contain drop-shadow-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1 max-w-[82%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-xs"
                        : "bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 rounded-bl-xs border border-zinc-200/60 dark:border-zinc-700/60"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <span>{m.text}</span>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}
                  </div>
                  {m.timestamp && (
                    <div
                      className={`text-[10px] text-zinc-400 px-1 ${m.sender === "user" ? "text-right" : "text-left"}`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-3 text-zinc-500 text-xs py-2 pl-1 animate-in fade-in duration-150">
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
                  <img
                    src="/mascot_deep_thinking.svg"
                    alt="Thinking"
                    className="w-full h-full object-contain animate-bounce"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-xs border border-zinc-200/60 dark:border-zinc-700/60">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* Action Controls & Input */}
        {!showHistory && (
          <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2.5">
            {/* Dynamic Survey-Based Quick Prompt Chips */}
            {(() => {
              const survey = user?.surveyData;
              const primaryHobby = survey?.hobbies?.[0] || "Gaming";
              const primarySubject =
                survey?.subjects?.[0] || "Computer Science";
              const targetProfession =
                survey?.targetProfession ||
                user?.careerMilestone ||
                "Staff Architect";
              const primarySkill =
                survey?.startingSkills?.[0] ||
                sprint?.skillTitle ||
                "System Design";
              const learningStage = survey?.learningStage || "Rising Engineer";

              return (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar">
                  <button
                    type="button"
                    onClick={() =>
                      setChatInput(
                        `Explain ${sprint?.skillTitle || "today step"} using a ${primaryHobby} analogy`,
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{primaryHobby} analogy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setChatInput(
                        `How does today's step build proof for a ${targetProfession} role?`,
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{targetProfession} context</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setChatInput(
                        `Connect today's task to fundamental ${primarySubject} principles`,
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{primarySubject} theory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setChatInput(
                        `Give me a 20-min practice drill for ${primarySkill} at my ${learningStage} level`,
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                  >
                    <span>20 min drill</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickReshuffle}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                    title="Reschedule practice without penalty"
                  >
                    <RotateCcw className="w-3 h-3 text-zinc-400" />
                    <span>Reschedule</span>
                  </button>
                </div>
              );
            })()}

            {/* Form */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Pip a question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isThinking}
                className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isThinking}
                className="p-2 rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
