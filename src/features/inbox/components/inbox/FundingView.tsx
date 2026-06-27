import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  Flag,
  Info,
  ListFilter,
  MapPin,
  Megaphone,
  Rocket,
  Search,
  Target,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type {
  FundingEntry,
  FundingPhase,
  FundingPhaseKind,
  InboxEntry,
  Priority,
} from "@/types/inbox";
import { bkLabel, daysUntil, formatDate, priorityMeta } from "./priority";

// ---------- Phase configuration ----------
const phaseStyle: Record<
  FundingPhaseKind,
  {
    label: string;
    icon: typeof Megaphone;
    dot: string;
    ring: string;
    text: string;
  }
> = {
  open: {
    label: "Open",
    icon: Megaphone,
    dot: "bg-sky-500",
    ring: "ring-sky-200",
    text: "text-sky-700",
  },
  info: {
    label: "Info",
    icon: Info,
    dot: "bg-violet-500",
    ring: "ring-violet-200",
    text: "text-violet-700",
  },
  loi: {
    label: "LOI",
    icon: FileText,
    dot: "bg-amber-500",
    ring: "ring-amber-200",
    text: "text-amber-700",
  },
  deadline: {
    label: "Deadline",
    icon: Flag,
    dot: "bg-rose-500",
    ring: "ring-rose-200",
    text: "text-rose-700",
  },
  decision: {
    label: "Decision",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
  },
  kickoff: {
    label: "Kickoff",
    icon: Rocket,
    dot: "bg-primary",
    ring: "ring-primary/20",
    text: "text-primary",
  },
};

function getPhases(f: FundingEntry): FundingPhase[] {
  if (f.phases?.length)
    return [...f.phases].sort((a, b) => a.date.localeCompare(b.date));
  return [
    { kind: "open", label: "Call opens", date: f.date },
    { kind: "deadline", label: "Deadline", date: f.deadline },
  ];
}

function toDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------- Component ----------
type EligibilityFilter = "all" | "yes" | "check" | "no";
type PriorityFilter = "all" | Priority;

