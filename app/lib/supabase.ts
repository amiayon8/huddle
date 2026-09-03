import { createClient } from '@supabase/supabase-js';
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
  MascotMessage
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
      surveyData: data.survey_data || undefined,
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
    if (updates.surveyData !== undefined) dbUpdates.survey_data = updates.surveyData;
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

    let tasks: SprintTask[] = (tasksData || []).map((t: any) => ({
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

    if (tasks.length === 0) {
      tasks = generateTasksForSkill(sprintData.id, sprintData.skill_title || 'System Architecture');
    }

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
        title: `Team Blueprint: ${squadData.skill_focus || 'Core Architecture'}`,
        description: squadData.shared_goal || 'Collaborative team exercise: implement production-ready patterns and documentation.',
        deadline: 'Sunday, 11:59 PM',
        status: 'in_progress',
        submissionsCount: 2,
        totalMembers: membersData?.length || 4
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

/**
 * Fetch skills health from database
 */
export async function fetchSkillsHealth(userId: string = 'user-1'): Promise<SkillHealth[]> {
  try {
    const { data, error } = await supabase
      .from('skills_health')
      .select('*')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) return [];

    return data.map((s: any) => ({
      skillId: s.skill_id,
      skillTitle: s.skill_title,
      category: s.category || 'Engineering',
      healthPercent: s.health_percent ?? 100,
      decayRate: s.decay_rate || '-2% / week',
      lastPracticed: s.last_practiced || 'Today',
      status: s.status || 'optimal'
    }));
  } catch (err) {
    console.error('Error fetching skills health:', err);
    return [];
  }
}

/**
 * Fetch career timeline from database
 */
export async function fetchCareerTimeline(userId: string = 'user-1'): Promise<CareerTimelineEntry[]> {
  try {
    const { data, error } = await supabase
      .from('career_timeline')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((t: any) => ({
      id: t.id,
      date: t.date,
      type: t.entry_type || 'sprint_cleared',
      title: t.title,
      description: t.description || '',
      badge: t.badge
    }));
  } catch (err) {
    console.error('Error fetching career timeline:', err);
    return [];
  }
}

/**
 * Fetch skill roadmap from database
 */
export async function fetchSkillRoadmap(skillTitle: string = 'System Architecture'): Promise<SkillRoadmap | null> {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      skillId: data.skill_id,
      skillTitle: data.skill_title,
      skillIcon: data.skill_icon || '⚡',
      currentStepIndex: data.current_step_index || 1,
      totalSteps: data.total_steps || 2,
      milestones: data.milestones || [],
      steps: data.steps || []
    };
  } catch (err) {
    console.error('Error fetching roadmap:', err);
    return null;
  }
}

/**
 * Fetch macro squad from database
 */
export async function fetchMacroSquad(macroSquadId: string = 'macro-1'): Promise<MacroSquad | null> {
  try {
    const { data, error } = await supabase
      .from('macro_squad_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return {
      id: 'macro-1',
      name: 'Global Backend & Systems Circle',
      description: 'A global macro circle of 38 engineers mastering distributed backend systems.',
      trackCategory: 'System Architecture',
      membersCount: 38,
      members: [
        {
          id: 'm-1',
          name: 'Liam Ross',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
          title: 'Principal Engineer',
          skillsFocus: ['System Architecture', 'Kafka']
        }
      ],
      milestoneUpdates: data.map((u: any) => ({
        id: u.id,
        authorName: u.author_name,
        authorAvatar: u.author_avatar || '',
        milestoneTitle: u.milestone_title,
        skillTag: u.skill_tag,
        timestamp: u.timestamp || '2 hours ago',
        congratsCount: u.congrats_count || 0,
        userCongratulated: false
      }))
    };
  } catch (err) {
    console.error('Error fetching macro squad:', err);
    return null;
  }
}

/**
 * Fetch community posts from database
 */
