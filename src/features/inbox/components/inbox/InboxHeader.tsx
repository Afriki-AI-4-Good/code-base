import { List, Map as MapIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/inbox";

export type ViewMode = "list" | "map";

export type CategoryFilter = "all" | Category;

const filters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "news", label: "News" },
  { id: "funding", label: "Funding" },
  { id: "report", label: "Reports" },
];

export function InboxHeader({
  view,
  onViewChange,
  filter,
  onFilterChange,
  total,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  filter: CategoryFilter;
  onFilterChange: (f: CategoryFilter) => void;
  total: number;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight">
            Intelligent Inbox
          </h1>
          <p className="text-xs text-muted-foreground">
            {total} curated entries · sorted by importance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Urgent
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Relevant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
              Information
            </span>
          </div>

          <Tabs value={view} onValueChange={(v) => onViewChange(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="list" className="text-xs px-2.5 gap-1">
                <List className="h-3.5 w-3.5" /> List
              </TabsTrigger>
              <TabsTrigger value="map" className="text-xs px-2.5 gap-1">
                <MapIcon className="h-3.5 w-3.5" /> Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button
            type="button"
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={cn(
              "rounded-full border px-3.5 py-1 text-xs font-medium transition-colors",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </header>
  );
}
