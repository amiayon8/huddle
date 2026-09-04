import { MicroSquad, MacroSquad, SquadMember, SquadActivityPing, SquadProject } from '../types/huddle';

export const defaultSquadMembers: SquadMember[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    handle: '@alexchen.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    streak: 8,
    checkedInToday: false,
    lastCheckIn: 'Yesterday',
    recentEncouragement: 'Benchmarking early cache invalidation algorithms under load',
    role: 'lead',
    cheerCount: 4,
    submittedProject: false
  },
  {
    id: 'member-2',
    name: 'Elena Rostova',
    handle: '@erostova.sys',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    streak: 12,
    checkedInToday: true,
    lastCheckIn: '45 minutes ago',
    recentEncouragement: 'Verified idempotent message handler for Kafka consumer group',
    role: 'member',
    cheerCount: 9,
    submittedProject: true
  },
  {
    id: 'member-3',
    name: 'Marcus Vance',
    handle: '@marcus.infra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    streak: 6,
    checkedInToday: true,
    lastCheckIn: '2 hours ago',
    recentEncouragement: 'Drafted connection pooler ADR and failover checklist',
    role: 'member',
    cheerCount: 5,
    submittedProject: true
  },
  {
    id: 'member-4',
    name: 'Priya Patel',
    handle: '@priya.arch',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    streak: 9,
    checkedInToday: false,
    lastCheckIn: 'Yesterday',
    recentEncouragement: 'Tuning Bloom filter parameters for read-heavy edge nodes',
    role: 'member',
    cheerCount: 7,
    submittedProject: false
  }
];

export const defaultSquadProject: SquadProject = {
  id: 'proj-1',
  title: 'Team Blueprint: Distributed Systems Core',
  description: 'Design and review a fault-tolerant multi-region cache invalidation protocol with zero stale reads under network partitions.',
  deadline: 'Sunday, 11:59 PM',
  status: 'in_progress',
  submissionsCount: 2,
  totalMembers: 4,
  deliverables: [
    {
      memberId: 'member-2',
      memberName: 'Elena Rostova',
      memberAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      title: 'CDC Cache Invalidation Topology',
      notes: 'Implemented Debezium Postgres CDC pipeline publishing cache eviction events to regional Kafka clusters.',
      link: 'https://github.com/huddle-org/cache-cdc-rfc',
      timestamp: 'Yesterday at 4:15 PM'
    },
    {
      memberId: 'member-3',
      memberName: 'Marcus Vance',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Redis Cluster Split-Brain Benchmark',
      notes: 'Measured p99 read latencies and failover recovery windows during simulated partition events.',
      link: 'https://github.com/huddle-org/redis-benchmark',
      timestamp: 'Today at 10:30 AM'
    }
  ]
};

export const defaultActivityPings: SquadActivityPing[] = [
  {
    id: 'ping-1',
    memberId: 'member-2',
    memberName: 'Elena Rostova',
    memberAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    actionText: 'checked in: "Verified idempotent message handler for Kafka consumer group"',
    timestamp: '45m ago',
    type: 'checkin'
  },
  {
    id: 'ping-2',
    memberId: 'member-3',
    memberName: 'Marcus Vance',
    memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    actionText: 'submitted deliverable to Team Blueprint',
    timestamp: '2h ago',
    type: 'project_submission'
  },
  {
    id: 'ping-3',
    memberId: 'member-2',
    memberName: 'Elena Rostova',
    memberAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    actionText: 'sent a high-five to Marcus Vance',
    timestamp: '3h ago',
    type: 'cheer'
  },
  {
    id: 'ping-4',
    memberId: 'user-1',
    memberName: 'Alex Chen',
    memberAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    actionText: 'completed Day 1 deliberate practice: Probabilistic Cache Expiration',
    timestamp: 'Yesterday',
    type: 'task_completed'
  }
];

export const defaultMicroSquad: MicroSquad = {
  id: 'squad-1',
  name: 'Distributed Systems Core',
  skillFocus: 'System Architecture',
  sharedGoal: 'Complete 12 focused practice tasks together this week with zero pressure',
  currentProgress: 8,
  targetProgress: 12,
  inviteCode: 'HUDDLE-4X9B',
  members: defaultSquadMembers,
  activityPings: defaultActivityPings,
  activeProject: defaultSquadProject
};

