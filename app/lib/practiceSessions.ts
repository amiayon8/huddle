import {
  SprintTask,
  PracticeVideoLesson,
  PracticeCourseSection,
  PracticeKnowledgeQuestion
} from '../types/huddle';
import {
  getVideoLessonForTask,
  getCourseSectionsForTask,
  getKnowledgeCheckForTask
} from './practiceCourseContent';

export type ExerciseType = 'code_workbench' | 'architecture_decision' | 'rfc_audit';

export interface DecisionOption {
  id: string;
  title: string;
  explanation: string;
  isOptimal: boolean;
  tradeoffAnalysis: string;
}

export interface TestCase {
  id: string;
  description: string;
  requiredPattern: string;
}

export interface AuditChecklistItem {
  id: string;
  item: string;
  impact: string;
}

export interface PracticeSessionContent {
  taskId: string;
  dayNumber: number;
  estimatedMinutes: number;
  skillTitle: string;
  taskTitle: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  videoLesson: PracticeVideoLesson;
  courseSections: PracticeCourseSection[];
  knowledgeCheck: PracticeKnowledgeQuestion[];
  briefing: {
    overview: string;
    mentalModel: string;
    keyPrinciples: string[];
    referenceCode?: string;
    referenceLanguage?: string;
  };
  exercise: {
    type: ExerciseType;
    instruction: string;
    scenario?: string;
    starterCode?: string;
    codeLanguage?: string;
    testCases?: TestCase[];
    decisionOptions?: DecisionOption[];
    auditChecklist?: AuditChecklistItem[];
  };
  artifactDraft: {
    title: string;
    type: 'code' | 'diagram' | 'summary' | 'live_demo';
    filename: string;
    snippet: string;
  };
}

type StaticCurriculumItem = Omit<
  PracticeSessionContent,
  | 'taskId'
  | 'creatorName'
  | 'creatorAvatar'
  | 'creatorHandle'
  | 'estimatedMinutes'
  | 'skillTitle'
  | 'dayNumber'
  | 'taskTitle'
  | 'videoLesson'
  | 'courseSections'
  | 'knowledgeCheck'
>;

