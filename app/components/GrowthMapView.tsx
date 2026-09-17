"use client";

import React, { useState } from "react";
import { Zap, Check, Play, Clock, Sparkles } from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import { SprintTaskModal } from "./SprintTaskModal";
import { SprintTask } from "../types/huddle";

interface NodeData {
  id: string;
  dayNumber: number;
  label: string; // "Day 1", "Day 2", "Today", "Lighter", "Locked"
  status: "done" | "today" | "lighter" | "locked";
  x: number; // percentage in SVG (0 to 100)
  y: number; // percentage in SVG (0 to 100)
  title: string;
  description: string;
  durationMinutes: number;
}

export const GrowthMapView: React.FC = () => {
  const { user, sprint, setMascotOpen } = useHuddle();

  const [activeTask, setActiveTask] = useState<SprintTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const skillName = sprint?.skillTitle || user.surveyData?.skill || "Public speaking";

  // The 5 nodes matching the exact layout and undulating coordinates from the screenshot
  const nodes: NodeData[] = [
    {
      id: "node-1",
      dayNumber: 1,
      label: "Day 1",
      status: "done",
      x: 14,
      y: 68,
      title: "Foundational Vocal Cadence & Pacing",
      description: "Mastered deliberate pauses, eliminating filler words, and vocal inflection.",
      durationMinutes: 15,
    },
    {
      id: "node-2",
      dayNumber: 2,
      label: "Day 2",
      status: "done",
      x: 34,
      y: 28,
      title: "Story Hook & Problem-Statement Architecture",
      description: "Crafted compelling 60-second narrative hooks for audience retention.",
      durationMinutes: 20,
    },
    {
      id: "node-3",
      dayNumber: 3,
      label: "Today",
      status: "today",
      x: 54,
      y: 62,
      title: "High-Stakes Live Delivery & Micro-Pauses",
      description: "Deliberate practice recording a 3-minute pitch with natural eye contact.",
      durationMinutes: 30,
    },
    {
      id: "node-4",
      dayNumber: 4,
      label: "Lighter",
      status: "lighter",
      x: 74,
      y: 24,
      title: "Micro-Reflection & Body Language Audit",
      description: "Light 10-min reflection and posture alignment review.",
      durationMinutes: 12,
    },
    {
      id: "node-5",
      dayNumber: 5,
      label: "Locked",
      status: "locked",
      x: 90,
      y: 58,
      title: "Final Capstone: Unscripted Q&A Drill",
      description: "Simulated rapid-fire audience questions with confident clarity.",
      durationMinutes: 25,
    },
  ];

  const handleLaunchToday = (node: NodeData) => {
    if (node.status === "locked") return;

    const taskToLaunch: SprintTask = {
      id: node.id,
      dayNumber: node.dayNumber,
      title: node.title,
      description: node.description,
      type: "build",
      creatorName: "Spark",
      creatorHandle: "@spark_ai",
      creatorAvatar: "/mascot_idle.svg",
      estimatedMinutes: node.durationMinutes,
      completed: node.status === "done",
      realWorldActionDescription: node.description,
    };

    setActiveTask(taskToLaunch);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6 py-6 sm:py-10 space-y-10 animate-in fade-in duration-200 select-none">
      {/* Header matching screenshot: Skill · Spark adapted this today / Your growth map */}
      <div>
        <div className="text-xs sm:text-sm text-zinc-400 font-normal">
          {skillName} · Spark adapted this today
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
          Your growth map
        </h1>
      </div>

      {/* Undulating Node Map Graph (Matches Screenshot Visual Exactly) */}
      <div className="relative w-full h-64 sm:h-80 flex items-center justify-center">
        {/* SVG Connecting Lines (Solid for completed, dashed for future) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
        >
          {/* Line 1 -> 2 (Solid) */}
          <line
            x1="140"
            y1="204"
            x2="340"
            y2="84"
            stroke="#4b5563"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Line 2 -> 3 (Solid) */}
          <line
            x1="340"
            y1="84"
            x2="540"
            y2="186"
            stroke="#4b5563"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Line 3 -> 4 (Dashed) */}
          <line
            x1="540"
            y1="186"
            x2="740"
            y2="72"
            stroke="#4b5563"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />

          {/* Line 4 -> 5 (Dashed) */}
          <line
            x1="740"
            y1="72"
            x2="900"
            y2="174"
            stroke="#4b5563"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes (Circles + Labels) */}
        {nodes.map((node) => {
          const isDone = node.status === "done";
          const isToday = node.status === "today";
          const isLighter = node.status === "lighter";
          const isLocked = node.status === "locked";

          return (
            <div
              key={node.id}
              onClick={() => {
                setSelectedNode(node);
                if (isToday) handleLaunchToday(node);
              }}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              {/* Circular Node Icon */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-white shadow-lg transition-all duration-200 group-hover:scale-110 ${
                  isDone
                    ? "bg-[#10754e] border-2 border-[#10754e]"
                    : isToday
                    ? "bg-[#5b50d6] border-2 border-[#6c62e2] ring-4 ring-[#5b50d6]/30 animate-pulse"
                    : isLighter
                    ? "bg-[#b45309] border-2 border-[#d97706]"
                    : "bg-[#374151] border-2 border-[#4b5563]"
                }`}
              >
                {isDone ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                ) : (
                  <span>{node.dayNumber}</span>
                )}
              </div>

              {/* Node Label Underneath */}
              <span
                className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${
                  isToday
                    ? "text-white font-semibold"
                    : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                {node.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spark Adaptation Callout Card (Matches Screenshot Exactly) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#18191e] border border-zinc-800/80 max-w-2xl flex items-start gap-3.5 shadow-sm">
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-zinc-200 font-normal leading-relaxed">
          Spark noticed day 3 took longer than planned, so day 4 is a shorter, lighter task.
        </p>
      </div>

      {/* Node Detail Drawer / Modal when clicked */}
      {selectedNode && (
        <div className="p-4 rounded-2xl bg-[#14151a] border border-zinc-800 text-xs text-zinc-300 max-w-2xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedNode.status === "done"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : selectedNode.status === "today"
                    ? "bg-indigo-900 text-indigo-200 border border-indigo-700"
                    : selectedNode.status === "lighter"
                    ? "bg-amber-950 text-amber-300 border border-amber-800"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                Day {selectedNode.dayNumber} · {selectedNode.label}
              </span>
              <span className="text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedNode.durationMinutes} mins
              </span>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="font-semibold text-white text-sm">
            {selectedNode.title}
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {selectedNode.description}
          </p>

          {selectedNode.status === "today" && (
            <button
              onClick={() => handleLaunchToday(selectedNode)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Launch Today's Drill</span>
            </button>
          )}
        </div>
      )}

      {/* Sprint Task Modal */}
      {isTaskModalOpen && activeTask && (
        <SprintTaskModal
          task={activeTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  );
};
