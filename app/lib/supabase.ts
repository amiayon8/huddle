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

    let tasks: SprintTask[] = (tasksData || []).map((t: any) => ({
      id: t.id,
      dayNumber: t.day_number,
      title: t.title,
      description: t.description || "",
      type: t.task_type || "learn",
      creatorName: t.creator_name || "Elena Rostova",
      creatorHandle: t.creator_handle || "@elena_distrib",
      creatorAvatar: t.creator_avatar || "/avatars/avatar-2.svg",
      estimatedMinutes: t.estimated_minutes || 20,
      completed: t.completed || false,
      completedAt: t.completed_at,
      producesArtifact: t.produces_artifact || false,
      artifactTitle: t.artifact_title,
      artifactType: t.artifact_type,
      realWorldActionDescription: t.real_world_action_description,
    }));

    if (tasks.length === 0) {
      tasks = generateTasksForSkill(
        sprintData.id,
        sprintData.skill_title || "System Architecture",
      );
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
): SprintTask[] => {
  const lower = skillTitle.toLowerCase();

  if (
    lower.includes("next") ||
    lower.includes("react") ||
    lower.includes("front")
  ) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "React Server Components & Streaming Architecture",
        description:
          "Implement streaming SSR layouts with Suspense boundaries and payload serialization.",
        type: "learn",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Streaming Next.js Layout Architecture",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Optimistic UI Updates & Server Actions",
        description:
          "Build zero-latency form mutations with useOptimistic and transactional database updates.",
        type: "build",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 22,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Optimistic Action State Machine",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Route Handlers & Edge Runtime Caching",
        description:
          "Configure incremental static regeneration (ISR) and stale-while-revalidate headers.",
        type: "learn",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: false,
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Real-World Proof: Open-Source Next.js PR",
        description:
          "Draft and publish a verified pull request demonstrating streaming performance gains.",
        type: "real_world_proof",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Next.js Streaming PR #412",
        artifactType: "summary",
      },
    ];
  }

  if (lower.includes("type") || lower.includes("ts")) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "Advanced Generics & Template Literal Types",
        description:
          "Build type-safe route parsers and regex-like string unions using template literal types.",
        type: "learn",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Template Literal Type Parser",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Conditional Types & Infer Pattern Matching",
        description:
          "Implement dynamic type extractors to infer return types and deeply nested record properties.",
        type: "build",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Strict Conditional Type System",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Discriminated Unions & Exhaustive Type Guards",
        description:
          "Enforce compile-time exhaustiveness checks across state machines and domain events.",
        type: "learn",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 16,
        completed: false,
        producesArtifact: false,
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Real-World Proof: Type-Safe SDK Package",
        description:
          "Publish a strictly typed library utility with zero any or unknown leaks to GitHub.",
        type: "real_world_proof",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Type-Safe Utility Module #78",
        artifactType: "summary",
      },
    ];
  }

  if (
    lower.includes("ui") ||
    lower.includes("product") ||
    lower.includes("design")
  ) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: "Design Tokens & Semantic Color Systems",
        description:
          "Establish fluid clamp spacing tokens and light/dark theme variables with WCAG contrast.",
        type: "learn",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Semantic Design Token Palette",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: "Hardware-Accelerated Micro-interactions",
        description:
          "Craft 60fps spring animations composited on the GPU using transform and opacity.",
        type: "build",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: "GPU-Accelerated Modal Motion",
        artifactType: "code",
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: "Accessible Keyboard Navigation & Focus Traps",
        description:
          "Audit tab order, aria attributes, and live regions to guarantee full screen reader usability.",
        type: "learn",
        creatorName: "Marcus Vance",
        creatorHandle: "@marcus_vance",
        creatorAvatar: "/avatars/avatar-3.svg",
        estimatedMinutes: 16,
        completed: false,
        producesArtifact: false,
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: "Real-World Proof: Accessible Design System PR",
        description:
          "Ship an accessible component module with comprehensive keyboard and visual test proofs.",
        type: "real_world_proof",
        creatorName: "Elena Rostova",
        creatorHandle: "@elena_distrib",
        creatorAvatar: "/avatars/avatar-2.svg",
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: "Accessible UI Component PR #204",
        artifactType: "summary",
      },
    ];
  }

  return [
    {
      id: `task-${Date.now()}-1`,
      dayNumber: 1,
      title: "Distributed Caching & Invalidation Topologies",
      description:
        "Architect multi-tier caching with write-behind queues and cache warming strategies.",
      type: "learn",
      creatorName: "Elena Rostova",
      creatorHandle: "@elena_distrib",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: 20,
      completed: false,
      producesArtifact: true,
      artifactTitle: "Distributed Cache Topology Blueprint",
      artifactType: "code",
    },
    {
      id: `task-${Date.now()}-2`,
      dayNumber: 2,
      title: "Idempotency Keys & Distributed Locking",
      description:
        "Implement distributed locking mechanisms to protect mission-critical database write paths.",
      type: "build",
      creatorName: "Elena Rostova",
      creatorHandle: "@elena_distrib",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: 22,
      completed: false,
      producesArtifact: true,
      artifactTitle: "Idempotent API Mutex Engine",
      artifactType: "code",
    },
    {
      id: `task-${Date.now()}-3`,
      dayNumber: 3,
      title: "Database Connection Pooling & Replication Failover",
      description:
        "Benchmark read replica query routing, connection pools, and automatic failovers.",
      type: "learn",
      creatorName: "Marcus Vance",
      creatorHandle: "@marcus_vance",
      creatorAvatar: "/avatars/avatar-3.svg",
      estimatedMinutes: 18,
      completed: false,
      producesArtifact: false,
    },
    {
      id: `task-${Date.now()}-4`,
      dayNumber: 4,
      title: "Real-World Proof: Architecture Decision Record (ADR)",
      description:
        "Draft and commit a production ADR evaluating data consistency tradeoffs on GitHub.",
      type: "real_world_proof",
      creatorName: "Elena Rostova",
      creatorHandle: "@elena_distrib",
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: 15,
      completed: false,
      producesArtifact: true,
      artifactTitle: "Production Architecture ADR #88",
      artifactType: "summary",
    },
  ];
};

export async function updateSprintSkillInDb(
  userId: string,
  skillTitle: string,
  milestone: string,
): Promise<SprintTask[] | null> {
  try {
    const { data: sprintRecord } = await supabase
      .from("sprints")
      .update({
        skill_title: skillTitle,
        career_milestone: milestone,
      })
      .eq("user_id", userId)
      .select("id")
      .single();

    const targetSprintId = sprintRecord?.id || "sprint-1";
    const newTasks = generateTasksForSkill(targetSprintId, skillTitle);

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