const systemArchitectureCurriculum: Record<number, StaticCurriculumItem> = {
  1: {
    briefing: {
      overview: 'Distributed caching avoids database saturation by serving read-heavy workloads from memory. However, stale invalidation can cascade into cache stampedes and thundering herd conditions during high concurrency.',
      mentalModel: 'Treat the cache not merely as a key-value store, but as an eventually consistent projection governed by deterministic invalidation events and bounded stale read tolerances.',
      keyPrinciples: [
        'Prefer write-around or write-through strategies based on write:read ratios',
        'Incorporate jitter into TTL values to prevent coordinated key expiration',
        'Use distributed single-flight locks to serialize concurrent database regenerations'
      ],
      referenceCode: `interface CacheEnvelope<T> {
  data: T;
  version: number;
  staleAfterMs: number;
  ttlMs: number;
}

export async function getWithSingleFlight<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockAcquired = await redis.set(\`lock:\${key}\`, '1', 'EX', 5, 'NX');
  if (!lockAcquired) {
    await sleep(50);
    return getWithSingleFlight(key, fetchFn, ttlSeconds);
  }

  try {
    const fresh = await fetchFn();
    const jitter = Math.floor(Math.random() * 30);
    await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds + jitter);
    return fresh;
  } finally {
    await redis.del(\`lock:\${key}\`);
  }
}`,
      referenceLanguage: 'typescript'
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Complete the write-behind cache synchronizer to safeguard against cache stampedes and apply exponential jitter to keys.',
      scenario: 'You are refactoring an API gateway handling 45,000 queries per second. Sudden cache expiries are causing database CPU spikes.',
      starterCode: `export class TieredCacheManager {
  private redisClient: any;
  private primaryDb: any;

  constructor(redis: any, db: any) {
    this.redisClient = redis;
    this.primaryDb = db;
  }

  async retrieveWithProtection(entityId: string): Promise<any> {
    const cacheKey = \`entity:\${entityId}\`;
    const cachedRecord = await this.redisClient.get(cacheKey);
    
    if (cachedRecord) {
      return JSON.parse(cachedRecord);
    }

    const lockKey = \`lock:\${cacheKey}\`;
    const lockAcquired = await this.redisClient.set(lockKey, 'active', 'EX', 5, 'NX');

    if (!lockAcquired) {
      await new Promise(r => setTimeout(r, 60));
      return this.retrieveWithProtection(entityId);
    }

    try {
      const freshData = await this.primaryDb.findById(entityId);
      
      const jitterSeconds = Math.floor(Math.random() * 30) + 15;
      const effectiveTtl = 300 + jitterSeconds;

      await this.redisClient.set(cacheKey, JSON.stringify(freshData), 'EX', effectiveTtl);
      return freshData;
    } finally {
      await this.redisClient.del(lockKey);
    }
  }
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Acquires distributed lock with SET NX and protective TTL',
          requiredPattern: 'SET|set\\(lockKey|NX'
        },
        {
          id: 'test-2',
          description: 'Calculates non-zero TTL jitter to prevent thundering herd',
          requiredPattern: 'jitter|Math\\.random'
        },
        {
          id: 'test-3',
          description: 'Ensures lock cleanup in finally block',
          requiredPattern: 'finally|del\\(lockKey\\)'
        }
      ]
    },
    artifactDraft: {
      title: 'Distributed Cache Topology Blueprint',
      type: 'code',
      filename: 'TieredCacheManager.ts',
      snippet: `export class TieredCacheManager {
  constructor(private redis: any, private db: any) {}

  async retrieveWithProtection(entityId: string): Promise<any> {
    const key = \`entity:\${entityId}\`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const lockKey = \`lock:\${key}\`;
    const acquired = await this.redis.set(lockKey, '1', 'EX', 5, 'NX');
    if (!acquired) {
      await new Promise(res => setTimeout(res, 60));
      return this.retrieveWithProtection(entityId);
    }

    try {
      const fresh = await this.db.findById(entityId);
      const jitter = Math.floor(Math.random() * 30) + 15;
      await this.redis.set(key, JSON.stringify(fresh), 'EX', 300 + jitter);
      return fresh;
    } finally {
      await this.redis.del(lockKey);
    }
  }
}`
    }
  },
  2: {
    briefing: {
      overview: 'Network retries and distributed clients inevitably produce duplicate requests. Without idempotent handlers, financial transfers and inventory reservations can execute multiple times.',
      mentalModel: 'Every state-mutating request must carry a client-generated UUID as an idempotency key. The server registers key ownership atomically before executing operations.',
      keyPrinciples: [
        'Store completed responses alongside idempotency keys for instant replay',
        'Distinguish between In-Flight and Completed states to return HTTP 409 or 425 on concurrent duplicates',
        'Always set strict TTLs on idempotency tokens (typically 24 to 72 hours)'
      ],
      referenceCode: `export async function handleIdempotentRequest(
  key: string,
  handler: () => Promise<TransactionResult>
): Promise<TransactionResult> {
  const existing = await idempotencyStore.lookup(key);
  if (existing?.status === 'COMPLETED') {
    return existing.response;
  }
  if (existing?.status === 'IN_PROGRESS') {
    throw new ConcurrentConflictError('Request already being processed');
  }

  await idempotencyStore.reserve(key, 'IN_PROGRESS', 60);
  try {
    const result = await handler();
    await idempotencyStore.complete(key, result, 86400);
    return result;
  } catch (err) {
    await idempotencyStore.release(key);
    throw err;
  }
}`,
      referenceLanguage: 'typescript'
    },
    exercise: {
      type: 'architecture_decision',
      instruction: 'Select the optimal idempotency reservation strategy when handling rapid duplicate webhooks under degraded database conditions.',
      scenario: 'A payment gateway sends duplicate webhook events within 12 milliseconds of each other. The primary PostgreSQL database is currently at 88% connection pool capacity.',
      decisionOptions: [
        {
          id: 'opt-1',
          title: 'Database UNIQUE constraint on transaction_id within PostgreSQL',
          explanation: 'Rely on database transaction rollback when duplicate key error 23505 is raised.',
          isOptimal: false,
          tradeoffAnalysis: 'Increases connection contention on an already saturated primary database and incurs transaction rollback overhead for every duplicate.'
        },
        {
          id: 'opt-2',
          title: 'Fast Redis SET NX atomic reservation with 24-hour response caching',
          explanation: 'Check and reserve idempotency token in memory first. Replay cached response immediately if already completed.',
          isOptimal: true,
          tradeoffAnalysis: 'Offloads write pressure from PostgreSQL entirely. Sub-millisecond checks prevent duplicate pipeline runs while guaranteeing exactly-once execution.'
        },
        {
          id: 'opt-3',
          title: 'In-memory Node.js process Map lookup',
          explanation: 'Hold processed UUIDs in a local process Map for fast verification.',
          isOptimal: false,
          tradeoffAnalysis: 'Fails immediately in containerized or multi-instance deployments where duplicate requests hit different instances.'
        }
      ]
    },
    artifactDraft: {
      title: 'Idempotency Guard State Machine',
      type: 'code',
      filename: 'IdempotencyGuard.ts',
      snippet: `export class IdempotencyGuard {
  async executeWithIdempotency<T>(
    idempotencyKey: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const lock = await redis.set(\`idemp:\${idempotencyKey}\`, 'PROCESSING', 'EX', 120, 'NX');
    if (!lock) {
      const status = await redis.get(\`idemp:\${idempotencyKey}\`);
      if (status && status !== 'PROCESSING') {
        return JSON.parse(status);
      }
      throw new Error('Concurrent mutation in progress');
    }

    try {
      const result = await operation();
      await redis.set(\`idemp:\${idempotencyKey}\`, JSON.stringify(result), 'EX', 86400);
      return result;
    } catch (error) {
      await redis.del(\`idemp:\${idempotencyKey}\`);
      throw error;
    }
  }
}`
    }
  },
  3: {
    briefing: {
      overview: 'Long-running distributed transactions spanning multiple services cannot rely on two-phase commit (2PC) at web scale. Saga orchestration decouples operations through asynchronous events and explicit compensating actions.',
      mentalModel: 'Every forward step in a distributed transaction must have an inverse compensating step capable of reversing its side effects if subsequent stages fail.',
      keyPrinciples: [
        'Compensating actions must themselves be strictly idempotent',
        'Dead-letter queues (DLQ) are mandatory for events that fail maximum retry thresholds',
        'State transitions must be persisted in an append-only outbox before publication'
      ],
      referenceCode: `interface SagaStep<TContext> {
  name: string;
  forward: (ctx: TContext) => Promise<void>;
  compensate: (ctx: TContext) => Promise<void>;
}

export async function executeSaga<TContext>(
  steps: SagaStep<TContext>[],
  context: TContext
): Promise<void> {
  const executedSteps: SagaStep<TContext>[] = [];

  for (const step of steps) {
    try {
      await step.forward(context);
      executedSteps.push(step);
    } catch (err) {
      for (const executed of executedSteps.reverse()) {
        await executed.compensate(context);
      }
      throw err;
    }
  }
}`,
      referenceLanguage: 'typescript'
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Implement the reverse compensation loop to rollback completed steps in reverse order when a step fails.',
      scenario: 'An order checkout saga has reserved inventory and applied promotional credits, but payment charging fails. We must rollback in exact reverse order.',
      starterCode: `export interface SagaAction {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export async function runSagaCoordinator(actions: SagaAction[]): Promise<boolean> {
  const completedActions: SagaAction[] = [];

  for (const action of actions) {
    try {
      await action.execute();
      completedActions.push(action);
    } catch (failure) {
      const reverseList = [...completedActions].reverse();
      for (const compensatingAction of reverseList) {
        try {
          await compensatingAction.compensate();
        } catch (compensationError) {
          console.error('DLQ routing required:', compensatingAction.name);
        }
      }
      return false;
    }
  }

  return true;
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Tracks executed actions in an append-only array',
          requiredPattern: 'completedActions\\.push'
        },
        {
          id: 'test-2',
          description: 'Reverses executed actions prior to compensation',
          requiredPattern: 'reverse\\(\\)'
        },
        {
          id: 'test-3',
          description: 'Safely handles compensation exceptions without dropping state',
          requiredPattern: 'catch|compensat'
        }
      ]
    },
    artifactDraft: {
      title: 'Saga Compensating Orchestrator Blueprint',
      type: 'code',
      filename: 'DistributedSagaOrchestrator.ts',
      snippet: `export class SagaCoordinator<TContext> {
  private history: string[] = [];

  async run(steps: Array<{ name: string; exec: (c: TContext) => Promise<void>; rollback: (c: TContext) => Promise<void> }>, ctx: TContext) {
    const executed: typeof steps = [];
    for (const step of steps) {
      try {
        await step.exec(ctx);
        executed.push(step);
      } catch (err) {
        for (const done of executed.reverse()) {
          await done.rollback(ctx);
        }
        throw err;
      }
    }
  }
}`
    }
  },
  4: {
    briefing: {
      overview: 'Translating architecture into production requires peer review through clear Request for Comments (RFC) documents. A strong RFC addresses failure modes, operational costs, and rollout stages.',
      mentalModel: 'An engineering RFC is an agreement on constraints and tradeoffs before code is written, ensuring team-wide alignment.',
      keyPrinciples: [
        'Document non-goals explicitly to maintain project scope',
        'Quantify availability and recovery objectives (SLO, RTO, RPO)',
        'Detail canary deployment and automated rollback triggers'
      ]
    },
    exercise: {
      type: 'rfc_audit',
      instruction: 'Audit and approve the technical architecture specification for the event-driven ingestion pipeline.',
      scenario: 'Review the high-throughput architecture RFC before final sign-off and deployment to production clusters.',
      auditChecklist: [
        {
          id: 'audit-1',
          item: 'Idempotent ingestion consumer keys mapped to distributed Redis cache with 48-hour TTL',
          impact: 'Prevents duplicate billing charges during network retry spikes'
        },
        {
          id: 'audit-2',
          item: 'Single-flight mutex locks on primary read caches to eliminate thundering herd',
          impact: 'Eliminates PostgreSQL connection exhaustion during cold cache startups'
        },
        {
          id: 'audit-3',
          item: 'Dead-letter queue with exponential retry backoff and automated alerting',
          impact: 'Guarantees zero silent message loss when external payment APIs degrade'
        },
        {
          id: 'audit-4',
          item: 'Automated canary rollout strategy with p99 latency threshold of 120ms',
          impact: 'Ensures degraded releases automatically revert within 30 seconds'
        }
      ]
    },
    artifactDraft: {
      title: 'High-Throughput Ingestion Architecture RFC',
      type: 'summary',
      filename: 'RFC-402-Ingestion-Pipeline.md',
      snippet: `# RFC 402: Resilient Event Ingestion Architecture
## Abstract
Production architecture delivering 50,000 requests per second with strict idempotency and zero database connection exhaustion.

## Key Architectural Decisions
1. In-Memory Token Fencing: Redis NX locks ensure duplicate payloads return cached envelopes.
2. Single-Flight Cache Warmers: Serialized database queries reduce cache stampede overhead by 94%.
3. Saga Compensation: Asynchronous outbox pattern guarantees eventual consistency across independent microservices.

## Verification & Rollout
- Canary Phase 1: 5% traffic split evaluated against 120ms p99 latency threshold.
- Disaster Recovery: Bounded dead-letter processing preserves poison pill diagnostics.`
    }
  }
};

const nextjsCurriculum: Record<number, StaticCurriculumItem> = {
  1: {
    briefing: {
      overview: 'React Server Components execute entirely on the server and stream serialized UI over HTTP. By avoiding client bundle bloat, applications maintain instant initial loads regardless of library size.',
      mentalModel: 'Server components render into an immutable virtual DOM stream. Client components sit as interactive leaves that hydrate without re-fetching server data.',
      keyPrinciples: [
        'Keep data fetching directly inside Server Components without useEffect',
        'Wrap asynchronous children in Suspense boundaries for progressive streaming',
        'Never pass non-serializable objects (like functions) across the server-client boundary'
      ],
      referenceCode: `import { Suspense } from 'react';
import { AnalyticsChart } from './AnalyticsChart';
import { SkeletonLoader } from './SkeletonLoader';

export default async function DashboardPage() {
  const profile = await fetchUserProfile();

  return (
    <section>
      <h1>Welcome {profile.name}</h1>
      <Suspense fallback={<SkeletonLoader />}>
        <StreamingAnalyticsFeed userId={profile.id} />
      </Suspense>
    </section>
  );
}`,
      referenceLanguage: 'typescript'
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Refactor the data loading boundary to stream high-latency analytics through a Suspense wrapper while rendering core profile headers instantly.',
      scenario: 'The team dashboard is blocked waiting 1.4 seconds for analytics queries. Users should see their profile header immediately while charts stream in.',
      starterCode: `import React, { Suspense } from 'react';

export default async function TeamDashboard({ teamId }: { teamId: string }) {
  const team = await fetchTeamMetadata(teamId);

  return (
    <div className="space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-xl font-bold">{team.name}</h1>
        <p className="text-sm text-zinc-500">Owner: {team.leadEmail}</p>
      </header>

      <Suspense fallback={<div className="h-32 animate-pulse bg-zinc-100 rounded-xl" />}>
        <AsyncMetricsStream teamId={teamId} />
      </Suspense>
    </div>
  );
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Uses Suspense wrapper for deferred async component',
          requiredPattern: '<Suspense'
        },
        {
          id: 'test-2',
          description: 'Provides responsive skeleton fallback UI',
          requiredPattern: 'fallback='
        },
        {
          id: 'test-3',
          description: 'Keeps synchronous header rendering immediate',
          requiredPattern: 'team\\.name'
        }
      ]
    },
    artifactDraft: {
      title: 'Next.js Progressive Streaming Architecture Blueprint',
      type: 'code',
      filename: 'ProgressiveStreamLayout.tsx',
      snippet: `import React, { Suspense } from 'react';

export default async function StreamingLayout({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Workspace: {user.name}</h1>
      <Suspense fallback={<div className="h-48 bg-zinc-800 animate-pulse rounded-2xl" />}>
        <AsyncActivityStream userId={userId} />
      </Suspense>
    </main>
  );
}`
    }
  },
  2: {
    briefing: {
      overview: 'Optimistic UI updates make applications feel instantaneous by applying state mutations to the client interface before the server response completes.',
      mentalModel: 'Apply the desired end-state immediately. If the server transaction fails, revert cleanly to the snapshot taken prior to mutation.',
      keyPrinciples: [
        'Use React useOptimistic to isolate speculative states cleanly',
        'Handle network dropouts with graceful rollback toast notifications',
        'Keep optimistic actions idempotent on the backend'
      ]
    },
    exercise: {
      type: 'architecture_decision',
      instruction: 'Select the correct error rollback approach when an optimistic database mutation fails due to a network timeout.',
      scenario: 'A user marks a task complete. The client UI strikes through the task immediately, but the server mutation times out after 8 seconds.',
      decisionOptions: [
        {
          id: 'opt-1',
          title: 'Silently swallow the error to preserve the user feeling of speed',
          explanation: 'Leave the task crossed out and hope background sync updates later.',
          isOptimal: false,
          tradeoffAnalysis: 'Causes silent data loss and state divergence between browser and persistent database.'
        },
        {
          id: 'opt-2',
          title: 'Revert speculative state to last known good snapshot and show retry banner',
          explanation: 'Rollback useOptimistic state to the confirmed snapshot and provide a one-click retry trigger.',
          isOptimal: true,
          tradeoffAnalysis: 'Preserves integrity while being completely transparent with the engineer without forcing a disruptive full-page reload.'
        },
        {
          id: 'opt-3',
          title: 'Force an immediate hard page reload via window.location.reload()',
          explanation: 'Clear all client state and force fresh server render.',
          isOptimal: false,
          tradeoffAnalysis: 'Destroys unsaved form inputs, disrupts user flow, and degrades experience.'
        }
      ]
    },
    artifactDraft: {
      title: 'Optimistic State Mutation Pattern',
      type: 'code',
      filename: 'OptimisticTaskManager.ts',
      snippet: `import { useOptimistic, useTransition } from 'react';

export function useOptimisticTaskList(initialTasks: Array<{ id: string; done: boolean }>) {
  const [isPending, startTransition] = useTransition();
  const [tasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, updatedId: string) =>
      state.map(t => t.id === updatedId ? { ...t, done: !t.done } : t)
  );

  const toggleTask = (id: string) => {
    startTransition(async () => {
      setOptimisticTasks(id);
      try {
        await mutateServerAction(id);
      } catch (err) {
      }
    });
  };

  return { tasks, toggleTask, isPending };
}`
    }
  },
  3: {
    briefing: {
      overview: 'Route Handlers running on Edge runtimes provide ultra-low latency API endpoints close to end users. Managing cache headers like stale-while-revalidate balances freshness with sub-10ms response times.',
      mentalModel: 'Serve stale content instantly from edge points of presence while revalidating data asynchronously in the background.',
      keyPrinciples: [
        'Use Cache-Control: s-maxage=60, stale-while-revalidate=600 for high-read APIs',
        'Avoid dynamic headers like cookies or authorization when caching public responses',
        'Use Next.js revalidateTag for surgical cache purging'
      ]
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Configure the Edge Route Handler response headers to allow stale caching for 10 minutes while serving fresh data within 30 seconds.',
      scenario: 'You are authoring a public creator leaderboard endpoint hit 200,000 times per minute.',
      starterCode: `import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const creators = await fetchTopRankedCreators();

  return NextResponse.json(creators, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=600',
      'CDN-Cache-Control': 'max-age=600'
    }
  });
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Declares edge runtime target',
          requiredPattern: "runtime\\s*=\\s*'edge'"
        },
        {
          id: 'test-2',
          description: 'Includes stale-while-revalidate header directive',
          requiredPattern: 'stale-while-revalidate'
        },
        {
          id: 'test-3',
          description: 'Uses NextResponse.json with custom header dictionary',
          requiredPattern: 'NextResponse\\.json|headers'
        }
      ]
    },
    artifactDraft: {
      title: 'Stale-While-Revalidate Edge Route Specification',
      type: 'code',
      filename: 'edgeMetricsRoute.ts',
      snippet: `import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const data = await getLeaderboard();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=600',
      'CDN-Cache-Control': 'max-age=600'
    }
  });
}`
    }
  },
  4: {
    briefing: {
      overview: 'Shipping open-source pull requests requires clear architectural rationale, benchmark comparisons, and clean TypeScript typings.',
      mentalModel: 'Every pull request should prove how the change improves performance or developer ergonomics without breaking existing contracts.',
      keyPrinciples: [
        'Include reproducible before-and-after performance metrics',
        'Demonstrate zero hydration mismatches across server and client boundaries',
        'Provide automated unit and integration tests'
      ]
    },
    exercise: {
      type: 'rfc_audit',
      instruction: 'Review and sign off on the open-source Next.js streaming layout optimization pull request.',
      scenario: 'Verify PR #412 reducing initial bundle size by 42% and eliminating layout reflows.',
      auditChecklist: [
        {
          id: 'audit-1',
          item: 'Zero bundle regression: Server-only packages excluded from client bundle analyzer output',
          impact: 'Reduces JavaScript payload delivered to mobile devices by 78kb'
        },
        {
          id: 'audit-2',
          item: 'Deterministic Suspense fallback heights preventing cumulative layout shift (CLS)',
          impact: 'Maintains perfect 0.00 CLS rating across all lighthouse audits'
        },
        {
          id: 'audit-3',
          item: 'Stale-while-revalidate edge cache headers verified against Vercel Edge Network',
          impact: 'Guarantees sub-15ms TTFB globally for cached routes'
        }
      ]
    },
    artifactDraft: {
      title: 'Next.js Streaming PR #412',
      type: 'summary',
      filename: 'PR-412-Streaming-Architecture.md',
      snippet: `# Pull Request #412: Progressive Streaming SSR & Edge Caching
