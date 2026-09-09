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
  Activity,
  Sliders,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  MessageSquare,
  Filter,
  UserPlus,
  FolderPlus,
  Share2,
  Tag,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  Zap,
  Copy,
  CheckCheck,
  TrendingUp,
  BarChart3,
  ChevronRight,
  ShieldAlert,
  Terminal,
  ArrowUpRight,
  Radio,
  Key,
  ClipboardList,
  Database,
  Download,
  Code2,
  Table,
} from "lucide-react";
import { useHuddle } from "../context/HuddleContext";
import {
  UserProfile,
  AnonymousSquadReport,
  AdminAuditLog,
  AdminStats,
  TaskTemplate,
  CommunityPost,
} from "../types/huddle";
import {
  fetchAdminStats,
  fetchAllUsersAdmin,
  createUserAdmin,
  updateUserFullAdmin,
  deleteUserAdmin,
  updateUserRoleAndStatusAdmin,
  fetchAllSquadsAdmin,
  createSquadAdmin,
  updateSquadAdmin,
  deleteSquadAdmin,
  fetchAllSquadReportsAdmin,
  resolveSquadReportAdmin,
  deleteSquadReportAdmin,
  fetchAllTaskTemplatesAdmin,
  createTaskTemplateAdmin,
  updateTaskTemplateAdmin,
  deleteTaskTemplateAdmin,
  fetchAllDiscussionsAdmin,
  createDiscussionAdmin,
  updateDiscussionAdmin,
  deleteDiscussionAdmin,
  fetchAdminAuditLogs,
} from "../lib/supabase";
import { SurveysView } from "./components/SurveysView";
import { DatabaseExplorerView } from "./components/DatabaseExplorerView";

