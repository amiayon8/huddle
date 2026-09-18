"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  UserProfile,
  SkillHealth,
  SkillRoadmap,
  JourneyStep,
  MicroSquad,
  MacroSquad,
  CreatorProfile,
  CreatorPost,
  NotificationItem,
  MascotMessage,
  ActiveTab,
  SprintChecklist,
  SprintTask,
  PortfolioItem,
  RealWorldProofItem,
  CareerTimelineEntry,
  CommunityPost,
  UserSurveyData,
  SquadCreatePayload,
  SquadActivityPing,
  SquadMember,
  SquadProject,
  SquadProjectDeliverable,
  MacroSquadUpdate,
  PracticeSessionProgress,
  AnonymousSquadReport,
  ReportReasonCategory,
  SprinterFriend,
  AdaptiveDifficulty,
  DailyNudgeSettings,
  DailyNudgeItem,
  ProjectMission,
  ProgressShareCardData,
  CelebrationData,
  SparkChatMessage,
  SparkChatSession,
} from "../types/huddle";

import {
  supabase,
  signUpUser,
  signInUser,
  signOutUser,
  fetchUserProfile,
  updateUserProfile as updateProfileInDb,
  fetchCurrentSprint,
  updateSprintTaskCompletion,
  reshuffleSprintInDb,
  fetchPortfolioItems,
  addPortfolioItemToDb,
  togglePublishPortfolioInDb,
  fetchRealWorldProofs,
  completeRealWorldProofInDb,
  fetchSquad,
  addSquadActivityPingToDb,
  fetchAllPracticeSessionProgress,
  savePracticeSessionProgress,
  fetchCreatorPosts,
  publishCreatorPostToDb,
  fetchSkillsHealth,
  fetchCareerTimeline,
  fetchSkillRoadmap,
  fetchMacroSquad,
  fetchCommunityPosts,
  fetchCreators,
  fetchNotifications,
  fetchMascotMessages,
  updateRoadmapStepCompletionInDb,
  addCommunityPostToDb,
  toggleCommunityPostUpvoteInDb,
  addReplyToCommunityPostInDb,
  toggleFollowCreatorInDb,
  toggleLikeCreatorPostInDb,
  toggleMacroMilestoneCongratsInDb,
  markNotificationReadInDb,
  addNotificationToDb,
  addCareerTimelineEntryToDb,
  updateSkillHealthInDb,
  updateSquadMemberCheckInInDb,
  updateSprintSkillInDb,
  resetPasswordUser,
  resetDemoAccountInDb,
  generateTasksForSkill,
  removeSquadMemberInDb,
  updateSquadMemberRoleInDb,
  updateSquadSettingsInDb,
  submitSquadReportToDb,
  fetchAvailableSquads,
  saveFocusTimerToDb,
  logFocusSessionToDb,
  fetchPublicProfile,
} from "../lib/supabase";

interface HuddleContextType {
  user: UserProfile;
  skillsHealth: SkillHealth[];
  roadmap: SkillRoadmap;
  squad: MicroSquad;
  availableSquads: MicroSquad[];
  macroSquad: MacroSquad;
  posts: CommunityPost[];
  creators: CreatorProfile[];
  creatorPosts: CreatorPost[];
  notifications: NotificationItem[];
  mascotMessages: MascotMessage[];
  sprint: SprintChecklist;
  portfolioItems: PortfolioItem[];
  realWorldProofs: RealWorldProofItem[];
  careerTimeline: CareerTimelineEntry[];

