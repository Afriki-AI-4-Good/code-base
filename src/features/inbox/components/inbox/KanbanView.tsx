import { cn } from "@/lib/utils";
import type { InboxEntry, Priority } from "@/types/inbox";
import { InboxCard } from "./InboxCard";
import { priorityMeta } from "./priority";

const columns: Priority[] = ["urgent", "relevant", "information"];

export function KanbanView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (e: InboxEntry) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((p) => {
        const meta = priorityMeta[p];
        const items = entries.filter((e) => e.priority === p);
        return (
          <div key={p} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {meta.label}
              </h2>
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                  meta.chipBg,
                  meta.chipText,
                )}
              >
                {items.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((e) => (
                <InboxCard key={e.id} entry={e} onClick={() => onSelect(e)} />
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No entries
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
