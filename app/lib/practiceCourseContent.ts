import {
  PracticeVideoLesson,
  PracticeCourseSection,
  PracticeKnowledgeQuestion
} from '../types/huddle';

export function getVideoLessonForTask(skillTitle: string, dayNumber: number): PracticeVideoLesson {
  const normalizedSkill = skillTitle.toLowerCase();

  if (normalizedSkill.includes('next') || normalizedSkill.includes('react') || normalizedSkill.includes('front')) {
    const nextVideos: Record<number, PracticeVideoLesson> = {
      1: {
        title: 'Streaming Server Components & Suspense Boundaries',
        youtubeId: 'D13_8FmKkE0',
        videoUrl: 'https://www.youtube.com/watch?v=D13_8FmKkE0',
        durationMinutes: 14,
        instructorName: 'Marcus Vance',
        instructorTitle: 'Staff Frontend Infrastructure Engineer',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Server Components Mental Model' },
          { timeSeconds: 160, title: 'Streaming Wire Protocol & Fiber Trees' },
          { timeSeconds: 420, title: 'Boundary Isolation & Error Boundaries' },
          { timeSeconds: 690, title: 'Payload Serialization Benchmarks' }
        ],
        keyTakeaways: [
          'Server Components execute exclusively on the server and emit flight response wire streams.',
          'Suspense boundaries allow slow database queries to stream without blocking critical HTML shells.',
          'Client boundaries should be placed as deep in the component hierarchy as possible.'
        ]
      },
      2: {
        title: 'Optimistic UI Updates & Server Actions',
        youtubeId: 'vA8Tox_M_b0',
        videoUrl: 'https://www.youtube.com/watch?v=vA8Tox_M_b0',
        durationMinutes: 16,
        instructorName: 'Elena Rostova',
        instructorTitle: 'Principal Distributed Systems Architect',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Latency Compensation Mechanics' },
          { timeSeconds: 210, title: 'useOptimistic State Transitions' },
          { timeSeconds: 510, title: 'Server Action Transaction Boundaries' },
          { timeSeconds: 780, title: 'Handling Network Failures & Rollbacks' }
        ],
        keyTakeaways: [
          'Optimistic rendering updates client state instantly while asynchronous mutations resolve.',
          'Every optimistic action must maintain rollback state to recover from unexpected server errors.',
          'Server Actions should validate data with Zod before modifying transactional storage.'
        ]
      },
      3: {
        title: 'Route Handlers & Edge Runtime Caching',
        youtubeId: '3p42Fv9H1-g',
        videoUrl: 'https://www.youtube.com/watch?v=3p42Fv9H1-g',
        durationMinutes: 13,
        instructorName: 'Marcus Vance',
        instructorTitle: 'Staff Frontend Infrastructure Engineer',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Edge Network Architecture' },
          { timeSeconds: 180, title: 'Stale-While-Revalidate Caching Headers' },
          { timeSeconds: 440, title: 'Tag-Based Cache Invalidation' },
          { timeSeconds: 670, title: 'Edge vs Node Runtime Tradeoffs' }
        ],
        keyTakeaways: [
          'Edge runtimes execute with near-zero cold start latency across geographically distributed nodes.',
          'Stale-while-revalidate headers serve cached payloads immediately while refreshing behind the scenes.',
          'Targeted cache revalidation using revalidateTag minimizes expensive database queries.'
        ]
      },
      4: {
        title: 'Production Pull Requests & Engineering Verification',
        youtubeId: 'W0b3a3qZk2k',
        videoUrl: 'https://www.youtube.com/watch?v=W0b3a3qZk2k',
        durationMinutes: 11,
        instructorName: 'Elena Rostova',
        instructorTitle: 'Principal Distributed Systems Architect',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Structuring High-Impact Pull Requests' },
          { timeSeconds: 170, title: 'Automated CI & Assertion Suites' },
          { timeSeconds: 390, title: 'Performance Profiling & Bundle Analysis' },
          { timeSeconds: 580, title: 'Presenting Work to Core Maintainers' }
        ],
        keyTakeaways: [
          'Great engineering pull requests include clear problem context, benchmarks, and rollback plans.',
          'Automated assertions in CI protect mission-critical paths from accidental regression.',
          'Verified production proofs demonstrate senior engineering ownership and craftsmanship.'
        ]
      }
    };
    return nextVideos[dayNumber] || nextVideos[1];
  }

  if (normalizedSkill.includes('type') || normalizedSkill.includes('ts')) {
    const tsVideos: Record<number, PracticeVideoLesson> = {
      1: {
        title: 'Advanced Generics & Template Literal Parsing',
        youtubeId: 'dLPgQRKAOzk',
        videoUrl: 'https://www.youtube.com/watch?v=dLPgQRKAOzk',
        durationMinutes: 15,
        instructorName: 'Marcus Vance',
        instructorTitle: 'Staff Frontend Infrastructure Engineer',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Template Literals at the Type Level' },
          { timeSeconds: 190, title: 'Recursive Path Parameter Extraction' },
          { timeSeconds: 460, title: 'String Manipulation Utility Types' },
          { timeSeconds: 740, title: 'Compiler Limit Safeguards' }
        ],
        keyTakeaways: [
          'Template literal types transform string unions into structured type-safe parsing engines.',
          'Recursion in type systems enables extracting route parameters with zero runtime overhead.',
          'Const type parameters preserve literal string types through generic invocations.'
        ]
      },
      2: {
        title: 'Conditional Types & Infer Pattern Matching',
        youtubeId: 'r_1-fN_bQ5g',
        videoUrl: 'https://www.youtube.com/watch?v=r_1-fN_bQ5g',
        durationMinutes: 16,
        instructorName: 'Marcus Vance',
        instructorTitle: 'Staff Frontend Infrastructure Engineer',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'Conditional Type Algebra' },
          { timeSeconds: 220, title: 'The Infer Keyword Demystified' },
          { timeSeconds: 520, title: 'Deep Unwrapping of Nested Promises' },
          { timeSeconds: 800, title: 'Distributive Conditional Types' }
        ],
        keyTakeaways: [
          'Conditional types act as ternary operators inside the TypeScript type system.',
          'The infer keyword introduces a type variable within the true branch of a conditional expression.',
          'Wrapping union types in tuples prevents unexpected distributive behavior.'
        ]
      },
      3: {
        title: 'Discriminated Unions & Exhaustive Type Guards',
        youtubeId: '9i38ONaz-AQ',
        videoUrl: 'https://www.youtube.com/watch?v=9i38ONaz-AQ',
        durationMinutes: 14,
        instructorName: 'Elena Rostova',
        instructorTitle: 'Principal Distributed Systems Architect',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'The Power of Discriminated Unions' },
          { timeSeconds: 180, title: 'Narrowing with Common Tag Fields' },
          { timeSeconds: 430, title: 'Exhaustiveness Checking with Never' },
          { timeSeconds: 690, title: 'Domain State Machine Modeling' }
        ],
        keyTakeaways: [
          'Discriminated unions combine a literal discriminant field to guarantee mutually exclusive states.',
          'Assigning unhandled values to the never type forces compiler errors when new cases are added.',
          'Pattern matching across union variants makes illegal states unrepresentable.'
        ]
      },
      4: {
        title: 'Packaging & Publishing Production TypeScript SDKs',
        youtubeId: '5Tz4_iH6W9o',
        videoUrl: 'https://www.youtube.com/watch?v=5Tz4_iH6W9o',
        durationMinutes: 12,
        instructorName: 'Elena Rostova',
        instructorTitle: 'Principal Distributed Systems Architect',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        chapters: [
          { timeSeconds: 0, title: 'SDK Architecture Principles' },
          { timeSeconds: 160, title: 'Dual ESM and CJS Distribution' },
          { timeSeconds: 410, title: 'Declaration Maps & Source Linking' },
          { timeSeconds: 630, title: 'Automated Type Testing' }
        ],
        keyTakeaways: [
          'Package exports fields define precise entry points for modern bundlers and runtime engines.',
          'Generating declaration maps enables IDE jump-to-definition directly into source files.',
          'Type assertion tests verify that API changes do not break downstream consumer types.'
        ]
      }
    };
    return tsVideos[dayNumber] || tsVideos[1];
  }

  const systemVideos: Record<number, PracticeVideoLesson> = {
    1: {
      title: 'Distributed Caching & Invalidation Topologies',
      youtubeId: 'U3RkCTZ_jzo',
      videoUrl: 'https://www.youtube.com/watch?v=U3RkCTZ_jzo',
      durationMinutes: 15,
      instructorName: 'Elena Rostova',
      instructorTitle: 'Principal Distributed Systems Architect',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      chapters: [
        { timeSeconds: 0, title: 'Multi-Tier Caching Architecture' },
        { timeSeconds: 180, title: 'Cache Stampede & Thundering Herd' },
        { timeSeconds: 430, title: 'Single-Flight Mutex Locking' },
        { timeSeconds: 680, title: 'Randomized Jitter & Invalidation Leases' }
      ],
      keyTakeaways: [
        'Cache stampedes occur when hundreds of requests discover an expired key simultaneously.',
        'Single-flight locks ensure only a single worker executes the expensive database read.',
        'Adding randomized jitter to TTL expirations prevents synchronized mass cache misses.'
      ]
    },
    2: {
      title: 'Idempotency Keys & Distributed Locking Protocols',
      youtubeId: 'aZ_J467OGgQ',
      videoUrl: 'https://www.youtube.com/watch?v=aZ_J467OGgQ',
      durationMinutes: 17,
      instructorName: 'Elena Rostova',
      instructorTitle: 'Principal Distributed Systems Architect',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      chapters: [
        { timeSeconds: 0, title: 'Network Retries & Double Billing Disasters' },
        { timeSeconds: 230, title: 'Idempotency Key Lifecycle & State Table' },
        { timeSeconds: 520, title: 'Atomic Redis Mutex with Fencing Tokens' },
        { timeSeconds: 830, title: 'Rollback & Compensation Strategies' }
      ],
      keyTakeaways: [
        'Clients must send unique idempotency keys on every non-safe HTTP request.',
        'A dedicated idempotency store saves in-flight locks and final responses.',
        'Fencing tokens protect against split-brain scenarios when distributed locks expire prematurely.'
      ]
    },
    3: {
      title: 'Connection Pooling & Database Failover Resiliency',
      youtubeId: 'P_XqR7m0y6c',
      videoUrl: 'https://www.youtube.com/watch?v=P_XqR7m0y6c',
      durationMinutes: 14,
      instructorName: 'Marcus Vance',
      instructorTitle: 'Staff Frontend Infrastructure Engineer',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      chapters: [
        { timeSeconds: 0, title: 'Postgres Connection Architecture' },
        { timeSeconds: 190, title: 'PgBouncer Transaction Pooling Mode' },
        { timeSeconds: 460, title: 'Routing Queries to Read Replicas' },
        { timeSeconds: 710, title: 'Handling Graceful Failover Events' }
      ],
      keyTakeaways: [
        'Each Postgres connection consumes significant server memory and process overhead.',
        'Transaction-level connection pooling allows thousands of microservices to share small connection pools.',
        'Read queries should target replicas with replica-lag tolerances explicitly configured.'
      ]
    },
    4: {
      title: 'Architectural Decision Records (ADR) in Production',
      youtubeId: '8bZ5l5l44Ww',
      videoUrl: 'https://www.youtube.com/watch?v=8bZ5l5l44Ww',
      durationMinutes: 12,
      instructorName: 'Elena Rostova',
      instructorTitle: 'Principal Distributed Systems Architect',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      chapters: [
        { timeSeconds: 0, title: 'The Anatomy of a Senior ADR' },
        { timeSeconds: 170, title: 'Framing Constraints & Non-Functional Goals' },
        { timeSeconds: 400, title: 'Evaluating Tradeoffs Without Bias' },
        { timeSeconds: 610, title: 'Building Consensus Across Engineering Teams' }
      ],
      keyTakeaways: [
        'An ADR captures the architectural context, evaluated options, and explicit consequences of a design decision.',
        'Documenting why alternative options were rejected prevents circular architectural debates.',
        'ADRs form permanent institutional memory checked directly into repository version control.'
      ]
    }
  };

  return systemVideos[dayNumber] || systemVideos[1];
}

