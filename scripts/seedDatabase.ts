import { createClient } from "@supabase/supabase-js";
import {
  getVideoLessonForTask,
  getCourseSectionsForTask,
  getKnowledgeCheckForTask,
} from "../app/lib/practiceCourseContent";
import {
  getPracticeSessionForTask,
  PracticeSessionContent,
} from "../app/lib/practiceSessions";
import { SprintTask } from "../app/types/huddle";
import {
  defaultSquadMembers,
  defaultSquadProject,
  defaultActivityPings,
  presetAvailableSquads,
} from "../app/lib/defaultSquadData";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://puusreiewwibbegrznli.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXNyZWlld3dpYmJlZ3J6bmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDYyNzEsImV4cCI6MjEwMzgyMjI3MX0.Bm13Uz3Pxt2Jrd_BufqC4Wx7g6mai4-dZ872VCibvm8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const avatarMap: Record<string, string> = {
  "Alex Chen": "/avatars/avatar-1.svg",
  "Elena Rostova": "/avatars/avatar-2.svg",
  "Marcus Vance": "/avatars/avatar-3.svg",
  "Priya Patel": "/avatars/avatar-4.svg",
  "Carlos Mendez": "/avatars/avatar-5.svg",
  "Amina Diallo": "/avatars/avatar-6.svg",
  "Kenji Sato": "/avatars/avatar-7.svg",
  "Rachel Rivera": "/avatars/avatar-8.svg",
  "Liam Chen": "/avatars/avatar-5.svg",
  "Sarah Jenkins": "/avatars/avatar-4.svg",
  "David Kim": "/avatars/avatar-3.svg",
  "Maya Patel": "/avatars/avatar-2.svg",
};

function sanitizeAvatar(name: string, fallbackIndex: number = 1): string {
  if (avatarMap[name]) return avatarMap[name];
  return `/avatars/avatar-${((fallbackIndex - 1) % 8) + 1}.svg`;
}

const trackSkills = [
  { id: "system_architecture", title: "System Architecture" },
  { id: "nextjs", title: "Next.js App Router" },
  { id: "typescript", title: "TypeScript Core" },
  { id: "ui_engineering", title: "UI Engineering & Design Systems" },
];

