/* biome-ignore-all lint/performance/noImgElement: Migrated report cards use dynamic remote cover images. */

import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Calendar as CalendarIcon,
  Clock,
  Download,
  FileText,
  Minus,
  Plus,
  Share2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  mockReports,
  type ReportEntry,
  type ReportKPI,
  type ReportPeriod,
  type ReportType,
} from "@/data/mock-reports";
import { cn } from "@/lib/utils";

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "quarter", label: "Quarterly" },
  { id: "year", label: "Yearly" },
];

const TYPES: {
  id: "all" | ReportType;
  label: string;
  icon: typeof FileText;
}[] = [
  { id: "all", label: "All", icon: FileText },
  { id: "funding", label: "Funding", icon: Banknote },
  { id: "project", label: "Programs", icon: FileText },
  { id: "financial", label: "Finance", icon: Wallet },
];

const typeAccent: Record<
  ReportType,
  { chip: string; dot: string; ring: string }
> = {
  funding: {
    chip: "bg-[oklch(0.94_0.05_85)] text-[oklch(0.38_0.10_70)]",
    dot: "bg-[oklch(0.72_0.12_75)]",
    ring: "ring-[oklch(0.85_0.06_80)]",
  },
  project: {
    chip: "bg-[oklch(0.93_0.04_150)] text-[oklch(0.34_0.08_150)]",
    dot: "bg-[oklch(0.62_0.10_150)]",
    ring: "ring-[oklch(0.82_0.05_150)]",
  },
  financial: {
    chip: "bg-[oklch(0.93_0.04_245)] text-[oklch(0.34_0.10_245)]",
    dot: "bg-[oklch(0.62_0.10_245)]",
    ring: "ring-[oklch(0.82_0.05_245)]",
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TrendBadge({ kpi }: { kpi: ReportKPI }) {
  if (!kpi.delta) return null;
  const Icon =
    kpi.trend === "up"
      ? ArrowUpRight
      : kpi.trend === "down"
        ? ArrowDownRight
        : Minus;
  const tone =
    kpi.trend === "up"
      ? "text-[oklch(0.50_0.12_150)] bg-[oklch(0.95_0.04_150)]"
      : kpi.trend === "down"
        ? "text-[oklch(0.50_0.14_30)] bg-[oklch(0.96_0.03_30)]"
        : "text-muted-foreground bg-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
        tone,
      )}
    >
      <Icon className="h-3 w-3" />
      {kpi.delta}
    </span>
  );
}

function KPIStat({ kpi, large }: { kpi: ReportKPI; large?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
        {kpi.label}
      </div>
      <div className="flex items-baseline gap-2 mt-0.5">
        <div
          className={cn(
            "font-bold tabular-nums",
            large ? "text-2xl" : "text-base",
          )}
        >
          {kpi.value}
        </div>
        <TrendBadge kpi={kpi} />
      </div>
    </div>
  );
}

