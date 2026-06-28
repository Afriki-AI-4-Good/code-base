import {
  Activity,
  Bot,
  CalendarClock,
  CheckCircle2,
  CircleStop,
  Clock3,
  DatabaseZap,
  FileText,
  Gauge,
  Globe2,
  Landmark,
  MailCheck,
  Pause,
  Play,
  RotateCw,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import type { LoginSession } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

type AgentStatus = RouterOutputs["inbox"]["agent"]["status"];
type AgentSettings = AgentStatus["settings"];
type AgentRun = NonNullable<AgentStatus["run"]>;
type AgentFocusArea = AgentSettings["focusAreas"][number];
type GdeltTimespan = "1d" | "3d" | "7d" | "14d" | "30d";

type AgentForm = {
  scheduleEnabled: boolean;
  intervalDays: number;
  focusAreas: AgentFocusArea[];
  model: string;
  newsMaxCandidates: number;
  fundingMaxCandidates: number;
  includeGdelt: boolean;
  gdeltTimespan: GdeltTimespan;
  emailScanEnabled: boolean;
};

const focusOptions: {
  id: AgentFocusArea;
  label: string;
  description: string;
  icon: typeof Globe2;
}[] = [
  {
    id: "news",
    label: "News monitoring",
    description: "Find relevant articles and press signals.",
    icon: Globe2,
  },
  {
    id: "funding",
    label: "Funding scout",
    description: "Search for new grant opportunities.",
    icon: Landmark,
  },
  {
    id: "reports",
    label: "Email reports",
    description: "Prepare mailbox intake once Gmail ingestion is ready.",
    icon: MailCheck,
  },
];

const defaultForm: AgentForm = {
  scheduleEnabled: true,
  intervalDays: 2,
  focusAreas: ["news", "funding", "reports"],
  model: "qwen3:8b",
  newsMaxCandidates: 10,
  fundingMaxCandidates: 12,
  includeGdelt: true,
  gdeltTimespan: "7d",
  emailScanEnabled: true,
};

export function AgentView({ session }: { session: LoginSession }) {
  const utils = api.useUtils();
  const statusQuery = api.inbox.agent.status.useQuery(session, {
    refetchInterval: 2500,
  });
  const status = statusQuery.data;
  const [form, setForm] = useState<AgentForm>(defaultForm);

  const updateSettings = api.inbox.agent.updateSettings.useMutation({
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });
  const startNow = api.inbox.agent.startNow.useMutation({
    onSuccess: async () => {
      await Promise.all([statusQuery.refetch(), utils.inbox.list.invalidate()]);
    },
  });
  const abortRun = api.inbox.agent.abort.useMutation({
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });
  const pauseSchedule = api.inbox.agent.pauseSchedule.useMutation({
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });
  const resumeSchedule = api.inbox.agent.resumeSchedule.useMutation({
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });

  useEffect(() => {
    if (status?.settings) setForm(settingsToForm(status.settings));
  }, [status?.settings]);

  const run = status?.run ?? null;
  const isWorking = run?.status === "queued" || run?.status === "running";
  const pending =
    updateSettings.isPending ||
    startNow.isPending ||
    abortRun.isPending ||
    pauseSchedule.isPending ||
    resumeSchedule.isPending;
  const activeMilestones = useMemo(() => getMilestones(run), [run]);

  const handleSave = () => {
    updateSettings.mutate({
      session,
      ...form,
      intervalDays: clampInt(form.intervalDays, 1, 14),
      newsMaxCandidates: clampInt(form.newsMaxCandidates, 1, 50),
      fundingMaxCandidates: clampInt(form.fundingMaxCandidates, 1, 50),
      focusAreas: form.focusAreas.length ? form.focusAreas : ["news"],
    });
  };

  return (
    <div className="absolute inset-x-4 bottom-4 top-4 z-10 flex flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/75 shadow-xl ring-1 ring-white/30 backdrop-blur-xl">
      <header className="border-b border-border/60 px-6 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Bot className="h-3.5 w-3.5" />
              Afriki AI Agent
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight">
              Background operations
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Scheduled agent runs collect funding and news data through the
              Python service, then write new findings back into the workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge run={run} apiOnline={status?.health.ok ?? false} />
            <Button
              type="button"
              onClick={() => startNow.mutate(session)}
              disabled={pending || isWorking}
              className="h-10 gap-2"
            >
              <Play className="h-4 w-4" />
              Start now
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => abortRun.mutate(session)}
              disabled={pending || !isWorking}
              className="h-10 gap-2"
            >
              <CircleStop className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(360px,0.86fr)_minmax(0,1.14fr)]">
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  Schedule
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Default rhythm is every two days.
                </p>
              </div>
              <Switch
                checked={form.scheduleEnabled}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    scheduleEnabled: checked,
                  }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Run every">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={14}
                    value={form.intervalDays}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        intervalDays: Number(event.target.value),
                      }))
                    }
                    className="h-10 bg-white"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">
                    days
                  </span>
                </div>
              </Field>
              <Field label="Next run">
                <div className="flex h-10 items-center rounded-lg border border-border bg-[oklch(0.985_0.004_110)] px-3 text-xs font-semibold text-foreground">
                  {status?.settings.nextRunAt
                    ? formatDateTime(status.settings.nextRunAt)
                    : "Loading"}
                </div>
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => pauseSchedule.mutate(session)}
                disabled={pending || !status?.settings.scheduleEnabled}
                className="gap-1.5"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause schedule
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resumeSchedule.mutate(session)}
                disabled={pending || status?.settings.scheduleEnabled}
                className="gap-1.5"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Resume scheduled mode
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold">
              <Settings2 className="h-4 w-4 text-primary" />
              Run configuration
            </div>
            <div className="space-y-3">
              {focusOptions.map((option) => (
                <FocusToggle
                  key={option.id}
                  option={option}
                  active={form.focusAreas.includes(option.id)}
                  onToggle={() => toggleFocus(option.id, setForm)}
                />
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Model">
                <Input
                  value={form.model}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      model: event.target.value,
                    }))
                  }
                  className="h-10 bg-white"
                />
              </Field>
              <Field label="GDELT window">
                <select
                  value={form.gdeltTimespan}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gdeltTimespan: event.target.value as GdeltTimespan,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary"
                >
                  {["1d", "3d", "7d", "14d", "30d"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="News candidates">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={form.newsMaxCandidates}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      newsMaxCandidates: Number(event.target.value),
                    }))
                  }
                  className="h-10 bg-white"
                />
              </Field>
              <Field label="Funding candidates">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={form.fundingMaxCandidates}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fundingMaxCandidates: Number(event.target.value),
                    }))
                  }
                  className="h-10 bg-white"
                />
              </Field>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <ToggleRow
                label="Use GDELT discovery"
                checked={form.includeGdelt}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, includeGdelt: checked }))
                }
              />
              <ToggleRow
                label="Prepare email scan"
                checked={form.emailScanEnabled}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    emailScanEnabled: checked,
                  }))
                }
              />
            </div>
            <Button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="mt-4 h-10 w-full gap-2"
            >
              <Save className="h-4 w-4" />
              Save agent configuration
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Activity className="h-4 w-4 text-primary" />
                  Current run
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {run?.currentStep ?? "Waiting for the next scheduled cycle."}
                </p>
              </div>
              <RunMeta run={run} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">
                  Progress
                </span>
                <span className="font-black tabular-nums">
                  {run?.progress ?? 0}%
                </span>
              </div>
              <Progress value={run?.progress ?? 0} className="h-2.5" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <RunCounter
                icon={Globe2}
                label="News"
                value={run?.insertedNews ?? 0}
              />
              <RunCounter
                icon={Landmark}
                label="Funding"
                value={run?.insertedFunding ?? 0}
              />
              <RunCounter
                icon={FileText}
                label="Reports"
                value={run?.insertedReports ?? 0}
              />
            </div>
            {run?.lastError && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
                {run.lastError}
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Gauge className="h-4 w-4 text-primary" />
                Service health
              </div>
              <div className="space-y-2">
                <HealthRow
                  label="Python agent API"
                  ok={status?.health.ok ?? false}
                  value={status?.health.status ?? "Checking"}
                />
                <HealthRow
                  label="Schedule"
                  ok={form.scheduleEnabled}
                  value={form.scheduleEnabled ? "Enabled" : "Paused"}
                />
                <HealthRow
                  label="Email agent"
                  ok={false}
                  value="Waiting for Gmail ingestion"
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <DatabaseZap className="h-4 w-4 text-primary" />
                Milestones
              </div>
              <div className="space-y-2">
                {activeMilestones.length ? (
                  activeMilestones.map((event) => (
                    <Milestone
                      key={`${event.type}-${event.createdAt}`}
                      event={event}
                    />
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-[oklch(0.985_0.004_110)] px-3 py-5 text-center text-xs text-muted-foreground">
                    The agent will show source checks and completion notes here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function settingsToForm(settings: AgentSettings): AgentForm {
  return {
    scheduleEnabled: settings.scheduleEnabled,
    intervalDays: settings.intervalDays,
    focusAreas: settings.focusAreas,
    model: settings.model,
    newsMaxCandidates: settings.newsMaxCandidates,
    fundingMaxCandidates: settings.fundingMaxCandidates,
    includeGdelt: settings.includeGdelt,
    gdeltTimespan: toGdeltTimespan(settings.gdeltTimespan),
    emailScanEnabled: settings.emailScanEnabled,
  };
}

function getMilestones(run: AgentRun | null) {
  return [...(run?.events ?? [])].slice(-7).reverse();
}

function toggleFocus(
  id: AgentFocusArea,
  setForm: Dispatch<SetStateAction<AgentForm>>,
) {
  setForm((current) => {
    const active = current.focusAreas.includes(id);
    const focusAreas = active
      ? current.focusAreas.filter((item) => item !== id)
      : [...current.focusAreas, id];

    return {
      ...current,
      focusAreas: focusAreas.length ? focusAreas : current.focusAreas,
    };
  });
}

function StatusBadge({
  run,
  apiOnline,
}: {
  run: AgentRun | null;
  apiOnline: boolean;
}) {
  const status = run?.status ?? "idle";
  const active = status === "queued" || status === "running";

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold shadow-sm",
        active
          ? "border-[oklch(0.77_0.1_145)] bg-[oklch(0.95_0.03_145)] text-[oklch(0.34_0.08_145)]"
          : apiOnline
            ? "border-border bg-white text-foreground"
            : "border-amber-300 bg-amber-50 text-amber-800",
      )}
    >
      {active ? (
        <Sparkles className="h-4 w-4 animate-pulse" />
      ) : (
        <Bot className="h-4 w-4" />
      )}
      <span className="capitalize">{active ? "Working" : status}</span>
    </div>
  );
}

function RunMeta({ run }: { run: AgentRun | null }) {
  return (
    <div className="grid gap-2 text-right text-[11px] text-muted-foreground">
      <div className="font-semibold capitalize text-foreground">
        {run?.trigger ?? "scheduled"} mode
      </div>
      <div>
        {run?.startedAt ? `Started ${formatDateTime(run.startedAt)}` : ""}
      </div>
      <div>
        {run?.finishedAt ? `Finished ${formatDateTime(run.finishedAt)}` : ""}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-[10px] font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function FocusToggle({
  option,
  active,
  onToggle,
}: {
  option: (typeof focusOptions)[number];
  active: boolean;
  onToggle: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-white hover:border-primary/30",
      )}
    >
      <div
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-md",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{option.label}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">
          {option.description}
        </div>
      </div>
      {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-lg border border-border bg-[oklch(0.985_0.004_110)] px-3">
      <span className="text-xs font-semibold">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function RunCounter({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe2;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-[oklch(0.985_0.004_110)] px-3 py-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-xl font-black tabular-nums">{value}</div>
    </div>
  );
}

function HealthRow({
  label,
  ok,
  value,
}: {
  label: string;
  ok: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-[oklch(0.985_0.004_110)] px-3 py-2">
      <span className="text-xs font-semibold">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold",
          ok
            ? "bg-[oklch(0.94_0.035_145)] text-[oklch(0.35_0.08_145)]"
            : "bg-[oklch(0.96_0.035_70)] text-[oklch(0.43_0.08_70)]",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            ok ? "bg-[oklch(0.5_0.13_145)]" : "bg-amber-500",
          )}
        />
        {value}
      </span>
    </div>
  );
}

function Milestone({ event }: { event: AgentRun["events"][number] }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-[oklch(0.985_0.004_110)] px-3 py-2">
      <div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
        <Clock3 className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold capitalize">{event.type}</div>
        <div className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {event.message}
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          {formatDateTime(event.createdAt)}
        </div>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toGdeltTimespan(value: string): GdeltTimespan {
  if (["1d", "3d", "7d", "14d", "30d"].includes(value)) {
    return value as GdeltTimespan;
  }
  return "7d";
}

function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}