## Summary
Refactors dashboard layouts to stream async widgets via React Suspense and edge caching.

## Benchmark Results
- Initial Bundle Size: 242kb -> 164kb (-32%)
- Time to First Byte (TTFB): 340ms -> 18ms (-94%)
- Cumulative Layout Shift: 0.00 (Perfect rating)

## Verification
Automated test suite passing across Chromium, WebKit, and Firefox with zero hydration warnings.`
    }
  }
};

const typescriptCurriculum: Record<number, StaticCurriculumItem> = {
  1: {
    briefing: {
      overview: 'Template literal types allow compile-time pattern matching and string validation. They enable type-safe routing, event buses, and domain-driven design without runtime overhead.',
      mentalModel: 'Think of template literal types as regular expressions evaluated entirely by the TypeScript type checker at authoring time.',
      keyPrinciples: [
        'Use template literals to parse string routes into typed parameter records',
        'Combine unions with template literals for combinatorial variant generation',
        'Avoid infinite recursion by capping template extraction depths'
      ]
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Implement a type-safe route parameter extractor that infers path params from route strings.',
      scenario: 'You are authoring a typed HTTP framework where path params like /users/:userId/posts/:postId are automatically typed.',
      starterCode: `export type ExtractRouteParams<T extends string> =
  T extends \`\${string}/:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractRouteParams<\`/\${Rest}\`>]: string }
    : T extends \`\${string}/:\${infer Param}\`
    ? { [K in Param]: string }
    : Record<string, never>;

export type UserRoute = ExtractRouteParams<'/teams/:teamId/members/:memberId'>;`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Uses infer keyword inside template literal pattern',
          requiredPattern: 'infer\\s+Param'
        },
        {
          id: 'test-2',
          description: 'Recursively extracts nested parameters across multiple path segments',
          requiredPattern: 'ExtractRouteParams'
        },
        {
          id: 'test-3',
          description: 'Resolves to clean Record when no parameters exist',
          requiredPattern: 'Record<string,\\s*never>|{}'
        }
      ]
    },
    artifactDraft: {
      title: 'Typed URL Route Path Extraction Utility',
      type: 'code',
      filename: 'TypeSafeRouteParser.ts',
      snippet: `export type ExtractRouteParams<T extends string> =
  T extends \`\${string}/:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractRouteParams<\`/\${Rest}\`>]: string }
    : T extends \`\${string}/:\${infer Param}\`
    ? { [K in Param]: string }
    : Record<string, never>;`
    }
  },
  2: {
    briefing: {
      overview: 'Conditional types and the infer keyword allow extracting inner types from Promises, arrays, and complex function signatures.',
      mentalModel: 'Conditional types behave like ternary operators for types: T extends U ? TrueBranch : FalseBranch.',
      keyPrinciples: [
        'Use infer only within the true branch of a conditional type',
        'Distribute over union types automatically unless wrapped in tuples [T]',
        'Never use any when unboxing generic parameters'
      ]
    },
    exercise: {
      type: 'architecture_decision',
      instruction: 'Choose the most robust implementation to deeply unwrap Promise return types in asynchronous pipelines.',
      scenario: 'You need an unwrap utility that extracts T from Promise<Promise<T>> or Promise<T> recursively.',
      decisionOptions: [
        {
          id: 'opt-1',
          title: 'type DeepAwaited<T> = T extends any ? T : never',
          explanation: 'Bypass type checking and allow any return value.',
          isOptimal: false,
          tradeoffAnalysis: 'Destroys strict type safety and introduces any leaks into downstream applications.'
        },
        {
          id: 'opt-2',
          title: 'type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T',
          explanation: 'Recursively unpack inner Promise types using infer until a scalar or concrete object is reached.',
          isOptimal: true,
          tradeoffAnalysis: 'Handles arbitrarily nested Promises correctly at compile-time while preserving full object shape integrity.'
        },
        {
          id: 'opt-3',
          title: 'type DeepAwaited<T> = ReturnType<typeof Promise.resolve<T>>',
          explanation: 'Rely on runtime method signatures.',
          isOptimal: false,
          tradeoffAnalysis: 'Fails to resolve nested Promises and creates invalid runtime type assertions.'
        }
      ]
    },
    artifactDraft: {
      title: 'Deep Nested Promise Unpacking Utility',
      type: 'code',
      filename: 'DeepPromiseUnwrapper.ts',
      snippet: `export type DeepUnwrap<T> = T extends Promise<infer U>
  ? DeepUnwrap<U>
  : T;

export type ExtractInnerRecord<T> = T extends Record<string, infer V>
  ? V
  : never;`
    }
  },
  3: {
    briefing: {
      overview: 'Discriminated unions provide compile-time exhaustiveness checking. By tagging variants with a shared literal field, TypeScript guarantees all states are handled.',
      mentalModel: 'A single tag field (e.g. type or status) distinguishes polymorphic structures with complete compile-time validation.',
      keyPrinciples: [
        'Always include an assertUnreachable(x: never) helper in default switch branches',
        'Never use type casting (as Type) to bypass variant checks',
        'Ensure the discriminator property is a string or symbol literal'
      ]
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Complete the exhaustive state machine handler with a compile-time never check for unhandled event types.',
      scenario: 'We are building a payment state reducer. Missing an event type should fail compilation before code reaches production.',
      starterCode: `export type PaymentEvent =
  | { type: 'AUTHORIZED'; amount: number }
  | { type: 'CAPTURED'; transactionId: string }
  | { type: 'REFUNDED'; reason: string; amount: number };

export function assertUnreachable(value: never): never {
  throw new Error(\`Unhandled union variant: \${JSON.stringify(value)}\`);
}

export function handlePaymentEvent(event: PaymentEvent): string {
  switch (event.type) {
    case 'AUTHORIZED':
      return \`Authorized $\${event.amount}\`;
    case 'CAPTURED':
      return \`Captured txn \${event.transactionId}\`;
    case 'REFUNDED':
      return \`Refunded $\${event.amount} for \${event.reason}\`;
    default:
      return assertUnreachable(event);
  }
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Contains assertUnreachable helper typed with never',
          requiredPattern: 'assertUnreachable.*never'
        },
        {
          id: 'test-2',
          description: 'Handles all union variants in switch branches',
          requiredPattern: "case\\s+'AUTHORIZED'.*case\\s+'CAPTURED'.*case\\s+'REFUNDED'"
        },
        {
          id: 'test-3',
          description: 'Enforces exhaustiveness check in default branch',
          requiredPattern: 'default:.*assertUnreachable'
        }
      ]
    },
    artifactDraft: {
      title: 'Exhaustive Discriminated Union Handler Blueprint',
      type: 'code',
      filename: 'ExhaustivePatternMatcher.ts',
      snippet: `export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: Error };

export function assertNever(x: never): never {
  throw new Error('Unexpected variant');
}

export function renderState(s: AppState): string {
  switch (s.status) {
    case 'idle': return 'Idle';
    case 'loading': return 'Loading';
    case 'success': return 'Complete';
    case 'error': return 'Failed';
    default: return assertNever(s);
  }
}`
    }
  },
  4: {
    briefing: {
      overview: 'Publishing production TypeScript packages requires strict compiler flags, declaration map generation, and dual ESM/CJS exports.',
      mentalModel: 'A production SDK package must have zero leaks of any or unknown to consumer codebases.',
      keyPrinciples: [
        'Enforce strict: true, noImplicitAny: true, and exactOptionalPropertyTypes: true',
        'Generate declaration maps (.d.ts.map) so consumers can jump to source definitions',
        'Verify package.json exports map for modern module resolution'
      ]
    },
    exercise: {
      type: 'rfc_audit',
      instruction: 'Audit and approve the type-safe SDK package release verification checklist.',
      scenario: 'Review package configuration before pushing version 1.0.0 to the npm registry.',
      auditChecklist: [
        {
          id: 'audit-1',
          item: 'Zero any or unknown leaks in public exported interfaces and function parameters',
          impact: 'Prevents consumer projects from losing strict type safety'
        },
        {
          id: 'audit-2',
          item: 'Declaration maps and source files bundled for seamless IDE jump-to-definition',
          impact: 'Dramatically improves developer experience and debugging velocity'
        },
        {
          id: 'audit-3',
          item: 'Exhaustive automated type tests written with tsd or @ts-expect-error',
          impact: 'Guarantees subsequent pull requests cannot introduce breaking type regressions'
        }
      ]
    },
    artifactDraft: {
      title: 'Type-Safe Utility Module #78',
      type: 'summary',
      filename: 'SDK-Release-Checklist.md',
      snippet: `# Type-Safe SDK Package v1.0.0 Verification
## Verification Sign-Off
- Strict Compilation: 100% pass under TypeScript 5.5 strict mode.
- Export Definitions: Dual ESM and CommonJS exports validated across Node.js 18+ and modern bundlers.
- Type Assertions: Zero public any types detected in automated type regression audits.`
    }
  }
};

const uiEngineeringCurriculum: Record<number, StaticCurriculumItem> = {
  1: {
    briefing: {
      overview: 'Modern design token architecture separates raw hex codes from semantic intent. Fluid clamp scales ensure typographic hierarchy scales smoothly between mobile and 4K displays without arbitrary media queries.',
      mentalModel: 'Tokens define design tokens as semantic variables (e.g. text-primary, bg-surface) instead of static values.',
      keyPrinciples: [
        'Use CSS clamp() for viewport-aware typography and spacing',
        'Guarantee 4.5:1 WCAG contrast ratios across both light and dark themes',
        'Keep token definitions centralized in CSS custom properties'
      ]
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Implement a semantic design token palette with fluid clamp typography and WCAG compliant theme variables.',
      scenario: 'Establish the foundation design tokens for a cross-platform design system.',
      starterCode: `:root {
  --font-hero: clamp(2rem, 1.5rem + 2.5vw, 3.75rem);
  --font-h1: clamp(1.5rem, 1.25rem + 1.5vw, 2.5rem);
  --font-body: clamp(0.875rem, 0.85rem + 0.25vw, 1rem);

  --bg-surface: #ffffff;
  --bg-canvas: #f8f9fc;
  --text-primary: #090a0f;
  --text-secondary: #52525b;
}

[data-theme='dark'] {
  --bg-surface: #111218;
  --bg-canvas: #090a0f;
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
}`,
      codeLanguage: 'css',
      testCases: [
        {
          id: 'test-1',
          description: 'Uses clamp function for responsive fluid scaling',
          requiredPattern: 'clamp\\('
        },
        {
          id: 'test-2',
          description: 'Defines dark theme semantic tokens via data-theme selector',
          requiredPattern: "\\[data-theme='dark'\\]"
        },
        {
          id: 'test-3',
          description: 'Uses semantic token names rather than literal colors',
          requiredPattern: '--text-primary|--bg-surface'
        }
      ]
    },
    artifactDraft: {
      title: 'Semantic Design Token Palette',
      type: 'code',
      filename: 'designTokens.css',
      snippet: `:root {
  --font-display: clamp(1.75rem, 1.25rem + 2vw, 3rem);
  --font-body: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --bg-surface: #ffffff;
  --text-primary: #18181b;
}
[data-theme='dark'] {
  --bg-surface: #111218;
  --text-primary: #fafafa;
}`
    }
  },
  2: {
    briefing: {
      overview: 'Animating properties like width, height, top, or left triggers expensive browser layout reflows and repaints. Restricting animations to transform and opacity enables GPU composition at 60 frames per second.',
      mentalModel: 'Animate only what the GPU can composite without asking the browser engine to recalculate geometric page layout.',
      keyPrinciples: [
        'Animate strictly transform and opacity for fluid 60fps',
        'Honor prefers-reduced-motion media query for accessibility',
        'Use spring physics curves rather than linear timing functions'
      ]
    },
    exercise: {
      type: 'architecture_decision',
      instruction: 'Select the optimal technique to animate a modal sheet opening from the bottom of the screen.',
      scenario: 'You are implementing an animated sheet modal on mobile devices with budget processors.',
      decisionOptions: [
        {
          id: 'opt-1',
          title: 'Animate bottom property from -100% to 0% with CSS ease-in-out',
          explanation: 'Directly transition the positioning property.',
          isOptimal: false,
          tradeoffAnalysis: 'Triggers layout recalculation on every animation tick, causing stuttering and dropped frames on low-powered mobile devices.'
        },
        {
          id: 'opt-2',
          title: 'Translate Y via transform: translateY(100%) to translateY(0) with will-change: transform',
          explanation: 'Composite layer directly on GPU and slide along Y axis.',
          isOptimal: true,
          tradeoffAnalysis: 'Bypasses layout and paint cycles entirely. Runs on the GPU compositor thread for a locked 60fps experience.'
        },
        {
          id: 'opt-3',
          title: 'Animate height from 0px to 600px with JavaScript requestAnimationFrame',
          explanation: 'Iteratively recalculate modal height.',
          isOptimal: false,
          tradeoffAnalysis: 'Forces continuous geometry recalculations across all sibling and parent DOM elements.'
        }
      ]
    },
    artifactDraft: {
      title: 'GPU-Accelerated Modal Motion',
      type: 'code',
      filename: 'gpuMotionStyles.css',
      snippet: `.modal-sheet {
  will-change: transform, opacity;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out;
}
.modal-sheet.open {
  transform: translateY(0);
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .modal-sheet {
    transition: none;
    transform: none;
  }
}`
    }
  },
  3: {
    briefing: {
      overview: 'Accessible interfaces allow seamless navigation via keyboard without mouse interaction. Modal dialogs must trap focus within their boundaries and return focus to the trigger element upon closing.',
      mentalModel: 'A modal dialog must form a sealed focus loop: tabbing forward from the last element wraps to the first, and pressing Escape dismisses the view.',
      keyPrinciples: [
        'Store document.activeElement before opening to restore focus cleanly upon exit',
        'Trap Tab and Shift+Tab within the dialog elements',
        'Listen for the Escape key and announce status via aria-live regions'
      ]
    },
    exercise: {
      type: 'code_workbench',
      instruction: 'Implement keyboard focus trapping and Escape key dismissal for accessible dialog windows.',
      scenario: 'You are auditing a modal component to achieve full WCAG 2.1 AA keyboard compliance.',
      starterCode: `export function useFocusTrap(modalRef: React.RefObject<HTMLDivElement>, isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const previousFocus = document.activeElement as HTMLElement;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose, modalRef]);
}`,
      codeLanguage: 'typescript',
      testCases: [
        {
          id: 'test-1',
          description: 'Restores prior active element upon unmount',
          requiredPattern: 'previousFocus\\?\\.focus\\(\\)'
        },
        {
          id: 'test-2',
          description: 'Traps Tab key between first and last focusable elements',
          requiredPattern: 'shiftKey.*firstElement|lastElement'
        },
        {
          id: 'test-3',
          description: 'Handles Escape key dismissal',
          requiredPattern: "key\\s*===\\s*'Escape'"
        }
      ]
    },
    artifactDraft: {
      title: 'WCAG Accessible Modal Focus Trap Hook',
      type: 'code',
      filename: 'useAccessibleFocusTrap.ts',
      snippet: `import { useEffect, useRef } from 'react';