export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

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
      createdAt: '3 hours ago',
      replies: p.replies || []
    }));
  } catch (err) {
    console.error('Error fetching community posts:', err);
    return [];
  }
}

/**
 * Fetch creators from database
 */
export async function fetchCreators(): Promise<CreatorProfile[]> {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('followers_count', { ascending: false });

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
      pinnedResources: c.pinned_resources || []
    }));
  } catch (err) {
    console.error('Error fetching creators:', err);
    return [];
  }
}

/**
 * Fetch notifications from database
 */
export async function fetchNotifications(userId: string = 'user-1'): Promise<NotificationItem[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((n: any) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      timestamp: n.timestamp,
      read: n.read || false
    }));
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return [];
  }
}

/**
 * Fetch mascot messages from database
 */
export async function fetchMascotMessages(userId: string = 'user-1'): Promise<MascotMessage[]> {
  try {
    const { data, error } = await supabase
      .from('mascot_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((m: any) => ({
      id: m.id,
      context: m.context,
      text: m.text,
      actionLabel: m.action_label,
      actionType: m.action_type
    }));
  } catch (err) {
    console.error('Error fetching mascot messages:', err);
    return [];
  }
}

/**
 * Fetch binge quiz from database
 */
export async function fetchBingeQuiz(): Promise<Record<string, {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}>> {
  try {
    const { data, error } = await supabase
      .from('binge_quizzes')
      .select('*');

    if (error || !data || data.length === 0) return {};

    const result: Record<string, any> = {};
    data.forEach((q: any) => {
      result[q.skill_id] = {
        question: q.question,
        options: Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : []),
        correctIndex: q.correct_index,
        explanation: q.explanation
      };
    });
    return result;
  } catch (err) {
    console.error('Error fetching binge quiz:', err);
    return {};
  }
}

/**
 * Update roadmap step completion in database
 */
export async function updateRoadmapStepCompletionInDb(roadmapId: string, stepId: string, completed: boolean) {
  try {
    const { data: roadmap } = await supabase.from('roadmaps').select('*').limit(1).single();
    if (!roadmap) return;

    const updatedSteps = (roadmap.steps || []).map((s: any) => 
      s.id === stepId 
        ? { ...s, status: completed ? 'completed' : 'current', completedAt: completed ? 'Just now' : null }
        : s
    );

    await supabase.from('roadmaps').update({ steps: updatedSteps }).eq('id', roadmap.id);
  } catch (err) {
    console.error('Error updating roadmap step in DB:', err);
  }
}

/**
 * Add community post to database
 */
export async function addCommunityPostToDb(post: CommunityPost) {
  try {
    await supabase.from('community_posts').insert({
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
      replies: post.replies || []
    });
  } catch (err) {
    console.error('Error inserting community post into DB:', err);
  }
}

/**
 * Toggle community post upvote in database
 */
export async function toggleCommunityPostUpvoteInDb(postId: string, userUpvoted: boolean) {
  try {
    const { data: post } = await supabase.from('community_posts').select('upvotes').eq('id', postId).single();
    if (!post) return;
    const nextUpvotes = userUpvoted ? (post.upvotes || 0) + 1 : Math.max(0, (post.upvotes || 1) - 1);
    await supabase.from('community_posts').update({ upvotes: nextUpvotes, user_upvoted: userUpvoted }).eq('id', postId);
  } catch (err) {
    console.error('Error toggling community post upvote:', err);
  }
}

/**
 * Add reply to community post in database
 */
export async function addReplyToCommunityPostInDb(postId: string, reply: any) {
  try {
    const { data: post } = await supabase.from('community_posts').select('replies, replies_count').eq('id', postId).single();
    if (!post) return;
    const currentReplies = Array.isArray(post.replies) ? post.replies : [];
    const updatedReplies = [...currentReplies, reply];
    await supabase.from('community_posts').update({
      replies: updatedReplies,
      replies_count: (post.replies_count || 0) + 1
    }).eq('id', postId);
  } catch (err) {
    console.error('Error adding reply to post in DB:', err);
  }
}

