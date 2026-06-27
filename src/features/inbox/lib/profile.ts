import type { InboxEntry } from "@/types/inbox";

export type OrgId = "bk" | "wtg";
export type DepartmentId =
  | "pm_intl"
  | "fundraising"
  | "pr_comms"
  | "management";

export interface Org {
  id: OrgId;
  name: string;
  shortName: string;
  initials: string;
  description: string;
  accent: string; // tailwind class
}

export interface Department {
  id: DepartmentId;
  name: string;
  shortName: string;
  description: string;
  focus: string;
  defaultPrompt: string;
}

export type OutputFieldKey =
  | "summary"
  | "translation"
  | "original"
  | "source"
  | "date"
  | "url"
  | "tags"
  | "image";

export interface OutputField {
  key: OutputFieldKey;
  enabled: boolean;
}

export interface OnboardingExtras {
  newsSources: string[];
  emailConnected: boolean;
  emailAddress?: string;
  outputFormat: {
    style: "bullets" | "narrative" | "executive";
    length: "short" | "medium" | "long";
    translateTo: "en" | "de";
    includeOriginal: boolean;
    /** Ordered list of fields shown per inbox item; order = display order. */
    fields: OutputField[];
  };
  fundingSources: string[];
  fundingCriteria: {
    minAmount: number;
    maxAmount: number;
    regions: string[];
    topics: string[];
    requireOwnContribution: "any" | "no" | "ok";
  };
  urgency: {
    urgentDefinition: string;
    relevantDefinition: string;
    informationDefinition: string;
    urgentKeywords: string[];
  };
}

export interface UserProfile extends Partial<OnboardingExtras> {
  org: OrgId;
  department: DepartmentId;
  prompt: string;
}

export const DEFAULT_OUTPUT_FIELDS: OutputField[] = [
  { key: "summary", enabled: true },
  { key: "translation", enabled: true },
  { key: "source", enabled: true },
  { key: "date", enabled: true },
  { key: "url", enabled: true },
  { key: "tags", enabled: true },
  { key: "image", enabled: true },
  { key: "original", enabled: false },
];

export const DEFAULT_EXTRAS: OnboardingExtras = {
  newsSources: ["Reuters Africa", "Devex", "AllAfrica", "DW Africa"],
  emailConnected: false,
  emailAddress: "",
  outputFormat: {
    style: "bullets",
    length: "medium",
    translateTo: "en",
    includeOriginal: false,
    fields: DEFAULT_OUTPUT_FIELDS,
  },

  fundingSources: [
    "EU Funding & Tenders",
    "BMZ",
    "GIZ",
    "Stiftung Nord-Süd-Brücken",
  ],
  fundingCriteria: {
    minAmount: 10000,
    maxAmount: 500000,
    regions: ["Burundi", "East Africa"],
    topics: ["Education", "Child Protection"],
    requireOwnContribution: "any",
  },
  urgency: {
    urgentDefinition:
      "Items requiring immediate action due to an imminent deadline, time-critical decision, or rapid response need.",
    relevantDefinition:
      "Items directly pertinent to our projects, funding opportunities, partnerships, or operational priorities.",
    informationDefinition:
      "Items that provide useful background or general context but do not require immediate action or response.",
    urgentKeywords: ["deadline", "urgent", "closing"],
  },
};

export const ORGS: Org[] = [
  {
    id: "bk",
    name: "Burundi Kids",
    shortName: "BK",
    initials: "BK",
    description: "Education & child protection in Burundi",
    accent: "bg-primary/15 text-primary",
  },
  {
    id: "wtg",
    name: "Welttierschutzgesellschaft",
    shortName: "WTG",
    initials: "WTG",
    description: "World Animal Protection Society",
    accent: "bg-amber-100 text-amber-800",
  },
];

