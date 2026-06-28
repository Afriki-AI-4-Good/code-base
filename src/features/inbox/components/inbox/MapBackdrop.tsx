import { List, Map as MapIcon } from "lucide-react";
import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { sourceLocations } from "@/data/source-locations";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import type { CategoryFilter, ViewMode } from "./InboxHeader";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const DEFAULT_CENTER: [number, number] = [20, 5];

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "funding", label: "Funding" },
  { id: "report", label: "Reports" },
];

export function ViewTabs({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const tabs: { id: ViewMode; label: string; icon: typeof List }[] = [
    { id: "list", label: "List", icon: List },
    { id: "map", label: "Map", icon: MapIcon },
  ];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/40 p-1 shadow-lg backdrop-blur-xl">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = view === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onViewChange(t.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-white/50",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPills({
  filter,
  onFilterChange,
}: {
  filter: CategoryFilter;
  onFilterChange: (f: CategoryFilter) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/40 p-1 shadow-lg backdrop-blur-xl">
      {filters.map((f) => {
        const active = filter === f.id;
        return (
          <button
            type="button"
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-white/50",
            )}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

const PRIORITY_RANK = { urgent: 3, relevant: 2, information: 1 } as const;
function priorityHex(p: "urgent" | "relevant" | "information") {
  switch (p) {
    case "urgent":
      return "oklch(0.72 0.085 28)";
    case "relevant":
      return "oklch(0.79 0.085 78)";
    case "information":
      return "oklch(0.68 0.045 145)";
  }
}

export function MapBackdrop({
  entries,
  dimmed = false,
}: {
  entries: InboxEntry[];
  dimmed?: boolean;
}) {
  const { points, countryPriority } = useMemo(() => {
    const pts: {
      name: string;
      coords: [number, number];
      priority: InboxEntry["priority"];
    }[] = [];
    const cp = new Map<string, InboxEntry["priority"]>();
    for (const e of entries) {
      const loc = e.location ?? sourceLocations[e.id];
      if (!loc?.countryId) continue;
      pts.push({ name: loc.name, coords: loc.coords, priority: e.priority });
      const cur = cp.get(loc.countryId);
      if (!cur || PRIORITY_RANK[e.priority] > PRIORITY_RANK[cur]) {
        cp.set(loc.countryId, e.priority);
      }
    }
    return { points: pts, countryPriority: cp };
  }, [entries]);

  return (
    <div className="absolute inset-0">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 360, center: DEFAULT_CENTER }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={DEFAULT_CENTER}
          zoom={1}
          minZoom={0.8}
          maxZoom={6}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = String(geo.id);
                const pri = countryPriority.get(id);
                const fill = pri
                  ? priorityHex(pri)
                  : `oklch(0.95 0.004 264${dimmed ? " / 0.7" : ""})`;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill,
                        fillOpacity: pri ? (dimmed ? 0.25 : 0.4) : 1,
                        stroke: pri
                          ? priorityHex(pri)
                          : "oklch(0.88 0.006 264)",
                        strokeWidth: pri ? 0.8 : 0.4,
                        outline: "none",
                      },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {points.map((p) => (
            <Marker
              key={`${p.name}-${p.coords[0]}-${p.coords[1]}-${p.priority}`}
              coordinates={p.coords}
            >
              <circle
                r={4.5}
                fill={priorityHex(p.priority)}
                fillOpacity={dimmed ? 0.5 : 0.85}
                stroke="white"
                strokeWidth={1.2}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