/**
 * Toggle follow status for a creator
 */
export async function toggleFollowCreatorInDb(creatorId: string, isFollowing: boolean) {
  try {
    const { data: creator } = await supabase.from('creators').select('followers_count').eq('id', creatorId).single();
    if (!creator) return;
    const nextFollowers = isFollowing ? (creator.followers_count || 0) + 1 : Math.max(0, (creator.followers_count || 1) - 1);
    await supabase.from('creators').update({ is_following: isFollowing, followers_count: nextFollowers }).eq('id', creatorId);
  } catch (err) {
    console.error('Error toggling follow creator:', err);
  }
}

/**
 * Toggle like for a creator post
 */
export async function toggleLikeCreatorPostInDb(postId: string, userLiked: boolean) {
  try {
    const { data: post } = await supabase.from('creator_posts').select('likes_count').eq('id', postId).single();
    if (!post) return;
    const nextLikes = userLiked ? (post.likes_count || 0) + 1 : Math.max(0, (post.likes_count || 1) - 1);
    await supabase.from('creator_posts').update({ likes_count: nextLikes }).eq('id', postId);
  } catch (err) {
    console.error('Error toggling like creator post:', err);
  }
}

/**
 * Congratulate macro squad milestone
 */
export async function toggleMacroMilestoneCongratsInDb(updateId: string, userCongratulated: boolean) {
  try {
    const { data: update } = await supabase.from('macro_squad_updates').select('congrats_count').eq('id', updateId).single();
    if (!update) return;
    const nextCount = userCongratulated ? (update.congrats_count || 0) + 1 : Math.max(0, (update.congrats_count || 1) - 1);
    await supabase.from('macro_squad_updates').update({ congrats_count: nextCount }).eq('id', updateId);
  } catch (err) {
    console.error('Error toggling milestone congrats:', err);
  }
}

/**
 * Mark notification as read in database
 */
export async function markNotificationReadInDb(notificationId: string) {
  try {
    await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  } catch (err) {
    console.error('Error marking notification read:', err);
  }
}

/**
 * Insert notification into database
 */
export async function addNotificationToDb(notification: NotificationItem, userId: string = 'user-1') {
  try {
    await supabase.from('notifications').insert({
      id: notification.id,
      user_id: userId,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      timestamp: notification.timestamp,
      read: notification.read || false
    });
  } catch (err) {
    console.error('Error adding notification to DB:', err);
  }
}

/**
 * Add career timeline entry into database
 */
export async function addCareerTimelineEntryToDb(entry: CareerTimelineEntry, userId: string = 'user-1') {
  try {
    await supabase.from('career_timeline').insert({
      id: entry.id,
      user_id: userId,
      date: entry.date,
      entry_type: entry.type,
      title: entry.title,
      description: entry.description,
      badge: entry.badge
    });
  } catch (err) {
    console.error('Error inserting career timeline entry:', err);
  }
}

/**
 * Update skill health in database
 */
export async function updateSkillHealthInDb(userId: string, skillTitle: string, healthPercent: number, status: string = 'optimal') {
  try {
    await supabase.from('skills_health').update({
      health_percent: healthPercent,
      last_practiced: 'Today',
      status: status
    }).eq('user_id', userId).ilike('skill_title', `%${skillTitle}%`);
  } catch (err) {
    console.error('Error updating skill health:', err);
  }
}

/**
 * Update squad member check in status
 */
export async function updateSquadMemberCheckInInDb(squadId: string, userId: string, encouragement?: string) {
  try {
    const updates: any = {
      checked_in_today: true,
      last_check_in: 'Today'
    };
    if (encouragement) updates.recent_encouragement = encouragement;
    await supabase.from('squad_members').update(updates).eq('squad_id', squadId).eq('id', userId);
  } catch (err) {
    console.error('Error updating squad member check-in:', err);
  }
}

/**
 * Update sprint skill focus in database
 */
