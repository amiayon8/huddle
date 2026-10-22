"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Layers,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Activity,
  AlertCircle,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  MessageSquare,
  UserPlus,
  FolderPlus,
  ThumbsUp,
  MessageCircle,
  Copy,
  ClipboardList,
  Database,
  History,
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
import { getUserAvatarUrl } from "../lib/gravatar";

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

  const maskCode = (code: string, id: string) => {
    if (!code) return "••••••";
    if (isRevealed(id) || !privacySafeMode) return code;
    return "••••••";
  };

  const maskDetails = (details: any) => {
    if (!details) return "";
    if (!privacySafeMode) return JSON.stringify(details);
    const serialized = JSON.stringify(details);
    return serialized.replace(
      /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g,
      "[email protected]",
    );
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const [
        statsData,
        usersData,
        squadsData,
        tasksData,
        discussionsData,
        reportsData,
        auditData,
      ] = await Promise.all([
        fetchAdminStats(),
        fetchAllUsersAdmin(),
        fetchAllSquadsAdmin(),
        fetchAllTaskTemplatesAdmin(),
        fetchAllDiscussionsAdmin(),
        fetchAllSquadReportsAdmin(),
        fetchAdminAuditLogs(),
      ]);

      setStats(statsData);
      setUsersList(usersData);
      setSquadsList(squadsData);
      setTasksList(tasksData);
      setDiscussionsList(discussionsData);
      setReportsList(reportsData);
      setAuditLogs(auditData);
    } catch {
      setStatusMessage({
        type: "error",
        text: "Failed to load admin data from Supabase.",
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
    if (!userForm.name || !userForm.email) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const generatedHandle =
        userForm.handle.trim() ||
        `@${userForm.name.toLowerCase().replace(/\s+/g, ".")}`;

      const res = await createUserAdmin(user.id, user.name, {
        name: userForm.name,
        email: userForm.email,
        handle: generatedHandle,
        role: userForm.role,
        status: userForm.status,
        primaryGoal: userForm.primaryGoal,
        careerMilestone: userForm.careerMilestone,
      });

      if (res.success && res.user) {
        setStatusMessage({
          type: "success",
          text: `User ${res.user.name} created successfully.`,
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
          text: res.error || "Failed to create user profile.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error creating user profile.",
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
        {
          name: userForm.name,
          role: userForm.role,
          status: userForm.status,
          primaryGoal: userForm.primaryGoal,
          careerMilestone: userForm.careerMilestone,
        },
      );

      if (success) {
        setStatusMessage({
          type: "success",
          text: `Profile for ${userForm.name} updated.`,
        });
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === selectedUserForEdit.id ? { ...u, ...userForm } : u,
          ),
        );
        setSelectedUserForEdit(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error while updating user record.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error updating user record.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteUserAdmin(user.id, user.name, userId);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "User profile deleted from database.",
        });
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        setDeleteConfirmModal(null);
        const updatedStats = await fetchAdminStats();
        setStats(updatedStats);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error while deleting user profile.",
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
      const res = await createSquadAdmin(user.id, user.name, {
        name: squadForm.name,
        skillFocus: squadForm.skillFocus,
        sharedGoal: squadForm.sharedGoal,
        targetProgress: squadForm.targetProgress,
        inviteCode:
          squadForm.inviteCode ||
          `HUDDLE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      });

      if (res.success && res.squad) {
        setStatusMessage({
          type: "success",
          text: `Squad "${res.squad.name}" created.`,
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
          text: "Task template deleted.",
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
          text: "Database error deleting task template.",
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
      const res = await createDiscussionAdmin(user.id, user.name, {
        title: discussionForm.title,
        content: discussionForm.content,
        category: discussionForm.category,
        skillTitle: discussionForm.skillTitle,
      });

      if (res.success && res.post) {
        setStatusMessage({
          type: "success",
          text: "Discussion broadcast published.",
        });
        setDiscussionsList((prev) => [res.post!, ...prev]);
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
        text: err.message || "Network error publishing discussion.",
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
          text: "Discussion post updated.",
        });
        setDiscussionsList((prev) =>
          prev.map((d) =>
            d.id === editingDiscussion.id ? { ...d, ...discussionForm } : d,
          ),
        );
        setEditingDiscussion(null);
        const refreshedLogs = await fetchAdminAuditLogs();
        setAuditLogs(refreshedLogs);
      } else {
        setStatusMessage({
          type: "error",
          text: "Database error updating discussion.",
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

  const handleDeleteDiscussion = async (discussionId: string) => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const success = await deleteDiscussionAdmin(
        user.id,
        user.name,
        discussionId,
      );
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Discussion post removed from community.",
        });
        setDiscussionsList((prev) => prev.filter((d) => d.id !== discussionId));
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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Access Restricted
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This area requires administrator permissions. Signed in as{" "}
              <span className="font-mono">{maskEmail(user?.email || "")}</span>.
            </p>
          </div>
          <div className="pt-2 flex gap-2">
            <Link
              href="/app"
              className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Return to App
            </Link>
            <Link
              href="/auth/login"
              className="px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Change Account
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

  const pendingReportsList = reportsList.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 sm:px-6 py-2.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Return to App"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Huddle Admin
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setPrivacySafeMode(!privacySafeMode);
                setRevealedItemIds(new Set());
              }}
              className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors cursor-pointer ${
                privacySafeMode
                  ? "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  : "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
              }`}
              title="Toggle masking for sensitive emails and IDs"
            >
              Privacy: {privacySafeMode ? "Masked" : "Revealed"}
            </button>

            <button
              onClick={loadAllAdminData}
              disabled={loading}
              className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Refresh dataset"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            <div className="text-zinc-500 font-mono text-[11px] pl-2 border-l border-zinc-200 dark:border-zinc-800 hidden sm:block">
              {user?.email || "admin"}
            </div>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div
          className={`border-b text-xs px-4 sm:px-6 py-2 flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto text-xs">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users", count: stats.totalUsers },
            {
              id: "surveys",
              label: "Surveys",
              count: usersList.filter(
                (u) => u.surveyData && u.onboardingCompleted,
              ).length,
            },
            { id: "squads", label: "Squads", count: stats.totalSquads },
            {
              id: "curriculum",
              label: "Curriculum",
              count: stats.totalCurriculumTasks,
            },
            {
              id: "discussions",
              label: "Discussions",
              count: stats.totalDiscussions,
            },
            {
              id: "reports",
              label: "Safety Reports",
              count: stats.pendingReports,
              urgent: stats.pendingReports > 0,
            },
            { id: "database", label: "Database" },
            { id: "audit", label: "Audit Logs", count: auditLogs.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3 py-2 font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 font-semibold"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count !== null && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded tabular-nums ${
                      tab.urgent
                        ? "bg-rose-600 text-white font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {activeTab === "overview" && (
          <div className="space-y-5">
            {pendingReportsList.length > 0 ? (
              <div className="border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>
                      Action Required: {pendingReportsList.length} Pending
                      Safety Report
                      {pendingReportsList.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="text-xs font-medium text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                  >
                    Open Safety Queue
                  </button>
                </div>
                <div className="space-y-2">
                  {pendingReportsList.slice(0, 3).map((report) => {
                    const reportId = report.id || "";
                    return (
                      <div
                        key={reportId || Math.random()}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/40 rounded-md text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                            {report.reasonCategory || "Safety Issue"}:{" "}
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-400">
                            "{report.details || "No details provided"}"
                          </span>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Report ID: {maskId(reportId)} • Squad:{" "}
                            {report.squadId || "Unassigned"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              handleResolveReport(reportId, "reviewed")
                            }
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium text-xs transition-colors cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() =>
                              handleResolveReport(reportId, "dismissed")
                            }
                            className="px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-xs transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                <span>
                  All systems normal. No pending safety reports or actions
                  required.
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  Queue clear
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 font-medium">
                  Engineers
                </div>
                <div className="text-xl font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 mt-1">
                  {stats.totalUsers}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 font-medium">
                  Micro-Squads
                </div>
                <div className="text-xl font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 mt-1">
                  {stats.totalSquads}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 font-medium">
                  Active Sprints
                </div>
                <div className="text-xl font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 mt-1">
                  {stats.totalSprints}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 font-medium">
                  Curriculum Tasks
                </div>
                <div className="text-xl font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 mt-1">
                  {stats.totalCurriculumTasks}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="text-xs text-zinc-500 font-medium">
                  Discussions
                </div>
                <div className="text-xl font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 mt-1">
                  {stats.totalDiscussions}
                </div>
              </div>

              <div
                className={`p-3.5 rounded-lg border ${
                  stats.pendingReports > 0
                    ? "border-rose-300 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                }`}
              >
                <div
                  className={`text-xs font-medium ${
                    stats.pendingReports > 0
                      ? "text-rose-700 dark:text-rose-400 font-semibold"
                      : "text-zinc-500"
                  }`}
                >
                  Pending Reports
                </div>
                <div
                  className={`text-xl font-semibold font-mono tabular-nums mt-1 ${
                    stats.pendingReports > 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {stats.pendingReports}
                </div>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 space-y-2.5">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Quick Operations
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register User</span>
                </button>
                <button
                  onClick={() => setShowCreateSquadModal(true)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Squad</span>
                </button>
                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Add Task Template</span>
                </button>
                <button
                  onClick={() => setShowCreateDiscussionModal(true)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Post Announcement</span>
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Recent Administrative Events
                </span>
                <button
                  onClick={() => setActiveTab("audit")}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  View full audit log →
                </button>
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Timestamp</th>
                    <th className="py-2.5 px-4 font-medium">Admin</th>
                    <th className="py-2.5 px-4 font-medium">Action</th>
                    <th className="py-2.5 px-4 font-medium">Target</th>
                    <th className="py-2.5 px-4 font-medium">Target ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[11px]">
                  {auditLogs.slice(0, 5).map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-2 px-4 text-zinc-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-2 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">
                        {log.adminName}
                      </td>
                      <td className="py-2 px-4">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2 px-4 font-sans capitalize text-zinc-500">
                        {log.targetType}
                      </td>
                      <td className="py-2 px-4 text-zinc-400">
                        {log.targetId ? maskId(log.targetId) : "-"}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-zinc-400 font-sans text-xs"
                      >
                        No administrative transactions logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, handle, or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={() => setShowCreateUserModal(true)}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register User</span>
              </button>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 font-medium text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">User</th>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4 font-mono">User ID</th>
                      <th className="py-2.5 px-4">Role</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Focus Goal</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredUsers.map((u) => {
                      const revealed = isRevealed(u.id);
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={getUserAvatarUrl(u, 64)}
                                alt={u.name}
                                className="w-7 h-7 rounded-md object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800"
                              />
                              <div>
                                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {u.name}
                                </div>
                                <div className="text-[11px] text-zinc-400 font-mono">
                                  {u.handle}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1.5">
                              <span>{maskEmail(u.email, u.id)}</span>
                              <button
                                onClick={() => toggleRevealItem(u.id)}
                                className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                                title={revealed ? "Hide Email" : "Reveal Email"}
                              >
                                {revealed ? (
                                  <EyeOff className="w-3 h-3 text-amber-500" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-2.5 px-4 font-mono text-zinc-500 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="tabular-nums">
                                {maskId(u.id, u.id)}
                              </span>
                              <button
                                onClick={() => toggleRevealItem(u.id)}
                                className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                                title={revealed ? "Hide ID" : "Reveal ID"}
                              >
                                {revealed ? (
                                  <EyeOff className="w-3 h-3 text-amber-500" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (navigator?.clipboard) {
                                    navigator.clipboard.writeText(u.id);
                                    setStatusMessage({
                                      type: "success",
                                      text: `Copied ID (${truncateId(u.id)}) to clipboard`,
                                    });
                                  }
                                }}
                                className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                                title="Copy full ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="py-2.5 px-4">
                            <span className="capitalize text-zinc-700 dark:text-zinc-300">
                              {u.role || "user"}
                            </span>
                          </td>

                          <td className="py-2.5 px-4">
                            {u.status === "suspended" ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-medium font-mono text-[11px]">
                                suspended
                              </span>
                            ) : u.status === "flagged" ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium font-mono text-[11px]">
                                flagged
                              </span>
                            ) : (
                              <span className="text-zinc-400 font-mono text-[11px]">
                                active
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                            {u.primaryGoal || "Master System Architecture"}
                          </td>

                          <td className="py-2.5 px-4 text-right">
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
                                className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirmModal({
                                    type: "user",
                                    id: u.id,
                                    name: u.name,
                                  })
                                }
                                className="px-2 py-1 rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs transition-colors cursor-pointer"
                              >
                                Delete
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search squads by name or skill focus..."
                  value={squadSearchQuery}
                  onChange={(e) => setSquadSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <button
                onClick={() => setShowCreateSquadModal(true)}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Squad</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSquads.map((sq) => {
                const revealed = isRevealed(sq.id);
                return (
                  <div
                    key={sq.id}
                    className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-mono text-zinc-500">
                            {sq.skillFocus}
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
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
                            className="p-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                            title="Edit squad"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmModal({
                                type: "squad",
                                id: sq.id,
                                name: sq.name,
                              })
                            }
                            className="p-1 rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete squad"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {sq.sharedGoal}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Target</span>
                        <span className="font-mono text-zinc-900 dark:text-zinc-100">
                          {sq.currentProgress || 0} / {sq.targetProgress}{" "}
                          Milestones
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Invite Code</span>
                        <div className="flex items-center gap-1 font-mono text-zinc-800 dark:text-zinc-200">
                          <span>{maskCode(sq.inviteCode, sq.id)}</span>
                          <button
                            onClick={() => toggleRevealItem(sq.id)}
                            className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                            title={revealed ? "Hide code" : "Reveal code"}
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
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={taskCategoryFilter}
                  onChange={(e) => setTaskCategoryFilter(e.target.value)}
                  className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Tracks</option>
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
                <span className="text-xs text-zinc-500 font-mono">
                  {filteredTasks.length} templates
                </span>
              </div>

              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          Lesson {t.dayNumber} • {t.taskType} •{" "}
                          {t.skillCategory}
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
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
                          className="p-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          title="Edit template"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmModal({
                              type: "task",
                              id: t.id,
                              name: t.title,
                            })
                          }
                          className="p-1 rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>{t.estimatedMinutes} mins</span>
                    <span>{t.creatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "discussions" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs text-zinc-500">
                Community announcements and technical discussions
              </span>

              <button
                onClick={() => setShowCreateDiscussionModal(true)}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredDiscussions.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] uppercase">
                        {post.category || "discussion"}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {post.title}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span>By {post.authorName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <ThumbsUp className="w-3 h-3" /> {post.upvotes || 0}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <MessageCircle className="w-3 h-3" />{" "}
                        {post.repliesCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
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
                      className="px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirmModal({
                          type: "discussion",
                          id: post.id,
                          name: post.title,
                        })
                      }
                      className="px-2 py-1 rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="p-8 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
                  No community posts recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Filter:</span>
              <div className="flex items-center gap-1">
                {(["pending", "resolved", "all"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportFilter(st)}
                    className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-colors cursor-pointer ${
                      reportFilter === st
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredReports.map((rep) => {
                const repId = rep.id || "";
                return (
                  <div
                    key={repId || Math.random()}
                    className={`p-4 rounded-lg border bg-white dark:bg-zinc-900 space-y-2.5 ${
                      rep.status === "pending"
                        ? "border-amber-300 dark:border-amber-800/70"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                              rep.status === "pending"
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {rep.status}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                            Reason: {rep.reasonCategory || "Unspecified"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          "{rep.details || "No details provided"}"
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {rep.status === "pending" && repId && (
                          <>
                            <button
                              onClick={() =>
                                handleResolveReport(repId, "reviewed")
                              }
                              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Mark Reviewed
                            </button>
                            <button
                              onClick={() =>
                                handleResolveReport(repId, "dismissed")
                              }
                              className="px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors cursor-pointer"
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
                            className="p-1 rounded border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Delete safety report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      <span>Squad: {rep.squadId || "Unassigned"}</span>
                      <span>Report ID: {maskId(repId)}</span>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="p-8 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
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
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Audit record of administrative modifications</span>
              <span className="font-mono">{auditLogs.length} events</span>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-500 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Timestamp</th>
                      <th className="py-2.5 px-4 font-medium">Admin</th>
                      <th className="py-2.5 px-4 font-medium">Action</th>
                      <th className="py-2.5 px-4 font-medium">Target</th>
                      <th className="py-2.5 px-4 font-medium">Target ID</th>
                      <th className="py-2.5 px-4 font-medium">Parameters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[11px]">
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="py-2 px-4 text-zinc-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">
                          {log.adminName}
                        </td>
                        <td className="py-2 px-4">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2 px-4 font-sans capitalize text-zinc-500">
                          {log.targetType}
                        </td>
                        <td className="py-2 px-4 text-zinc-400">
                          {maskId(log.targetId || "", log.targetId)}
                        </td>
                        <td className="py-2 px-4 text-zinc-500 max-w-xs truncate">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Register User
              </h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  placeholder="e.g. sarah@example.com"
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Primary Goal
                </label>
                <input
                  type="text"
                  value={userForm.primaryGoal}
                  onChange={(e) =>
                    setUserForm({ ...userForm, primaryGoal: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Registering..." : "Register User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Update User Profile
              </h3>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Primary Goal
                </label>
                <input
                  type="text"
                  value={userForm.primaryGoal}
                  onChange={(e) =>
                    setUserForm({ ...userForm, primaryGoal: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateSquadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Create Squad
              </h3>
              <button
                onClick={() => setShowCreateSquadModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.name}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, name: e.target.value })
                  }
                  placeholder="e.g. Distributed Systems Cohort A"
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Skill Focus
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.skillFocus}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, skillFocus: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Shared Weekly Goal
                </label>
                <input
                  type="text"
                  value={squadForm.sharedGoal}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, sharedGoal: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Target Milestones
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={squadForm.targetProgress}
                  onChange={(e) =>
                    setSquadForm({
                      ...squadForm,
                      targetProgress: parseInt(e.target.value, 10) || 12,
                    })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSquadModal(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Creating..." : "Create Squad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Edit Squad Settings
              </h3>
              <button
                onClick={() => setEditingSquad(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSquad} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.name}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, name: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Skill Focus
                </label>
                <input
                  type="text"
                  required
                  value={squadForm.skillFocus}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, skillFocus: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Shared Weekly Goal
                </label>
                <input
                  type="text"
                  value={squadForm.sharedGoal}
                  onChange={(e) =>
                    setSquadForm({ ...squadForm, sharedGoal: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Target Milestones
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={squadForm.targetProgress}
                  onChange={(e) =>
                    setSquadForm({
                      ...squadForm,
                      targetProgress: parseInt(e.target.value, 10) || 12,
                    })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingSquad(null)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Add Task Template
              </h3>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  placeholder="e.g. Design Event-Driven Architecture"
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={taskForm.dayNumber}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        dayNumber: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={taskForm.estimatedMinutes}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        estimatedMinutes: parseInt(e.target.value, 10) || 20,
                      })
                    }
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Skill Category
                </label>
                <select
                  value={taskForm.skillCategory}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, skillCategory: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="System Architecture">
                    System Architecture
                  </option>
                  <option value="Next.js 15 & React 19">
                    Next.js 15 & React 19
                  </option>
                  <option value="Advanced TypeScript Patterns">
                    Advanced TypeScript Patterns
                  </option>
                  <option value="API Design & Performance">
                    API Design & Performance
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Adding..." : "Add Task Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Edit Task Template
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    value={taskForm.dayNumber}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        dayNumber: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={taskForm.estimatedMinutes}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        estimatedMinutes: parseInt(e.target.value, 10) || 20,
                      })
                    }
                    className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Skill Category
                </label>
                <select
                  value={taskForm.skillCategory}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, skillCategory: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="System Architecture">
                    System Architecture
                  </option>
                  <option value="Next.js 15 & React 19">
                    Next.js 15 & React 19
                  </option>
                  <option value="Advanced TypeScript Patterns">
                    Advanced TypeScript Patterns
                  </option>
                  <option value="API Design & Performance">
                    API Design & Performance
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateDiscussionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Post Community Announcement
              </h3>
              <button
                onClick={() => setShowCreateDiscussionModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateDiscussion}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Headline
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
                  placeholder="e.g. Sprint 14 Retrospective & Technical Updates"
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="discussion">General Discussion</option>
                  <option value="question">Technical Question</option>
                  <option value="code-review">Code Review</option>
                  <option value="tip">Engineering Tip</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={discussionForm.content}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      content: e.target.value,
                    })
                  }
                  placeholder="Write clear announcement content..."
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateDiscussionModal(false)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Edit Discussion Post
              </h3>
              <button
                onClick={() => setEditingDiscussion(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscussion} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Headline
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
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
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
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                >
                  <option value="discussion">General Discussion</option>
                  <option value="question">Technical Question</option>
                  <option value="code-review">Code Review</option>
                  <option value="tip">Engineering Tip</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">
                  Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={discussionForm.content}
                  onChange={(e) =>
                    setDiscussionForm({
                      ...discussionForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingDiscussion(null)}
                  className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Confirm Deletion
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                "{deleteConfirmModal.name}"
              </span>
              ? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setDeleteConfirmModal(null)}
                className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
