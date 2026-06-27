import { createHash } from "node:crypto";
import type { FundingEntry, NewsEntry, Priority } from "../types/inbox";

const UNKNOWN_FUNDING_DEADLINE = "9999-12-31";

export interface AgentRunContext {
  runId: number;
  detectedAt: string;
}

export interface AgentNewsResult {
  ranking?: string;
  title_de?: string;
  summary_de?: string;
  translated_excerpt_de?: string;
  source?: string;
  published?: string;
  link_to_original?: string;
  original_title?: string;
  relevance_reason?: string;
}

export interface AgentFundingResult {
  fit_label?: string;
  title?: string;
  deadline?: string;
  amount_range?: string;
  topic?: string;
  funder?: string;
  eligibility_criteria?: string[];
  fit_reasons?: string[];
  missing_information?: string[];
  summary?: string;
  source?: string;
  published?: string;
  link_to_original?: string;
  original_title?: string;
}

export function mapAgentNewsResultToInboxEntry(
  result: AgentNewsResult,
  context: AgentRunContext,
): NewsEntry {
  const sourceUrl = cleaned(result.link_to_original);
  const title =
    cleaned(result.title_de) ||
    cleaned(result.original_title) ||
    "Untitled news item";
  const summary =
    cleaned(result.summary_de) ||
    cleaned(result.translated_excerpt_de) ||
    "No summary returned.";
  const source =
    cleaned(result.source) || sourceHost(sourceUrl) || "Agent news";
  const date = validDate(result.published) ?? context.detectedAt;
  const combinedText = `${title} ${summary} ${source}`;

  return {
    id: `agent:news:${stableHash(sourceUrl || `${source}:${title}`)}`,
    priority: newsPriority(result.ranking),
    category: "news",
    title,
    translatedFrom: "Agent",
    date,
    source,
    summary,
    location: inferLocation(combinedText),
    agentMetadata: {
      sourceUrl,
      confidence: 0.78,
      detectedAt: context.detectedAt,
      sourceType: "news_article",
      agentRunId: context.runId,
      decisionReason: cleaned(result.relevance_reason),
      monitoringTheme: inferMonitoringTheme(combinedText),
      suggestedUse: "Review for the next team digest.",
      recommendedAction:
        newsPriority(result.ranking) === "urgent"
          ? "Review today."
          : "Keep for monitoring.",
      keyFacts: [summary],
      regionTags: inferLocation(combinedText)?.name
        ? [inferLocation(combinedText)?.name ?? ""]
        : [],
      impactAreas: inferImpactAreas(combinedText),
    },
  };
}

