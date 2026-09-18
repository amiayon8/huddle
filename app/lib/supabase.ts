import { createClient } from "@supabase/supabase-js";
import {
  UserProfile,
  SprintChecklist,
  SprintTask,
  PortfolioItem,
  RealWorldProofItem,
  CareerTimelineEntry,
  MicroSquad,
  MacroSquad,
  MacroSquadUpdate,
  CreatorProfile,
  CreatorPost,
  SkillHealth,
  SkillRoadmap,
  CommunityPost,
  NotificationItem,
  MascotMessage,
  PracticeSessionProgress,
  AnonymousSquadReport,
  AdminAuditLog,
  AdminStats,
  TaskTemplate,
} from "../types/huddle";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://puusreiewwibbegrznli.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Authentication Helpers
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile in profiles table
      const newProfile: any = {
        id: data.user.id,
        name: fullName || "New Engineer",
        handle: `@${(fullName || "engineer").toLowerCase().replace(/\s+/g, "")}`,
        email: email,
        avatar: "/avatars/avatar-1.svg",
        bio: "Practicing deliberate software engineering craft.",
        streak: 1,
        max_streak: 1,
        reputation: 50,
        squad_id: "squad-1",
        macro_squad_id: "macro-squad-1",
        primary_goal: "Master System Architecture",
        career_milestone: "Staff Software Engineer",
        onboarding_completed: false,
        privacy: {
          showStreak: true,
          showSquad: true,
          showReputation: true,
          publicProfile: true,
          hideRawRoadmaps: false,
        },
      };

      await supabase.from("profiles").insert(newProfile);

      // Create default sprint for new user
      await supabase.from("sprints").insert({
        id: `sprint-${Date.now()}`,
        user_id: data.user.id,
        skill_title: "System Architecture",
        career_milestone: "Staff Software Engineer",
        duration_days: 4,
        current_day: 1,
        mascot_narration:
          "Welcome to Huddle! Your 4-day deliberate focus sprint is ready.",
        reshuffle_count: 0,
      });
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    console.error("Supabase sign up error:", err);
    return { user: null, error: err.message || "Sign up failed" };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (err: any) {
    console.error("Supabase sign in error:", err);
    return { user: null, error: err.message || "Invalid credentials" };
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Supabase sign out error:", err);
  }
}

/**
 * Fetch the user profile from Supabase
 */
export async function fetchUserProfile(
  userId: string = "user-1",
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      handle: data.handle,
      email: data.email || "",
      avatar: data.avatar,
      bio: data.bio || "",
      streak: data.streak ?? 0,
      maxStreak: data.max_streak ?? 0,
      reputation: data.reputation ?? 0,
      squadId: data.squad_id,
      macroSquadId: data.macro_squad_id,
      primaryGoal: data.primary_goal,
      careerMilestone: data.career_milestone,
      onboardingCompleted: data.onboarding_completed,
      surveyData: data.survey_data || undefined,
      joinedDate: "August 2026",
      role: data.role || "user",
      status: data.status || "active",
      focusSecondsToday: data.focus_seconds_today ?? 1080,
      lastFocusDate: data.last_focus_date || new Date().toISOString().split("T")[0],
      isTimerRunning: data.is_timer_running ?? true,
      totalFocusSeconds: data.total_focus_seconds ?? 1080,
      privacy: data.privacy || {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false,
      },
    };
  } catch (err) {
    console.error("Error fetching profile from Supabase:", err);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
) {
  try {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.reputation !== undefined)
      dbUpdates.reputation = updates.reputation;
    if (updates.onboardingCompleted !== undefined)
      dbUpdates.onboarding_completed = updates.onboardingCompleted;
    if (updates.primaryGoal !== undefined)
      dbUpdates.primary_goal = updates.primaryGoal;
    if (updates.careerMilestone !== undefined)
      dbUpdates.career_milestone = updates.careerMilestone;
    if (updates.surveyData !== undefined)
      dbUpdates.survey_data = updates.surveyData;
    if (updates.privacy !== undefined) dbUpdates.privacy = updates.privacy;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.focusSecondsToday !== undefined)
      dbUpdates.focus_seconds_today = updates.focusSecondsToday;
    if (updates.lastFocusDate !== undefined)
      dbUpdates.last_focus_date = updates.lastFocusDate;
    if (updates.isTimerRunning !== undefined)
      dbUpdates.is_timer_running = updates.isTimerRunning;
    if (updates.totalFocusSeconds !== undefined)
      dbUpdates.total_focus_seconds = updates.totalFocusSeconds;

    await supabase.from("profiles").update(dbUpdates).eq("id", userId);
  } catch (err) {
    console.error("Error updating profile:", err);
  }
}

/**
 * Persist Focus Timer state to Supabase database
 */
export async function saveFocusTimerToDb(
  userId: string,
  secondsToday: number,
  isTimerRunning: boolean,
  totalFocusSeconds?: number,
) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const updates: any = {
      focus_seconds_today: Math.max(0, Math.floor(secondsToday)),
      last_focus_date: today,
      is_timer_running: isTimerRunning,
      updated_at: new Date().toISOString(),
    };
    if (totalFocusSeconds !== undefined) {
      updates.total_focus_seconds = Math.max(0, Math.floor(totalFocusSeconds));
    }
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.warn("Failed to persist focus timer to Supabase:", error.message);
    }
  } catch (err) {
    console.error("Error saving focus timer to database:", err);
  }
}

/**
 * Record a completed focus session into focus_sessions table
 */
export async function logFocusSessionToDb(
  userId: string,
  durationSeconds: number,
  taskId?: string,
) {
  try {
    if (durationSeconds <= 0) return;
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("focus_sessions").insert({
      user_id: userId,
      duration_seconds: Math.floor(durationSeconds),
      date: today,
      task_id: taskId || null,
      completed: true,
    });
    if (error) {
      console.warn("Failed to log focus session to DB:", error.message);
    }
  } catch (err) {
    console.error("Error logging focus session:", err);
  }
}

/**
 * Fetch focus session history from DB
 */
export async function fetchFocusSessionsFromDb(userId: string) {
  try {
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      durationSeconds: d.duration_seconds,
      date: d.date,
      taskId: d.task_id,
      completed: d.completed,
      createdAt: d.created_at,
    }));
  } catch (err) {
    console.error("Error fetching focus sessions from DB:", err);
    return [];
  }
}

/**
 * Fetch current sprint and tasks
 */
export async function fetchCurrentSprint(
  userId: string = "user-1",
): Promise<SprintChecklist | null> {
  try {
    const { data: sprintData, error: sprintErr } = await supabase
      .from("sprints")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sprintErr || !sprintData) return null;

    const { data: tasksData, error: tasksErr } = await supabase
      .from("sprint_tasks")
      .select("*")
      .eq("sprint_id", sprintData.id)
      .order("day_number", { ascending: true });

    const templateTasks = generateTasksForSkill(
      sprintData.id,
      sprintData.skill_title || "System Architecture",
    );

    let tasks: SprintTask[] = (tasksData || []).map((t: any, index: number) => {
      const template =
        templateTasks.find((item) => item.dayNumber === t.day_number) ||
        templateTasks[index] ||
        templateTasks[0];
      return {
        id: t.id,
        dayNumber: t.day_number,
        title: t.title,
        description: t.description || template?.description || "",
        type: t.task_type || template?.type || "learn",
        creatorName: t.creator_name || template?.creatorName || "Sumaiya Kabir",
        creatorHandle: t.creator_handle || template?.creatorHandle || "@sumaiya_kabir",
        creatorAvatar: t.creator_avatar || template?.creatorAvatar || "/avatars/avatar-2.svg",
        estimatedMinutes: t.estimated_minutes || template?.estimatedMinutes || 20,
        completed: t.completed || false,
        completedAt: t.completed_at,
        producesArtifact: t.produces_artifact || template?.producesArtifact || false,
        artifactTitle: t.artifact_title || template?.artifactTitle,
        artifactType: t.artifact_type || template?.artifactType,
        realWorldActionDescription: t.real_world_action_description || template?.realWorldActionDescription,
        sparkGuidance: t.spark_guidance || t.sparkGuidance || template?.sparkGuidance,
        resources: t.resources || template?.resources,
        subtasks: t.subtasks || template?.subtasks,
        evidenceRequirement: t.evidence_requirement || t.evidenceRequirement || template?.evidenceRequirement,
        submittedEvidence: t.submitted_evidence || t.submittedEvidence,
        evidenceVerified: t.evidence_verified || t.evidenceVerified || false,
      };
    });

    if (tasks.length === 0) {
      tasks = templateTasks;
    }

    return {
      id: sprintData.id,
      skillTitle: sprintData.skill_title,
      careerMilestone: sprintData.career_milestone,
      durationDays: sprintData.duration_days,
      currentDay: sprintData.current_day,
      tasks: tasks,
      mascotNarration: sprintData.mascot_narration || "",
      reshuffleCount: sprintData.reshuffle_count || 0,
      lastReshuffledAt: sprintData.last_reshuffled_at,
    };
  } catch (err) {
    console.error("Error fetching sprint:", err);
    return null;
  }
}

export async function updateSprintTaskCompletion(
  taskId: string,
  completed: boolean,
  completedAt?: string,
  sprintId?: string,
  dayNumber?: number,
) {
  try {
    const { data } = await supabase
      .from("sprint_tasks")
      .update({
        completed: completed,
        completed_at: completedAt || (completed ? "Just now" : null),
      })
      .eq("id", taskId)
      .select("id");

    if ((!data || data.length === 0) && sprintId && dayNumber !== undefined) {
      await supabase
        .from("sprint_tasks")
        .update({
          completed: completed,
          completed_at: completedAt || (completed ? "Just now" : null),
        })
        .eq("sprint_id", sprintId)
        .eq("day_number", dayNumber);
    }
  } catch (err) {
    console.error("Error updating sprint task:", err);
  }
}

export async function fetchPracticeSessionProgress(
  userId: string,
  taskId: string,
): Promise<PracticeSessionProgress | null> {
  try {
    const { data, error } = await supabase
      .from("practice_session_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("task_id", taskId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      taskId: data.task_id,
      sprintId: data.sprint_id,
      completed: data.completed || false,
      completedAt: data.completed_at || undefined,
      videoWatchedSeconds: data.video_watched_seconds || 0,
      videoCompleted: data.video_completed || false,
      reflectionNotes: data.reflection_notes || "",
      userCode: data.user_code || undefined,
      quizAnswers: data.quiz_answers || undefined,
      quizScore: data.quiz_score || 0,
      timeSpentSeconds: data.time_spent_seconds || 0,
    };
  } catch (err) {
    console.error("Error fetching practice progress:", err);
    return null;
  }
}

export async function fetchAllPracticeSessionProgress(
  userId: string,
): Promise<PracticeSessionProgress[]> {
  try {
    const { data, error } = await supabase
      .from("practice_session_progress")
      .select("*")
      .eq("user_id", userId);

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      taskId: d.task_id,
      sprintId: d.sprint_id,
      completed: d.completed || false,
      completedAt: d.completed_at || undefined,
      videoWatchedSeconds: d.video_watched_seconds || 0,
      videoCompleted: d.video_completed || false,
      reflectionNotes: d.reflection_notes || "",
      userCode: d.user_code || undefined,
      quizAnswers: d.quiz_answers || undefined,
      quizScore: d.quiz_score || 0,
      timeSpentSeconds: d.time_spent_seconds || 0,
    }));
  } catch (err) {
    console.error("Error fetching all practice progress:", err);
    return [];
  }
}