export function useFocusTrap(containerRef: any, active: boolean, onExit: () => void) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const prev = document.activeElement as HTMLElement;
    const items = containerRef.current.querySelectorAll('button, a, input');
    items[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [active, onExit]);
}`
    }
  },
  4: {
    briefing: {
      overview: 'Delivering design system component libraries requires comprehensive accessibility audits and automated visual regression testing.',
      mentalModel: 'An accessible component passes automated tests, keyboard interaction tests, and screen reader verification before shipping.',
      keyPrinciples: [
        'Zero axe-core automated accessibility violations',
        'High-contrast mode support via currentColor and forced-colors media query',
        'Visible focus rings with high contrast outline-offset'
      ]
    },
    exercise: {
      type: 'rfc_audit',
      instruction: 'Audit and approve the accessible UI component system pull request.',
      scenario: 'Review the design system release candidate for full WCAG AA compliance.',
      auditChecklist: [
        {
          id: 'audit-1',
          item: 'Full keyboard navigation with circular focus traps on dialogs and menus',
          impact: 'Enables complete navigation for keyboard-only and motor-impaired users'
        },
        {
          id: 'audit-2',
          item: 'Visible focus indicators with 2px contrast ring and 2px outline offset',
          impact: 'Meets WCAG 2.2 Focus Appearance criteria across both dark and light modes'
        },
        {
          id: 'audit-3',
          item: 'Zero layout shift GPU composited animations with reduced motion fallback',
          impact: 'Protects users sensitive to motion sickness while maintaining 60fps performance'
        }
      ]
    },
    artifactDraft: {
      title: 'Accessible UI Component PR #204',
      type: 'summary',
      filename: 'PR-204-Accessible-Design-System.md',
      snippet: `# Pull Request #204: Accessible Component System