export function getCourseSectionsForTask(skillTitle: string, dayNumber: number): PracticeCourseSection[] {
  const normalizedSkill = skillTitle.toLowerCase();

  if (normalizedSkill.includes('next') || normalizedSkill.includes('react') || normalizedSkill.includes('front')) {
    const nextSections: Record<number, PracticeCourseSection[]> = {
      1: [
        {
          id: 'mental-model',
          title: 'Architectural Mental Model: The React Server Component Paradigm',
          summary: 'Understanding how React divides server execution from client interactivity without hydration mismatches.',
          content: 'React Server Components execute entirely within Node or edge runtimes, executing direct database queries and emitting a serialized streaming payload known as Flight data. Unlike classic SSR where the entire page must render to HTML string and hydrate client-side, Server Components never ship their code to the browser bundle. Suspense boundaries carve the page into independent asynchronous streaming chunks.',
          diagramAscii: `HTTP GET Request ──> Next.js Edge Router
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
Header / Static Layout        Suspense Boundary
(Immediate HTML Shell)        (Active DB Stream)
       │                               │
       ▼                               ▼
Browser Paints Layout        Stream Resolves Flight Chunk
                              (Zero Hydration Overhead)`,
          callout: {
            type: 'production_tip',
            title: 'Boundary Placement Principle',
            text: 'Keep "use client" directives as deep as possible in your tree to keep server-side data fetching lightweight and protect bundle size.'
          }
        },
        {
          id: 'deep-dive',
          title: 'Streaming Wire Protocol & Boundary Isolation',
          summary: 'How Suspense streams asynchronous fiber trees progressively over a single persistent HTTP connection.',
          content: 'When an async Server Component encounters a pending Promise, Next.js flushes the surrounding layout immediately, rendering fallback skeleton UI. As the Promise resolves, a small script tag containing serialized virtual DOM instructions is streamed down the active response socket, swapping the fallback with the resolved component in-place without page refresh.',
          codeSnippet: `export default async function DashboardFeed() {
  return (
    <div className="grid gap-6">
      <Suspense fallback={<MetricsSkeleton />}>
        <RealtimeMetricsStream />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <AuditLogList />
      </Suspense>
    </div>
  );
}`,
          codeLanguage: 'tsx'
        },
        {
          id: 'war-story',
          title: 'Production War Story: Hydration Mismatches at 120,000 Concurrent Users',
          summary: 'How an unisolated Date.now() timestamp caused total layout flickering and client de-opts.',
          content: 'During a flash traffic event, a frontend team rendered user session timestamps inside a Server Component without timezone normalization. The server emitted UTC HTML while client browsers rendered local time, triggering full React hydration failures and wiping client-side form state across 40,000 active checkout flows. The fix was isolating temporal values behind client effects with explicit fallback states.'
        }
      ],
      2: [
        {
          id: 'mental-model',
          title: 'Optimistic State Machines & Zero-Latency Mutations',
          summary: 'Decoupling user interface response times from network latency while preserving rollback integrity.',
          content: 'Modern web applications cannot afford 300ms delays waiting for server confirmation on simple interactions. Optimistic UI assumes operation success immediately, rendering updated state synchronously while executing the server mutation in parallel. If the server transaction aborts, the client state machine gracefully rolls back to the prior snapshot and presents actionable error guidance.',
          diagramAscii: `User Clicks "Like"
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
Optimistic State: true          Dispatch Server Action
(Instant UI Feedback: 0ms)      (Network roundtrip: 180ms)
                                         │
                                ┌────────┴────────┐
                                ▼                 ▼
                             Success            Error
                             (Commit)     (Rollback + Alert)`,
          callout: {
            type: 'warning',
            title: 'Rollback Consistency',
            text: 'Never delete the original state snapshot until the Server Action resolves with an HTTP 200 equivalent acknowledgment.'
          }
        },
        {
          id: 'deep-dive',
          title: 'useOptimistic Implementation Architecture',
          summary: 'Managing optimistic states with React transitions and transactional action boundaries.',
          content: 'React provides the useOptimistic hook to manage temporary state during asynchronous transitions. When wrapped inside startTransition, React automatically synchronizes optimistic values when the underlying Server Action completes or fails.',
          codeSnippet: `const [optimisticTasks, setOptimisticTasks] = useOptimistic(
  tasks,
  (state, updatedTask: Task) => 
    state.map(t => t.id === updatedTask.id ? updatedTask : t)
);

async function handleToggle(task: Task) {
  startTransition(async () => {
    setOptimisticTasks({ ...task, completed: !task.completed });
    await updateTaskStatusOnServer(task.id, !task.completed);
  });
}`,
          codeLanguage: 'tsx'
        }
      ]
    };
    return nextSections[dayNumber] || nextSections[1];
  }

  if (normalizedSkill.includes('type') || normalizedSkill.includes('ts')) {
    const tsSections: Record<number, PracticeCourseSection[]> = {
      1: [
        {
          id: 'mental-model',
          title: 'Template Literal Type Systems & Route Grammar',
          summary: 'Harnessing compile-time string pattern matching to construct zero-overhead API routers.',
          content: 'Template literal types bring string union interpolation into the TypeScript compiler. By combining template literals with recursive conditional types, we can infer dynamic path parameters from route strings at compile time, eliminating URL mismatch bugs before code ever ships to staging.',
          diagramAscii: `Input String: "/users/:userId/teams/:teamId"
                     │
                     ▼
        Recursive Template Pattern
         \`/:\${infer Param}/\${infer Rest}\`
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
    Param: "userId"         Rest: "teams/:teamId"
          │                     │
          └──────────┬──────────┘
                     ▼
     Extracted Type: { userId: string; teamId: string }`,
          callout: {
            type: 'production_tip',
            title: 'Compiler Performance',
            text: 'Avoid unbounded recursion on unbounded open string unions. Enforce depth guards to keep IDE typecheck speeds instant.'
          }
        },
        {
          id: 'deep-dive',
          title: 'Recursive Route Parameter Extractor',
          summary: 'Step-by-step type definition to extract parameterized route keys into strongly typed objects.',
          content: 'The following utility type recursively traverses a path string, extracting colon-prefixed segments into a unified object interface.',
          codeSnippet: `export type ExtractRouteParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractRouteParams<\`/\${Rest}\`>]: string }
    : T extends \`\${string}:\${infer Param}\`
      ? { [K in Param]: string }
      : Record<string, never>;

type AppParams = ExtractRouteParams<'/org/:orgId/projects/:projectId'>;`,
          codeLanguage: 'typescript'
        }
      ]
    };
    return tsSections[dayNumber] || tsSections[1];
  }

  const systemSections: Record<number, PracticeCourseSection[]> = {
    1: [
      {
        id: 'mental-model',
        title: 'Architectural Foundations: Multi-Tier Caching & Invalidation Guardrails',
        summary: 'Understanding why caching is not merely a key-value store, but an eventually consistent read projection governed by strict concurrency guardrails.',
        content: 'Distributed caching shields databases from high read throughput by serving records directly from high-speed in-memory memory engines such as Redis or Memcached. However, when cached entries expire under substantial production load, hundreds of concurrent application threads encounter a cache miss simultaneously. Without synchronization, all threads execute identical database queries simultaneously, a catastrophic failure mode known as a cache stampede or thundering herd.',
        diagramAscii: `Incoming Traffic: 40,000 QPS
                │
                ▼
        Check Redis L2 Cache
                │
       ┌────────┴────────┐
       ▼                 ▼
   Cache HIT         Cache MISS (Key Expired)
   (Return <2ms)         │
                         ▼
                Acquire Mutex Key (SET NX EX 5)
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
       Lock ACQUIRED            Lock BUSY
             │                       │
      Execute Postgres DB     Sleep 50ms & Retry
             │                or Serve Stale-While-Revalidate
     Write Redis + Jitter            │
             │                       ▼
       Release Mutex          Return Fresh Record`,
        callout: {
          type: 'production_tip',
          title: 'Distributed Mutex TTL',
          text: 'Always pair distributed mutex keys with an explicit expiration lease (e.g. 5 seconds) to ensure that crashed worker nodes do not deadlock concurrent threads indefinitely.'
        }
      },
      {
        id: 'deep-dive',
        title: 'Single-Flight Synchronization & Randomized Jitter Algorithms',
        summary: 'The mathematical mechanics of preventing coordinated cache expiration across clustered memory tiers.',
        content: 'Two architectural mechanisms neutralize cache stampedes: Single-Flight serialization and Randomized Expiration Jitter. Single-Flight ensures that for any given cache key, exactly one worker is granted permission to populate the cache while all concurrent callers wait on the single in-flight resolution. Jitter adds a pseudo-random delta (such as +/- 10% to 20%) to the cache TTL, guaranteeing that bulk-loaded entries expire smoothly over a dispersed window rather than in an identical millisecond spike.',
        codeSnippet: `export async function getWithSingleFlight<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = \`lock:\${key}\`;
  const acquired = await redis.set(lockKey, '1', 'EX', 5, 'NX');

  if (!acquired) {
    await new Promise(resolve => setTimeout(resolve, 60));
    return getWithSingleFlight(key, fetchFn, ttlSeconds);
  }

  try {
    const freshData = await fetchFn();
    const jitter = Math.floor(Math.random() * 30);
    await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds + jitter);
    return freshData;
  } finally {
    await redis.del(lockKey);
  }
}`,
        codeLanguage: 'typescript'
      },
      {
        id: 'war-story',
        title: 'Production Outage Post-Mortem: The 60-Second Black Friday Outage',
        summary: 'How a synchronized catalog TTL brought down an entire Aurora PostgreSQL primary cluster in four seconds.',
        content: 'At 09:00 UTC during a flash shopping event, an e-commerce platform cached product catalog items with a fixed 60-second TTL without jitter. At 09:01 UTC, 85,000 active consumer requests discovered the key had expired at the exact same millisecond. The Postgres primary database received 85,000 parallel index scans, exhausting the 400-connection database pool and causing memory exhaustion. Deploying single-flight mutex locking with a 30-second jitter band reduced peak database query volume by 99.4%.'
      }
    ],
    2: [
      {
        id: 'mental-model',
        title: 'Idempotency Protocols: Protecting Mission-Critical Mutation Paths',
        summary: 'Ensuring that retrying network requests produces identical side-effects without duplicate charges or database corruption.',
        content: 'In distributed computing, network boundaries are fundamentally unreliable. When an HTTP POST request times out, the client cannot determine if the request failed before reaching the server or succeeded just before the response was lost in transit. Idempotency keys allow clients to generate a unique cryptographic token per mutation. The server guarantees that regardless of how many times the request is received, the underlying transaction executes exactly once.',
        diagramAscii: `Client POST /payments (Idempotency-Key: "uuid-901")
                     │
                     ▼
           Check Idempotency Table
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
   Key Exists                 Key Does Not Exist
       │                           │
  Status: "COMPLETED"         Insert State: "PROCESSING"
  Return Stored Response           │
  (Zero Duplicate Side-Effects) Execute Payment & DB Transaction
                                   │
                              Update State: "COMPLETED"
                              Store Response Payload`,
        callout: {
          type: 'warning',
          title: 'Idempotency Key Collision',
          text: 'Always hash the request body payload alongside the idempotency key to prevent malicious attackers from reusing keys with modified parameters.'
        }
      },
      {
        id: 'deep-dive',
        title: 'Two-Phase Idempotency Protocol Implementation',
        summary: 'Implementing an atomic state machine across payment and order processing boundaries.',
        content: 'An idempotency protocol operates in three distinct phases: State Reservation, Business Execution, and Response Caching. If an identical key arrives while the state is "PROCESSING", the server returns HTTP 409 Conflict or blocks until the primary worker completes.',
        codeSnippet: `export async function executeIdempotent<T>(
  key: string,
  mutationFn: () => Promise<T>,
  ttlSeconds = 86400
): Promise<T> {
  const existing = await idempotencyRepo.findByKey(key);
  if (existing) {
    if (existing.status === 'COMPLETED') return existing.responsePayload;
    if (existing.status === 'PROCESSING') {
      throw new Error('Concurrent operation in progress for this key');
    }
  }

  await idempotencyRepo.createKey(key, 'PROCESSING');
  try {
    const result = await mutationFn();
    await idempotencyRepo.completeKey(key, result, ttlSeconds);
    return result;
  } catch (error) {
    await idempotencyRepo.deleteKey(key);
    throw error;
  }
}`,
        codeLanguage: 'typescript'
      }
    ],
    3: [
      {
        id: 'mental-model',
        title: 'Connection Pooling & Read-Replica Topology',
        summary: 'Preventing process starvation by decoupling application threads from database connections.',
        content: 'Relational databases allocate dedicated memory and background processes for every concurrent client connection. Under serverless or microservice scaling, sudden spikes can easily spawn 5,000 connections, crashing the database engine. Connection poolers such as PgBouncer sit between services and database servers, multiplexing thousands of client connections over a compact pool of persistent server connections.',
        diagramAscii: `Microservices (2,000 Pods) ──> PgBouncer (Transaction Pool)
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                     Postgres Primary Node           Postgres Read Replica
                     (Writes Only: 30 Conns)         (Reads Only: 60 Conns)`,
        callout: {
          type: 'production_tip',
          title: 'Transaction Pooling Caveats',
          text: 'In transaction pooling mode, session-level constructs like PREPARE statements and LISTEN/NOTIFY cannot be used across pooled connections.'
        }
      }
    ],
    4: [
      {
        id: 'mental-model',
        title: 'Architecture Decision Records: Senior Engineering Communication',
        summary: 'How principal engineers document context, options, and consequences to build durable consensus.',
        content: 'An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences. ADRs serve as the single source of truth for technical direction, onboarding, and architectural audits.',
        diagramAscii: `1. Title & Status ──> 2. Context & Problem Statement
                                      │
                                      ▼
                        3. Evaluated Architectural Options
                                      │
                                      ▼
                        4. Decision & Tradeoff Rationale
                                      │
                                      ▼
                        5. Positive & Negative Consequences`
      }
    ]
  };

  return systemSections[dayNumber] || systemSections[1];
}

