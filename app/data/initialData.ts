import { 
  UserProfile, 
  SkillHealth, 
  SkillRoadmap, 
  MicroSquad, 
  CommunityPost, 
  CreatorProfile, 
  NotificationItem,
  MascotMessage
} from '../types/huddle';

export const initialUser: UserProfile = {
  id: 'u-1',
  name: 'Alex Rivera',
  handle: '@alexrivera',
  email: 'alex@huddle.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  bio: 'Building resilient backend systems and micro-interactions. Learning System Architecture and Modern React.',
  streak: 5,
  maxStreak: 14,
  reputation: 340,
  squadId: 'sq-1',
  onboardingCompleted: true,
  joinedDate: 'October 2025',
  privacy: {
    showStreak: true,
    showSquad: true,
    showReputation: true,
    publicProfile: true,
  }
};

export const initialSkillsHealth: SkillHealth[] = [
  {
    skillId: 'sys-arch',
    skillTitle: 'System Architecture',
    category: 'Engineering',
    healthPercent: 88,
    decayRate: '-2% / day',
    lastPracticed: 'Today',
    status: 'optimal',
  },
  {
    skillId: 'next-rsc',
    skillTitle: 'Next.js App Router & RSC',
    category: 'Frontend',
    healthPercent: 94,
    decayRate: '-1% / day',
    lastPracticed: 'Yesterday',
    status: 'optimal',
  },
  {
    skillId: 'ts-type-mechanics',
    skillTitle: 'TypeScript Type Mechanics',
    category: 'Languages',
    healthPercent: 62,
    decayRate: '-4% / day',
    lastPracticed: '4 days ago',
    status: 'decaying',
  },
  {
    skillId: 'ui-micro',
    skillTitle: 'Product UI & Micro-interactions',
    category: 'Design',
    healthPercent: 78,
    decayRate: '-2% / day',
    lastPracticed: '2 days ago',
    status: 'maintaining',
  }
];

export const initialRoadmap: SkillRoadmap = {
  skillId: 'sys-arch',
  skillTitle: 'System Architecture',
  skillIcon: 'Cpu',
  currentStepIndex: 2,
  totalSteps: 6,
  milestones: [
    { id: 'm-1', title: 'Caching Foundations', stepNumber: 1, reached: true },
    { id: 'm-2', title: 'Event-Driven Patterns', stepNumber: 3, reached: false },
    { id: 'm-3', title: 'Database Partitioning', stepNumber: 5, reached: false },
    { id: 'm-4', title: 'Zero-Downtime Deployments', stepNumber: 6, reached: false }
  ],
  steps: [
    {
      id: 'step-1',
      skillId: 'sys-arch',
      stepNumber: 1,
      title: 'Core Trade-offs in Distributed Caching',
      description: 'Understand cache invalidation strategies, read-through vs write-behind patterns, and evicted key policies.',
      estimatedMinutes: 15,
      type: 'article',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      contentMarkdown: `### Distributed Caching Best Practices\n\nWhen scaling backend microservices, Redis or Memcached serve as the primary caching tier. Key decisions involve balancing latency against consistency.\n\n* **Write-Through Caching**: Ensures database and cache are updated simultaneously, providing strong read consistency at the cost of higher write latency.\n* **Write-Behind (Write-Back)**: Acknowledges writes immediately to cache while async workers persist data asynchronously to primary storage.\n* **Cache Stamps & Thundering Herd**: Mitigate stampedes by using probabilistic early expiration or mutex locks during cache misses.`,
      status: 'completed',
      completedAt: 'Yesterday'
    },
    {
      id: 'step-2',
      skillId: 'sys-arch',
      stepNumber: 2,
      title: 'Rate Limiting Algorithms & Sliding Windows',
      description: 'Compare Token Bucket, Leaky Bucket, and Fixed Window algorithms for high-throughput public APIs.',
      estimatedMinutes: 20,
      type: 'checklist',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      checklistItems: [
        { id: 'c-1', text: 'Evaluate memory overhead of sliding window log vs sliding window counter', completed: true },
        { id: 'c-2', text: 'Implement Redis atomic script for burst protection', completed: true },
        { id: 'c-3', text: 'Configure rate limit headers (X-RateLimit-Remaining, Retry-After)', completed: true }
      ],
      status: 'completed',
      completedAt: 'Yesterday'
    },
    {
      id: 'step-3',
      skillId: 'sys-arch',
      stepNumber: 3,
      title: 'Event-Driven Architecture with Message Queues',
      description: 'Implement idempotent event consumers using RabbitMQ/Kafka patterns to ensure at-least-once message delivery.',
      estimatedMinutes: 18,
      type: 'article',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      contentMarkdown: `### Designing Idempotent Message Consumers\n\nIn event-driven systems, network retries make duplicate message delivery inevitable. To maintain data integrity, every queue consumer must be idempotent.\n\n#### Key Principles:\n1. **Deduplication Keys**: Store unique event UUIDs in Redis with TTL before processing payload.\n2. **Outbox Pattern**: Avoid dual-write race conditions by writing domain state changes and outbox events inside a single SQL transaction.\n3. **Dead Letter Queues**: Route unhandled exceptions after N retries to DLQ for manual inspection and telemetry reporting.`,
      checklistItems: [
        { id: 'c-4', text: 'Understand Outbox Pattern dual-write prevention', completed: false },
        { id: 'c-5', text: 'Define Dead Letter Queue retry backoff thresholds', completed: false },
        { id: 'c-6', text: 'Verify idempotent consumer database constraint check', completed: false }
      ],
      resourceUrl: 'https://github.com/huddle-samples/event-driven-patterns',
      status: 'current'
    },
    {
      id: 'step-4',
      skillId: 'sys-arch',
      stepNumber: 4,
      title: 'Sharding & Database Read Replicas',
      description: 'Master horizontal database partition keys, replica lag handling, and query routing strategies.',
      estimatedMinutes: 25,
      type: 'video',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      status: 'upcoming'
    },
    {
      id: 'step-5',
      skillId: 'sys-arch',
      stepNumber: 5,
      title: 'Zero-Downtime Schema Migrations',
      description: 'Execute Expand-Contract migration patterns safely on active production databases without locking queries.',
      estimatedMinutes: 22,
      type: 'checklist',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      status: 'upcoming'
    },
    {
      id: 'step-6',
      skillId: 'sys-arch',
      stepNumber: 6,
      title: 'Capstone: Resilient Architecture Peer Review',
      description: 'Submit an architectural decision record (ADR) for peer feedback in your Micro-Squad.',
      estimatedMinutes: 30,
      type: 'resource',
      creatorName: 'Elena Rostova',
      creatorHandle: '@elenarostova',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      status: 'upcoming'
    }
  ]
};

