"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Grid,
  Zap,
} from "lucide-react";
import { UserActivityDay, fetchUserActivityDays } from "../lib/supabase";
import { useHuddle } from "../context/HuddleContext";

export interface ActivityCalendarProps {
  userId?: string;
  activityDays?: UserActivityDay[];
  userName?: string;
  isOwnProfile?: boolean;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  userId,
  activityDays: initialDays,
  userName = "Engineer",
  isOwnProfile = false,
}) => {
  const { secondsFocusedToday, user } = useHuddle();
  const [days, setDays] = useState<UserActivityDay[]>(initialDays || []);
  const [loading, setLoading] = useState<boolean>(!initialDays);
  const [selectedDay, setSelectedDay] = useState<UserActivityDay | null>(null);
  const [viewMode, setViewMode] = useState<"heatmap" | "monthly">("heatmap");
  const [monthOffset, setMonthOffset] = useState<number>(0);

  useEffect(() => {
    if (initialDays && initialDays.length > 0) {
      setDays(initialDays);
      setLoading(false);
      return;
    }

    const targetId = userId || user.id;
    if (!targetId) return;

    let isMounted = true;
    setLoading(true);
    fetchUserActivityDays(targetId, 84)
      .then((res) => {
        if (isMounted) {
          setDays(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load activity days:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, user.id, initialDays]);

  const processedDays = useMemo(() => {
    if (!days || days.length === 0) return [];
    if (!isOwnProfile) return days;

    const todayStr = new Date().toISOString().split("T")[0];
    const liveMinutesToday = Math.round(secondsFocusedToday / 60);

    return days.map((day) => {
      if (day.date === todayStr) {
        const updatedMinutes = Math.max(day.activeMinutes, liveMinutesToday);
        let intensity: 0 | 1 | 2 | 3 | 4 = 0;
        if (updatedMinutes >= 60) intensity = 4;
        else if (updatedMinutes >= 40) intensity = 3;
        else if (updatedMinutes >= 20) intensity = 2;
        else if (updatedMinutes > 0) intensity = 1;

        return {
          ...day,
          activeMinutes: updatedMinutes,
          drillsCount: Math.max(day.drillsCount, updatedMinutes > 0 ? 1 : 0),
          intensity,
        };
      }
      return day;
    });
  }, [days, isOwnProfile, secondsFocusedToday]);

  const stats = useMemo(() => {
    if (!processedDays || processedDays.length === 0) {
      return {
        totalMinutes: 0,
        totalHours: "0.0",
        activeDaysCount: 0,
        activeDaysRatio: "0%",
        currentStreak: 0,
        bestDayMinutes: 0,
        bestDayDate: null as string | null,
        totalDrills: 0,
      };
    }

    let totalMins = 0;
    let activeCount = 0;
    let bestMins = 0;
    let bestDate: string | null = null;
    let totalDrills = 0;

    processedDays.forEach((d) => {
      totalMins += d.activeMinutes;
      if (d.activeMinutes > 0) activeCount++;
      if (d.activeMinutes > bestMins) {
        bestMins = d.activeMinutes;
        bestDate = d.date;
      }
      totalDrills += d.drillsCount;
    });

    let streak = 0;
    for (let i = processedDays.length - 1; i >= 0; i--) {
      if (processedDays[i].activeMinutes > 0) {
        streak++;
      } else {
        if (i === processedDays.length - 1) continue;
        break;
      }
    }

    const ratio = Math.round(
      (activeCount / Math.max(1, processedDays.length)) * 100,
    );

    return {
      totalMinutes: totalMins,
      totalHours: (totalMins / 60).toFixed(1),
      activeDaysCount: activeCount,
      activeDaysRatio: `${ratio}%`,
      currentStreak: streak,
      bestDayMinutes: bestMins,
      bestDayDate: bestDate,
      totalDrills,
    };
  }, [processedDays]);

  const activeSelected =
    selectedDay ||
    (processedDays.length > 0 ? processedDays[processedDays.length - 1] : null);

  const heatmapWeeks = useMemo(() => {
    if (!processedDays || processedDays.length === 0) return [];

    const weeks: UserActivityDay[][] = [];
    let currentWeek: UserActivityDay[] = [];

    const firstDate = new Date(processedDays[0].date);
    const startDayOfWeek = (firstDate.getDay() + 6) % 7;

    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({
        date: `pad-${i}`,
        activeMinutes: -1,
        drillsCount: 0,
        intensity: 0,
      });
    }

    processedDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [processedDays]);

  const monthLabels = useMemo(() => {
    if (heatmapWeeks.length === 0) return [];
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = "";

    heatmapWeeks.forEach((week, wIdx) => {
      const validDay = week.find((d) => d.activeMinutes >= 0);
      if (validDay) {
        const d = new Date(validDay.date);
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (m !== lastMonth) {
          labels.push({ label: m, weekIndex: wIdx });
          lastMonth = m;
        }
      }
    });

    return labels;
  }, [heatmapWeeks]);

  const targetMonthDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const monthlyCalendarData = useMemo(() => {
    const year = targetMonthDate.getFullYear();
    const month = targetMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const dayMap = new Map<string, UserActivityDay>();
    processedDays.forEach((d) => dayMap.set(d.date, d));

    const leadingBlanks = (firstDay.getDay() + 6) % 7;
    const cells: {
      dateStr: string;
      dayNum: number | null;
      data?: UserActivityDay;
    }[] = [];

    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ dateStr: `blank-start-${i}`, dayNum: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;
      cells.push({
        dateStr: fullDateStr,
        dayNum: d,
        data: dayMap.get(fullDateStr),
      });
    }

    return {
      monthLabel: firstDay.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      cells,
    };
  }, [targetMonthDate, processedDays]);

  const getCellColorClass = (intensity: number, isPad: boolean) => {
    if (isPad) return "invisible";
    switch (intensity) {
      case 1:
        return "bg-emerald-200/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40";
      case 2:
        return "bg-emerald-400/90 dark:bg-emerald-800/80 text-emerald-950 dark:text-emerald-200 border border-emerald-500/40 dark:border-emerald-700/50";
      case 3:
        return "bg-emerald-500 dark:bg-emerald-600 text-white border border-emerald-600/40 dark:border-emerald-500/50 shadow-2xs";
      case 4:
        return "bg-emerald-600 dark:bg-emerald-400 text-white dark:text-zinc-950 border border-emerald-700/50 dark:border-emerald-300/50 ring-1 ring-emerald-500/30";
      case 0:
      default:
        return "bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] text-transparent";
    }
  };

  const formatMinutes = (mins: number) => {
    if (mins <= 0) return "0 mins";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const formatFullDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-[#dcdff2] dark:bg-[#1d2c4e] rounded-md" />
        <div className="h-28 bg-[#f6f7fc] dark:bg-[#141d33] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#dcdff2] dark:border-[#1d2c4e] bg-[#FFFFFF] dark:bg-[#0e1526] p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#dcdff2] dark:border-[#1d2c4e]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#06427D] dark:text-[#e6e9f7]">
              Active Focus & Practice Calendar
            </h2>
          </div>
          <p className="text-xs text-[#5D6080] dark:text-[#BBBCE4] mt-1">
            Verified deliberate engineering focus and drills logged over the
            last 12 weeks.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("heatmap")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === "heatmap"
                ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                : "bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4] hover:text-[#06427D] dark:hover:text-[#e6e9f7]"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>12-Week Grid</span>
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === "monthly"
                ? "bg-[#5420A6] text-[#FFFFFF] shadow-xs"
                : "bg-[#f6f7fc] dark:bg-[#141d33] text-[#5D6080] dark:text-[#BBBCE4] hover:text-[#06427D] dark:hover:text-[#e6e9f7]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Monthly View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
              {stats.totalHours} hrs
            </div>
            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
              Total Focus
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
              {stats.activeDaysCount} Days ({stats.activeDaysRatio})
            </div>
            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
              Active Consistency
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <img
              src="/icons/meteor-svgrepo-com.svg"
              alt="Streak"
              className="w-4 h-4 object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7]">
              {stats.currentStreak} Days
            </div>
            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
              Current Streak
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBBCE4]/20 dark:bg-[#141d33] text-[#5420A6] dark:text-[#A9DAF5] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#06427D] dark:text-[#e6e9f7] truncate">
              {formatMinutes(stats.bestDayMinutes)}
            </div>
            <div className="text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-medium">
              Best Day Record
            </div>
          </div>
        </div>
      </div>

      {viewMode === "heatmap" ? (
        <div className="space-y-3">
          <div className="overflow-x-auto pb-2 pt-1 hide-scrollbar">
            <div className="min-w-[640px] space-y-1.5">
              <div className="flex text-[11px] text-[#5D6080] dark:text-[#BBBCE4] font-semibold pl-8 relative h-4">
                {monthLabels.map((m, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${m.weekIndex * 15 + 32}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 items-start">
                <div className="flex flex-col justify-between text-[10px] text-[#5D6080] dark:text-[#BBBCE4] font-medium h-[105px] pr-1 py-0.5 select-none shrink-0">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>

                <div className="flex gap-1.5">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((day, dIdx) => {
                        const isPad = day.activeMinutes < 0;
                        const isSelected = activeSelected?.date === day.date;

                        return (
                          <button
                            key={dIdx}
                            disabled={isPad}
                            onClick={() => !isPad && setSelectedDay(day)}
                            onMouseEnter={() => !isPad && setSelectedDay(day)}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] transition-all cursor-pointer ${getCellColorClass(
                              day.intensity,
                              isPad,
                            )} ${
                              isSelected
                                ? "ring-2 ring-[#5420A6] dark:ring-[#A9DAF5] scale-125 z-10"
                                : "hover:scale-115 hover:z-10"
                            }`}
                            title={
                              isPad
                                ? ""
                                : `${day.date}: ${formatMinutes(day.activeMinutes)} (${day.drillsCount} drills)`
                            }
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#dcdff2] dark:border-[#1d2c4e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {activeSelected ? (
              <div className="flex items-center gap-2.5 text-xs text-[#06427D] dark:text-[#e6e9f7] animate-in fade-in">
                <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  {formatFullDate(activeSelected.date)}:
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-900/40">
                  {formatMinutes(activeSelected.activeMinutes)} active focus
                </span>
                {activeSelected.drillsCount > 0 && (
                  <span className="text-[#5D6080] dark:text-[#BBBCE4]">
                    • {activeSelected.drillsCount} drill
                    {activeSelected.drillsCount > 1 ? "s" : ""} completed
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-[#5D6080] dark:text-[#BBBCE4]">
                Hover over any day cell to inspect active time.
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-[#5D6080] dark:text-[#BBBCE4] self-end sm:self-auto">
              <span>Less</span>
              <span className="w-3 h-3 rounded-[3px] bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e]" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-200 dark:bg-emerald-950 border border-emerald-300/40 dark:border-emerald-800/40" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-400 dark:bg-emerald-800 border border-emerald-500/40 dark:border-emerald-700/50" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-500 dark:bg-emerald-600 border border-emerald-600/40 dark:border-emerald-500/50" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-600 dark:bg-emerald-400 border border-emerald-700/50 dark:border-emerald-300/50" />
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[#06427D] dark:text-[#e6e9f7]">
              {monthlyCalendarData.monthLabel}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] text-[#06427D] dark:text-[#BBBCE4] cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMonthOffset(0)}
                disabled={monthOffset === 0}
                className={`px-2 py-1 rounded-lg text-xs font-semibold border border-[#dcdff2] dark:border-[#1d2c4e] ${
                  monthOffset === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] cursor-pointer text-[#06427D] dark:text-[#e6e9f7]"
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                disabled={monthOffset >= 0}
                className={`p-1.5 rounded-lg border border-[#dcdff2] dark:border-[#1d2c4e] text-[#06427D] dark:text-[#BBBCE4] ${
                  monthOffset >= 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-[#f6f7fc] dark:hover:bg-[#141d33] cursor-pointer"
                }`}
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span
                key={d}
                className="text-[11px] font-semibold text-[#5D6080] dark:text-[#BBBCE4] py-1"
              >
                {d}
              </span>
            ))}

            {monthlyCalendarData.cells.map((cell, idx) => {
              if (cell.dayNum === null) {
                return (
                  <div
                    key={idx}
                    className="h-14 rounded-lg bg-[#f6f7fc]/40 dark:bg-[#141d33]/20"
                  />
                );
              }

              const data = cell.data;
              const hasActivity = data && data.activeMinutes > 0;
              const isSelected = activeSelected?.date === cell.dateStr;

              return (
                <button
                  key={idx}
                  onClick={() => data && setSelectedDay(data)}
                  className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between items-start text-left transition-all cursor-pointer ${
                    hasActivity
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400"
                      : "bg-[#FFFFFF] dark:bg-[#141d33]/40 border-[#dcdff2] dark:border-[#1d2c4e] hover:border-[#5420A6]"
                  } ${isSelected ? "ring-2 ring-[#5420A6] shadow-xs" : ""}`}
                >
                  <span
                    className={`text-[11px] font-bold ${
                      hasActivity
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-[#5D6080] dark:text-[#BBBCE4]"
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {hasActivity ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                      {formatMinutes(data.activeMinutes)}
                    </span>
                  ) : (
                    <span className="text-[9.5px] text-[#5D6080]/40 dark:text-[#BBBCE4]/40">
                      Rest
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {activeSelected && (
            <div className="p-3 rounded-xl bg-[#f6f7fc] dark:bg-[#141d33] border border-[#dcdff2] dark:border-[#1d2c4e] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-[#06427D] dark:text-[#e6e9f7]">
                  {formatFullDate(activeSelected.date)}:
                </span>
                <span className="text-[#5D6080] dark:text-[#BBBCE4]">
                  {formatMinutes(activeSelected.activeMinutes)} active focus
                  time logged
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#0e1526] text-[11px] font-semibold text-[#06427D] dark:text-[#BBBCE4] border border-[#dcdff2] dark:border-[#1d2c4e]">
                {activeSelected.drillsCount} deliberate drill
                {activeSelected.drillsCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
