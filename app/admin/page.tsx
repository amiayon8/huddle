"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Layers,
  FileCheck,
  AlertTriangle,
  History,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowLeft,
  ExternalLink,
  Edit2,
  Check,
  X,
  Database,
  Activity,
  Sliders,
  AlertCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import {
  UserProfile,
  AnonymousSquadReport,
  AdminAuditLog,
  AdminStats,
  TaskTemplate,
} from "../types/huddle";
import {
  fetchAdminStats,
  fetchAllUsersAdmin,
  updateUserRoleAndStatusAdmin,
  fetchAllSquadsAdmin,
  updateSquadAdmin,
  fetchAllSquadReportsAdmin,
  resolveSquadReportAdmin,
  fetchAllTaskTemplatesAdmin,
  updateTaskTemplateAdmin,
  fetchAdminAuditLogs,
} from "../lib/supabase";

type AdminTab =
  | "overview"
  | "users"
  | "squads"
  | "reports"
  | "curriculum"
  | "audit";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, authLoading } = useHuddle();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [privacySafeMode, setPrivacySafeMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSquads: 0,
    totalSprints: 0,
    totalReports: 0,
    pendingReports: 0,
    totalCurriculumTasks: 0,
    totalDiscussions: 0,
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserProfile | null>(null);

  const [squadsList, setSquadsList] = useState<any[]>([]);
  const [editingSquad, setEditingSquad] = useState<any | null>(null);
  const [squadForm, setSquadForm] = useState({
    name: "",
    skillFocus: "",
    sharedGoal: "",
    targetProgress: 12,
  });

  const [reportsList, setReportsList] = useState<AnonymousSquadReport[]>([]);
  const [reportFilter, setReportFilter] = useState<
    "all" | "pending" | "resolved"
  >("pending");

  const [tasksList, setTasksList] = useState<TaskTemplate[]>([]);
  const [editingTask, setEditingTask] = useState<TaskTemplate | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    estimatedMinutes: 20,
    taskType: "learn" as "learn" | "build" | "real_world_proof",
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  const isAdmin = user?.role === "admin";

  const maskEmail = (email: string) => {
    if (!email) return "u***@***.com";
    if (!privacySafeMode) return email;
    const parts = email.split("@");
    if (parts.length !== 2) return "u***@***.com";
    const name = parts[0];
    const domain = parts[1];
    const maskedName =
      name.length <= 2
        ? `${name[0]}*`
        : `${name.substring(0, 2)}***${name.slice(-1)}`;
    const maskedDomain =
      domain.length <= 4
        ? "***.com"
        : `${domain[0]}***.${domain.split(".").pop()}`;
    return `${maskedName}@${maskedDomain}`;
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const [
        loadedStats,
        loadedUsers,
        loadedSquads,
        loadedReports,
        loadedTasks,
        loadedLogs,
      ] = await Promise.all([
        fetchAdminStats(),
        fetchAllUsersAdmin(),
        fetchAllSquadsAdmin(),
        fetchAllSquadReportsAdmin(),
        fetchAllTaskTemplatesAdmin(),
        fetchAdminAuditLogs(),
      ]);

      setStats(loadedStats);
      setUsersList(loadedUsers);
      setSquadsList(loadedSquads);
      setReportsList(loadedReports);
      setTasksList(loadedTasks);
      setAuditLogs(loadedLogs);
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to load admin data from database. Check connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadAllAdminData();
    }
  }, [authLoading, isAdmin]);

  const handleUpdateUserPermissions = async (
    targetUserId: string,
    newRole: "admin" | "user" | "moderator",
    newStatus: "active" | "suspended" | "flagged",
  ) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await updateUserRoleAndStatusAdmin(
        user.id,
        user.name,
        targetUserId,
        newRole,
        newStatus,
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Permissions updated successfully for user ID ${targetUserId}.`,
        });
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === targetUserId
              ? { ...u, role: newRole, status: newStatus }
              : u,
          ),
        );
        setSelectedUserForEdit(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database rejected user update. Please verify privileges.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating user permissions.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSquad) return;
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await updateSquadAdmin(
        user.id,
        user.name,
        editingSquad.id,
        squadForm,
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Squad "${squadForm.name}" updated successfully.`,
        });
        setSquadsList((prev) =>
          prev.map((sq) =>
            sq.id === editingSquad.id ? { ...sq, ...squadForm } : sq,
          ),
        );
        setEditingSquad(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error while updating squad settings.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating squad.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveReport = async (
    reportId: string,
    resolution: "reviewed" | "dismissed",
  ) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await resolveSquadReportAdmin(
        user.id,
        user.name,
        reportId,
        resolution,
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Report marked as ${resolution}.`,
        });
        setReportsList((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, status: resolution } : r,
          ),
        );
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to update report status.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating report.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await updateTaskTemplateAdmin(
        user.id,
        user.name,
        editingTask.id,
        taskForm,
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Task template "${taskForm.title}" updated in database.`,
        });
        setTasksList((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...t, ...taskForm } : t,
          ),
        );
        setEditingTask(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error updating curriculum task.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating curriculum.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-500">
            Verifying administrative session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Access Restricted
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This environment is restricted to verified administrators. Your
              account ({user?.email || "anonymous"}) does not possess the
              required administrative privileges.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href="/app"
              className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors hover:opacity-90 inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-colors inline-flex items-center justify-center"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
  );

  const filteredReports = reportsList.filter((r) => {
    if (reportFilter === "pending") return r.status === "pending";
    if (reportFilter === "resolved")
      return r.status === "reviewed" || r.status === "dismissed";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-600 selection:text-white">
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#090a0f]/95 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Return to user app"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Huddle Admin Console</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    PostgreSQL Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPrivacySafeMode(!privacySafeMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                privacySafeMode
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
              }`}
              title="Toggle automatic PII masking"
            >
              {privacySafeMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Privacy Safe Mode Active</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>PII Revealed (Audited)</span>
                </>
              )}
            </button>

            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="p-1 hover:opacity-75"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <nav className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            {
              id: "users",
              label: `Users (${stats.totalUsers})`,
              icon: Users,
            },
            {
              id: "squads",
              label: `Micro-Squads (${stats.totalSquads})`,
              icon: Layers,
            },
            {
              id: "reports",
              label: `Safety Reports (${stats.pendingReports} pending)`,
              icon: AlertTriangle,
            },
            {
              id: "curriculum",
              label: `Curriculum (${stats.totalCurriculumTasks})`,
              icon: BookOpen,
            },
            {
              id: "audit",
              label: "Security Audit Log",
              icon: History,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Registered Users
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stats.totalUsers}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Active Squads
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stats.totalSquads}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Practice Sprints
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stats.totalSprints}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Curriculum Tasks
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stats.totalCurriculumTasks}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Discussions
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stats.totalDiscussions}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  Pending Reports
                </span>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {stats.pendingReports}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      PostgreSQL Infrastructure Health
                    </h2>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    Online & Healthy
                  </span>
                </div>
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                    <span>Engine Version</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">
                      PostgreSQL 17 (ap-south-1)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                    <span>Admin Audit Logging</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Enabled (public.admin_audit_logs)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                    <span>Active Admin Identity</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">
                      {user.name} ({user.id})
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Privacy Policy Enforcement</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      Strict (PII Masked by Default)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Recent Administrative Events
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("audit")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {log.action}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          Target: {log.targetType} {log.targetId ? `(${log.targetId})` : ""}
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      No administrative changes recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name, handle, or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span>Showing {filteredUsers.length} users</span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email (Masked)</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Privacy Opt-outs</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatar || "/avatars/avatar-1.svg"}
                              alt={u.name}
                              className="w-7 h-7 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-zinc-500 font-mono">
                                {u.handle}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono text-zinc-600 dark:text-zinc-400">
                            {maskEmail(u.email)}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                                : u.role === "moderator"
                                  ? "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            {u.role || "user"}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                              u.status === "suspended"
                                ? "text-rose-600 dark:text-rose-400"
                                : u.status === "flagged"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "suspended"
                                  ? "bg-rose-500"
                                  : u.status === "flagged"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                            />
                            <span>{u.status || "active"}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {!u.privacy.publicProfile && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                Private Profile
                              </span>
                            )}
                            {!u.privacy.showSquad && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                Hidden Squad
                              </span>
                            )}
                            {u.privacy.publicProfile && u.privacy.showSquad && (
                              <span className="text-[10px] text-zinc-400">
                                Standard Public
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedUserForEdit(u)}
                            className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedUserForEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Manage User Permissions
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedUserForEdit(null)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedUserForEdit.name} ({selectedUserForEdit.handle})
                    </div>
                    <div className="text-zinc-500 font-mono">
                      Email: {maskEmail(selectedUserForEdit.email)}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      User ID: {selectedUserForEdit.id}
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Platform Role
                      </label>
                      <select
                        id="user-role-select"
                        defaultValue={selectedUserForEdit.role || "user"}
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="user">User (Standard Access)</option>
                        <option value="moderator">
                          Moderator (Review Reports)
                        </option>
                        <option value="admin">
                          Admin (Full System Management)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Account Status
                      </label>
                      <select
                        id="user-status-select"
                        defaultValue={selectedUserForEdit.status || "active"}
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                      >
                        <option value="active">Active</option>
                        <option value="flagged">Flagged for Review</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
                      All changes are recorded in the security audit log with
                      your administrator identity.
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setSelectedUserForEdit(null)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        const roleEl = document.getElementById(
                          "user-role-select",
                        ) as HTMLSelectElement;
                        const statusEl = document.getElementById(
                          "user-status-select",
                        ) as HTMLSelectElement;
                        if (roleEl && statusEl) {
                          handleUpdateUserPermissions(
                            selectedUserForEdit.id,
                            roleEl.value as any,
                            statusEl.value as any,
                          );
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {actionLoading ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      <span>Save Updates</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "squads" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {squadsList.map((sq) => (
                <div
                  key={sq.id}
                  className="p-5 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {sq.name}
                      </h3>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        {sq.skillFocus}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingSquad(sq);
                        setSquadForm({
                          name: sq.name,
                          skillFocus: sq.skillFocus,
                          sharedGoal: sq.sharedGoal || "",
                          targetProgress: sq.targetProgress || 12,
                        });
                      }}
                      className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      title="Edit squad"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Weekly Goal:
                    </span>{" "}
                    {sq.sharedGoal || "Collaborative milestone practice"}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                      Members ({(sq.members || []).length} / 4)
                    </div>
                    <div className="space-y-1.5">
                      {(sq.members || []).map((m: any) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-zinc-50/50 dark:bg-zinc-900/30"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={m.avatar || "/avatars/avatar-1.svg"}
                              alt={m.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                              {m.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {editingSquad && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="w-full max-w-md bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Update Squad Configuration
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingSquad(null)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSquad} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Squad Name
                      </label>
                      <input
                        type="text"
                        value={squadForm.name}
                        onChange={(e) =>
                          setSquadForm({ ...squadForm, name: e.target.value })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Skill Focus
                      </label>
                      <input
                        type="text"
                        value={squadForm.skillFocus}
                        onChange={(e) =>
                          setSquadForm({
                            ...squadForm,
                            skillFocus: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Shared Weekly Goal
                      </label>
                      <textarea
                        value={squadForm.sharedGoal}
                        onChange={(e) =>
                          setSquadForm({
                            ...squadForm,
                            sharedGoal: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 min-h-[64px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Target Progress Milestones
                      </label>
                      <input
                        type="number"
                        value={squadForm.targetProgress}
                        onChange={(e) =>
                          setSquadForm({
                            ...squadForm,
                            targetProgress: parseInt(e.target.value) || 12,
                          })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setEditingSquad(null)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {actionLoading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        <span>Save Squad Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    reportFilter === "pending"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                      : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Pending Action ({stats.pendingReports})
                </button>
                <button
                  onClick={() => setReportFilter("resolved")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    reportFilter === "resolved"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Reviewed & Dismissed
                </button>
                <button
                  onClick={() => setReportFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    reportFilter === "all"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  All Reports ({reportsList.length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300">
                        {r.reasonCategory.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Reported: {r.reportedMemberName}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        (Squad: {r.squadId})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      "{r.details || "No additional commentary provided."}"
                    </p>

                    <div className="text-[10px] text-zinc-400">
                      Logged:{" "}
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : "Recent"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {r.status === "pending" ? (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleResolveReport(r.id!, "reviewed")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Reviewed</span>
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() =>
                            handleResolveReport(r.id!, "dismissed")
                          }
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-zinc-500 capitalize">
                        Status: {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="p-8 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                  No moderation reports matching the selected filter.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-xs text-zinc-500">
              Manage live practice tasks across all 4-day sprint curriculums.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasksList.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                          Day {t.dayNumber} • {t.taskType}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {t.skillCategory}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                        {t.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTask(t);
                        setTaskForm({
                          title: t.title,
                          description: t.description,
                          estimatedMinutes: t.estimatedMinutes,
                          taskType: t.taskType,
                        });
                      }}
                      className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {t.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{t.estimatedMinutes} mins drill</span>
                    </span>
                    <span className="font-mono text-zinc-400">
                      Author: {t.creatorName}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {editingTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="w-full max-w-lg bg-white dark:bg-[#111218] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Edit Curriculum Task Template
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) =>
                          setTaskForm({ ...taskForm, title: e.target.value })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-medium text-zinc-700 dark:text-zinc-300">
                          Estimated Minutes
                        </label>
                        <input
                          type="number"
                          value={taskForm.estimatedMinutes}
                          onChange={(e) =>
                            setTaskForm({
                              ...taskForm,
                              estimatedMinutes: parseInt(e.target.value) || 20,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-medium text-zinc-700 dark:text-zinc-300">
                          Task Type
                        </label>
                        <select
                          value={taskForm.taskType}
                          onChange={(e) =>
                            setTaskForm({
                              ...taskForm,
                              taskType: e.target.value as any,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100"
                        >
                          <option value="learn">Learn</option>
                          <option value="build">Build</option>
                          <option value="real_world_proof">
                            Real World Proof
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-zinc-700 dark:text-zinc-300">
                        Task Description
                      </label>
                      <textarea
                        value={taskForm.description}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0f1015] text-xs text-zinc-900 dark:text-zinc-100 min-h-[96px]"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {actionLoading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        <span>Save Template</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                Immutable chronological log of all administrative actions in
                PostgreSQL.
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {auditLogs.length} events recorded
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111218] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Parameters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                          {log.adminName}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                            {log.action}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                          <span className="capitalize">{log.targetType}</span>
                          {log.targetId && (
                            <span className="text-zinc-400 font-mono text-[10px] ml-1">
                              ({log.targetId})
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-500 max-w-xs truncate">
                          {JSON.stringify(log.details || {})}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-zinc-400 text-xs"
                        >
                          No administrative actions recorded in audit log.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
