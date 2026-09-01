export type OnboardingStep = 
  | 'welcome' 
  | 'skills' 
  | 'experience' 
  | 'commitment' 
  | 'goal' 
  | 'pace' 
  | 'creators' 
  | 'squad' 
  | 'ready';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  streak: number;
  maxStreak: number;
  reputation: number;
  squadId: string | null;
  macroSquadId?: string | null;
  onboardingCompleted: boolean;
  joinedDate: string;
  primaryGoal: string;
  careerMilestone: string;
  privacy: {
    showStreak: boolean;
    showSquad: boolean;
    showReputation: boolean;
    publicProfile: boolean;
    hideRawRoadmaps: boolean;
  };
}

export interface SkillHealth {
  skillId: string;
  skillTitle: string;
  category: string;
  healthPercent: number;
  decayRate: string;
  lastPracticed: string;
  status: 'optimal' | 'maintaining' | 'decaying';
}

export interface JourneyStep {
  id: string;
  skillId: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  type: 'article' | 'tip' | 'video' | 'checklist' | 'resource';
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  contentMarkdown?: string;
  checklistItems?: { id: string; text: string; completed: boolean }[];
  resourceUrl?: string;
  status: 'completed' | 'current' | 'upcoming';
  completedAt?: string;
}

export interface SkillRoadmap {
  skillId: string;
  skillTitle: string;
  skillIcon: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: JourneyStep[];
  milestones: { id: string; title: string; stepNumber: number; reached: boolean }[];
}

export interface SprintTask {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  type: 'learn' | 'build' | 'real_world_proof';
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  producesArtifact?: boolean;
  artifactTitle?: string;
  artifactType?: 'code' | 'diagram' | 'summary' | 'live_demo';
  realWorldActionDescription?: string;
}

export interface SprintChecklist {
  id: string;
  skillTitle: string;
  careerMilestone: string;
  durationDays: number;
  currentDay: number;
  tasks: SprintTask[];
  mascotNarration: string;
  reshuffleCount: number;
  lastReshuffledAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  artifactType: 'code' | 'diagram' | 'summary' | 'live_demo';
  previewSnippet: string;
  isPublished: boolean;
  sourceTaskId: string;
  tags: string[];
}

export interface RealWorldProofItem {
  id: string;
  title: string;
  description: string;
  category: 'outreach' | 'open_source' | 'public_build' | 'peer_review';
  date: string;
  completed: boolean;
  externalLink?: string;
  proofBadge: string;
}

export interface CareerTimelineEntry {
  id: string;
  date: string;
  type: 'skill_unlocked' | 'portfolio_piece' | 'proof_action' | 'sprint_cleared';
  title: string;
  description: string;
  badge?: string;
}

export interface SquadMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  streak: number;
  checkedInToday: boolean;
  lastCheckIn?: string;
  recentEncouragement?: string;
  role: 'member' | 'lead';
}

export interface SquadActivityPing {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  actionText: string;
  timestamp: string;
  type: 'task_completed' | 'sprint_cleared' | 'nudge' | 'checkin';
}

export interface SquadProject {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'in_progress' | 'completed';
  submissionsCount: number;
  totalMembers: number;
}

export interface MicroSquad {
  id: string;
  name: string;
  skillFocus: string;
  members: SquadMember[];
  sharedGoal: string;
  currentProgress: number;
  targetProgress: number;
  inviteCode: string;
  activityPings: SquadActivityPing[];
  activeProject?: SquadProject;
}

export interface MacroSquadMember {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skillsFocus: string[];
}

export interface MacroSquadUpdate {
  id: string;
  authorName: string;
  authorAvatar: string;
  milestoneTitle: string;
  skillTag: string;
  timestamp: string;
  congratsCount: number;
  userCongratulated?: boolean;
}

export interface MacroSquad {
  id: string;
  name: string;
  description: string;
  trackCategory: string;
  membersCount: number;
  members: MacroSquadMember[];
  milestoneUpdates: MacroSquadUpdate[];
}

export interface CreatorResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'checklist' | 'template';
  duration: string;
  url?: string;
  downloadsCount?: number;
}

export interface CreatorPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorTitle: string;
  sponsorBadge?: string; // e.g. "Sponsored by Khan Academy / AWS"
  skillTag: string;
  title: string;
  description: string;
  contentSnippet: string;
  duration: string;
  videoUrl?: string;
  resourceLinks: { title: string; url: string }[];
  likesCount: number;
  userLiked?: boolean;
  bookmarked?: boolean;
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  title: string;
  avatar: string;
  bio: string;
  sponsorPartner?: string;
  followersCount: number;
  isFollowing: boolean;
  skillsTaught: string[];
  pinnedResources: CreatorResource[];
  playlists: { id: string; title: string; itemsCount: number }[];
}

export interface NotificationItem {
  id: string;
  type: 'squad_checkin' | 'creator_post' | 'next_step' | 'milestone' | 'weekly_recap' | 'timer_alert';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface MascotMessage {
  id: string;
  context: 'dashboard' | 'journey' | 'squad' | 'milestone' | 'timer' | 'reshuffle';
  text: string;
  suggestionText?: string;
  actionLabel?: string;
  actionType?: 'shorten_session' | 'rest_day' | 'squad_nudge' | 'view_step' | 'reshuffle_sprint';
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isHelpful: boolean;
}

export interface CommunityPost {
  id: string;
  skillId: string;
  skillTitle: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorReputation: number;
  title: string;
  content: string;
  category: 'question' | 'discussion' | 'code-review' | 'tip';
  upvotes: number;
  userUpvoted: boolean;
  repliesCount: number;
  isSolved?: boolean;
  createdAt: string;
  replies?: CommunityReply[];
}

export interface BingeQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'journey'
  | 'squad'
  | 'macro_squad'
  | 'explore'
  | 'community'
  | 'creators'
  | 'progress'
  | 'profile';