export function getKnowledgeCheckForTask(skillTitle: string, dayNumber: number): PracticeKnowledgeQuestion[] {
  const normalizedSkill = skillTitle.toLowerCase();

  if (normalizedSkill.includes('next') || normalizedSkill.includes('react') || normalizedSkill.includes('front')) {
    const nextQuestions: Record<number, PracticeKnowledgeQuestion[]> = {
      1: [
        {
          id: 'q1',
          question: 'What is the primary operational difference between React Server Components and traditional Server-Side Rendering (SSR)?',
          options: [
            'RSC only works with static HTML files without JavaScript.',
            'RSC code never gets bundled into client JavaScript and streams directly over the wire, while classic SSR hydrates the entire component tree on the client.',
            'RSC requires WebSockets to be active for every user session.',
            'Classic SSR cannot fetch data from relational databases.'
          ],
          correctIndex: 1,
          explanation: 'React Server Components execute strictly on the server and stream a serialized flight payload. Because their source code never ships to the browser, bundle sizes remain constant regardless of component complexity.'
        },
        {
          id: 'q2',
          question: 'Why should Suspense boundaries be placed strategically around independent data-fetching components?',
          options: [
            'To prevent any CSS from loading until all components are ready.',
            'To allow fast layout components to render immediately while slow database queries stream in asynchronously without blocking the page.',
            'Suspense boundaries are required by modern web browsers for security isolation.',
            'They disable React reconciliation to increase frames per second.'
          ],
          correctIndex: 1,
          explanation: 'Suspense breaks monolithic page rendering into independent streaming chunks. Fast UI elements paint immediately, giving users instant interactivity while slower promises resolve in the background.'
        }
      ],
      2: [
        {
          id: 'q1',
          question: 'When implementing optimistic UI with useOptimistic, what must happen if the underlying Server Action returns an error?',
          options: [
            'The browser must force a hard reload of the current window.',
            'The client state machine must revert to the previous verified snapshot and present appropriate error feedback.',
            'The client should retry the mutation continuously in an infinite loop.',
            'All client-side cookies should be invalidated.'
          ],
          correctIndex: 1,
          explanation: 'Optimistic rendering is provisional. When a mutation fails on the server, the interface must roll back cleanly to the verified prior state to maintain data consistency and inform the user.'
        }
      ]
    };
    return nextQuestions[dayNumber] || nextQuestions[1];
  }

  if (normalizedSkill.includes('type') || normalizedSkill.includes('ts')) {
    const tsQuestions: Record<number, PracticeKnowledgeQuestion[]> = {
      1: [
        {
          id: 'q1',
          question: 'How do template literal types assist in building type-safe API clients?',
          options: [
            'They convert JavaScript objects into JSON strings at runtime.',
            'They parse string patterns like "/users/:id" at compile-time to extract strongly-typed parameter schemas without runtime overhead.',
            'They increase compiler execution speed by disabling type checks.',
            'They enforce camelCase naming across all variables.'
          ],
          correctIndex: 1,
          explanation: 'Template literal types allow TypeScript to pattern match string structure directly in the compiler, generating strict type definitions for parameters without requiring runtime regex parsers.'
        }
      ]
    };
    return tsQuestions[dayNumber] || tsQuestions[1];
  }

  const systemQuestions: Record<number, PracticeKnowledgeQuestion[]> = {
    1: [
      {
        id: 'q1',
        question: 'Why does setting an identical fixed TTL (such as exactly 300 seconds) across bulk cached entries create high production risk?',
        options: [
          'It causes memory allocation fragmentation within Redis key spaces.',
          'All keys expire at the exact same millisecond, triggering a cache stampede that overwhelms the primary database.',
          'Static TTLs cannot be serialized across network sockets.',
          'It causes HTTP proxy gateways to drop active client connections.'
        ],
        correctIndex: 1,
        explanation: 'When thousands of keys share an identical TTL, they expire simultaneously. Incoming requests all encounter cache misses at the same moment and flood the primary database with duplicate queries.'
      },
      {
        id: 'q2',
        question: 'What is the purpose of the NX (Not Exists) flag when acquiring a distributed cache lock in Redis?',
        options: [
          'It disables encryption on the cached payload for faster reads.',
          'It ensures the lock key is created only if it does not already exist, guaranteeing mutual exclusion between concurrent workers.',
          'It permanently locks the key until the Redis cluster is rebooted.',
          'It converts Redis strings into relational tables.'
        ],
        correctIndex: 1,
        explanation: 'The NX flag guarantees atomicity: only the first caller successfully acquires the lock. Subsequent callers fail immediately and enter a controlled backoff loop.'
      }
    ],
    2: [
      {
        id: 'q1',
        question: 'What is the primary danger of a network timeout occurring during an HTTP POST payment mutation?',
        options: [
          'The client web browser will automatically delete its local storage.',
          'The client cannot determine if the request succeeded or failed on the server, risking duplicate execution if retried without an idempotency key.',
          'The database transaction will automatically convert into a read-only query.',
          'The client IP address will be blacklisted by DNS providers.'
        ],
        correctIndex: 1,
        explanation: 'A timeout means the client received no response, but the server may have processed the charge. Without idempotency keys, an automatic retry would duplicate the charge.'
      }
    ],
    3: [
      {
        id: 'q1',
        question: 'Why should microservices connect to an intermediate connection pooler like PgBouncer instead of opening direct Postgres connections?',
        options: [
          'PgBouncer converts SQL into NoSQL document stores.',
          'Each Postgres connection consumes significant server RAM and OS processes; connection poolers multiplex thousands of application connections across a compact server pool.',
          'Postgres cannot handle more than 10 total queries per minute directly.',
          'PgBouncer automatically writes unit tests for database tables.'
        ],
        correctIndex: 1,
        explanation: 'PostgreSQL uses a process-per-connection model. Spawning thousands of microservice connections exhausts CPU memory and degrades query latency. Poolers multiplex connections efficiently.'
      }
    ],
    4: [
      {
        id: 'q1',
        question: 'What is the most critical element of an Architecture Decision Record (ADR)?',
        options: [
          'Listing the marketing benefits of the technology.',
          'Documenting the technical context, evaluated alternatives, and both positive and negative consequences of the chosen architecture.',
          'Guaranteeing that the chosen architecture will never need to be modified in the future.',
          'Listing every developer who voted against the decision.'
        ],
        correctIndex: 1,
        explanation: 'An ADR must be an objective technical document capturing context, rejected alternatives, and explicit tradeoffs so future engineers understand the engineering rationale.'
      }
    ]
  };

  return systemQuestions[dayNumber] || systemQuestions[1];
}
