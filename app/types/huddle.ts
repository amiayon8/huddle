export type OnboardingStep =
  | "welcome"
  | "skills"
  | "experience"
  | "commitment"
  | "goal"
  | "pace"
  | "creators"
  | "squad"
  | "ready";

export interface UserSurveyData {
  skill?: string;
  goal?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | string;
  dailyTime?: string;
  learningPreference?: string;
  // Legacy optional fields for backward compatibility
  subjects?: string[];
  subjectsOther?: string;
  hobbies?: string[];
  hobbiesOther?: string;
  age?: string;
  ageInput?: string;
  learningStage?: string;
  targetProfession?: string;
  professionOther?: string;
  startingSkills?: string[];
  skillsOther?: string;
  completedAt?: string;
}

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
  surveyData?: UserSurveyData;
  joinedDate: string;
  primaryGoal: string;
  careerMilestone: string;
  role?: "admin" | "user" | "moderator";
  status?: "active" | "suspended" | "flagged";
  focusSecondsToday?: number;
  lastFocusDate?: string;
  isTimerRunning?: boolean;
  totalFocusSeconds?: number;
  privacy: {
    showStreak: boolean;
    showSquad: boolean;
    showReputation: boolean;
    publicProfile: boolean;
    hideRawRoadmaps: boolean;
  };
}

export interface FocusSessionRecord {
  id: string;
  userId: string;
  durationSeconds: number;
  date: string;
  taskId?: string;
  completed: boolean;
  createdAt?: string;
}

export interface SkillHealth {
  skillId: string;
  skillTitle: string;
  category: string;
  healthPercent: number;
  decayRate: string;
  lastPracticed: string;
  status: "optimal" | "maintaining" | "decaying";
}

export interface JourneyStep {
  id: string;
  skillId: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  type: "article" | "tip" | "video" | "checklist" | "resource";
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  contentMarkdown?: string;
  checklistItems?: { id: string; text: string; completed: boolean }[];
  resourceUrl?: string;
  status: "completed" | "current" | "upcoming";
  completedAt?: string;
}

export interface SkillRoadmap {
  skillId: string;
  skillTitle: string;
  skillIcon: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: JourneyStep[];
  milestones: {
    id: string;
    title: string;
    stepNumber: number;
    reached: boolean;
  }[];
}

export interface TaskResource {
  id: string;
  type: "video" | "doc" | "tutorial" | "example" | "file";
  title: string;
  url?: string;
  durationOrReadTime?: string;
  description?: string;
}

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskSparkGuidance {
  overview: string;
  keySteps: string[];
  proTip: string;
}

export interface TaskEvidenceRequirement {
  type: "file" | "screenshot" | "link" | "work_summary";
  prompt: string;
  placeholder: string;
  verificationQuestion: string;
}

export interface SprintTask {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  type: "learn" | "build" | "real_world_proof";
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  producesArtifact?: boolean;
  artifactTitle?: string;
  artifactType?: "code" | "diagram" | "summary" | "live_demo";
  realWorldActionDescription?: string;
  sparkGuidance?: TaskSparkGuidance;
  resources?: TaskResource[];
  subtasks?: TaskSubtask[];
  evidenceRequirement?: TaskEvidenceRequirement;
  submittedEvidence?: string;
  evidenceVerified?: boolean;
}

export interface TaskTemplate {
  id: string;
  skillCategory: string;
  dayNumber: number;
  title: string;
  description: string;
  taskType: "learn" | "build" | "real_world_proof";
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  estimatedMinutes: number;
  producesArtifact?: boolean;
  artifactTitle?: string;
  artifactType?: string;
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
  artifactType: "code" | "diagram" | "summary" | "live_demo";
  previewSnippet: string;
  isPublished: boolean;
  sourceTaskId: string;
  tags: string[];
}

export interface RealWorldProofItem {
  id: string;
  title: string;
  description: string;
  category: "outreach" | "open_source" | "public_build" | "peer_review";
  date: string;
  completed: boolean;
  externalLink?: string;
  proofBadge: string;
}

export interface CareerTimelineEntry {
  id: string;
  date: string;
  type:
    | "skill_unlocked"
    | "portfolio_piece"
    | "proof_action"
    | "sprint_cleared";
  title: string;
  description: string;
  badge?: string;
}

export interface SquadProjectDeliverable {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  title: string;
  notes: string;
  link?: string;
  timestamp: string;
}

export interface SquadMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  streak: number;
  currentStreak?: number;
  checkedInToday: boolean;
  completedToday?: boolean;
  weeklyMilestonesCompleted?: number;
  lastCheckIn?: string;
  lastCheckInTime?: string;
  recentEncouragement?: string;
  role: "member" | "lead";
  cheerCount?: number;
  tasksCompleted?: number;
  submittedProject?: boolean;
}