## Highlights
- Keyboard Usability: Full focus management with automatic return to trigger.
- Color Contrast: 100% WCAG AAA compliant palette on dark and light surfaces.
- Automated Testing: Zero accessibility violations across 48 automated test suites.`
    }
  }
};

export function getPracticeSessionForTask(task: SprintTask, skillTitle: string): PracticeSessionContent {
  const lower = skillTitle.toLowerCase();
  let curriculumMap = systemArchitectureCurriculum;

  if (lower.includes('next') || lower.includes('react') || lower.includes('front')) {
    curriculumMap = nextjsCurriculum;
  } else if (lower.includes('type') || lower.includes('ts')) {
    curriculumMap = typescriptCurriculum;
  } else if (lower.includes('ui') || lower.includes('product') || lower.includes('design')) {
    curriculumMap = uiEngineeringCurriculum;
  }

  const dayData = curriculumMap[task.dayNumber] || curriculumMap[1];

  return {
    taskId: task.id,
    dayNumber: task.dayNumber,
    estimatedMinutes: task.estimatedMinutes || 20,
    skillTitle,
    taskTitle: task.title,
    creatorName: task.creatorName || 'Elena Rostova',
    creatorAvatar: task.creatorAvatar || '/avatars/avatar-2.svg',
    creatorHandle: task.creatorHandle || '@elena_distrib',
    videoLesson: getVideoLessonForTask(skillTitle, task.dayNumber),
    courseSections: getCourseSectionsForTask(skillTitle, task.dayNumber),
    knowledgeCheck: getKnowledgeCheckForTask(skillTitle, task.dayNumber),
    briefing: {
      overview: dayData.briefing.overview,
      mentalModel: dayData.briefing.mentalModel,
      keyPrinciples: dayData.briefing.keyPrinciples,
      referenceCode: dayData.briefing.referenceCode,
      referenceLanguage: dayData.briefing.referenceLanguage
    },
    exercise: {
      type: dayData.exercise.type,
      instruction: dayData.exercise.instruction,
      scenario: dayData.exercise.scenario,
      starterCode: dayData.exercise.starterCode,
      codeLanguage: dayData.exercise.codeLanguage,
      testCases: dayData.exercise.testCases,
      decisionOptions: dayData.exercise.decisionOptions,
      auditChecklist: dayData.exercise.auditChecklist
    },
    artifactDraft: {
      title: task.artifactTitle || dayData.artifactDraft.title,
      type: task.artifactType || dayData.artifactDraft.type,
      filename: dayData.artifactDraft.filename,
      snippet: dayData.artifactDraft.snippet
    }
  };
}
