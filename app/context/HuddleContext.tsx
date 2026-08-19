'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  SkillHealth, 
  SkillRoadmap, 
  MicroSquad, 
  CommunityPost, 
  CreatorProfile, 
  NotificationItem, 
  MascotMessage,
  ActiveTab,
  JourneyStep
} from '../types/huddle';
import { 
  initialUser, 
  initialSkillsHealth, 
  initialRoadmap, 
  initialSquad, 
  initialPosts, 
  initialCreators, 
  initialNotifications, 
  initialMascotMessages 
} from '../data/initialData';

interface HuddleContextType {
  user: UserProfile;
  skillsHealth: SkillHealth[];
  roadmap: SkillRoadmap;
  squad: MicroSquad;
  posts: CommunityPost[];
  creators: CreatorProfile[];
  notifications: NotificationItem[];
  mascotMessages: MascotMessage[];
  activeTab: ActiveTab;
  theme: 'dark' | 'light';
  searchOpen: boolean;
  settingsOpen: boolean;
  mascotOpen: boolean;
  authModalOpen: boolean;
  authMode: 'welcome' | 'login' | 'signup' | 'forgot';
  onboardingActive: boolean;
  selectedStepModal: JourneyStep | null;
  selectedCreatorModal: CreatorProfile | null;
  
  setActiveTab: (tab: ActiveTab) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setMascotOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'welcome' | 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  setOnboardingActive: (active: boolean) => void;
  setSelectedStepModal: (step: JourneyStep | null) => void;
  setSelectedCreatorModal: (creator: CreatorProfile | null) => void;
  