export function FundingView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (e: InboxEntry) => void;
}) {
  const allFundings = useMemo(
    () =>
      entries
        .filter((e): e is FundingEntry => e.category === "funding")
        .sort((a, b) => a.deadline.localeCompare(b.deadline)),
    [entries],
  );
  const [eligibility, setEligibility] = useState<EligibilityFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [query, setQuery] = useState("");
  const fundings = useMemo(
    () =>
      allFundings.filter((funding) => {
        const text =
          `${funding.title} ${funding.funder} ${funding.summary} ${funding.topics.join(" ")}`.toLowerCase();
        return (
          (eligibility === "all" || funding.bkEligible === eligibility) &&
          (priority === "all" || funding.priority === priority) &&
          (!query.trim() || text.includes(query.trim().toLowerCase()))
        );
      }),
    [allFundings, eligibility, priority, query],
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    allFundings[0]?.id ?? null,
  );
  const selected = fundings.find((f) => f.id === selectedId) ?? null;

  const [month, setMonth] = useState<Date>(() =>
    selected ? toDate(selected.deadline) : new Date(),
  );

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (
      fundings.length > 0 &&
      !fundings.some((funding) => funding.id === selectedId)
    ) {
      setSelectedId(fundings[0]?.id ?? null);
    }
  }, [fundings, selectedId]);

  useEffect(() => {
    if (selectedId && itemRefs.current[selectedId]) {
      itemRefs.current[selectedId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedId]);

  // Application window (range) of the currently selected funding
  const selectedWindow = useMemo(() => {
    if (!selected) return null;
    const phases = getPhases(selected);
    if (phases.length < 2) return null;
    const firstPhase = phases[0];
    const lastPhase = phases.at(-1);
    if (!firstPhase || !lastPhase) return null;
    return {
      from: toDate(firstPhase.date),
      to: toDate(lastPhase.date),
    };
  }, [selected]);

  // Aggregate ALL milestones across ALL fundings, grouped by kind for calendar dots
  const milestonesByKind = useMemo(() => {
    const out: Record<FundingPhaseKind, Date[]> = {
      open: [],
      info: [],
      loi: [],
      deadline: [],
      decision: [],
      kickoff: [],
    };
    for (const f of fundings) {
      for (const p of getPhases(f)) {
        out[p.kind].push(toDate(p.date));
      }
    }
    return out;
  }, [fundings]);

  const handleDayClick = (date: Date) => {
    // Find the first funding whose milestone falls on this day
    for (const f of fundings) {
      for (const p of getPhases(f)) {
        if (sameDay(toDate(p.date), date)) {
          setSelectedId(f.id);
          setMonth(date);
          return;
        }
      }
    }
  };

  const handleTimelineClick = (f: FundingEntry) => {
    setSelectedId(f.id);
    setMonth(toDate(f.deadline));
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="rounded-2xl border border-white/40 bg-white/75 px-5 py-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <ListFilter className="h-3.5 w-3.5" />
              Funding workspace
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight">
              Grant pipeline
            </h1>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Database-backed funding calls with agent-ready fit scores, next
              steps, deadlines, and eligibility checks.
            </p>
          </div>
          <div className="grid min-w-[520px] flex-1 gap-2 md:grid-cols-4">
            <FundingStat label="Calls" value={String(allFundings.length)} />
            <FundingStat
              label="BK eligible"
              value={String(
                allFundings.filter((funding) => funding.bkEligible === "yes")
                  .length,
              )}
            />
            <FundingStat
              label="Urgent"
              value={String(
                allFundings.filter((funding) => funding.priority === "urgent")
                  .length,
              )}
            />
            <FundingStat
              label="Next deadline"
              value={
                allFundings[0] ? `${daysUntil(allFundings[0].deadline)}d` : "-"
              }
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search funder, topic, or region"
              className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <FilterChip
            active={eligibility === "all"}
            onClick={() => setEligibility("all")}
          >
            All eligibility
          </FilterChip>
          <FilterChip
            active={eligibility === "yes"}
            onClick={() => setEligibility("yes")}
          >
            BK eligible
          </FilterChip>
          <FilterChip
            active={eligibility === "check"}
            onClick={() => setEligibility("check")}
          >
            Needs check
          </FilterChip>
          <FilterChip
            active={priority === "urgent"}
            onClick={() =>
              setPriority(priority === "urgent" ? "all" : "urgent")
            }
          >
            Urgent
          </FilterChip>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        {/* ---------- Left: Calendar panel ---------- */}
        <div className="flex w-[420px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/75 shadow-xl backdrop-blur-xl">
          <div className="border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold tracking-tight">
                Funding Calendar
              </h2>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {fundings.length} open calls · all application phases shown
            </p>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-3">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selected ? toDate(selected.deadline) : undefined}
              onDayClick={handleDayClick}
              showOutsideDays
              modifiers={{
                window: selectedWindow ? [selectedWindow] : [],
                windowStart: selectedWindow ? [selectedWindow.from] : [],
                windowEnd: selectedWindow ? [selectedWindow.to] : [],
                mOpen: milestonesByKind.open,
                mInfo: milestonesByKind.info,
                mLoi: milestonesByKind.loi,
                mDeadline: milestonesByKind.deadline,
                mDecision: milestonesByKind.decision,
                mKickoff: milestonesByKind.kickoff,
              }}
              modifiersClassNames={{
                window: "bg-primary/10 text-foreground rounded-none",
                windowStart: "rounded-l-full",
                windowEnd: "rounded-r-full",
                mOpen:
                  "relative font-semibold after:absolute after:bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-sky-500",
                mInfo:
                  "relative font-semibold after:absolute after:bottom-0.5 after:left-[35%] after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-violet-500",
                mLoi: "relative font-semibold after:absolute after:bottom-0.5 after:left-[65%] after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-amber-500",
                mDeadline:
                  "relative font-bold text-rose-700 after:absolute after:bottom-0.5 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-rose-500",
                mDecision:
                  "relative font-semibold after:absolute after:bottom-0.5 after:left-[30%] after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-emerald-500",
                mKickoff:
                  "relative font-semibold after:absolute after:bottom-0.5 after:left-[70%] after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
              }}
              className="pointer-events-auto p-2"
            />

            {/* Legend */}
            <div className="mt-3 space-y-2 border-t border-border/60 px-2 pt-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Phase legend
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {(Object.keys(phaseStyle) as FundingPhaseKind[]).map((k) => {
                  const s = phaseStyle[k];
                  return (
                    <span key={k} className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                      <span className="text-muted-foreground">{s.label}</span>
                    </span>
                  );
                })}
              </div>
              <p className="pt-1 text-[10px] text-muted-foreground">
                <span className="mr-1 inline-block h-2 w-3 rounded-sm bg-primary/20 align-middle" />
                Shaded range = application window of the selected call
              </p>
            </div>

            {/* Selected funding milestone list */}
            {selected && (
              <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-white/60 p-3">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Phases · {selected.funder.split(" – ")[0]}
                </p>
                <ol className="space-y-1.5">
                  {getPhases(selected).map((p) => {
                    const s = phaseStyle[p.kind];
                    const Icon = s.icon;
                    return (
                      <li
                        key={`${p.kind}-${p.date}-${p.label}`}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <Icon className={cn("h-3 w-3", s.text)} />
                        <span className="font-medium">{p.label}</span>
                        <span className="ml-auto text-muted-foreground">
                          {formatDate(p.date)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            {selected && <AgentFundingPanel entry={selected} />}
          </div>
        </div>

        {/* ---------- Right: Vertical timeline ---------- */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/75 shadow-xl backdrop-blur-xl">
          <div className="border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Funding Timeline
              </h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Full application lifecycle for each call · click any phase to
                focus
              </p>
            </div>
          </div>

          <div
            ref={listRef}
            className="relative flex-1 overflow-y-auto px-6 py-6"
          >
            <div className="absolute left-[34px] top-6 bottom-6 w-px bg-border" />

            <div className="flex flex-col gap-5">
              {fundings.map((f) => {
                const isSelected = selectedId === f.id;
                const days = daysUntil(f.deadline);
                const meta = priorityMeta[f.priority];
                const phases = getPhases(f);
                const firstPhase = phases[0];
                const lastPhase = phases.at(-1);
                if (!firstPhase || !lastPhase) return null;
                const start = toDate(firstPhase.date).getTime();
                const end = toDate(lastPhase.date).getTime();
                const span = Math.max(1, end - start);
                const today = Date.now();
                const progressPct =
                  today <= start
                    ? 0
                    : today >= end
                      ? 100
                      : ((today - start) / span) * 100;

                return (
                  <div
                    key={f.id}
                    ref={(el) => {
                      itemRefs.current[f.id] = el;
                    }}
                    className="relative pl-12"
                  >
                    <button
                      type="button"
                      onClick={() => handleTimelineClick(f)}
                      className={cn(
                        "absolute left-[26px] top-3 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full ring-4 transition-all",
                        meta.dot,
                        isSelected ? "ring-primary/30 scale-125" : "ring-white",
                      )}
                      aria-label={`Focus ${f.title}`}
                    />

                    <div
                      className={cn(
                        "w-full rounded-xl border bg-white/85 p-4 shadow-sm transition-all",
                        isSelected
                          ? "border-primary/40 ring-2 ring-primary/20"
                          : "border-border/60 hover:shadow-md",
                      )}
                    >
                      {/* Header row */}
                      <button
                        type="button"
                        onClick={() => handleTimelineClick(f)}
                        className="w-full text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 font-medium",
                              meta.chipBg,
                              meta.chipText,
                            )}
                          >
                            {meta.label}
                          </span>
                          <span>·</span>
                          <span>Deadline {formatDate(f.deadline)}</span>
                          {days >= 0 && (
                            <span
                              className={cn(
                                "font-medium",
                                days <= 14 ? "text-rose-600" : "",
                              )}
                            >
                              · in {days}d
                            </span>
                          )}
                          <span
                            className={cn(
                              "ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium",
                              bkLabel[f.bkEligible].cls,
                            )}
                          >
                            {bkLabel[f.bkEligible].label}
                          </span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold leading-snug">
                          {f.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Banknote className="h-3 w-3" /> {f.amountRange}
                          </span>
                          <span>{f.funder}</span>
                          {typeof f.agentMetadata?.fitScore === "number" && (
                            <span className="flex items-center gap-1 font-medium text-[oklch(0.35_0.07_145)]">
                              <Target className="h-3 w-3" /> Fit{" "}
                              {f.agentMetadata.fitScore}%
                            </span>
                          )}
                          {f.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {f.location.name}
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Phase progress bar */}
                      <div className="mt-4">
                        <div className="relative h-1.5 rounded-full bg-muted">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-primary/60"
                            style={{ width: `${progressPct}%` }}
                          />
                          {phases.map((p) => {
                            const t = toDate(p.date).getTime();
                            const left =
                              phases.length === 1
                                ? 50
                                : ((t - start) / span) * 100;
                            const s = phaseStyle[p.kind];
                            const isPast = today >= t;
                            return (
                              <button
                                type="button"
                                key={`${p.kind}-${p.date}-${p.label}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(f.id);
                                  setMonth(toDate(p.date));
                                }}
                                className={cn(
                                  "group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 transition-transform hover:scale-125",
                                  s.dot,
                                  s.ring,
                                  isPast ? "opacity-100" : "opacity-90",
                                  "h-3 w-3",
                                )}
                                style={{ left: `${left}%` }}
                                aria-label={`${p.label} – ${formatDate(p.date)}`}
                                title={`${p.label} · ${formatDate(p.date)}`}
                              />
                            );
                          })}
                        </div>

                        {/* Phase labels under the bar */}
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                          {phases.map((p) => {
                            const s = phaseStyle[p.kind];
                            const Icon = s.icon;
                            return (
                              <span
                                key={`${p.kind}-${p.date}-${p.label}`}
                                className="inline-flex items-center gap-1"
                              >
                                <Icon className={cn("h-2.5 w-2.5", s.text)} />
                                <span className="font-medium">{p.label}</span>
                                <span className="text-muted-foreground/70">
                                  {formatDate(p.date)}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Topics + summary */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {f.topics.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 line-clamp-2 text-[12px] text-muted-foreground">
                        {f.summary}
                      </p>
                      {f.agentMetadata?.recommendedAction && (
                        <div className="mt-3 rounded-lg bg-[oklch(0.97_0.018_110)] px-3 py-2 text-[12px] leading-5 text-[oklch(0.32_0.05_145)]">
                          {f.agentMetadata.recommendedAction}
                        </div>
                      )}

                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(f);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                        >
                          Open details <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {fundings.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No funding calls in this time range.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FundingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-sm">
      <div className="text-[10px] font-semibold uppercase text-muted-foreground">
        {label}
      </div>
      <div className="text-lg font-black tabular-nums">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg border px-3 text-xs font-semibold transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-white text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function AgentFundingPanel({ entry }: { entry: FundingEntry }) {
  const metadata = entry.agentMetadata;
  if (!metadata) return null;

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-border/60 bg-white/70 p-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <FileCheck2 className="h-3.5 w-3.5" />
        Agent-ready record
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <MiniFact
          icon={Target}
          label="Fit score"
          value={
            typeof metadata.fitScore === "number"
              ? `${metadata.fitScore}%`
              : "Pending"
          }
        />
        <MiniFact
          icon={UserRound}
          label="Lead"
          value={metadata.applicationLead ?? "Unassigned"}
        />
      </div>
      {metadata.requiredDocuments?.length ? (
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
            Documents
          </div>
          <div className="flex flex-wrap gap-1">
            {metadata.requiredDocuments.slice(0, 4).map((document) => (
              <span
                key={document}
                className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground"
              >
                {document}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[oklch(0.985_0.004_110)] p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
