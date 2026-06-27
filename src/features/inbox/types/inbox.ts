export type Priority = "urgent" | "relevant" | "information";
export type Category = "news" | "funding" | "report";
export type BkEligibility = "yes" | "check" | "no";

export interface BaseEntry {
  id: string;
  priority: Priority;
  category: Category;
  title: string;
  translatedFrom?: string;
  date: string; // ISO
  source: string;
  summary: string;
  location?: {
    name: string; // z.B. "Bujumbura, Burundi"
    coords: [number, number]; // [lng, lat]
    countryId?: string;
  };
  agentMetadata?: AgentMetadata;
}

export interface AgentMetadata {
  sourceUrl?: string;
  confidence?: number;
  detectedAt?: string;
  sourceType?: string;
  recommendedAction?: string;
  suggestedUse?: string;
  keyFacts?: string[];
  nextSteps?: string[];
  regionTags?: string[];
  impactAreas?: string[];
  fitScore?: number;
  applicationLead?: string;
  requiredDocuments?: string[];
  decisionReason?: string;
  monitoringTheme?: string;
  agentRunId?: number;
  deadlineLabel?: string;
}

export interface NewsEntry extends BaseEntry {
  category: "news";
  imageUrl?: string;
}

export type FundingPhaseKind =
  | "open"
  | "info"
  | "loi"
  | "deadline"
  | "decision"
  | "kickoff";

export interface FundingPhase {
  kind: FundingPhaseKind;
  label: string;
  date: string; // ISO
}

export interface FundingEntry extends BaseEntry {
  category: "funding";
  deadline: string; // ISO – submission deadline (main milestone)
  amountRange: string;
  topics: string[];
  funder: string;
  criteria: {
    ownContributionRequired: boolean;
    nrwHeadquarters: boolean;
    applyFromBurundi: boolean;
    notes?: string;
  };
  bkEligible: BkEligibility;
  /** Full application timeline. If omitted, derived from date → deadline. */
  phases?: FundingPhase[];
}

export interface ReportEntry extends BaseEntry {
  category: "report";
  originalLanguage: string;
  sender: string;
  originalText: string;
}

export type InboxEntry = NewsEntry | FundingEntry | ReportEntry;
