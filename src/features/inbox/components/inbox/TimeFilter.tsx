import { cn } from "@/lib/utils";

export type TimeRange = "all" | "7d" | "30d" | "90d" | "365d";

export const timeRangeOptions: { id: TimeRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "365d", label: "12 months" },
  { id: "all", label: "All time" },
];

export function filterByTime<T extends { date: string }>(
  items: T[],
  range: TimeRange,
): T[] {
  if (range === "all") return items;
  const days = { "7d": 7, "30d": 30, "90d": 90, "365d": 365 }[range];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return items.filter((e) => new Date(e.date).getTime() >= cutoff);
}

export function TimePills({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/40 p-1 shadow-lg backdrop-blur-xl">
      {timeRangeOptions.map((o) => {
        const active = value === o.id;
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-white/50",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