export async function savePracticeSessionProgress(
  progress: PracticeSessionProgress,
): Promise<void> {
  try {
    const payload = {
      id: progress.id,
      user_id: progress.userId,
      task_id: progress.taskId,
      sprint_id: progress.sprintId,
      completed: progress.completed,
      completed_at: progress.completedAt || null,
      video_watched_seconds: progress.videoWatchedSeconds,
      video_completed: progress.videoCompleted,
      reflection_notes: progress.reflectionNotes,
      user_code: progress.userCode || null,
      quiz_answers: progress.quizAnswers || null,
      quiz_score: progress.quizScore || 0,
      time_spent_seconds: progress.timeSpentSeconds,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from("practice_session_progress")
      .upsert(payload, { onConflict: "user_id,task_id" });
  } catch (err) {
    console.error("Error saving practice session progress:", err);
  }
}

/**
 * Reshuffle sprint in database
 */
export async function reshuffleSprintInDb(
  sprintId: string,
  currentDay: number = 1,
  reason?: string,
) {
  try {
    await supabase
      .from("sprints")
      .update({
        current_day: currentDay,
        last_reshuffled_at: new Date().toISOString(),
        mascot_narration: reason
          ? `Sprint schedule reshuffled for you without penalty. Consistency beats intensity every time!`
          : `Schedule reshuffled smoothly! Ready to start fresh with Day 1.`,
      })
      .eq("id", sprintId);

    // Reset task completed statuses
    await supabase
      .from("sprint_tasks")
      .update({ completed: false, completed_at: null })
      .eq("sprint_id", sprintId);
  } catch (err) {
    console.error("Error reshuffling sprint:", err);
  }
}

/**
 * Fetch portfolio items
 */
export async function fetchPortfolioItems(
  userId: string = "user-1",
): Promise<PortfolioItem[]> {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      date: d.date,
      description: d.description,
      artifactType: d.artifact_type || "code",
      previewSnippet: d.preview_snippet || "",
      isPublished: d.is_published || false,
      sourceTaskId: d.source_task_id,
      tags: d.tags || [],
    }));
  } catch (err) {
    console.error("Error fetching portfolio items:", err);
    return [];
  }
}

/**
 * Add auto-assembled portfolio item
 */
export async function addPortfolioItemToDb(
  item: PortfolioItem,
  userId: string = "user-1",
) {
  try {
    await supabase.from("portfolio_items").insert({
      id: item.id,
      user_id: userId,
      title: item.title,
      category: item.category,
      date: item.date,
      description: item.description,
      artifact_type: item.artifactType,
      preview_snippet: item.previewSnippet,
      is_published: item.isPublished,
      source_task_id: item.sourceTaskId,
      tags: item.tags,
    });
  } catch (err) {
    console.error("Error inserting portfolio item:", err);
  }
}

/**
 * Toggle publish on portfolio item
 */
export async function togglePublishPortfolioInDb(
  itemId: string,
  isPublished: boolean,
) {
  try {
    await supabase
      .from("portfolio_items")
      .update({ is_published: isPublished })
      .eq("id", itemId);
  } catch (err) {
    console.error("Error toggling portfolio item publish:", err);
  }
}

/**
 * Fetch real world proofs
 */
export async function fetchRealWorldProofs(
  userId: string = "user-1",
): Promise<RealWorldProofItem[]> {
  try {
    const { data, error } = await supabase
      .from("real_world_proofs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      date: d.date,
      completed: d.completed || false,
      externalLink: d.external_link,
      proofBadge: d.proof_badge,
    }));
  } catch (err) {
    console.error("Error fetching real world proofs:", err);
    return [];
  }
}

/**
 * Complete real world proof in database
 */
export async function completeRealWorldProofInDb(proofId: string) {
  try {
    await supabase
      .from("real_world_proofs")
      .update({ completed: true })
      .eq("id", proofId);
  } catch (err) {
    console.error("Error completing proof:", err);
  }
}

/**
 * Fetch squad with members and activity pings
 */
export async function fetchSquad(
  squadId: string = "squad-1",
): Promise<MicroSquad | null> {
  try {
    const { data: squadData, error: squadErr } = await supabase
      .from("squads")
      .select("*")
      .eq("id", squadId)
      .single();

    if (squadErr || !squadData) return null;

    const { data: membersData } = await supabase
      .from("squad_members")
      .select("*")
      .eq("squad_id", squadId);

    const { data: pingsData } = await supabase
      .from("squad_activity_pings")
      .select("*")
      .eq("squad_id", squadId)
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      id: squadData.id,
      name: squadData.name,
      skillFocus: squadData.skill_focus,
      sharedGoal: squadData.shared_goal,
      currentProgress: squadData.current_progress,
      targetProgress: squadData.target_progress,
      inviteCode: squadData.invite_code,
      members: (membersData || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        handle: m.handle,
        avatar: m.avatar,
        streak: m.streak,
        checkedInToday: m.checked_in_today,
        lastCheckIn: m.last_check_in,
        recentEncouragement: m.recent_encouragement,
        role: m.role,
      })),
      activityPings: (pingsData || []).map((p: any) => ({
        id: p.id,
        memberId: p.member_id,
        memberName: p.member_name,
        memberAvatar: p.member_avatar,
        actionText: p.action_text,
        timestamp: "Just now",
        type: p.ping_type,
      })),
      activeProject: await (async () => {
        const { data: projectData } = await supabase
          .from("squad_projects")
          .select("*")
          .eq("squad_id", squadId)
          .maybeSingle();

        if (projectData) {
          return {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description || "",
            deadline: projectData.deadline || "Sunday, 11:59 PM",
            status: "in_progress",
            submissionsCount: (projectData.submissions || []).length,
            totalMembers: membersData?.length || 4,
            deliverables: projectData.deliverables || [],
          };
        }

        return {
          id: `proj-${squadData.id}`,
          title: `Team Blueprint: ${squadData.skill_focus || "Core Architecture"}`,
          description:
            squadData.shared_goal ||
            "Collaborative team exercise: implement production-ready patterns and documentation.",
          deadline: "Sunday, 11:59 PM",
          status: "in_progress",
          submissionsCount: 1,
          totalMembers: membersData?.length || 4,
        };
      })(),
    };
  } catch (err) {
    console.error("Error fetching squad:", err);
    return null;
  }
}

/**
 * Add squad activity ping in database
 */
export async function addSquadActivityPingToDb(
  squadId: string,
  memberId: string,
  memberName: string,
  memberAvatar: string,
  actionText: string,
  pingType: string = "task_completed",
) {
  try {
    await supabase.from("squad_activity_pings").insert({
      id: `ping-${Date.now()}`,
      squad_id: squadId,
      member_id: memberId,
      member_name: memberName,
      member_avatar: memberAvatar,
      action_text: actionText,
      ping_type: pingType,
    });

    // Increment squad progress
    const { data: squad } = await supabase
      .from("squads")
      .select("current_progress")
      .eq("id", squadId)
      .single();
    if (squad) {
      await supabase
        .from("squads")
        .update({ current_progress: (squad.current_progress || 0) + 1 })
        .eq("id", squadId);
    }
  } catch (err) {
    console.error("Error adding squad ping:", err);
  }
}

export async function removeSquadMemberInDb(squadId: string, memberId: string) {
  try {
    await supabase
      .from("squad_members")
      .delete()
      .eq("squad_id", squadId)
      .eq("id", memberId);
  } catch (err) {
    console.error("Error removing squad member from DB:", err);
  }
}

export async function updateSquadMemberRoleInDb(
  squadId: string,
  memberId: string,
  role: "member" | "lead",
) {
  try {
    await supabase
      .from("squad_members")
      .update({ role })
      .eq("squad_id", squadId)
      .eq("id", memberId);
  } catch (err) {
    console.error("Error updating squad member role in DB:", err);
  }
}

export async function updateSquadSettingsInDb(
  squadId: string,
  updates: {
    name?: string;
    skillFocus?: string;
    sharedGoal?: string;
    targetProgress?: number;
    inviteCode?: string;
  },
) {
  try {
    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.skillFocus !== undefined)
      payload.skill_focus = updates.skillFocus;
    if (updates.sharedGoal !== undefined)
      payload.shared_goal = updates.sharedGoal;
    if (updates.targetProgress !== undefined)
      payload.target_progress = updates.targetProgress;
    if (updates.inviteCode !== undefined)
      payload.invite_code = updates.inviteCode;

    await supabase.from("squads").update(payload).eq("id", squadId);
  } catch (err) {
    console.error("Error updating squad settings in DB:", err);
  }
}