export const defaultMacroSquad: MacroSquad = {
  id: 'macro-1',
  name: 'Global Backend & Systems Circle',
  description: 'A global macro circle of 38 engineers mastering distributed backend systems, event meshes, and resilient databases.',
  trackCategory: 'System Architecture',
  membersCount: 38,
  members: [
    {
      id: 'm-1',
      name: 'Liam Ross',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      title: 'Principal Engineer',
      skillsFocus: ['System Architecture', 'Kafka']
    },
    {
      id: 'm-2',
      name: 'Sophia Kim',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      title: 'Staff Database Architect',
      skillsFocus: ['Postgres', 'Distributed Storage']
    },
    {
      id: 'm-3',
      name: 'David O\'Connor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      title: 'Senior Infrastructure Engineer',
      skillsFocus: ['Kubernetes', 'Edge Systems']
    }
  ],
  milestoneUpdates: [
    {
      id: 'macro-up-1',
      authorName: 'Sarah Jenkins',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      milestoneTitle: 'Achieved zero downtime migration across 4 million Postgres records using logical replication slots',
      skillTag: 'System Architecture',
      timestamp: '2 hours ago',
      congratsCount: 18,
      userCongratulated: false
    },
    {
      id: 'macro-up-2',
      authorName: 'David O\'Connor',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      milestoneTitle: 'Published RFC on Raft consensus implementation for multi-region coordination',
      skillTag: 'Distributed Systems',
      timestamp: '4 hours ago',
      congratsCount: 24,
      userCongratulated: true
    },
    {
      id: 'macro-up-3',
      authorName: 'Sophia Kim',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      milestoneTitle: 'Benchmarked RocksDB LSM write amplification under sustained 50k write operations per second',
      skillTag: 'Storage Engines',
      timestamp: '6 hours ago',
      congratsCount: 31,
      userCongratulated: false
    },
    {
      id: 'macro-up-4',
      authorName: 'Tariq Mansoor',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      milestoneTitle: 'Implemented Next.js streaming Server Components with optimistic mutation boundaries',
      skillTag: 'Next.js Full-Stack',
      timestamp: '8 hours ago',
      congratsCount: 14,
      userCongratulated: false
    }
  ]
};

export const presetAvailableSquads: MicroSquad[] = [
  defaultMicroSquad,
  {
    id: 'squad-2',
    name: 'Next.js App Router Collective',
    skillFocus: 'Next.js Full-Stack',
    sharedGoal: 'Ship 15 server component production patterns and caching audits this week',
    currentProgress: 11,
    targetProgress: 15,
    inviteCode: 'HUDDLE-NEXT',
    members: [
      {
        id: 'next-1',
        name: 'Carlos Mendez',
        handle: '@carlos.next',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        streak: 14,
        checkedInToday: true,
        lastCheckIn: '1 hour ago',
        recentEncouragement: 'Configured partial prerendering with parallel routes',
        role: 'lead',
        cheerCount: 11,
        submittedProject: true
      },
      {
        id: 'next-2',
        name: 'Amina Diallo',
        handle: '@amina.dev',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        streak: 8,
        checkedInToday: true,
        lastCheckIn: '3 hours ago',
        recentEncouragement: 'Benchmarked Server Actions vs Route Handlers payload size',
        role: 'member',
        cheerCount: 6,
        submittedProject: true
      },
      {
        id: 'next-3',
        name: 'Kenji Sato',
        handle: '@kenji.fullstack',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        streak: 5,
        checkedInToday: false,
        lastCheckIn: 'Yesterday',
        recentEncouragement: 'Refactoring auth middleware to use edge session cookies',
        role: 'member',
        cheerCount: 3,
        submittedProject: false
      }
    ],
    activityPings: [
      {
        id: 'ping-next-1',
        memberId: 'next-1',
        memberName: 'Carlos Mendez',
        memberAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        actionText: 'checked in: "Configured partial prerendering with parallel routes"',
        timestamp: '1h ago',
        type: 'checkin'
      }
    ],
    activeProject: {
      id: 'proj-next',
      title: 'Full-Stack Performance Audit',
      description: 'Audit bundle size and cache hit ratio on Next.js 15 production deployments.',
      deadline: 'Sunday, 11:59 PM',
      status: 'in_progress',
      submissionsCount: 2,
      totalMembers: 4,
      deliverables: [
        {
          memberId: 'next-1',
          memberName: 'Carlos Mendez',
          memberAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          title: 'Route Cache Elimination Benchmark',
          notes: 'Reduced TTFB by 42ms through selective segment cache tagging.',
          timestamp: 'Yesterday at 3:00 PM'
        }
      ]
    }
  },
  {
    id: 'squad-3',
    name: 'TypeScript Compiler & Typecraft',
    skillFocus: 'TypeScript Core',
    sharedGoal: 'Complete 10 type-level algorithms and conditional infer challenges',
    currentProgress: 7,
    targetProgress: 10,
    inviteCode: 'HUDDLE-TS99',
    members: [
      {
        id: 'ts-1',
        name: 'Rachel Rivera',
        handle: '@rrivera.types',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        streak: 19,
        checkedInToday: true,
        lastCheckIn: '30m ago',
        recentEncouragement: 'Constructed recursive tuple pattern matcher with tail recursion',
        role: 'lead',
        cheerCount: 15,
        submittedProject: true
      },
      {
        id: 'ts-2',
        name: 'Liam Chen',
        handle: '@liam.typecraft',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        streak: 4,
        checkedInToday: false,
        lastCheckIn: 'Yesterday',
        recentEncouragement: 'Solving distributive conditional union propagation issues',
        role: 'member',
        cheerCount: 2,
        submittedProject: false
      }
    ],
    activityPings: [
      {
        id: 'ping-ts-1',
        memberId: 'ts-1',
        memberName: 'Rachel Rivera',
        memberAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        actionText: 'checked in: "Constructed recursive tuple pattern matcher"',
        timestamp: '30m ago',
        type: 'checkin'
      }
    ]
  }
];