async function seedTaskTemplates() {
  const templates: any[] = [
    {
      id: "template-sys-1",
      skill_category: "System Architecture",
      day_number: 1,
      title: "Probabilistic Early Cache Expiration",
      description:
        "Implement optimal TTL recomputation and stochastic XFetch invalidation algorithms under high read contention.",
      task_type: "learn",
      creator_name: "Elena Rostova",
      creator_handle: "@erostova.sys",
      creator_avatar: "/avatars/avatar-2.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Probabilistic Cache Expiration Algorithm",
      artifact_type: "code",
      real_world_action_description:
        "Review production Redis cache hit-ratios and draft early recomputation thresholds.",
    },
    {
      id: "template-sys-2",
      skill_category: "System Architecture",
      day_number: 2,
      title: "Idempotent Event Stream Ingestion",
      description:
        "Architect deduplication windowing and transactional outbox patterns for at-least-once distributed messaging.",
      task_type: "build",
      creator_name: "Marcus Vance",
      creator_handle: "@marcus.infra",
      creator_avatar: "/avatars/avatar-3.svg",
      estimated_minutes: 25,
      produces_artifact: true,
      artifact_title: "Idempotent Message Handler Specification",
      artifact_type: "code",
      real_world_action_description:
        "Audit Kafka consumer group commit strategies and idempotency key retention policies.",
    },
    {
      id: "template-sys-3",
      skill_category: "System Architecture",
      day_number: 3,
      title: "Distributed Transaction Compensation",
      description:
        "Implement asynchronous Saga orchestrators and reverse-compensation workflows across isolated microservices.",
      task_type: "audit",
      creator_name: "Elena Rostova",
      creator_handle: "@erostova.sys",
      creator_avatar: "/avatars/avatar-2.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Distributed Saga Orchestration Engine",
      artifact_type: "diagram",
      real_world_action_description:
        "Construct compensation state machines for mission-critical checkout flows.",
    },
    {
      id: "template-sys-4",
      skill_category: "System Architecture",
      day_number: 4,
      title: "Multi-Region Consistency RFC Audit",
      description:
        "Review architecture decision records for conflict-free replicated data types (CRDTs) under network partitions.",
      task_type: "audit",
      creator_name: "Marcus Vance",
      creator_handle: "@marcus.infra",
      creator_avatar: "/avatars/avatar-3.svg",
      estimated_minutes: 30,
      produces_artifact: true,
      artifact_title: "Multi-Region Consistency RFC Audit",
      artifact_type: "summary",
      real_world_action_description:
        "Formulate tradeoffs between strong serializability and partition tolerance for high-throughput nodes.",
    },
    {
      id: "template-next-1",
      skill_category: "Next.js App Router",
      day_number: 1,
      title: "React Server Components & Streaming Architecture",
      description:
        "Implement streaming SSR layouts with Suspense boundaries and payload serialization.",
      task_type: "learn",
      creator_name: "Carlos Mendez",
      creator_handle: "@carlos.next",
      creator_avatar: "/avatars/avatar-5.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Streaming Next.js Layout Architecture",
      artifact_type: "code",
      real_world_action_description:
        "Optimize component boundaries to reduce time to first byte and eliminate client waterfall delays.",
    },
    {
      id: "template-next-2",
      skill_category: "Next.js App Router",
      day_number: 2,
      title: "Optimistic UI Updates & Server Actions",
      description:
        "Build zero-latency form mutations with useOptimistic and transactional database updates.",
      task_type: "build",
      creator_name: "Amina Diallo",
      creator_handle: "@amina.dev",
      creator_avatar: "/avatars/avatar-6.svg",
      estimated_minutes: 25,
      produces_artifact: true,
      artifact_title: "Optimistic Mutation Hook Implementation",
      artifact_type: "code",
      real_world_action_description:
        "Implement instant UI updates with automatic server rollback on network errors.",
    },
    {
      id: "template-next-3",
      skill_category: "Next.js App Router",
      day_number: 3,
      title: "Edge Runtime Caching & Tag Invalidation",
      description:
        "Deploy fine-grained revalidateTag strategies and stale-while-revalidate policies at the edge.",
      task_type: "audit",
      creator_name: "Carlos Mendez",
      creator_handle: "@carlos.next",
      creator_avatar: "/avatars/avatar-5.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Edge Cache Invalidation Matrix",
      artifact_type: "summary",
      real_world_action_description:
        "Tag cache segments to ensure instant data freshness without full route rebuilds.",
    },
    {
      id: "template-next-4",
      skill_category: "Next.js App Router",
      day_number: 4,
      title: "Production Bundle & Route Handler Audit",
      description:
        "Profile cold start latencies, eliminate client bundle bloat, and secure API route handlers.",
      task_type: "audit",
      creator_name: "Amina Diallo",
      creator_handle: "@amina.dev",
      creator_avatar: "/avatars/avatar-6.svg",
      estimated_minutes: 30,
      produces_artifact: true,
      artifact_title: "Production Route Handler Audit",
      artifact_type: "summary",
      real_world_action_description:
        "Reduce bundle overhead and optimize edge cold start durations.",
    },
    {
      id: "template-ts-1",
      skill_category: "TypeScript Core",
      day_number: 1,
      title: "Template Literal Types & URL Router DSLs",
      description:
        "Parse pathname parameters and enforce compile-time path verification using template string types.",
      task_type: "learn",
      creator_name: "Rachel Rivera",
      creator_handle: "@rrivera.types",
      creator_avatar: "/avatars/avatar-8.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Type-Safe Route Matcher DSL",
      artifact_type: "code",
      real_world_action_description:
        "Eliminate runtime routing errors through strict static path verification.",
    },
    {
      id: "template-ts-2",
      skill_category: "TypeScript Core",
      day_number: 2,
      title: "Recursive Conditional Types & Deep Immutability",
      description:
        "Implement DeepReadonly, DeepPartial, and Tuple flattening with distributive conditional type checks.",
      task_type: "build",
      creator_name: "Kenji Sato",
      creator_handle: "@kenji.fullstack",
      creator_avatar: "/avatars/avatar-7.svg",
      estimated_minutes: 25,
      produces_artifact: true,
      artifact_title: "Deep Immutable Utility Types",
      artifact_type: "code",
      real_world_action_description:
        "Enforce strict immutability invariants in state management containers.",
    },
    {
      id: "template-ts-3",
      skill_category: "TypeScript Core",
      day_number: 3,
      title: "Discriminated Unions & Pattern Matching",
      description:
        "Model state machines with exhaustiveness checks using never return types and custom type guards.",
      task_type: "audit",
      creator_name: "Rachel Rivera",
      creator_handle: "@rrivera.types",
      creator_avatar: "/avatars/avatar-8.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Exhaustive Pattern Matcher Library",
      artifact_type: "code",
      real_world_action_description:
        "Ensure all branches of complex business workflows are checked at compile time.",
    },
    {
      id: "template-ts-4",
      skill_category: "TypeScript Core",
      day_number: 4,
      title: "Type-Safe API Client SDK Generation",
      description:
        "Design typed RPC client wrappers that infer request and response payloads from backend route types.",
      task_type: "audit",
      creator_name: "Kenji Sato",
      creator_handle: "@kenji.fullstack",
      creator_avatar: "/avatars/avatar-7.svg",
      estimated_minutes: 30,
      produces_artifact: true,
      artifact_title: "Type-Safe RPC Client SDK",
      artifact_type: "code",
      real_world_action_description:
        "Deliver automated type safety across client-server network boundaries.",
    },
    {
      id: "template-ui-1",
      skill_category: "UI Engineering & Design Systems",
      day_number: 1,
      title: "Semantic Design Tokens & CSS Custom Properties",
      description:
        "Structure multi-tier token architectures supporting automatic dark mode and runtime theming.",
      task_type: "learn",
      creator_name: "Sarah Jenkins",
      creator_handle: "@sarah_j",
      creator_avatar: "/avatars/avatar-4.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Semantic Token Theme Engine",
      artifact_type: "code",
      real_world_action_description:
        "Standardize color and typography hierarchies across design system components.",
    },
    {
      id: "template-ui-2",
      skill_category: "UI Engineering & Design Systems",
      day_number: 2,
      title: "High-Performance GPU Layouts & Micro-Animations",
      description:
        "Eliminate browser layout thrashing and achieve 60 FPS transitions via transform and opacity.",
      task_type: "build",
      creator_name: "David Kim",
      creator_handle: "@davidk_dev",
      creator_avatar: "/avatars/avatar-3.svg",
      estimated_minutes: 25,
      produces_artifact: true,
      artifact_title: "GPU Accelerated Motion Components",
      artifact_type: "code",
      real_world_action_description:
        "Optimize animated modals and drawers to run purely on the compositor thread.",
    },
    {
      id: "template-ui-3",
      skill_category: "UI Engineering & Design Systems",
      day_number: 3,
      title: "Accessible Dialogs & Focus Trap Primitives",
      description:
        "Implement ARIA 1.2 modal patterns, escape key listeners, and focus restoration handlers.",
      task_type: "audit",
      creator_name: "Sarah Jenkins",
      creator_handle: "@sarah_j",
      creator_avatar: "/avatars/avatar-4.svg",
      estimated_minutes: 20,
      produces_artifact: true,
      artifact_title: "Accessible Dialog Primitive Specification",
      artifact_type: "code",
      real_world_action_description:
        "Guarantee full screen-reader and keyboard navigation compliance.",
    },
    {
      id: "template-ui-4",
      skill_category: "UI Engineering & Design Systems",
      day_number: 4,
      title: "Design System Architecture & Visual Regression",
      description:
        "Set up snapshot testing, component documentation, and accessibility linting rules.",
      task_type: "audit",
      creator_name: "David Kim",
      creator_handle: "@davidk_dev",
      creator_avatar: "/avatars/avatar-3.svg",
      estimated_minutes: 30,
      produces_artifact: true,
      artifact_title: "Component Regression Suite Spec",
      artifact_type: "summary",
      real_world_action_description:
        "Establish continuous integration gates preventing unintended style drift.",
    },
  ];

  await supabase.from("task_templates").upsert(templates, { onConflict: "id" });
}

