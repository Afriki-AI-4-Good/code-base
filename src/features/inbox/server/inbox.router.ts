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
  loginSessionSchema,
  sendSummaryEmailSchema,
  userProfileSchema,
} from "~/features/inbox/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  FundingPhase,
  Prisma,
  PrismaClient,
  InboxEntry as PrismaInboxEntry,
  UserProfile as PrismaUserProfile,
} from "../../../../generated/prisma";
import { hasGmailConfiguration, sendSummaryToGmail } from "./gmail";

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

  sendSummaryEmail: publicProcedure
    .input(sendSummaryEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const session = normalizeSession(input.session);

      const profile = await ctx.db.userProfile.findUnique({
        where: {
          org_username: {
            org: session.org,
            username: session.username,
          },
        },
      });

      if (!profile?.emailConnected || !profile.emailAddress) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Connect your Gmail address in onboarding first.",
        });
      }

      if (profile.emailAddress !== input.recipientEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recipient email must match the connected Gmail address.",
        });
      }

      if (!hasGmailConfiguration()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Gmail API credentials are missing on the server.",
        });
      }

      try {
        await sendSummaryToGmail({
          recipientEmail: input.recipientEmail,
          brief: input.brief,
        });

        return { success: true };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send summary email via Gmail API.",
        });
      }
    }),
});

async function syncMockInboxEntries(db: PrismaClient) {
  const existing = await db.inboxEntry.findMany({
    select: { id: true, agentMetadata: true },
  });
  const existingById = new Map(existing.map((entry) => [entry.id, entry]));
  const operations = mockInbox.flatMap((entry) => {
    const existingEntry = existingById.get(entry.id);
    if (!existingEntry) {
      return [
        db.inboxEntry.create({
          data: toInboxCreate(entry),
        }),
      ];
    }
    if (!existingEntry.agentMetadata) {
      return [
        db.inboxEntry.update({
          where: { id: entry.id },
          data: {
            agentMetadata: toJson(
              entry.agentMetadata ?? mockAgentMetadata(entry),
            ),
          },
        }),
      ];
    }
    return [];
  });
  if (operations.length === 0) return;

  await db.$transaction(operations);
}

function normalizeSession(input: { org: string; username: string }) {
  return {
    org: input.org,
    username: normalizeUsername(input.username),
  };
}

function toInboxCreate(entry: InboxEntry) {
  const location = sourceLocations[entry.id];

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
  location: (typeof sourceLocations)[string] | undefined,
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
        ? "Add to the weekly context brief."
        : "Keep as background information.",
    recommendedAction:
      entry.priority === "urgent"
        ? "Review today and decide whether to brief leadership."
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

function profileId(input: Pick<UserProfile, "org" | "username">) {
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
