/* biome-ignore-all lint/performance/noImgElement: Migrated cards use dynamic public and remote image URLs. */

import { Banknote, Calendar, Clock, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import {
  bkLabel,
  categoryLabel,
  daysUntil,
  formatDate,
  priorityMeta,
} from "./priority";

export function InboxCard({
  entry,
  onClick,
}: {
  entry: InboxEntry;
  onClick: () => void;
}) {
  const p = priorityMeta[entry.priority];
  const newsImage = entry.category === "news" ? entry.imageUrl : undefined;
  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden p-0 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={cn("absolute left-0 top-0 h-full w-1 z-10", p.bar)} />
      {newsImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={newsImage}
            alt={entry.title}
            loading="lazy"
            width={1024}
            height={640}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-3 p-4 pl-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-medium uppercase tracking-wide",
              p.chipBg,
              p.chipText,
              "border-0",
            )}
          >
            {p.label}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-medium uppercase tracking-wide"
          >
            {categoryLabel[entry.category]}
          </Badge>
          {entry.translatedFrom && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Languages className="h-3 w-3" />
              {entry.translatedFrom}
            </span>
          )}
        </div>

        <h3 className="font-semibold leading-snug text-foreground line-clamp-2">
          {entry.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(entry.date)}
          </span>
          <span className="truncate">{entry.source}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {entry.summary}
        </p>

        {entry.category === "funding" && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 border-t border-border/60">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <Clock className="h-3 w-3" />
              Deadline: {formatDate(entry.deadline)}
              <span className="text-muted-foreground">
                ({daysUntil(entry.deadline)} days)
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Banknote className="h-3 w-3" />
              {entry.amountRange}
            </span>
            <Badge
              className={cn(
                "text-[10px] border-0",
                bkLabel[entry.bkEligible].cls,
              )}
            >
              {bkLabel[entry.bkEligible].label}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
