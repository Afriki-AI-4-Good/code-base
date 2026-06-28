import { z } from "zod";

const outputFieldSchema = z.object({
  key: z.enum([
    "summary",
    "translation",
    "original",
    "source",
    "date",
    "url",
    "tags",
    "image",
  ]),
  enabled: z.boolean(),
});

const briefItemSchema = z.object({
  entryId: z.string().min(1),
  title: z.string().min(1),
  reason: z.string().min(1),
  priority: z.enum(["urgent", "relevant", "information"]),
});

const briefSchema = z.object({
  headline: z.string().min(1),
  subline: z.string().min(1),
  items: z.array(briefItemSchema),
});

const orgSchema = z.enum(["bk", "wtg", "new_cause"]);
const usernameSchema = z.string().trim().min(1).max(128);
const agentFocusAreaSchema = z.enum(["news", "funding", "reports"]);

export const loginSessionSchema = z.object({
  org: orgSchema,
  username: usernameSchema,
});

export const agentSettingsSchema = z.object({
  session: loginSessionSchema,
  scheduleEnabled: z.boolean(),
  intervalDays: z.number().int().min(1).max(14),
  focusAreas: z.array(agentFocusAreaSchema).min(1),
  model: z.string().trim().min(1).max(80),
  newsMaxCandidates: z.number().int().min(1).max(50),
  fundingMaxCandidates: z.number().int().min(1).max(50),
  includeGdelt: z.boolean(),
  gdeltTimespan: z.enum(["1d", "3d", "7d", "14d", "30d"]),
  emailScanEnabled: z.boolean(),
});

export const userProfileSchema = z.object({
  username: usernameSchema,
  org: orgSchema,
  department: z.enum(["pm_intl", "fundraising", "pr_comms", "management"]),
  prompt: z.string().min(1),
  newsSources: z.array(z.string()).optional(),
  emailConnected: z.boolean().optional(),
  emailAddress: z.string().optional(),
  outputFormat: z
    .object({
      style: z.enum(["bullets", "narrative", "executive"]),
      length: z.enum(["short", "medium", "long"]),
      translateTo: z.enum(["en", "de"]),
      includeOriginal: z.boolean(),
      fields: z.array(outputFieldSchema),
    })
    .optional(),
  fundingSources: z.array(z.string()).optional(),
  fundingCriteria: z
    .object({
      minAmount: z.number(),
      maxAmount: z.number(),
      regions: z.array(z.string()),
      topics: z.array(z.string()),
      requireOwnContribution: z.enum(["any", "no", "ok"]),
    })
    .optional(),
  urgency: z
    .object({
      urgentDefinition: z.string(),
      relevantDefinition: z.string(),
      informationDefinition: z.string(),
      urgentKeywords: z.array(z.string()),
    })
    .optional(),
  wtgKeywords: z.array(z.string()).optional(),
  wtgNewsCategories: z.array(z.string()).optional(),
});

export const sendSummaryEmailSchema = z.object({
  session: loginSessionSchema,
  recipientEmail: z.string().email(),
  brief: briefSchema,
});

export type LoginSessionInput = z.infer<typeof loginSessionSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type SummaryBriefInput = z.infer<typeof briefSchema>;
export type AgentSettingsInput = z.infer<typeof agentSettingsSchema>;