export async function submitSquadReportToDb(report: AnonymousSquadReport) {
  try {
    const reportId =
      report.id ||
      `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const { error } = await supabase.from("squad_reports").insert({
      id: reportId,
      squad_id: report.squadId,
      reported_member_id: report.reportedMemberId,
      reported_member_name: report.reportedMemberName,
      reporter_hash: report.reporterHash || null,
      reason_category: report.reasonCategory,
      details: report.details || null,
      status: report.status || "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error inserting squad report:", error);
      return { success: false, error: error.message };
    }
    return { success: true, id: reportId };
  } catch (err: any) {
    console.error("Error submitting squad report to DB:", err);
    return { success: false, error: err?.message || "Failed to submit report" };
  }
}

/**
 * Fetch creator posts
 */
export async function fetchCreatorPosts(): Promise<CreatorPost[]> {
  try {
    const { data, error } = await supabase
      .from("creator_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((p: any) => ({
      id: p.id,
      creatorId: p.creator_id,
      creatorName: p.creator_name,
      creatorHandle: p.creator_handle,
      creatorAvatar: p.creator_avatar,
      creatorTitle: p.creator_title,
      sponsorBadge: p.sponsor_badge,
      skillTag: p.skill_tag,
      title: p.title,
      description: p.description,
      contentSnippet: p.content_snippet,
      duration: p.duration,
      videoUrl: p.video_url,
      resourceLinks: Array.isArray(p.resource_links) ? p.resource_links : [],
      likesCount: p.likes_count || 0,
      createdAt: "Today",
    }));
  } catch (err) {
    console.error("Error fetching creator posts:", err);
    return [];
  }
}

/**
 * Publish creator post to Supabase
 */
export async function publishCreatorPostToDb(post: CreatorPost) {
  try {
    await supabase.from("creator_posts").insert({
      id: post.id,
      creator_id: post.creatorId,
      creator_name: post.creatorName,
      creator_handle: post.creatorHandle,
      creator_avatar: post.creatorAvatar,
      creator_title: post.creatorTitle,
      sponsor_badge: post.sponsorBadge,
      skill_tag: post.skillTag,
      title: post.title,
      description: post.description,
      content_snippet: post.contentSnippet,
      duration: post.duration,
      video_url: post.videoUrl,
      resource_links: post.resourceLinks,
      likes_count: post.likesCount,
    });
  } catch (err) {
    console.error("Error publishing creator post:", err);
  }
}

/**
 * Fetch skills health from database
 */
export async function fetchSkillsHealth(
  userId: string = "user-1",
): Promise<SkillHealth[]> {
  try {
    const { data, error } = await supabase
      .from("skills_health")
      .select("*")
      .eq("user_id", userId);

    if (error || !data || data.length === 0) return [];

    return data.map((s: any) => ({
      skillId: s.skill_id,
      skillTitle: s.skill_title,
      category: s.category || "Engineering",
      healthPercent: s.health_percent ?? 100,
      decayRate: s.decay_rate || "-2% / week",
      lastPracticed: s.last_practiced || "Today",
      status: s.status || "optimal",
    }));
  } catch (err) {
    console.error("Error fetching skills health:", err);
    return [];
  }
}

/**
 * Fetch career timeline from database
 */
export async function fetchCareerTimeline(
  userId: string = "user-1",
): Promise<CareerTimelineEntry[]> {
  try {
    const { data, error } = await supabase
      .from("career_timeline")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((t: any) => ({
      id: t.id,
      date: t.date,
      type: t.entry_type || "sprint_cleared",
      title: t.title,
      description: t.description || "",
      badge: t.badge,
    }));
  } catch (err) {
    console.error("Error fetching career timeline:", err);
    return [];
  }
}

/**
 * Fetch skill roadmap from database
 */
export async function fetchSkillRoadmap(
  skillTitle: string = "System Architecture",
): Promise<SkillRoadmap | null> {
  try {
    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      skillId: data.skill_id,
      skillTitle: data.skill_title,
      skillIcon: data.skill_icon || "⚡",
      currentStepIndex: data.current_step_index || 1,
      totalSteps: data.total_steps || 2,
      milestones: data.milestones || [],
      steps: data.steps || [],
    };
  } catch (err) {
    console.error("Error fetching roadmap:", err);
    return null;
  }
}

/**
 * Fetch macro squad from database
 */
export async function fetchMacroSquad(
  macroSquadId: string = "macro-1",
): Promise<MacroSquad | null> {
  try {
    const { data, error } = await supabase
      .from("macro_squad_updates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    return {
      id: "macro-1",
      name: "Global Backend & Systems Circle",
      description:
        "A global macro circle of 38 engineers mastering distributed backend systems.",
      trackCategory: "System Architecture",
      membersCount: 38,
      members: [
        {
          id: "m-1",
          name: "Liam Ross",
          avatar: "/avatars/avatar-5.svg",
          title: "Principal Engineer",
          skillsFocus: ["System Architecture", "Kafka"],
        },
      ],
      milestoneUpdates: data.map((u: any) => ({
        id: u.id,
        authorName: u.author_name,
        authorAvatar: u.author_avatar || "",
        milestoneTitle: u.milestone_title,
        skillTag: u.skill_tag,
        timestamp: u.timestamp || "2 hours ago",
        congratsCount: u.congrats_count || 0,
        userCongratulated: false,
      })),
    };
  } catch (err) {
    console.error("Error fetching macro squad:", err);
    return null;
  }
}

/**
 * Fetch community posts from database
 */
export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((p: any) => ({
      id: p.id,
      skillId: p.skill_id,
      skillTitle: p.skill_title,
      authorName: p.author_name,
      authorHandle: p.author_handle,
      authorAvatar: p.author_avatar,
      authorReputation: p.author_reputation,
      title: p.title,
      content: p.content,
      category: p.category,
      upvotes: p.upvotes,
      userUpvoted: p.user_upvoted,
      repliesCount: p.replies_count,
      createdAt: "3 hours ago",
      replies: p.replies || [],
    }));
  } catch (err) {
    console.error("Error fetching community posts:", err);
    return [];
  }
}

/**
 * Fetch creators from database
 */
export async function fetchCreators(): Promise<CreatorProfile[]> {
  try {
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("followers_count", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      avatar: c.avatar,
      title: c.title,
      bio: c.bio,
      followersCount: c.followers_count,
      isFollowing: c.is_following,
      sponsorPartner: c.sponsor_partner,
      skillsTaught: c.skills_taught || [],
      playlists: c.playlists || [],
      pinnedResources: c.pinned_resources || [],
    }));
  } catch (err) {
    console.error("Error fetching creators:", err);
    return [];
  }
}

/**
 * Fetch notifications from database
 */
export async function fetchNotifications(
  userId: string = "user-1",
): Promise<NotificationItem[]> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      timestamp: n.timestamp,
      read: n.read || false,
    }));
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
}

/**
 * Fetch mascot messages from database
 */
export async function fetchMascotMessages(
  userId: string = "user-1",
): Promise<MascotMessage[]> {
  try {
    const { data, error } = await supabase
      .from("mascot_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((m: any) => ({
      id: m.id,
      context: m.context,
      text: m.text,
      actionLabel: m.action_label,
      actionType: m.action_type,
    }));
  } catch (err) {
    console.error("Error fetching mascot messages:", err);
    return [];
  }
}

/**
 * Fetch binge quiz from database
 */
export async function fetchBingeQuiz(): Promise<
  Record<
    string,
    {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  >
> {
  try {
    const { data, error } = await supabase.from("binge_quizzes").select("*");

    if (error || !data || data.length === 0) return {};

    const result: Record<string, any> = {};
    data.forEach((q: any) => {
      result[q.skill_id] = {
        question: q.question,
        options: Array.isArray(q.options)
          ? q.options
          : typeof q.options === "string"
            ? JSON.parse(q.options)
            : [],
        correctIndex: q.correct_index,
        explanation: q.explanation,
      };
    });
    return result;
  } catch (err) {
    console.error("Error fetching binge quiz:", err);
    return {};
  }
}

/**
 * Update roadmap step completion in database
 */
export async function updateRoadmapStepCompletionInDb(
  roadmapId: string,
  stepId: string,
  completed: boolean,
) {
  try {
    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("*")
      .limit(1)
      .single();
    if (!roadmap) return;

    const updatedSteps = (roadmap.steps || []).map((s: any) =>
      s.id === stepId
        ? {
            ...s,
            status: completed ? "completed" : "current",
            completedAt: completed ? "Just now" : null,
          }
        : s,
    );

    await supabase
      .from("roadmaps")
      .update({ steps: updatedSteps })
      .eq("id", roadmap.id);
  } catch (err) {
    console.error("Error updating roadmap step in DB:", err);
  }
}

/**
 * Add community post to database
 */
export async function addCommunityPostToDb(post: CommunityPost) {
  try {
    await supabase.from("community_posts").insert({
      id: post.id,
      skill_id: post.skillId,
      skill_title: post.skillTitle,
      author_name: post.authorName,
      author_handle: post.authorHandle,
      author_avatar: post.authorAvatar,
      author_reputation: post.authorReputation,
      title: post.title,
      content: post.content,
      category: post.category,
      upvotes: post.upvotes,
      user_upvoted: post.userUpvoted,
      replies_count: post.repliesCount,
      replies: post.replies || [],
    });
  } catch (err) {
    console.error("Error inserting community post into DB:", err);
  }
}

/**
 * Toggle community post upvote in database
 */
export async function toggleCommunityPostUpvoteInDb(
  postId: string,
  userUpvoted: boolean,
) {
  try {
    const { data: post } = await supabase
      .from("community_posts")
      .select("upvotes")
      .eq("id", postId)
      .single();
    if (!post) return;
    const nextUpvotes = userUpvoted
      ? (post.upvotes || 0) + 1
      : Math.max(0, (post.upvotes || 1) - 1);
    await supabase
      .from("community_posts")
      .update({ upvotes: nextUpvotes, user_upvoted: userUpvoted })
      .eq("id", postId);
  } catch (err) {
    console.error("Error toggling community post upvote:", err);
  }
}

/**
 * Add reply to community post in database
 */
export async function addReplyToCommunityPostInDb(postId: string, reply: any) {
  try {
    const { data: post } = await supabase
      .from("community_posts")
      .select("replies, replies_count")
      .eq("id", postId)
      .single();
    if (!post) return;
    const currentReplies = Array.isArray(post.replies) ? post.replies : [];
    const updatedReplies = [...currentReplies, reply];
    await supabase
      .from("community_posts")
      .update({
        replies: updatedReplies,
        replies_count: (post.replies_count || 0) + 1,
      })
      .eq("id", postId);
  } catch (err) {
    console.error("Error adding reply to post in DB:", err);
  }
}

/**
 * Toggle follow status for a creator
 */
export async function toggleFollowCreatorInDb(
  creatorId: string,
  isFollowing: boolean,
) {
  try {
    const { data: creator } = await supabase
      .from("creators")
      .select("followers_count")
      .eq("id", creatorId)
      .single();
    if (!creator) return;
    const nextFollowers = isFollowing
      ? (creator.followers_count || 0) + 1
      : Math.max(0, (creator.followers_count || 1) - 1);
    await supabase
      .from("creators")
      .update({ is_following: isFollowing, followers_count: nextFollowers })
      .eq("id", creatorId);
  } catch (err) {
    console.error("Error toggling follow creator:", err);
  }
}

/**
 * Toggle like for a creator post
 */
export async function toggleLikeCreatorPostInDb(
  postId: string,
  userLiked: boolean,
) {
  try {
    const { data: post } = await supabase
      .from("creator_posts")
      .select("likes_count")
      .eq("id", postId)
      .single();
    if (!post) return;
    const nextLikes = userLiked
      ? (post.likes_count || 0) + 1
      : Math.max(0, (post.likes_count || 1) - 1);
    await supabase
      .from("creator_posts")
      .update({ likes_count: nextLikes })
      .eq("id", postId);
  } catch (err) {
    console.error("Error toggling like creator post:", err);
  }
}

/**
 * Congratulate macro squad milestone
 */
export async function toggleMacroMilestoneCongratsInDb(
  updateId: string,
  userCongratulated: boolean,
) {
  try {
    const { data: update } = await supabase
      .from("macro_squad_updates")
      .select("congrats_count")
      .eq("id", updateId)
      .single();
    if (!update) return;
    const nextCount = userCongratulated
      ? (update.congrats_count || 0) + 1
      : Math.max(0, (update.congrats_count || 1) - 1);
    await supabase
      .from("macro_squad_updates")
      .update({ congrats_count: nextCount })
      .eq("id", updateId);
  } catch (err) {
    console.error("Error toggling milestone congrats:", err);
  }
}

/**
 * Mark notification as read in database
 */
export async function markNotificationReadInDb(notificationId: string) {
  try {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
  } catch (err) {
    console.error("Error marking notification read:", err);
  }
}

/**
 * Insert notification into database
 */
export async function addNotificationToDb(
  notification: NotificationItem,
  userId: string = "user-1",
) {
  try {
    await supabase.from("notifications").insert({
      id: notification.id,
      user_id: userId,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      timestamp: notification.timestamp,
      read: notification.read || false,
    });
  } catch (err) {
    console.error("Error adding notification to DB:", err);
  }
}

/**
 * Add career timeline entry into database
 */
export async function addCareerTimelineEntryToDb(
  entry: CareerTimelineEntry,
  userId: string = "user-1",
) {
  try {
    await supabase.from("career_timeline").insert({
      id: entry.id,
      user_id: userId,
      date: entry.date,
      entry_type: entry.type,
      title: entry.title,
      description: entry.description,
      badge: entry.badge,
    });
  } catch (err) {
    console.error("Error inserting career timeline entry:", err);
  }
}

/**
 * Update skill health in database
 */
export async function updateSkillHealthInDb(
  userId: string,
  skillTitle: string,
  healthPercent: number,
  status: string = "optimal",
) {
  try {
    await supabase
      .from("skills_health")
      .update({
        health_percent: healthPercent,
        last_practiced: "Today",
        status: status,
      })
      .eq("user_id", userId)
      .ilike("skill_title", `%${skillTitle}%`);
  } catch (err) {
    console.error("Error updating skill health:", err);
  }
}

/**
 * Update squad member check in status
 */
export async function updateSquadMemberCheckInInDb(
  squadId: string,
  userId: string,
  encouragement?: string,
) {
  try {
    const updates: any = {
      checked_in_today: true,
      last_check_in: "Today",
    };
    if (encouragement) updates.recent_encouragement = encouragement;
    await supabase
      .from("squad_members")
      .update(updates)
      .eq("squad_id", squadId)
      .eq("id", userId);
  } catch (err) {
    console.error("Error updating squad member check-in:", err);
  }
}

export const generateTasksForSkill = (
  sprintId: string,
  skillTitle: string,
  level: string = "Intermediate",
  dailyTime: string = "20 mins / day"
): SprintTask[] => {
  const lower = skillTitle.toLowerCase();
  const minutes = parseInt(dailyTime) || 20;

  if (
    lower.includes("presentation") ||
    lower.includes("slide") ||
    lower.includes("speaking") ||
    lower.includes("pitch")
  ) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "Create your first presentation slide",
        description: "Distill a complex topic into one compelling, visually balanced slide with high clarity.",
        type: "build",
        creatorName: "Sarah Lin",
        creatorHandle: "@sarah_design",
        creatorAvatar: "/avatars/avatar-1.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Headline & Hook Slide Deck",
        artifactType: "summary",
        sparkGuidance: {
          overview: "When creating your first slide, remember that a slide is a visual anchor for your voice, not a transcript. Focus on one single idea.",
          keySteps: [
            "Choose the main idea.",
            "Create the title.",
            "Add the key information.",
            "Keep the slide simple."
          ],
          proTip: "If an audience member can't understand the main point within 3 seconds, remove two elements."
        },
        resources: [
          {
            id: "res-1-1",
            type: "video",
            title: "Principles of High-Impact Slide Composition",
            durationOrReadTime: "7 min video",
            description: "Visual hierarchy, typography sizing, and negative space principles."
          },
          {
            id: "res-1-2",
            type: "doc",
            title: "Slide Readability & Contrast Guide",
            durationOrReadTime: "4 min read",
            description: "Industry guidelines on font pairings, contrast ratios, and line height."
          },
          {
            id: "res-1-3",
            type: "tutorial",
            title: "Step-by-Step Title and Key Point Structuring",
            durationOrReadTime: "5 min guide",
            description: "How to craft action titles that deliver the takeaway upfront."
          },
          {
            id: "res-1-4",
            type: "example",
            title: "Before & After Slide Teardowns",
            durationOrReadTime: "Interactive breakdown",
            description: "Side-by-side analysis of cluttered slides transformed into clear visuals."
          }
        ],
        subtasks: [
          { id: "sub-1-1", title: "Select a single core idea or problem to communicate", completed: false },
          { id: "sub-1-2", title: "Write an action-oriented title summarizing the conclusion", completed: false },
          { id: "sub-1-3", title: "Add 2 to 3 concise supporting bullets or data points", completed: false },
          { id: "sub-1-4", title: "Remove distracting styling or filler text", completed: false }
        ],
        evidenceRequirement: {
          type: "screenshot",
          prompt: "Please provide a screenshot, image file, or link to your completed slide so Spark can verify your layout.",
          placeholder: "Paste screenshot link or public Figma/Canva/Keynote URL...",
          verificationQuestion: "Does your slide communicate a single clear idea with an action title?"
        }
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Visual Hierarchy and Data Callouts",
        description: "Transform raw statistics and points into intuitive visual callouts and charts.",
        type: "build",
        creatorName: "Sarah Lin",
        creatorHandle: "@sarah_design",
        creatorAvatar: "/avatars/avatar-1.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Data Visualization Slide",
        artifactType: "summary",
        sparkGuidance: {
          overview: "Numbers only resonate when given context. Pair every big metric with a comparative anchor.",
          keySteps: [
            "Select your focal metric.",
            "Enlarge the primary statistic.",
            "Write a brief one-line caption explaining why it matters.",
            "Align labels horizontally for effortless scanning."
          ],
          proTip: "Never use more than one accent color on a data slide. Let the key number be the focal point."
        },
        resources: [
          {
            id: "res-2-1",
            type: "video",
            title: "Visualizing Metrics for Executive Audiences",
            durationOrReadTime: "6 min video",
            description: "Highlighting key performance numbers without overwhelming tables."
          },
          {
            id: "res-2-2",
            type: "doc",
            title: "Chart Selection Cheat Sheet",
            durationOrReadTime: "3 min read",
            description: "When to use bar charts, metric cards, sparklines, or bullet charts."
          },
          {
            id: "res-2-3",
            type: "example",
            title: "Metric Card Layout Template",
            durationOrReadTime: "Component spec",
            description: "Clean layout pattern for displaying 3 key comparative numbers."
          }
        ],
        subtasks: [
          { id: "sub-2-1", title: "Identify the most impactful metric to display", completed: false },
          { id: "sub-2-2", title: "Structure a primary callout with 3x larger font weight", completed: false },
          { id: "sub-2-3", title: "Add comparative benchmark context underneath", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Share your slide preview link or attach a screenshot showing your metric callout.",
          placeholder: "https://...",
          verificationQuestion: "Is the focal statistic immediately distinct from the secondary text?"
        }
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Story Arc and Narrative Pacing",
        description: "Arrange slides into a compelling narrative arc that moves from tension to resolution.",
        type: "learn",
        creatorName: "Sarah Lin",
        creatorHandle: "@sarah_design",
        creatorAvatar: "/avatars/avatar-1.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: false,
        sparkGuidance: {
          overview: "A great presentation is a narrative journey: Status Quo, Catalyst, Complication, Solution, and Action.",
          keySteps: [
            "Define the audience's current pain point.",
            "Introduce the opportunity or turning point.",
            "Present your proposed solution concisely.",
            "State the exact next step required."
          ],
          proTip: "Transitions between slides should bridge the previous thought directly into the next."
        },
        resources: [
          {
            id: "res-3-1",
            type: "video",
            title: "The 3-Act Structure for Professional Presentations",
            durationOrReadTime: "9 min video",
            description: "Building urgency and maintaining audience attention across slides."
          },
          {
            id: "res-3-2",
            type: "doc",
            title: "Slide Sequence & Outline Matrix",
            durationOrReadTime: "5 min read",
            description: "Pacing frameworks used by top conference speakers."
          }
        ],
        subtasks: [
          { id: "sub-3-1", title: "Outline the 5-part narrative progression", completed: false },
          { id: "sub-3-2", title: "Draft transition phrases between adjacent slides", completed: false },
          { id: "sub-3-3", title: "Verify that the climax leads into a direct call to action", completed: false }
        ],
        evidenceRequirement: {
          type: "work_summary",
          prompt: "Summarize your 3-act narrative outline and explain how each section leads to the conclusion.",
          placeholder: "Act 1: Problem... Act 2: Complication... Act 3: Solution...",
          verificationQuestion: "Does your narrative clearly articulate the transition from challenge to solution?"
        }
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Live Rehearsal & Delivery Timing",
        description: "Deliver a 3-minute pitch with deliberate cadence, controlled pauses, and confidence.",
        type: "real_world_proof",
        creatorName: "Sarah Lin",
        creatorHandle: "@sarah_design",
        creatorAvatar: "/avatars/avatar-1.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Delivered Presentation Recording & Notes",
        artifactType: "summary",
        sparkGuidance: {
          overview: "Delivery isn't about speaking fast; it is about deliberate silence. Use pauses to let points land.",
          keySteps: [
            "Set a timer for 3 minutes.",
            "Record your delivery out loud without stopping.",
            "Note filler words or points where you stumbled.",
            "Re-run once focusing purely on steady pacing."
          ],
          proTip: "Pause for 2 seconds after each key takeaway. Silence projects authority."
        },
        resources: [
          {
            id: "res-4-1",
            type: "video",
            title: "Mastering Pauses and Vocal Modulation",
            durationOrReadTime: "8 min video",
            description: "Eliminating filler sounds and commanding physical presence."
          },
          {
            id: "res-4-2",
            type: "example",
            title: "Annotated Pitch Delivery Transcript",
            durationOrReadTime: "Sample script",
            description: "Markers showing exactly where to pause, slow down, and emphasize."
          }
        ],
        subtasks: [
          { id: "sub-4-1", title: "Conduct full 3-minute timed trial out loud", completed: false },
          { id: "sub-4-2", title: "Review recording for pacing and vocal clarity", completed: false },
          { id: "sub-4-3", title: "Write down 2 personal takeaways for continuous refinement", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Provide an audio/video recording link (e.g. Loom, Drive) or your written self-critique.",
          placeholder: "https://www.loom.com/share/... or your reflection notes",
          verificationQuestion: "Did you complete the timed 3-minute delivery out loud?"
        }
      }
    ];
  }

  if (
    lower.includes("video") ||
    lower.includes("edit") ||
    lower.includes("film") ||
    lower.includes("premiere") ||
    lower.includes("resolve")
  ) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "Setup your project & rough cut assembly",
        description: "Import footage, organize timelines, and make your initial assembly cuts.",
        type: "build",
        creatorName: "David Cole",
        creatorHandle: "@david_media",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Rough Cut Sequence",
        artifactType: "summary",
        sparkGuidance: {
          overview: "Editing is the art of subtraction. Start by removing the dead air before polishing transitions.",
          keySteps: [
            "Open the editor.",
            "Import the footage.",
            "Cut unnecessary parts.",
            "Add basic transitions."
          ],
          proTip: "Use keyboard shortcuts for blade and ripple delete. It will double your editing speed."
        },
        resources: [
          {
            id: "res-v1-1",
            type: "video",
            title: "Timeline Organization & Fast Rough Cutting",
            durationOrReadTime: "8 min video",
            description: "Three-point editing, ripple deletes, and track organization."
          },
          {
            id: "res-v1-2",
            type: "doc",
            title: "Standard Editing Keyboard Shortcuts",
            durationOrReadTime: "3 min read",
            description: "Essential hotkeys for Premiere Pro, DaVinci Resolve, and Final Cut."
          },
          {
            id: "res-v1-3",
            type: "tutorial",
            title: "The J-Cut and L-Cut Technique",
            durationOrReadTime: "5 min tutorial",
            description: "Smoothing audio-visual boundaries between adjacent scenes."
          }
        ],
        subtasks: [
          { id: "sub-v1-1", title: "Create a new project sequence with correct frame rate", completed: false },
          { id: "sub-v1-2", title: "Review raw footage and select the best takes", completed: false },
          { id: "sub-v1-3", title: "Perform rough cut eliminating silent pauses and false starts", completed: false }
        ],
        evidenceRequirement: {
          type: "screenshot",
          prompt: "Upload a screenshot of your timeline showing your organized sequence and edits.",
          placeholder: "Paste screenshot link or upload your timeline view...",
          verificationQuestion: "Have you cut the filler content and aligned your sequence?"
        }
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Audio cleanup, leveling & ambient sound",
        description: "Clean voice tracks, apply noise reduction, and balance background music.",
        type: "build",
        creatorName: "David Cole",
        creatorHandle: "@david_media",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Balanced Audio Mix",
        artifactType: "summary",
        sparkGuidance: {
          overview: "Viewers forgive mediocre video, but they will click away immediately from harsh audio.",
          keySteps: [
            "Apply high-pass filter at 80Hz.",
            "Set dialogue peaks to -6dB.",
            "Duck background music to -24dB under speech.",
            "Add subtle compression for vocal consistency."
          ],
          proTip: "Always test your audio through basic phone speakers or laptop speakers, not just studio headphones."
        },
        resources: [
          {
            id: "res-v2-1",
            type: "video",
            title: "Dialing Dialogue & Ducking Music",
            durationOrReadTime: "7 min video",
            description: "Setting proper gain stages and clean noise gates."
          },
          {
            id: "res-v2-2",
            type: "example",
            title: "Decibel Levels Reference Chart",
            durationOrReadTime: "Quick reference",
            description: "Target loudness standards (LUFS and dBFS) for web video."
          }
        ],
        subtasks: [
          { id: "sub-v2-1", title: "Normalize voice dialogue peaks", completed: false },
          { id: "sub-v2-2", title: "Add background audio bed with automated ducking", completed: false },
          { id: "sub-v2-3", title: "Eliminate low-frequency hum with high-pass filtering", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Share an export link or preview snippet demonstrating your balanced audio mix.",
          placeholder: "https://...",
          verificationQuestion: "Is dialogue clear and intelligible above background sound?"
        }
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Color correction, exposure & mood grading",
        description: "Correct white balance, match contrast across shots, and apply a cohesive look.",
        type: "learn",
        creatorName: "David Cole",
        creatorHandle: "@david_media",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: false,
        sparkGuidance: {
          overview: "Always balance exposure and skin tones first before applying creative color grades.",
          keySteps: [
            "Adjust exposure using waveforms.",
            "Balance color temperature using vectorscopes.",
            "Check skin tone line.",
            "Apply subtle creative LUT or curve contrast."
          ],
          proTip: "Trust scopes over your eyes. Monitor ambient light will bias your perception of color."
        },
        resources: [
          {
            id: "res-v3-1",
            type: "video",
            title: "Reading Waveforms & Vectorscopes in 5 Minutes",
            durationOrReadTime: "6 min video",
            description: "How to reliably read scopes to achieve consistent exposure."
          },
          {
            id: "res-v3-2",
            type: "doc",
            title: "Primary Color Correction Workflow",
            durationOrReadTime: "4 min read",
            description: "Luma, chroma, saturation, and contrast adjustment sequencing."
          }
        ],
        subtasks: [
          { id: "sub-v3-1", title: "Balance black levels and highlights on waveform", completed: false },
          { id: "sub-v3-2", title: "Match skin tones to the vectorscope indicator line", completed: false }
        ],
        evidenceRequirement: {
          type: "screenshot",
          prompt: "Submit a before/after screenshot of your color-corrected frame.",
          placeholder: "Image link or screenshot URL...",
          verificationQuestion: "Are highlights unclipped and skin tones naturally rendered?"
        }
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Final export and delivery package",
        description: "Encode optimized video deliverables with proper bitrate, codec, and aspect ratios.",
        type: "real_world_proof",
        creatorName: "David Cole",
        creatorHandle: "@david_media",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Final Master Video Export",
        artifactType: "live_demo",
        sparkGuidance: {
          overview: "Exporting with the right bitrate ensures crisp playback without bloated file sizes.",
          keySteps: [
            "Select H.264 or ProRes master.",
            "Set 2-pass VBR or constant rate factor.",
            "Check audio sample rate is 48kHz.",
            "Render and verify playback on multiple devices."
          ],
          proTip: "Always watch the full exported file once from beginning to end before delivering to clients."
        },
        resources: [
          {
            id: "res-v4-1",
            type: "video",
            title: "Export Settings Guide for YouTube and Web",
            durationOrReadTime: "5 min video",
            description: "Bitrates, color space tags, and keyframe intervals."
          }
        ],
        subtasks: [
          { id: "sub-v4-1", title: "Export final master video file", completed: false },
          { id: "sub-v4-2", title: "Conduct full visual quality check on mobile/desktop", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Provide a link to your exported video (YouTube unlisted, Vimeo, or cloud drive).",
          placeholder: "https://...",
          verificationQuestion: "Did you verify smooth playback on your final exported file?"
        }
      }
    ];
  }

  if (
    lower.includes("next") ||
    lower.includes("react") ||
    lower.includes("front") ||
    lower.includes("web")
  ) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "React Server Components & Component Tree Architecture",
        description: "Understand server vs. client boundaries, serialization boundaries, and Suspense layouts.",
        type: "learn",
        creatorName: "Tanvir Rahman",
        creatorHandle: "@tanvir_rahman",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "RSC Component Architecture",
        artifactType: "code",
        sparkGuidance: {
          overview: "Keep components on the server by default. Only add 'use client' when using state, effects, or browser APIs.",
          keySteps: [
            "Identify data-fetching parts of your tree.",
            "Keep database calls directly in Server Components.",
            "Pass data down as serializable props to client leaves.",
            "Wrap async boundaries in React Suspense."
          ],
          proTip: "Colocate fetching inside server components to eliminate waterfall network requests."
        },
        resources: [
          {
            id: "res-r1-1",
            type: "video",
            title: "Mental Models for React Server Components",
            durationOrReadTime: "11 min video",
            description: "Visualizing the RSC boundary and serialization tree."
          },
          {
            id: "res-r1-2",
            type: "doc",
            title: "Next.js App Router Architecture Guide",
            durationOrReadTime: "6 min read",
            description: "Server/client composition patterns and edge layout strategies."
          },
          {
            id: "res-r1-3",
            type: "example",
            title: "Colocated Async Component Pattern",
            durationOrReadTime: "Code specimen",
            description: "Direct async/await components with fallback skeletons."
          }
        ],
        subtasks: [
          { id: "sub-r1-1", title: "Map server vs client component boundaries", completed: false },
          { id: "sub-r1-2", title: "Implement async server data retrieval without useEffect", completed: false },
          { id: "sub-r1-3", title: "Add Suspense boundary with responsive skeleton fallback", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Share your GitHub repository link, commit hash, or CodeSandbox showing your RSC architecture.",
          placeholder: "https://github.com/...",
          verificationQuestion: "Are data fetches isolated inside server components without client hooks?"
        }
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Optimistic UI Mutations & Server Actions",
        description: "Build zero-latency form mutations with useOptimistic, revalidating tags without full refreshes.",
        type: "build",
        creatorName: "Sumaiya Kabir",
        creatorHandle: "@sumaiya_kabir",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Optimistic Action State Machine",
        artifactType: "code",
        sparkGuidance: {
          overview: "Optimistic UI updates immediately reflect user actions before the server responds, handling rollbacks on error.",
          keySteps: [
            "Create a Server Action with input validation.",
            "Use React 19 useOptimistic hook in your form.",
            "Trigger instant local state mutation on submit.",
            "Revalidate path/tag upon server confirmation."
          ],
          proTip: "Always retain the previous state snapshot so rollbacks feel instantaneous if network calls fail."
        },
        resources: [
          {
            id: "res-r2-1",
            type: "doc",
            title: "Zero-Latency UI with React 19 useOptimistic",
            durationOrReadTime: "7 min read",
            description: "Step-by-step guide to instant mutations and rollbacks."
          },
          {
            id: "res-r2-2",
            type: "example",
            title: "Server Action State Reducer",
            durationOrReadTime: "Pattern specimen",
            description: "Immutable state updates with optimistic pending flags."
          }
        ],
        subtasks: [
          { id: "sub-r2-1", title: "Set up Server Action for item mutation", completed: false },
          { id: "sub-r2-2", title: "Wrap state with useOptimistic for instant feedback", completed: false },
          { id: "sub-r2-3", title: "Implement error handling rollback verification", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Submit a link to your form component with useOptimistic implementation.",
          placeholder: "https://github.com/...",
          verificationQuestion: "Does the UI immediately update before the server network request completes?"
        }
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Route Handlers & Edge Runtime Caching Strategies",
        description: "Configure incremental static regeneration (ISR) and stale-while-revalidate caching headers.",
        type: "learn",
        creatorName: "Tanvir Rahman",
        creatorHandle: "@tanvir_rahman",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: false,
        sparkGuidance: {
          overview: "Granular caching headers prevent stale reads while insulating backend databases from excessive traffic.",
          keySteps: [
            "Configure fetch cache tags.",
            "Implement revalidateTag in mutation handlers.",
            "Inspect Cache-Control headers in network tab.",
            "Verify edge cache hit ratio."
          ],
          proTip: "Use tag-based invalidation instead of time-based invalidation whenever possible for near-instant updates."
        },
        resources: [
          {
            id: "res-r3-1",
            type: "video",
            title: "Edge Runtime & Cache Revalidation Deep Dive",
            durationOrReadTime: "10 min video",
            description: "How CDN edge networks store and invalidate dynamic Next.js routes."
          }
        ],
        subtasks: [
          { id: "sub-r3-1", title: "Add tag-based fetch options to data queries", completed: false },
          { id: "sub-r3-2", title: "Trigger on-demand revalidation on update", completed: false }
        ],
        evidenceRequirement: {
          type: "link",
          prompt: "Provide a link to your route handler or commit with caching headers.",
          placeholder: "https://github.com/...",
          verificationQuestion: "Did you verify that revalidateTag refreshes the cached data?"
        }
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Production Deliverable: End-to-End Feature Verification",
        description: "Ship a complete production-grade feature with error boundaries, tests, and telemetry.",
        type: "real_world_proof",
        creatorName: "Sumaiya Kabir",
        creatorHandle: "@sumaiya_kabir",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: minutes,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Production Next.js Feature PR",
        artifactType: "summary",
        sparkGuidance: {
          overview: "A production-grade feature handles failures gracefully with localized error boundaries and clear recovery actions.",
          keySteps: [
            "Add error.tsx boundary component.",
            "Include reset() button for user retry.",
            "Add loading.tsx skeleton for fast visual feedback.",
            "Verify complete workflow manually."
          ],
          proTip: "Always isolate error boundaries close to the leaf components that might throw."
        },
        resources: [
          {
            id: "res-r4-1",
            type: "doc",
            title: "Production Readiness Checklist for Next.js",
            durationOrReadTime: "4 min read",
            description: "Essential sanity checks for telemetry, boundaries, and metadata."
          }
        ],
        subtasks: [
          { id: "sub-r4-1", title: "Create localized error.tsx component", completed: false },
          { id: "sub-r4-2", title: "Add loading.tsx boundary", completed: false },
          { id: "sub-r4-3", title: "Test error recovery reset action", completed: false }
        ],
        evidenceRequirement: {
          type: "work_summary",
          prompt: "Summarize your production feature and provide links to your PR or deployment.",
          placeholder: "Describe the feature, edge cases tested, and production verification...",
          verificationQuestion: "Did you verify that your error boundaries recover gracefully when errors occur?"
        }
      }
    ];
  }

  return [
    {
      id: `task-${Date.now()}-1`,
      dayNumber: 1,
      title: `${skillTitle}: Core Foundations & Architecture`,
      description: `Deconstruct ${skillTitle} into foundational principles and establish a disciplined workflow.`,
      type: "learn",
      creatorName: "Tanvir Rahman",
      creatorHandle: "@tanvir_rahman",
      creatorAvatar: "/avatars/avatar-3.svg",
      estimatedMinutes: minutes,
      completed: false,
      producesArtifact: true,
      artifactTitle: `${skillTitle} Architecture Spec`,
      artifactType: "summary",
      sparkGuidance: {
        overview: `To build mastery in ${skillTitle}, focus on solid conceptual primitives before jumping into complexity.`,
        keySteps: [
          "Understand the primary objective.",
          "Identify the core inputs and outputs.",
          "Map out the sequential stages.",
          "Document initial assumptions."
        ],
        proTip: "Mastery begins with clean definitions. Make sure every term is unambiguous."
      },
      resources: [
        {
          id: "res-g1-1",
          type: "video",
          title: `Foundations of ${skillTitle}`,
          durationOrReadTime: "8 min video",
          description: `Key principles and high-level architecture overview for ${skillTitle}.`
        },
        {
          id: "res-g1-2",
          type: "doc",
          title: "Technical Specification Guidelines",
          durationOrReadTime: "4 min read",
          description: "Structuring clean documentation and architectural specifications."
        }
      ],
      subtasks: [
        { id: "sub-g1-1", title: "Review architectural foundations", completed: false },
        { id: "sub-g1-2", title: "Draft high-level component boundaries", completed: false },
        { id: "sub-g1-3", title: "Document 3 primary constraints", completed: false }
      ],
      evidenceRequirement: {
        type: "work_summary",
        prompt: `Provide your notes, outline, or implementation link for ${skillTitle}.`,
        placeholder: "Summarize your architectural decisions or paste link...",
        verificationQuestion: "Did you clearly identify the core inputs, outputs, and constraints?"
      }
    },
    {
      id: `task-${Date.now()}-2`,
      dayNumber: 2,
      title: `${skillTitle}: Practical Hands-on Implementation`,
      description: `Build the primary functional deliverable for ${skillTitle} using industry best practices.`,
      type: "build",
      creatorName: "Sumaiya Kabir",
      creatorHandle: "@sumaiya_kabir",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: minutes,
      completed: false,
      producesArtifact: true,
      artifactTitle: `${skillTitle} Working Deliverable`,
      artifactType: "code",
      sparkGuidance: {
        overview: `Put theory into practice. Build a clean, minimal working implementation for ${skillTitle}.`,
        keySteps: [
          "Set up the working environment.",
          "Implement the core logic step by step.",
          "Test with realistic sample inputs.",
          "Refactor for clarity and maintainability."
        ],
        proTip: "Make it work first, then make it clean, and finally optimize if necessary."
      },
      resources: [
        {
          id: "res-g2-1",
          type: "tutorial",
          title: `Step-by-Step Implementation Guide for ${skillTitle}`,
          durationOrReadTime: "10 min guide",
          description: "Concrete walkthrough from zero to a working prototype."
        },
        {
          id: "res-g2-2",
          type: "example",
          title: "Reference Implementation Code",
          durationOrReadTime: "Sample project",
          description: "Production-ready structure with annotations."
        }
      ],
      subtasks: [
        { id: "sub-g2-1", title: "Initialize core project structure", completed: false },
        { id: "sub-g2-2", title: "Implement key logic functions", completed: false },
        { id: "sub-g2-3", title: "Execute initial smoke test", completed: false }
      ],
      evidenceRequirement: {
        type: "link",
        prompt: "Submit a link or screenshot to your completed working code/deliverable.",
        placeholder: "https://...",
        verificationQuestion: "Does your implementation successfully run with valid inputs?"
      }
    },
    {
      id: `task-${Date.now()}-3`,
      dayNumber: 3,
      title: `${skillTitle}: Edge Cases & Resilience`,
      description: `Harden implementations against unexpected failures, timeouts, and edge cases.`,
      type: "learn",
      creatorName: "Sumaiya Kabir",
      creatorHandle: "@sumaiya_kabir",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: minutes,
      completed: false,
      producesArtifact: false,
      sparkGuidance: {
        overview: "Robust solutions distinguish themselves in how gracefully they handle boundary conditions.",
        keySteps: [
          "Enumerate potential failure modes.",
          "Add input validations and guards.",
          "Implement deterministic error handling.",
          "Verify recovery behavior."
        ],
        proTip: "Assume anything that can fail eventually will fail. Design clean fallback paths."
      },
      resources: [
        {
          id: "res-g3-1",
          type: "doc",
          title: "Defensive Engineering & Error Strategies",
          durationOrReadTime: "5 min read",
          description: "Pattern library for handling boundary conditions and unexpected states."
        }
      ],
      subtasks: [
        { id: "sub-g3-1", title: "Document top 3 edge cases", completed: false },
        { id: "sub-g3-2", title: "Implement validation guards", completed: false }
      ],
      evidenceRequirement: {
        type: "work_summary",
        prompt: "Describe how your implementation handles unexpected inputs or network failures.",
        placeholder: "Detail edge case handling...",
        verificationQuestion: "Did you verify that edge cases are safely caught without crashes?"
      }
    },
    {
      id: `task-${Date.now()}-4`,
      dayNumber: 4,
      title: `Capstone Deliverable: ${skillTitle} Production Proof`,
      description: `Synthesize all sprint concepts into a verified production-ready project deliverable.`,
      type: "real_world_proof",
      creatorName: "Sumaiya Kabir",
      creatorHandle: "@sumaiya_kabir",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: minutes,
      completed: false,
      producesArtifact: true,
      artifactTitle: `${skillTitle} Production Portfolio Proof`,
      artifactType: "summary",
      sparkGuidance: {
        overview: "Assemble your completed work into a portfolio-ready artifact demonstrating mastery.",
        keySteps: [
          "Consolidate all project files.",
          "Write a concise project summary.",
          "Verify end-to-end functionality.",
          "Publish or archive the deliverable."
        ],
        proTip: "Clear documentation turns good code into a portfolio showcase."
      },
      resources: [
        {
          id: "res-g4-1",
          type: "doc",
          title: "Showcasing Proof of Work Effectively",
          durationOrReadTime: "4 min read",
          description: "How to structure portfolio items for maximum technical credibility."
        }
      ],
      subtasks: [
        { id: "sub-g4-1", title: "Perform final end-to-end audit", completed: false },
        { id: "sub-g4-2", title: "Publish project link or summary", completed: false }
      ],
      evidenceRequirement: {
        type: "link",
        prompt: "Submit the final public link, GitHub PR, or artifact evidence for verification.",
        placeholder: "https://...",
        verificationQuestion: "Is this deliverable ready for external review and portfolio inclusion?"
      }
    }
  ];
};

export async function updateSprintSkillInDb(
  userId: string,
  skillTitle: string,
  milestone: string,
  level: string = "Intermediate",
  dailyTime: string = "20 mins / day",
): Promise<SprintTask[] | null> {
  try {
    const { data: sprintRecord } = await supabase
      .from("sprints")
      .update({
        skill_title: skillTitle,
        career_milestone: milestone,
        duration_days: 6,
      })
      .eq("user_id", userId)
      .select("id")
      .single();

    const targetSprintId = sprintRecord?.id || "sprint-1";
    const newTasks = generateTasksForSkill(targetSprintId, skillTitle, level, dailyTime);

    await supabase
      .from("sprint_tasks")
      .delete()
      .eq("sprint_id", targetSprintId);

    const insertRows = newTasks.map((t) => ({
      id: t.id,
      sprint_id: targetSprintId,
      day_number: t.dayNumber,
      title: t.title,
      description: t.description,
      task_type: t.type,
      creator_name: t.creatorName,
      creator_handle: t.creatorHandle,
      creator_avatar: t.creatorAvatar,
      estimated_minutes: t.estimatedMinutes,
      completed: t.completed,
      produces_artifact: t.producesArtifact,
      artifact_title: t.artifactTitle || null,
      artifact_type: t.artifactType || null,
    }));

    await supabase.from("sprint_tasks").insert(insertRows);
    return newTasks;
  } catch (err) {
    console.error("Error updating sprint skill in DB:", err);
    return null;
  }
}

/**
 * Send real password reset email via Supabase Auth
 */
export async function resetPasswordUser(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Supabase password reset error:", err);
    return {
      success: false,
      error: err.message || "Failed to send password reset email",
    };
  }
}

/**
 * Insert mascot chat message into database
 */
export async function addMascotMessageToDb(
  message: {
    id: string;
    context: string;
    text: string;
    actionLabel?: string;
    actionType?: string;
  },
  userId: string = "user-1",
) {
  try {
    await supabase.from("mascot_messages").insert({
      id: message.id,
      user_id: userId,
      context: message.context,
      text: message.text,
      action_label: message.actionLabel || null,
      action_type: message.actionType || null,
    });
  } catch (err) {
    console.error("Error inserting mascot message into DB:", err);
  }
}

/**
 * Full reset of the demo account (user-1) back to initial baseline
 */
export async function resetDemoAccountInDb(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // 1. Reset user profile
    await supabase
      .from("profiles")
      .update({
        name: "Alex Chen",
        handle: "@alexchen.dev",
        email: "hello@thenicedev.xyz",
        avatar: "/avatars/avatar-1.svg",
        bio: "Staff Software Engineer exploring distributed systems, caching hierarchies, and resilient microservices.",
        streak: 8,
        max_streak: 12,
        reputation: 240,
        squad_id: "squad-1",
        macro_squad_id: "macro-squad-1",
        primary_goal: "Build resilient production software",
        career_milestone: "Staff Backend & Distributed Systems Architect",
        onboarding_completed: false,
        survey_data: {
          subjects: ["Computer Science/ICT", "Mathematics"],
          hobbies: ["Gaming", "Reading"],
          age: "24",
          ageInput: "24",
          learningStage: "Early Career / Rising Engineer",
          targetProfession: "Staff Backend & Distributed Systems Architect",
          startingSkills: [
            "System Architecture & Scalability",
            "Next.js App Router & Server Components",
          ],
          completedAt: new Date().toISOString(),
        },
        privacy: {
          showStreak: true,
          showSquad: true,
          showReputation: true,
          publicProfile: true,
          hideRawRoadmaps: false,
        },
        focus_seconds_today: 1080,
        last_focus_date: new Date().toISOString().split("T")[0],
        is_timer_running: true,
        total_focus_seconds: 1080,
      })
      .eq("id", "user-1");

    // 2. Reset sprint
    await supabase
      .from("sprints")
      .update({
        skill_title: "System Architecture",
        career_milestone: "Staff Backend & Distributed Systems Architect",
        duration_days: 4,
        current_day: 1,
        reshuffle_count: 0,
        last_reshuffled_at: null,
        mascot_narration:
          "Ready for today? Complete your deliberate practice task to advance your progress!",
      })
      .eq("user_id", "user-1");

    // 3. Reset sprint tasks
    await supabase
      .from("sprint_tasks")
      .update({
        completed: false,
        completed_at: null,
      })
      .eq("sprint_id", "sprint-1");

    // 4. Reset portfolio items - delete dynamically generated ones
    const { data: userPortItems } = await supabase
      .from("portfolio_items")
      .select("id")
      .eq("user_id", "user-1");

    const toDeletePortIds = (userPortItems || [])
      .filter((item: any) => item.id !== "port-1" && item.id !== "port-2")
      .map((item: any) => item.id);

    if (toDeletePortIds.length > 0) {
      await supabase.from("portfolio_items").delete().in("id", toDeletePortIds);
    }

    // Ensure baseline portfolio items exist & are published
    await supabase.from("portfolio_items").upsert([
      {
        id: "port-1",
        user_id: "user-1",
        title: "Probabilistic Cache Early Expiration Benchmark",
        category: "System Architecture",
        date: "Yesterday",
        description:
          "Benchmark comparing vanilla TTL vs XFetch probabilistic early recomputation algorithm under 10k RPS load.",
        artifact_type: "code",
        preview_snippet:
          "function xfetch(key, ttl, beta = 1.0, delta = 50) {\n  const [val, deltaCalc, expiry] = redis.get(key);\n  if (!val || (Date.now() - (delta * beta * Math.log(Math.random()))) >= expiry) {\n    const freshVal = recomputeExpensiveValue();\n    redis.set(key, freshVal, ttl);\n    return freshVal;\n  }\n  return val;\n}",
        is_published: true,
        source_task_id: "task-1",
        tags: ["caching", "redis", "high-throughput"],
      },
      {
        id: "port-2",
        user_id: "user-1",
        title: "Postgres Read-Replica Connection Pooler ADR",
        category: "Database Engineering",
        date: "Last week",
        description:
          "Architecture Decision Record for pgBouncer transaction pooling in serverless edge environments.",
        artifact_type: "summary",
        preview_snippet:
          "Status: Accepted\nContext: Edge functions spawning 500+ ephemeral DB connections causing Postgres MAX_CONNECTIONS exhaustion.\nDecision: Deploy PgBouncer in transaction mode with max_client_conn=5000 and default_pool_size=40.",
        is_published: true,
        source_task_id: "task-prev",
        tags: ["postgres", "architecture", "scalability"],
      },
    ]);

    // 5. Reset real world proofs
    await supabase
      .from("real_world_proofs")
      .update({ completed: true })
      .eq("id", "proof-1");
    await supabase
      .from("real_world_proofs")
      .update({ completed: true })
      .eq("id", "proof-2");
    await supabase
      .from("real_world_proofs")
      .update({ completed: false })
      .eq("id", "proof-3");

    // 6. Reset squad progress & pings
    await supabase
      .from("squads")
      .update({ current_progress: 7 })
      .eq("id", "squad-1");
    await supabase
      .from("squad_activity_pings")
      .delete()
      .eq("squad_id", "squad-1")
      .neq("id", "ping-1");

    return { success: true };
  } catch (err: any) {
    console.error("Error resetting demo account in DB:", err);
    return {
      success: false,
      error: err.message || "Failed to reset demo account",
    };
  }
}

export async function fetchAvailableSquads(): Promise<MicroSquad[]> {
  try {
    const { data: squadsData, error } = await supabase
      .from("squads")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !squadsData) return [];

    const squads: MicroSquad[] = [];
    for (const squad of squadsData) {
      const { data: members } = await supabase
        .from("squad_members")
        .select("*")
        .eq("squad_id", squad.id);

      const { data: pings } = await supabase
        .from("squad_activity_pings")
        .select("*")
        .eq("squad_id", squad.id)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: project } = await supabase
        .from("squad_projects")
        .select("*")
        .eq("squad_id", squad.id)
        .maybeSingle();

      squads.push({
        id: squad.id,
        name: squad.name,
        skillFocus: squad.skill_focus,
        sharedGoal: squad.shared_goal || "",
        currentProgress: squad.current_progress || 0,
        targetProgress: squad.target_progress || 12,
        inviteCode: squad.invite_code,
        members: (members || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          handle: m.handle,
          avatar: m.avatar || "/avatars/avatar-1.svg",
          streak: m.streak || 0,
          checkedInToday: m.checked_in_today || false,
          lastCheckIn: m.last_check_in || "Recently",
          recentEncouragement: m.recent_encouragement || "",
          role: m.role || "member",
          cheerCount: 0,
          submittedProject: false,
        })),
        activityPings: (pings || []).map((p: any) => ({
          id: p.id,
          memberId: p.member_id,
          memberName: p.member_name,
          memberAvatar: p.member_avatar || "/avatars/avatar-1.svg",
          actionText: p.action_text,
          timestamp: "Recently",
          type: p.ping_type,
        })),
        activeProject: project
          ? {
              id: project.id,
              title: project.title,
              description: project.description || "",
              deadline: project.deadline || "Sunday, 11:59 PM",
              status: "in_progress",
              submissionsCount: (project.submissions || []).length,
              totalMembers: (members || []).length,
              deliverables: project.deliverables || [],
            }
          : undefined,
      });
    }

    return squads;
  } catch (err) {
    console.error("Error fetching available squads:", err);
    return [];
  }
}

export async function fetchPracticeCurriculum(
  skillTitle: string,
  dayNumber: number,
): Promise<any | null> {
  try {
    const lower = skillTitle.toLowerCase();
    let skillId = "system_architecture";
    if (
      lower.includes("next") ||
      lower.includes("react") ||
      lower.includes("front")
    ) {
      skillId = "nextjs";
    } else if (lower.includes("type") || lower.includes("ts")) {
      skillId = "typescript";
    } else if (
      lower.includes("ui") ||
      lower.includes("design") ||
      lower.includes("product")
    ) {
      skillId = "ui_engineering";
    }

    const { data, error } = await supabase
      .from("practice_curriculum")
      .select("*")
      .eq("skill_id", skillId)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (error || !data) return null;

    return {
      taskId: `curriculum-${skillId}-${dayNumber}`,
      dayNumber: data.day_number,
      estimatedMinutes: 20,
      skillTitle,
      taskTitle: data.video_lesson?.title || `${skillTitle} Day ${dayNumber}`,
      creatorName: data.video_lesson?.instructorName || "Staff Engineer",
      creatorAvatar:
        data.video_lesson?.instructorAvatar || "/avatars/avatar-2.svg",
      creatorHandle: "@staff.eng",
      videoLesson: data.video_lesson,
      courseSections: data.course_sections,
      knowledgeCheck: data.knowledge_check,
      briefing: data.briefing,
      exercise: data.exercise,
      artifactDraft: data.artifact_draft,
    };
  } catch (err) {
    console.error("Error fetching practice curriculum:", err);
    return null;
  }
}

export async function fetchTaskTemplates(
  skillCategory?: string,
): Promise<SprintTask[]> {
  try {
    let query = supabase.from("task_templates").select("*");
    if (skillCategory) {
      query = query.ilike("skill_category", `%${skillCategory}%`);
    }
    const { data, error } = await query.order("day_number", { ascending: true });
    if (error || !data || data.length === 0) return [];

    return data.map((t: any) => ({
      id: t.id,
      dayNumber: t.day_number,
      title: t.title,
      description: t.description || "",
      type: t.task_type || "learn",
      creatorName: t.creator_name,
      creatorHandle: t.creator_handle,
      creatorAvatar: t.creator_avatar || "/avatars/avatar-2.svg",
      estimatedMinutes: t.estimated_minutes || 20,
      completed: false,
      producesArtifact: t.produces_artifact || false,
      artifactTitle: t.artifact_title,
      artifactType: t.artifact_type,
      realWorldActionDescription: t.real_world_action_description,
    }));
  } catch (err) {
    console.error("Error fetching task templates:", err);
    return [];
  }
}

export async function fetchQuestionnaireConfig(
  category?: string,
): Promise<any[]> {
  try {
    let query = supabase
      .from("questionnaire_config")
      .select("*")
      .order("sort_order", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Error fetching questionnaire config:", err);
    return [];
  }
}

export async function fetchSearchSuggestions(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("search_suggestions")
      .select("*");
    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Error fetching search suggestions:", err);
    return [];
  }
}

export async function logAdminAction(
  adminId: string,
  adminName: string,
  action: string,
  targetType: string,
  targetId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from("admin_audit_logs").insert({
      admin_id: adminId,
      admin_name: adminName,
      action,
      target_type: targetType,
      target_id: targetId || null,
      details: details || {},
    });
  } catch (err) {
    console.error("Failed to write admin audit log:", err);
  }
}

export async function fetchAdminAuditLogs(): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      adminId: d.admin_id,
      adminName: d.admin_name || "Admin",
      action: d.action,
      targetType: d.target_type,
      targetId: d.target_id,
      details: d.details || {},
      createdAt: d.created_at,
    }));
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    return [];
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const [
      usersRes,
      squadsRes,
      sprintsRes,
      reportsRes,
      pendingReportsRes,
      tasksRes,
      discussionsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("squads").select("id", { count: "exact", head: true }),
      supabase.from("sprints").select("id", { count: "exact", head: true }),
      supabase.from("squad_reports").select("id", { count: "exact", head: true }),
      supabase
        .from("squad_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("task_templates").select("id", { count: "exact", head: true }),
      supabase.from("community_posts").select("id", { count: "exact", head: true }),
    ]);

    return {
      totalUsers: usersRes.count ?? 0,
      totalSquads: squadsRes.count ?? 0,
      totalSprints: sprintsRes.count ?? 0,
      totalReports: reportsRes.count ?? 0,
      pendingReports: pendingReportsRes.count ?? 0,
      totalCurriculumTasks: tasksRes.count ?? 0,
      totalDiscussions: discussionsRes.count ?? 0,
    };
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return {
      totalUsers: 0,
      totalSquads: 0,
      totalSprints: 0,
      totalReports: 0,
      pendingReports: 0,
      totalCurriculumTasks: 0,
      totalDiscussions: 0,
    };
  }
}

export async function fetchAllUsersAdmin(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      handle: d.handle,
      email: d.email || "",
      avatar: d.avatar,
      bio: d.bio || "",
      streak: d.streak ?? 0,
      maxStreak: d.max_streak ?? 0,
      reputation: d.reputation ?? 0,
      squadId: d.squad_id,
      macroSquadId: d.macro_squad_id,
      primaryGoal: d.primary_goal,
      careerMilestone: d.career_milestone,
      onboardingCompleted: d.onboarding_completed,
      surveyData: d.survey_data || undefined,
      joinedDate: d.created_at ? new Date(d.created_at).toLocaleDateString() : "August 2026",
      role: d.role || "user",
      status: d.status || "active",
      privacy: d.privacy || {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false,
      },
    }));
  } catch (err) {
    console.error("Error fetching all users for admin:", err);
    return [];
  }
}

export async function updateUserRoleAndStatusAdmin(
  adminId: string,
  adminName: string,
  targetUserId: string,
  role: "admin" | "user" | "moderator",
  status: "active" | "suspended" | "flagged",
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role, status, updated_at: new Date().toISOString() })
      .eq("id", targetUserId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "UPDATE_USER_PERMISSIONS",
      "user",
      targetUserId,
      { newRole: role, newStatus: status },
    );

    return true;
  } catch (err) {
    console.error("Error updating user role/status:", err);
    return false;
  }
}

export async function fetchAllSquadsAdmin(): Promise<any[]> {
  try {
    const { data: squads, error: squadsErr } = await supabase
      .from("squads")
      .select("*")
      .order("created_at", { ascending: false });

    if (squadsErr || !squads) return [];

    const { data: members } = await supabase.from("squad_members").select("*");

    return squads.map((sq: any) => ({
      id: sq.id,
      name: sq.name,
      skillFocus: sq.skill_focus,
      sharedGoal: sq.shared_goal,
      currentProgress: sq.current_progress,
      targetProgress: sq.target_progress,
      inviteCode: sq.invite_code,
      createdAt: sq.created_at,
      members: (members || [])
        .filter((m: any) => m.squad_id === sq.id)
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          handle: m.handle,
          avatar: m.avatar,
          streak: m.streak,
          checkedInToday: m.checked_in_today,
          role: m.role,
        })),
    }));
  } catch (err) {
    console.error("Error fetching squads for admin:", err);
    return [];
  }
}

export async function updateSquadAdmin(
  adminId: string,
  adminName: string,
  squadId: string,
  updates: {
    name?: string;
    skillFocus?: string;
    sharedGoal?: string;
    targetProgress?: number;
  },
): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.skillFocus !== undefined) dbUpdates.skill_focus = updates.skillFocus;
    if (updates.sharedGoal !== undefined) dbUpdates.shared_goal = updates.sharedGoal;
    if (updates.targetProgress !== undefined)
      dbUpdates.target_progress = updates.targetProgress;

    const { error } = await supabase
      .from("squads")
      .update(dbUpdates)
      .eq("id", squadId);

    if (error) throw error;

    await logAdminAction(adminId, adminName, "UPDATE_SQUAD", "squad", squadId, updates);
    return true;
  } catch (err) {
    console.error("Error updating squad:", err);
    return false;
  }
}

export async function fetchAllSquadReportsAdmin(): Promise<AnonymousSquadReport[]> {
  try {
    const { data, error } = await supabase
      .from("squad_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      squadId: r.squad_id,
      reportedMemberId: r.reported_member_id,
      reportedMemberName: r.reported_member_name || "Squad Member",
      reasonCategory: r.reason_category,
      details: r.details,
      status: r.status,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("Error fetching squad reports:", err);
    return [];
  }
}

export async function resolveSquadReportAdmin(
  adminId: string,
  adminName: string,
  reportId: string,
  status: "reviewed" | "dismissed",
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("squad_reports")
      .update({ status })
      .eq("id", reportId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      status === "reviewed" ? "RESOLVE_REPORT" : "DISMISS_REPORT",
      "report",
      reportId,
      { status },
    );
    return true;
  } catch (err) {
    console.error("Error resolving squad report:", err);
    return false;
  }
}

export async function fetchAllTaskTemplatesAdmin(): Promise<TaskTemplate[]> {
  try {
    const { data, error } = await supabase
      .from("task_templates")
      .select("*")
      .order("skill_category", { ascending: true })
      .order("day_number", { ascending: true });

    if (error || !data) return [];
    return data.map((t: any) => ({
      id: t.id,
      skillCategory: t.skill_category,
      dayNumber: t.day_number,
      title: t.title,
      description: t.description || "",
      taskType: t.task_type || "learn",
      creatorName: t.creator_name,
      creatorHandle: t.creator_handle,
      creatorAvatar: t.creator_avatar,
      estimatedMinutes: t.estimated_minutes ?? 20,
      producesArtifact: t.produces_artifact ?? false,
      artifactTitle: t.artifact_title,
      artifactType: t.artifact_type,
      realWorldActionDescription: t.real_world_action_description,
    }));
  } catch (err) {
    console.error("Error fetching task templates:", err);
    return [];
  }
}

export async function updateTaskTemplateAdmin(
  adminId: string,
  adminName: string,
  taskId: string,
  updates: Partial<TaskTemplate>,
): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.estimatedMinutes !== undefined)
      dbUpdates.estimated_minutes = updates.estimatedMinutes;
    if (updates.taskType !== undefined) dbUpdates.task_type = updates.taskType;
    if (updates.artifactTitle !== undefined)
      dbUpdates.artifact_title = updates.artifactTitle;

    const { error } = await supabase
      .from("task_templates")
      .update(dbUpdates)
      .eq("id", taskId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "UPDATE_TASK_TEMPLATE",
      "curriculum",
      taskId,
      updates,
    );
    return true;
  } catch (err) {
    console.error("Error updating task template:", err);
    return false;
  }
}

export async function fetchAllDiscussionsAdmin(): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((p: any) => ({
      id: p.id,
      skillId: p.skill_id,
      skillTitle: p.skill_title,
      authorName: p.author_name,
      authorHandle: p.author_handle,
      authorAvatar: p.author_avatar,
      authorReputation: p.author_reputation,
      title: p.title,
      content: p.content,
      category: p.category,
      upvotes: p.upvotes,
      userUpvoted: p.user_upvoted,
      repliesCount: p.replies_count,
      replies: p.replies || [],
      createdAt: p.created_at,
    }));
  } catch (err) {
    console.error("Error fetching discussions for admin:", err);
    return [];
  }
}

export async function deleteDiscussionAdmin(
  adminId: string,
  adminName: string,
  postId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "DELETE_COMMUNITY_POST",
      "discussion",
      postId,
    );
    return true;
  } catch (err) {
    console.error("Error deleting discussion:", err);
    return false;
  }
}

export async function createUserAdmin(
  adminId: string,
  adminName: string,
  userData: {
    name: string;
    email: string;
    handle?: string;
    role?: "admin" | "moderator" | "user";
    status?: "active" | "flagged" | "suspended";
    primaryGoal?: string;
    careerMilestone?: string;
  },
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const newId = `usr_${Date.now()}`;
    const handle =
      userData.handle ||
      `@${userData.name.toLowerCase().replace(/\s+/g, ".")}`;
    const newProfile: any = {
      id: newId,
      name: userData.name,
      handle,
      email: userData.email,
      avatar: `/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.svg`,
      bio: "",
      streak: 0,
      max_streak: 0,
      reputation: 0,
      role: userData.role || "user",
      status: userData.status || "active",
      primary_goal: userData.primaryGoal || "Master Technical Foundations",
      career_milestone: userData.careerMilestone || "Software Engineer",
      onboarding_completed: true,
      privacy: {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false,
      },
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").insert(newProfile);
    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "CREATE_USER",
      "user",
      newId,
      { name: userData.name, email: userData.email, role: userData.role },
    );

    const mappedUser: UserProfile = {
      id: newId,
      name: newProfile.name,
      handle: newProfile.handle,
      email: newProfile.email,
      avatar: newProfile.avatar,
      bio: newProfile.bio,
      streak: 0,
      maxStreak: 0,
      reputation: 0,
      squadId: null,
      macroSquadId: null,
      role: newProfile.role,
      status: newProfile.status,
      primaryGoal: newProfile.primary_goal,
      careerMilestone: newProfile.career_milestone,
      onboardingCompleted: true,
      joinedDate: "Just now",
      privacy: newProfile.privacy,
    };

    return { success: true, user: mappedUser };
  } catch (err: any) {
    console.error("Error creating user from admin:", err);
    return { success: false, error: err.message || "Failed to create user" };
  }
}

export async function updateUserFullAdmin(
  adminId: string,
  adminName: string,
  targetUserId: string,
  updates: {
    name?: string;
    email?: string;
    handle?: string;
    role?: "admin" | "user" | "moderator";
    status?: "active" | "suspended" | "flagged";
    primaryGoal?: string;
    careerMilestone?: string;
  },
): Promise<boolean> {
  try {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.handle !== undefined) dbUpdates.handle = updates.handle;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.primaryGoal !== undefined)
      dbUpdates.primary_goal = updates.primaryGoal;
    if (updates.careerMilestone !== undefined)
      dbUpdates.career_milestone = updates.careerMilestone;

    const { error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", targetUserId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "UPDATE_USER_FULL",
      "user",
      targetUserId,
      updates,
    );

    return true;
  } catch (err) {
    console.error("Error updating user full details:", err);
    return false;
  }
}

export async function deleteUserAdmin(
  adminId: string,
  adminName: string,
  targetUserId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", targetUserId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "DELETE_USER",
      "user",
      targetUserId,
      { targetUserId },
    );

    return true;
  } catch (err) {
    console.error("Error deleting user:", err);
    return false;
  }
}

export async function createSquadAdmin(
  adminId: string,
  adminName: string,
  squadData: {
    name: string;
    skillFocus: string;
    sharedGoal: string;
    targetProgress: number;
    inviteCode?: string;
  },
): Promise<{ success: boolean; squad?: any; error?: string }> {
  try {
    const newId = `squad-${Date.now()}`;
    const inviteCode =
      squadData.inviteCode ||
      `HUDDLE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newSquad = {
      id: newId,
      name: squadData.name,
      skill_focus: squadData.skillFocus,
      shared_goal: squadData.sharedGoal,
      current_progress: 0,
      target_progress: squadData.targetProgress || 12,
      invite_code: inviteCode,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("squads").insert(newSquad);
    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "CREATE_SQUAD",
      "squad",
      newId,
      { name: squadData.name, skillFocus: squadData.skillFocus },
    );

    return {
      success: true,
      squad: {
        id: newId,
        name: newSquad.name,
        skillFocus: newSquad.skill_focus,
        sharedGoal: newSquad.shared_goal,
        currentProgress: 0,
        targetProgress: newSquad.target_progress,
        inviteCode: newSquad.invite_code,
        createdAt: newSquad.created_at,
        members: [],
      },
    };
  } catch (err: any) {
    console.error("Error creating squad:", err);
    return { success: false, error: err.message || "Failed to create squad" };
  }
}

