import { mockInbox } from "@/data/mock-inbox";
import { sourceLocations } from "@/data/source-locations";
import {
  DEFAULT_EXTRAS,
  normalizeUsername,
  type OnboardingExtras,
  ORGS,
  type UserProfile,
} from "@/lib/profile";
import type { InboxEntry } from "@/types/inbox";
import { loginSessionSchema, userProfileSchema } from "~/features/inbox/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  FundingPhase,
  Prisma,
  PrismaClient,
  InboxEntry as PrismaInboxEntry,
  UserProfile as PrismaUserProfile,
} from "../../../../generated/prisma";

export const inboxRouter = createTRPCRouter({
  organizations: publicProcedure.query(() => ORGS),

  list: publicProcedure.query(async ({ ctx }) => {
    await seedInboxIfEmpty(ctx.db);

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
    id: profileId(input),
    ...toProfileUpdate(input),
  };
}

function toProfileUpdate(input: UserProfile) {
  return {
    username: normalizeUsername(input.username),
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
    wtgKeywords: toJson(input.wtgKeywords ?? DEFAULT_EXTRAS.wtgKeywords),
    wtgNewsCategories: toJson(
      input.wtgNewsCategories ?? DEFAULT_EXTRAS.wtgNewsCategories,
    ),
  };
}

function toUserProfile(profile: PrismaUserProfile): UserProfile {
  return {
    username: profile.username,
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
    wtgKeywords: jsonArray<string>(
      profile.wtgKeywords,
      DEFAULT_EXTRAS.wtgKeywords,
    ),
    wtgNewsCategories: jsonArray<string>(
      profile.wtgNewsCategories,
      DEFAULT_EXTRAS.wtgNewsCategories,
    ),
  };
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