async function seedPracticeCurriculum() {
  for (const track of trackSkills) {
    for (let day = 1; day <= 4; day++) {
      const mockTask: SprintTask = {
        id: `seed-task-${track.id}-${day}`,
        dayNumber: day,
        title: `${track.title} Day ${day}`,
        description: `Deliberate practice on ${track.title}`,
        type: "learn",
        creatorName: "Staff Engineer",
        creatorHandle: "@staff.eng",
        creatorAvatar: `/avatars/avatar-${((day - 1) % 8) + 1}.svg`,
        estimatedMinutes: 20,
        completed: false,
        producesArtifact: true,
        artifactTitle: `${track.title} Day ${day} Artifact`,
        artifactType: "code",
      };

      const videoLesson = getVideoLessonForTask(track.title, day);
      const courseSections = getCourseSectionsForTask(track.title, day);
      const knowledgeCheck = getKnowledgeCheckForTask(track.title, day);
      const fullSession: PracticeSessionContent = getPracticeSessionForTask(
        mockTask,
        track.title,
      );

      if (videoLesson.instructorAvatar) {
        videoLesson.instructorAvatar = sanitizeAvatar(
          videoLesson.instructorName,
          day,
        );
      }

      const curriculumRecord = {
        id: `${track.id}_day_${day}`,
        skill_id: track.id,
        day_number: day,
        video_lesson: videoLesson,
        course_sections: courseSections,
        knowledge_check: knowledgeCheck,
        briefing: fullSession.briefing,
        exercise: fullSession.exercise,
        artifact_draft: fullSession.artifactDraft,
      };

      await supabase
        .from("practice_curriculum")
        .upsert(curriculumRecord, { onConflict: "id" });
    }
  }
}

