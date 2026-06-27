import { cn } from "@/lib/utils";
import type { InboxEntry, Priority } from "@/types/inbox";
import { InboxCard } from "./InboxCard";
import { priorityMeta } from "./priority";

const order: Priority[] = ["urgent", "relevant", "information"];

export function ListView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (e: InboxEntry) => void;
}) {
  return (
    <div className="space-y-6">
      {order.map((p) => {
        const items = entries.filter((e) => e.priority === p);
        if (items.length === 0) return null;
        const meta = priorityMeta[p];
        return (
          <section key={p}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {meta.label} ({items.length})
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((e) => (
                <InboxCard key={e.id} entry={e} onClick={() => onSelect(e)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
