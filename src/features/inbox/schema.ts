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

export const userProfileSchema = z.object({
  org: z.enum(["bk", "wtg"]),
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
});

export const sendSummaryEmailSchema = z.object({
  recipientEmail: z.string().email(),
  brief: briefSchema,
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