export interface SquadActivityPing {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  actionText: string;
  timestamp: string;
  type:
    | "task_completed"
    | "sprint_cleared"
    | "nudge"
    | "checkin"
    | "cheer"
    | "project_submission";
}

export interface SquadProject {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "in_progress" | "completed";
  submissionsCount: number;
  totalMembers: number;
  deliverables?: SquadProjectDeliverable[];
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

export interface SquadCreatePayload {
  name: string;
  skillFocus: string;
  sharedGoal: string;
  targetProgress: number;
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
  type: "article" | "video" | "checklist" | "template";
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
  sponsorBadge?: string;
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
  type:
    | "squad_checkin"
    | "creator_post"
    | "next_step"
    | "milestone"
    | "weekly_recap"
    | "timer_alert";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface SparkChatMessage {
  id: string;
  sender: "spark" | "spark" | "user";
  text: string;
  mascotSvg?: string;
  timestamp: string;
}

export interface SparkChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: SparkChatMessage[];
  skillFocus?: string;
}


export interface SprinterFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  currentSkill: string;
  streak: number;
  dayNumber: number;
  totalDays: number;
  progressPercent: number;
  lastActive: string;
  statusText: string;
  cheeredToday?: boolean;
  nudgedToday?: boolean;
}

export type AdaptiveDifficulty = "gentle" | "balanced" | "accelerated";

export interface DailyNudgeSettings {
  enabled: boolean;
  timeOfDay: "morning" | "lunch" | "evening" | "night";
  vibe: "encouraging" | "witty" | "minimal";
  browserNotifications: boolean;
}

export interface DailyNudgeItem {
  id: string;
  text: string;
  timeText: string;
  category: "habit" | "streak_shield" | "friend_spark" | "quick_drill";
  read: boolean;
}

export interface ProjectMission {
  id: string;
  title: string;
  skillCategory: string;
  scenario: string;
  objective: string;
  deliverables: string[];
  rubric: string[];
  starterCode?: string;
  starterCodeLang?: string;
  estimatedHours: number;
  badge: string;
  completed: boolean;
  submittedAt?: string;
  submissionLink?: string;
  submissionNotes?: string;
}

export interface ProgressShareCardData {
  userName: string;
  userHandle: string;
  userAvatar: string;
  milestoneTitle: string;
  skillTitle: string;
  streak: number;
  healthPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
  proofBadge?: string;
  shareUrl: string;
}

export interface CelebrationData {
  type:
    | "task_completed"
    | "sprint_finished"
    | "mission_cleared"
    | "streak_milestone";
  title: string;
  subtitle: string;
  badgeName?: string;
  healthBoost?: number;
  actionText?: string;
}

export interface MascotMessage {
  id: string;
  context:
    | "dashboard"
    | "journey"
    | "squad"
    | "milestone"
    | "timer"
    | "reshuffle";
  text: string;
  suggestionText?: string;
  actionLabel?: string;
  actionType?:
    | "shorten_session"
    | "rest_day"
    | "squad_nudge"
    | "view_step"
    | "reshuffle_sprint";
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
  category: "question" | "discussion" | "code-review" | "tip";
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
  | "dashboard"
  | "sprint"
  | "overview"
  | "journey"
  | "squad"
  | "macro_squad"
  | "explore"
  | "growth_map"
  | "community"
  | "creators"
  | "progress"
  | "profile";

export interface PracticeVideoChapter {
  timeSeconds: number;
  title: string;
}

export interface PracticeVideoLesson {
  title: string;
  youtubeId?: string;
  videoUrl?: string;
  durationMinutes: number;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  chapters: PracticeVideoChapter[];
  keyTakeaways: string[];
}

export interface PracticeCourseSection {
  id: string;
  title: string;
  summary: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  diagramAscii?: string;
  callout?: {
    type: "note" | "warning" | "production_tip";
    title: string;
    text: string;
  };
}

export interface PracticeKnowledgeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeSessionProgress {
  id: string;
  userId: string;
  taskId: string;
  sprintId: string;
  completed: boolean;
  completedAt?: string;
  videoWatchedSeconds: number;
  videoCompleted: boolean;
  reflectionNotes: string;
  userCode?: string;
  quizAnswers?: Record<string, number>;
  quizScore?: number;
  timeSpentSeconds: number;
}

export type ReportReasonCategory =
  | "harassment"
  | "inappropriate_content"
  | "spam_or_promotion"
  | "inactivity_ghosting"
  | "other";

export interface AnonymousSquadReport {
  id?: string;
  squadId: string;
  reportedMemberId: string;
  reportedMemberName: string;
  reporterHash?: string;
  reasonCategory: ReportReasonCategory;
  details?: string;
  status?: "pending" | "reviewed" | "dismissed";
  createdAt?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSquads: number;
  totalSprints: number;
  totalReports: number;
  pendingReports: number;
  totalCurriculumTasks: number;
  totalDiscussions: number;
}
