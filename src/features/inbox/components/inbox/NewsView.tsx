import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Globe2,
  Newspaper,
  Radio,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { sourceLocations } from "@/data/source-locations";
import { cn } from "@/lib/utils";
import type { InboxEntry, NewsEntry, Priority } from "@/types/inbox";
import { InboxCard } from "./InboxCard";
import {
  countryMeta,
  globalCountry,
  sourceColor,
  sourceInitials,
} from "./source-meta";
import { filterByTime, type TimeRange, timeRangeOptions } from "./TimeFilter";

type CountryKey = string; // countryId or "global"
type PriorityFilter = "all" | Priority;

function countryKeyOf(e: InboxEntry): CountryKey {
  const loc = e.location ?? sourceLocations[e.id];
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
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [query, setQuery] = useState("");
  const [filtersHidden, setFiltersHidden] = useState(false);
  const lastScrollTop = useRef(0);

  const filtered = useMemo(() => {
    let list = news;
    if (country !== "all")
      list = list.filter((n) => countryKeyOf(n) === country);
    if (source !== "all") list = list.filter((n) => n.source === source);
    if (priority !== "all") list = list.filter((n) => n.priority === priority);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((n) =>
        `${n.title} ${n.summary} ${n.source} ${n.agentMetadata?.monitoringTheme ?? ""}`
          .toLowerCase()
          .includes(q),
      );
    }
    list = filterByTime(list, time);
    return list;
  }, [news, country, source, priority, query, time]);

  const hasFilters =
    country !== "all" ||
    source !== "all" ||
    time !== "all" ||
    priority !== "all" ||
    query.trim().length > 0;
  const resetAll = () => {
    setCountry("all");
    setSource("all");
    setTime("all");
    setPriority("all");
    setQuery("");
  };
  const handleFeedScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const nextTop = event.currentTarget.scrollTop;
    const delta = nextTop - lastScrollTop.current;

    if (nextTop < 12) {
      setFiltersHidden(false);
    } else if (delta > 10) {
      setFiltersHidden(true);
    } else if (delta < -10) {
      setFiltersHidden(false);
    }

    lastScrollTop.current = nextTop;
  };

  return (
    <div className="absolute inset-x-4 top-4 bottom-4 z-10 flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/75 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-border/60 px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Newspaper className="h-3.5 w-3.5" />
              News workspace
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Monitoring feed
            </h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Database-backed articles, grouped by source, geography, urgency,
              and future agent extraction fields.
            </p>
          </div>
          <div className="grid min-w-[420px] flex-1 gap-2 sm:grid-cols-4">
            <NewsStat label="Articles" value={String(news.length)} />
            <NewsStat
              label="Sources"
              value={String(new Set(news.map((item) => item.source)).size)}
            />
            <NewsStat
              label="Urgent"
              value={String(
                news.filter((item) => item.priority === "urgent").length,
              )}
              tone="urgent"
            />
            <NewsStat
              label="Relevant"
              value={String(
                news.filter((item) => item.priority === "relevant").length,
              )}
              tone="relevant"
            />
          </div>
        </div>
      </div>

      {/* Unified filter bar — three rows, identical pill grammar */}
      <div
        className={cn(
          "space-y-2 overflow-hidden border-b border-border/60 bg-white/50 px-6 transition-all duration-300 ease-out",
          filtersHidden
            ? "max-h-0 translate-y-[-8px] border-transparent py-0 opacity-0"
            : "max-h-72 translate-y-0 py-3 opacity-100",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-72 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topic, source, or agent theme"
              className="h-9 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/60 bg-white px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        <FilterRow icon={AlertTriangle} label="Urgency">
          {(
            ["all", "urgent", "relevant", "information"] as PriorityFilter[]
          ).map((item) => (
            <Pill
              key={item}
              active={priority === item}
              onClick={() => setPriority(item)}
            >
              <span className="capitalize">{item}</span>
            </Pill>
          ))}
        </FilterRow>

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
      <div className="flex-1 overflow-y-auto p-6" onScroll={handleFeedScroll}>
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
  const metadata = entry.agentMetadata;
  const hasImage = Boolean(entry.imageUrl);
  return (
    <div className="group">
      <div className="relative">
        <InboxCard entry={entry} onClick={onClick} />
        {hasImage && (
          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex min-w-0 items-start justify-between gap-2">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
              <span className="text-sm leading-none">{c.flag}</span>
              {c.name}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-md">
              <SourceDot name={entry.source} size="sm" />
              <span className="min-w-0 max-w-[120px] truncate">
                {entry.source}
              </span>
            </span>
          </div>
        )}
        <div className="mt-2 rounded-lg border border-border bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Agent extraction
          </div>
          <div className="grid gap-2 text-[11px]">
            <div>
              <span className="font-semibold text-foreground">Theme: </span>
              <span className="break-words text-muted-foreground">
                {metadata?.monitoringTheme ?? "Pending classification"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Use: </span>
              <span className="break-words text-muted-foreground">
                {metadata?.suggestedUse ?? "Keep for review"}
              </span>
            </div>
            {typeof metadata?.confidence === "number" && (
              <div>
                <span className="font-semibold text-foreground">
                  Confidence:{" "}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(metadata.confidence * 100)}%
                </span>
              </div>
            )}
          </div>
          {metadata?.keyFacts?.length ? (
            <ul className="mt-2 space-y-1 text-[11px] leading-5 text-muted-foreground">
              {metadata.keyFacts.slice(0, 2).map((fact) => (
                <li key={fact} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span className="break-words">{fact}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NewsStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "urgent" | "relevant" | "information";
}) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-sm">
      <div className="text-[10px] font-semibold uppercase text-muted-foreground">
        {label}
      </div>
      <div
        className={cn("text-lg font-black tabular-nums", statToneClass[tone])}
      >
        {value}
      </div>
    </div>
  );
}

const statToneClass = {
  neutral: "text-foreground",
  urgent: "text-[oklch(0.45_0.12_22)]",
  relevant: "text-[oklch(0.4_0.07_80)]",
  information: "text-[oklch(0.35_0.05_145)]",
};

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