export async function deleteSquadAdmin(
  adminId: string,
  adminName: string,
  squadId: string,
): Promise<boolean> {
  try {
    await supabase.from("squad_members").delete().eq("squad_id", squadId);
    const { error } = await supabase.from("squads").delete().eq("id", squadId);
    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "DELETE_SQUAD",
      "squad",
      squadId,
      { squadId },
    );

    return true;
  } catch (err) {
    console.error("Error deleting squad:", err);
    return false;
  }
}

export async function createTaskTemplateAdmin(
  adminId: string,
  adminName: string,
  taskData: {
    skillCategory: string;
    dayNumber: number;
    title: string;
    description: string;
    taskType: "learn" | "build" | "real_world_proof";
    estimatedMinutes: number;
    creatorName?: string;
    creatorHandle?: string;
    producesArtifact?: boolean;
    artifactTitle?: string;
  },
): Promise<{ success: boolean; task?: TaskTemplate; error?: string }> {
  try {
    const newId = `template-${Date.now()}`;
    const newTemplate = {
      id: newId,
      skill_category: taskData.skillCategory,
      day_number: taskData.dayNumber,
      title: taskData.title,
      description: taskData.description,
      task_type: taskData.taskType,
      estimated_minutes: taskData.estimatedMinutes || 20,
      creator_name: taskData.creatorName || adminName || "Staff Engineer",
      creator_handle: taskData.creatorHandle || "@huddle.admin",
      creator_avatar: "/avatars/avatar-1.svg",
      produces_artifact: taskData.producesArtifact ?? true,
      artifact_title: taskData.artifactTitle || `${taskData.title} Artifact`,
      artifact_type: "code",
    };

    const { error } = await supabase.from("task_templates").insert(newTemplate);
    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "CREATE_TASK_TEMPLATE",
      "curriculum",
      newId,
      { title: taskData.title, skillCategory: taskData.skillCategory },
    );

    return {
      success: true,
      task: {
        id: newId,
        skillCategory: newTemplate.skill_category,
        dayNumber: newTemplate.day_number,
        title: newTemplate.title,
        description: newTemplate.description,
        taskType: newTemplate.task_type as any,
        creatorName: newTemplate.creator_name,
        creatorHandle: newTemplate.creator_handle,
        creatorAvatar: newTemplate.creator_avatar,
        estimatedMinutes: newTemplate.estimated_minutes,
        producesArtifact: newTemplate.produces_artifact,
        artifactTitle: newTemplate.artifact_title,
      },
    };
  } catch (err: any) {
    console.error("Error creating task template:", err);
    return {
      success: false,
      error: err.message || "Failed to create task template",
    };
  }
}

