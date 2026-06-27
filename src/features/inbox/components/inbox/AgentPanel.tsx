import { Bot, MapPin, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Brief, UserProfile } from "@/lib/profile";
import { getDepartment, getOrg } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { priorityMeta } from "./priority";

export function AgentPanel({
  profile,
  brief,
  onLocate,
  onOpen,
}: {
  profile: UserProfile | null;
  brief: Brief | null;
  onLocate: (entryId: string) => void;
  onOpen: (entryId: string) => void;
}) {
  const org = profile ? getOrg(profile.org) : null;
  const dept = profile ? getDepartment(profile.department) : null;

  return (
    <aside className="hidden lg:flex h-screen w-80 shrink-0 flex-col border-l border-border bg-card">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-tight">
            Inbox Assistant
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            {org && dept
              ? `${org.shortName} · ${dept.shortName}`
              : "Personal brief & insights"}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {brief ? (
          <>
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/0 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" />
                Your brief
              </div>
              <div className="mt-1.5 text-sm font-semibold leading-snug">
                {brief.headline}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                {brief.subline}
              </p>
            </div>

            <ul className="space-y-2">
              {brief.items.map((item) => {
                const meta = priorityMeta[item.priority];
                return (
                  <li
                    key={item.entryId}
                    className="group rounded-lg border border-border bg-background p-2.5 hover:border-primary/40 transition-colors"
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
                        {meta.label}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpen(item.entryId)}
                      className="text-left text-xs font-medium leading-snug line-clamp-2 hover:text-primary"
                    >
                      {item.title}
                    </button>
                    <div className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      {item.reason}
                    </div>
                    <button
                      type="button"
                      onClick={() => onLocate(item.entryId)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MapPin className="h-3 w-3" />
                      Locate source
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm leading-relaxed">
            Choose your organization and department to generate a personal
            brief.
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2">
          <textarea
            disabled
            placeholder="Ask the assistant…"
            rows={2}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
          />
          <Button size="icon" disabled className="h-8 w-8 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground text-center">
          Demo · chat coming soon
        </p>
      </div>
    </aside>
  );
}
