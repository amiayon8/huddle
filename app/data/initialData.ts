import { 
  UserProfile, 
  SkillHealth, 
  SkillRoadmap, 
  MicroSquad, 
  MacroSquad,
  CommunityPost, 
  CreatorProfile, 
  CreatorPost, 
  NotificationItem, 
  MascotMessage, 
  SprintChecklist, 
  PortfolioItem, 
  RealWorldProofItem, 
  CareerTimelineEntry 
} from '../types/huddle';

/**
 * Dynamic User Generator
 */
export function createDynamicUser(name: string = 'Engineer', email: string = 'user@huddle.dev'): UserProfile {
  const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;
  return {
    id: `u-${Date.now()}`,
    name,
    handle,
    email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Turning doomscroll impulse into 1 deliberate daily engineering action.',
    streak: 1,
    maxStreak: 1,
    reputation: 50,
    squadId: 'squad-1',
    macroSquadId: 'macro-squad-1',
    onboardingCompleted: true,
    surveyData: {
      subjects: ['Computer Science/ICT', 'Mathematics'],
      hobbies: ['Gaming', 'Reading'],
      age: '24',
      ageInput: '24',
      learningStage: 'Early Career / Rising Engineer',
      targetProfession: 'Staff Software Engineer',
      startingSkills: ['System Architecture'],
      completedAt: new Date().toISOString()
    },
    joinedDate: 'Today',
    primaryGoal: 'Master System Architecture',
    careerMilestone: 'Staff Software Engineer',
    privacy: {
      showStreak: true,
      showSquad: true,
      showReputation: true,
      publicProfile: true,
      hideRawRoadmaps: true
    }
  };
}

/**
 * Dynamic Skill Health Generator
 */
export function createDynamicSkillsHealth(skills: string[] = ['System Architecture']): SkillHealth[] {
  const categories: Record<string, string> = {
    'System Architecture': 'Engineering',
    'Next.js App Router': 'Frontend',
    'TypeScript Type Mechanics': 'Languages',
    'Product UI & Micro-interactions': 'Design',
    'AI Engineering & Agents': 'AI & ML'
  };

  return skills.map((title, idx) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      skillId: slug,
      skillTitle: title,
      category: categories[title] || 'Engineering',
      healthPercent: Math.max(70, 95 - idx * 8),
      decayRate: '-2% / week',
      lastPracticed: idx === 0 ? 'Today' : `${idx + 1} days ago`,
      status: idx === 0 ? 'optimal' : 'maintaining'
    };
  });
}

/**
 * Dynamic Sprint Generator based on chosen skill
 */