  // Auth state & actions
  isAuthenticated: boolean;
  authLoading: boolean;
  isDemo: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
  resetDemoAccount: (
    shouldLogout?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;

  activeTab: ActiveTab;
  theme: "dark" | "light";

  // Focus Timer with Blur / Exit detection
  secondsFocusedToday: number;
  isTimerRunning: boolean;
  isAppFocused: boolean;
  showBingeQuizModal: boolean;

  // UI states
  sidebarOpen: boolean;
  searchOpen: boolean;
  settingsOpen: boolean;
  mascotOpen: boolean;
  authModalOpen: boolean;
  resetDemoModalOpen: boolean;
  authMode: "welcome" | "login" | "signup" | "forgot";
  onboardingActive: boolean;
  surveyPromptModalOpen: boolean;
  surveyActionAttempted: string | null;
  hasSkippedToPreview: boolean;
  selectedStepModal: JourneyStep | null;
  selectedCreatorModal: CreatorProfile | null;
  creatorUploadModalOpen: boolean;
  selectedPracticeTask: SprintTask | null;
  isPracticeSessionOpen: boolean;
  isPracticeReviewMode: boolean;

  // State setters
  setActiveTab: (tab: ActiveTab) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setResetDemoModalOpen: (open: boolean) => void;
  setMascotOpen: (open: boolean) => void;
  openAuthModal: (mode?: "welcome" | "login" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
  setOnboardingActive: (active: boolean) => void;
  setSurveyPromptModalOpen: (open: boolean) => void;
  setHasSkippedToPreview: (skipped: boolean) => void;
  ensureSurveyDone: (actionName?: string) => boolean;
  setSelectedStepModal: (step: JourneyStep | null) => void;
  setSelectedCreatorModal: (creator: CreatorProfile | null) => void;
  setCreatorUploadModalOpen: (open: boolean) => void;
  setShowBingeQuizModal: (show: boolean) => void;

  // Focus Timer actions
  toggleFocusTimer: () => void;
  resetFocusTimer: () => void;

  practiceProgressMap: Record<string, PracticeSessionProgress>;
  savePracticeNote: (taskId: string, notes: string) => void;
  savePracticeVideoWatched: (
    taskId: string,
    watchedSeconds: number,
    completed: boolean,
  ) => void;
  savePracticeCodeSolution: (taskId: string, code: string) => void;
  savePracticeQuizResult: (
    taskId: string,
    answers: Record<string, number>,
    score: number,
  ) => void;
  completeSprintTask: (
    taskId: string,
    customSnippet?: string,
    reflection?: string,
    evidence?: string,
  ) => void;
  toggleTaskSubtask: (taskId: string, subtaskId: string) => void;
  openPracticeSession: (task: SprintTask, reviewMode?: boolean) => void;
  closePracticeSession: () => void;
  completePracticeSession: (
    taskId: string,
    sessionSecondsElapsed: number,
    customArtifactSnippet?: string,
    reflectionNotes?: string,
    quizScore?: number,
    quizAnswers?: Record<string, number>,
    userCode?: string,
    videoCompleted?: boolean,
  ) => void;
  reshuffleSprint: (customPrompt?: string) => void;
  completeStep: (stepId: string) => void;
  checkInSquad: (encouragement?: string) => void;
  sendSquadNudge: (memberId: string) => void;
  sendSquadCheer: (memberId: string) => void;
  submitSquadProject: (title: string, notes: string, link?: string) => void;
  joinSquadByCode: (code: string) => boolean;
  createCustomSquad: (payload: SquadCreatePayload) => void;
  removeSquadMember: (memberId: string) => Promise<void>;
  updateSquadMemberRole: (
    memberId: string,
    newRole: "member" | "lead",
  ) => Promise<void>;
  updateSquadSettings: (updates: {
    name?: string;
    sharedGoal?: string;
    skillFocus?: string;
    targetProgress?: number;
  }) => Promise<void>;
  regenerateSquadInviteCode: () => Promise<string>;
  submitAnonymousSquadReport: (payload: {
    squadId: string;
    reportedMemberId: string;
    reportedMemberName: string;
    reasonCategory: ReportReasonCategory;
    details?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  shareProofToCommunity: (milestoneTitle: string, skillTag: string) => void;
  congratulateMacroMilestone: (updateId: string) => void;
  createCommunityPost: (
    title: string,
    content: string,
    skillId: string,
    category: CommunityPost["category"],
  ) => void;
  toggleUpvotePost: (postId: string) => void;
  addReplyToPost: (postId: string, content: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  toggleLikeCreatorPost: (postId: string) => void;
  toggleBookmarkCreatorPost: (postId: string) => void;
  publishCreatorPost: (
    title: string,
    description: string,
    skillTag: string,
    contentSnippet: string,
    resourceLink: string,
  ) => void;
  togglePublishPortfolio: (portfolioId: string) => void;
  completeRealWorldProof: (proofId: string) => void;
  markNotificationRead: (id: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  finishOnboarding: (
    selectedSkillTitles: string[],
    targetMilestone?: string,
    surveyPayload?: UserSurveyData,
  ) => void;

  // Public Profile Viewing
  viewingUserProfile: UserProfile | null;
  viewProfile: (identifierOrUser: string | UserProfile) => Promise<void>;
  viewMyProfile: () => void;

  // Feature 4: Daily Learning Nudge
  dailyNudgeSettings: DailyNudgeSettings;
  updateDailyNudgeSettings: (updates: Partial<DailyNudgeSettings>) => void;
  activeNudge: DailyNudgeItem | null;
  dismissActiveNudge: () => void;
  triggerInstantNudge: () => void;
  dailyNudgeModalOpen: boolean;
  setDailyNudgeModalOpen: (open: boolean) => void;

  // Feature 5: Sprinter Friend
  friends: SprinterFriend[];
  addFriend: (handleOrCode: string) => { success: boolean; message: string };
  cheerFriend: (friendId: string) => void;
  nudgeFriend: (friendId: string) => void;

  // Feature 7: Progress Bar of Health
  overallSkillHealth: {
    percent: number;
    status: "optimal" | "maintaining" | "decaying";
    daysUntilDecay: number;
    decayPreventionDays: number;
    activeSkillsCount: number;
  };
  boostSkillHealth: (amount: number) => void;

  // Feature 8: Progress Sharing
  shareCardData: ProgressShareCardData | null;
  shareModalOpen: boolean;
  openShareModal: (customData?: Partial<ProgressShareCardData>) => void;
  closeShareModal: () => void;

  // Feature 12: Project Missions
  projectMissions: ProjectMission[];
  selectedProjectMission: ProjectMission | null;
  projectMissionModalOpen: boolean;
  openProjectMission: (mission?: ProjectMission) => void;
  closeProjectMission: () => void;
  submitProjectMission: (
    missionId: string,
    link: string,
    notes: string,
  ) => void;

  // Feature 13: Adaptive Difficulty
  adaptiveDifficulty: AdaptiveDifficulty;
  setAdaptiveDifficulty: (mode: AdaptiveDifficulty) => void;

  // Feature 14: Celebration Moments
  celebrationData: CelebrationData | null;
  celebrationModalOpen: boolean;
  triggerCelebration: (data: CelebrationData) => void;
  closeCelebration: () => void;

  // Feature 1: Explore Feed into Sprinter
  addExploreItemToSprinter: (
    title: string,
    creatorName: string,
    durationMinutes: number,
  ) => void;
}

const HuddleContext = createContext<HuddleContextType | undefined>(undefined);

export const HuddleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile>({
    id: "user-1",
    name: "Alex Chen",
    handle: "@alexchen.dev",
    email: "hello@thenicedev.xyz",
    avatar: "/avatars/avatar-1.svg",
    bio: "Staff Software Engineer exploring distributed systems, caching hierarchies, and resilient microservices.",
    streak: 8,
    maxStreak: 12,
    reputation: 240,
    squadId: "squad-1",
    macroSquadId: "macro-squad-1",
    onboardingCompleted: true,
    joinedDate: "August 2026",
    primaryGoal: "Build resilient production software",
    careerMilestone: "Staff Backend & Distributed Systems Architect",
    role: "admin",
    status: "active",
    privacy: {
      showStreak: true,
      showSquad: true,
      showReputation: true,
      publicProfile: true,
      hideRawRoadmaps: false,
    },
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [skillsHealth, setSkillsHealth] = useState<SkillHealth[]>([]);
  const [roadmap, setRoadmap] = useState<SkillRoadmap>({
    skillId: "system-architecture",
    skillTitle: "System Architecture",
    skillIcon: "lightning",
    currentStepIndex: 1,
    totalSteps: 2,
    milestones: [],
    steps: [],
  });
  const [squad, setSquad] = useState<MicroSquad>({
    id: "squad-1",
    name: "Distributed Systems Core",
    skillFocus: "System Architecture",
    sharedGoal:
      "Complete 12 focused practice tasks together this week with zero leaderboard pressure",
    currentProgress: 8,
    targetProgress: 12,
    inviteCode: "HUDDLE-4X9B",
    members: [],
    activityPings: [],
  });
  const [availableSquads, setAvailableSquads] = useState<MicroSquad[]>([]);
  const [macroSquad, setMacroSquad] = useState<MacroSquad>({
    id: "macro-1",
    name: "Global Backend & Systems Circle",
    description:
      "A global macro circle of 38 engineers mastering distributed backend systems.",
    trackCategory: "System Architecture",
    membersCount: 38,
    members: [],
    milestoneUpdates: [],
  });
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [creatorPosts, setCreatorPosts] = useState<CreatorPost[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [mascotMessages, setMascotMessages] = useState<MascotMessage[]>([]);
  const [sprint, setSprint] = useState<SprintChecklist>({
    id: "sprint-1",
    skillTitle: "System Architecture",
    careerMilestone: "Staff Backend & Distributed Systems Architect",
    durationDays: 4,
    currentDay: 1,
    tasks: generateTasksForSkill("sprint-1", "System Architecture"),
    mascotNarration:
      "Ready for today? Complete your deliberate practice task to advance your progress!",
    reshuffleCount: 0,
  });
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [realWorldProofs, setRealWorldProofs] = useState<RealWorldProofItem[]>(
    [],
  );
  const [careerTimeline, setCareerTimeline] = useState<CareerTimelineEntry[]>(
    [],
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  // Focus Timer state (persisted to Supabase)
  const [secondsFocusedToday, setSecondsFocusedToday] = useState(1080);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isAppFocused, setIsAppFocused] = useState(true);
  const [showBingeQuizModal, setShowBingeQuizModal] = useState(false);

  // Synchronization refs for reliable background & visibility persistence
  const secondsFocusedRef = useRef(1080);
  const isTimerRunningRef = useRef(true);

  useEffect(() => {
    secondsFocusedRef.current = secondsFocusedToday;
  }, [secondsFocusedToday]);

  useEffect(() => {
    isTimerRunningRef.current = isTimerRunning;
  }, [isTimerRunning]);

  // UI modal toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mascotOpen, setMascotOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "welcome" | "login" | "signup" | "forgot"
  >("welcome");
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [surveyPromptModalOpen, setSurveyPromptModalOpen] = useState(false);
  const [surveyActionAttempted, setSurveyActionAttempted] = useState<
    string | null
  >(null);
  const [hasSkippedToPreview, setHasSkippedToPreview] = useState(false);
  const [selectedStepModal, setSelectedStepModal] =
    useState<JourneyStep | null>(null);
  const [selectedCreatorModal, setSelectedCreatorModal] =
    useState<CreatorProfile | null>(null);
  const [creatorUploadModalOpen, setCreatorUploadModalOpen] = useState(false);
  const [selectedPracticeTask, setSelectedPracticeTask] =
    useState<SprintTask | null>(null);
  const [isPracticeSessionOpen, setIsPracticeSessionOpen] = useState(false);
  const [isPracticeReviewMode, setIsPracticeReviewMode] = useState(false);
  const [practiceProgressMap, setPracticeProgressMap] = useState<
    Record<string, PracticeSessionProgress>
  >({});
  const [isDemoState, setIsDemoState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("huddle_is_demo") === "true";
    }
    return false;
  });
  const [resetDemoModalOpen, setResetDemoModalOpen] = useState(false);
  const [viewingUserProfile, setViewingUserProfile] =
    useState<UserProfile | null>(null);

  // Feature 4: Daily Learning Nudge State
  const [dailyNudgeSettings, setDailyNudgeSettings] =
    useState<DailyNudgeSettings>(() => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("huddle_nudge_settings");
          if (saved) return JSON.parse(saved);
        } catch (e) {}
      }
      return {
        enabled: true,
        timeOfDay: "morning",
        vibe: "encouraging",
        browserNotifications: false,
      };
    });

  const [activeNudge, setActiveNudge] = useState<DailyNudgeItem | null>({
    id: "nudge-init",
    text: "⚡ Spark: 15 minutes today keeps your 8-day streak intact and shields your 92% Skill Health Bar. Ready for today's caching drill?",
    timeText: "Scheduled for Today",
    category: "habit",
    read: false,
  });
  const [dailyNudgeModalOpen, setDailyNudgeModalOpen] = useState(false);

  // Feature 5: Sprinter Friends State
  const [friends, setFriends] = useState<SprinterFriend[]>([
    {
      id: "friend-1",
      name: "Liam Zhang",
      handle: "@liamz",
      avatar: "/avatars/avatar-2.svg",
      currentSkill: "Redis In-Memory Caching",
      streak: 7,
      dayNumber: 3,
      totalDays: 4,
      progressPercent: 75,
      lastActive: "12m ago",
      statusText: "Just cleared Day 3: Cache Stampede Mitigation",
      cheeredToday: false,
      nudgedToday: false,
    },
    {
      id: "friend-2",
      name: "Maya Patel",
      handle: "@mayap",
      avatar: "/avatars/avatar-3.svg",
      currentSkill: "Kafka Event Streaming",
      streak: 14,
      dayNumber: 4,
      totalDays: 4,
      progressPercent: 100,
      lastActive: "1h ago",
      statusText: "Submitted Capstone Project: Real-time Ledger",
      cheeredToday: true,
      nudgedToday: false,
    },
    {
      id: "friend-3",
      name: "Leo Tanaka",
      handle: "@leot",
      avatar: "/avatars/avatar-4.svg",
      currentSkill: "Kubernetes Operator Design",
      streak: 5,
      dayNumber: 2,
      totalDays: 4,
      progressPercent: 50,
      lastActive: "3h ago",
      statusText: "Writing custom controller reconciler loop",
      cheeredToday: false,
      nudgedToday: false,
    },
    {
      id: "friend-4",
      name: "Sofia Rodriguez",
      handle: "@sofiar",
      avatar: "/avatars/avatar-5.svg",
      currentSkill: "GraphQL Federation Architecture",
      streak: 9,
      dayNumber: 1,
      totalDays: 4,
      progressPercent: 25,
      lastActive: "5h ago",
      statusText: "Designing subgraphs with Apollo Router",
      cheeredToday: false,
      nudgedToday: false,
    },
  ]);

  // Feature 12: Project Missions State
  const [projectMissions, setProjectMissions] = useState<ProjectMission[]>([
    {
      id: "mission-1",
      title: "Production Caching Proxy with Multi-Tier Eviction",
      skillCategory: "System Architecture",
      scenario:
        "Your high-traffic platform experiences 80% database spikes during sudden flash sales. Build an intelligent dual-tier caching layer that eliminates cache stampede and provides sub-10ms reads.",
      objective:
        "Implement an asynchronous write-behind caching engine with LRU/LFU eviction, single-flight mutex deduplication, and fallback circuit-breaking.",
      deliverables: [
        "Single-flight cache query deduplicator logic",
        "Configurable multi-tier (in-memory L1 + Redis L2) storage adapter",
        "Load test benchmark script showing p99 latency under 15ms",
      ],
      rubric: [
        "Zero stampede duplicate queries under 500 concurrent requests",
        "Graceful degradation if Redis disconnects (L1 local fallback)",
        "Zero memory leaks on unbounded key growth",
      ],
      starterCode: `// Production Multi-Tier Cache Starter
export class MultiTierCacheProxy<T> {
  private l1Memory = new Map<string, { value: T; expiresAt: number }>();
  private inFlight = new Map<string, Promise<T>>();

  constructor(private l2Client: any, private defaultTtl = 60) {}

  async getOrCompute(key: string, computeFn: () => Promise<T>): Promise<T> {
    const cached = this.l1Memory.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key)!;
    }

    const promise = (async () => {
      try {
        const val = await computeFn();
        this.l1Memory.set(key, { value: val, expiresAt: Date.now() + 10000 });
        return val;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}`,
      starterCodeLang: "typescript",
      estimatedHours: 3,
      badge: "Master Systems Architect",
      completed: false,
    },
    {
      id: "mission-2",
      title: "Transactional Outbox Daemon for Microservices",
      skillCategory: "Backend Engineering",
      scenario:
        "Eliminate distributed two-phase commit overhead between PostgreSQL and message brokers without phantom writes or dual-write data loss.",
      objective:
        "Build an event publisher daemon using the Outbox pattern with transactional guarantees and idempotent consumer handlers.",
      deliverables: [
        "PostgreSQL outbox table migration DDL",
        "Background poller/relay loop with exponential backoff",
        "Idempotent consumer test suite with mock duplicates",
      ],
      rubric: [
        "Guaranteed at-least-once message delivery without database lock contention",
        "Poison-pill event isolation to dead letter queue",
      ],
      starterCodeLang: "sql",
      starterCode: `-- Transactional Outbox Pattern Schema
CREATE TABLE outbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type VARCHAR(64) NOT NULL,
  aggregate_id VARCHAR(64) NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ NULL
);`,
      estimatedHours: 4,
      badge: "Event-Driven Pioneer",
      completed: false,
    },
  ]);
  const [selectedProjectMission, setSelectedProjectMission] =
    useState<ProjectMission | null>(null);
  const [projectMissionModalOpen, setProjectMissionModalOpen] = useState(false);

  // Feature 13: Adaptive Difficulty State
  const [adaptiveDifficulty, setAdaptiveDifficulty] =
    useState<AdaptiveDifficulty>("balanced");

  // Feature 14: Celebration Moments State
  const [celebrationData, setCelebrationData] =
    useState<CelebrationData | null>(null);
  const [celebrationModalOpen, setCelebrationModalOpen] = useState(false);

  // Feature 8: Progress Sharing State
  const [shareCardData, setShareCardData] =
    useState<ProgressShareCardData | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Feature 7: Overall Skill Health boost accumulator
  const [healthBoostTotal, setHealthBoostTotal] = useState(0);

  const isDemo =
    isDemoState ||
    user.id === "user-1" ||
    user.email === "hello@thenicedev.xyz";

  const loadAllSupabaseData = async (activeUserId: string = "user-1") => {
    try {
      const [
        dbProfile,
        dbSprint,
        dbPortfolio,
        dbProofs,
        dbSquad,
        dbCreatorPosts,
        dbSkillsHealth,
        dbCareerTimeline,
        dbRoadmap,
        dbMacroSquad,
        dbCommunityPosts,
        dbCreators,
        dbNotifications,
        dbMascotMessages,
        dbPracticeProgress,
        dbAvailableSquads,
      ] = await Promise.all([
        fetchUserProfile(activeUserId),
        fetchCurrentSprint(activeUserId),
        fetchPortfolioItems(activeUserId),
        fetchRealWorldProofs(activeUserId),
        fetchSquad("squad-1"),
        fetchCreatorPosts(),
        fetchSkillsHealth(activeUserId),
        fetchCareerTimeline(activeUserId),
        fetchSkillRoadmap("System Architecture"),
        fetchMacroSquad("macro-1"),
        fetchCommunityPosts(),
        fetchCreators(),
        fetchNotifications(activeUserId),
        fetchMascotMessages(activeUserId),
        fetchAllPracticeSessionProgress(activeUserId),
        fetchAvailableSquads(),
      ]);

      if (dbProfile) {
        setUser(dbProfile);
        const today = new Date().toISOString().split("T")[0];
        if (dbProfile.lastFocusDate === today) {
          if (typeof dbProfile.focusSecondsToday === "number") {
            setSecondsFocusedToday(dbProfile.focusSecondsToday);
            secondsFocusedRef.current = dbProfile.focusSecondsToday;
          }
        } else if (
          dbProfile.lastFocusDate &&
          dbProfile.lastFocusDate !== today
        ) {
          // New day rollover: reset daily counter and persist
          setSecondsFocusedToday(0);
          secondsFocusedRef.current = 0;
          saveFocusTimerToDb(activeUserId, 0, dbProfile.isTimerRunning ?? true);
        } else if (typeof dbProfile.focusSecondsToday === "number") {
          setSecondsFocusedToday(dbProfile.focusSecondsToday);
          secondsFocusedRef.current = dbProfile.focusSecondsToday;
        }

        if (typeof dbProfile.isTimerRunning === "boolean") {
          setIsTimerRunning(dbProfile.isTimerRunning);
          isTimerRunningRef.current = dbProfile.isTimerRunning;
        }
      }
      if (dbSprint) setSprint(dbSprint);
      if (dbPortfolio) setPortfolioItems(dbPortfolio);
      if (dbProofs) setRealWorldProofs(dbProofs);
      if (dbSquad && dbSquad.members && dbSquad.members.length > 0)
        setSquad(dbSquad);
      if (dbAvailableSquads && dbAvailableSquads.length > 0)
        setAvailableSquads(dbAvailableSquads);
      if (dbCreatorPosts) setCreatorPosts(dbCreatorPosts);
      if (dbSkillsHealth && dbSkillsHealth.length > 0)
        setSkillsHealth(dbSkillsHealth);
      if (dbCareerTimeline && dbCareerTimeline.length > 0)
        setCareerTimeline(dbCareerTimeline);
      if (dbRoadmap) setRoadmap(dbRoadmap);
      if (
        dbMacroSquad &&
        dbMacroSquad.milestoneUpdates &&
        dbMacroSquad.milestoneUpdates.length > 0
      )
        setMacroSquad(dbMacroSquad);
      if (dbCommunityPosts && dbCommunityPosts.length > 0)
        setPosts(dbCommunityPosts);
      if (dbCreators && dbCreators.length > 0) setCreators(dbCreators);
      if (dbNotifications && dbNotifications.length > 0)
        setNotifications(dbNotifications);
      if (dbMascotMessages && dbMascotMessages.length > 0)
        setMascotMessages(dbMascotMessages);
      if (dbPracticeProgress && dbPracticeProgress.length > 0) {
        const progressMap: Record<string, PracticeSessionProgress> = {};
        dbPracticeProgress.forEach((item) => {
          progressMap[item.taskId] = item;
        });
        setPracticeProgressMap(progressMap);
      }
    } catch (err) {
      console.error("Error loading Supabase data:", err);
    }
  };

  // Load from Supabase on mount & subscribe to Realtime updates
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setIsDemoState(false);
          await loadAllSupabaseData(session.user.id);
        } else {
          const isDemoStored =
            typeof window !== "undefined" &&
            localStorage.getItem("huddle_is_demo") === "true";
          if (isDemoStored) {
            setIsAuthenticated(true);
            setIsDemoState(true);
            setAuthModalOpen(false);
            await loadAllSupabaseData("user-1");
          } else {
            setIsAuthenticated(false);
            setIsDemoState(false);
            await loadAllSupabaseData("user-1");
          }
        }
      } catch (err) {
        console.error("Supabase initial data fetch error:", err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    loadSupabaseData();

    // 1. Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            const userSprint = await fetchCurrentSprint(session.user.id);
            if (userSprint) setSprint(userSprint);
            const userPort = await fetchPortfolioItems(session.user.id);
            if (userPort) setPortfolioItems(userPort);
            const userProofs = await fetchRealWorldProofs(session.user.id);
            if (userProofs) setRealWorldProofs(userProofs);
          }
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
        }
      },
    );

    // 2. Realtime subscription for squad activity pings
    const squadChannel = supabase
      .channel("realtime:squad_activity_pings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "squad_activity_pings" },
        (payload) => {
          const newPing = payload.new as any;
          setSquad((prev) => {
            if (prev.activityPings.some((p) => p.id === newPing.id))
              return prev;
            return {
              ...prev,
              currentProgress: Math.min(
                prev.targetProgress,
                prev.currentProgress + 1,
              ),
              activityPings: [
                {
                  id: newPing.id,
                  memberId: newPing.member_id,
                  memberName: newPing.member_name,
                  memberAvatar: newPing.member_avatar,
                  actionText: newPing.action_text,
                  timestamp: "Just now",
                  type: newPing.ping_type,
                },
                ...prev.activityPings,
              ],
            };
          });
        },
      )
      .subscribe();

    // 3. Realtime subscription for creator posts
    const creatorChannel = supabase
      .channel("realtime:creator_posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "creator_posts" },
        (payload) => {
          const newPost = payload.new as any;
          setCreatorPosts((prev) => {
            if (prev.some((p) => p.id === newPost.id)) return prev;
            return [
              {
                id: newPost.id,
                creatorId: newPost.creator_id,
                creatorName: newPost.creator_name,
                creatorHandle: newPost.creator_handle,
                creatorAvatar: newPost.creator_avatar,
                creatorTitle: newPost.creator_title,
                sponsorBadge: newPost.sponsor_badge,
                skillTag: newPost.skill_tag,
                title: newPost.title,
                description: newPost.description,
                contentSnippet: newPost.content_snippet,
                duration: newPost.duration,
                videoUrl: newPost.video_url,
                resourceLinks: newPost.resource_links || [],
                likesCount: newPost.likes_count || 0,
                createdAt: "Just now",
              },
              ...prev,
            ];
          });
        },
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(squadChannel);
      supabase.removeChannel(creatorChannel);
    };
  }, []);

  // Theme synchronization and persistence
  useEffect(() => {
    const storedTheme =
      typeof window !== "undefined"
        ? (localStorage.getItem("huddle_theme") as "dark" | "light" | null)
        : null;
    if (storedTheme && (storedTheme === "dark" || storedTheme === "light")) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    try {
      localStorage.setItem("huddle_theme", theme);
    } catch (e) {}
  }, [theme]);

  // Window Focus / Blur, Visibility, and BeforeUnload listeners for reliable DB persistence
  useEffect(() => {
    const handleFocus = () => setIsAppFocused(true);
    const handleBlur = () => {
      setIsAppFocused(false);
      const activeUid = user?.id || "user-1";
      saveFocusTimerToDb(
        activeUid,
        secondsFocusedRef.current,
        isTimerRunningRef.current,
      );
    };
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsAppFocused(isVisible);
      if (!isVisible) {
        const activeUid = user?.id || "user-1";
        saveFocusTimerToDb(
          activeUid,
          secondsFocusedRef.current,
          isTimerRunningRef.current,
        );
      }
    };
    const handleBeforeUnload = () => {
      const activeUid = user?.id || "user-1";
      saveFocusTimerToDb(
        activeUid,
        secondsFocusedRef.current,
        isTimerRunningRef.current,
      );
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id]);

  // Focus Timer interval (ticks 1s in memory, auto-persists to Supabase every 10s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let autoSyncInterval: NodeJS.Timeout | null = null;

    if (isTimerRunning && isAppFocused) {
      interval = setInterval(() => {
        setSecondsFocusedToday((prev) => {
          const next = prev + 1;
          secondsFocusedRef.current = next;
          return next;
        });
      }, 1000);

      // Auto-persist to Supabase every 10 seconds while timer is active
      autoSyncInterval = setInterval(() => {
        const activeUid = user?.id || "user-1";
        saveFocusTimerToDb(activeUid, secondsFocusedRef.current, true);
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (autoSyncInterval) clearInterval(autoSyncInterval);
    };
  }, [isTimerRunning, isAppFocused, user?.id]);

  // Auth Methods
  const login = async (email: string, password: string) => {
    const { user: authUser, error } = await signInUser(email, password);
    if (error) return { success: false, error };
    if (authUser) {
      setIsDemoState(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("huddle_is_demo");
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      const profile = await fetchUserProfile(authUser.id);
      if (profile) {
        setUser(profile);
        const today = new Date().toISOString().split("T")[0];
        if (
          profile.lastFocusDate === today &&
          typeof profile.focusSecondsToday === "number"
        ) {
          setSecondsFocusedToday(profile.focusSecondsToday);
          secondsFocusedRef.current = profile.focusSecondsToday;
        } else {
          setSecondsFocusedToday(0);
          secondsFocusedRef.current = 0;
          saveFocusTimerToDb(authUser.id, 0, profile.isTimerRunning ?? true);
        }
        if (typeof profile.isTimerRunning === "boolean") {
          setIsTimerRunning(profile.isTimerRunning);
          isTimerRunningRef.current = profile.isTimerRunning;
        }
      }
      return { success: true };
    }
    return { success: false, error: "User not found" };
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { user: authUser, error } = await signUpUser(
      email,
      password,
      fullName,
    );
    if (error) return { success: false, error };
    if (authUser) {
      setIsDemoState(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("huddle_is_demo");
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      const profile = await fetchUserProfile(authUser.id);
      if (profile) setUser(profile);
      return { success: true };
    }
    return { success: false, error: "Sign up failed" };
  };

  const logout = async () => {
    setIsDemoState(false);
    setAuthModalOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("huddle_is_demo");
      sessionStorage.removeItem("redirected_from_auth");
    }
    await signOutUser();
    setIsAuthenticated(false);
    setActiveTab("dashboard");
  };

  const loginDemo = async () => {
    setIsAuthenticated(true);
    setIsDemoState(true);
    setAuthModalOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("huddle_is_demo", "true");
    }
    await loadAllSupabaseData("user-1");
  };

  const resetDemoAccount = async (
    shouldLogout: boolean = false,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthModalOpen(false);
      const res = await resetDemoAccountInDb();
      if (!res.success) {
        return res;
      }

      if (shouldLogout) {
        await logout();
        return { success: true };
      }

      setSecondsFocusedToday(1080);
      setIsTimerRunning(true);
      setOnboardingActive(false);
      setActiveTab("dashboard");

      if (typeof window !== "undefined") {
        localStorage.removeItem("huddle_spark_dismissed");
        localStorage.removeItem("huddle_spark_dismissed");
        window.dispatchEvent(new Event("huddle_spark_visibility_change"));
        window.dispatchEvent(new Event("huddle_spark_visibility_change"));
      }

      await loadAllSupabaseData("user-1");

      return { success: true };
    } catch (err: any) {
      console.error("Error in resetDemoAccount:", err);
      return {
        success: false,
        error: err.message || "Failed to reset demo account",
      };
    }
  };

  const toggleFocusTimer = () => {
    setIsTimerRunning((prev) => {
      const next = !prev;
      isTimerRunningRef.current = next;
      const activeUid = user?.id || "user-1";
      saveFocusTimerToDb(activeUid, secondsFocusedRef.current, next);
      return next;
    });
  };

  const resetFocusTimer = () => {
    setSecondsFocusedToday(0);
    secondsFocusedRef.current = 0;
    const activeUid = user?.id || "user-1";
    saveFocusTimerToDb(activeUid, 0, isTimerRunningRef.current);
  };

  const setTheme = (newTheme: "dark" | "light") => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const openAuthModal = (
    mode: "welcome" | "login" | "signup" | "forgot" = "welcome",
  ) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const ensureSurveyDone = (actionName?: string): boolean => {
    if (!user.onboardingCompleted) {
      setSurveyActionAttempted(actionName || "perform this action");
      setSurveyPromptModalOpen(true);
      return false;
    }
    return true;
  };

  const openPracticeSession = (
    task: SprintTask,
    reviewMode: boolean = false,
  ) => {
    setSelectedPracticeTask(task);
    setIsPracticeReviewMode(reviewMode);
    setIsPracticeSessionOpen(true);
  };

  const closePracticeSession = () => {
    setIsPracticeSessionOpen(false);
    setSelectedPracticeTask(null);
    setIsPracticeReviewMode(false);
  };

  const savePracticeNote = (taskId: string, notes: string) => {
    const existing = practiceProgressMap[taskId] || {
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: false,
      videoWatchedSeconds: 0,
      videoCompleted: false,
      userCode: "",
      reflectionNotes: "",
      quizAnswers: {},
      quizScore: 0,
      timeSpentSeconds: 0,
    };
    const updated: PracticeSessionProgress = {
      ...existing,
      reflectionNotes: notes,
    };
    setPracticeProgressMap((prev) => ({ ...prev, [taskId]: updated }));
    savePracticeSessionProgress(updated);
  };

  const savePracticeVideoWatched = (
    taskId: string,
    watchedSeconds: number,
    completed: boolean,
  ) => {
    const existing = practiceProgressMap[taskId] || {
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: false,
      videoWatchedSeconds: 0,
      videoCompleted: false,
      userCode: "",
      reflectionNotes: "",
      quizAnswers: {},
      quizScore: 0,
      timeSpentSeconds: 0,
    };
    const updated: PracticeSessionProgress = {
      ...existing,
      videoWatchedSeconds: Math.max(
        existing.videoWatchedSeconds,
        watchedSeconds,
      ),
      videoCompleted: completed || existing.videoCompleted,
    };
    setPracticeProgressMap((prev) => ({ ...prev, [taskId]: updated }));
    savePracticeSessionProgress(updated);
  };

  const savePracticeCodeSolution = (taskId: string, code: string) => {
    const existing = practiceProgressMap[taskId] || {
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: false,
      videoWatchedSeconds: 0,
      videoCompleted: false,
      userCode: "",
      reflectionNotes: "",
      quizAnswers: {},
      quizScore: 0,
      timeSpentSeconds: 0,
    };
    const updated: PracticeSessionProgress = {
      ...existing,
      userCode: code,
    };
    setPracticeProgressMap((prev) => ({ ...prev, [taskId]: updated }));
    savePracticeSessionProgress(updated);
  };

  const savePracticeQuizResult = (
    taskId: string,
    answers: Record<string, number>,
    score: number,
  ) => {
    const existing = practiceProgressMap[taskId] || {
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: false,
      videoWatchedSeconds: 0,
      videoCompleted: false,
      userCode: "",
      reflectionNotes: "",
      quizAnswers: {},
      quizScore: 0,
      timeSpentSeconds: 0,
    };
    const updated: PracticeSessionProgress = {
      ...existing,
      quizAnswers: answers,
      quizScore: score,
    };
    setPracticeProgressMap((prev) => ({ ...prev, [taskId]: updated }));
    savePracticeSessionProgress(updated);
  };

  const completePracticeSession = (
    taskId: string,
    sessionSecondsElapsed: number,
    customArtifactSnippet?: string,
    reflectionNotes?: string,
    quizScore?: number,
    quizAnswers?: Record<string, number>,
    userCode?: string,
    videoCompleted?: boolean,
  ) => {
    if (sessionSecondsElapsed > 0) {
      setSecondsFocusedToday((prev) => {
        const next = prev + sessionSecondsElapsed;
        secondsFocusedRef.current = next;
        const activeUid = user?.id || "user-1";
        saveFocusTimerToDb(activeUid, next, isTimerRunningRef.current);
        return next;
      });
      logFocusSessionToDb(user?.id || "user-1", sessionSecondsElapsed, taskId);
    }
    const existing = practiceProgressMap[taskId] || {
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: true,
      completedAt: new Date().toISOString(),
      videoWatchedSeconds: 0,
      videoCompleted: false,
      userCode: "",
      reflectionNotes: "",
      quizAnswers: {},
      quizScore: 0,
      timeSpentSeconds: 0,
    };
    const updated: PracticeSessionProgress = {
      ...existing,
      userId: user.id,
      taskId,
      sprintId: sprint.id,
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpentSeconds:
        (existing.timeSpentSeconds || 0) + sessionSecondsElapsed,
      reflectionNotes:
        reflectionNotes !== undefined
          ? reflectionNotes
          : existing.reflectionNotes,
      quizScore: quizScore !== undefined ? quizScore : existing.quizScore,
      quizAnswers:
        quizAnswers !== undefined ? quizAnswers : existing.quizAnswers,
      userCode: userCode !== undefined ? userCode : existing.userCode,
      videoCompleted:
        videoCompleted !== undefined ? videoCompleted : existing.videoCompleted,
    };
    setPracticeProgressMap((prev) => ({ ...prev, [taskId]: updated }));
    savePracticeSessionProgress(updated);
    completeSprintTask(taskId, customArtifactSnippet, reflectionNotes);
    setIsPracticeSessionOpen(false);
    setSelectedPracticeTask(null);
    setIsPracticeReviewMode(false);
  };

  const completeSprintTask = (
    taskId: string,
    customSnippet?: string,
    reflection?: string,
    evidence?: string,
  ) => {
    if (!ensureSurveyDone("complete sprint tasks")) return;
    const targetTask = sprint.tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const nextCompleted = evidence ? true : !targetTask.completed;

    setSprint((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? "Just now" : undefined,
              submittedEvidence: evidence || t.submittedEvidence,
              evidenceVerified: nextCompleted ? true : false,
            }
          : t,
      ),
    }));

    updateSprintTaskCompletion(
      taskId,
      nextCompleted,
      nextCompleted ? "Just now" : undefined,
    );

    if (nextCompleted) {
      if (targetTask.producesArtifact && targetTask.artifactTitle) {
        const newPortfolioItem: PortfolioItem = {
          id: `port-${Date.now()}`,
          title: targetTask.artifactTitle,
          category: sprint.skillTitle,
          date: "Just now",
          description: reflection
            ? `Verified deliberate practice artifact. Reflection: ${reflection}`
            : `Auto-assembled artifact produced from sprint task: "${targetTask.title}".`,
          artifactType: targetTask.artifactType || "code",
          previewSnippet:
            customSnippet ||
            `export const artifact = {\n  title: "${targetTask.artifactTitle}",\n  verified: true,\n  creator: "${targetTask.creatorName}"\n};`,
          isPublished: false,
          sourceTaskId: targetTask.id,
          tags: [sprint.skillTitle, "Auto-assembled", "Verified Practice"],
        };

        setPortfolioItems((prev) => [newPortfolioItem, ...prev]);
        addPortfolioItemToDb(newPortfolioItem, user.id);

        const newTimelineEntry: CareerTimelineEntry = {
          id: `tl-${Date.now()}`,
          date: "Today",
          type: "portfolio_piece",
          title: `Artifact Produced: ${targetTask.artifactTitle}`,
          description: `Generated from sprint task with ${targetTask.creatorName}. Added to private portfolio.`,
          badge: "Portfolio Ready",
        };
        setCareerTimeline((prev) => [newTimelineEntry, ...prev]);
        addCareerTimelineEntryToDb(newTimelineEntry, user.id);
      }

      const newSquadPing = {
        id: `ping-${Date.now()}`,
        memberId: user.id,
        memberName: user.name,
        memberAvatar: user.avatar,
        actionText: `completed: "${targetTask.title}"`,
        timestamp: "Just now",
        type: "task_completed" as const,
      };

      setSquad((prev) => ({
        ...prev,
        currentProgress: Math.min(
          prev.targetProgress,
          prev.currentProgress + 1,
        ),
        activityPings: [newSquadPing, ...prev.activityPings],
      }));

      addSquadActivityPingToDb(
        squad.id,
        user.id,
        user.name,
        user.avatar,
        `completed: "${targetTask.title}"`,
      );

      setSkillsHealth((prev) =>
        prev.map((sh) => {
          if (
            sh.skillTitle
              .toLowerCase()
              .includes(sprint.skillTitle.toLowerCase())
          ) {
            const nextHealth = Math.min(100, sh.healthPercent + 5);
            updateSkillHealthInDb(user.id, sprint.skillTitle, nextHealth);
            return {
              ...sh,
              healthPercent: nextHealth,
              lastPracticed: "Today",
              status: "optimal",
            };
          }
          return sh;
        }),
      );

      setUser((prev) => {
        const nextUser = {
          ...prev,
          reputation: prev.reputation + 20,
          streak: prev.streak + 1,
        };
        updateProfileInDb(user.id, {
          streak: nextUser.streak,
          reputation: nextUser.reputation,
        });
        return nextUser;
      });

      setSquad((prev) => {
        const ping: SquadActivityPing = {
          id: `ping-${Date.now()}`,
          memberId: user.id,
          memberName: user.name,
          memberAvatar: user.avatar,
          actionText: `completed Day ${targetTask.dayNumber} deliberate practice: ${targetTask.title}`,
          timestamp: "Just now",
          type: "task_completed",
        };
        const alreadyCheckedIn = prev.members.find(
          (m) => m.id === user.id,
        )?.checkedInToday;
        return {
          ...prev,
          currentProgress: alreadyCheckedIn
            ? prev.currentProgress
            : Math.min(prev.targetProgress, prev.currentProgress + 1),
          members: prev.members.map((m) =>
            m.id === user.id
              ? {
                  ...m,
                  checkedInToday: true,
                  recentEncouragement: `Completed Day ${targetTask.dayNumber} deliberate practice: ${targetTask.title}`,
                }
              : m,
          ),
          activityPings: [ping, ...prev.activityPings],
        };
      });

      const notif: NotificationItem = {
        id: `n-${Date.now()}`,
        type: "milestone",
        title: "Sprint Task Completed",
        description: `Day ${targetTask.dayNumber} verified! Milestone recorded in your progress.`,
        timestamp: "Just now",
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
      addNotificationToDb(notif, user.id);

      // Feature 14 & 7: Trigger celebration moment & boost health bar
      setHealthBoostTotal((prev) => Math.min(15, prev + 3));
      triggerCelebration({
        type:
          targetTask.dayNumber >= (sprint.durationDays || 4)
            ? "sprint_finished"
            : "task_completed",
        title:
          targetTask.dayNumber >= (sprint.durationDays || 4)
            ? "Sprint Cleared"
            : `Day ${targetTask.dayNumber} Cleared`,
        subtitle: `Spark verified "${targetTask.title}". Your milestone artifact has been saved.`,
        badgeName: targetTask.artifactTitle || "Milestone Cleared",
        healthBoost: 3,
        actionText: "Share Progress",
      });
    }
  };

  const toggleTaskSubtask = (taskId: string, subtaskId: string) => {
    setSprint((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => {
        if (task.id !== taskId || !task.subtasks) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st,
          ),
        };
      }),
    }));
  };

  // Overall Skill Health calculation
  const overallSkillHealth = {
    percent: Math.min(
      100,
      Math.max(
        70,
        Math.round(
          (skillsHealth.length > 0
            ? skillsHealth.reduce((acc, s) => acc + s.healthPercent, 0) /
              skillsHealth.length
            : 88) + healthBoostTotal,
        ),
      ),
    ),
    status: "optimal" as const,
    daysUntilDecay: 3,
    decayPreventionDays: 7,
    activeSkillsCount: skillsHealth.length || 3,
  };

  const boostSkillHealth = (amount: number) => {
    setHealthBoostTotal((prev) => Math.min(20, prev + amount));
  };

  // Sprinter Friends actions
  const addFriend = (handleOrCode: string) => {
    if (!handleOrCode || handleOrCode.trim() === "") {
      return {
        success: false,
        message: "Please enter a valid handle or friend code.",
      };
    }
    const cleanHandle = handleOrCode.trim().startsWith("@")
      ? handleOrCode.trim()
      : `@${handleOrCode.trim()}`;
    const exists = friends.some(
      (f) => f.handle.toLowerCase() === cleanHandle.toLowerCase(),
    );
    if (exists) {
      return {
        success: false,
        message: `${cleanHandle} is already in your Sprinter Friends!`,
      };
    }

    const newFriend: SprinterFriend = {
      id: `friend-${Date.now()}`,
      name: cleanHandle
        .replace("@", "")
        .replace(/\./g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      handle: cleanHandle,
      avatar: `/avatars/avatar-${(friends.length % 5) + 1}.svg`,
      currentSkill: sprint.skillTitle || "System Architecture",
      streak: 3,
      dayNumber: 1,
      totalDays: 4,
      progressPercent: 25,
      lastActive: "Just now",
      statusText: "Joined your Sprinter Friends network!",
      cheeredToday: false,
      nudgedToday: false,
    };

    setFriends((prev) => [newFriend, ...prev]);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Sprinter Friend Added",
      description: `You are now learning alongside ${newFriend.name} (${newFriend.handle})!`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    return {
      success: true,
      message: `Added ${newFriend.name} to your Sprinter Friends!`,
    };
  };

  const cheerFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendId ? { ...f, cheeredToday: true, streak: f.streak } : f,
      ),
    );
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      const notif: NotificationItem = {
        id: `n-${Date.now()}`,
        type: "squad_checkin",
        title: "Cheer Sent! 🎉",
        description: `You sent a high-five cheer to ${friend.name}. Keep moving forward together!`,
        timestamp: "Just now",
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const nudgeFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, nudgedToday: true } : f)),
    );
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      const notif: NotificationItem = {
        id: `n-${Date.now()}`,
        type: "squad_checkin",
        title: "Friendly Nudge Sent ⚡",
        description: `Spark delivered a non-demanding study nudge to ${friend.name}.`,
        timestamp: "Just now",
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Daily Learning Nudge actions
  const updateDailyNudgeSettings = (updates: Partial<DailyNudgeSettings>) => {
    setDailyNudgeSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("huddle_nudge_settings", JSON.stringify(next));
      }
      return next;
    });
  };

  const dismissActiveNudge = () => {
    setActiveNudge(null);
  };

  const triggerInstantNudge = () => {
    const nudgePool = [
      "⚡ Spark: 15 minutes today keeps your 8-day streak intact and shields your 92% Skill Health Bar.",
      "☕ Spark: Grab a coffee - one 15-minute deliberate drill on caching keeps you ahead of 90% of engineers.",
      "🎯 Spark: Maya just completed her project mission! Your turn to knock out Day " +
        (sprint.currentDay || 1) +
        ".",
      "🛡️ Spark: Streak Shield is active. Take 10 minutes to review your latest system trade-offs.",
    ];
    const text = nudgePool[Math.floor(Math.random() * nudgePool.length)];
    setActiveNudge({
      id: `nudge-${Date.now()}`,
      text,
      timeText: "Just now",
      category: "habit",
      read: false,
    });
  };

  // Celebration Moments actions
  const triggerCelebration = (data: CelebrationData) => {
    setCelebrationData(data);
    setCelebrationModalOpen(true);
  };

  const closeCelebration = () => {
    setCelebrationModalOpen(false);
  };

  // Progress Sharing actions
  const openShareModal = (customData?: Partial<ProgressShareCardData>) => {
    const defaultData: ProgressShareCardData = {
      userName: user.name,
      userHandle: user.handle,
      userAvatar: user.avatar,
      milestoneTitle: sprint.careerMilestone || "Staff Software Engineer",
      skillTitle: sprint.skillTitle || "System Architecture",
      streak: user.streak || 8,
      healthPercent: overallSkillHealth.percent,
      completedTasksCount: sprint.tasks.filter((t) => t.completed).length,
      totalTasksCount: sprint.tasks.length || 4,
      proofBadge: "Verified Deliberate Practice",
      shareUrl:
        typeof window !== "undefined"
          ? `${window.location.origin}/profile/${user.id}`
          : "https://huddle.app",
    };
    setShareCardData({ ...defaultData, ...customData });
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
  };

  // Project Missions actions
  const openProjectMission = (mission?: ProjectMission) => {
    if (mission) {
      setSelectedProjectMission(mission);
    } else {
      setSelectedProjectMission(projectMissions[0]);
    }
    setProjectMissionModalOpen(true);
  };

  const closeProjectMission = () => {
    setProjectMissionModalOpen(false);
  };

  const submitProjectMission = (
    missionId: string,
    link: string,
    notes: string,
  ) => {
    setProjectMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? {
              ...m,
              completed: true,
              submittedAt: "Just now",
              submissionLink: link,
              submissionNotes: notes,
            }
          : m,
      ),
    );

    const targetMission = projectMissions.find((m) => m.id === missionId);
    const missionTitle = targetMission
      ? targetMission.title
      : "Capstone Project Mission";

    // Add portfolio piece
    const newPortfolioItem: PortfolioItem = {
      id: `port-mission-${Date.now()}`,
      title: `Capstone Mission: ${missionTitle}`,
      category: targetMission?.skillCategory || sprint.skillTitle,
      date: "Just now",
      description: `Verified real-world capstone project mission. Link: ${link || "Verified GitHub Repo"}. Notes: ${notes}`,
      artifactType: "live_demo",
      previewSnippet: `// Project Mission Verified Deliverable\nexport const missionProof = {\n  title: "${missionTitle}",\n  verifiedBy: "Spark AI",\n  link: "${link}",\n  status: "PRODUCTION_READY"\n};`,
      isPublished: true,
      sourceTaskId: missionId,
      tags: [
        sprint.skillTitle,
        "Project Mission",
        "Capstone",
        "Verified Proof",
      ],
    };
    setPortfolioItems((prev) => [newPortfolioItem, ...prev]);
    addPortfolioItemToDb(newPortfolioItem, user.id);

    // Boost health and trigger celebration
    boostSkillHealth(8);
    setProjectMissionModalOpen(false);

    triggerCelebration({
      type: "mission_cleared",
      title: "Project Mission Cleared! 🚀",
      subtitle: `Spark verified your capstone deliverable for "${missionTitle}". +8% Health Bar & Capstone Badge unlocked!`,
      badgeName: targetMission?.badge || "Capstone Master",
      healthBoost: 8,
      actionText: "Share Capstone Achievement",
    });
  };

  // Feature 1: Explore Feed into Sprinter
  const addExploreItemToSprinter = (
    title: string,
    creatorName: string,
    durationMinutes: number,
  ) => {
    const newTask: SprintTask = {
      id: `task-explore-${Date.now()}`,
      dayNumber: sprint.tasks.length + 1,
      title: title,
      description: `Added from Explore Feed. Curated by ${creatorName}. Complete to earn deliberate practice XP.`,
      type: "build",
      creatorName: creatorName,
      creatorHandle: `@${creatorName.toLowerCase().replace(/\s+/g, "")}`,
      creatorAvatar: "/avatars/avatar-2.svg",
      estimatedMinutes: durationMinutes || 15,
      completed: false,
      producesArtifact: true,
      artifactTitle: `${title} Implementation`,
      artifactType: "code",
    };

    setSprint((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "next_step",
      title: "Added to AI Skill Sprinter! ⚡",
      description: `"${title}" has been added to your current sprint queue.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Zero-penalty Sprint Reshuffle
  const reshuffleSprint = (customPrompt?: string) => {
    if (!ensureSurveyDone("reshuffle your sprint")) return;
    setSprint((prev) => ({
      ...prev,
      currentDay: 1,
      reshuffleCount: prev.reshuffleCount + 1,
      lastReshuffledAt: "Just now",
      mascotNarration: customPrompt
        ? `I reshuffled your schedule to fit your rhythm with zero penalties! Pick up Day 1 whenever you're ready.`
        : `Schedule reshuffled smoothly! Ready to start fresh with Day 1.`,
    }));

    reshuffleSprintInDb(sprint.id, 1, customPrompt);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "weekly_recap",
      title: "Sprint Reshuffled",
      description:
        "Zero penalty applied. Your sprint progress remains fully intact.",
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const completeStep = (stepId: string) => {
    if (!ensureSurveyDone("complete roadmap steps")) return;
    setRoadmap((prev) => {
      const updatedSteps = prev.steps.map((s) =>
        s.id === stepId
          ? { ...s, status: "completed" as const, completedAt: "Just now" }
          : s,
      );
      return { ...prev, steps: updatedSteps };
    });
    updateRoadmapStepCompletionInDb("rm-1", stepId, true);
  };

  const checkInSquad = (encouragement?: string) => {
    if (!ensureSurveyDone("check in with your squad")) return;

    setSquad((prev) => {
      const alreadyCheckedIn = prev.members.find(
        (m) => m.id === user.id,
      )?.checkedInToday;
      const nextProgress = alreadyCheckedIn
        ? prev.currentProgress
        : Math.min(prev.targetProgress, prev.currentProgress + 1);

      const newSquadPing: SquadActivityPing = {
        id: `ping-${Date.now()}`,
        memberId: user.id,
        memberName: user.name,
        memberAvatar: user.avatar,
        actionText: encouragement
          ? `posted: "${encouragement}"`
          : "completed daily focus check-in",
        timestamp: "Just now",
        type: "checkin",
      };

      return {
        ...prev,
        currentProgress: nextProgress,
        members: prev.members.map((m) =>
          m.id === user.id
            ? {
                ...m,
                checkedInToday: true,
                streak: alreadyCheckedIn ? m.streak : m.streak + 1,
                recentEncouragement:
                  encouragement ||
                  m.recentEncouragement ||
                  "Checked in for daily practice",
              }
            : m,
        ),
        activityPings: [newSquadPing, ...prev.activityPings],
      };
    });

    setUser((prev) => {
      const nextStreak = prev.streak + 1;
      const nextRep = prev.reputation + 10;
      updateProfileInDb(user.id, { streak: nextStreak, reputation: nextRep });
      return {
        ...prev,
        streak: nextStreak,
        reputation: nextRep,
      };
    });

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Squad Check-In Verified",
      description: encouragement
        ? `You posted: "${encouragement}"`
        : "Daily focus check-in logged with your squad.",
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);

    addSquadActivityPingToDb(
      squad.id,
      user.id,
      user.name,
      user.avatar,
      encouragement
        ? `posted: "${encouragement}"`
        : "checked in for daily focus practice",
      "checkin",
    );
    updateSquadMemberCheckInInDb(squad.id, user.id, encouragement);
  };

  const sendSquadNudge = (memberId: string) => {
    if (!ensureSurveyDone("send squad nudges")) return;
    const member = squad.members.find((m) => m.id === memberId);
    if (!member) return;

    const newPing: SquadActivityPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: `sent a friendly practice nudge to ${member.name}`,
      timestamp: "Just now",
      type: "nudge",
    };

    setSquad((prev) => ({
      ...prev,
      activityPings: [newPing, ...prev.activityPings],
    }));

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Squad Encouragement Sent",
      description: `You sent a gentle check-in nudge to ${member.name}.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const sendSquadCheer = (memberId: string) => {
    if (!ensureSurveyDone("cheer squad teammates")) return;
    const member = squad.members.find((m) => m.id === memberId);
    if (!member) return;

    const newPing: SquadActivityPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: `sent a high-five to ${member.name}`,
      timestamp: "Just now",
      type: "cheer",
    };

    setSquad((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, cheerCount: (m.cheerCount || 0) + 1 } : m,
      ),
      activityPings: [newPing, ...prev.activityPings],
    }));

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "High-Five Sent",
      description: `You sent a high-five cheer to ${member.name}.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const submitSquadProject = (title: string, notes: string, link?: string) => {
    if (!ensureSurveyDone("submit squad project")) return;

    const deliverable = {
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      title,
      notes,
      link,
      timestamp: "Just now",
    };

    const newPing: SquadActivityPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: `submitted deliverable "${title}" to Team Blueprint`,
      timestamp: "Just now",
      type: "project_submission",
    };

    setSquad((prev) => {
      const activeProject: SquadProject = prev.activeProject || {
        id: "proj-1",
        title: "Sprint Project",
        description: "Shared engineering deliverable for this sprint",
        deadline: "In 3 days",
        status: "in_progress",
        submissionsCount: 0,
        totalMembers: 4,
        deliverables: [],
      };
      const existingSubmissions = activeProject.deliverables || [];
      const updatedDeliverables: SquadProjectDeliverable[] = [
        deliverable,
        ...existingSubmissions.filter(
          (d: SquadProjectDeliverable) => d.memberId !== user.id,
        ),
      ];

      return {
        ...prev,
        members: prev.members.map((m) =>
          m.id === user.id ? { ...m, submittedProject: true } : m,
        ),
        activeProject: {
          ...activeProject,
          submissionsCount: updatedDeliverables.length,
          deliverables: updatedDeliverables,
        },
        activityPings: [newPing, ...prev.activityPings],
      };
    });

    setUser((prev) => {
      const nextRep = prev.reputation + 30;
      updateProfileInDb(user.id, { reputation: nextRep });
      return { ...prev, reputation: nextRep };
    });

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "milestone",
      title: "Squad Deliverable Submitted",
      description: `Your contribution "${title}" has been registered in the squad blueprint.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const joinSquadByCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    const matched = availableSquads.find(
      (s) => s.inviteCode.toUpperCase() === cleanCode,
    );
    if (matched) {
      const hasUser = matched.members.some((m) => m.id === user.id);
      const updatedMembers: SquadMember[] = hasUser
        ? matched.members
        : [
            ...matched.members,
            {
              id: user.id,
              name: user.name,
              handle: user.handle,
              avatar: user.avatar,
              streak: user.streak,
              checkedInToday: false,
              role: "member",
              cheerCount: 0,
              submittedProject: false,
            },
          ];

      setSquad({
        ...matched,
        members: updatedMembers,
      });

      if (!hasUser) {
        supabase.from("squad_members").upsert({
          id: user.id,
          squad_id: matched.id,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          streak: user.streak,
          checked_in_today: false,
          role: "member",
        });
        supabase
          .from("profiles")
          .update({ squad_id: matched.id })
          .eq("id", user.id);
        setUser((prev) => ({ ...prev, squadId: matched.id }));
      }
      return true;
    }

    setSquad((prev) => ({
      ...prev,
      inviteCode: cleanCode,
      name: `${cleanCode} Cohort`,
    }));
    return true;
  };

  const createCustomSquad = (payload: SquadCreatePayload) => {
    const generatedInviteCode = `HUDDLE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newSquad: MicroSquad = {
      id: `squad-${Date.now()}`,
      name: payload.name,
      skillFocus: payload.skillFocus,
      sharedGoal: payload.sharedGoal,
      currentProgress: 1,
      targetProgress: payload.targetProgress || 12,
      inviteCode: generatedInviteCode,
      members: [
        {
          id: user.id,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          streak: user.streak,
          checkedInToday: true,
          recentEncouragement: "Founded this squad",
          role: "lead",
          cheerCount: 0,
          submittedProject: false,
        },
      ],
      activityPings: [
        {
          id: `ping-${Date.now()}`,
          memberId: user.id,
          memberName: user.name,
          memberAvatar: user.avatar,
          actionText: `created squad "${payload.name}"`,
          timestamp: "Just now",
          type: "checkin",
        },
      ],
      activeProject: {
        id: `proj-${Date.now()}`,
        title: `Team Blueprint: ${payload.skillFocus}`,
        description: payload.sharedGoal,
        deadline: "Sunday, 11:59 PM",
        status: "in_progress",
        submissionsCount: 0,
        totalMembers: 4,
        deliverables: [],
      },
    };
    setSquad(newSquad);
    setAvailableSquads((prev) => [newSquad, ...prev]);

    supabase
      .from("squads")
      .insert({
        id: newSquad.id,
        name: payload.name,
        skill_focus: payload.skillFocus,
        shared_goal: payload.sharedGoal,
        current_progress: 1,
        target_progress: payload.targetProgress || 12,
        invite_code: generatedInviteCode,
      })
      .then(() => {
        supabase.from("squad_members").insert({
          id: user.id,
          squad_id: newSquad.id,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          streak: user.streak,
          checked_in_today: true,
          recent_encouragement: "Founded this squad",
          role: "lead",
        });
        supabase.from("squad_projects").insert({
          id: `proj-${newSquad.id}`,
          squad_id: newSquad.id,
          title: `Team Blueprint: ${payload.skillFocus}`,
          description: payload.sharedGoal,
          deadline: "Sunday, 11:59 PM",
          deliverables: [],
          submissions: [],
        });
        supabase
          .from("profiles")
          .update({ squad_id: newSquad.id })
          .eq("id", user.id);
        setUser((prev) => ({ ...prev, squadId: newSquad.id }));
      });
  };

  const removeSquadMember = async (memberId: string) => {
    const leaderMember = squad.members.find((m) => m.id === user.id);
    if (leaderMember?.role !== "lead") return;

    const targetMember = squad.members.find((m) => m.id === memberId);
    if (!targetMember) return;

    const removalPing: SquadActivityPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: `removed ${targetMember.name} from the squad`,
      timestamp: "Just now",
      type: "nudge",
    };

    setSquad((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
      activityPings: [removalPing, ...prev.activityPings],
    }));

    await removeSquadMemberInDb(squad.id, memberId);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Squad Member Removed",
      description: `${targetMember.name} was removed from ${squad.name}.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const updateSquadMemberRole = async (
    memberId: string,
    newRole: "member" | "lead",
  ) => {
    const leaderMember = squad.members.find((m) => m.id === user.id);
    if (leaderMember?.role !== "lead") return;

    const targetMember = squad.members.find((m) => m.id === memberId);
    if (!targetMember) return;

    const roleTitle = newRole === "lead" ? "Squad Co-Lead" : "Squad Member";
    const ping: SquadActivityPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: `promoted ${targetMember.name} to ${roleTitle}`,
      timestamp: "Just now",
      type: "checkin",
    };

    setSquad((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, role: newRole } : m,
      ),
      activityPings: [ping, ...prev.activityPings],
    }));

    await updateSquadMemberRoleInDb(squad.id, memberId, newRole);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Member Role Updated",
      description: `${targetMember.name} is now a ${roleTitle} in ${squad.name}.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const updateSquadSettings = async (updates: {
    name?: string;
    sharedGoal?: string;
    skillFocus?: string;
    targetProgress?: number;
  }) => {
    const leaderMember = squad.members.find((m) => m.id === user.id);
    if (leaderMember?.role !== "lead") return;

    setSquad((prev) => ({
      ...prev,
      name: updates.name ?? prev.name,
      sharedGoal: updates.sharedGoal ?? prev.sharedGoal,
      skillFocus: updates.skillFocus ?? prev.skillFocus,
      targetProgress: updates.targetProgress ?? prev.targetProgress,
    }));

    await updateSquadSettingsInDb(squad.id, updates);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Squad Settings Updated",
      description:
        "Squad goal and configuration details were updated successfully.",
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);
  };

  const regenerateSquadInviteCode = async (): Promise<string> => {
    const leaderMember = squad.members.find((m) => m.id === user.id);
    if (leaderMember?.role !== "lead") return squad.inviteCode;

    const newInviteCode = `HUDDLE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setSquad((prev) => ({
      ...prev,
      inviteCode: newInviteCode,
    }));

    await updateSquadSettingsInDb(squad.id, { inviteCode: newInviteCode });

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "New Invite Code Generated",
      description: `Squad code refreshed to ${newInviteCode}. Previous codes have expired.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);

    return newInviteCode;
  };

  const submitAnonymousSquadReport = async (payload: {
    squadId: string;
    reportedMemberId: string;
    reportedMemberName: string;
    reasonCategory: ReportReasonCategory;
    details?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const reportId = `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const reporterHash = `anon-${Math.random().toString(36).substring(2, 10)}`;

    const report: AnonymousSquadReport = {
      id: reportId,
      squadId: payload.squadId,
      reportedMemberId: payload.reportedMemberId,
      reportedMemberName: payload.reportedMemberName,
      reporterHash,
      reasonCategory: payload.reasonCategory,
      details: payload.details?.trim() || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const response = await submitSquadReportToDb(report);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "squad_checkin",
      title: "Anonymous Report Received",
      description: `Your anonymous report regarding ${payload.reportedMemberName} was securely sent to Trust & Safety.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    addNotificationToDb(notif, user.id);

    return response;
  };

  const shareProofToCommunity = (milestoneTitle: string, skillTag: string) => {
    if (!ensureSurveyDone("share milestone proofs")) return;

    const newUpdate: MacroSquadUpdate = {
      id: `macro-up-${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      milestoneTitle,
      skillTag,
      timestamp: "Just now",
      congratsCount: 1,
      userCongratulated: false,
    };

    setMacroSquad((prev) => ({
      ...prev,
      milestoneUpdates: [newUpdate, ...prev.milestoneUpdates],
    }));

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: "milestone",
      title: "Milestone Shared to Community",
      description: `Your proof "${milestoneTitle}" is now visible to the global circle.`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const congratulateMacroMilestone = (updateId: string) => {
    if (!ensureSurveyDone("celebrate milestones")) return;
    const targetUpdate = macroSquad.milestoneUpdates.find(
      (u) => u.id === updateId,
    );
    const nextCongratulated = !targetUpdate?.userCongratulated;

    setMacroSquad((prev) => ({
      ...prev,
      milestoneUpdates: prev.milestoneUpdates.map((u) =>
        u.id === updateId
          ? {
              ...u,
              congratsCount: u.userCongratulated
                ? u.congratsCount - 1
                : u.congratsCount + 1,
              userCongratulated: !u.userCongratulated,
            }
          : u,
      ),
    }));

    toggleMacroMilestoneCongratsInDb(updateId, nextCongratulated);
  };

  const createCommunityPost = (
    title: string,
    content: string,
    skillId: string,
    category: CommunityPost["category"],
  ) => {
    if (!ensureSurveyDone("create community posts")) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      skillId,
      skillTitle: sprint.skillTitle,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      authorReputation: user.reputation,
      title,
      content,
      category,
      upvotes: 1,
      userUpvoted: true,
      repliesCount: 0,
      createdAt: "Just now",
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    addCommunityPostToDb(newPost);
  };

  const toggleUpvotePost = (postId: string) => {
    if (!ensureSurveyDone("upvote discussions")) return;
    const target = posts.find((p) => p.id === postId);
    const nextUpvoted = !target?.userUpvoted;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            userUpvoted: !p.userUpvoted,
          };
        }
        return p;
      }),
    );

    toggleCommunityPostUpvoteInDb(postId, nextUpvoted);
  };

  const addReplyToPost = (postId: string, content: string) => {
    if (!ensureSurveyDone("reply to discussions")) return;
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      content,
      createdAt: "Just now",
      upvotes: 0,
      isHelpful: false,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...(p.replies || []), newReply],
          };
        }
        return p;
      }),
    );

    addReplyToCommunityPostInDb(postId, newReply);
  };

  const toggleFollowCreator = (creatorId: string) => {
    if (!ensureSurveyDone("follow creators")) return;
    const target = creators.find((c) => c.id === creatorId);
    const nextFollowing = !target?.isFollowing;

    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          return {
            ...c,
            isFollowing: !c.isFollowing,
            followersCount: c.isFollowing
              ? c.followersCount - 1
              : c.followersCount + 1,
          };
        }
        return c;
      }),
    );

    toggleFollowCreatorInDb(creatorId, nextFollowing);
  };

  const toggleLikeCreatorPost = (postId: string) => {
    if (!ensureSurveyDone("like creator tutorials")) return;
    const target = creatorPosts.find((p) => p.id === postId);
    const nextLiked = !target?.userLiked;

    setCreatorPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: p.userLiked ? p.likesCount - 1 : p.likesCount + 1,
            userLiked: !p.userLiked,
          };
        }
        return p;
      }),
    );

    toggleLikeCreatorPostInDb(postId, nextLiked);
  };

  const toggleBookmarkCreatorPost = (postId: string) => {
    if (!ensureSurveyDone("bookmark creator tutorials")) return;
    setCreatorPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, bookmarked: !p.bookmarked };
        }
        return p;
      }),
    );
  };

  const publishCreatorPost = (
    title: string,
    description: string,
    skillTag: string,
    contentSnippet: string,
    resourceLink: string,
  ) => {
    if (!ensureSurveyDone("upload creator tutorials")) return;
    const newPost: CreatorPost = {
      id: `post-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorHandle: user.handle,
      creatorAvatar: user.avatar,
      creatorTitle: "Verified Creator",
      sponsorBadge: "Community Blueprint",
      skillTag,
      title,
      description,
      contentSnippet,
      duration: "15 mins read + blueprint",
      resourceLinks: resourceLink
        ? [{ title: "Download Resource Blueprint", url: resourceLink }]
        : [],
      likesCount: 0,
      createdAt: "Just now",
    };

    setCreatorPosts((prev) => [newPost, ...prev]);
    publishCreatorPostToDb(newPost);
    setCreatorUploadModalOpen(false);
  };

  const togglePublishPortfolio = (portfolioId: string) => {
    if (!ensureSurveyDone("publish portfolio artifacts")) return;
    setPortfolioItems((prev) =>
      prev.map((p) => {
        if (p.id === portfolioId) {
          const nextPublished = !p.isPublished;
          togglePublishPortfolioInDb(portfolioId, nextPublished);
          return { ...p, isPublished: nextPublished };
        }
        return p;
      }),
    );
  };

  const completeRealWorldProof = (proofId: string) => {
    if (!ensureSurveyDone("submit real-world proofs")) return;
    setRealWorldProofs((prev) =>
      prev.map((p) => {
        if (p.id === proofId) {
          completeRealWorldProofInDb(proofId);
          return { ...p, completed: true };
        }
        return p;
      }),
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    markNotificationReadInDb(id);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      updateProfileInDb(user.id, updates);
      return next;
    });
  };

  const finishOnboarding = (
    selectedSkillTitles: string[],
    targetMilestone?: string,
    surveyPayload?: UserSurveyData,
  ) => {
    const mainSkill = selectedSkillTitles[0] || "System Architecture";
    const milestone =
      targetMilestone || user.careerMilestone || "Staff Software Engineer";
    const completeSurvey: UserSurveyData = surveyPayload || {
      subjects: ["Computer Science/ICT"],
      hobbies: ["Gaming"],
      age: "22",
      ageInput: "22",
      learningStage: "Early Career / Rising Engineer",
      targetProfession: milestone,
      startingSkills: selectedSkillTitles,
      completedAt: new Date().toISOString(),
    };

    setUser((prev) => {
      const next = {
        ...prev,
        onboardingCompleted: true,
        primaryGoal: `Master ${mainSkill}`,
        careerMilestone: milestone,
        surveyData: completeSurvey,
      };
      updateProfileInDb(user.id, {
        onboardingCompleted: true,
        primaryGoal: next.primaryGoal,
        careerMilestone: next.careerMilestone,
        surveyData: completeSurvey,
      });
      return next;
    });
    updateSprintSkillInDb(
      user.id,
      mainSkill,
      milestone,
      completeSurvey.level || "Intermediate",
      completeSurvey.dailyTime || "20 mins / day",
    ).then((tasks) => {
      const finalTasks =
        tasks && tasks.length > 0
          ? tasks
          : generateTasksForSkill(
              sprint?.id || "sprint-1",
              mainSkill,
              completeSurvey.level || "Intermediate",
              completeSurvey.dailyTime || "20 mins / day",
            );
      setSprint((prev) => ({
        ...prev,
        skillTitle: mainSkill,
        durationDays: finalTasks.length,
        tasks: finalTasks,
      }));
    });
    setHasSkippedToPreview(false);
    setSurveyPromptModalOpen(false);
    setOnboardingActive(false);
  };

  const viewProfile = async (identifierOrUser: string | UserProfile) => {
    if (!identifierOrUser) return;

    if (typeof identifierOrUser === "object") {
      if (identifierOrUser.id === user.id) {
        setViewingUserProfile(null);
      } else {
        setViewingUserProfile(identifierOrUser);
      }
      setActiveTab("profile");
      return;
    }

    if (identifierOrUser === user.id || identifierOrUser === user.handle) {
      setViewingUserProfile(null);
      setActiveTab("profile");
      return;
    }

    try {
      const { profile } = await fetchPublicProfile(identifierOrUser);
      if (profile) {
        setViewingUserProfile(profile);
      } else {
        const squadMember = squad.members.find(
          (m) => m.id === identifierOrUser || m.handle === identifierOrUser,
        );
        if (squadMember) {
          setViewingUserProfile({
            id: squadMember.id,
            name: squadMember.name,
            handle: squadMember.handle,
            email: "",
            avatar: squadMember.avatar,
            bio: "Practicing deliberate software engineering craft in squad.",
            streak: squadMember.streak || 5,
            maxStreak: (squadMember.streak || 5) + 3,
            reputation: 150,
            squadId: squad.id,
            macroSquadId: "macro-squad-1",
            primaryGoal: squad.skillFocus,
            careerMilestone: "Senior Software Engineer",
            onboardingCompleted: true,
            joinedDate: "July 2026",
            role: "user",
            status: "active",
            focusSecondsToday: squadMember.checkedInToday ? 2400 : 0,
            lastFocusDate: new Date().toISOString().split("T")[0],
            isTimerRunning: false,
            totalFocusSeconds: 18000,
            privacy: {
              showStreak: true,
              showSquad: true,
              showReputation: true,
              publicProfile: true,
              hideRawRoadmaps: false,
            },
          });
        }
      }
      setActiveTab("profile");
    } catch (err) {
      console.error("Error viewing profile:", err);
      setActiveTab("profile");
    }
  };

  const viewMyProfile = () => {
    setViewingUserProfile(null);
    setActiveTab("profile");
  };

  return (
    <HuddleContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        isDemo,
        login,
        signup,
        logout,
        loginDemo,
        resetDemoAccount,
        skillsHealth,
        roadmap,
        squad,
        availableSquads,
        macroSquad,
        posts,
        creators,
        creatorPosts,
        notifications,
        mascotMessages,
        sprint,
        portfolioItems,
        realWorldProofs,
        careerTimeline,

        activeTab,
        theme,

        secondsFocusedToday,
        isTimerRunning,
        isAppFocused,
        showBingeQuizModal,

        searchOpen,
        settingsOpen,
        mascotOpen,
        authModalOpen,
        resetDemoModalOpen,
        authMode,
        onboardingActive,
        surveyPromptModalOpen,
        surveyActionAttempted,
        hasSkippedToPreview,
        selectedStepModal,
        selectedCreatorModal,
        creatorUploadModalOpen,
        selectedPracticeTask,
        isPracticeSessionOpen,
        isPracticeReviewMode,

        viewingUserProfile,
        viewProfile,
        viewMyProfile,

        setActiveTab,
        setTheme,
        toggleTheme,
        setSearchOpen,
        sidebarOpen,
        setSidebarOpen,
        setSettingsOpen,
        setResetDemoModalOpen,
        setMascotOpen,
        openAuthModal,
        closeAuthModal,
        setOnboardingActive,
        setSurveyPromptModalOpen,
        setHasSkippedToPreview,
        ensureSurveyDone,
        setSelectedStepModal,
        setSelectedCreatorModal,
        setCreatorUploadModalOpen,
        setShowBingeQuizModal,
        openPracticeSession,
        closePracticeSession,
        completePracticeSession,
        practiceProgressMap,
        savePracticeNote,
        savePracticeVideoWatched,
        savePracticeCodeSolution,
        savePracticeQuizResult,

        toggleFocusTimer,
        resetFocusTimer,

        completeSprintTask,
        toggleTaskSubtask,
        reshuffleSprint,
        completeStep,
        checkInSquad,
        sendSquadNudge,
        sendSquadCheer,
        submitSquadProject,
        joinSquadByCode,
        createCustomSquad,
        removeSquadMember,
        updateSquadMemberRole,
        updateSquadSettings,
        regenerateSquadInviteCode,
        submitAnonymousSquadReport,
        shareProofToCommunity,
        congratulateMacroMilestone,
        createCommunityPost,
        toggleUpvotePost,
        addReplyToPost,
        toggleFollowCreator,
        toggleLikeCreatorPost,
        toggleBookmarkCreatorPost,
        publishCreatorPost,
        togglePublishPortfolio,
        completeRealWorldProof,
        markNotificationRead,
        updateUserProfile,
        finishOnboarding,

        // Feature 4: Daily Learning Nudge
        dailyNudgeSettings,
        updateDailyNudgeSettings,
        activeNudge,
        dismissActiveNudge,
        triggerInstantNudge,
        dailyNudgeModalOpen,
        setDailyNudgeModalOpen,

        // Feature 5: Sprinter Friends
        friends,
        addFriend,
        cheerFriend,
        nudgeFriend,

        // Feature 7: Progress Bar of Health
        overallSkillHealth,
        boostSkillHealth,

        // Feature 8: Progress Sharing
        shareCardData,
        shareModalOpen,
        openShareModal,
        closeShareModal,

        // Feature 12: Project Missions
        projectMissions,
        selectedProjectMission,
        projectMissionModalOpen,
        openProjectMission,
        closeProjectMission,
        submitProjectMission,

        // Feature 13: Adaptive Difficulty
        adaptiveDifficulty,
        setAdaptiveDifficulty,

        // Feature 14: Celebration Moments
        celebrationData,
        celebrationModalOpen,
        triggerCelebration,
        closeCelebration,

        // Feature 1: Explore Feed into Sprinter
        addExploreItemToSprinter,
      }}
    >
      {children}
    </HuddleContext.Provider>
  );
};

export const useHuddle = () => {
  const context = useContext(HuddleContext);
  if (!context) {
    throw new Error("useHuddle must be used within a HuddleProvider");
  }
  return context;
};
