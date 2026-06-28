import { TRPCError } from "@trpc/server";
import { mockInbox } from "@/data/mock-inbox";
import { sourceLocations } from "@/data/source-locations";
import {
  DEFAULT_EXTRAS,
  EMPTY_ONBOARDING_EXTRAS,
  normalizeUsername,
  type OnboardingExtras,
  ORGS,
  type UserProfile,
} from "@/lib/profile";
import type { AgentMetadata, InboxEntry } from "@/types/inbox";
import {
  agentSettingsSchema,
  loginSessionSchema,
  userProfileSchema,
} from "~/features/inbox/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  FundingPhase,
  Prisma,
  AgentRun as PrismaAgentRun,
  AgentSettings as PrismaAgentSettings,
  PrismaClient,
  InboxEntry as PrismaInboxEntry,
  UserProfile as PrismaUserProfile,
} from "../../../../generated/prisma";
import { getAgentHealth, runFundingAgent, runNewsAgent } from "./agent-client";
import {
  mapAgentFundingResultToInboxEntry,
  mapAgentNewsResultToInboxEntry,
} from "./agent-mappers";
import {
  buildFundingQuery,
  buildNewsQuery,
  buildOrgProfile,
  resolveFundingSources,
  resolveNewsSources,
} from "./agent-sources";