export const generateTasksForSkill = (sprintId: string, skillTitle: string): SprintTask[] => {
  const lower = skillTitle.toLowerCase();

  if (lower.includes('next') || lower.includes('react') || lower.includes('front')) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: 'React Server Components & Streaming Architecture',
        description: 'Implement streaming SSR layouts with Suspense boundaries and payload serialization.',
        type: 'learn',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Streaming Next.js Layout Architecture',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: 'Optimistic UI Updates & Server Actions',
        description: 'Build zero-latency form mutations with useOptimistic and transactional database updates.',
        type: 'build',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 22,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Optimistic Action State Machine',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: 'Route Handlers & Edge Runtime Caching',
        description: 'Configure incremental static regeneration (ISR) and stale-while-revalidate headers.',
        type: 'learn',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: false
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: 'Real-World Proof: Open-Source Next.js PR',
        description: 'Draft and publish a verified pull request demonstrating streaming performance gains.',
        type: 'real_world_proof',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Next.js Streaming PR #412',
        artifactType: 'summary'
      }
    ];
  }

  if (lower.includes('type') || lower.includes('ts')) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: 'Advanced Generics & Template Literal Types',
        description: 'Build type-safe route parsers and regex-like string unions using template literal types.',
        type: 'learn',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Template Literal Type Parser',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: 'Conditional Types & Infer Pattern Matching',
        description: 'Implement dynamic type extractors to infer return types and deeply nested record properties.',
        type: 'build',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Strict Conditional Type System',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: 'Discriminated Unions & Exhaustive Type Guards',
        description: 'Enforce compile-time exhaustiveness checks across state machines and domain events.',
        type: 'learn',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 16,
        completed: false,
        producesArtifact: false
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: 'Real-World Proof: Type-Safe SDK Package',
        description: 'Publish a strictly typed library utility with zero any or unknown leaks to GitHub.',
        type: 'real_world_proof',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Type-Safe Utility Module #78',
        artifactType: 'summary'
      }
    ];
  }

  if (lower.includes('ui') || lower.includes('product') || lower.includes('design')) {
    return [
      {
        id: `task-${Date.now()}-1`,
        dayNumber: 1,
        title: 'Design Tokens & Semantic Color Systems',
        description: 'Establish fluid clamp spacing tokens and light/dark theme variables with WCAG contrast.',
        type: 'learn',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 18,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Semantic Design Token Palette',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-2`,
        dayNumber: 2,
        title: 'Hardware-Accelerated Micro-interactions',
        description: 'Craft 60fps spring animations composited on the GPU using transform and opacity.',
        type: 'build',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'GPU-Accelerated Modal Motion',
        artifactType: 'code'
      },
      {
        id: `task-${Date.now()}-3`,
        dayNumber: 3,
        title: 'Accessible Keyboard Navigation & Focus Traps',
        description: 'Audit tab order, aria attributes, and live regions to guarantee full screen reader usability.',
        type: 'learn',
        creatorName: 'Marcus Vance',
        creatorHandle: '@marcus_vance',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 16,
        completed: false,
        producesArtifact: false
      },
      {
        id: `task-${Date.now()}-4`,
        dayNumber: 4,
        title: 'Real-World Proof: Accessible Design System PR',
        description: 'Ship an accessible component module with comprehensive keyboard and visual test proofs.',
        type: 'real_world_proof',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        estimatedMinutes: 15,
        completed: false,
        producesArtifact: true,
        artifactTitle: 'Accessible UI Component PR #204',
        artifactType: 'summary'
      }
    ];
  }

  return [
    {
      id: `task-${Date.now()}-1`,
      dayNumber: 1,
      title: 'Distributed Caching & Invalidation Topologies',
      description: 'Architect multi-tier caching with write-behind queues and cache warming strategies.',
      type: 'learn',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elena_distrib',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      estimatedMinutes: 20,
      completed: false,
      producesArtifact: true,
      artifactTitle: 'Distributed Cache Topology Blueprint',
      artifactType: 'code'
    },
    {
      id: `task-${Date.now()}-2`,
      dayNumber: 2,
      title: 'Idempotency Keys & Distributed Locking',
      description: 'Implement distributed locking mechanisms to protect mission-critical database write paths.',
      type: 'build',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elena_distrib',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      estimatedMinutes: 22,
      completed: false,
      producesArtifact: true,
      artifactTitle: 'Idempotent API Mutex Engine',
      artifactType: 'code'
    },
    {
      id: `task-${Date.now()}-3`,
      dayNumber: 3,
      title: 'Database Connection Pooling & Replication Failover',
      description: 'Benchmark read replica query routing, connection pools, and automatic failovers.',
      type: 'learn',
      creatorName: 'Marcus Vance',
      creatorHandle: '@marcus_vance',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      estimatedMinutes: 18,
      completed: false,
      producesArtifact: false
    },
    {
      id: `task-${Date.now()}-4`,
      dayNumber: 4,
      title: 'Real-World Proof: Architecture Decision Record (ADR)',
      description: 'Draft and commit a production ADR evaluating data consistency tradeoffs on GitHub.',
      type: 'real_world_proof',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elena_distrib',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      estimatedMinutes: 15,
      completed: false,
      producesArtifact: true,
      artifactTitle: 'Production Architecture ADR #88',
      artifactType: 'summary'
    }
  ];
};