export function mapAgentFundingResultToInboxEntry(
  result: AgentFundingResult,
  context: AgentRunContext,
): FundingEntry {
  const sourceUrl = cleaned(result.link_to_original);
  const title =
    cleaned(result.title) ||
    cleaned(result.original_title) ||
    "Untitled funding item";
  const summary = cleaned(result.summary) || "No summary returned.";
  const source =
    cleaned(result.source) ||
    cleaned(result.funder) ||
    sourceHost(sourceUrl) ||
    "Agent funding";
  const published = validDate(result.published) ?? context.detectedAt;
  const deadlineInfo = fundingDeadline(result.deadline);
  const deadline = deadlineInfo.date;
  const deadlineLabel = deadlineInfo.label;
  const fitLabel = cleaned(result.fit_label) || "Unknown";
  const notes = [
    ...(result.eligibility_criteria ?? []),
    ...(result.missing_information ?? []),
  ]
    .map(cleaned)
    .filter(Boolean)
    .join("; ");
  const combinedText = `${title} ${summary} ${result.topic ?? ""} ${result.funder ?? ""} ${notes}`;

  return {
    id: `agent:funding:${stableHash(sourceUrl || `${source}:${title}`)}`,
    priority: fundingPriority(fitLabel, deadline, context.detectedAt),
    category: "funding",
    title,
    translatedFrom: "Agent",
    date: published,
    source,
    summary,
    location: inferLocation(combinedText),
    deadline,
    amountRange: cleaned(result.amount_range) || "unknown",
    topics: normalizeTopics(result.topic),
    funder: cleaned(result.funder) || source,
    criteria: {
      ownContributionRequired: /co-?funding|own contribution/i.test(notes),
      nrwHeadquarters: /\bNRW\b|North Rhine/i.test(notes),
      applyFromBurundi: /Burundi/i.test(combinedText),
      notes: notes || undefined,
    },
    bkEligible: bkEligibility(fitLabel),
    phases: deadlineInfo.known
      ? [
          { kind: "open", label: "Detected", date: published },
          { kind: "deadline", label: "Deadline", date: deadline },
        ]
      : [{ kind: "open", label: "Detected", date: published }],
    agentMetadata: {
      sourceUrl,
      confidence: 0.78,
      detectedAt: context.detectedAt,
      sourceType: "funding_call",
      agentRunId: context.runId,
      deadlineLabel,
      fitScore: fitScore(fitLabel),
      applicationLead: "Fundraising",
      recommendedAction: recommendedFundingAction(
        fitLabel,
        deadline,
        context.detectedAt,
      ),
      decisionReason: (result.fit_reasons ?? [])
        .map(cleaned)
        .filter(Boolean)
        .join("; "),
      nextSteps: [
        "Review eligibility",
        "Confirm deadline",
        "Assign proposal owner",
      ],
      requiredDocuments: [
        "Eligibility note",
        "Budget estimate",
        "Concept note",
      ],
      impactAreas: normalizeTopics(result.topic),
      regionTags: inferLocation(combinedText)?.name
        ? [inferLocation(combinedText)?.name ?? ""]
        : [],
    },
  };
}

function newsPriority(ranking: string | undefined): Priority {
  const normalized = cleaned(ranking).toLowerCase();
  if (normalized === "urgent") return "urgent";
  if (normalized === "relevant") return "relevant";
  return "information";
}

function fundingPriority(
  fitLabel: string,
  deadline: string,
  detectedAt: string,
): Priority {
  const normalized = fitLabel.toLowerCase();
  if (normalized === "strong fit" && daysBetween(detectedAt, deadline) <= 30) {
    return "urgent";
  }
  if (normalized === "strong fit" || normalized === "possible fit") {
    return "relevant";
  }
  return "information";
}

function bkEligibility(fitLabel: string): "yes" | "check" | "no" {
  const normalized = fitLabel.toLowerCase();
  if (normalized === "strong fit") return "yes";
  if (normalized === "poor fit") return "no";
  return "check";
}

function fitScore(fitLabel: string): number {
  const normalized = fitLabel.toLowerCase();
  if (normalized === "strong fit") return 90;
  if (normalized === "possible fit") return 65;
  if (normalized === "poor fit") return 20;
  return 45;
}

function recommendedFundingAction(
  fitLabel: string,
  deadline: string,
  detectedAt: string,
): string {
  if (fundingPriority(fitLabel, deadline, detectedAt) === "urgent") {
    return "Review eligibility and decide this week.";
  }
  if (fitLabel.toLowerCase() === "possible fit") {
    return "Clarify missing eligibility criteria before proposal work.";
  }
  return "Keep in the funding pipeline for manual review.";
}

function fundingDeadline(value: string | undefined): {
  date: string;
  label?: string;
  known: boolean;
} {
  const cleanedValue = cleaned(value);
  const parsed = validDate(cleanedValue) ?? naturalDate(cleanedValue);
  if (parsed) return { date: parsed, known: true };

  return {
    date: UNKNOWN_FUNDING_DEADLINE,
    label: cleanedValue || "unknown",
    known: false,
  };
}

function inferMonitoringTheme(text: string): string {
  if (/education|school|formation|bildung/i.test(text)) {
    return "Education and vocational training";
  }
  if (/health|cholera|medical|sant/i.test(text)) {
    return "Health and child wellbeing";
  }
  if (/funding|grant|proposal/i.test(text)) {
    return "Funding and partnerships";
  }
  return "Context monitoring";
}