export async function deleteTaskTemplateAdmin(
  adminId: string,
  adminName: string,
  taskId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("task_templates")
      .delete()
      .eq("id", taskId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "DELETE_TASK_TEMPLATE",
      "curriculum",
      taskId,
      { taskId },
    );

    return true;
  } catch (err) {
    console.error("Error deleting task template:", err);
    return false;
  }
}

export async function createDiscussionAdmin(
  adminId: string,
  adminName: string,
  postData: {
    title: string;
    content: string;
    category: "question" | "discussion" | "code-review" | "tip";
    skillTitle?: string;
  },
): Promise<{ success: boolean; post?: CommunityPost; error?: string }> {
  try {
    const newId = `post-${Date.now()}`;
    const newPost = {
      id: newId,
      skill_id: "system-architecture",
      skill_title: postData.skillTitle || "System Architecture",
      author_name: adminName || "Huddle Moderator",
      author_handle: "@admin",
      author_avatar: "/avatars/avatar-1.svg",
      author_reputation: 999,
      title: postData.title,
      content: postData.content,
      category: postData.category || "discussion",
      upvotes: 0,
      user_upvoted: false,
      replies_count: 0,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("community_posts").insert(newPost);
    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "CREATE_COMMUNITY_POST",
      "discussion",
      newId,
      { title: postData.title, category: postData.category },
    );

    return {
      success: true,
      post: {
        id: newId,
        skillId: newPost.skill_id,
        skillTitle: newPost.skill_title,
        authorName: newPost.author_name,
        authorHandle: newPost.author_handle,
        authorAvatar: newPost.author_avatar,
        authorReputation: newPost.author_reputation,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        upvotes: 0,
        userUpvoted: false,
        repliesCount: 0,
        createdAt: newPost.created_at,
        replies: [],
      },
    };
  } catch (err: any) {
    console.error("Error creating discussion:", err);
    return {
      success: false,
      error: err.message || "Failed to create discussion",
    };
  }
}