export function createDynamicSprint(
  skillTitle: string = 'System Architecture',
  milestone: string = 'Staff Software Engineer',
  durationDays: number = 4
): SprintChecklist {
  const sprintBlueprints: Record<string, Array<{
    title: string;
    desc: string;
    type: 'learn' | 'build' | 'real_world_proof';
    creator: string;
    handle: string;
    avatar: string;
    mins: number;
    artifact?: string;
  }>> = {
    'System Architecture': [
      {
        title: 'Distributed Caching & Stampede Defense',
        desc: 'Study probabilistic early expiration (XFetch algorithm) and Redis mutex locking patterns.',
        type: 'learn',
        creator: 'Elena Rostova',
        handle: '@elena_distrib',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        mins: 15,
        artifact: 'Cache Stampede Mitigation Benchmark'
      },
      {
        title: 'Atomic Lua Scripts in Redis Clusters',
        desc: 'Implement single-threaded atomic mutex locking scripts to protect critical path cache keys.',
        type: 'build',
        creator: 'Elena Rostova',
        handle: '@elena_distrib',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        mins: 18,
        artifact: 'Redis Lua Stampede Shield Mutex Blueprint'
      },
      {
        title: 'Write-Through vs Write-Behind Tradeoffs',
        desc: 'Analyze durability vs latency benchmarks with PostgreSQL replica failovers.',
        type: 'learn',
        creator: 'Marcus Vance',
        handle: '@marcus_vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        mins: 20
      },
      {
        title: 'Real-World Proof: Open-Source Cache ADR',
        desc: 'Draft and submit an Architecture Decision Record (ADR) pull request documenting cache stampede mitigation.',
        type: 'real_world_proof',
        creator: 'Elena Rostova',
        handle: '@elena_distrib',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        mins: 15,
        artifact: 'Open-Source Distributed Cache ADR #104'
      }
    ],
    'Next.js App Router': [
      {
        title: 'RSC Stream Rendering & Suspense Boundaries',
        desc: 'Master parallel nested layouts and suspense fallbacks for sub-100ms TTFB.',
        type: 'learn',
        creator: 'Kenji Sato',
        handle: '@kenjisato',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        mins: 15,
        artifact: 'Streaming Layout Fallback Blueprint'
      },
      {
        title: 'Server Actions with Optimistic UI Mutation',
        desc: 'Implement type-safe server mutations with immediate optimistic client rollbacks.',
        type: 'build',
        creator: 'Kenji Sato',
        handle: '@kenjisato',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        mins: 20,
        artifact: 'Optimistic Server Action Pattern'
      },
      {
        title: 'Partial Prerendering (PPR) Architecture',
        desc: 'Evaluate static shell caching combined with dynamic hole streaming.',
        type: 'learn',
        creator: 'Kenji Sato',
        handle: '@kenjisato',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        mins: 15
      },
      {
        title: 'Public Benchmark: TTFB Comparison',
        desc: 'Publish a micro-benchmark comparing standard SSR vs streaming RSC.',
        type: 'real_world_proof',
        creator: 'Kenji Sato',
        handle: '@kenjisato',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        mins: 15,
        artifact: 'Next.js PPR Performance Benchmark'
      }
    ]
  };

  const tasksTemplate = sprintBlueprints[skillTitle] || sprintBlueprints['System Architecture'];

  return {
    id: `sprint-${Date.now()}`,
    skillTitle,
    careerMilestone: milestone,
    durationDays: Math.min(durationDays, tasksTemplate.length),
    currentDay: 1,
    reshuffleCount: 0,
    mascotNarration: `Pip here! Ready to dive into ${skillTitle}? Let's conquer Day 1 with deliberate practice.`,
    tasks: tasksTemplate.slice(0, durationDays).map((item, idx) => ({
      id: `task-${Date.now()}-${idx + 1}`,
      dayNumber: idx + 1,
      title: item.title,
      description: item.desc,
      type: item.type,
      creatorName: item.creator,
      creatorHandle: item.handle,
      creatorAvatar: item.avatar,
      estimatedMinutes: item.mins,
      completed: false,
      producesArtifact: !!item.artifact,
      artifactTitle: item.artifact,
      artifactType: 'code'
    }))
  };
}

/**
 * Dynamic Roadmap Generator
 */
export function createDynamicRoadmap(skillTitle: string = 'System Architecture'): SkillRoadmap {
  return {
    skillId: skillTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    skillTitle,
    skillIcon: '⚡',
    currentStepIndex: 1,
    totalSteps: 2,
    milestones: [
      { id: 'm-1', title: 'Caching Foundations', stepNumber: 1, reached: true },
      { id: 'm-2', title: 'Atomic Distributed Mutex', stepNumber: 2, reached: false }
    ],
    steps: [
      {
        id: 'step-1',
        skillId: skillTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        stepNumber: 1,
        title: 'Core Fundamentals & Invalidation Patterns',
        description: 'Understand the mathematical boundaries and algorithmic strategies.',
        estimatedMinutes: 15,
        type: 'article',
        status: 'completed',
        completedAt: 'Yesterday',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'step-2',
        skillId: skillTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        stepNumber: 2,
        title: 'Implementation & Mutex Blueprint',
        description: 'Code working script and benchmark under concurrent test loads.',
        estimatedMinutes: 18,
        type: 'checklist',
        status: 'current',
        creatorName: 'Elena Rostova',
        creatorHandle: '@elena_distrib',
        creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      }
    ]
  };
}

/**
 * Fallback Initial State Objects
 */
export const initialUser: UserProfile = createDynamicUser('Alex Chen', 'alex@huddle.dev');

export const initialSkillsHealth: SkillHealth[] = createDynamicSkillsHealth([
  'System Architecture',
  'Next.js App Router',
  'TypeScript Type Mechanics',
  'Product UI & Micro-interactions'
]);

export const initialSprint: SprintChecklist = createDynamicSprint('System Architecture');

export const initialRoadmap: SkillRoadmap = createDynamicRoadmap('System Architecture');