async function seedSquadsAndProjects() {
  const squadsData = [
    {
      id: "squad-1",
      name: "Distributed Systems Core",
      skill_focus: "System Architecture",
      shared_goal:
        "Complete 12 focused practice tasks together this week with zero leaderboard pressure",
      current_progress: 8,
      target_progress: 12,
      invite_code: "HUDDLE-4X9B",
    },
    {
      id: "squad-2",
      name: "Next.js App Router Collective",
      skill_focus: "Next.js Full-Stack",
      shared_goal:
        "Ship 15 server component production patterns and caching audits this week",
      current_progress: 11,
      target_progress: 15,
      invite_code: "HUDDLE-NEXT",
    },
    {
      id: "squad-3",
      name: "TypeScript Compiler & Typecraft",
      skill_focus: "TypeScript Core",
      shared_goal:
        "Complete 10 type-level algorithms and conditional infer challenges",
      current_progress: 7,
      target_progress: 10,
      invite_code: "HUDDLE-TS99",
    },
  ];

  await supabase.from("squads").upsert(squadsData, { onConflict: "id" });

  const squad1Members = [
    {
      id: "user-1",
      squad_id: "squad-1",
      name: "Alex Chen",
      handle: "@alexchen.dev",
      avatar: "/avatars/avatar-1.svg",
      streak: 8,
      checked_in_today: false,
      last_check_in: "Yesterday",
      recent_encouragement:
        "Benchmarking early cache invalidation algorithms under load",
      role: "lead",
    },
    {
      id: "member-2",
      squad_id: "squad-1",
      name: "Elena Rostova",
      handle: "@erostova.sys",
      avatar: "/avatars/avatar-2.svg",
      streak: 12,
      checked_in_today: true,
      last_check_in: "45 minutes ago",
      recent_encouragement:
        "Verified idempotent message handler for Kafka consumer group",
      role: "member",
    },
    {
      id: "member-3",
      squad_id: "squad-1",
      name: "Marcus Vance",
      handle: "@marcus.infra",
      avatar: "/avatars/avatar-3.svg",
      streak: 6,
      checked_in_today: true,
      last_check_in: "2 hours ago",
      recent_encouragement:
        "Drafted connection pooler ADR and failover checklist",
      role: "member",
    },
    {
      id: "member-4",
      squad_id: "squad-1",
      name: "Priya Patel",
      handle: "@priya.arch",
      avatar: "/avatars/avatar-4.svg",
      streak: 9,
      checked_in_today: false,
      last_check_in: "Yesterday",
      recent_encouragement:
        "Tuning Bloom filter parameters for read-heavy edge nodes",
      role: "member",
    },
  ];

  const squad2Members = [
    {
      id: "next-1",
      squad_id: "squad-2",
      name: "Carlos Mendez",
      handle: "@carlos.next",
      avatar: "/avatars/avatar-5.svg",
      streak: 14,
      checked_in_today: true,
      last_check_in: "1 hour ago",
      recent_encouragement:
        "Configured partial prerendering with parallel routes",
      role: "lead",
    },
    {
      id: "next-2",
      squad_id: "squad-2",
      name: "Amina Diallo",
      handle: "@amina.dev",
      avatar: "/avatars/avatar-6.svg",
      streak: 8,
      checked_in_today: true,
      last_check_in: "3 hours ago",
      recent_encouragement:
        "Benchmarked Server Actions vs Route Handlers payload size",
      role: "member",
    },
    {
      id: "next-3",
      squad_id: "squad-2",
      name: "Kenji Sato",
      handle: "@kenji.fullstack",
      avatar: "/avatars/avatar-7.svg",
      streak: 5,
      checked_in_today: false,
      last_check_in: "Yesterday",
      recent_encouragement:
        "Refactoring auth middleware to use edge session cookies",
      role: "member",
    },
  ];

  const squad3Members = [
    {
      id: "ts-1",
      squad_id: "squad-3",
      name: "Rachel Rivera",
      handle: "@rrivera.types",
      avatar: "/avatars/avatar-8.svg",
      streak: 19,
      checked_in_today: true,
      last_check_in: "30m ago",
      recent_encouragement:
        "Constructed recursive tuple pattern matcher with tail recursion",
      role: "lead",
    },
    {
      id: "ts-2",
      squad_id: "squad-3",
      name: "Liam Chen",
      handle: "@liam.typecraft",
      avatar: "/avatars/avatar-5.svg",
      streak: 4,
      checked_in_today: false,
      last_check_in: "Yesterday",
      recent_encouragement:
        "Solving distributive conditional union propagation issues",
      role: "member",
    },
  ];

  await supabase
    .from("squad_members")
    .upsert([...squad1Members, ...squad2Members, ...squad3Members], {
      onConflict: "id",
    });

  const squadProjectsData = [
    {
      id: "proj-1",
      squad_id: "squad-1",
      title: "Team Blueprint: Distributed Systems Core",
      description:
        "Design and review a fault-tolerant multi-region cache invalidation protocol with zero stale reads under network partitions.",
      deadline: "Sunday, 11:59 PM",
      deliverables: [
        {
          memberId: "member-2",
          memberName: "Elena Rostova",
          memberAvatar: "/avatars/avatar-2.svg",
          title: "CDC Cache Invalidation Topology",
          notes:
            "Implemented Debezium Postgres CDC pipeline publishing cache eviction events to regional Kafka clusters.",
          link: "https://github.com/huddle-org/cache-cdc-rfc",
          timestamp: "Yesterday at 4:15 PM",
        },
        {
          memberId: "member-3",
          memberName: "Marcus Vance",
          memberAvatar: "/avatars/avatar-3.svg",
          title: "Redis Cluster Split-Brain Benchmark",
          notes:
            "Measured p99 read latencies and failover recovery windows during simulated partition events.",
          link: "https://github.com/huddle-org/redis-benchmark",
          timestamp: "Today at 10:30 AM",
        },
      ],
      submissions: [
        {
          memberId: "member-2",
          submittedAt: "Yesterday at 4:15 PM",
        },
        {
          memberId: "member-3",
          submittedAt: "Today at 10:30 AM",
        },
      ],
    },
    {
      id: "proj-next",
      squad_id: "squad-2",
      title: "Full-Stack Performance Audit",
      description:
        "Audit bundle size and cache hit ratio on Next.js 15 production deployments.",
      deadline: "Sunday, 11:59 PM",
      deliverables: [
        {
          memberId: "next-1",
          memberName: "Carlos Mendez",
          memberAvatar: "/avatars/avatar-5.svg",
          title: "Route Cache Elimination Benchmark",
          notes:
            "Reduced TTFB by 42ms through selective segment cache tagging.",
          timestamp: "Yesterday at 3:00 PM",
        },
      ],
      submissions: [
        {
          memberId: "next-1",
          submittedAt: "Yesterday at 3:00 PM",
        },
      ],
    },
  ];

  await supabase
    .from("squad_projects")
    .upsert(squadProjectsData, { onConflict: "id" });
}

