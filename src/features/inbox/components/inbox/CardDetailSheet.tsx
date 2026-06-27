/* biome-ignore-all lint/performance/noImgElement: Migrated cards use dynamic public and remote image URLs. */

import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import {
  bkLabel,
  categoryLabel,
  daysUntil,
  formatDate,
  priorityMeta,
} from "./priority";

export function CardDetailSheet({
  entry,
  open,
  onOpenChange,
}: {
  entry: InboxEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!entry) return null;
  const p = priorityMeta[entry.priority];
  const newsImage = entry.category === "news" ? entry.imageUrl : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="fixed inset-0 z-50 bg-transparent backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        className="max-w-2xl p-0 overflow-hidden gap-0 max-h-[88vh] flex flex-col border border-white/50 bg-white/80 backdrop-blur-2xl shadow-2xl ring-1 ring-white/30"
      >
        {newsImage && (
          <div className="relative w-full aspect-[16/7] overflow-hidden bg-muted shrink-0">
            <img
              src={newsImage}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="relative overflow-y-auto">
          <div className={cn("absolute left-0 top-0 h-full w-1", p.bar)} />
          <div className="p-6 pl-7">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("border-0", p.chipBg, p.chipText)}>
                  {p.label}
                </Badge>
                <Badge variant="outline">{categoryLabel[entry.category]}</Badge>
                {entry.translatedFrom && (
                  <Badge variant="secondary">
                    Übersetzt aus {entry.translatedFrom}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-left text-xl leading-snug">
                {entry.title}
              </DialogTitle>
              <DialogDescription className="text-left">
                {formatDate(entry.date)} · {entry.source}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Zusammenfassung
                </h4>
                <p className="text-sm leading-relaxed">{entry.summary}</p>
              </section>

              {entry.category === "funding" && (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Förderdetails
                    </h4>
                    <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                      <dt className="text-muted-foreground">Frist</dt>
                      <dd className="font-medium">
                        {formatDate(entry.deadline)}{" "}
                        <span className="text-muted-foreground">
                          ({daysUntil(entry.deadline)} Tage)
                        </span>
                      </dd>
                      <dt className="text-muted-foreground">Förderbetrag</dt>
                      <dd>{entry.amountRange}</dd>
                      <dt className="text-muted-foreground">Fördergeber</dt>
                      <dd>{entry.funder}</dd>
                      <dt className="text-muted-foreground">Themen</dt>
                      <dd className="flex flex-wrap gap-1">
                        {entry.topics.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {t}
                          </Badge>
                        ))}
                      </dd>
                    </dl>
                    <div>
                      <h5 className="text-xs font-semibold mb-2">
                        Förderkriterien
                      </h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>
                          Eigenanteil erforderlich:{" "}
                          <span className="text-foreground font-medium">
                            {entry.criteria.ownContributionRequired
                              ? "Ja"
                              : "Nein"}
                          </span>
                        </li>
                        <li>
                          Sitz in NRW:{" "}
                          <span className="text-foreground font-medium">
                            {entry.criteria.nrwHeadquarters ? "Ja" : "Nein"}
                          </span>
                        </li>
                        <li>
                          Antrag direkt aus Burundi möglich:{" "}
                          <span className="text-foreground font-medium">
                            {entry.criteria.applyFromBurundi ? "Ja" : "Nein"}
                          </span>
                        </li>
                        {entry.criteria.notes && (
                          <li className="italic">{entry.criteria.notes}</li>
                        )}
                      </ul>
                    </div>
                    <Badge
                      className={cn("border-0", bkLabel[entry.bkEligible].cls)}
                    >
                      {bkLabel[entry.bkEligible].label}
                    </Badge>
                  </section>
                </>
              )}

              {entry.category === "report" && (
                <>
                  <Separator />
                  <section className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Übersetzung
                    </h4>
                    <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                      <dt className="text-muted-foreground">Originalsprache</dt>
                      <dd>{entry.originalLanguage}</dd>
                      <dt className="text-muted-foreground">Absender</dt>
                      <dd>{entry.sender}</dd>
                      <dt className="text-muted-foreground">Datum</dt>
                      <dd>{formatDate(entry.date)}</dd>
                    </dl>
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <ChevronDown className="h-3 w-3" />
                        Originaltext anzeigen
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 rounded-md border border-border bg-muted/40 p-3 text-sm italic text-muted-foreground">
                        {entry.originalText}
                      </CollapsibleContent>
                    </Collapsible>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
