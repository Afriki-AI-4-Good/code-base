import {
  AlertTriangle,
  FileText,
  Languages,
  Mail,
  MailCheck,
  Send,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_EXTRAS,
  type LoginSession,
  type UserProfile,
} from "@/lib/profile";
import { cn } from "@/lib/utils";
import type { InboxEntry, Priority, ReportEntry } from "@/types/inbox";
import { formatDate, priorityMeta } from "./priority";

type ReportFilter = "all" | Priority;

const FILTERS: { id: ReportFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "relevant", label: "Relevant" },
  { id: "information", label: "Information" },
];

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  relevant: 1,
  information: 2,
};

export function ReportsView({
  entries,
  session,
  profile,
  onSelect,
}: {
  entries: InboxEntry[];
  session: LoginSession;
  profile: UserProfile | null;
  onSelect: (entry: InboxEntry) => void;
}) {
  const reports = useMemo(() => getSortedReports(entries), [entries]);
  const [filter, setFilter] = useState<ReportFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleReports = useMemo(
    () =>
      filter === "all"
        ? reports
        : reports.filter((report) => report.priority === filter),
    [filter, reports],
  );
  const selected =
    reports.find((report) => report.id === selectedId) ??
    visibleReports[0] ??
    reports[0] ??
    null;
  const counts = getReportCounts(reports);

  return (
    <div className="absolute inset-x-4 bottom-4 top-4 z-10 flex flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-xl ring-1 ring-white/30 backdrop-blur-xl">
      <header className="border-b border-white/50 bg-white/75 px-6 pb-4 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Email intake
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Reports</h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Incoming mailbox reports and project emails, sorted by urgency and
              prepared as translated working notes.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground shadow-sm">
            <MailCheck className="h-4 w-4 text-[oklch(0.42_0.09_150)]" />
            Gmail connector ready for backend handoff
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <StatTile
            icon={Mail}
            label="Received emails"
            value={String(reports.length)}
          />
          <StatTile
            icon={AlertTriangle}
            label="Needs action"
            value={String(counts.urgent)}
            tone="urgent"
          />
          <StatTile
            icon={Languages}
            label="Translated"
            value={String(
              reports.filter((report) => report.translatedFrom).length,
            )}
            tone="positive"
          />
          <StatTile
            icon={UserRound}
            label="Senders"
            value={String(new Set(reports.map((report) => report.sender)).size)}
          />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <section className="flex min-h-0 flex-col border-r border-white/50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/50 bg-white/45 px-5 py-3">
            <div className="inline-flex rounded-lg border border-border bg-white p-1 shadow-sm">
              {FILTERS.map((item) => (
                <FilterButton
                  key={item.id}
                  item={item}
                  active={filter === item.id}
                  count={counts[item.id]}
                  onClick={() => setFilter(item.id)}
                />
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Funding calls stay in the Funding workspace.
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {visibleReports.length === 0 ? (
              <EmptyReports />
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {visibleReports.map((report) => (
                  <ReportMailCard
                    key={report.id}
                    report={report}
                    active={selected?.id === report.id}
                    onPreview={() => setSelectedId(report.id)}
                    onOpen={() => onSelect(report)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="min-h-0 overflow-y-auto bg-[oklch(0.985_0.006_110)] p-5">
          {selected ? (
            <OutputPreview
              report={selected}
              profile={profile}
              session={session}
              onOpen={() => onSelect(selected)}
            />
          ) : (
            <EmptyPreview />
          )}
        </aside>
      </div>
    </div>
  );
}

function getSortedReports(entries: InboxEntry[]) {
  return entries
    .filter(isReport)
    .sort(
      (a, b) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

function getReportCounts(reports: ReportEntry[]) {
  return {
    all: reports.length,
    urgent: reports.filter((report) => report.priority === "urgent").length,
    relevant: reports.filter((report) => report.priority === "relevant").length,
    information: reports.filter((report) => report.priority === "information")
      .length,
  } satisfies Record<ReportFilter, number>;
}

function isReport(entry: InboxEntry): entry is ReportEntry {
  return entry.category === "report";
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  tone?: "neutral" | "urgent" | "relevant" | "positive";
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-3 shadow-sm">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-[oklch(0.94_0.025_145)] text-[oklch(0.36_0.07_145)]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
          {label}
        </div>
        <div
          className={cn("text-lg font-black tabular-nums", statToneClass[tone])}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  item,
  active,
  count,
  onClick,
}: {
  item: { id: ReportFilter; label: string };
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {item.label}
      <span
        className={cn(
          "rounded px-1.5 text-[10px] tabular-nums",
          active ? "bg-background/20" : "bg-muted",
          !active && reportFilterCountClass[item.id],
        )}
      >
        {count}
      </span>
    </button>
  );
}

const statToneClass = {
  neutral: "text-foreground",
  urgent: "text-[oklch(0.45_0.12_22)]",
  relevant: "text-[oklch(0.4_0.07_80)]",
  positive: "text-[oklch(0.35_0.05_145)]",
};

const reportFilterCountClass: Record<ReportFilter, string> = {
  all: "text-muted-foreground",
  urgent: "text-[oklch(0.45_0.12_22)]",
  relevant: "text-[oklch(0.4_0.07_80)]",
  information: "text-[oklch(0.35_0.05_145)]",
};

function EmptyReports() {
  return (
    <div className="grid h-full min-h-72 place-items-center rounded-lg border border-dashed border-border bg-white/60 text-sm text-muted-foreground">
      No emails match this urgency filter.
    </div>
  );
}

function ReportMailCard({
  report,
  active,
  onPreview,
  onOpen,
}: {
  report: ReportEntry;
  active: boolean;
  onPreview: () => void;
  onOpen: () => void;
}) {
  const meta = priorityMeta[report.priority];

  return (
    <button
      type="button"
      onClick={onPreview}
      className={cn(
        "group relative flex min-h-64 flex-col rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        active ? "border-primary ring-2 ring-primary/15" : "border-border",
      )}
    >
      <div
        className={cn("absolute inset-y-0 left-0 w-1 rounded-l-lg", meta.bar)}
      />
      <div className="flex min-w-0 items-start justify-between gap-3 pl-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge className={cn("border-0", meta.chipBg, meta.chipText)}>
            {meta.label}
          </Badge>
          <Badge variant="outline">Email report</Badge>
          {report.translatedFrom && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Languages className="h-3 w-3" />
              {report.translatedFrom}
            </span>
          )}
        </div>
        <div className="shrink-0 text-[11px] text-muted-foreground">
          {formatDate(report.date)}
        </div>
      </div>

      <h2 className="mt-3 line-clamp-2 break-words pl-1 text-base font-bold leading-snug tracking-tight">
        {report.title}
      </h2>
      <div className="mt-2 flex min-w-0 items-center gap-2 pl-1 text-xs text-muted-foreground">
        <UserRound className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 truncate">{report.sender}</span>
      </div>
      <p className="mt-3 line-clamp-4 break-words pl-1 text-sm leading-6 text-muted-foreground">
        {report.summary}
      </p>

      <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pl-1 pt-4">
        <div className="min-w-0 truncate text-[11px] text-muted-foreground">
          Source: {report.source}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          Open
        </Button>
      </div>
    </button>
  );
}

function OutputPreview({
  report,
  profile,
  session,
  onOpen,
}: {
  report: ReportEntry;
  profile: UserProfile | null;
  session: LoginSession;
  onOpen: () => void;
}) {
  const output = buildMockOutput(report, profile, session);
  const meta = priorityMeta[report.priority];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Mock transformed output
            </div>
            <h2 className="mt-1 text-xl font-black tracking-tight">
              {output.title}
            </h2>
          </div>
          <Badge className={cn("border-0", meta.chipBg, meta.chipText)}>
            {meta.label}
          </Badge>
        </div>

        <div className="space-y-3">
          {output.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 rounded-md bg-[oklch(0.985_0.004_110)] px-3 py-2"
            >
              <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                {row.label}
              </div>
              <div className="text-sm leading-6">{row.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-border bg-white p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" />
            Urgency basis
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {output.urgencyBasis}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" size="sm" onClick={onOpen}>
            <FileText className="h-4 w-4" />
            Open source email
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
          <Send className="h-3.5 w-3.5" />
          Ready-for-team note
        </div>
        <p className="text-sm leading-6 text-foreground/85">{output.note}</p>
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="grid h-full min-h-96 place-items-center rounded-lg border border-dashed border-border bg-white/60 text-sm text-muted-foreground">
      Select an email to preview its transformed output.
    </div>
  );
}

function buildMockOutput(
  report: ReportEntry,
  profile: UserProfile | null,
  session: LoginSession,
) {
  return session.org === "bk"
    ? buildBkOutput(report, profile)
    : buildWtgOutput(report, profile, session);
}

function buildWtgOutput(
  report: ReportEntry,
  profile: UserProfile | null,
  session: LoginSession,
) {
  const category = pickWtgCategory(report, profile, session.org);
  const url =
    extractUrl(report.originalText) ?? `https://source.example/${report.id}`;

  return {
    title: "Daily press mirror item",
    rows: [
      { label: "Headline", value: report.title },
      { label: "URL", value: url },
      { label: "WTG category", value: category },
      {
        label: "Sender and date",
        value: `${report.sender} · ${formatDate(report.date)}`,
      },
    ],
    urgencyBasis: getUrgencyBasis(report, profile),
    note: "Prepared for the daily press mirror: one central headline, source URL, category, and urgency label before communications review.",
  };
}

function buildBkOutput(report: ReportEntry, profile: UserProfile | null) {
  return {
    title: "Translated email report",
    rows: [
      { label: "Translated title", value: report.title },
      { label: "Original language", value: report.originalLanguage },
      {
        label: "Sender and date",
        value: `${report.sender} · ${formatDate(report.date)}`,
      },
      { label: "Summary", value: report.summary },
    ],
    urgencyBasis: getUrgencyBasis(report, profile),
    note: "Prepared for project coordination: translated subject, sender, date, short summary, and action priority before the original email is opened.",
  };
}

function pickWtgCategory(
  report: ReportEntry,
  profile: UserProfile | null,
  org: LoginSession["org"],
) {
  const categories = profile?.wtgNewsCategories?.length
    ? profile.wtgNewsCategories
    : org === "new_cause"
      ? []
      : DEFAULT_EXTRAS.wtgNewsCategories;
  const fallbackCategory =
    org === "new_cause" ? "Uncategorized" : "International animal welfare";
  const text =
    `${report.title} ${report.summary} ${report.originalText}`.toLowerCase();

  if (text.includes("instagram") || text.includes("social")) {
    return (
      findCategory(categories, "social") ?? categories[2] ?? fallbackCategory
    );
  }
  if (
    text.includes("germany") ||
    text.includes("german") ||
    text.includes("welpen")
  ) {
    return (
      findCategory(categories, "germany") ?? categories[0] ?? fallbackCategory
    );
  }
  if (text.includes("ngo")) {
    return findCategory(categories, "ngo") ?? categories[4] ?? fallbackCategory;
  }
  if (text.includes("farm") || text.includes("agriculture")) {
    return (
      findCategory(categories, "agriculture") ??
      categories[3] ??
      fallbackCategory
    );
  }
  return categories[1] ?? fallbackCategory;
}

function findCategory(categories: string[], needle: string) {
  return categories.find((category) => category.toLowerCase().includes(needle));
}

function getUrgencyBasis(report: ReportEntry, profile: UserProfile | null) {
  const urgency = profile?.urgency ?? DEFAULT_EXTRAS.urgency;
  if (report.priority === "urgent") return urgency.urgentDefinition;
  if (report.priority === "relevant") return urgency.relevantDefinition;
  return urgency.informationDefinition;
}

function extractUrl(text: string) {
  return text.match(/https?:\/\/\S+/)?.[0]?.replace(/[),.;]+$/, "");
}
