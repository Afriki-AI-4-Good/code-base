"use client";

import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Calendar,
  Check,
  FileText,
  Flame,
  Newspaper,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import { categoryLabel, formatDate, priorityMeta } from "./priority";

type SwipeBucket = "later" | "critical" | "cleared";

interface SwipeDecision {
  entry: InboxEntry;
  bucket: SwipeBucket;
}

const bucketMeta: Record<
  SwipeBucket,
  {
    label: string;
    hint: string;
    icon: typeof Archive;
    className: string;
    railClassName: string;
  }
> = {
  later: {
    label: "Later",
    hint: "Park for a second pass",
    icon: Archive,
    className: "bg-white text-[oklch(0.42_0.02_264)] ring-border",
    railClassName: "border-[oklch(0.9_0.01_264)] bg-white/55",
  },
  critical: {
    label: "Critical",
    hint: "Promote to top priority",
    icon: Flame,
    className:
      "bg-[oklch(0.97_0.028_32)] text-[oklch(0.45_0.1_32)] ring-[oklch(0.86_0.055_32)]",
    railClassName: "border-[oklch(0.86_0.055_32)] bg-[oklch(0.98_0.018_32)]",
  },
  cleared: {
    label: "Cleared",
    hint: "No action needed",
    icon: Check,
    className:
      "bg-[var(--primary-soft)] text-[oklch(0.35_0.05_145)] ring-[oklch(0.84_0.04_145)]",
    railClassName: "border-[oklch(0.84_0.04_145)] bg-[oklch(0.97_0.018_145)]",
  },
};

const categoryIcon = {
  funding: Banknote,
  news: Newspaper,
  report: FileText,
};