export async function updateSprintSkillInDb(userId: string, skillTitle: string, milestone: string): Promise<SprintTask[] | null> {
  try {
    const { data: sprintRecord } = await supabase
      .from('sprints')
      .update({
        skill_title: skillTitle,
        career_milestone: milestone
      })
      .eq('user_id', userId)
      .select('id')
      .single();

    const targetSprintId = sprintRecord?.id || 'sprint-1';
    const newTasks = generateTasksForSkill(targetSprintId, skillTitle);

    await supabase.from('sprint_tasks').delete().eq('sprint_id', targetSprintId);

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
      artifact_type: t.artifactType || null
    }));

    await supabase.from('sprint_tasks').insert(insertRows);
    return newTasks;
  } catch (err) {
    console.error('Error updating sprint skill in DB:', err);
    return null;
  }
}

/**
 * Send real password reset email via Supabase Auth
 */
export async function resetPasswordUser(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase password reset error:', err);
    return { success: false, error: err.message || 'Failed to send password reset email' };
  }
}

/**
 * Insert mascot chat message into database
 */
export async function addMascotMessageToDb(message: { id: string; context: string; text: string; actionLabel?: string; actionType?: string }, userId: string = 'user-1') {
  try {
    await supabase.from('mascot_messages').insert({
      id: message.id,
      user_id: userId,
      context: message.context,
      text: message.text,
      action_label: message.actionLabel || null,
      action_type: message.actionType || null
    });
  } catch (err) {
    console.error('Error inserting mascot message into DB:', err);
  }
}

/**
 * Full reset of the demo account (user-1) back to initial baseline
 */