export const initialSquad: MicroSquad = {
  id: 'squad-1',
  name: 'Distributed Systems Core',
  skillFocus: 'System Architecture',
  sharedGoal: 'Complete 12 focused practice tasks together this week with zero pressure',
  currentProgress: 7,
  targetProgress: 12,
  inviteCode: 'HUDDLE-4X9B',
  members: [
    {
      id: 'u-1',
      name: 'Alex Chen',
      handle: '@alexchen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      streak: 5,
      checkedInToday: true,
      recentEncouragement: 'Working on Redis Lua atomic locks today!',
      role: 'lead'
    },
    {
      id: 'u-2',
      name: 'Sarah Jenkins',
      handle: '@sarah_j',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      streak: 4,
      checkedInToday: true,
      recentEncouragement: 'Completed Postgres replication lag analysis.',
      role: 'member'
    },
    {
      id: 'u-3',
      name: 'David Kim',
      handle: '@davidk_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      streak: 6,
      checkedInToday: true,
      recentEncouragement: 'Benchmarked event queue backpressure handling.',
      role: 'member'
    },
    {
      id: 'u-4',
      name: 'Maya Patel',
      handle: '@mayadev',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      streak: 3,
      checkedInToday: false,
      recentEncouragement: 'Prepping for Day 3 task tonight.',
      role: 'member'
    }
  ],
  activityPings: [
    {
      id: 'ping-1',
      memberId: 'u-1',
      memberName: 'Alex Chen',
      memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      actionText: 'completed Day 1: Cache Stampede & Invalidation Patterns',
      timestamp: '15m ago',
      type: 'task_completed'
    },
    {
      id: 'ping-2',
      memberId: 'u-3',
      memberName: 'David Kim',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      actionText: 'checked in for daily focus practice (6-day streak)',
      timestamp: '1h ago',
      type: 'checkin'
    }
  ]
};

export const initialMacroSquad: MacroSquad = {
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
  milestoneUpdates: [
    {
      id: 'up-1',
      authorName: 'Liam Ross',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      milestoneTitle: 'Architected Multi-Region Read Replicas with <10ms sync lag',
      skillTag: 'System Architecture',
      timestamp: '2 hours ago',
      congratsCount: 8,
      userCongratulated: false
    },
    {
      id: 'up-2',
      authorName: 'Sofia Ramos',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      milestoneTitle: 'Merged first Open-Source ADR on Kafka Consumer Group balancing',
      skillTag: 'Distributed Messaging',
      timestamp: '5 hours ago',
      congratsCount: 14,
      userCongratulated: true
    }
  ]
};

export const initialPosts: CommunityPost[] = [
  {
    id: 'p-1',
    skillId: 'sys-arch',
    skillTitle: 'System Architecture',
    authorName: 'Sarah Jenkins',
    authorHandle: '@sarah_j',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    authorReputation: 420,
    title: 'Why we replaced Redis Distributed Locks with Atomic Lua Scripts',
    content: 'Standard lock acquisition with TTLs creates subtle race windows during GC pauses. Executing logic directly inside Redis via Lua guarantees atomicity without network ping-pong.',
    category: 'discussion',
    upvotes: 28,
    userUpvoted: true,
    repliesCount: 4,
    createdAt: '3 hours ago',
    replies: [
      {
        id: 'r-1',
        authorName: 'David Kim',
        authorHandle: '@davidk_dev',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        content: 'Great breakdown. We observed a 40% reduction in p99 latency when we moved counter increments to Lua.',
        createdAt: '1 hour ago',
        upvotes: 6,
        isHelpful: true
      }
    ]
  }
];

export const initialCreators: CreatorProfile[] = [
  {
    id: 'c-1',
    name: 'Elena Rostova',
    handle: '@elena_distrib',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    title: 'Principal Distributed Systems Architect',
    bio: 'Authoring practical blueprints on distributed caching, raft consensus, and high-throughput microservices.',
    followersCount: 14200,
    isFollowing: true,
    sponsorPartner: 'Khan Academy Partner',
    skillsTaught: ['System Architecture', 'Distributed Caching', 'Database Scaling'],
    playlists: [
      { id: 'pl-1', title: 'Distributed Systems Mastery', itemsCount: 4 }
    ],
    pinnedResources: [
      {
        id: 'res-1',
        title: 'Redis Lua Mutex Blueprint (.ts)',
        type: 'template',
        duration: '18m practice',
        url: 'https://github.com/elena/redis-lua-blueprints'
      }
    ]
  },
  {
    id: 'c-2',
    name: 'Marcus Vance',
    handle: '@marcus_vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    title: 'Staff Infrastructure Engineer',
    bio: 'Deep dives into PACELC theorem, CRDTs, and zero-downtime database migrations.',
    followersCount: 9800,
    isFollowing: false,
    sponsorPartner: 'Udemy Engineering Sponsor',
    skillsTaught: ['Database Engineering', 'Storage Engines'],
    playlists: [
      { id: 'pl-2', title: 'Database Internals', itemsCount: 3 }
    ],
    pinnedResources: [
      {
        id: 'res-2',
        title: 'Distributed Consensus Decision Tree (.pdf)',
        type: 'article',
        duration: '22m read',
        url: 'https://marcusvance.dev/downloads/consensus-tree.pdf'
      }
    ]
  }
];