export const inboxRouter = createTRPCRouter({
  organizations: publicProcedure.query(() => ORGS),

  list: publicProcedure.query(async ({ ctx }) => {
    await syncMockInboxEntries(ctx.db);

    const entries = await ctx.db.inboxEntry.findMany({
      include: { phases: { orderBy: { order: "asc" } } },
      orderBy: [{ date: "desc" }, { id: "asc" }],
    });

    return entries.map(toInboxEntry);
  }),

  profile: createTRPCRouter({
    get: publicProcedure
      .input(loginSessionSchema)
      .query(async ({ ctx, input }) => {
        const session = normalizeSession(input);

        const profile = await ctx.db.userProfile.findUnique({
          where: {
            org_username: {
              org: session.org,
              username: session.username,
            },
          },
        });

        return profile ? toUserProfile(profile) : null;
      }),

    upsert: publicProcedure
      .input(userProfileSchema)
      .mutation(async ({ ctx, input }) => {
        const normalizedInput = {
          ...input,
          username: normalizeUsername(input.username),
        };

        const profile = await ctx.db.userProfile.upsert({
          where: {
            org_username: {
              org: normalizedInput.org,
              username: normalizedInput.username,
            },
          },
          create: toProfileCreate(normalizedInput),
          update: toProfileUpdate(normalizedInput),
        });

        return toUserProfile(profile);
      }),
  }),

  agent: createTRPCRouter({
    status: publicProcedure
      .input(loginSessionSchema)
      .query(async ({ ctx, input }) => {
        const session = normalizeSession(input);
        ensureAgentScheduler(ctx.db);
        await maybeStartDueAgentRun(ctx.db, session);

        const [settings, latestRun, health] = await Promise.all([
          getOrCreateAgentSettings(ctx.db, session),
          getLatestAgentRun(ctx.db, session),
          getAgentHealth().catch((error: unknown) => ({
            ok: false,
            status:
              error instanceof Error
                ? error.message
                : "Agent API is unreachable.",
          })),
        ]);

        return {
          settings: toAgentSettings(settings),
          run: latestRun ? toAgentRun(latestRun) : null,
          health,
        };
      }),

    updateSettings: publicProcedure
      .input(agentSettingsSchema)
      .mutation(async ({ ctx, input }) => {
        const session = normalizeSession(input.session);
        const existing = await getOrCreateAgentSettings(ctx.db, session);
        const nextRunAt =
          input.scheduleEnabled && !existing.scheduleEnabled
            ? addDays(new Date(), input.intervalDays)
            : existing.nextRunAt;

        const settings = await ctx.db.agentSettings.upsert({
          where: {
            org_username: {
              org: session.org,
              username: session.username,
            },
          },
          create: {
            id: profileId(session),
            org: session.org,
            username: session.username,
            scheduleEnabled: input.scheduleEnabled,
            intervalDays: input.intervalDays,
            nextRunAt,
            focusAreas: toJson(input.focusAreas),
            model: input.model,
            newsMaxCandidates: input.newsMaxCandidates,
            fundingMaxCandidates: input.fundingMaxCandidates,
            includeGdelt: input.includeGdelt,
            gdeltTimespan: input.gdeltTimespan,
            emailScanEnabled: input.emailScanEnabled,
          },
          update: {
            scheduleEnabled: input.scheduleEnabled,
            intervalDays: input.intervalDays,
            nextRunAt,
            focusAreas: toJson(input.focusAreas),
            model: input.model,
            newsMaxCandidates: input.newsMaxCandidates,
            fundingMaxCandidates: input.fundingMaxCandidates,
            includeGdelt: input.includeGdelt,
            gdeltTimespan: input.gdeltTimespan,
            emailScanEnabled: input.emailScanEnabled,
          },
        });

        return toAgentSettings(settings);
      }),

    startNow: publicProcedure
      .input(loginSessionSchema)
      .mutation(async ({ ctx, input }) => {
        const session = normalizeSession(input);
        const run = await startAgentRun(ctx.db, session, "manual");
        return toAgentRun(run);
      }),

    abort: publicProcedure
      .input(loginSessionSchema)
      .mutation(async ({ ctx, input }) => {
        const session = normalizeSession(input);
        const run = await getActiveAgentRun(ctx.db, session);

        if (!run) {
          return { aborted: false, run: null };
        }

        getAgentControllers().get(run.id)?.abort();
        const updatedRun = await ctx.db.agentRun.update({
          where: { id: run.id },
          data: {
            status: "aborted",
            progress: Math.max(run.progress, 100),
            currentStep: "Stopped by user.",
            finishedAt: new Date(),
            events: toJson([
              ...jsonArray<AgentRunEventPayload>(run.events, []),
              createAgentEvent("control", "Run stopped by user."),
            ]),
          },
        });

        return { aborted: true, run: toAgentRun(updatedRun) };
      }),

    pauseSchedule: publicProcedure
      .input(loginSessionSchema)
      .mutation(async ({ ctx, input }) => {
        const session = normalizeSession(input);
        const settings = await getOrCreateAgentSettings(ctx.db, session);
        const updated = await ctx.db.agentSettings.update({
          where: { id: settings.id },
          data: { scheduleEnabled: false },
        });

        return toAgentSettings(updated);
      }),

    resumeSchedule: publicProcedure
      .input(loginSessionSchema)
      .mutation(async ({ ctx, input }) => {
        const session = normalizeSession(input);
        const settings = await getOrCreateAgentSettings(ctx.db, session);
        const updated = await ctx.db.agentSettings.update({
          where: { id: settings.id },
          data: {
            scheduleEnabled: true,
            nextRunAt: addDays(new Date(), settings.intervalDays),
          },
        });

        return toAgentSettings(updated);
      }),
  }),

  syncNews: publicProcedure
    .input(loginSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await getProfileOrThrow(ctx.db, input);
      const defaults = getProfileDefaults(profile.org as UserProfile["org"]);
      const urgency = jsonObject<OnboardingExtras["urgency"]>(
        profile.urgency,
        defaults.urgency,
      );
      const profilePayload = toUserProfile(profile);
      const response = await runNewsAgent({
        query: buildNewsQuery(profilePayload),
        sources: resolveNewsSources(profilePayload.newsSources),
        model: "qwen3:8b",
        maxCandidates: 10,
        urgentDefinition: urgency.urgentDefinition,
        relevantDefinition: urgency.relevantDefinition,
        includeGdelt: true,
        gdeltQuery: buildNewsQuery(profilePayload),
        gdeltTimespan: "7d",
        outputFormat: profilePayload.outputFormat,
      }).catch((error: unknown) => {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: error instanceof Error ? error.message : "Agent API failed.",
        });
      });
      const detectedAt = todayIso();
      const entries = response.results.map((result) =>
        mapAgentNewsResultToInboxEntry(result, {
          runId: response.runId,
          detectedAt,
        }),
      );

      await upsertInboxEntries(ctx.db, entries);

      return {
        runId: response.runId,
        elapsedSeconds: response.elapsedSeconds,
        inserted: entries.length,
        events: response.events,
      };
    }),

  syncFunding: publicProcedure
    .input(loginSessionSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await getProfileOrThrow(ctx.db, input);
      const profilePayload = toUserProfile(profile);
      const response = await runFundingAgent({
        query: buildFundingQuery(profilePayload),
        orgProfile: buildOrgProfile(profilePayload),
        sources: resolveFundingSources(profilePayload.fundingSources),
        model: "qwen3:8b",
        maxCandidates: 12,
        outputFormat: profilePayload.outputFormat,
      }).catch((error: unknown) => {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: error instanceof Error ? error.message : "Agent API failed.",
        });
      });
      const detectedAt = todayIso();
      const entries = response.results.map((result) =>
        mapAgentFundingResultToInboxEntry(result, {
          runId: response.runId,
          detectedAt,
        }),
      );

      await upsertInboxEntries(ctx.db, entries);

      return {
        runId: response.runId,
        elapsedSeconds: response.elapsedSeconds,
        inserted: entries.length,
        events: response.events,
      };
    }),
});