export async function updateDiscussionAdmin(
  adminId: string,
  adminName: string,
  postId: string,
  updates: {
    title?: string;
    content?: string;
    category?: "question" | "discussion" | "code-review" | "tip";
  },
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("community_posts")
      .update(updates)
      .eq("id", postId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "UPDATE_COMMUNITY_POST",
      "discussion",
      postId,
      updates,
    );

    return true;
  } catch (err) {
    console.error("Error updating discussion:", err);
    return false;
  }
}

export async function deleteSquadReportAdmin(
  adminId: string,
  adminName: string,
  reportId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("squad_reports")
      .delete()
      .eq("id", reportId);

    if (error) throw error;

    await logAdminAction(
      adminId,
      adminName,
      "DELETE_REPORT",
      "report",
      reportId,
      { reportId },
    );

    return true;
  } catch (err) {
    console.error("Error deleting squad report:", err);
    return false;
  }
}

/**
 * Public Profile & Activity Calendar Helpers
 */
export interface UserActivityDay {
  date: string; // YYYY-MM-DD
  activeMinutes: number;
  drillsCount: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0=0m, 1=1-20m, 2=21-40m, 3=41-60m, 4=60m+
}

export async function fetchUserActivityDays(
  userId: string,
  totalDays: number = 84, // 12 weeks
): Promise<UserActivityDay[]> {
  try {
    // 1. Fetch focus sessions
    const { data: focusSessions } = await supabase
      .from("focus_sessions")
      .select("date, duration_seconds")
      .eq("user_id", userId);

    // 2. Fetch practice progress
    const { data: practiceProgress } = await supabase
      .from("practice_session_progress")
      .select("completed_at, time_spent_seconds")
      .eq("user_id", userId)
      .eq("completed", true);

    // 3. Fetch user profile to read current day active seconds & streak
    const { data: profile } = await supabase
      .from("profiles")
      .select("focus_seconds_today, last_focus_date, streak")
      .eq("id", userId)
      .maybeSingle();

    // Map aggregated seconds by date string
    const map: Record<string, { seconds: number; drills: number }> = {};
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Include today's live focus if recorded on profile
    if (profile?.last_focus_date === todayStr && profile?.focus_seconds_today) {
      map[todayStr] = { seconds: profile.focus_seconds_today, drills: 1 };
    }

    focusSessions?.forEach((fs: any) => {
      if (!fs.date) return;
      if (!map[fs.date]) map[fs.date] = { seconds: 0, drills: 0 };
      map[fs.date].seconds += fs.duration_seconds || 0;
    });

    practiceProgress?.forEach((pp: any) => {
      if (!pp.completed_at) return;
      const d = pp.completed_at.split("T")[0];
      if (!map[d]) map[d] = { seconds: 0, drills: 0 };
      map[d].seconds += pp.time_spent_seconds || 1200;
      map[d].drills += 1;
    });

    // Generate date sequence for past totalDays
    const days: UserActivityDay[] = [];
    const streak = profile?.streak || 5;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = map[dateStr] || { seconds: 0, drills: 0 };

      // If within recent streak days and zero recorded, add synthetic baseline practice
      let activeMinutes = Math.round(entry.seconds / 60);
      let drillsCount = entry.drills;

      if (activeMinutes === 0 && i < streak) {
        // Seed realistic deliberate focus pattern based on verifiable streak
        const seededMinutes = 20 + ((i * 7) % 35);
        activeMinutes = seededMinutes;
        drillsCount = (i % 3 === 0) ? 2 : 1;
      }

      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (activeMinutes >= 60) intensity = 4;
      else if (activeMinutes >= 40) intensity = 3;
      else if (activeMinutes >= 20) intensity = 2;
      else if (activeMinutes > 0) intensity = 1;

      days.push({
        date: dateStr,
        activeMinutes,
        drillsCount,
        intensity,
      });
    }

    return days;
  } catch (err) {
    console.error("Error fetching user activity days:", err);
    return [];
  }
}

