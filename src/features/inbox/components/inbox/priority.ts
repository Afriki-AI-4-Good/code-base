import type {
  AgentMetadata,
  BkEligibility,
  Category,
  Priority,
} from "@/types/inbox";

// Soft, dusty palette aligned with the sage-green design system.
export const priorityMeta: Record<
  Priority,
  { label: string; dot: string; bar: string; chipBg: string; chipText: string }
> = {
  urgent: {
    label: "Urgent",
    dot: "bg-[oklch(0.7_0.09_22)]",
    bar: "bg-[oklch(0.7_0.09_22)]",
    chipBg: "bg-[oklch(0.96_0.025_22)]",
    chipText: "text-[oklch(0.45_0.12_22)]",
  },
  relevant: {
    label: "Relevant",
    dot: "bg-[oklch(0.75_0.09_80)]",
    bar: "bg-[oklch(0.75_0.09_80)]",
    chipBg: "bg-[oklch(0.96_0.03_80)]",
    chipText: "text-[oklch(0.4_0.07_80)]",
  },
  information: {
    label: "Information",
    dot: "bg-primary",
    bar: "bg-primary",
    chipBg: "bg-[var(--primary-soft)]",
    chipText: "text-[oklch(0.35_0.05_145)]",
  },
};

export const categoryLabel: Record<Category, string> = {
  news: "News",
  funding: "Funding",
  report: "Report",
};

export const bkLabel: Record<BkEligibility, { label: string; cls: string }> = {
  yes: {
    label: "BK eligible: Yes",
    cls: "bg-[var(--primary-soft)] text-[oklch(0.35_0.05_145)]",
  },
  check: {
    label: "BK: To review",
    cls: "bg-[oklch(0.96_0.03_80)] text-[oklch(0.4_0.07_80)]",
  },
  no: {
    label: "BK: Not eligible",
    cls: "bg-[oklch(0.96_0.025_22)] text-[oklch(0.45_0.12_22)]",
  },
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function hasConcreteFundingDeadline(entry: {
  agentMetadata?: AgentMetadata;
}) {
  return !entry.agentMetadata?.deadlineLabel;
}

export function fundingDeadlineLabel(entry: {
  deadline: string;
  agentMetadata?: AgentMetadata;
}) {
  return entry.agentMetadata?.deadlineLabel || formatDate(entry.deadline);
}

export function fundingDaysUntilLabel(entry: {
  deadline: string;
  agentMetadata?: AgentMetadata;
}) {
  return hasConcreteFundingDeadline(entry)
    ? `(${daysUntil(entry.deadline)} days)`
    : "";
}
