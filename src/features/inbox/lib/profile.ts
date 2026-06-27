export type OrgId = "bk" | "wtg" | "new_cause";
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
  logoSrc: string;
  logoAlt: string;
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
  wtgKeywords: string[];
  wtgNewsCategories: string[];
}

export interface UserProfile extends Partial<OnboardingExtras> {
  username: string;
  org: OrgId;
  department: DepartmentId;
  prompt: string;
}

export interface LoginSession {
  org: OrgId;
  username: string;
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
  wtgKeywords: [
    "Worldwide animal welfare: poaching, animal trade, rabies, legislation, tourism",
    "Animal welfare in Germany: politics, legislation, puppy trade, circuses, zoos, farm animals",
    "Animal welfare in development cooperation",
    "Animal welfare on social media",
    "Reports about animals and countries connected to our projects",
    "Major animal welfare topics: pet trends, fur, puppy trade, horse markets, donkey-hide trade",
  ],
  wtgNewsCategories: [
    "Animal welfare in Germany",
    "International animal welfare",
    "Animal suffering on social media",
    "Agriculture and consumer topics with animal welfare relevance",
    "Reports from other NGOs",
  ],
};

export const EMPTY_ONBOARDING_EXTRAS: OnboardingExtras = {
  newsSources: [],
  emailConnected: false,
  emailAddress: "",
  outputFormat: {
    style: "bullets",
    length: "medium",
    translateTo: "en",
    includeOriginal: false,
    fields: DEFAULT_OUTPUT_FIELDS.map((field) => ({
      ...field,
      enabled: false,
    })),
  },
  fundingSources: [],
  fundingCriteria: {
    minAmount: 0,
    maxAmount: 0,
    regions: [],
    topics: [],
    requireOwnContribution: "any",
  },
  urgency: {
    urgentDefinition: "",
    relevantDefinition: "",
    informationDefinition: "",
    urgentKeywords: [],
  },
  wtgKeywords: [],
  wtgNewsCategories: [],
};

export const ORGS: Org[] = [
  {
    id: "bk",
    name: "Burundikids e.V.",
    shortName: "BK",
    initials: "BK",
    description: "Education & child protection in Burundi",
    accent: "bg-primary/15 text-primary",
    logoSrc: "/orgs/burundikids-logo.png",
    logoAlt: "Burundikids e.V. logo",
  },
  {
    id: "wtg",
    name: "Welttierschutzgesellschaft e.V.",
    shortName: "WTG",
    initials: "WTG",
    description: "Animal welfare worldwide",
    accent: "bg-amber-100 text-amber-800",
    logoSrc: "/orgs/wtg-logo.png",
    logoAlt: "Welttierschutzgesellschaft e.V. logo",
  },
  {
    id: "new_cause",
    name: "New cause workspace",
    shortName: "New",
    initials: "NC",
    description: "Blank monitoring template for future workspaces",
    accent: "bg-slate-100 text-slate-800",
    logoSrc: "/orgs/new-cause-logo.svg",
    logoAlt: "New cause workspace logo",
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
      "You are my fundraising co-pilot. Prioritize open calls for proposals, donor announcements, and grant cycles. For each item show deadline, amount range, eligibility (esp. BK), and whether co-funding is required. Highlight calls expiring in the next 30 days.",
  },
  {
    id: "pr_comms",
    name: "Public Relations, Press & Communication",
    shortName: "PR & Communications",
    description: "Press, storytelling, public-facing narratives",
    focus: "Sector news, success stories, media-ready field updates",
    defaultPrompt:
      "You are my communications co-pilot. Surface sector news, success stories, and field updates that can become press releases, social posts, or newsletter items. Suggest angles, quotable numbers, and likely media interest. Avoid internal-only operational details.",
  },
  {
    id: "management",
    name: "Management / Executive Board",
    shortName: "Executive Board",
    description: "Strategic overview across all streams",
    focus: "High-priority items across funding, ops, and external news",
    defaultPrompt:
      "You are my executive briefing co-pilot. Give me a concise strategic overview across funding, operations, and external news. Highlight risks, opportunities, and items needing board-level decisions. Keep each item to 1–2 sentences.",
  },
];

const SESSION_KEY = "inbox.session.v1";

export function loadSession(): LoginSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session?.org && session.username) {
      return {
        org: session.org,
        username: normalizeUsername(session.username),
      } as LoginSession;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveSession(session: LoginSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      org: session.org,
      username: normalizeUsername(session.username),
    }),
  );
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
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

export function getDefaultDepartment(org: OrgId): DepartmentId {
  return org === "bk" ? "fundraising" : "pr_comms";
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}
