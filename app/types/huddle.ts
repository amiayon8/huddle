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
  onboardingCompleted: boolean;
  joinedDate: string;
  privacy: {
    showStreak: boolean;
    showSquad: boolean;
    showReputation: boolean;
    publicProfile: boolean;
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

export interface MicroSquad {
  id: string;
  name: string;
  skillFocus: string;
  members: SquadMember[];
  sharedGoal: string;
  currentProgress: number;
  targetProgress: number;
  inviteCode: string;
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

export interface CreatorResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'checklist' | 'template';
  duration: string;
  url?: string;
  downloadsCount?: number;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  title: string;
  avatar: string;
  bio: string;
  followersCount: number;
  isFollowing: boolean;
  skillsTaught: string[];
  pinnedResources: CreatorResource[];
  playlists: { id: string; title: string; itemsCount: number }[];
}

export interface NotificationItem {
  id: string;
  type: 'squad_checkin' | 'creator_post' | 'next_step' | 'milestone' | 'weekly_recap';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface MascotMessage {
  id: string;
  context: 'dashboard' | 'journey' | 'squad' | 'milestone';
  text: string;
  suggestionText?: string;
  actionLabel?: string;
  actionType?: 'shorten_session' | 'rest_day' | 'squad_nudge' | 'view_step';
}

export type ActiveTab = 
  | 'dashboard'
  | 'journey'
  | 'squad'
  | 'community'
  | 'creators'
  | 'progress'
  | 'profile';