export const initialCreatorPosts: CreatorPost[] = [
  {
    id: 'post-1',
    creatorId: 'c-1',
    creatorName: 'Elena Rostova',
    creatorHandle: '@elena_distrib',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    creatorTitle: 'Principal Architect @ CloudScale',
    sponsorBadge: 'Khan Academy Partner',
    skillTag: 'System Architecture',
    title: '3 Ways Redis Lua Scripts Prevent Race Conditions',
    description: 'Why standard transactions fail during high write concurrency, and how 6 lines of atomic Lua solve cache stampedes forever.',
    contentSnippet: '-- Redis Lua script for atomic get-and-refresh mutex\nlocal key = KEYS[1]\nlocal ttl = ARGV[1]\nlocal val = redis.call("GET", key)\nif not val then\n  redis.call("SET", key, "LOCKED", "EX", ttl)\n  return 1\nend\nreturn 0',
    duration: '18 mins read + build',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    resourceLinks: [
      { title: 'Download Production Redis Lua Mutex Blueprint (.ts)', url: 'https://github.com/elena/redis-lua-blueprints' }
    ],
    likesCount: 142,
    createdAt: 'Today'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'squad_checkin',
    title: 'Micro-Squad Goal Progress',
    description: 'Your squad reached 7/12 completed steps this week!',
    timestamp: '2 hours ago',
    read: false
  }
];

export const initialMascotMessages: MascotMessage[] = [
  {
    id: 'msg-1',
    context: 'dashboard',
    text: "Hey! Pip here. Ready for today's deliberate practice? No doomscroll guilt, just steady craft.",
    actionLabel: "Let's review Day 1 task",
    actionType: 'view_step'
  }
];

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Probabilistic Cache Early Expiration Benchmark',
    category: 'System Architecture',
    date: 'Yesterday',
    description: 'Benchmark comparing vanilla TTL vs XFetch probabilistic early recomputation algorithm under 10k RPS load.',
    artifactType: 'code',
    previewSnippet: `function xfetch(key, ttl, beta = 1.0, delta = 50) {\n  const [val, deltaCalc, expiry] = redis.get(key);\n  if (!val || (Date.now() - (delta * beta * Math.log(Math.random()))) >= expiry) {\n    const freshVal = recomputeExpensiveValue();\n    redis.set(key, freshVal, ttl);\n    return freshVal;\n  }\n  return val;\n}`,
    isPublished: true,
    sourceTaskId: 'task-1',
    tags: ['caching', 'redis', 'high-throughput']
  }
];

export const initialRealWorldProofs: RealWorldProofItem[] = [
  {
    id: 'proof-1',
    title: 'Merged PR: Redis Cache Invalidation Hook',
    description: 'Contributed lock-free probabilistic cache warming to open-source distributed cache framework.',
    category: 'open_source',
    date: 'Aug 28, 2026',
    completed: true,
    externalLink: 'https://github.com/example/cache-engine/pull/142',
    proofBadge: 'GitHub PR Merged'
  }
];

export const initialCareerTimeline: CareerTimelineEntry[] = [
  {
    id: 'tl-1',
    date: 'August 2026',
    type: 'sprint_cleared',
    title: 'Cleared 4-Day Distributed Caching Sprint',
    description: 'Mastered cache stampede mitigation, XFetch algorithms, and atomic Lua script execution.',
    badge: 'Milestone Achieved'
  }
];

export const sampleBingeQuiz: Record<string, {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}> = {
  'sys-arch': {
    question: 'How do atomic Lua scripts in Redis protect against cache stampedes?',
    options: [
      'By allocating more network memory',
      'By running atomically in a single thread without race condition interleaving',
      'By removing query timeouts',
      'By compressing binary logs'
    ],
    correctIndex: 1,
    explanation: 'Redis executes Lua scripts atomically, guaranteeing no other write operation can slip between read and update steps.'
  }
};