type AgentSession = { org: string; username: string };
type AgentFocusArea = "news" | "funding" | "reports";
type AgentRunStatus = "queued" | "running" | "succeeded" | "failed" | "aborted";
type AgentRunTrigger = "manual" | "scheduled";

type AgentRunEventPayload = {
  type: string;
  message: string;
  createdAt: string;
};

const DEFAULT_AGENT_FOCUS_AREAS: AgentFocusArea[] = [
  "news",
  "funding",
  "reports",
];

const DEFAULT_AGENT_MODEL = "qwen3:8b";
const AGENT_SCHEDULER_INTERVAL_MS = 60_000;

async function getOrCreateAgentSettings(
  db: PrismaClient,
  session: AgentSession,
) {
  const existing = await db.agentSettings.findUnique({
    where: {
      org_username: {
        org: session.org,
        username: session.username,
      },
    },
  });
  if (existing) return existing;

  return db.agentSettings.create({
    data: {
      id: profileId(session),
      org: session.org,
      username: session.username,
      scheduleEnabled: true,
      intervalDays: 2,
      nextRunAt: addDays(new Date(), 2),
      focusAreas: toJson(DEFAULT_AGENT_FOCUS_AREAS),
      model: DEFAULT_AGENT_MODEL,
      newsMaxCandidates: 10,
      fundingMaxCandidates: 12,
      includeGdelt: true,
      gdeltTimespan: "7d",
      emailScanEnabled: true,
    },
  });
}