async function seedQuestionnaireConfig() {
  const options = [
    {
      id: "subj-cs",
      category: "subject",
      label: "Computer Science/ICT",
      description: "Algorithms, distributed systems, and core computer science fundamentals",
      badge: "Core",
      sort_order: 1,
    },
    {
      id: "subj-math",
      category: "subject",
      label: "Mathematics",
      description: "Discrete math, logic proofs, probability, and numerical computing",
      badge: "Analytical",
      sort_order: 2,
    },
    {
      id: "subj-ds",
      category: "subject",
      label: "Data Structures & Systems",
      description: "Concurrency models, indexing topologies, and persistence engines",
      badge: "Systems",
      sort_order: 3,
    },
    {
      id: "subj-design",
      category: "subject",
      label: "Design & Interaction",
      description: "Design systems, accessibility engineering, and layout performance",
      badge: "Product",
      sort_order: 4,
    },
    {
      id: "subj-network",
      category: "subject",
      label: "Networks & Infrastructure",
      description: "HTTP/3, TCP/UDP, edge routing, and cloud architectures",
      badge: "Infra",
      sort_order: 5,
    },
    {
      id: "hobby-gaming",
      category: "hobby",
      label: "Gaming",
      description: "Strategy, puzzle, simulation, and mechanics analysis",
      sort_order: 1,
    },
    {
      id: "hobby-reading",
      category: "hobby",
      label: "Reading",
      description: "Technical RFCs, engineering postmortems, and architectural papers",
      sort_order: 2,
    },
    {
      id: "hobby-music",
      category: "hobby",
      label: "Music & Audio",
      description: "Composition, signal processing, synthesis, and rhythmic patterns",
      sort_order: 3,
    },
    {
      id: "hobby-writing",
      category: "hobby",
      label: "Writing",
      description: "Engineering blogs, documentation, and technical deep-dives",
      sort_order: 4,
    },
    {
      id: "stage-rising",
      category: "career_stage",
      label: "Early Career / Rising Engineer",
      description: "Building production proficiency and mastering clean code patterns",
      sort_order: 1,
    },
    {
      id: "stage-mid",
      category: "career_stage",
      label: "Mid-Level Software Engineer",
      description: "Owning core services, refactoring architectures, and leading feature pods",
      sort_order: 2,
    },
    {
      id: "stage-senior",
      category: "career_stage",
      label: "Senior / Tech Lead",
      description: "Designing distributed architectures, mentoring engineers, and setting quality bars",
      sort_order: 3,
    },
    {
      id: "stage-staff",
      category: "career_stage",
      label: "Staff+ / Systems Architect",
      description: "Org-wide architectural direction, cross-cutting reliability, and technical strategy",
      sort_order: 4,
    },
    {
      id: "skill-sys-arch",
      category: "starting_skill",
      label: "System Architecture & Scalability",
      description: "Caching patterns, partition tolerance, and message streaming",
      sort_order: 1,
    },
    {
      id: "skill-nextjs",
      category: "starting_skill",
      label: "Next.js App Router & Server Components",
      description: "Streaming SSR, Suspense boundaries, and Server Actions",
      sort_order: 2,
    },
    {
      id: "skill-typescript",
      category: "starting_skill",
      label: "Advanced TypeScript & Typecraft",
      description: "Template literals, conditional types, and recursive infer matching",
      sort_order: 3,
    },
    {
      id: "skill-ui-eng",
      category: "starting_skill",
      label: "UI Engineering & Design Systems",
      description: "Token architectures, WCAG accessibility, and 60 FPS transitions",
      sort_order: 4,
    },
  ];

  await supabase
    .from("questionnaire_config")
    .upsert(options, { onConflict: "id" });
}

