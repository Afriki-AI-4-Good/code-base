import {
  Calendar as CalendarIcon,
  Globe2,
  Newspaper,
  Radio,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { sourceLocations } from "@/data/source-locations";
import { cn } from "@/lib/utils";
import type { InboxEntry, NewsEntry } from "@/types/inbox";
import { InboxCard } from "./InboxCard";
import {
  countryMeta,
  globalCountry,
  sourceColor,
  sourceInitials,
} from "./source-meta";
import { filterByTime, type TimeRange, timeRangeOptions } from "./TimeFilter";

type CountryKey = string; // countryId or "global"

function countryKeyOf(e: InboxEntry): CountryKey {
  const loc = sourceLocations[e.id];
  return loc?.countryId ?? "global";
}

function countryDisplay(key: CountryKey) {
  return key === "global" ? globalCountry : (countryMeta[key] ?? globalCountry);
}

export function NewsView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (e: InboxEntry) => void;
}) {
  const news = useMemo(
    () =>
      entries
        .filter((e): e is NewsEntry => e.category === "news")
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  );

  const countries = useMemo(() => {
    const m = new Map<CountryKey, number>();
    for (const n of news) {
      const k = countryKeyOf(n);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [news]);

  const sources = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of news) m.set(n.source, (m.get(n.source) ?? 0) + 1);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [news]);

  const [country, setCountry] = useState<CountryKey | "all">("all");
  const [source, setSource] = useState<string | "all">("all");
  const [time, setTime] = useState<TimeRange>("all");

  const filtered = useMemo(() => {
    let list = news;
    if (country !== "all")
      list = list.filter((n) => countryKeyOf(n) === country);
    if (source !== "all") list = list.filter((n) => n.source === source);
    list = filterByTime(list, time);
    return list;
  }, [news, country, source, time]);

  const hasFilters = country !== "all" || source !== "all" || time !== "all";
  const resetAll = () => {
    setCountry("all");
    setSource("all");
    setTime("all");
  };

  return (
    <div className="absolute inset-x-4 top-4 bottom-4 z-10 flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/75 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-base font-semibold tracking-tight">News</h2>
            <p className="text-[11px] text-muted-foreground">
              {filtered.length} of {news.length} articles
            </p>
          </div>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-white/70 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {/* Unified filter bar — three rows, identical pill grammar */}
      <div className="space-y-2 border-b border-border/60 bg-white/50 px-6 py-3">
        <FilterRow icon={Globe2} label="Country">
          <Pill active={country === "all"} onClick={() => setCountry("all")}>
            <span className="text-base leading-none">🌐</span>
            <span>All</span>
            <Count n={news.length} active={country === "all"} />
          </Pill>
          {countries.map(([k, n]) => {
            const c = countryDisplay(k);
            const active = country === k;
            return (
              <Pill
                key={k}
                active={active}
                onClick={() => setCountry(active ? "all" : k)}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span>{c.name}</span>
                <Count n={n} active={active} />
              </Pill>
            );
          })}
        </FilterRow>

        <FilterRow icon={Radio} label="Source">
          <Pill active={source === "all"} onClick={() => setSource("all")}>
            <SourceDot name="All" muted />
            <span>All</span>
            <Count n={news.length} active={source === "all"} />
          </Pill>
          {sources.map(([s, n]) => {
            const active = source === s;
            return (
              <Pill
                key={s}
                active={active}
                onClick={() => setSource(active ? "all" : s)}
              >
                <SourceDot name={s} />
                <span className="max-w-[140px] truncate">{s}</span>
                <Count n={n} active={active} />
              </Pill>
            );
          })}
        </FilterRow>

        <FilterRow icon={CalendarIcon} label="Time">
          {timeRangeOptions.map((o) => {
            const active = time === o.id;
            return (
              <Pill key={o.id} active={active} onClick={() => setTime(o.id)}>
                <span>{o.label}</span>
              </Pill>
            );
          })}
        </FilterRow>
      </div>

      {/* Masonry waterfall */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No articles match the selected filters.
          </div>
        ) : (
          <div className="columns-1 gap-4 md:columns-2 xl:columns-3 [column-fill:_balance]">
            {filtered.map((n) => (
              <div key={n.id} className="mb-4 break-inside-avoid">
                <NewsMasonryCard entry={n} onClick={() => onSelect(n)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Masonry card with country + source badges ----------
function NewsMasonryCard({
  entry,
  onClick,
}: {
  entry: NewsEntry;
  onClick: () => void;
}) {
  const c = countryDisplay(countryKeyOf(entry));
  return (
    <div className="group">
      {/* Floating meta badges over the image */}
      <div className="relative">
        <InboxCard entry={entry} onClick={onClick} />
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            <span className="text-sm leading-none">{c.flag}</span>
            {c.name}
          </span>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-md">
            <SourceDot name={entry.source} size="sm" />
            <span className="max-w-[120px] truncate">{entry.source}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Filter row scaffolding ----------
function FilterRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Globe2;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex w-20 shrink-0 items-center gap-1.5 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {children}
      </div>
    </div>
  );
}

function Pill({
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
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border/60 bg-white/70 text-foreground/70 hover:border-border hover:bg-white hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Count({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 text-[10px] font-semibold leading-4",
        active
          ? "bg-white/25 text-primary-foreground"
          : "bg-muted text-muted-foreground",
      )}
    >
      {n}
    </span>
  );
}

function SourceDot({
  name,
  size = "md",
  muted,
}: {
  name: string;
  size?: "sm" | "md";
  muted?: boolean;
}) {
  const dim = size === "sm" ? "h-4 w-4 text-[8px]" : "h-4 w-4 text-[8px]";
  if (muted) {
    return (
      <span
        className={cn(
          "grid place-items-center rounded-full bg-muted font-bold text-muted-foreground",
          dim,
        )}
      >
        ◦
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full font-bold text-white",
        sourceColor(name),
        dim,
      )}
    >
      {sourceInitials(name)}
    </span>
  );
}