type AdminTab =
  | "overview"
  | "users"
  | "surveys"
  | "squads"
  | "curriculum"
  | "discussions"
  | "reports"
  | "database"
  | "audit";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, authLoading } = useHuddle();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [privacySafeMode, setPrivacySafeMode] = useState<boolean>(true);
  const [revealedItemIds, setRevealedItemIds] = useState<Set<string>>(
    new Set(),
  );

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
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserProfile | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] =
    useState<boolean>(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    handle: "",
    role: "user" as "user" | "moderator" | "admin",
    status: "active" as "active" | "suspended" | "flagged",
    primaryGoal: "Master System Architecture",
    careerMilestone: "Software Engineer",
  });

  const [squadsList, setSquadsList] = useState<any[]>([]);
  const [squadSearchQuery, setSquadSearchQuery] = useState("");
  const [editingSquad, setEditingSquad] = useState<any | null>(null);
  const [showCreateSquadModal, setShowCreateSquadModal] =
    useState<boolean>(false);
  const [squadForm, setSquadForm] = useState({
    name: "",
    skillFocus: "System Architecture",
    sharedGoal: "Ship 12 deliberate practice tasks this week",
    targetProgress: 12,
    inviteCode: "",
  });

  const [tasksList, setTasksList] = useState<TaskTemplate[]>([]);
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<TaskTemplate | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] =
    useState<boolean>(false);
  const [taskForm, setTaskForm] = useState({
    skillCategory: "System Architecture",
    dayNumber: 1,
    title: "",
    description: "",
    estimatedMinutes: 20,
    taskType: "learn" as "learn" | "build" | "real_world_proof",
    creatorName: "Staff Engineer",
    creatorHandle: "@staff.eng",
    producesArtifact: true,
    artifactTitle: "",
  });

  const [discussionsList, setDiscussionsList] = useState<CommunityPost[]>([]);
  const [editingDiscussion, setEditingDiscussion] =
    useState<CommunityPost | null>(null);
  const [showCreateDiscussionModal, setShowCreateDiscussionModal] =
    useState<boolean>(false);
  const [discussionForm, setDiscussionForm] = useState({
    title: "",
    content: "",
    category: "discussion" as "question" | "discussion" | "code-review" | "tip",
    skillTitle: "System Architecture",
  });

  const [reportsList, setReportsList] = useState<AnonymousSquadReport[]>([]);
  const [reportFilter, setReportFilter] = useState<
    "all" | "pending" | "resolved"
  >("pending");

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    type: "user" | "squad" | "task" | "discussion" | "report";
    id: string;
    name: string;
  } | null>(null);

  const isAdmin = user?.role === "admin";

  const toggleRevealItem = (id: string) => {
    setRevealedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isRevealed = (id: string) =>
    !privacySafeMode || revealedItemIds.has(id);

  const maskEmail = (email: string, id?: string) => {
    if (!email) return "u***@***.com";
    if (id && isRevealed(id)) return email;
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

  const truncateId = (id: string, startChars = 6, endChars = 4) => {
    if (!id) return "";
    if (id.length <= startChars + endChars + 3) return id;
    return `${id.slice(0, startChars)}...${id.slice(-endChars)}`;
  };

  const maskId = (id: string, customItemId?: string) => {
    if (!id) return "••••••••";
    const isItemRevealed = customItemId ? isRevealed(customItemId) : false;
    if (isItemRevealed || !privacySafeMode) {
      return truncateId(id, 6, 4);
    }
    if (id.length <= 6) return "••••••";
    return `${id.slice(0, 3)}••••${id.slice(-3)}`;
  };

  const maskCode = (code: string, id?: string) => {
    if (!code) return "••••";
    if (id && isRevealed(id)) return code;
    if (!privacySafeMode) return code;
    if (code.includes("-")) {
      const parts = code.split("-");
      return `${parts[0]}-••••`;
    }
    return "••••••••";
  };

  const maskDetails = (details: any) => {
    if (!privacySafeMode) return JSON.stringify(details || {});
    const copy = { ...(details || {}) };
    for (const key of Object.keys(copy)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("email") ||
        lowerKey.includes("password") ||
        lowerKey.includes("token") ||
        lowerKey.includes("targetid")
      ) {
        copy[key] = "••••••••";
      }
    }
    return JSON.stringify(copy);
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
        loadedDiscussions,
        loadedLogs,
      ] = await Promise.all([
        fetchAdminStats(),
        fetchAllUsersAdmin(),
        fetchAllSquadsAdmin(),
        fetchAllSquadReportsAdmin(),
        fetchAllTaskTemplatesAdmin(),
        fetchAllDiscussionsAdmin(),
        fetchAdminAuditLogs(),
      ]);

      setStats(loadedStats);
      setUsersList(loadedUsers);
      setSquadsList(loadedSquads);
      setReportsList(loadedReports);
      setTasksList(loadedTasks);
      setDiscussionsList(loadedDiscussions);
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
    if (isAuthenticated && isAdmin) {
      loadAllAdminData();
    }
  }, [isAuthenticated, isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await createUserAdmin(user.id, user.name, userForm);
      if (res.success && res.user) {
        setStatusMessage({
          type: "success",
          text: `User account "${res.user.name}" created successfully.`,
        });
        setUsersList((prev) => [res.user!, ...prev]);
        setShowCreateUserModal(false);
        setUserForm({
          name: "",
          email: "",
          handle: "",
          role: "user",
          status: "active",
          primaryGoal: "Master System Architecture",
          careerMilestone: "Software Engineer",
        });
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to create user account.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error while creating user.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const success = await updateUserFullAdmin(
        user.id,
        user.name,
        selectedUserForEdit.id,
        userForm,
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `User "${userForm.name}" updated successfully.`,
        });
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === selectedUserForEdit.id
              ? {
                  ...u,
                  ...userForm,
                }
              : u,
          ),
        );
        setSelectedUserForEdit(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database rejected user update.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating user.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (targetUserId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteUserAdmin(user.id, user.name, targetUserId);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "User account deleted successfully.",
        });
        setUsersList((prev) => prev.filter((u) => u.id !== targetUserId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to delete user account.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting user.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadForm.name.trim()) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await createSquadAdmin(user.id, user.name, squadForm);
      if (res.success && res.squad) {
        setStatusMessage({
          type: "success",
          text: `Squad "${res.squad.name}" created successfully.`,
        });
        setSquadsList((prev) => [res.squad, ...prev]);
        setShowCreateSquadModal(false);
        setSquadForm({
          name: "",
          skillFocus: "System Architecture",
          sharedGoal: "Ship 12 deliberate practice tasks this week",
          targetProgress: 12,
          inviteCode: "",
        });
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to create squad.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error creating squad.",
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

  const handleDeleteSquad = async (squadId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteSquadAdmin(user.id, user.name, squadId);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Squad and member assignments deleted.",
        });
        setSquadsList((prev) => prev.filter((s) => s.id !== squadId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error deleting squad.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting squad.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.description.trim()) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await createTaskTemplateAdmin(user.id, user.name, taskForm);
      if (res.success && res.task) {
        setStatusMessage({
          type: "success",
          text: `Task "${res.task.title}" added to curriculum.`,
        });
        setTasksList((prev) => [res.task!, ...prev]);
        setShowCreateTaskModal(false);
        setTaskForm({
          skillCategory: "System Architecture",
          dayNumber: 1,
          title: "",
          description: "",
          estimatedMinutes: 20,
          taskType: "learn",
          creatorName: "Staff Engineer",
          creatorHandle: "@staff.eng",
          producesArtifact: true,
          artifactTitle: "",
        });
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to create task template.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error creating task template.",
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

  const handleDeleteTask = async (taskId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteTaskTemplateAdmin(user.id, user.name, taskId);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Task template deleted from curriculum.",
        });
        setTasksList((prev) => prev.filter((t) => t.id !== taskId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to delete curriculum task template.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting task template.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionForm.title.trim() || !discussionForm.content.trim()) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await createDiscussionAdmin(
        user.id,
        user.name,
        discussionForm,
      );
      if (res.success && res.post) {
        const newPost = res.post;
        setStatusMessage({
          type: "success",
          text: `Discussion post "${newPost.title}" published.`,
        });
        setDiscussionsList((prev) => [newPost, ...prev]);
        setShowCreateDiscussionModal(false);
        setDiscussionForm({
          title: "",
          content: "",
          category: "discussion",
          skillTitle: "System Architecture",
        });
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to publish discussion.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error creating discussion.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscussion) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const success = await updateDiscussionAdmin(
        user.id,
        user.name,
        editingDiscussion.id,
        {
          title: discussionForm.title,
          content: discussionForm.content,
          category: discussionForm.category,
        },
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Discussion "${discussionForm.title}" updated.`,
        });
        setDiscussionsList((prev) =>
          prev.map((d) =>
            d.id === editingDiscussion.id
              ? {
                  ...d,
                  title: discussionForm.title,
                  content: discussionForm.content,
                  category: discussionForm.category,
                }
              : d,
          ),
        );
        setEditingDiscussion(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error updating discussion post.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating discussion.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDiscussion = async (postId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteDiscussionAdmin(user.id, user.name, postId);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Discussion post deleted permanently.",
        });
        setDiscussionsList((prev) => prev.filter((p) => p.id !== postId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to delete discussion post.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting discussion.",
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

  const handleDeleteReport = async (reportId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteSquadReportAdmin(
        user.id,
        user.name,
        reportId,
      );
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Safety report deleted from database.",
        });
        setReportsList((prev) => prev.filter((r) => r.id !== reportId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to delete safety report.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting safety report.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const executeDelete = () => {
    if (!deleteConfirmModal) return;
    const { type, id } = deleteConfirmModal;
    if (type === "user") handleDeleteUser(id);
    else if (type === "squad") handleDeleteSquad(id);
    else if (type === "task") handleDeleteTask(id);
    else if (type === "discussion") handleDeleteDiscussion(id);
    else if (type === "report") handleDeleteReport(id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <Shield className="w-4 h-4 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
            Verifying Governance Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#10121a] border border-white/[0.08] rounded-2xl p-7 space-y-6 shadow-2xl text-center backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-white">
              Privilege Level Insufficient
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This executive cockpit requires platform administrator privileges.
              Signed-in identity ({maskEmail(user?.email || "anonymous")}) lacks
              role: <span className="font-mono text-amber-400">admin</span>.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href="/app"
              className="px-4 py-2 rounded-xl bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to App</span>
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-xl border border-white/[0.1] text-zinc-300 hover:bg-white/[0.05] text-xs font-semibold transition-colors inline-flex items-center justify-center"
            >
              Authenticate as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole =
      userRoleFilter === "all" ? true : (u.role || "user") === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredSquads = squadsList.filter((sq) => {
    return (
      sq.name.toLowerCase().includes(squadSearchQuery.toLowerCase()) ||
      sq.skillFocus.toLowerCase().includes(squadSearchQuery.toLowerCase())
    );
  });

  const filteredTasks = tasksList.filter((t) => {
    if (taskCategoryFilter === "all") return true;
    return t.skillCategory === taskCategoryFilter;
  });

  const filteredDiscussions = discussionsList.filter((post) => {
    return (
      post.title.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  });

  const filteredReports = reportsList.filter((r) => {
    if (reportFilter === "pending") return r.status === "pending";
    if (reportFilter === "resolved")
      return r.status === "reviewed" || r.status === "dismissed";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#07080c] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-600 selection:text-white font-sans antialiased relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-80 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-white/[0.07] bg-white/80 dark:bg-[#07080c]/85 backdrop-blur-2xl px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer shadow-xs"
              title="Return to user app"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
                    Huddle Control Plane
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Operational
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  Platform Governance & Data Administration
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setPrivacySafeMode(!privacySafeMode);
                setRevealedItemIds(new Set());
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                privacySafeMode
                  ? "bg-white dark:bg-[#111218] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  : "bg-amber-500/10 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-500/15"
              }`}
              title={
                privacySafeMode
                  ? "Sensitive data (emails, UUIDs, invite codes) is currently masked. Click to reveal plaintext."
                  : "Sensitive data is currently revealed in plaintext. Click to mask."
              }
            >
              {privacySafeMode ? (
                <>
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <EyeOff className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs">
                      Privacy Shield
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Masked
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Eye className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-amber-900 dark:text-amber-200">
                      Privacy Shield
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Revealed
                    </span>
                  </div>
                </>
              )}
            </button>

            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer shadow-xs"
              title="Sync latest records from Supabase"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`}
              />
            </button>

            <div
              className="hidden md:flex items-center gap-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800"
              title={`Logged in as ${user?.name || "Admin"} (${user?.email || "admin@huddle.team"})\nUser ID: ${user?.id || ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-xs ring-1 ring-black/5 dark:ring-white/10 shrink-0">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "SA"}
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs flex items-center gap-1.5">
                  <span>{user?.name || "Sarker Ayon"}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    Super Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div
          className={`border-b text-xs px-4 sm:px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-200 z-30 relative ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="hover:opacity-70 text-zinc-500 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100/80 dark:bg-[#0f111a]/80 border border-zinc-200/70 dark:border-white/[0.06] overflow-x-auto backdrop-blur-md">
          {[
            { id: "overview", label: "Overview", icon: Activity, count: null },
            {
              id: "users",
              label: "Engineers",
              icon: Users,
              count: stats.totalUsers,
            },
            {
              id: "surveys",
              label: "Intake Surveys",
              icon: ClipboardList,
              count: usersList.filter(
                (u) => u.surveyData && u.onboardingCompleted,
              ).length,
            },
            {
              id: "squads",
              label: "Micro-Squads",
              icon: Layers,
              count: stats.totalSquads,
            },
            {
              id: "curriculum",
              label: "Curriculum",
              icon: BookOpen,
              count: stats.totalCurriculumTasks,
            },
            {
              id: "discussions",
              label: "Discussions",
              icon: MessageSquare,
              count: stats.totalDiscussions,
            },
            {
              id: "reports",
              label: "Safety Reports",
              icon: AlertTriangle,
              count: stats.pendingReports,
              alert: stats.pendingReports > 0,
            },
            {
              id: "database",
              label: "Database Explorer",
              icon: Database,
              count: 26,
            },
            {
              id: "audit",
              label: "Audit Logs",
              icon: History,
              count: auditLogs.length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#181a26] text-zinc-950 dark:text-white shadow-sm border border-zinc-200/80 dark:border-white/[0.1]"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                      tab.alert
                        ? "bg-amber-500 text-white animate-pulse"
                        : isActive
                          ? "bg-zinc-100 dark:bg-white/[0.1] text-zinc-900 dark:text-zinc-200"
                          : "bg-zinc-200/70 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Total Engineers
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {stats.totalUsers}
                </div>
                <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14% this sprint</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Micro-Squads
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {stats.totalSquads}
                </div>
                <div className="text-[10px] font-medium text-zinc-500">
                  Avg 4 members/squad
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Active Sprints
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {stats.totalSprints}
                </div>
                <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  4-Day Cadence Live
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Task Templates
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {stats.totalCurriculumTasks}
                </div>
                <div className="text-[10px] font-medium text-zinc-500">
                  4 Curriculum tracks
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Discussions
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white tabular-nums">
                  {stats.totalDiscussions}
                </div>
                <div className="text-[10px] font-medium text-sky-600 dark:text-sky-400">
                  Community active
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-2 shadow-sm hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Pending Reports
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      stats.pendingReports > 0
                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold tracking-tight tabular-nums ${
                    stats.pendingReports > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-950 dark:text-white"
                  }`}
                >
                  {stats.pendingReports}
                </div>
                <div
                  className={`text-[10px] font-semibold ${
                    stats.pendingReports > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {stats.pendingReports > 0 ? "Action Required" : "All Clear"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 dark:border-white/[0.07] bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    Governance Quick Actions
                  </h3>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Instant administrative triggers
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Register User
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Provision profile
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowCreateSquadModal(true)}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-200 dark:hover:border-purple-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Assemble Squad
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      New cohort unit
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-200 dark:hover:border-amber-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Add Drill Template
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Curriculum module
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowCreateDiscussionModal(true)}
                  className="p-3 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-white/[0.02] hover:bg-sky-50/50 dark:hover:bg-sky-950/30 hover:border-sky-200 dark:hover:border-sky-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Post Announcement
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Broadcast update
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm font-bold text-zinc-950 dark:text-white">
                    Recent Administrative Events
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab("audit")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>View all events</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-950 dark:text-zinc-100 flex items-center gap-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                          {log.action}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Target: {log.targetType}{" "}
                        {log.targetId ? `(${maskId(log.targetId)})` : ""}
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-400">
                    No administrative transactions logged yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, handle, or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1019] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1019] text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create User</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200/80 dark:border-white/[0.07] bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email (Masked)</th>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Goal</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                    {filteredUsers.map((u) => {
                      const revealed = isRevealed(u.id);
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.avatar || "/avatars/avatar-1.svg"}
                                alt={u.name}
                                className="w-8 h-8 rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 ring-1 ring-zinc-200 dark:ring-zinc-700"
                              />
                              <div>
                                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                  {u.name}
                                </div>
                                <div className="text-[11px] text-zinc-400 font-mono">
                                  {u.handle}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-zinc-600 dark:text-zinc-400">
                              <span>{maskEmail(u.email, u.id)}</span>
                              <button
                                onClick={() => toggleRevealItem(u.id)}
                                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title={revealed ? "Hide Email" : "Reveal Email"}
                              >
                                {revealed ? (
                                  <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                            <div
                              className="flex items-center gap-1.5"
                              title={`User ID: ${u.id}`}
                            >
                              <span className="tabular-nums font-mono">
                                {maskId(u.id, u.id)}
                              </span>
                              <button
                                onClick={() => toggleRevealItem(u.id)}
                                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title={
                                  revealed ? "Hide ID" : "Reveal Truncated ID"
                                }
                              >
                                {revealed ? (
                                  <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (navigator?.clipboard) {
                                    navigator.clipboard.writeText(u.id);
                                    setStatusMessage({
                                      type: "success",
                                      text: `Copied full User ID (${truncateId(u.id)}) to clipboard`,
                                    });
                                  }
                                }}
                                className="p-1 rounded text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title={`Copy Full ID: ${u.id}`}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === "admin"
                                  ? "bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                                  : u.role === "moderator"
                                    ? "bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300"
                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {u.role || "user"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
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
                              <span className="capitalize">
                                {u.status || "active"}
                              </span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                            {u.primaryGoal || "Master System Architecture"}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedUserForEdit(u);
                                  setUserForm({
                                    name: u.name,
                                    email: u.email,
                                    handle: u.handle,
                                    role: (u.role as any) || "user",
                                    status: (u.status as any) || "active",
                                    primaryGoal:
                                      u.primaryGoal ||
                                      "Master System Architecture",
                                    careerMilestone:
                                      u.careerMilestone || "Software Engineer",
                                  });
                                }}
                                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
                                title="Edit user profile"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirmModal({
                                    type: "user",
                                    id: u.id,
                                    name: u.name,
                                  })
                                }
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "surveys" && (
          <SurveysView
            usersList={usersList}
            privacySafeMode={privacySafeMode}
            isRevealed={isRevealed}
            toggleRevealItem={toggleRevealItem}
            maskEmail={maskEmail}
            maskId={maskId}
            truncateId={truncateId}
          />
        )}

        {activeTab === "squads" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search squads by name or skill focus..."
                  value={squadSearchQuery}
                  onChange={(e) => setSquadSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1019] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <button
                onClick={() => setShowCreateSquadModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Micro-Squad</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSquads.map((sq) => {
                const revealed = isRevealed(sq.id);
                return (
                  <div
                    key={sq.id}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-4 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                            {sq.skillFocus}
                          </span>
                          <h4 className="text-base font-bold text-zinc-950 dark:text-white mt-1.5">
                            {sq.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingSquad(sq);
                              setSquadForm({
                                name: sq.name,
                                skillFocus: sq.skillFocus,
                                sharedGoal: sq.sharedGoal,
                                targetProgress: sq.targetProgress,
                                inviteCode: sq.inviteCode,
                              });
                            }}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Edit squad"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmModal({
                                type: "squad",
                                id: sq.id,
                                name: sq.name,
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete squad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {sq.sharedGoal}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Weekly Target</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {sq.currentProgress || 0} / {sq.targetProgress}{" "}
                          Milestones
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Invite Code:
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-zinc-700 dark:text-zinc-300">
                          <span>{maskCode(sq.inviteCode, sq.id)}</span>
                          <button
                            onClick={() => toggleRevealItem(sq.id)}
                            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            title={revealed ? "Hide Code" : "Reveal Code"}
                          >
                            {revealed ? (
                              <EyeOff className="w-3 h-3 text-amber-500" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                  className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0e1019] text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Curriculum Tracks</option>
                  <option value="System Architecture">
                    System Architecture
                  </option>
                  <option value="Next.js 15 & React 19">
                    Next.js 15 & React 19
                  </option>
                  <option value="Advanced TypeScript Patterns">
                    Advanced TypeScript
                  </option>
                  <option value="API Design & Performance">
                    API Design & Performance
                  </option>
                </select>
                <span className="text-xs text-zinc-500 font-medium">
                  {filteredTasks.length} task templates
                </span>
              </div>

              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-4 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                            Day {t.dayNumber} • {t.taskType}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {t.skillCategory}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-950 dark:text-white mt-1.5">
                          {t.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(t);
                            setTaskForm({
                              skillCategory: t.skillCategory,
                              dayNumber: t.dayNumber,
                              title: t.title,
                              description: t.description,
                              estimatedMinutes: t.estimatedMinutes,
                              taskType: t.taskType,
                              creatorName: t.creatorName || "Staff Engineer",
                              creatorHandle: t.creatorHandle || "@staff.eng",
                              producesArtifact: t.producesArtifact ?? true,
                              artifactTitle: t.artifactTitle || "",
                            });
                          }}
                          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          title="Edit template"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmModal({
                              type: "task",
                              id: t.id,
                              name: t.title,
                            })
                          }
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.estimatedMinutes} mins deliberate drill</span>
                    </span>
                    <span className="font-mono text-zinc-400">
                      Author: {t.creatorName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-zinc-500">
                Manage community posts, technical announcements, and code
                reviews.
              </div>

              <button
                onClick={() => setShowCreateDiscussionModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredDiscussions.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                        {post.category || "discussion"}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {post.title}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                      <span>By {post.authorName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-indigo-500" />{" "}
                        {post.upvotes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-sky-500" />{" "}
                        {post.repliesCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingDiscussion(post);
                        setDiscussionForm({
                          title: post.title,
                          content: post.content,
                          category: (post.category as any) || "discussion",
                          skillTitle: post.skillTitle || "System Architecture",
                        });
                      }}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      title="Edit discussion"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          type: "discussion",
                          id: post.id,
                          name: post.title,
                        })
                      }
                      className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      title="Delete discussion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="p-12 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                  No community posts recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">
                Filter status:
              </span>
              <div className="flex items-center gap-1.5">
                {(["pending", "resolved", "all"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      reportFilter === st
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredReports.map((rep) => {
                const repId = rep.id || "";
                return (
                  <div
                    key={repId || Math.random()}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl border border-zinc-200/70 dark:border-white/[0.07] space-y-3 shadow-sm hover:border-indigo-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              rep.status === "pending"
                                ? "bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                : "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {rep.status}
                          </span>
                          <span className="text-xs font-semibold text-zinc-950 dark:text-white capitalize">
                            Reason: {rep.reasonCategory || "unspecified"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1">
                          "{rep.details || "No details provided"}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rep.status === "pending" && repId && (
                          <>
                            <button
                              onClick={() =>
                                handleResolveReport(repId, "reviewed")
                              }
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Mark Reviewed
                            </button>
                            <button
                              onClick={() =>
                                handleResolveReport(repId, "dismissed")
                              }
                              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {repId && (
                          <button
                            onClick={() =>
                              setDeleteConfirmModal({
                                type: "report",
                                id: repId,
                                name: `Report #${repId.slice(0, 6)}`,
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete safety report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
                      <span>Squad: {rep.squadId || "Unassigned"}</span>
                      <span>Report ID: {maskId(repId)}</span>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="p-12 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                  No moderation reports matching filter.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "database" && (
          <DatabaseExplorerView
            privacySafeMode={privacySafeMode}
            isRevealed={isRevealed}
            toggleRevealItem={toggleRevealItem}
            maskEmail={maskEmail}
            maskId={maskId}
            truncateId={truncateId}
          />
        )}

        {activeTab === "audit" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                Immutable record of administrative actions and schema
                alterations.
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {auditLogs.length} events recorded
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#0e1019]/80 backdrop-blur-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200/80 dark:border-white/[0.07] bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target Type</th>
                      <th className="py-3 px-4">Target ID</th>
                      <th className="py-3 px-4">Parameters (Masked)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-zinc-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          {log.adminName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-500 capitalize">
                          {log.targetType}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          {maskId(log.targetId || "", log.targetId)}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 max-w-xs truncate">
                          {maskDetails(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Create New User Profile
                </h3>
              </div>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  placeholder="Sarah Jenkins"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  placeholder="sarah@example.com"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Status
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Primary Goal
                </label>
                <input
                  type="text"
                  value={userForm.primaryGoal}
                  onChange={(e) =>
                    setUserForm({ ...userForm, primaryGoal: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Update User Profile
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Status
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Career Milestone Target
                </label>
                <input
                  type="text"
                  value={userForm.careerMilestone}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      careerMilestone: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateSquadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Assemble New Micro-Squad
                </h3>
              </div>
              <button
                onClick={() => setShowCreateSquadModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.name}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, name: e.target.value })
                  }
                  placeholder="Distributed Systems Guild"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Skill Focus
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.skillFocus}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, skillFocus: e.target.value })
                  }
                  placeholder="System Architecture"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Shared Weekly Goal
                </label>
                <textarea
                  value={squadForm.sharedGoal}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, sharedGoal: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[64px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSquadModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Create Squad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Update Squad Settings
                </h3>
              </div>
              <button
                onClick={() => setEditingSquad(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSquad} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.name}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Skill Focus
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.skillFocus}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, skillFocus: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Shared Weekly Goal
                </label>
                <textarea
                  value={squadForm.sharedGoal}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, sharedGoal: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[64px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSquad(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Squad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Create Curriculum Task Template
                </h3>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Track Category
                  </label>
                  <select
                    value={taskForm.skillCategory}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        skillCategory: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="System Architecture">
                      System Architecture
                    </option>
                    <option value="Next.js 15 & React 19">
                      Next.js 15 & React 19
                    </option>
                    <option value="Advanced TypeScript Patterns">
                      Advanced TypeScript
                    </option>
                    <option value="API Design & Performance">
                      API Design & Performance
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Day Number (1-4)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={taskForm.dayNumber}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        dayNumber: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  placeholder="Build Zero-Downtime Event Queue Pipeline"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Duration (Minutes)
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
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="learn">Learn</option>
                    <option value="build">Build</option>
                    <option value="real_world_proof">Real World Proof</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Instruction & Acceptance Criteria
                </label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[80px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Create Drill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Edit Curriculum Drill
                </h3>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Drill Title
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                  >
                    <option value="learn">Learn</option>
                    <option value="build">Build</option>
                    <option value="real_world_proof">Real World Proof</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Instruction & Acceptance Criteria
                </label>
                <textarea
                  required
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[96px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateDiscussionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Post Technical Discussion
                </h3>
              </div>
              <button
                onClick={() => setShowCreateDiscussionModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateDiscussion}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={discussionForm.title}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="RFC: Architectural Sprint Updates"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Category
                </label>
                <select
                  value={discussionForm.category}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                >
                  <option value="discussion">Discussion</option>
                  <option value="question">Question</option>
                  <option value="code-review">Code Review</option>
                  <option value="tip">Tip</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Content
                </label>
                <textarea
                  required
                  value={discussionForm.content}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[96px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateDiscussionModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#11131e] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  Edit Discussion
                </h3>
              </div>
              <button
                onClick={() => setEditingDiscussion(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveDiscussion}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={discussionForm.title}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Category
                </label>
                <select
                  value={discussionForm.category}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white"
                >
                  <option value="discussion">Discussion</option>
                  <option value="question">Question</option>
                  <option value="code-review">Code Review</option>
                  <option value="tip">Tip</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Content
                </label>
                <textarea
                  required
                  value={discussionForm.content}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0b10] text-xs text-zinc-950 dark:text-white min-h-[96px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingDiscussion(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#11131e] border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Confirm Permanent Deletion
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-zinc-950 dark:text-white">
                  "{deleteConfirmModal.name}"
                </span>
                ? This action will be permanently recorded in the admin audit
                log.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {actionLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