export const initialSquad: MicroSquad = {
  id: 'sq-1',
  name: 'Async Engineers',
  skillFocus: 'System Architecture',
  members: [
    {
      id: 'u-1',
      name: 'Alex Rivera',
      handle: '@alexrivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      streak: 5,
      checkedInToday: true,
      lastCheckIn: '10:15 AM Today',
      recentEncouragement: 'Focused on Event-Driven Queues today!',
      role: 'member'
    },
    {
      id: 'u-2',
      name: 'Maya Lin',
      handle: '@mayacodes',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      streak: 12,
      checkedInToday: true,
      lastCheckIn: '1 hour ago',
      recentEncouragement: 'Solid progress on Redis sliding window implementation.',
      role: 'lead'
    },
    {
      id: 'u-3',
      name: 'David Kim',
      handle: '@davidk',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      streak: 6,
      checkedInToday: true,
      lastCheckIn: '3 hours ago',
      recentEncouragement: 'Just completed step 2 checklist!',
      role: 'member'
    },
    {
      id: 'u-4',
      name: 'Samira Patel',
      handle: '@samirap',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
      streak: 3,
      checkedInToday: false,
      lastCheckIn: 'Yesterday 4:30 PM',
      role: 'member'
    }
  ],
  sharedGoal: 'Complete 16 total step milestones together this week',
  currentProgress: 11,
  targetProgress: 16,
  inviteCode: 'HUDDLE-ASYNC-882'
};

export const initialPosts: CommunityPost[] = [
  {
    id: 'post-1',
    skillId: 'sys-arch',
    skillTitle: 'System Architecture',
    authorName: 'David Kim',
    authorHandle: '@davidk',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    authorReputation: 210,
    title: 'How are you handling connection pooling with Serverless Postgres in Next.js App Router?',
    content: 'We noticed connection exhaustion during traffic bursts when running database queries inside Server Components without a dedicated proxy like PgBouncer or Supabase Transaction Pooler. What pool max sizes are you configuring in production?',
    category: 'question',
    upvotes: 18,
    userUpvoted: false,
    repliesCount: 3,
    isSolved: true,
    createdAt: '2 hours ago',
    replies: [
      {
        id: 'rep-1',
        authorName: 'Elena Rostova',
        authorHandle: '@elenarostova',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        content: 'For serverless environments, avoid direct TCP connections per request. Use HTTP API proxies or transaction poolers with a strict max allocation of 10 to 15 connections per cluster node, coupled with explicit client timeouts.',
        createdAt: '1 hour ago',
        upvotes: 14,
        isHelpful: true
      },
      {
        id: 'rep-2',
        authorName: 'Alex Rivera',
        authorHandle: '@alexrivera',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        content: 'We configured Prisma/Drizzle with connection string parameters `connection_limit=10&pool_timeout=15` and it stabilized our error rate during warm instance scaling.',
        createdAt: '45 mins ago',
        upvotes: 5,
        isHelpful: false
      }
    ]
  },
  {
    id: 'post-2',
    skillId: 'next-rsc',
    skillTitle: 'Next.js App Router & RSC',
    authorName: 'Marcus Vance',
    authorHandle: '@marcusvance',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    authorReputation: 890,
    title: 'Clean architecture pattern for domain-driven folder structures in App Router',
    content: 'Instead of nesting everything inside app/(routes), separate pure business logic into features/ or modules/ directories. Keep app/ strictly for route definitions, layout assembly, and page metadata declarations.',
    category: 'tip',
    upvotes: 42,
    userUpvoted: true,
    repliesCount: 5,
    createdAt: '5 hours ago'
  },
  {
    id: 'post-3',
    skillId: 'ts-type-mechanics',
    skillTitle: 'TypeScript Type Mechanics',
    authorName: 'Maya Lin',
    authorHandle: '@mayacodes',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    authorReputation: 450,
    title: 'Reviewing a template literal type helper for strongly typed event emitters',
    content: 'Looking for input on this utility type `EventPayload<TDomain, TAction>` that parses snake_case strings into structured payload interfaces without losing strict type narrowing.',
    category: 'code-review',
    upvotes: 24,
    userUpvoted: false,
    repliesCount: 4,
    createdAt: '1 day ago'
  }
];