async function getLatestAgentRun(db: PrismaClient, session: AgentSession) {
  return db.agentRun.findFirst({
    where: {
      org: session.org,
      username: session.username,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getActiveAgentRun(db: PrismaClient, session: AgentSession) {
  return db.agentRun.findFirst({
    where: {
      org: session.org,
      username: session.username,
      status: { in: ["queued", "running"] },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function maybeStartDueAgentRun(db: PrismaClient, session: AgentSession) {
  const settings = await getOrCreateAgentSettings(db, session);
  if (!settings.scheduleEnabled || settings.nextRunAt > new Date()) return;
  await startAgentRun(db, session, "scheduled");
}

async function startAgentRun(
  db: PrismaClient,
  session: AgentSession,
  trigger: AgentRunTrigger,
) {
  const activeRun = await getActiveAgentRun(db, session);
  if (activeRun) return activeRun;

  const settings = await getOrCreateAgentSettings(db, session);
  const run = await db.agentRun.create({
    data: {
      org: session.org,
      username: session.username,
      status: "queued",
      trigger,
      progress: 2,
      currentStep: "Queued for Afriki Agent.",
      events: toJson([createAgentEvent("queued", "Run queued.")]),
      configSnapshot: toJson(toAgentSettings(settings)),
    },
  });

  void executeAgentRun(db, run.id, session).catch(async (error: unknown) => {
    await markAgentRunFailed(db, run.id, error);
  });

  return run;
}

async function executeAgentRun(
  db: PrismaClient,
  runId: string,
  session: AgentSession,
) {
  const controller = new AbortController();
  getAgentControllers().set(runId, controller);

  try {
    const profile = await getProfileOrThrow(db, session);
    const settings = await getOrCreateAgentSettings(db, session);
    const config = toAgentSettings(settings);
    const focusAreas = config.focusAreas;
    const profilePayload = toUserProfile(profile);
    let insertedNews = 0;
    let insertedFunding = 0;
    let insertedReports = 0;

    await updateAgentRunProgress(
      db,
      runId,
      "running",
      8,
      "Preparing workspace context and source lists.",
    );

    if (focusAreas.includes("funding")) {
      await updateAgentRunProgress(
        db,
        runId,
        "running",
        24,
        "Scanning funding sources for new grant calls.",
      );
      const response = await runFundingAgent(
        {
          query: buildFundingQuery(profilePayload),
          orgProfile: buildOrgProfile(profilePayload),
          sources: resolveFundingSources(profilePayload.fundingSources),
          model: config.model,
          maxCandidates: config.fundingMaxCandidates,
        },
        { signal: controller.signal },
      );
      ensureNotAborted(controller);
      const detectedAt = todayIso();
      const entries = response.results.map((result) =>
        mapAgentFundingResultToInboxEntry(result, {
          runId: response.runId,
          detectedAt,
        }),
      );
      await upsertInboxEntries(db, entries);
      insertedFunding = entries.length;
      await appendAgentRunEvents(
        db,
        runId,
        response.events.map((event) => ({
          type: event.type,
          message: event.message,
          createdAt: event.createdAt,
        })),
      );
    }

    if (focusAreas.includes("news")) {
      const defaults = getProfileDefaults(profile.org as UserProfile["org"]);
      const urgency = jsonObject<OnboardingExtras["urgency"]>(
        profile.urgency,
        defaults.urgency,
      );
      await updateAgentRunProgress(
        db,
        runId,
        "running",
        58,
        "Reading news sources and checking wider monitoring signals.",
      );
      const response = await runNewsAgent(
        {
          query: buildNewsQuery(profilePayload),
          sources: resolveNewsSources(profilePayload.newsSources),
          model: config.model,
          maxCandidates: config.newsMaxCandidates,
          urgentDefinition: urgency.urgentDefinition,
          relevantDefinition: urgency.relevantDefinition,
          includeGdelt: config.includeGdelt,
          gdeltQuery: buildNewsQuery(profilePayload),
          gdeltTimespan: config.gdeltTimespan,
        },
        { signal: controller.signal },
      );
      ensureNotAborted(controller);
      const detectedAt = todayIso();
      const entries = response.results.map((result) =>
        mapAgentNewsResultToInboxEntry(result, {
          runId: response.runId,
          detectedAt,
        }),
      );
      await upsertInboxEntries(db, entries);
      insertedNews = entries.length;
      await appendAgentRunEvents(
        db,
        runId,
        response.events.map((event) => ({
          type: event.type,
          message: event.message,
          createdAt: event.createdAt,
        })),
      );
    }

    if (focusAreas.includes("reports")) {
      await updateAgentRunProgress(
        db,
        runId,
        "running",
        84,
        "Checking email-report handoff status.",
      );
      await sleep(600);
      insertedReports = 0;
      await appendAgentRunEvents(db, runId, [
        createAgentEvent(
          "reports",
          "Email report scan is configured; Gmail ingestion is awaiting backend handoff.",
        ),
      ]);
    }

    ensureNotAborted(controller);
    await finishAgentRun(db, runId, session, {
      insertedNews,
      insertedFunding,
      insertedReports,
    });
  } catch (error) {
    if (isAbortError(error)) {
      await markAgentRunAborted(db, runId);
    } else {
      await markAgentRunFailed(db, runId, error);
    }
  } finally {
    getAgentControllers().delete(runId);
  }
}

async function finishAgentRun(
  db: PrismaClient,
  runId: string,
  session: AgentSession,
  result: {
    insertedNews: number;
    insertedFunding: number;
    insertedReports: number;
  },
) {
  const settings = await getOrCreateAgentSettings(db, session);
  const existingRun = await db.agentRun.findUnique({ where: { id: runId } });
  if (existingRun?.status === "aborted") return;

  await db.agentRun.update({
    where: { id: runId },
    data: {
      status: "succeeded",
      progress: 100,
      currentStep: "Finished. Workspace data is up to date.",
      finishedAt: new Date(),
      insertedNews: result.insertedNews,
      insertedFunding: result.insertedFunding,
      insertedReports: result.insertedReports,
      events: toJson([
        ...jsonArray<AgentRunEventPayload>(existingRun?.events, []),
        createAgentEvent("finished", "Run completed."),
      ]),
    },
  });
  await db.agentSettings.update({
    where: { id: settings.id },
    data: { nextRunAt: addDays(new Date(), settings.intervalDays) },
  });
}

async function updateAgentRunProgress(
  db: PrismaClient,
  runId: string,
  status: AgentRunStatus,
  progress: number,
  currentStep: string,
) {
  const run = await db.agentRun.findUnique({ where: { id: runId } });
  if (run?.status === "aborted")
    throw new DOMException("Aborted", "AbortError");

  await db.agentRun.update({
    where: { id: runId },
    data: {
      status,
      progress,
      currentStep,
      startedAt:
        status === "running" ? (run?.startedAt ?? new Date()) : undefined,
      events: toJson([
        ...jsonArray<AgentRunEventPayload>(run?.events, []),
        createAgentEvent(status, currentStep),
      ]),
    },
  });
}

async function appendAgentRunEvents(
  db: PrismaClient,
  runId: string,
  events: AgentRunEventPayload[],
) {
  if (events.length === 0) return;
  const run = await db.agentRun.findUnique({ where: { id: runId } });
  if (run?.status === "aborted") return;
  await db.agentRun.update({
    where: { id: runId },
    data: {
      events: toJson([
        ...jsonArray<AgentRunEventPayload>(run?.events, []),
        ...events,
      ]),
    },
  });
}

async function markAgentRunFailed(
  db: PrismaClient,
  runId: string,
  error: unknown,
) {
  const run = await db.agentRun.findUnique({ where: { id: runId } });
  if (!run || run.status === "aborted") return;
  const message = error instanceof Error ? error.message : "Agent run failed.";

  await db.agentRun.update({
    where: { id: runId },
    data: {
      status: "failed",
      progress: Math.max(run.progress, 100),
      currentStep: "Run failed. Check the Python agent service.",
      lastError: message,
      finishedAt: new Date(),
      events: toJson([
        ...jsonArray<AgentRunEventPayload>(run.events, []),
        createAgentEvent("error", message),
      ]),
    },
  });
}

async function markAgentRunAborted(db: PrismaClient, runId: string) {
  const run = await db.agentRun.findUnique({ where: { id: runId } });
  if (!run || run.status === "aborted") return;

  await db.agentRun.update({
    where: { id: runId },
    data: {
      status: "aborted",
      progress: Math.max(run.progress, 100),
      currentStep: "Stopped by user.",
      finishedAt: new Date(),
      events: toJson([
        ...jsonArray<AgentRunEventPayload>(run.events, []),
        createAgentEvent("control", "Run stopped by user."),
      ]),
    },
  });
}

function ensureAgentScheduler(db: PrismaClient) {
  const globalForAgent = getAgentGlobal();
  if (globalForAgent.schedulerStarted) return;
  globalForAgent.schedulerStarted = true;

  void dispatchDueAgentRuns(db);
  const timer = setInterval(() => {
    void dispatchDueAgentRuns(db);
  }, AGENT_SCHEDULER_INTERVAL_MS);
  timer.unref?.();
}

async function dispatchDueAgentRuns(db: PrismaClient) {
  const dueSettings = await db.agentSettings.findMany({
    where: {
      scheduleEnabled: true,
      nextRunAt: { lte: new Date() },
    },
    orderBy: { nextRunAt: "asc" },
    take: 10,
  });

  for (const settings of dueSettings) {
    await startAgentRun(
      db,
      { org: settings.org, username: settings.username },
      "scheduled",
    );
  }
}

function toAgentSettings(settings: PrismaAgentSettings) {
  return {
    id: settings.id,
    org: settings.org,
    username: settings.username,
    scheduleEnabled: settings.scheduleEnabled,
    intervalDays: settings.intervalDays,
    nextRunAt: settings.nextRunAt.toISOString(),
    focusAreas: jsonArray<AgentFocusArea>(
      settings.focusAreas,
      DEFAULT_AGENT_FOCUS_AREAS,
    ),
    model: settings.model,
    newsMaxCandidates: settings.newsMaxCandidates,
    fundingMaxCandidates: settings.fundingMaxCandidates,
    includeGdelt: settings.includeGdelt,
    gdeltTimespan: settings.gdeltTimespan,
    emailScanEnabled: settings.emailScanEnabled,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

function toAgentRun(run: PrismaAgentRun) {
  return {
    id: run.id,
    org: run.org,
    username: run.username,
    status: run.status as AgentRunStatus,
    trigger: run.trigger as AgentRunTrigger,
    progress: run.progress,
    currentStep: run.currentStep,
    startedAt: run.startedAt?.toISOString() ?? null,
    finishedAt: run.finishedAt?.toISOString() ?? null,
    lastError: run.lastError,
    insertedNews: run.insertedNews,
    insertedFunding: run.insertedFunding,
    insertedReports: run.insertedReports,
    events: jsonArray<AgentRunEventPayload>(run.events, []),
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
  };
}

function createAgentEvent(type: string, message: string): AgentRunEventPayload {
  return {
    type,
    message,
    createdAt: new Date().toISOString(),
  };
}

function getAgentControllers() {
  const globalForAgent = getAgentGlobal();
  globalForAgent.controllers ??= new Map<string, AbortController>();
  return globalForAgent.controllers;
}

function getAgentGlobal() {
  return globalThis as unknown as {
    controllers?: Map<string, AbortController>;
    schedulerStarted?: boolean;
  };
}

function ensureNotAborted(controller: AbortController) {
  if (controller.signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
}

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncMockInboxEntries(db: PrismaClient) {
  const mockIds = new Set(mockInbox.map((entry) => entry.id));
  const staleSeedIds = Array.from({ length: 40 }, (_, index) =>
    String(index + 1),
  ).filter((id) => !mockIds.has(id));

  await db.$transaction([
    db.inboxEntry.deleteMany({
      where: { id: { in: staleSeedIds } },
    }),
    ...mockInbox.map((entry) =>
      db.inboxEntry.upsert({
        where: { id: entry.id },
        create: toInboxCreate(entry),
        update: {
          ...toInboxUpdateFields(entry, locationForEntry(entry)),
          phases:
            entry.category === "funding"
              ? {
                  deleteMany: {},
                  create: (entry.phases ?? []).map((phase, order) => ({
                    kind: phase.kind,
                    label: phase.label,
                    date: toDate(phase.date),
                    order,
                  })),
                }
              : { deleteMany: {} },
        },
      }),
    ),
  ]);
}

async function getProfileOrThrow(
  db: PrismaClient,
  input: { org: string; username: string },
) {
  const session = normalizeSession(input);
  const profile = await db.userProfile.findUnique({
    where: {
      org_username: {
        org: session.org,
        username: session.username,
      },
    },
  });

  if (!profile) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Complete onboarding before running the agent sync.",
    });
  }

  return profile;
}

async function upsertInboxEntries(db: PrismaClient, entries: InboxEntry[]) {
  if (entries.length === 0) return;

  await db.$transaction(
    entries.map((entry) =>
      db.inboxEntry.upsert({
        where: { id: entry.id },
        create: toInboxCreate(entry),
        update: {
          ...toInboxUpdateFields(entry, locationForEntry(entry)),
          phases:
            entry.category === "funding"
              ? {
                  deleteMany: {},
                  create: (entry.phases ?? []).map((phase, order) => ({
                    kind: phase.kind,
                    label: phase.label,
                    date: toDate(phase.date),
                    order,
                  })),
                }
              : { deleteMany: {} },
        },
      }),
    ),
  );
}

function normalizeSession(input: { org: string; username: string }) {
  return {
    org: input.org,
    username: normalizeUsername(input.username),
  };
}

function toInboxCreate(entry: InboxEntry) {
  const location = locationForEntry(entry);

  return {
    id: entry.id,
    ...toInboxUpdateFields(entry, location),
    phases:
      "phases" in entry && entry.phases
        ? {
            create: entry.phases.map((phase, order) => ({
              kind: phase.kind,
              label: phase.label,
              date: toDate(phase.date),
              order,
            })),
          }
        : undefined,
  };
}

function toInboxUpdateFields(
  entry: InboxEntry,
  location: EntryLocation | undefined,
) {
  return {
    priority: entry.priority,
    category: entry.category,
    title: entry.title,
    translatedFrom: entry.translatedFrom,
    date: toDate(entry.date),
    source: entry.source,
    summary: entry.summary,
    locationName: location?.name,
    locationLng: location?.coords[0],
    locationLat: location?.coords[1],
    locationCountryId: location?.countryId,
    imageUrl: "imageUrl" in entry ? entry.imageUrl : undefined,
    deadline: "deadline" in entry ? toDate(entry.deadline) : undefined,
    amountRange: "amountRange" in entry ? entry.amountRange : undefined,
    topics: "topics" in entry ? entry.topics : undefined,
    funder: "funder" in entry ? entry.funder : undefined,
    criteria: "criteria" in entry ? entry.criteria : undefined,
    bkEligible: "bkEligible" in entry ? entry.bkEligible : undefined,
    originalLanguage:
      "originalLanguage" in entry ? entry.originalLanguage : undefined,
    sender: "sender" in entry ? entry.sender : undefined,
    originalText: "originalText" in entry ? entry.originalText : undefined,
    agentMetadata: toJson(entry.agentMetadata ?? mockAgentMetadata(entry)),
  };
}

type EntryLocation = {
  name: string;
  coords: [number, number];
  countryId?: string;
};

function locationForEntry(entry: InboxEntry): EntryLocation | undefined {
  return entry.location ?? sourceLocations[entry.id];
}

function toInboxEntry(
  entry: PrismaInboxEntry & { phases: FundingPhase[] },
): InboxEntry {
  const base = {
    id: entry.id,
    priority: entry.priority as InboxEntry["priority"],
    category: entry.category as InboxEntry["category"],
    title: entry.title,
    translatedFrom: entry.translatedFrom ?? undefined,
    date: formatDate(entry.date),
    source: entry.source,
    summary: entry.summary,
    agentMetadata: jsonObject<AgentMetadata>(entry.agentMetadata, {}),
    location:
      entry.locationName &&
      entry.locationLng !== null &&
      entry.locationLat !== null
        ? {
            name: entry.locationName,
            coords: [entry.locationLng, entry.locationLat] as [number, number],
            countryId: entry.locationCountryId ?? undefined,
          }
        : undefined,
  };

  if (entry.category === "funding") {
    return {
      ...base,
      category: "funding",
      deadline: formatDate(entry.deadline),
      amountRange: entry.amountRange ?? "",
      topics: jsonArray<string>(entry.topics, []),
      funder: entry.funder ?? "",
      criteria: jsonObject(entry.criteria, {
        ownContributionRequired: false,
        nrwHeadquarters: false,
        applyFromBurundi: false,
      }),
      bkEligible: (entry.bkEligible ?? "check") as "yes" | "check" | "no",
      phases: entry.phases.map((phase) => ({
        kind: phase.kind as
          | "open"
          | "info"
          | "loi"
          | "deadline"
          | "decision"
          | "kickoff",
        label: phase.label,
        date: formatDate(phase.date),
      })),
    };
  }

  if (entry.category === "report") {
    return {
      ...base,
      category: "report",
      originalLanguage: entry.originalLanguage ?? "",
      sender: entry.sender ?? "",
      originalText: entry.originalText ?? "",
    };
  }

  return {
    ...base,
    category: "news",
    imageUrl: entry.imageUrl ?? undefined,
  };
}

function mockAgentMetadata(entry: InboxEntry): AgentMetadata {
  if (entry.category === "funding") return mockFundingMetadata(entry);
  if (entry.category === "news") return mockNewsMetadata(entry);
  return mockReportMetadata(entry);
}

function mockFundingMetadata(
  entry: Extract<InboxEntry, { category: "funding" }>,
) {
  const days = Math.ceil(
    (toDate(entry.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const fitScore =
    entry.bkEligible === "yes" ? 88 : entry.bkEligible === "check" ? 64 : 28;

  return {
    sourceUrl: `https://funding.example/${entry.id}`,
    confidence: 0.86,
    detectedAt: entry.date,
    sourceType: "funding_call",
    fitScore,
    applicationLead:
      entry.bkEligible === "check" ? "Grant manager" : "Fundraising",
    recommendedAction:
      days <= 21
        ? "Review eligibility and start a first decision note this week."
        : "Keep in pipeline and schedule a criteria review.",
    decisionReason:
      entry.bkEligible === "yes"
        ? "Matches BK regions and thematic priorities from onboarding."
        : "Needs manual eligibility check before proposal work starts.",
    requiredDocuments: [
      "Eligibility note",
      "Budget estimate",
      "Partner confirmation",
      "Draft concept note",
    ],
    nextSteps: [
      "Confirm applicant eligibility",
      "Check own-contribution requirement",
      "Assign proposal owner",
    ],
    impactAreas: entry.topics,
    regionTags: entry.location?.name ? [entry.location.name] : ["Burundi"],
  };
}

function mockNewsMetadata(entry: Extract<InboxEntry, { category: "news" }>) {
  return {
    sourceUrl: `https://news.example/${entry.id}`,
    confidence: 0.82,
    detectedAt: entry.date,
    sourceType: "news_article",
    monitoringTheme: entry.title.includes("Health")
      ? "Health and child wellbeing"
      : entry.title.includes("Education")
        ? "Education and vocational training"
        : "Burundi context monitoring",
    suggestedUse:
      entry.priority === "relevant"
        ? "Add to the weekly context update."
        : "Keep as background information.",
    recommendedAction:
      entry.priority === "urgent"
        ? "Review today and decide whether to escalate internally."
        : "Summarize for the next team digest.",
    keyFacts: splitSummary(entry.summary).slice(0, 3),
    regionTags: entry.location?.name ? [entry.location.name] : ["Great Lakes"],
    impactAreas: entry.title.includes("Education")
      ? ["Education", "Policy"]
      : ["Context", "Monitoring"],
  };
}

function mockReportMetadata(
  entry: Extract<InboxEntry, { category: "report" }>,
) {
  return {
    confidence: 0.84,
    detectedAt: entry.date,
    sourceType: "email_report",
    recommendedAction:
      entry.priority === "urgent"
        ? "Open the original email and assign a response owner."
        : "Keep in reports queue for the next review.",
    keyFacts: splitSummary(entry.summary).slice(0, 3),
    regionTags: entry.location?.name ? [entry.location.name] : [],
  };
}

function splitSummary(summary: string) {
  return summary
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function toProfileCreate(input: UserProfile) {
  return {
    id: profileId(input),
    ...toProfileUpdate(input),
  };
}

function toProfileUpdate(input: UserProfile) {
  const defaults = getProfileDefaults(input.org);

  return {
    username: normalizeUsername(input.username),
    org: input.org,
    department: input.department,
    prompt: input.prompt,
    newsSources: input.newsSources ?? defaults.newsSources,
    emailConnected: input.emailConnected ?? defaults.emailConnected,
    emailAddress: input.emailAddress ?? defaults.emailAddress,
    outputFormat: toJson(input.outputFormat ?? defaults.outputFormat),
    fundingSources: input.fundingSources ?? defaults.fundingSources,
    fundingCriteria: toJson(input.fundingCriteria ?? defaults.fundingCriteria),
    urgency: toJson(input.urgency ?? defaults.urgency),
    wtgKeywords: toJson(input.wtgKeywords ?? defaults.wtgKeywords),
    wtgNewsCategories: toJson(
      input.wtgNewsCategories ?? defaults.wtgNewsCategories,
    ),
  };
}

function toUserProfile(profile: PrismaUserProfile): UserProfile {
  const org = profile.org as UserProfile["org"];
  const defaults = getProfileDefaults(org);

  return {
    username: profile.username,
    org,
    department: profile.department as UserProfile["department"],
    prompt: profile.prompt,
    newsSources: jsonArray<string>(profile.newsSources, defaults.newsSources),
    emailConnected: profile.emailConnected,
    emailAddress: profile.emailAddress ?? "",
    outputFormat: jsonObject<OnboardingExtras["outputFormat"]>(
      profile.outputFormat,
      defaults.outputFormat,
    ),
    fundingSources: jsonArray<string>(
      profile.fundingSources,
      defaults.fundingSources,
    ),
    fundingCriteria: jsonObject<OnboardingExtras["fundingCriteria"]>(
      profile.fundingCriteria,
      defaults.fundingCriteria,
    ),
    urgency: jsonObject<OnboardingExtras["urgency"]>(
      profile.urgency,
      defaults.urgency,
    ),
    wtgKeywords: jsonArray<string>(profile.wtgKeywords, defaults.wtgKeywords),
    wtgNewsCategories: jsonArray<string>(
      profile.wtgNewsCategories,
      defaults.wtgNewsCategories,
    ),
  };
}

function getProfileDefaults(org: UserProfile["org"]): OnboardingExtras {
  return org === "new_cause" ? EMPTY_ONBOARDING_EXTRAS : DEFAULT_EXTRAS;
}

function profileId(input: { org: string; username: string }) {
  return `${input.org}:${normalizeUsername(input.username)}`;
}

function jsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function jsonObject<T>(value: unknown, fallback: T): T {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as T)
    : fallback;
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function toDate(iso: string) {
  return new Date(`${iso}T00:00:00.000Z`);
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