export async function resetDemoAccountInDb(): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Reset user profile
    await supabase.from('profiles').update({
      name: 'Alex Chen',
      handle: '@alexchen.dev',
      email: 'alex@huddle.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Staff Software Engineer exploring distributed systems, caching hierarchies, and resilient microservices.',
      streak: 8,
      max_streak: 12,
      reputation: 240,
      squad_id: 'squad-1',
      macro_squad_id: 'macro-squad-1',
      primary_goal: 'Build resilient production software',
      career_milestone: 'Staff Backend & Distributed Systems Architect',
      onboarding_completed: false,
      survey_data: {
        subjects: ['Computer Science/ICT', 'Mathematics'],
        hobbies: ['Gaming', 'Reading'],
        age: '24',
        ageInput: '24',
        learningStage: 'Early Career / Rising Engineer',
        targetProfession: 'Staff Backend & Distributed Systems Architect',
        startingSkills: ['System Architecture & Scalability', 'Next.js App Router & Server Components'],
        completedAt: new Date().toISOString()
      },
      privacy: {
        showStreak: true,
        showSquad: true,
        showReputation: true,
        publicProfile: true,
        hideRawRoadmaps: false
      }
    }).eq('id', 'user-1');

    // 2. Reset sprint
    await supabase.from('sprints').update({
      skill_title: 'System Architecture',
      career_milestone: 'Staff Backend & Distributed Systems Architect',
      duration_days: 4,
      current_day: 1,
      reshuffle_count: 0,
      last_reshuffled_at: null,
      mascot_narration: 'Ready for today? Complete your deliberate practice task to keep your streak alive!'
    }).eq('user_id', 'user-1');

    // 3. Reset sprint tasks
    await supabase.from('sprint_tasks').update({
      completed: false,
      completed_at: null
    }).eq('sprint_id', 'sprint-1');

    // 4. Reset portfolio items - delete dynamically generated ones
    const { data: userPortItems } = await supabase
      .from('portfolio_items')
      .select('id')
      .eq('user_id', 'user-1');

    const toDeletePortIds = (userPortItems || [])
      .filter((item: any) => item.id !== 'port-1' && item.id !== 'port-2')
      .map((item: any) => item.id);

    if (toDeletePortIds.length > 0) {
      await supabase.from('portfolio_items').delete().in('id', toDeletePortIds);
    }

    // Ensure baseline portfolio items exist & are published
    await supabase.from('portfolio_items').upsert([
      {
        id: 'port-1',
        user_id: 'user-1',
        title: 'Probabilistic Cache Early Expiration Benchmark',
        category: 'System Architecture',
        date: 'Yesterday',
        description: 'Benchmark comparing vanilla TTL vs XFetch probabilistic early recomputation algorithm under 10k RPS load.',
        artifact_type: 'code',
        preview_snippet: 'function xfetch(key, ttl, beta = 1.0, delta = 50) {\n  const [val, deltaCalc, expiry] = redis.get(key);\n  if (!val || (Date.now() - (delta * beta * Math.log(Math.random()))) >= expiry) {\n    const freshVal = recomputeExpensiveValue();\n    redis.set(key, freshVal, ttl);\n    return freshVal;\n  }\n  return val;\n}',
        is_published: true,
        source_task_id: 'task-1',
        tags: ['caching', 'redis', 'high-throughput']
      },
      {
        id: 'port-2',
        user_id: 'user-1',
        title: 'Postgres Read-Replica Connection Pooler ADR',
        category: 'Database Engineering',
        date: 'Last week',
        description: 'Architecture Decision Record for pgBouncer transaction pooling in serverless edge environments.',
        artifact_type: 'summary',
        preview_snippet: 'Status: Accepted\nContext: Edge functions spawning 500+ ephemeral DB connections causing Postgres MAX_CONNECTIONS exhaustion.\nDecision: Deploy PgBouncer in transaction mode with max_client_conn=5000 and default_pool_size=40.',
        is_published: true,
        source_task_id: 'task-prev',
        tags: ['postgres', 'architecture', 'scalability']
      }
    ]);

    // 5. Reset real world proofs
    await supabase.from('real_world_proofs').update({ completed: true }).eq('id', 'proof-1');
    await supabase.from('real_world_proofs').update({ completed: true }).eq('id', 'proof-2');
    await supabase.from('real_world_proofs').update({ completed: false }).eq('id', 'proof-3');

    // 6. Reset squad progress & pings
    await supabase.from('squads').update({ current_progress: 7 }).eq('id', 'squad-1');
    await supabase.from('squad_activity_pings').delete().eq('squad_id', 'squad-1').neq('id', 'ping-1');

    return { success: true };
  } catch (err: any) {
    console.error('Error resetting demo account in DB:', err);
    return { success: false, error: err.message || 'Failed to reset demo account' };
  }
}