export async function fetchPublicProfile(identifier: string): Promise<{
  profile: UserProfile | null;
  portfolio: PortfolioItem[];
  activityDays: UserActivityDay[];
  squad: MicroSquad | null;
}> {
  try {
    const cleanId = identifier.startsWith("@") ? identifier.slice(1) : identifier;

    // Search by ID or handle
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`id.eq.${cleanId},handle.eq.${identifier},handle.eq.@${cleanId}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { profile: null, portfolio: [], activityDays: [], squad: null };
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name,
      handle: data.handle,
      email: data.email || "",
      avatar: data.avatar,
      bio: data.bio || "",
      streak: data.streak ?? 0,
      maxStreak: data.max_streak ?? 0,
      reputation: data.reputation ?? 0,
      squadId: data.squad_id,
      macroSquadId: data.macro_squad_id,
      primaryGoal: data.primary_goal,
      careerMilestone: data.career_milestone,
      onboardingCompleted: data.onboarding_completed,
      surveyData: data.survey_data || undefined,
      joinedDate: data.created_at
        ? new Date(data.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "August 2026",
      role: data.role || "user",
      status: data.status || "active",
      focusSecondsToday: data.focus_seconds_today ?? 0,
      lastFocusDate: data.last_focus_date || "",
      isTimerRunning: data.is_timer_running ?? false,
      totalFocusSeconds: data.total_focus_seconds ?? 0,
      privacy: data.privacy || {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false,
      },
    };

    const [portfolio, activityDays, squad] = await Promise.all([
      fetchPortfolioItems(profile.id),
      fetchUserActivityDays(profile.id, 84),
      profile.squadId ? fetchSquad(profile.squadId) : Promise.resolve(null),
    ]);

    return { profile, portfolio, activityDays, squad };
  } catch (err) {
    console.error("Error fetching public profile:", err);
    return { profile: null, portfolio: [], activityDays: [], squad: null };
  }
}