function CoverCard({
  report,
  onOpen,
}: {
  report: ReportEntry;
  onOpen: () => void;
}) {
  const accent = typeAccent[report.type];
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-xl ring-1 ring-black/5">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[320px]">
        <div className="relative lg:col-span-3 overflow-hidden bg-muted">
          {report.coverUrl && (
            <img
              src={report.coverUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/15 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
              <Sparkles className="h-3 w-3" /> {report.tag}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                accent.chip,
              )}
            >
              {report.type}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-[11px] uppercase tracking-[0.2em] opacity-80 mb-2">
              {fmtDate(report.date)} · {report.readMinutes} min read ·{" "}
              {report.author}
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight max-w-xl">
              {report.title}
            </h2>
            <p className="mt-2 text-sm text-white/85 max-w-xl">{report.dek}</p>
          </div>
        </div>
        <div className="lg:col-span-2 p-6 flex flex-col gap-5 bg-gradient-to-br from-white to-[oklch(0.985_0.005_145)]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Key metrics
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {report.kpis.map((k) => (
                <KPIStat key={k.label} kpi={k} large />
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Highlights
            </div>
            <ul className="space-y-1.5">
              {report.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      accent.dot,
                    )}
                  />
                  <span className="text-foreground/85">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex gap-2">
            <Button size="sm" className="rounded-full" onClick={onOpen}>
              Read report
            </Button>
            <Button size="sm" variant="outline" className="rounded-full">
              <Download className="h-3.5 w-3.5" /> PDF
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReportCard({
  report,
  onOpen,
}: {
  report: ReportEntry;
  onOpen: () => void;
}) {
  const accent = typeAccent[report.type];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      {report.coverUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={report.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                accent.chip,
              )}
            >
              {report.tag}
            </span>
          </div>
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
          <CalendarIcon className="h-3 w-3" />
          {fmtDate(report.date)}
          <span className="text-border">·</span>
          <Clock className="h-3 w-3" />
          {report.readMinutes} min
        </div>
        <div>
          <h3 className="text-base font-bold leading-snug tracking-tight line-clamp-2">
            {report.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {report.dek}
          </p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 pt-2 border-t border-border">
          {report.kpis.slice(0, 2).map((k) => (
            <KPIStat key={k.label} kpi={k} />
          ))}
        </div>
      </div>
    </button>
  );
}

function ReportDetail({ report }: { report: ReportEntry }) {
  const accent = typeAccent[report.type];
  return (
    <div className="flex flex-col max-h-[88vh] overflow-hidden">
      {report.coverUrl && (
        <div className="relative w-full aspect-[16/6] overflow-hidden bg-muted shrink-0">
          <img
            src={report.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  accent.chip,
                )}
              >
                {report.tag}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] opacity-80">
                {fmtDate(report.date)} · {report.readMinutes} min
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold leading-tight">
              {report.title}
            </DialogTitle>
            <p className="text-sm text-white/85 mt-1">{report.dek}</p>
          </div>
        </div>
      )}
      <div className="overflow-y-auto px-6 py-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-[oklch(0.985_0.005_145)] p-4 border border-border">
          {report.kpis.map((k) => (
            <KPIStat key={k.label} kpi={k} large />
          ))}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Executive summary
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {report.summary}
          </p>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Highlights
          </div>
          <ul className="space-y-2">
            {report.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    accent.dot,
                  )}
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-white shrink-0">
        <div className="text-xs text-muted-foreground">By {report.author}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-full">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button size="sm" className="rounded-full">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ReportsView() {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [type, setType] = useState<"all" | ReportType>("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ReportEntry | null>(null);

  const items = useMemo(() => {
    return mockReports.filter(
      (r) => r.period === period && (type === "all" || r.type === type),
    );
  }, [period, type]);

  const cover = items.find((r) => r.featured) ?? items[0];
  const rest = items.filter((r) => r.id !== cover?.id);

  const counts = useMemo(() => {
    const base = mockReports.filter((r) => r.period === period);
    return {
      all: base.length,
      funding: base.filter((r) => r.type === "funding").length,
      project: base.filter((r) => r.type === "project").length,
      financial: base.filter((r) => r.type === "financial").length,
    } as Record<string, number>;
  }, [period]);

  const openReport = (r: ReportEntry) => {
    setSelected(r);
    setOpen(true);
  };

  return (
    <div className="absolute inset-x-4 top-4 bottom-4 z-10 flex flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/65 shadow-xl backdrop-blur-xl ring-1 ring-white/30">
      {/* Masthead */}
      <header className="px-8 pt-6 pb-4 border-b border-white/50 bg-white/70">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              The Briefing · Issue {new Date().getFullYear()}
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1">
              Reports
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Curated weekly, monthly, quarterly and yearly reports across
              funding, programs and finance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <CalendarIcon className="h-3.5 w-3.5" /> Custom range
            </Button>
            <Button size="sm" className="rounded-full">
              <Plus className="h-3.5 w-3.5" /> Generate report
            </Button>
          </div>
        </div>

        {/* Period tabs + type pills */}
        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
            {PERIODS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-full transition-colors",
                  period === p.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.id;
              const count = counts[t.id] ?? 0;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white border-border text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                      active
                        ? "bg-background/20 text-background"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Magazine grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No reports for this view yet — try a different period or generate
            one.
          </div>
        ) : (
          <div className="space-y-6">
            {cover && (
              <CoverCard report={cover} onOpen={() => openReport(cover)} />
            )}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    In this issue
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rest.map((r) => (
                    <ReportCard
                      key={r.id}
                      report={r}
                      onOpen={() => openReport(r)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          overlayClassName="fixed inset-0 z-50 bg-transparent backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          className="max-w-3xl p-0 overflow-hidden gap-0 border border-white/50 bg-white shadow-2xl ring-1 ring-white/30"
        >
          {selected && <ReportDetail report={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
