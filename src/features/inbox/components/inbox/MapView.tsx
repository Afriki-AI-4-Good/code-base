import { ArrowUpRight, LayoutGrid, List, Map as MapIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Badge } from "@/components/ui/badge";
import { sourceLocations } from "@/data/source-locations";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import { categoryLabel, formatDate, priorityMeta } from "./priority";

export type MapViewMode = "kanban" | "list" | "map";

// Africa-centered world map. We zoom + center on Africa so European sources
// (Germany, Switzerland) still appear at the top edge.
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const PRIORITY_RANK = { urgent: 3, relevant: 2, information: 1 } as const;

type Located = InboxEntry & {
  _loc: { name: string; coords: [number, number]; countryId: string };
};

const DEFAULT_CENTER: [number, number] = [20, 5];

export function MapView({
  entries,
  onSelect,
  view,
  onViewChange,
}: {
  entries: InboxEntry[];
  onSelect: (e: InboxEntry) => void;
  view: MapViewMode;
  onViewChange: (v: MapViewMode) => void;
}) {
  const located: Located[] = useMemo(
    () =>
      entries
        .map((e) => {
          const loc = e.location ?? sourceLocations[e.id];
          return loc?.countryId ? ({ ...e, _loc: loc } as Located) : null;
        })
        .filter((e): e is Located => e !== null),
    [entries],
  );

  // Group markers at identical coordinates so overlapping pins stack.
  const grouped = useMemo(() => {
    const map = new Map<string, Located[]>();
    for (const e of located) {
      const k = `${e._loc.coords[0].toFixed(2)},${e._loc.coords[1].toFixed(2)}`;
      const arr = map.get(k) ?? [];
      arr.push(e);
      map.set(k, arr);
    }
    return Array.from(map.entries()).flatMap(([k, items]) => {
      const first = items[0];
      if (!first) return [];
      return [
        {
          key: k,
          coords: first._loc.coords,
          locName: first._loc.name,
          items,
        },
      ];
    });
  }, [located]);

  // Country ISO id → highest priority of news in that country
  const countryPriority = useMemo(() => {
    const m = new Map<string, InboxEntry["priority"]>();
    for (const e of located) {
      const id = e._loc.countryId;
      const cur = m.get(id);
      if (!cur || PRIORITY_RANK[e.priority] > PRIORITY_RANK[cur])
        m.set(id, e.priority);
    }
    return m;
  }, [located]);

  const [hovered, setHovered] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(1);

  const listRef = useRef<HTMLUListElement>(null);
  const groupRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  // When activeKey changes via map click, scroll the right panel.
  useEffect(() => {
    if (!activeKey) return;
    const el = groupRefs.current.get(activeKey);
    if (el && listRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeKey]);

  const focusGroup = (key: string, coords: [number, number], id?: string) => {
    setActiveKey(key);
    setActiveId(id ?? null);
    setMapCenter(coords);
    setMapZoom(2.2);
  };

  const viewTabs: {
    id: MapViewMode;
    label: string;
    icon: typeof LayoutGrid;
  }[] = [
    { id: "kanban", label: "Kanban", icon: LayoutGrid },
    { id: "list", label: "List", icon: List },
    { id: "map", label: "Map", icon: MapIcon },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[oklch(0.985_0.005_145)]">
      {/* Full-bleed map */}
      <div className="absolute inset-0">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 360, center: DEFAULT_CENTER }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            center={mapCenter}
            zoom={mapZoom}
            minZoom={0.8}
            maxZoom={6}
            onMoveEnd={({ coordinates, zoom }) => {
              setMapCenter(coordinates as [number, number]);
              setMapZoom(zoom);
            }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id = String(geo.id);
                  const pri = countryPriority.get(id);
                  const baseFill = pri
                    ? priorityHex(pri)
                    : "oklch(0.96 0.004 264)";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: baseFill,
                          fillOpacity: pri ? 0.32 : 1,
                          stroke: pri
                            ? priorityHex(pri)
                            : "oklch(0.9 0.005 264)",
                          strokeWidth: pri ? 0.9 / mapZoom : 0.4 / mapZoom,
                          outline: "none",
                          transition: "fill-opacity 200ms",
                        },
                        hover: {
                          fill: baseFill,
                          fillOpacity: pri ? 0.5 : 1,
                          outline: "none",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {grouped.map((g) => {
              const top = g.items[0];
              if (!top) return null;
              const dotColor = priorityHex(top.priority);
              const isHovered = hovered === g.key;
              const isActive = activeKey === g.key;
              const s = 1 / mapZoom; // counter-scale so markers stay constant size

              return (
                <Marker
                  key={g.key}
                  coordinates={g.coords}
                  onMouseEnter={() => setHovered(g.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => focusGroup(g.key, g.coords, top.id)}
                  style={{
                    default: { cursor: "pointer" },
                    hover: { cursor: "pointer" },
                    pressed: { cursor: "pointer" },
                  }}
                >
                  <g transform={`scale(${s})`}>
                    {isActive && (
                      <circle
                        r={16}
                        fill="none"
                        stroke={dotColor}
                        strokeWidth={1.5}
                        opacity={0.6}
                      >
                        <animate
                          attributeName="r"
                          from="10"
                          to="20"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.7"
                          to="0"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <circle r={10} fill={dotColor} fillOpacity={0.18} />
                    <circle
                      r={isActive ? 6.5 : 5}
                      fill={dotColor}
                      stroke="white"
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    {g.items.length > 1 && (
                      <text
                        textAnchor="middle"
                        y={-9}
                        style={{
                          fontFamily: "inherit",
                          fontSize: 9,
                          fontWeight: 600,
                          fill: "oklch(0.3 0.01 264)",
                        }}
                      >
                        {g.items.length}
                      </text>
                    )}
                    {(isHovered || isActive) && (
                      <g transform="translate(10, -12)">
                        <rect
                          x={0}
                          y={-14}
                          rx={4}
                          ry={4}
                          width={Math.max(60, g.locName.length * 4.5)}
                          height={18}
                          fill="oklch(0.22 0.005 264)"
                        />
                        <text
                          x={6}
                          y={-2}
                          style={{
                            fontFamily: "inherit",
                            fontSize: 9,
                            fontWeight: 500,
                            fill: "white",
                          }}
                        >
                          {g.locName}
                        </text>
                      </g>
                    )}
                  </g>
                  <title>{`${g.locName} — ${g.items.length} ${g.items.length > 1 ? "entries" : "entry"}`}</title>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Floating glass tab bar (top left) */}
      <div className="pointer-events-none absolute top-4 left-4 z-20">
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/40 p-1 shadow-lg backdrop-blur-xl">
          {viewTabs.map((t) => {
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
      </div>

      {/* Legend (bottom left) */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-3 rounded-xl border border-white/40 bg-white/40 px-3 py-2 text-[11px] backdrop-blur-xl">
        <Legend color={priorityHex("urgent")} label="Urgent" />
        <Legend color={priorityHex("relevant")} label="Relevant" />
        <Legend color={priorityHex("information")} label="Information" />
      </div>

      {/* Reset (top right, only when zoomed/focused) */}
      {(activeKey || mapZoom !== 1) && (
        <button
          type="button"
          onClick={() => {
            setActiveKey(null);
            setActiveId(null);
            setMapCenter(DEFAULT_CENTER);
            setMapZoom(1);
          }}
          className="absolute top-4 right-[376px] z-20 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 text-[11px] font-medium text-foreground backdrop-blur-xl hover:bg-white/60"
        >
          Reset view
        </button>
      )}

      {/* Glass info waterfall (right side, overlaid on map) */}
      <aside className="absolute top-4 right-4 bottom-4 w-[360px] z-10 flex flex-col rounded-2xl border border-white/40 bg-white/55 shadow-xl backdrop-blur-xl">
        <div className="px-4 pt-4 pb-2 border-b border-white/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Information stream
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {located.length} entries · {grouped.length} locations
          </p>
        </div>
        <ul ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-4">
          {grouped.map((g) => {
            const isActiveGroup = activeKey === g.key;
            return (
              <li
                key={g.key}
                ref={(el) => {
                  if (el) groupRefs.current.set(g.key, el);
                  else groupRefs.current.delete(g.key);
                }}
              >
                <button
                  type="button"
                  onClick={() => focusGroup(g.key, g.coords)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
                    isActiveGroup
                      ? "bg-primary/10 text-foreground"
                      : "hover:bg-muted/60 text-muted-foreground",
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      background: priorityHex(
                        g.items[0]?.priority ?? "information",
                      ),
                    }}
                  />
                  <span className="text-xs font-semibold">{g.locName}</span>
                  <span className="text-[10px] ml-auto">{g.items.length}</span>
                </button>
                <ul className="mt-1.5 space-y-1.5 pl-1">
                  {g.items.map((e) => {
                    const meta = priorityMeta[e.priority];
                    const isActive = activeId === e.id;
                    return (
                      <li
                        key={e.id}
                        className={cn(
                          "group cursor-pointer rounded-lg border bg-white/70 p-2.5 transition-all",
                          isActive
                            ? "border-primary/60 shadow-sm ring-1 ring-primary/30 bg-white"
                            : "border-white/60 hover:border-primary/40 hover:bg-white",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => focusGroup(g.key, g.coords, e.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0",
                                meta.dot,
                              )}
                            />
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {categoryLabel[e.category]}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {formatDate(e.date)}
                            </span>
                          </div>
                          <div className="text-xs leading-snug line-clamp-2 text-foreground">
                            {e.title}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onSelect(e);
                          }}
                          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Open details <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

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

// ISO numeric codes for African countries (world-atlas 110m uses these as `id`).
const _AFRICA_ISO = [
  "012",
  "024",
  "072",
  "086",
  "108",
  "120",
  "132",
  "140",
  "148",
  "174",
  "175",
  "178",
  "180",
  "204",
  "226",
  "231",
  "232",
  "260",
  "262",
  "266",
  "270",
  "288",
  "324",
  "384",
  "404",
  "426",
  "430",
  "434",
  "450",
  "454",
  "466",
  "478",
  "480",
  "504",
  "508",
  "516",
  "562",
  "566",
  "624",
  "646",
  "654",
  "678",
  "686",
  "690",
  "694",
  "706",
  "710",
  "716",
  "728",
  "729",
  "732",
  "748",
  "768",
  "788",
  "800",
  "818",
  "834",
  "854",
];