async function seedSearchSuggestions() {
  const suggestions = [
    {
      id: "search-1",
      title: "System Architecture",
      category: "Track",
      type: "skill",
      target_id: "dashboard",
      description: "4-day sprint on distributed caching, idempotency, and sagas",
      is_trending: true,
    },
    {
      id: "search-2",
      title: "Next.js App Router",
      category: "Track",
      type: "skill",
      target_id: "explore",
      description: "Streaming SSR layouts, Server Actions, and edge invalidation",
      is_trending: true,
    },
    {
      id: "search-3",
      title: "Advanced TypeScript",
      category: "Track",
      type: "skill",
      target_id: "explore",
      description: "Template literal types, discriminated unions, and pattern matching",
      is_trending: true,
    },
    {
      id: "search-4",
      title: "UI Engineering & Design Systems",
      category: "Track",
      type: "skill",
      target_id: "explore",
      description: "Design tokens, accessible dialogs, and GPU animation benchmarks",
      is_trending: false,
    },
    {
      id: "search-5",
      title: "Distributed Systems Core",
      category: "Squad",
      type: "squad",
      target_id: "squad",
      description: "High-signal accountability squad focused on architecture craft",
      is_trending: true,
    },
    {
      id: "search-6",
      title: "Elena Rostova",
      category: "Creator",
      type: "creator",
      target_id: "creators",
      description: "Staff Distributed Systems Architect at StreamScale",
      is_trending: true,
    },
    {
      id: "search-7",
      title: "Marcus Vance",
      category: "Creator",
      type: "creator",
      target_id: "creators",
      description: "Principal Infrastructure Engineer at CloudScale",
      is_trending: false,
    },
  ];

  await supabase
    .from("search_suggestions")
    .upsert(suggestions, { onConflict: "id" });
}

async function updateProfilesAndCreatorsAvatars() {
  await supabase
    .from("profiles")
    .update({ avatar: "/avatars/avatar-1.svg" })
    .eq("id", "user-1");

  await supabase
    .from("creators")
    .update({ avatar: "/avatars/avatar-2.svg" })
    .eq("name", "Elena Rostova");

  await supabase
    .from("creators")
    .update({ avatar: "/avatars/avatar-3.svg" })
    .eq("name", "Marcus Vance");
}

async function run() {
  await seedTaskTemplates();
  await seedPracticeCurriculum();
  await seedSquadsAndProjects();
  await seedQuestionnaireConfig();
  await seedSearchSuggestions();
  await updateProfilesAndCreatorsAvatars();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
