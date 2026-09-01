import { createClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  SprintChecklist, 
  SprintTask, 
  PortfolioItem, 
  RealWorldProofItem, 
  CareerTimelineEntry, 
  MicroSquad, 
  MacroSquadUpdate, 
  CreatorPost, 
  SkillHealth 
} from '../types/huddle';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puusreiewwibbegrznli.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Authentication Helpers
 */
export async function signUpUser(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile in profiles table
      const newProfile: any = {
        id: data.user.id,
        name: fullName || 'New Engineer',
        handle: `@${(fullName || 'engineer').toLowerCase().replace(/\s+/g, '')}`,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Practicing deliberate software engineering craft.',
        streak: 1,
        max_streak: 1,
        reputation: 50,
        squad_id: 'squad-1',
        macro_squad_id: 'macro-squad-1',
        primary_goal: 'Master System Architecture',
        career_milestone: 'Staff Software Engineer',
        onboarding_completed: false,
        privacy: {
          showStreak: true,
          showSquad: true,
          showReputation: true,
          publicProfile: true,
          hideRawRoadmaps: false
        }
      };

      await supabase.from('profiles').insert(newProfile);

      // Create default sprint for new user
      await supabase.from('sprints').insert({
        id: `sprint-${Date.now()}`,
        user_id: data.user.id,
        skill_title: 'System Architecture',
        career_milestone: 'Staff Software Engineer',
        duration_days: 4,
        current_day: 1,
        mascot_narration: 'Welcome to Huddle! Your 4-day deliberate focus sprint is ready.',
        reshuffle_count: 0
      });
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    console.error('Supabase sign up error:', err);
    return { user: null, error: err.message || 'Sign up failed' };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (err: any) {
    console.error('Supabase sign in error:', err);
    return { user: null, error: err.message || 'Invalid credentials' };
  }
}

export async function signOutUser() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Supabase sign out error:', err);
  }
}

/**
 * Fetch the user profile from Supabase
 */
export async function fetchUserProfile(userId: string = 'user-1'): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      handle: data.handle,
      email: data.email || '',
      avatar: data.avatar,
      bio: data.bio || '',
      streak: data.streak ?? 0,
      maxStreak: data.max_streak ?? 0,
      reputation: data.reputation ?? 0,
      squadId: data.squad_id,
      macroSquadId: data.macro_squad_id,
      primaryGoal: data.primary_goal,
      careerMilestone: data.career_milestone,
      onboardingCompleted: data.onboarding_completed,
      joinedDate: 'August 2026',
      privacy: data.privacy || {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false
      }
    };
  } catch (err) {
    console.error('Error fetching profile from Supabase:', err);
    return null;
  }
}

/**
 * Update user profile in Supabase
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  try {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.reputation !== undefined) dbUpdates.reputation = updates.reputation;
    if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
    if (updates.primaryGoal !== undefined) dbUpdates.primary_goal = updates.primaryGoal;
    if (updates.careerMilestone !== undefined) dbUpdates.career_milestone = updates.careerMilestone;
    if (updates.privacy !== undefined) dbUpdates.privacy = updates.privacy;

    await supabase.from('profiles').update(dbUpdates).eq('id', userId);
  } catch (err) {
    console.error('Error updating profile:', err);
  }
}

/**
 * Fetch current sprint and tasks
 */
export async function fetchCurrentSprint(userId: string = 'user-1'): Promise<SprintChecklist | null> {
  try {
    const { data: sprintData, error: sprintErr } = await supabase
      .from('sprints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sprintErr || !sprintData) return null;

    const { data: tasksData, error: tasksErr } = await supabase
      .from('sprint_tasks')
      .select('*')
      .eq('sprint_id', sprintData.id)
      .order('day_number', { ascending: true });

    const tasks: SprintTask[] = (tasksData || []).map((t: any) => ({
      id: t.id,
      dayNumber: t.day_number,
      title: t.title,
      description: t.description || '',
      type: t.task_type || 'learn',
      creatorName: t.creator_name || 'Elena Rostova',
      creatorHandle: t.creator_handle || '@elena_distrib',
      creatorAvatar: t.creator_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      estimatedMinutes: t.estimated_minutes || 20,
      completed: t.completed || false,
      completedAt: t.completed_at,
      producesArtifact: t.produces_artifact || false,
      artifactTitle: t.artifact_title,
      artifactType: t.artifact_type,
      realWorldActionDescription: t.real_world_action_description
    }));

    return {
      id: sprintData.id,
      skillTitle: sprintData.skill_title,
      careerMilestone: sprintData.career_milestone,
      durationDays: sprintData.duration_days,
      currentDay: sprintData.current_day,
      tasks: tasks,
      mascotNarration: sprintData.mascot_narration || '',
      reshuffleCount: sprintData.reshuffle_count || 0,
      lastReshuffledAt: sprintData.last_reshuffled_at
    };
  } catch (err) {
    console.error('Error fetching sprint:', err);
    return null;
  }
}

/**
 * Update sprint task completion
 */
export async function updateSprintTaskCompletion(taskId: string, completed: boolean, completedAt?: string) {
  try {
    await supabase
      .from('sprint_tasks')
      .update({
        completed: completed,
        completed_at: completedAt || (completed ? 'Just now' : null)
      })
      .eq('id', taskId);
  } catch (err) {
    console.error('Error updating sprint task:', err);
  }
}

/**
 * Reshuffle sprint in database
 */
export async function reshuffleSprintInDb(sprintId: string, currentDay: number = 1, reason?: string) {
  try {
    await supabase
      .from('sprints')
      .update({
        current_day: currentDay,
        last_reshuffled_at: new Date().toISOString(),
        mascot_narration: reason 
          ? `Sprint schedule reshuffled for you without penalty. Consistency beats intensity every time!`
          : `Schedule reshuffled smoothly! Ready to start fresh with Day 1.`
      })
      .eq('id', sprintId);

    // Reset task completed statuses
    await supabase
      .from('sprint_tasks')
      .update({ completed: false, completed_at: null })
      .eq('sprint_id', sprintId);
  } catch (err) {
    console.error('Error reshuffling sprint:', err);
  }
}

/**
 * Fetch portfolio items
 */
export async function fetchPortfolioItems(userId: string = 'user-1'): Promise<PortfolioItem[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      date: d.date,
      description: d.description,
      artifactType: d.artifact_type || 'code',
      previewSnippet: d.preview_snippet || '',
      isPublished: d.is_published || false,
      sourceTaskId: d.source_task_id,
      tags: d.tags || []
    }));
  } catch (err) {
    console.error('Error fetching portfolio items:', err);
    return [];
  }
}