export const initialCreators: CreatorProfile[] = [
  {
    id: 'cr-1',
    name: 'Elena Rostova',
    handle: '@elenarostova',
    title: 'Principal Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    bio: 'Architecting distributed platforms for high-load systems. Writing concise guides on fault-tolerance, caching, and database scaling.',
    followersCount: 14200,
    isFollowing: true,
    skillsTaught: ['System Architecture', 'Distributed Systems', 'Database Scaling'],
    pinnedResources: [
      { id: 'r-1', title: 'The System Architecture Playbook: Microservices & Event Loops', type: 'article', duration: '12 min read' },
      { id: 'r-2', title: 'Redis Cache Stampede Mitigation Template', type: 'template', duration: 'Code Snippet', downloadsCount: 1430 },
      { id: 'r-3', title: 'Designing High-Availability Message Queues', type: 'video', duration: '18 min video' }
    ],
    playlists: [
      { id: 'pl-1', title: 'Distributed Systems Essentials', itemsCount: 8 },
      { id: 'pl-2', title: 'Zero-Downtime DB Migrations', itemsCount: 5 }
    ]
  },
  {
    id: 'cr-2',
    name: 'Marcus Vance',
    handle: '@marcusvance',
    title: 'Next.js & Frontend Craftsman',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bio: 'Building production Next.js apps with clean layout boundaries, crisp typography, and zero layout shift.',
    followersCount: 9800,
    isFollowing: true,
    skillsTaught: ['Next.js App Router', 'React Performance', 'Tailwind Systems'],
    pinnedResources: [
      { id: 'r-4', title: 'Server Actions vs Route Handlers Decision Matrix', type: 'article', duration: '8 min read' },
      { id: 'r-5', title: 'Framer Motion Layout Animations Starter', type: 'template', duration: 'Component Kit', downloadsCount: 2890 }
    ],
    playlists: [
      { id: 'pl-3', title: 'React Server Components Masterclass', itemsCount: 6 }
    ]
  },
  {
    id: 'cr-3',
    name: 'Sarah Chen',
    handle: '@sarahchen',
    title: 'Staff Product Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Crafting calm, human-centric software interfaces with restrained aesthetic discipline.',
    followersCount: 18500,
    isFollowing: false,
    skillsTaught: ['Product UI & Micro-interactions', 'Design Systems', 'UX Writing'],
    pinnedResources: [
      { id: 'r-6', title: 'Micro-interaction Timing & Easing Curves', type: 'article', duration: '6 min read' }
    ],
    playlists: [
      { id: 'pl-4', title: 'Typography & Spacing Disciplines', itemsCount: 4 }
    ]
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'squad_checkin',
    title: 'Maya Lin checked in',
    description: 'Maya completed step task in Async Engineers squad.',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'n-2',
    type: 'next_step',
    title: 'Your next step is ready',
    description: 'Event-Driven Architecture with Message Queues (18 mins).',
    timestamp: '3 hours ago',
    read: false
  },
  {
    id: 'n-3',
    type: 'creator_post',
    title: 'Elena Rostova published a guide',
    description: 'Redis Cache Stampede Mitigation Template is now available.',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'n-4',
    type: 'milestone',
    title: 'Caching Foundations Reached',
    description: 'You unlocked the Caching Foundations milestone badge.',
    timestamp: '2 days ago',
    read: true
  }
];

export const initialMascotMessages: MascotMessage[] = [
  {
    id: 'm-dash',
    context: 'dashboard',
    text: 'You are on a 5-day streak. Your next step is Event-Driven Architecture with Message Queues.',
    suggestionText: 'Want to complete this 18-minute session now?',
    actionLabel: 'Take the next step',
    actionType: 'view_step'
  },
  {
    id: 'm-pace',
    context: 'journey',
    text: 'You are moving faster than expected this week. Would you like to adjust tomorrow session duration?',
    suggestionText: 'Reduce tomorrow session from 25m to 15m.',
    actionLabel: 'Shorten session',
    actionType: 'shorten_session'
  },
  {
    id: 'm-squad',
    context: 'squad',
    text: 'Your squad has been active today. 3 out of 4 members checked in.',
    suggestionText: 'Samira has not checked in yet today. Send a quick warm encouragement nudge?',
    actionLabel: 'Send gentle nudge',
    actionType: 'squad_nudge'
  }
];
