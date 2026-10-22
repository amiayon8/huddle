import {
  Community,
  CommunityPost,
  SquadDiscussionMessage,
} from "../types/huddle";
import { getGravatarUrl } from "./gravatar";

export const defaultCommunities: Community[] = [
  {
    id: "comm-arch",
    name: "Software Architecture & System Design",
    slug: "software-architecture",
    description:
      "A forum for engineers discussing high-throughput distributed architectures, domain-driven design, and system resilience.",
    category: "Architecture",
    memberCount: 382,
    isJoined: true,
    tags: ["System Design", "Microservices", "Scalability", "Event-Driven"],
  },
  {
    id: "comm-frontend",
    name: "Frontend Architecture & Web Performance",
    slug: "frontend-architecture",
    description:
      "Deep discussions on modern component state pipelines, rendering strategies, core web vitals, and design systems.",
    category: "Frontend",
    memberCount: 294,
    isJoined: true,
    tags: ["React", "Next.js", "Performance", "Design Systems"],
  },
  {
    id: "comm-distributed",
    name: "Distributed Systems & Cloud Infrastructure",
    slug: "distributed-systems",
    description:
      "Exploring consensus algorithms, fault-tolerance, Raft, Kafka pipelines, and containerized cloud platforms.",
    category: "Infrastructure",
    memberCount: 218,
    isJoined: false,
    tags: ["Distributed Systems", "Kubernetes", "Kafka", "Cloud Native"],
  },
  {
    id: "comm-ai",
    name: "AI Engineering & Agentic Workflows",
    slug: "ai-engineering",
    description:
      "Architectural trade-offs of autonomous agent loops, prompt engineering chains, evaluation harnesses, and vector retrieval.",
    category: "AI & ML",
    memberCount: 341,
    isJoined: false,
    tags: ["LLM Agents", "Vector Search", "RAG", "Model Evaluation"],
  },
  {
    id: "comm-data",
    name: "Database Internals & Storage Engines",
    slug: "database-internals",
    description:
      "Storage engines, LSM trees, B-Trees, transaction isolation levels, and write-ahead logging under heavy concurrent loads.",
    category: "Data",
    memberCount: 165,
    isJoined: false,
    tags: ["PostgreSQL", "Storage Engines", "Transactions", "Query Optimization"],
  },
];