/**
 * Add auto-assembled portfolio item
 */
export async function addPortfolioItemToDb(item: PortfolioItem, userId: string = 'user-1') {
  try {
    await supabase.from('portfolio_items').insert({
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
      tags: item.tags
    });
  } catch (err) {
    console.error('Error inserting portfolio item:', err);
  }
}

/**
 * Toggle publish on portfolio item
 */
export async function togglePublishPortfolioInDb(itemId: string, isPublished: boolean) {
  try {
    await supabase
      .from('portfolio_items')
      .update({ is_published: isPublished })
      .eq('id', itemId);
  } catch (err) {
    console.error('Error toggling portfolio item publish:', err);
  }
}

/**
 * Fetch real world proofs
 */
export async function fetchRealWorldProofs(userId: string = 'user-1'): Promise<RealWorldProofItem[]> {
  try {
    const { data, error } = await supabase
      .from('real_world_proofs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      date: d.date,
      completed: d.completed || false,
      externalLink: d.external_link,
      proofBadge: d.proof_badge
    }));
  } catch (err) {
    console.error('Error fetching real world proofs:', err);
    return [];
  }
}

/**
 * Complete real world proof in database
 */
export async function completeRealWorldProofInDb(proofId: string) {
  try {
    await supabase
      .from('real_world_proofs')
      .update({ completed: true })
      .eq('id', proofId);
  } catch (err) {
    console.error('Error completing proof:', err);
  }
}

/**
 * Fetch squad with members and activity pings
 */
export async function fetchSquad(squadId: string = 'squad-1'): Promise<MicroSquad | null> {
  try {
    const { data: squadData, error: squadErr } = await supabase
      .from('squads')
      .select('*')
      .eq('id', squadId)
      .single();

    if (squadErr || !squadData) return null;

    const { data: membersData } = await supabase
      .from('squad_members')
      .select('*')
      .eq('squad_id', squadId);

    const { data: pingsData } = await supabase
      .from('squad_activity_pings')
      .select('*')
      .eq('squad_id', squadId)
      .order('created_at', { ascending: false })
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
        role: m.role
      })),
      activityPings: (pingsData || []).map((p: any) => ({
        id: p.id,
        memberId: p.member_id,
        memberName: p.member_name,
        memberAvatar: p.member_avatar,
        actionText: p.action_text,
        timestamp: 'Just now',
        type: p.ping_type
      })),
      activeProject: {
        id: 'proj-1',
        title: 'Draft Cache Stampede Mitigation Blueprint',
        description: 'Collaborative team exercise: implement a Redis Lua locking script test suite.',
        deadline: 'Sunday, 11:59 PM',
        status: 'in_progress',
        submissionsCount: 2,
        totalMembers: 4
      }
    };
  } catch (err) {
    console.error('Error fetching squad:', err);
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
  pingType: string = 'task_completed'
) {
  try {
    await supabase.from('squad_activity_pings').insert({
      id: `ping-${Date.now()}`,
      squad_id: squadId,
      member_id: memberId,
      member_name: memberName,
      member_avatar: memberAvatar,
      action_text: actionText,
      ping_type: pingType
    });

    // Increment squad progress
    const { data: squad } = await supabase.from('squads').select('current_progress').eq('id', squadId).single();
    if (squad) {
      await supabase.from('squads').update({ current_progress: (squad.current_progress || 0) + 1 }).eq('id', squadId);
    }
  } catch (err) {
    console.error('Error adding squad ping:', err);
  }
}

/**
 * Fetch creator posts
 */
export async function fetchCreatorPosts(): Promise<CreatorPost[]> {
  try {
    const { data, error } = await supabase
      .from('creator_posts')
      .select('*')
      .order('created_at', { ascending: false });

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
      createdAt: 'Today'
    }));
  } catch (err) {
    console.error('Error fetching creator posts:', err);
    return [];
  }
}

/**
 * Publish creator post to Supabase
 */
export async function publishCreatorPostToDb(post: CreatorPost) {
  try {
    await supabase.from('creator_posts').insert({
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
      likes_count: post.likesCount
    });
  } catch (err) {
    console.error('Error publishing creator post:', err);
  }
}
