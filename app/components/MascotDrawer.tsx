"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Plus,
  History,
  MessageSquare,
  Trash2,
  Clock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { SparkChatMessage, SparkChatSession } from "../types/huddle";
import { addMascotMessageToDb } from "../lib/supabase";

export const MascotDrawer: React.FC = () => {
  const { mascotOpen, setMascotOpen, sprint, reshuffleSprint, user } =
    useHuddle();

  const [chatInput, setChatInput] = useState("");
  const [currentMascotEmotion, setCurrentMascotEmotion] =
    useState<string>("idle");
  const [isThinking, setIsThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<SparkChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const mascotMap: Record<string, string> = {
    idle: "/Huddle SVGs/01_happy.svg",
    happy: "/Huddle SVGs/01_happy.svg",
    encouragement: "/mascot_encouragement.svg",
    thinking: "/Huddle SVGs/05_eureka_lightbulb.svg",
    eureka: "/Huddle SVGs/05_eureka_lightbulb.svg",
    deep_thinking: "/mascot_deep_thinking.svg",
    planning: "/Huddle SVGs/06_explaining_two_hands-cropped.svg",
    explaining: "/Huddle SVGs/06_explaining_two_hands-cropped.svg",
    success: "/Huddle SVGs/02_laughing.svg",
    laughing: "/Huddle SVGs/02_laughing.svg",
    crossed_arms: "/Huddle SVGs/03_crossed_arms.svg",
    announcement: "/Huddle SVGs/04_announcement_megaphone.svg",
    very_angry: "/Huddle SVGs/07_very_angry.svg",
    angry: "/Huddle SVGs/07_very_angry.svg",
    error: "/mascot_error.svg",
  };

  const getStorageKey = () => `huddle_spark_sessions_${user.id || "user-1"}`;

  const createDefaultMessages = (): SparkChatMessage[] => {
    const skill = sprint?.skillTitle || "System Architecture";
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return [
      {
        id: `msg-${Date.now()}-1`,
        sender: "spark",
        text: `Hi ${user.name || "there"}! I'm Spark - your AI Companion for **${skill}**.\n\nWhether you need task-specific instructions broken down step by step, help verifying your progress, or advice on your long-term Growth Map, I am right here by your side. What can we tackle today?`,
        mascotSvg: "/Huddle SVGs/01_happy.svg",
        timestamp: currentTime,
      },
    ];
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = getStorageKey();
      try {
        const saved =
          localStorage.getItem(storageKey) ||
          localStorage.getItem(`huddle_spark_sessions_${user.id || "user-1"}`);
        if (saved) {
          const parsed: SparkChatSession[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setCurrentSessionId(parsed[0].id);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      const initialSession: SparkChatSession = {
        id: `sess-${Date.now()}`,
        title: `Topic: ${sprint.skillTitle}`,
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
        console.error(e);
      }
    }
  }, [user.id]);

  const saveSessions = (updated: SparkChatSession[]) => {
    setSessions(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const activeSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (mascotOpen && !showHistory) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, mascotOpen, isThinking, showHistory]);

  const handleStartNewChat = () => {
    const newSession: SparkChatSession = {
      id: `sess-${Date.now()}`,
      title: `Topic: ${sprint.skillTitle}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: createDefaultMessages(),
      skillFocus: sprint.skillTitle,
    };
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newSession.id);
    setShowHistory(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setShowHistory(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    if (updated.length === 0) {
      const reset = [
        {
          id: `sess-${Date.now()}`,
          title: `Topic: ${sprint.skillTitle}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: createDefaultMessages(),
          skillFocus: sprint.skillTitle,
        },
      ];
      saveSessions(reset);
      setCurrentSessionId(reset[0].id);
    } else {
      saveSessions(updated);
      if (currentSessionId === id) {
        setCurrentSessionId(updated[0].id);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isThinking) return;

    const userText = chatInput.trim();
    setChatInput("");

    const userMessage: SparkChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newMessages = [...messages, userMessage];

    if (activeSession) {
      const updatedSession: SparkChatSession = {
        ...activeSession,
        updatedAt: new Date().toISOString(),
        messages: newMessages,
      };
      saveSessions(
        sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
      );
    }

    if (user.id) {
      addMascotMessageToDb(
        { id: `msg-${Date.now()}`, context: "chat", text: userText },
        user.id,
      );
    }

    setIsThinking(true);
    setCurrentMascotEmotion("thinking");

    try {
      const response = await fetch("/api/mascot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-8),
          messages: [...messages.slice(-8), { sender: "user", text: userText }],
          userContext: {
            name: user.name,
            currentSkill: sprint.skillTitle,
            currentDay: sprint.currentDay,
            totalDays: sprint.durationDays || 6,
          },
          sprintContext: {
            skillTitle: sprint.skillTitle,
            currentDay: sprint.currentDay,
            durationDays: sprint.durationDays || 6,
          },
        }),
      });

      const data = await response.json();
      const sparkReply =
        data.reply ||
        "I am here to help. Could you tell me more about what you would like to explore?";
      const emotion = data.emotion || "encouragement";
      const aiChatTitle = data.chatTitle;

      const sparkMessage: SparkChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "spark",
        text: sparkReply,
        mascotSvg: data.mascotSvg || mascotMap[emotion] || "/Huddle SVGs/01_happy.svg",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...newMessages, sparkMessage];
      if (activeSession) {
        const finalSession: SparkChatSession = {
          ...activeSession,
          title: aiChatTitle || activeSession.title,
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
        };
        saveSessions(
          sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
        );
      }

      if (user.id) {
        addMascotMessageToDb(
          { id: `msg-${Date.now() + 1}`, context: "chat", text: sparkReply },
          user.id,
        );
      }

      setCurrentMascotEmotion(emotion);
    } catch {
      const fallbackReply =
        "I am currently having trouble connecting. Let's continue in a moment, or try asking your question again.";
      const errorMsg: SparkChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "spark",
        text: fallbackReply,
        mascotSvg: "/Huddle SVGs/01_happy.svg",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...newMessages, errorMsg];
      if (activeSession) {
        const finalSession: SparkChatSession = {
          ...activeSession,
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
        };
        saveSessions(
          sessions.map((s) => (s.id === finalSession.id ? finalSession : s)),
        );
      }
      setCurrentMascotEmotion("idle");
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setChatInput(question);
  };

  if (!mascotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="flex-1" onClick={() => setMascotOpen(false)} />

      <div className="w-full sm:w-[480px] bg-white dark:bg-[#111218] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-150">
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 flex items-center justify-center shrink-0">
              <img
                src={mascotMap[currentMascotEmotion] || "/Huddle SVGs/01_happy.svg"}
                alt="Spark"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Spark - Your AI Companion
              </h3>
              <p
                className="text-xs text-zinc-500 truncate max-w-[180px] sm:max-w-[220px]"
                title={activeSession?.title}
              >
                {showHistory
                  ? "Conversation history"
                  : activeSession?.title || "Ask questions or explore concepts"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-medium transition-colors cursor-pointer"
              title="Start a new conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showHistory
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
              title="View conversation history"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMascotOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Previous conversations ({sessions.length})
                </h4>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Choose any past conversation to pick up right where you left off.
            </p>

            <div className="space-y-2">
              {sessions.map((sess) => {
                const isActive = sess.id === currentSessionId;
                const dateFormatted = new Date(
                  sess.updatedAt,
                ).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={sess.id}
                    onClick={() => handleSelectSession(sess.id)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between ${
                      isActive
                        ? "border-indigo-500/80 bg-indigo-50/30 dark:bg-indigo-950/20"
                        : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#111218] hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <h5 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {sess.title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span>{dateFormatted}</span>
                        <span>•</span>
                        <span>{sess.messages.length} messages</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`flex items-start gap-3 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "spark" && (
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={m.mascotSvg || "/Huddle SVGs/01_happy.svg"}
                      alt="Spark"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="space-y-1 max-w-[85%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 border border-zinc-200/50 dark:border-zinc-700/50"
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
                      className={`text-[10px] text-zinc-400 px-1 ${
                        m.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2.5 text-zinc-500 text-xs py-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/Huddle SVGs/05_eureka_lightbulb.svg"
                    alt="Thinking"
                    className="w-full h-full object-contain opacity-70"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs flex items-center gap-2">
                  <div className="w-2.5 h-2.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {!showHistory && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {[
                sprint?.tasks?.find((t) => !t.completed)
                  ? `How do I complete "${sprint.tasks.find((t) => !t.completed)?.title}" step by step?`
                  : "What should I complete today to keep my momentum?",
                "How does today's milestone contribute to my bigger goal?",
                "Can you give me practical, actionable guidance for this topic?",
                "What edge cases should I look out for before submitting evidence?",
              ].map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickQuestion(prompt)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Spark anything about your task, code, or growth path..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isThinking}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isThinking}
                className="p-2.5 rounded-xl bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                aria-label="Send message"
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