export const defaultCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    skillId: "system-architecture",
    skillTitle: "Software Architecture",
    communityId: "comm-arch",
    communityName: "Software Architecture & System Design",
    authorName: "Sarah Chen",
    authorHandle: "@sarah.chen",
    authorAvatar: getGravatarUrl("sarah.chen.arch@example.com", 72),
    authorReputation: 480,
    category: "discussion",
    title:
      "Dual-write problem: Outbox pattern with Debezium vs Listen/Notify for CDC?",
    content:
      "We are splitting our legacy monolith into separate account and billing services. When recording a state change and broadcasting an event, we need guaranteed delivery without distributed two-phase commits. Have you had better operational stability relying on the transactional outbox pattern via Debezium CDC, or utilizing native PostgreSQL listen/notify with a polling fallback?",
    tags: ["System Design", "Microservices", "PostgreSQL"],
    createdAt: "2 hours ago",
    upvotes: 24,
    userUpvoted: false,
    repliesCount: 2,
    replies: [
      {
        id: "rep-1",
        authorName: "Marcus Vance",
        authorHandle: "@marcus.vance",
        authorAvatar: getGravatarUrl("marcus.vance@example.com", 72),
        content:
          "In production, outbox with Debezium reading the WAL log has been significantly more resilient for us. Listen/notify can drop messages if the receiver drops connection during network partitions. The outbox table guarantees at-least-once delivery.",
        createdAt: "1 hour ago",
        upvotes: 12,
        isHelpful: true,
      },
      {
        id: "rep-2",
        authorName: "Ayon",
        authorHandle: "@sarkerayon",
        authorAvatar: getGravatarUrl("ayon.dev@example.com", 72),
        content:
          "Agreed on transactional outbox. Just remember to pair it with idempotent consumer handlers on the receiver side since at-least-once delivery will produce duplicates under retry spikes.",
        createdAt: "35 mins ago",
        upvotes: 8,
        isHelpful: false,
      },
    ],
  },
  {
    id: "post-2",
    skillId: "frontend-architecture",
    skillTitle: "Frontend Architecture",
    communityId: "comm-frontend",
    communityName: "Frontend Architecture & Web Performance",
    authorName: "Elena Rostova",
    authorHandle: "@elena.rostova",
    authorAvatar: getGravatarUrl("elena.rostova@example.com", 72),
    authorReputation: 320,
    category: "question",
    title:
      "How are you structuring optimistic mutations with offline synchronization in React 19?",
    content:
      "When building deliberate practice tools where learners want instant feedback on checkbox completions or rating updates, what pattern gives the cleanest rollback when the server returns a 422 or 500 error? Are you managing this at the query layer with TanStack Query cache rollbacks or localized useOptimistic hooks?",
    tags: ["React", "Performance", "State Management"],
    createdAt: "4 hours ago",
    upvotes: 19,
    userUpvoted: false,
    repliesCount: 1,
    replies: [
      {
        id: "rep-3",
        authorName: "Kenji Sato",
        authorHandle: "@kenji.sato",
        authorAvatar: getGravatarUrl("kenji.sato@example.com", 72),
        content:
          "React 19 useOptimistic combined with server actions handles the single component case well. For cross-page state like navigation badge counters, query cache manipulation with an explicit onMutate rollback snapshot remains the most reliable.",
        createdAt: "2 hours ago",
        upvotes: 7,
        isHelpful: true,
      },
    ],
  },
  {
    id: "post-3",
    skillId: "system-architecture",
    skillTitle: "Software Architecture",
    communityId: "comm-arch",
    communityName: "Software Architecture & System Design",
    authorName: "David Miller",
    authorHandle: "@david.miller",
    authorAvatar: getGravatarUrl("david.miller.systems@example.com", 72),
    authorReputation: 610,
    category: "idea",
    title:
      "Proposal: Zero-penalty reshuffling as an architectural standard for developer education",
    content:
      "Most learning management systems penalize adult professionals when unexpected on-call emergencies disrupt a streak. By decoupling the milestone sequence from hard calendar dates and using relative pacing offsets, we preserve momentum without artificial shame loops. Here is the contract schema we designed for Huddle.",
    tags: ["Scalability", "Design Systems"],
    createdAt: "Yesterday",
    upvotes: 42,
    userUpvoted: true,
    repliesCount: 1,
    replies: [
      {
        id: "rep-4",
        authorName: "Sarah Chen",
        authorHandle: "@sarah.chen",
        authorAvatar: getGravatarUrl("sarah.chen.arch@example.com", 72),
        content:
          "This shift in mental model is brilliant. Gamification often optimizes for anxiety rather than genuine competence. Relative milestone pacing respects real engineering workflows.",
        createdAt: "Yesterday",
        upvotes: 15,
        isHelpful: true,
      },
    ],
  },
  {
    id: "post-4",
    skillId: "distributed-systems",
    skillTitle: "Distributed Systems",
    communityId: "comm-distributed",
    communityName: "Distributed Systems & Cloud Infrastructure",
    authorName: "Alexander Lindqvist",
    authorHandle: "@alex.lindqvist",
    authorAvatar: getGravatarUrl("alex.lindqvist@example.com", 72),
    authorReputation: 290,
    category: "showcase",
    title:
      "Proof of Concept: Raft consensus simulator running entirely in WebAssembly",
    content:
      "Built an interactive visual debugger that simulates leader election, log replication, and split-brain network partitions with 5 virtual nodes running client-side WASM. Would love peer feedback on our heartbeat timeout visualizations.",
    tags: ["Distributed Systems", "Raft", "WASM"],
    createdAt: "2 days ago",
    upvotes: 56,
    userUpvoted: false,
    repliesCount: 0,
    replies: [],
  },
];

export const defaultSquadDiscussions: SquadDiscussionMessage[] = [
  {
    id: "disc-1",
    senderId: "member-2",
    senderName: "Rahat Chowdhury",
    senderAvatar: getGravatarUrl("rahat.infra@example.com", 72),
    message:
      "Cleared Day 2 milestone on competitive moats and submitted proof! How is everyone pacing for today?",
    timestamp: "2 hours ago",
    type: "standup",
  },
  {
    id: "disc-2",
    senderId: "member-3",
    senderName: "Nusrat Jahan",
    senderAvatar: getGravatarUrl("nusrat.jahan@example.com", 72),
    message:
      "Stuck on the cache invalidation edge case in Task 2. Spark suggested using timestamp fences. Reviewing now.",
    timestamp: "1 hour ago",
    type: "blocker",
  },
  {
    id: "disc-3",
    senderId: "user-me",
    senderName: "Ayon",
    senderAvatar: getGravatarUrl("ayon.dev@example.com", 72),
    message:
      "Timestamp fences work well there. Make sure to account for clock skew across the database nodes.",
    timestamp: "30 mins ago",
    type: "message",
  },
];
