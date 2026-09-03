'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  UserSurveyData
} from '../types/huddle';
import { 
  initialUser, 
  initialSkillsHealth, 
  initialRoadmap, 
  initialSquad, 
  initialMacroSquad, 
  initialPosts, 
  initialCreators, 
  initialCreatorPosts, 
  initialNotifications, 
  initialMascotMessages,
  initialSprint,
  initialPortfolioItems,
  initialRealWorldProofs,
  initialCareerTimeline
} from '../data/initialData';
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
  fetchCreatorPosts,
  publishCreatorPostToDb,
  resetDemoAccountInDb
} from '../lib/supabase';

interface HuddleContextType {
  user: UserProfile;
  skillsHealth: SkillHealth[];
  roadmap: SkillRoadmap;
  squad: MicroSquad;
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
  resetDemoAccount: (shouldLogout?: boolean) => Promise<{ success: boolean; error?: string }>;

  activeTab: ActiveTab;
  theme: 'dark' | 'light';
  
  // Focus Timer with Blur / Exit detection
  secondsFocusedToday: number;
  isTimerRunning: boolean;
  isAppFocused: boolean;
  showBingeQuizModal: boolean;
  
  // UI states
  searchOpen: boolean;
  settingsOpen: boolean;
  mascotOpen: boolean;
  authModalOpen: boolean;
  resetDemoModalOpen: boolean;
  authMode: 'welcome' | 'login' | 'signup' | 'forgot';
  onboardingActive: boolean;
  surveyPromptModalOpen: boolean;
  surveyActionAttempted: string | null;
  hasSkippedToPreview: boolean;
  selectedStepModal: JourneyStep | null;
  selectedCreatorModal: CreatorProfile | null;
  creatorUploadModalOpen: boolean;
  
