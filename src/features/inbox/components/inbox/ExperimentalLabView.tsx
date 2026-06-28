import {
  Bell,
  Check,
  Flame,
  MailPlus,
  PanelsTopLeft,
  Radio,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "@/types/inbox";
import { SwipeReviewView } from "./SwipeReviewView";

type ExperimentId = "triage" | "subscriptions";

const experiments: {
  id: ExperimentId;
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof PanelsTopLeft;
  accent: string;
  stats: string[];
}[] = [
  {
    id: "triage",
    title: "Message Triage",
    eyebrow: "Swipe classifier",
    description:
      "Review incoming news, funding calls, and reports with a fast card workflow.",
    icon: PanelsTopLeft,
    accent: "text-[oklch(0.45_0.1_32)] bg-[oklch(0.97_0.028_32)]",
    stats: ["Critical", "Later", "Cleared"],
  },
  {
    id: "subscriptions",
    title: "Auto Email Subscriptions",
    eyebrow: "Inbox automation",
    description:
      "Create monitored newsletter subscriptions and route new emails into the right feed.",
    icon: MailPlus,
    accent: "text-[oklch(0.35_0.07_145)] bg-[var(--primary-soft)]",
    stats: ["Newsletters", "Rules", "Digest"],
  },
];

export function ExperimentalLabView({
  entries,
  onSelect,
}: {
  entries: InboxEntry[];
  onSelect: (entry: InboxEntry) => void;
}) {
  const [active, setActive] = useState<ExperimentId | null>(null);
  const activeExperiment = experiments.find((item) => item.id === active);

  return (
    <div className="absolute inset-x-4 bottom-4 top-4 z-10 overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-xl ring-1 ring-white/30 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        <header className="border-b border-white/50 bg-white/75 px-6 pb-4 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Experimental workspace
              </div>
              <h1 className="mt-1 text-2xl font-black tracking-tight">Labs</h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                Try focused workflows before they become permanent navigation.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground shadow-sm sm:flex">
              <Radio className="h-4 w-4 text-[oklch(0.45_0.1_32)]" />
              {entries.length} entries available
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {experiments.map((experiment) => (
              <ExperimentCard
                key={experiment.id}
                experiment={experiment}
                onOpen={() => setActive(experiment.id)}
              />
            ))}
          </div>
        </main>
      </div>

      {activeExperiment && (
        <div className="absolute inset-0 z-20 bg-[oklch(0.18_0.01_264)]/35 p-4 backdrop-blur-sm">
          <div className="relative h-full overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
            <div className="absolute right-3 top-3 z-30">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setActive(null)}
                className="h-9 w-9 rounded-lg bg-white/90 shadow-sm"
                aria-label="Close experiment"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {active === "triage" ? (
              <SwipeReviewView entries={entries} onSelect={onSelect} />
            ) : (
              <EmailSubscriptionsExperiment />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExperimentCard({
  experiment,
  onOpen,
}: {
  experiment: (typeof experiments)[number];
  onOpen: () => void;
}) {
  const Icon = experiment.icon;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-64 flex-col rounded-xl border border-border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-lg",
            experiment.accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Lab
        </span>
      </div>
      <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {experiment.eyebrow}
      </div>
      <h2 className="mt-1 text-xl font-black tracking-tight">
        {experiment.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {experiment.description}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {experiment.stats.map((stat) => (
          <span
            key={stat}
            className="rounded-full bg-[oklch(0.985_0.004_110)] px-2 py-1 text-[11px] font-medium text-foreground/75"
          >
            {stat}
          </span>
        ))}
      </div>
    </button>
  );
}

function EmailSubscriptionsExperiment() {
  const [newsletter, setNewsletter] = useState("newsletter@example.org");
  const [frequency, setFrequency] = useState("Daily digest");
  const [rules, setRules] = useState([
    "Tag urgent deadlines",
    "Route donor updates to Funding",
    "Summarize animal welfare stories",
  ]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[oklch(0.982_0.004_145)]">
      <header className="border-b border-border/70 bg-white/85 px-6 py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <MailPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Auto Email Subscriptions
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Subscribe, classify, and route incoming newsletters automatically.
            </p>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Bell className="h-3.5 w-3.5" />
              Subscription source
            </div>
            <label
              htmlFor="subscription-source"
              className="grid gap-1.5 text-sm font-medium"
            >
              Monitored inbox or newsletter
              <Input
                id="subscription-source"
                value={newsletter}
                onChange={(event) => setNewsletter(event.target.value)}
                className="h-10"
              />
            </label>
            <div className="mt-4 grid gap-1.5 text-sm font-medium">
              Digest frequency
              <div className="inline-flex w-fit rounded-lg border border-border bg-white p-0.5">
                {["Instant", "Daily digest", "Weekly"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setFrequency(item)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs transition-colors",
                      frequency === item
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Flame className="h-3.5 w-3.5" />
              Routing rules
            </div>
            <div className="space-y-2">
              {rules.map((rule) => (
                <label
                  key={rule}
                  className="flex items-center gap-2 rounded-lg border border-border bg-[oklch(0.99_0.003_110)] px-3 py-2 text-sm"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">{rule}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRules((prev) => prev.filter((item) => item !== rule))
                    }
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${rule}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Preview
          </div>
          <div className="rounded-lg border border-[oklch(0.84_0.04_145)] bg-[oklch(0.98_0.015_145)] p-4">
            <div className="text-sm font-semibold">{newsletter}</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              New messages are watched continuously and summarized into the
              matching workspace.
            </p>
            <div className="mt-4 grid gap-2">
              <PreviewRow label="Frequency" value={frequency} />
              <PreviewRow label="Active rules" value={String(rules.length)} />
              <PreviewRow label="Destination" value="News, Funding, Reports" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white/75 px-3 py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
