import { mockInbox } from "@/data/mock-inbox";
import { sourceLocations } from "@/data/source-locations";
import {
  DEFAULT_EXTRAS,
  type OnboardingExtras,
  type UserProfile,
} from "@/lib/profile";
import type { InboxEntry } from "@/types/inbox";
import { TRPCError } from "@trpc/server";
import {
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

const DEFAULT_PROFILE_ID = "local-user";

export const inboxRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    await seedInboxIfEmpty(ctx.db);

    const entries = await ctx.db.inboxEntry.findMany({
      include: { phases: { orderBy: { order: "asc" } } },
      orderBy: [{ date: "desc" }, { id: "asc" }],
    });

    return entries.map(toInboxEntry);
  }),

  profile: createTRPCRouter({
    get: publicProcedure.query(async ({ ctx }) => {
      const profile = await ctx.db.userProfile.findUnique({
        where: { id: DEFAULT_PROFILE_ID },
      });

      return profile ? toUserProfile(profile) : null;
    }),

    upsert: publicProcedure
      .input(userProfileSchema)
      .mutation(async ({ ctx, input }) => {
        const profile = await ctx.db.userProfile.upsert({
          where: { id: DEFAULT_PROFILE_ID },
          create: toProfileCreate(input),
          update: toProfileUpdate(input),
        });

        return toUserProfile(profile);
      }),
  }),

  sendSummaryEmail: publicProcedure
    .input(sendSummaryEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.userProfile.findUnique({
        where: { id: DEFAULT_PROFILE_ID },
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

async function seedInboxIfEmpty(db: PrismaClient) {
  const count = await db.inboxEntry.count();
  if (count > 0) return;

  await db.$transaction(
    mockInbox.map((entry) =>
      db.inboxEntry.create({
        data: toInboxCreate(entry),
      }),
    ),
  );
}

function toInboxCreate(entry: InboxEntry) {
  const location = sourceLocations[entry.id];

  return {
    id: entry.id,
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

function toProfileCreate(input: UserProfile) {
  return {
    id: DEFAULT_PROFILE_ID,
    ...toProfileUpdate(input),
  };
}

function toProfileUpdate(input: UserProfile) {
  return {
    org: input.org,
    department: input.department,
    prompt: input.prompt,
    newsSources: input.newsSources ?? DEFAULT_EXTRAS.newsSources,
    emailConnected: input.emailConnected ?? DEFAULT_EXTRAS.emailConnected,
    emailAddress: input.emailAddress ?? DEFAULT_EXTRAS.emailAddress,
    outputFormat: toJson(input.outputFormat ?? DEFAULT_EXTRAS.outputFormat),
    fundingSources: input.fundingSources ?? DEFAULT_EXTRAS.fundingSources,
    fundingCriteria: toJson(
      input.fundingCriteria ?? DEFAULT_EXTRAS.fundingCriteria,
    ),
    urgency: toJson(input.urgency ?? DEFAULT_EXTRAS.urgency),
  };
}

function toUserProfile(profile: PrismaUserProfile): UserProfile {
  return {
    org: profile.org as UserProfile["org"],
    department: profile.department as UserProfile["department"],
    prompt: profile.prompt,
    newsSources: jsonArray<string>(
      profile.newsSources,
      DEFAULT_EXTRAS.newsSources,
    ),
    emailConnected: profile.emailConnected,
    emailAddress: profile.emailAddress ?? "",
    outputFormat: jsonObject<OnboardingExtras["outputFormat"]>(
      profile.outputFormat,
      DEFAULT_EXTRAS.outputFormat,
    ),
    fundingSources: jsonArray<string>(
      profile.fundingSources,
      DEFAULT_EXTRAS.fundingSources,
    ),
    fundingCriteria: jsonObject<OnboardingExtras["fundingCriteria"]>(
      profile.fundingCriteria,
      DEFAULT_EXTRAS.fundingCriteria,
    ),
    urgency: jsonObject<OnboardingExtras["urgency"]>(
      profile.urgency,
      DEFAULT_EXTRAS.urgency,
    ),
  };
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