  completeStep: (stepId: string) => void;
  checkInSquad: (encouragement?: string) => void;
  sendSquadNudge: (memberId: string) => void;
  createCommunityPost: (title: string, content: string, skillId: string, category: CommunityPost['category']) => void;
  toggleUpvotePost: (postId: string) => void;
  addReplyToPost: (postId: string, content: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  markNotificationRead: (id: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  finishOnboarding: (selectedSkillTitles: string[]) => void;
}

const HuddleContext = createContext<HuddleContextType | undefined>(undefined);

export const HuddleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [skillsHealth, setSkillsHealth] = useState<SkillHealth[]>(initialSkillsHealth);
  const [roadmap, setRoadmap] = useState<SkillRoadmap>(initialRoadmap);
  const [squad, setSquad] = useState<MicroSquad>(initialSquad);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [creators, setCreators] = useState<CreatorProfile[]>(initialCreators);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [mascotMessages, setMascotMessages] = useState<MascotMessage[]>(initialMascotMessages);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mascotOpen, setMascotOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'welcome' | 'login' | 'signup' | 'forgot'>('welcome');
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [selectedStepModal, setSelectedStepModal] = useState<JourneyStep | null>(null);
  const [selectedCreatorModal, setSelectedCreatorModal] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

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

  const completeStep = (stepId: string) => {
    setRoadmap(prev => {
      const stepIndex = prev.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return prev;

      const updatedSteps = [...prev.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status: 'completed',
        completedAt: 'Just now'
      };

      let nextIndex = prev.currentStepIndex;
      if (stepIndex < updatedSteps.length - 1) {
        nextIndex = stepIndex + 1;
        if (updatedSteps[nextIndex].status === 'upcoming') {
          updatedSteps[nextIndex] = {
            ...updatedSteps[nextIndex],
            status: 'current'
          };
        }
      }

      return {
        ...prev,
        currentStepIndex: nextIndex,
        steps: updatedSteps
      };
    });

    setSkillsHealth(prev => 
      prev.map(sh => {
        if (sh.skillId === roadmap.skillId) {
          const newHealth = Math.min(100, sh.healthPercent + 6);
          return {
            ...sh,
            healthPercent: newHealth,
            lastPracticed: 'Today',
            status: newHealth > 80 ? 'optimal' : 'maintaining'
          };
        }
        return sh;
      })
    );

    setUser(prev => ({
      ...prev,
      reputation: prev.reputation + 25
    }));

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: 'milestone',
      title: 'Step Completed',
      description: 'You completed a step in System Architecture.',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const checkInSquad = (encouragement?: string) => {
    setSquad(prev => {
      const updatedMembers = prev.members.map(m => {
        if (m.id === user.id) {
          return {
            ...m,
            checkedInToday: true,
            streak: m.streak + 1,
            lastCheckIn: 'Just now',
            recentEncouragement: encouragement || 'Step completed!'
          };
        }
        return m;
      });

      const checkedInCount = updatedMembers.filter(m => m.checkedInToday).length;
      return {
        ...prev,
        members: updatedMembers,
        currentProgress: Math.min(prev.targetProgress, prev.currentProgress + 1)
      };
    });

    setUser(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  const sendSquadNudge = (memberId: string) => {
    const target = squad.members.find(m => m.id === memberId);
    if (!target) return;

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      type: 'squad_checkin',
      title: 'Nudge Sent',
      description: `Sent a warm check-in reminder to ${target.name}.`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const createCommunityPost = (
    title: string, 
    content: string, 
    skillId: string, 
    category: CommunityPost['category']
  ) => {
    const skillNameMap: Record<string, string> = {
      'sys-arch': 'System Architecture',
      'next-rsc': 'Next.js App Router & RSC',
      'ts-type-mechanics': 'TypeScript Type Mechanics',
      'ui-micro': 'Product UI & Micro-interactions'
    };

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      skillId,
      skillTitle: skillNameMap[skillId] || 'Engineering',
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
      createdAt: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);
    setUser(prev => ({ ...prev, reputation: prev.reputation + 10 }));
  };

  const toggleUpvotePost = (postId: string) => {
    setPosts(prev => 
      prev.map(p => {
        if (p.id === postId) {
          const isUpvoted = p.userUpvoted;
          return {
            ...p,
            userUpvoted: !isUpvoted,
            upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1
          };
        }
        return p;
      })
    );
  };

  const addReplyToPost = (postId: string, content: string) => {
    setPosts(prev => 
      prev.map(p => {
        if (p.id === postId) {
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
          const existingReplies = p.replies || [];
          return {
            ...p,
            repliesCount: p.repliesCount + 1,
            replies: [...existingReplies, newReply]
          };
        }
        return p;
      })
    );
  };

  const toggleFollowCreator = (creatorId: string) => {
    setCreators(prev => 
      prev.map(c => {
        if (c.id === creatorId) {
          const nextState = !c.isFollowing;
          return {
            ...c,
            isFollowing: nextState,
            followersCount: nextState ? c.followersCount + 1 : c.followersCount - 1
          };
        }
        return c;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const finishOnboarding = (selectedSkillTitles: string[]) => {
    setUser(prev => ({
      ...prev,
      onboardingCompleted: true
    }));
    setOnboardingActive(false);
    setActiveTab('dashboard');
  };

  return (
    <HuddleContext.Provider value={{
      user,
      skillsHealth,
      roadmap,
      squad,
      posts,
      creators,
      notifications,
      mascotMessages,
      activeTab,
      theme,
      searchOpen,
      settingsOpen,
      mascotOpen,
      authModalOpen,
      authMode,
      onboardingActive,
      selectedStepModal,
      selectedCreatorModal,
      
      setActiveTab,
      setTheme,
      toggleTheme,
      setSearchOpen,
      setSettingsOpen,
      setMascotOpen,
      openAuthModal,
      closeAuthModal,
      setOnboardingActive,
      setSelectedStepModal,
      setSelectedCreatorModal,
      
      completeStep,
      checkInSquad,
      sendSquadNudge,
      createCommunityPost,
      toggleUpvotePost,
      addReplyToPost,
      toggleFollowCreator,
      markNotificationRead,
      updateUserProfile,
      finishOnboarding
    }}>
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