export function SwipeReviewView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (entry: InboxEntry) => void;
}) {
  const sorted = useMemo(
    () =>
      [...entries].sort((a, b) => {
        const priorityRank = { urgent: 0, relevant: 1, information: 2 };
        return (
          priorityRank[a.priority] - priorityRank[b.priority] ||
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }),
    [entries],
  );
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<SwipeDecision[]>([]);
  const [dragX, setDragX] = useState(0);

  const current = sorted[index];
  const next = sorted[index + 1];
  const progress = sorted.length
    ? Math.min(100, (index / sorted.length) * 100)
    : 0;
  const counts = decisions.reduce(
    (acc, decision) => {
      acc[decision.bucket] += 1;
      return acc;
    },
    { later: 0, critical: 0, cleared: 0 } satisfies Record<SwipeBucket, number>,
  );

  const decide = (bucket: SwipeBucket) => {
    if (!current) return;
    setDecisions((prev) => [...prev, { entry: current, bucket }]);
    setIndex((prev) => prev + 1);
    setDragX(0);
  };

  const undo = () => {
    setDecisions((prev) => {
      if (!prev.length) return prev;
      return prev.slice(0, -1);
    });
    setIndex((prev) => Math.max(0, prev - 1));
    setDragX(0);
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-[oklch(0.982_0.004_145)]">
      <div className="border-b border-border/70 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Message Triage</h1>
            <p className="text-[11px] text-muted-foreground">
              Swipe or choose a lane to classify incoming items
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(Object.keys(bucketMeta) as SwipeBucket[]).map((bucket) => {
              const meta = bucketMeta[bucket];
              const Icon = meta.icon;
              return (
                <div
                  key={bucket}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold ring-1",
                    meta.className,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{counts[bucket]}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-20 text-right text-[11px] font-semibold text-muted-foreground">
            {Math.min(index + 1, sorted.length)} / {sorted.length || 0}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-5 md:px-6">
        <div className="relative grid h-full w-full max-w-7xl grid-cols-1 items-center gap-4 md:grid-cols-[180px_minmax(360px,560px)_180px] lg:grid-cols-[220px_minmax(420px,620px)_220px]">
          <ActionRail
            bucket="later"
            onClick={() => decide("later")}
            disabled={!current}
          />

          <div className="relative mx-auto h-[min(66vh,620px)] min-h-[470px] w-full max-w-[620px]">
            {next && (
              <MessageCard
                entry={next}
                muted
                style={{
                  transform: "translateY(22px) scale(0.94)",
                  opacity: 0.46,
                }}
              />
            )}
            {current ? (
              <MessageCard
                entry={current}
                onOpen={() => onSelect(current)}
                style={{
                  transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`,
                }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
                    return;
                  }
                  setDragX((prev) => prev + event.movementX);
                }}
                onPointerUp={(event) => {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                  if (dragX < -120) decide("later");
                  else if (dragX > 120) decide("cleared");
                  else setDragX(0);
                }}
              />
            ) : (
              <div className="grid h-full place-items-center rounded-xl border border-border bg-white p-8 text-center shadow-xl">
                <div>
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-[var(--primary-soft)] text-primary">
                    <Check className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-bold">Queue complete</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {counts.critical} critical · {counts.later} later ·{" "}
                    {counts.cleared} cleared
                  </p>
                </div>
              </div>
            )}
          </div>

          <ActionRail
            bucket="cleared"
            onClick={() => decide("cleared")}
            disabled={!current}
          />
        </div>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border/70 bg-white/90 p-2 shadow-xl backdrop-blur-xl">
          <Button
            type="button"
            variant="outline"
            onClick={() => decide("later")}
            disabled={!current}
            className="h-11 rounded-lg px-3 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Later
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={!decisions.length}
            className="h-11 w-11 rounded-lg bg-white"
            aria-label="Undo"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            onClick={() => decide("critical")}
            disabled={!current}
            className="h-11 rounded-lg bg-[oklch(0.62_0.105_32)] px-5 text-white shadow-sm hover:bg-[oklch(0.56_0.11_32)]"
          >
            <Flame className="h-5 w-5" />
            Critical
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => decide("cleared")}
            disabled={!current}
            className="h-11 rounded-lg px-3 md:hidden"
          >
            Cleared
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionRail({
  bucket,
  onClick,
  disabled,
}: {
  bucket: Exclude<SwipeBucket, "critical">;
  onClick: () => void;
  disabled: boolean;
}) {
  const meta = bucketMeta[bucket];
  const Icon = bucket === "later" ? ArrowLeft : ArrowRight;
  const MetaIcon = meta.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "hidden h-[min(56vh,520px)] min-h-80 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-45 md:flex",
        meta.railClassName,
      )}
      aria-label={meta.label}
    >
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-border">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <div className="inline-flex items-center gap-1.5 text-sm font-bold">
          <MetaIcon className="h-4 w-4" />
          {meta.label}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {meta.hint}
        </p>
      </div>
    </button>
  );
}

function MessageCard({
  entry,
  muted,
  style,
  onOpen,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  entry: InboxEntry;
  muted?: boolean;
  style?: React.CSSProperties;
  onOpen?: () => void;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
}) {
  const priority = priorityMeta[entry.priority];
  const CategoryIcon = categoryIcon[entry.category];
  return (
    <div
      className={cn(
        "absolute inset-0 touch-none select-none overflow-hidden rounded-xl border border-border bg-white shadow-2xl transition-transform duration-150",
        muted && "pointer-events-none",
      )}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="grid h-full grid-rows-[auto_1fr_auto]">
        <div className={cn("h-2 w-full", priority.bar)} />
        <div className="min-h-0 overflow-y-auto p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "rounded-md border-0 text-[10px] uppercase tracking-wide",
                  priority.chipBg,
                  priority.chipText,
                )}
              >
                {priority.label}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-md text-[10px] uppercase"
              >
                <CategoryIcon className="h-3 w-3" />
                {categoryLabel[entry.category]}
              </Badge>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(entry.date)}
            </span>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {entry.source}
          </p>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
            {entry.title}
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-muted-foreground md:text-base">
            {entry.summary}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Source
              </div>
              <div className="mt-1 truncate font-semibold">{entry.source}</div>
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </div>
              <div className="mt-1 font-semibold">
                {categoryLabel[entry.category]}
              </div>
            </div>
          </div>

          {entry.category === "funding" && (
            <div className="mt-3 grid gap-3 rounded-lg border border-border/70 bg-[oklch(0.98_0.018_145)] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-right font-semibold">
                  {entry.amountRange}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Deadline</span>
                <span className="text-right font-semibold">
                  {formatDate(entry.deadline)}
                </span>
              </div>
            </div>
          )}

          {entry.category === "report" && (
            <div className="mt-3 rounded-lg border border-border/70 bg-muted/35 p-4 text-sm">
              <div className="font-semibold">{entry.sender}</div>
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                {entry.originalText}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-white/95 p-4">
          <button
            type="button"
            onClick={onOpen}
            className="h-11 w-full rounded-lg border border-border bg-white text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
          >
            Open details
          </button>
        </div>
      </div>
    </div>
  );
}