  // State setters
  setActiveTab: (tab: ActiveTab) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setResetDemoModalOpen: (open: boolean) => void;
  setMascotOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'welcome' | 'login' | 'signup' | 'forgot') => void;
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
  
  // Actions
  completeSprintTask: (taskId: string) => void;
  reshuffleSprint: (customPrompt?: string) => void;
  completeStep: (stepId: string) => void;
  checkInSquad: (encouragement?: string) => void;
  sendSquadNudge: (memberId: string) => void;
  congratulateMacroMilestone: (updateId: string) => void;
  createCommunityPost: (title: string, content: string, skillId: string, category: CommunityPost['category']) => void;
  toggleUpvotePost: (postId: string) => void;
  addReplyToPost: (postId: string, content: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  toggleLikeCreatorPost: (postId: string) => void;
  toggleBookmarkCreatorPost: (postId: string) => void;
  publishCreatorPost: (title: string, description: string, skillTag: string, contentSnippet: string, resourceLink: string) => void;
  togglePublishPortfolio: (portfolioId: string) => void;
  completeRealWorldProof: (proofId: string) => void;
  markNotificationRead: (id: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  finishOnboarding: (selectedSkillTitles: string[], targetMilestone?: string, surveyPayload?: UserSurveyData) => void;
}

const HuddleContext = createContext<HuddleContextType | undefined>(undefined);

export const HuddleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [skillsHealth, setSkillsHealth] = useState<SkillHealth[]>(initialSkillsHealth);
  const [roadmap, setRoadmap] = useState<SkillRoadmap>(initialRoadmap);
  const [squad, setSquad] = useState<MicroSquad>(initialSquad);
  const [macroSquad, setMacroSquad] = useState<MacroSquad>(initialMacroSquad);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [creators, setCreators] = useState<CreatorProfile[]>(initialCreators);
  const [creatorPosts, setCreatorPosts] = useState<CreatorPost[]>(initialCreatorPosts);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [mascotMessages, setMascotMessages] = useState<MascotMessage[]>(initialMascotMessages);
  const [sprint, setSprint] = useState<SprintChecklist>(initialSprint);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialPortfolioItems);
  const [realWorldProofs, setRealWorldProofs] = useState<RealWorldProofItem[]>(initialRealWorldProofs);
  const [careerTimeline, setCareerTimeline] = useState<CareerTimelineEntry[]>(initialCareerTimeline);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  
  // Focus Timer state (starts at 18 mins / 1080 secs today)
  const [secondsFocusedToday, setSecondsFocusedToday] = useState(1080);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isAppFocused, setIsAppFocused] = useState(true);
  const [showBingeQuizModal, setShowBingeQuizModal] = useState(false);

  // UI modal toggles
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mascotOpen, setMascotOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'signup' | 'forgot'>('welcome');
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [surveyPromptModalOpen, setSurveyPromptModalOpen] = useState(false);
  const [surveyActionAttempted, setSurveyActionAttempted] = useState<string | null>(null);
  const [hasSkippedToPreview, setHasSkippedToPreview] = useState(false);
  const [selectedStepModal, setSelectedStepModal] = useState<JourneyStep | null>(null);
  const [selectedCreatorModal, setSelectedCreatorModal] = useState<CreatorProfile | null>(null);
  const [creatorUploadModalOpen, setCreatorUploadModalOpen] = useState(false);
  const [isDemoState, setIsDemoState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('huddle_is_demo') === 'true';
    }
    return false;
  });
  const [resetDemoModalOpen, setResetDemoModalOpen] = useState(false);

  const isDemo = isDemoState || user.id === 'user-1' || user.email === 'alex@huddle.dev';

  // Load from Supabase on mount & subscribe to Realtime updates
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setIsDemoState(false);
          const activeUserId = session.user.id;
          const [
            dbProfile,
            dbSprint,
            dbPortfolio,
            dbProofs,
            dbSquad,
            dbCreatorPosts
          ] = await Promise.all([
            fetchUserProfile(activeUserId),
            fetchCurrentSprint(activeUserId),
            fetchPortfolioItems(activeUserId),
            fetchRealWorldProofs(activeUserId),
            fetchSquad('squad-1'),
            fetchCreatorPosts()
          ]);

          if (dbProfile) setUser(dbProfile);
          if (dbSprint) setSprint(dbSprint);
          if (dbPortfolio && dbPortfolio.length > 0) setPortfolioItems(dbPortfolio);
          if (dbProofs && dbProofs.length > 0) setRealWorldProofs(dbProofs);
          if (dbSquad) setSquad(dbSquad);
          if (dbCreatorPosts && dbCreatorPosts.length > 0) setCreatorPosts(dbCreatorPosts);
        } else {
          const isDemoStored = typeof window !== 'undefined' && localStorage.getItem('huddle_is_demo') === 'true';
          if (isDemoStored) {
            setIsDemoState(true);
            await loginDemo();
          } else {
            setIsAuthenticated(false);
            setIsDemoState(false);
          }
        }
      } catch (err) {
        console.error('Supabase initial data fetch error:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    loadSupabaseData();

    // 1. Auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    // 2. Realtime subscription for squad activity pings
    const squadChannel = supabase
      .channel('realtime:squad_activity_pings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'squad_activity_pings' },
        payload => {
          const newPing = payload.new as any;
          setSquad(prev => {
            if (prev.activityPings.some(p => p.id === newPing.id)) return prev;
            return {
              ...prev,
              currentProgress: Math.min(prev.targetProgress, prev.currentProgress + 1),
              activityPings: [
                {
                  id: newPing.id,
                  memberId: newPing.member_id,
                  memberName: newPing.member_name,
                  memberAvatar: newPing.member_avatar,
                  actionText: newPing.action_text,
                  timestamp: 'Just now',
                  type: newPing.ping_type
                },
                ...prev.activityPings
              ]
            };
          });
        }
      )
      .subscribe();

    // 3. Realtime subscription for creator posts
    const creatorChannel = supabase
      .channel('realtime:creator_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'creator_posts' },
        payload => {
          const newPost = payload.new as any;
          setCreatorPosts(prev => {
            if (prev.some(p => p.id === newPost.id)) return prev;
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
                createdAt: 'Just now'
              },
              ...prev
            ];
          });
        }
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
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('huddle_theme') as 'dark' | 'light' | null : null;
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('huddle_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Window Focus / Blur & Visibility listeners
  useEffect(() => {
    const handleFocus = () => setIsAppFocused(true);
    const handleBlur = () => setIsAppFocused(false);
    const handleVisibilityChange = () => {
      setIsAppFocused(!document.hidden);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Focus Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && isAppFocused) {
      interval = setInterval(() => {
        setSecondsFocusedToday(prev => {
          const next = prev + 1;
          if (next > 0 && next % 1500 === 0) {
            setShowBingeQuizModal(true);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isAppFocused]);

  // Auth Methods
  const login = async (email: string, password: string) => {
    const { user: authUser, error } = await signInUser(email, password);
    if (error) return { success: false, error };
    if (authUser) {
      setIsDemoState(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('huddle_is_demo');
      }
      setIsAuthenticated(true);
      const profile = await fetchUserProfile(authUser.id);
      if (profile) setUser(profile);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { user: authUser, error } = await signUpUser(email, password, fullName);
    if (error) return { success: false, error };
    if (authUser) {
      setIsDemoState(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('huddle_is_demo');
      }
      setIsAuthenticated(true);
      const profile = await fetchUserProfile(authUser.id);
      if (profile) setUser(profile);
      return { success: true };
    }
    return { success: false, error: 'Sign up failed' };
  };

  const logout = async () => {
    setIsDemoState(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('huddle_is_demo');
    }
    await signOutUser();
    setIsAuthenticated(false);
  };

  const loginDemo = async () => {
    setIsAuthenticated(true);
    setIsDemoState(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('huddle_is_demo', 'true');
    }
    const activeUserId = 'user-1';
    const [
      dbProfile,
      dbSprint,
      dbPortfolio,
      dbProofs,
      dbSquad,
      dbCreatorPosts
    ] = await Promise.all([
      fetchUserProfile(activeUserId),
      fetchCurrentSprint(activeUserId),
      fetchPortfolioItems(activeUserId),
      fetchRealWorldProofs(activeUserId),
      fetchSquad('squad-1'),
      fetchCreatorPosts()
    ]);

    if (dbProfile) setUser(dbProfile);
    if (dbSprint) setSprint(dbSprint);
    if (dbPortfolio && dbPortfolio.length > 0) setPortfolioItems(dbPortfolio);
    if (dbProofs && dbProofs.length > 0) setRealWorldProofs(dbProofs);
    if (dbSquad) setSquad(dbSquad);
    if (dbCreatorPosts && dbCreatorPosts.length > 0) setCreatorPosts(dbCreatorPosts);
  };

  const resetDemoAccount = async (shouldLogout: boolean = false): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await resetDemoAccountInDb();
      if (!res.success) {
        return res;
      }

      if (shouldLogout) {
        await logout();
        return { success: true };
      }

      // Reset in-memory state cleanly to initial baseline
      setUser(initialUser);
      setSkillsHealth(initialSkillsHealth);
      setRoadmap(initialRoadmap);
      setSprint(initialSprint);
      setPortfolioItems(initialPortfolioItems);
      setRealWorldProofs(initialRealWorldProofs);
      setSquad(initialSquad);
      setSecondsFocusedToday(1080);
      setIsTimerRunning(true);
      setOnboardingActive(false);
      setActiveTab('dashboard');

      // Re-fetch from Supabase to guarantee complete parity with restored database
      const activeUserId = 'user-1';
      const [
        dbProfile,
        dbSprint,
        dbPortfolio,
        dbProofs,
        dbSquad
      ] = await Promise.all([
        fetchUserProfile(activeUserId),
        fetchCurrentSprint(activeUserId),
        fetchPortfolioItems(activeUserId),
        fetchRealWorldProofs(activeUserId),
        fetchSquad('squad-1')
      ]);

      if (dbProfile) setUser(dbProfile);
      if (dbSprint) setSprint(dbSprint);
      if (dbPortfolio) setPortfolioItems(dbPortfolio);
      if (dbProofs) setRealWorldProofs(dbProofs);
      if (dbSquad) setSquad(dbSquad);

      try {
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      } catch (e) {}

      return { success: true };
    } catch (err: any) {
      console.error('Error in resetDemoAccount:', err);
      return { success: false, error: err.message || 'Failed to reset demo account' };
    }
  };

  const toggleFocusTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetFocusTimer = () => {
    setSecondsFocusedToday(0);
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openAuthModal = (mode: 'welcome' | 'login' | 'signup' | 'forgot' = 'welcome') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const ensureSurveyDone = (actionName?: string): boolean => {
    if (!user.onboardingCompleted) {
      setSurveyActionAttempted(actionName || 'perform this action');
      setSurveyPromptModalOpen(true);
      return false;
    }
    return true;
  };

  // Complete a task in the 2-5 day Sprint Checklist
  const completeSprintTask = (taskId: string) => {
    if (!ensureSurveyDone('complete sprint tasks')) return;
    const targetTask = sprint.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const nextCompleted = !targetTask.completed;

    setSprint(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: nextCompleted, completedAt: nextCompleted ? 'Just now' : undefined }
          : t
      )
    }));

    updateSprintTaskCompletion(taskId, nextCompleted, nextCompleted ? 'Just now' : undefined);

    if (nextCompleted) {
      try {
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default;
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#10b981', '#f59e0b']
          });
        });
      } catch (e) {
        // Safe fallback
      }

      if (targetTask.producesArtifact && targetTask.artifactTitle) {
        const newPortfolioItem: PortfolioItem = {
          id: `port-${Date.now()}`,
          title: targetTask.artifactTitle,
          category: sprint.skillTitle,
          date: 'Just now',
          description: `Auto-assembled artifact produced from sprint task: "${targetTask.title}".`,
          artifactType: targetTask.artifactType || 'code',
          previewSnippet: `// Sprint Artifact: ${targetTask.artifactTitle}\n// Verified deliberate practice task\nexport const artifact = { verified: true, creator: "${targetTask.creatorName}" };`,
          isPublished: false,
          sourceTaskId: targetTask.id,
          tags: [sprint.skillTitle, 'Auto-assembled']
        };

        setPortfolioItems(prev => [newPortfolioItem, ...prev]);
        addPortfolioItemToDb(newPortfolioItem, user.id);

        const newTimelineEntry: CareerTimelineEntry = {
          id: `tl-${Date.now()}`,
          date: 'Today',
          type: 'portfolio_piece',
          title: `Artifact Produced: ${targetTask.artifactTitle}`,
          description: `Generated from sprint task with ${targetTask.creatorName}. Added to private portfolio.`,
          badge: 'Portfolio Ready'
        };
        setCareerTimeline(prev => [newTimelineEntry, ...prev]);
      }

      const newSquadPing = {
        id: `ping-${Date.now()}`,
        memberId: user.id,
        memberName: user.name,
        memberAvatar: user.avatar,
        actionText: `completed: "${targetTask.title}"`,
        timestamp: 'Just now',
        type: 'task_completed' as const
      };

      setSquad(prev => ({
        ...prev,
        currentProgress: Math.min(prev.targetProgress, prev.currentProgress + 1),
        activityPings: [newSquadPing, ...prev.activityPings]
      }));

      addSquadActivityPingToDb(squad.id, user.id, user.name, user.avatar, `completed: "${targetTask.title}"`);

      setSkillsHealth(prev => 
        prev.map(sh => {
          if (sh.skillTitle.toLowerCase().includes(sprint.skillTitle.toLowerCase())) {
            return {
              ...sh,
              healthPercent: Math.min(100, sh.healthPercent + 5),
              lastPracticed: 'Today',
              status: 'optimal'
            };
          }
          return sh;
        })
      );

      setUser(prev => {
        const nextUser = {
          ...prev,
          reputation: prev.reputation + 20,
          streak: prev.streak + 1
        };
        updateProfileInDb(user.id, { streak: nextUser.streak, reputation: nextUser.reputation });
        return nextUser;
      });

      const notif: NotificationItem = {
        id: `n-${Date.now()}`,
        type: 'milestone',
        title: 'Sprint Task Completed',
        description: `Day ${targetTask.dayNumber} verified! Streak is now ${user.streak + 1} days.`,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Zero-penalty Sprint Reshuffle
  const reshuffleSprint = (customPrompt?: string) => {
    if (!ensureSurveyDone('reshuffle your sprint')) return;
    setSprint(prev => ({
      ...prev,
      currentDay: 1,
      reshuffleCount: prev.reshuffleCount + 1,
      lastReshuffledAt: 'Just now',
      mascotNarration: customPrompt 
        ? `I reshuffled your schedule to fit your rhythm with zero penalties! Pick up Day 1 whenever you're ready.`
        : `Schedule reshuffled smoothly! Ready to start fresh with Day 1.`
    }));

    reshuffleSprintInDb(sprint.id, 1, customPrompt);

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: 'weekly_recap',
      title: 'Sprint Reshuffled',
      description: 'Zero penalty applied. Your progress and streak remain fully intact.',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const completeStep = (stepId: string) => {
    if (!ensureSurveyDone('complete roadmap steps')) return;
    setRoadmap(prev => {
      const updatedSteps = prev.steps.map(s => 
        s.id === stepId 
          ? { ...s, status: 'completed' as const, completedAt: 'Just now' } 
          : s
      );
      return { ...prev, steps: updatedSteps };
    });
  };

  const checkInSquad = (encouragement?: string) => {
    if (!ensureSurveyDone('check in with your squad')) return;
    setSquad(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.id === user.id 
          ? { ...m, checkedInToday: true, recentEncouragement: encouragement || m.recentEncouragement } 
          : m
      )
    }));

    const newSquadPing = {
      id: `ping-${Date.now()}`,
      memberId: user.id,
      memberName: user.name,
      memberAvatar: user.avatar,
      actionText: encouragement ? `posted: "${encouragement}"` : 'checked in for daily focus practice',
      timestamp: 'Just now',
      type: 'checkin' as const
    };

    setSquad(prev => ({
      ...prev,
      activityPings: [newSquadPing, ...prev.activityPings]
    }));

    addSquadActivityPingToDb(squad.id, user.id, user.name, user.avatar, newSquadPing.actionText, 'checkin');
  };

  const sendSquadNudge = (memberId: string) => {
    if (!ensureSurveyDone('send squad nudges')) return;
    const member = squad.members.find(m => m.id === memberId);
    if (!member) return;

    const notif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: 'squad_checkin',
      title: 'Squad Encouragement Sent',
      description: `You sent a gentle check-in nudge to ${member.name}.`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const congratulateMacroMilestone = (updateId: string) => {
    if (!ensureSurveyDone('celebrate milestones')) return;
    setMacroSquad(prev => ({
      ...prev,
      milestoneUpdates: prev.milestoneUpdates.map(u => 
        u.id === updateId 
          ? { 
              ...u, 
              congratsCount: u.userCongratulated ? u.congratsCount - 1 : u.congratsCount + 1,
              userCongratulated: !u.userCongratulated 
            } 
          : u
      )
    }));
  };

  const createCommunityPost = (title: string, content: string, skillId: string, category: CommunityPost['category']) => {
    if (!ensureSurveyDone('create community posts')) return;
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
      createdAt: 'Just now',
      replies: []
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleUpvotePost = (postId: string) => {
    if (!ensureSurveyDone('upvote discussions')) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          userUpvoted: !p.userUpvoted
        };
      }
      return p;
    }));
  };

  const addReplyToPost = (postId: string, content: string) => {
    if (!ensureSurveyDone('reply to discussions')) return;
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      content,
      createdAt: 'Just now',
      upvotes: 0,
      isHelpful: false
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [...(p.replies || []), newReply]
        };
      }
      return p;
    }));
  };

  const toggleFollowCreator = (creatorId: string) => {
    if (!ensureSurveyDone('follow creators')) return;
    setCreators(prev => prev.map(c => {
      if (c.id === creatorId) {
        return { ...c, isFollowing: !c.isFollowing, followersCount: c.isFollowing ? c.followersCount - 1 : c.followersCount + 1 };
      }
      return c;
    }));
  };

  const toggleLikeCreatorPost = (postId: string) => {
    if (!ensureSurveyDone('like creator tutorials')) return;
    setCreatorPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likesCount: p.userLiked ? p.likesCount - 1 : p.likesCount + 1,
          userLiked: !p.userLiked
        };
      }
      return p;
    }));
  };

  const toggleBookmarkCreatorPost = (postId: string) => {
    if (!ensureSurveyDone('bookmark creator tutorials')) return;
    setCreatorPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, bookmarked: !p.bookmarked };
      }
      return p;
    }));
  };

  const publishCreatorPost = (title: string, description: string, skillTag: string, contentSnippet: string, resourceLink: string) => {
    if (!ensureSurveyDone('upload creator tutorials')) return;
    const newPost: CreatorPost = {
      id: `post-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorHandle: user.handle,
      creatorAvatar: user.avatar,
      creatorTitle: 'Verified Creator',
      sponsorBadge: 'Community Blueprint',
      skillTag,
      title,
      description,
      contentSnippet,
      duration: '15 mins read + blueprint',
      resourceLinks: resourceLink ? [{ title: 'Download Resource Blueprint', url: resourceLink }] : [],
      likesCount: 0,
      createdAt: 'Just now'
    };

    setCreatorPosts(prev => [newPost, ...prev]);
    publishCreatorPostToDb(newPost);
    setCreatorUploadModalOpen(false);
  };

  const togglePublishPortfolio = (portfolioId: string) => {
    if (!ensureSurveyDone('publish portfolio artifacts')) return;
    setPortfolioItems(prev => prev.map(p => {
      if (p.id === portfolioId) {
        const nextPublished = !p.isPublished;
        togglePublishPortfolioInDb(portfolioId, nextPublished);
        return { ...p, isPublished: nextPublished };
      }
      return p;
    }));
  };

  const completeRealWorldProof = (proofId: string) => {
    if (!ensureSurveyDone('submit real-world proofs')) return;
    setRealWorldProofs(prev => prev.map(p => {
      if (p.id === proofId) {
        completeRealWorldProofInDb(proofId);
        return { ...p, completed: true };
      }
      return p;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      updateProfileInDb(user.id, updates);
      return next;
    });
  };

  const finishOnboarding = (
    selectedSkillTitles: string[],
    targetMilestone?: string,
    surveyPayload?: UserSurveyData
  ) => {
    const mainSkill = selectedSkillTitles[0] || 'System Architecture';
    const milestone = targetMilestone || user.careerMilestone || 'Staff Software Engineer';
    const completeSurvey: UserSurveyData = surveyPayload || {
      subjects: ['Computer Science/ICT'],
      hobbies: ['Gaming'],
      age: '22',
      ageInput: '22',
      learningStage: 'Early Career / Rising Engineer',
      targetProfession: milestone,
      startingSkills: selectedSkillTitles,
      completedAt: new Date().toISOString()
    };

    setUser(prev => {
      const next = { 
        ...prev, 
        onboardingCompleted: true, 
        primaryGoal: `Master ${mainSkill}`,
        careerMilestone: milestone,
        surveyData: completeSurvey
      };
      updateProfileInDb(user.id, { 
        onboardingCompleted: true, 
        primaryGoal: next.primaryGoal,
        careerMilestone: next.careerMilestone,
        surveyData: completeSurvey
      });
      return next;
    });
    setSprint(prev => ({
      ...prev,
      skillTitle: mainSkill
    }));
    setHasSkippedToPreview(false);
    setSurveyPromptModalOpen(false);
    setOnboardingActive(false);
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
        
        setActiveTab,
        setTheme,
        toggleTheme,
        setSearchOpen,
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
        
        toggleFocusTimer,
        resetFocusTimer,
        
        completeSprintTask,
        reshuffleSprint,
        completeStep,
        checkInSquad,
        sendSquadNudge,
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
        finishOnboarding
      }}
    >
      {children}
    </HuddleContext.Provider>
  );
};

export const useHuddle = () => {
  const context = useContext(HuddleContext);
  if (!context) {
    throw new Error('useHuddle must be used within a HuddleProvider');
  }
  return context;
};