export const DEPARTMENTS: Department[] = [
  {
    id: "pm_intl",
    name: "Project Management & International Cooperation",
    shortName: "Project Management",
    description: "Field projects, partner coordination, reporting",
    focus: "Reports from the field, project deadlines, partner updates",
    defaultPrompt:
      "You are my project-management co-pilot. Surface field reports, partner updates, and operational risks. Flag delays, funding windows that affect ongoing projects, and anything requiring a decision this week. Summaries should be action-oriented and reference the country/site.",
  },
  {
    id: "fundraising",
    name: "Fundraising, Grant Management & Development",
    shortName: "Fundraising & Grants",
    description: "Donor relations, calls for proposals, grant cycles",
    focus: "Funding calls, deadlines, eligibility, donor news",
    defaultPrompt:
      "You are my fundraising assistant. Prioritize open calls for proposals, donor announcements, and grant cycles. For each item show deadline, amount range, eligibility (esp. BK), and whether co-funding is required. Highlight calls expiring in the next 30 days.",
  },
  {
    id: "pr_comms",
    name: "Public Relations, Press & Communication",
    shortName: "PR & Communications",
    description: "Press, storytelling, public-facing narratives",
    focus: "Sector news, success stories, media-ready field updates",
    defaultPrompt:
      "You are my communications assistant. Surface sector news, success stories, and field updates that can become press releases, social posts, or newsletter items. Suggest angles, quotable numbers, and likely media interest. Avoid internal-only operational details.",
  },
  {
    id: "management",
    name: "Management / Executive Board",
    shortName: "Executive Board",
    description: "Strategic overview across all streams",
    focus: "High-priority items across funding, ops, and external news",
    defaultPrompt:
      "You are my executive briefing assistant. Give me a concise strategic overview across funding, operations, and external news. Highlight risks, opportunities, and items needing board-level decisions. Keep each item to 1–2 sentences.",
  },
];

const STORAGE_KEY = "inbox.profile.v1";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.org && p.department) return p as UserProfile;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getOrg(id: OrgId) {
  const org = ORGS.find((o) => o.id === id);
  if (!org) throw new Error(`Unknown organization: ${id}`);
  return org;
}
export function getDepartment(id: DepartmentId) {
  const department = DEPARTMENTS.find((d) => d.id === id);
  if (!department) throw new Error(`Unknown department: ${id}`);
  return department;
}

// ----- Brief generation -----

export interface BriefItem {
  entryId: string;
  title: string;
  reason: string;
  priority: InboxEntry["priority"];
}

export interface Brief {
  headline: string;
  subline: string;
  items: BriefItem[];
}

const priorityRank = { urgent: 3, relevant: 2, information: 1 } as const;

export function buildBrief(profile: UserProfile, entries: InboxEntry[]): Brief {
  const org = getOrg(profile.org);
  const dept = getDepartment(profile.department);

  // Score each entry per department.
  const scored = entries
    .map((e) => ({ entry: e, score: scoreFor(dept.id, e) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return priorityRank[b.entry.priority] - priorityRank[a.entry.priority];
    })
    .slice(0, 5);

  const items: BriefItem[] = scored.map(({ entry }) => ({
    entryId: entry.id,
    title: entry.title,
    reason: reasonFor(dept.id, entry),
    priority: entry.priority,
  }));

  const urgentCount = items.filter((i) => i.priority === "urgent").length;
  return {
    headline: `Welcome, ${org.shortName} · ${dept.shortName}`,
    subline:
      urgentCount > 0
        ? `${items.length} items for you — ${urgentCount} marked urgent.`
        : `${items.length} items selected for your role today.`,
    items,
  };
}

function scoreFor(dept: DepartmentId, e: InboxEntry): number {
  const p = priorityRank[e.priority];
  switch (dept) {
    case "fundraising":
      if (e.category === "funding") return 10 + p;
      if (e.category === "news") return 2 + p;
      return 1;
    case "pm_intl":
      if (e.category === "report") return 10 + p;
      if (e.category === "funding" && e.priority === "urgent") return 6;
      if (e.category === "news") return 3 + p;
      return 1;
    case "pr_comms":
      if (e.category === "news") return 10 + p;
      if (e.category === "report" && e.priority !== "urgent") return 4;
      return 1 + p;
    case "management":
      // Executive view: top urgency across the board.
      return p * 4 + (e.category === "funding" ? 2 : 0);
  }
}

function reasonFor(dept: DepartmentId, e: InboxEntry): string {
  switch (dept) {
    case "fundraising":
      if (e.category === "funding")
        return `Funding call · deadline ${"deadline" in e ? formatShort(e.deadline) : "tbd"}`;
      return "Context for donor conversations";
    case "pm_intl":
      if (e.category === "report") return "Field report — operational impact";
      if (e.category === "funding")
        return "Funding window relevant to projects";
      return "Sector context for the field";
    case "pr_comms":
      if (e.category === "news") return "Media-relevant sector story";
      if (e.category === "report") return "Possible storytelling angle";
      return "Background for communications";
    case "management":
      return `${e.priority === "urgent" ? "Urgent" : "Strategic"} signal across the inbox`;
  }
}

function formatShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}