function inferImpactAreas(text: string): string[] {
  const areas: string[] = [];
  if (/education|school|formation|bildung/i.test(text)) areas.push("Education");
  if (/health|cholera|medical|sant/i.test(text)) areas.push("Health");
  if (/child|youth|children|protection/i.test(text))
    areas.push("Child Protection");
  return areas.length ? areas : ["Monitoring"];
}

function inferLocation(
  text: string,
): { name: string; coords: [number, number]; countryId: string } | undefined {
  if (/bujumbura/i.test(text)) {
    return {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    };
  }
  if (/gitega/i.test(text)) {
    return {
      name: "Gitega, Burundi",
      coords: [29.9246, -3.4271],
      countryId: "108",
    };
  }
  if (/burundi/i.test(text)) {
    return { name: "Burundi", coords: [29.9189, -3.3731], countryId: "108" };
  }
  if (/\bBMZ\b|GIZ|Bonn|Germany|Deutschland/i.test(text)) {
    return {
      name: "Bonn, Germany",
      coords: [7.0982, 50.7374],
      countryId: "276",
    };
  }
  if (/EU|Brussels|Bruxelles/i.test(text)) {
    return {
      name: "Brussels, Belgium",
      coords: [4.3517, 50.8503],
      countryId: "056",
    };
  }
  return undefined;
}

function normalizeTopics(topic: string | undefined): string[] {
  const cleanedTopic = cleaned(topic);
  if (!cleanedTopic || cleanedTopic.toLowerCase() === "unknown") {
    return ["Funding"];
  }
  return cleanedTopic.split(/[,;/]/).map(cleaned).filter(Boolean).slice(0, 4);
}

function validDate(value: string | undefined): string | null {
  const cleanedValue = cleaned(value);
  if (!/^\d{4}-\d{2}-\d{2}/.test(cleanedValue)) return null;
  const date = new Date(cleanedValue);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function naturalDate(value: string): string | null {
  const normalized = value.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  const dayMonthYear = normalized.match(
    /^(\d{1,2})(?:st|nd|rd|th)?[.\s-]+([A-Za-zÀ-ÿ.]+)[\s-]+(\d{4})$/i,
  );
  if (dayMonthYear) {
    const [, day, month, year] = dayMonthYear;
    return isoDate(Number(year), monthNumber(month), Number(day));
  }

  const monthDayYear = normalized.match(
    /^([A-Za-zÀ-ÿ.]+)\s+(\d{1,2})(?:st|nd|rd|th)?[\s-]+(\d{4})$/i,
  );
  if (monthDayYear) {
    const [, month, day, year] = monthDayYear;
    return isoDate(Number(year), monthNumber(month), Number(day));
  }

  const numericDayMonthYear = normalized.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );
  if (numericDayMonthYear) {
    const [, day, month, year] = numericDayMonthYear;
    return isoDate(Number(year), Number(month), Number(day));
  }

  return null;
}

function monthNumber(value: string | undefined): number | null {
  const normalized = cleaned(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .toLowerCase();
  const months: Record<string, number> = {
    january: 1,
    jan: 1,
    januar: 1,
    february: 2,
    feb: 2,
    februar: 2,
    march: 3,
    mar: 3,
    marz: 3,
    maerz: 3,
    april: 4,
    apr: 4,
    may: 5,
    mai: 5,
    june: 6,
    jun: 6,
    juni: 6,
    july: 7,
    jul: 7,
    juli: 7,
    august: 8,
    aug: 8,
    september: 9,
    sep: 9,
    sept: 9,
    oktober: 10,
    october: 10,
    oct: 10,
    okt: 10,
    november: 11,
    nov: 11,
    december: 12,
    dezember: 12,
    dec: 12,
    dez: 12,
  };
  return months[normalized] ?? null;
}

function isoDate(
  year: number,
  month: number | null,
  day: number,
): string | null {
  if (!month || !Number.isInteger(year) || !Number.isInteger(day)) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  const fromTime = new Date(`${from}T00:00:00.000Z`).getTime();
  const toTime = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.ceil((toTime - fromTime) / 86_400_000);
}

function stableHash(value: string): string {
  return createHash("sha1").update(value).digest("hex").slice(0, 16);
}

function sourceHost(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function cleaned(value: unknown): string {
  return String(value ?? "").trim();
}
