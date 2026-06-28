"use client";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Globe2,
  Languages,
  Mail,
  Newspaper,
  Pause,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chapters = [
  {
    id: "problem",
    eyebrow: "The problem",
    title: "The app starts from a real monitoring overload.",
    body: "The current Afriki workspace is built around news, funding calls, and mailbox reports that need source context, urgency, translation context, deadlines, and organization-specific handling.",
    proof: ["News", "Funding", "Reports"],
    image: "/landing/inbox-map.png",
  },
  {
    id: "onboarding",
    eyebrow: "Workspace setup",
    title: "Users enter an organization workspace.",
    body: "The current login flow lets a user choose Burundikids e.V., Welttierschutzgesellschaft e.V., or a blank new-cause workspace. Onboarding saves the workspace setup to the database.",
    proof: ["Organization login", "Saved setup", "Separate workspaces"],
    image: "/journey/workspace-login.png",
  },
  {
    id: "agent",
    eyebrow: "Afriki AI Agent",
    title: "The operations console is the control room.",
    body: "The implemented agent page exposes schedule settings, focus areas, service health, current run status, start/stop actions, and last-run counts for news, funding, and reports.",
    proof: ["Schedule", "Focus areas", "Run status", "Start / stop"],
    image: "/journey/agent-view.png",
  },
  {
    id: "intelligence",
    eyebrow: "Intelligent inbox",
    title: "The map view makes the information stream visible.",
    body: "The current inbox shows database-backed entries by source location, priority, category, date, and summary. It can switch between map and list views.",
    proof: ["Map", "List", "Source", "Priority"],
    image: "/landing/inbox-map.png",
  },
  {
    id: "funding",
    eyebrow: "Funding workspace",
    title: "Funding is already its own feature.",
    body: "The implemented funding page sorts database-backed funding calls by urgency, deadline, and fit score. It shows deadlines, phases, funders, amounts, eligibility, and next-step notes.",
    proof: ["Urgency sort", "Deadline", "Fit score", "Eligibility"],
    image: "/landing/funding-view.png",
  },
  {
    id: "reports",
    eyebrow: "Reports workspace",
    title: "Reports are treated as email intake.",
    body: "The current reports page shows incoming mailbox reports and project emails, sorted by urgency and prepared as translated working notes. The UI also shows the Gmail connector handoff state.",
    proof: ["Mailbox reports", "Translated notes", "Urgency", "Gmail handoff"],
    image: "/journey/reports-view.png",
  },
] as const;

const features = [
  {
    id: "agent",
    label: "AI Agent",
    title: "Scheduled agent operations",
    body: "Configure schedule, source limits, focus areas, model settings, and see the current run status.",
    image: "/journey/agent-view.png",
    icon: Bot,
  },
  {
    id: "news",
    label: "News",
    title: "Monitoring feed",
    body: "Database-backed articles are grouped by source, geography, urgency, and agent metadata where available.",
    image: "/journey/news-view.png",
    icon: Newspaper,
  },
  {
    id: "funding",
    label: "Funding",
    title: "Grant pipeline",
    body: "Database-backed funding calls show fit scores, phases, next steps, deadlines, and eligibility checks.",
    image: "/landing/funding-view.png",
    icon: Target,
  },
  {
    id: "reports",
    label: "Reports",
    title: "Email and report triage",
    body: "Incoming mailbox reports and project emails are sorted by urgency and prepared as translated working notes.",
    image: "/journey/reports-view.png",
    icon: Mail,
  },
] as const;

const pipeline = [
  {
    label: "Schedule",
    text: "Using the configured two-day schedule and selected focus areas.",
    icon: Search,
  },
  {
    label: "Check",
    text: "Showing service health, source checks, and current run state.",
    icon: Globe2,
  },
  {
    label: "Collect",
    text: "Preparing news, funding, and mailbox-report collection scopes.",
    icon: Languages,
  },
  {
    label: "Write",
    text: "Updating the same workspace data model used by the app screens.",
    icon: ShieldCheck,
  },
  {
    label: "Review",
    text: "Surfacing last-run counts and workspace updates for review.",
    icon: CheckCircle2,
  },
] as const;

export function CustomerJourney() {
  const [activeChapter, setActiveChapter] =
    useState<(typeof chapters)[number]["id"]>("problem");
  const [activeFeature, setActiveFeature] =
    useState<(typeof features)[number]["id"]>("agent");
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [stageIndex, setStageIndex] = useState(0);

  const chapter = useMemo(
    () => chapters.find((item) => item.id === activeChapter) ?? chapters[0],
    [activeChapter],
  );
  const feature = useMemo(
    () => features.find((item) => item.id === activeFeature) ?? features[0],
    [activeFeature],
  );

  useEffect(() => {
    if (agentState !== "running") return;

    setStageIndex(0);
    const stageTimer = window.setInterval(() => {
      setStageIndex((index) => Math.min(pipeline.length - 1, index + 1));
    }, 980);
    const finishTimer = window.setTimeout(() => {
      setAgentState("done");
      setStageIndex(pipeline.length - 1);
    }, 5200);

    return () => {
      window.clearInterval(stageTimer);
      window.clearTimeout(finishTimer);
    };
  }, [agentState]);

  const startAgent = () => {
    setActiveChapter("agent");
    setAgentState("running");
  };

  return (
    <main
      id="journey-top"
      className="min-h-screen bg-[oklch(0.982_0.006_140)] text-foreground"
    >
      <JourneyHeader onStartAgent={startAgent} />
      <section className="mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <HeroCopy onStartAgent={startAgent} />
        <HeroVisual
          agentState={agentState}
          stageIndex={stageIndex}
          onStartAgent={startAgent}
        />
      </section>

      <section className="border-y border-[oklch(0.86_0.018_120)] bg-white/72">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <ChapterNav active={activeChapter} onChange={setActiveChapter} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
        <ChapterPanel chapter={chapter} />
        <ScreenshotFrame
          src={chapter.image}
          alt={`${chapter.title} screenshot`}
        />
      </section>

      <section className="bg-[oklch(0.21_0.02_260)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
          <AgentRunPanel
            agentState={agentState}
            stageIndex={stageIndex}
            onStartAgent={startAgent}
            onReset={() => setAgentState("idle")}
          />
          <PipelineZoom agentState={agentState} stageIndex={stageIndex} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <FeatureExplorer
          activeFeature={activeFeature}
          feature={feature}
          onChange={setActiveFeature}
        />
      </section>
    </main>
  );
}

type AgentState = "idle" | "running" | "done";

function JourneyHeader({ onStartAgent }: { onStartAgent: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[oklch(0.86_0.018_120)] bg-[oklch(0.982_0.006_140)/0.86] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#journey-top"
          className="inline-flex items-baseline gap-[0.045em] text-3xl font-black leading-none tracking-[-0.045em] text-[oklch(0.22_0.012_260)]"
        >
          <span>afriki</span>
          <span className="inline-block h-[0.14em] w-[0.14em] translate-y-[0.015em] rounded-full bg-[oklch(0.68_0.045_145)]" />
        </a>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              document
                .getElementById("journey-features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hidden h-10 rounded-lg bg-white sm:inline-flex"
          >
            Explore features
          </Button>
          <Button
            type="button"
            onClick={onStartAgent}
            className="h-10 rounded-lg bg-[oklch(0.28_0.035_150)] text-white hover:bg-[oklch(0.34_0.045_150)]"
          >
            Start agent
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroCopy({ onStartAgent }: { onStartAgent: () => void }) {
  return (
    <div>
      <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.42em] text-[oklch(0.44_0.045_150)]">
        Current product walkthrough
      </div>
      <h1 className="max-w-3xl text-balance text-[clamp(3rem,7vw,6.75rem)] font-black leading-[0.9] tracking-tight text-[oklch(0.22_0.012_260)]">
        Afriki turns monitoring work into an operations console.
      </h1>
      <p className="mt-7 max-w-2xl text-balance text-xl font-medium leading-8 text-[oklch(0.34_0.012_260)] sm:text-2xl sm:leading-9">
        This static journey mirrors the current app: organization login,
        onboarding-backed workspace settings, the Afriki AI Agent console, and
        separate pages for news, funding, and email reports.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onStartAgent}
          className="h-11 rounded-lg bg-[oklch(0.28_0.035_150)] px-5 text-white hover:bg-[oklch(0.34_0.045_150)]"
        >
          Run the agent demo
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            document
              .getElementById("journey-features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="h-11 rounded-lg bg-white px-5"
        >
          See feature outputs
        </Button>
      </div>
    </div>
  );
}

function HeroVisual({
  agentState,
  stageIndex,
  onStartAgent,
}: {
  agentState: AgentState;
  stageIndex: number;
  onStartAgent: () => void;
}) {
  return (
    <div className="relative min-h-[520px]">
      <div
        className={cn(
          "absolute inset-0 rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-4 shadow-2xl transition-all duration-700",
          agentState === "running" && "scale-[1.035]",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Afriki AI Agent
            </div>
            <div className="mt-1 text-xl font-black tracking-tight">
              Operations console
            </div>
          </div>
          <AgentStatusPill agentState={agentState} />
        </div>

        <div className="grid h-[405px] overflow-hidden rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.985_0.005_145)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-[oklch(0.88_0.014_120)] p-5 lg:border-b-0 lg:border-r">
            <div className="text-sm font-bold">Next run</div>
            <div className="mt-2 text-3xl font-black">Every 2 days</div>
            <div className="mt-4 grid gap-2">
              {["News monitoring", "Funding scout", "Email reports"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border border-[oklch(0.88_0.014_120)] bg-white px-3 py-2 text-sm"
                  >
                    <span>{item}</span>
                    <CheckCircle2 className="h-4 w-4 text-[oklch(0.55_0.06_145)]" />
                  </div>
                ),
              )}
            </div>
            <Button
              type="button"
              onClick={agentState === "running" ? undefined : onStartAgent}
              disabled={agentState === "running"}
              className="mt-5 h-10 w-full rounded-lg bg-[oklch(0.28_0.035_150)] text-white hover:bg-[oklch(0.34_0.045_150)]"
            >
              {agentState === "running" ? (
                <>
                  <Pause className="h-4 w-4" />
                  Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start agent
                </>
              )}
            </Button>
          </div>
          <div className="relative p-5">
            <PipelineZoom
              agentState={agentState}
              stageIndex={stageIndex}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterNav({
  active,
  onChange,
}: {
  active: (typeof chapters)[number]["id"];
  onChange: (id: (typeof chapters)[number]["id"]) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {chapters.map((item, index) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "flex min-w-[190px] items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all",
            active === item.id
              ? "border-[oklch(0.58_0.06_145)] bg-[oklch(0.94_0.024_145)] shadow-sm"
              : "border-[oklch(0.86_0.018_120)] bg-white hover:border-[oklch(0.68_0.045_145)]",
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[oklch(0.28_0.035_150)] font-mono text-xs font-bold text-white">
            {index + 1}
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {item.eyebrow}
            </span>
            <span className="block truncate text-sm font-bold">
              {item.title}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function ChapterPanel({ chapter }: { chapter: (typeof chapters)[number] }) {
  return (
    <article className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-6 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[oklch(0.44_0.045_150)]">
        {chapter.eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {chapter.title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {chapter.body}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {chapter.proof.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.985_0.006_140)] px-3 py-2 text-sm font-semibold"
          >
            <CheckCircle2 className="h-4 w-4 text-[oklch(0.52_0.07_145)]" />
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function AgentRunPanel({
  agentState,
  stageIndex,
  onStartAgent,
  onReset,
}: {
  agentState: AgentState;
  stageIndex: number;
  onStartAgent: () => void;
  onReset: () => void;
}) {
  const activeStage = pipeline[stageIndex];

  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
        Static agent preview
      </div>
      <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight">
        Click start agent to preview the current run flow.
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
        This GitHub Pages animation is based on the implemented Agent page:
        schedule, focus areas, service checks, current run progress, and
        last-run counts.
      </p>

      <div className="mt-7 rounded-lg border border-white/12 bg-white/8 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold">
              {agentState === "running"
                ? activeStage?.label
                : agentState === "done"
                  ? "Demo run completed"
                  : "Ready to run"}
            </div>
            <div className="mt-1 text-xs leading-5 text-white/62">
              {agentState === "running"
                ? activeStage?.text
                : agentState === "done"
                  ? "The completed state mirrors the current run-summary cards."
                  : "Start the animation to preview the agent-console flow."}
            </div>
          </div>
          <AgentStatusPill agentState={agentState} dark />
        </div>
        <ProgressTrack agentState={agentState} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onStartAgent}
            disabled={agentState === "running"}
            className="h-10 rounded-lg bg-white text-[oklch(0.24_0.02_260)] hover:bg-white/90"
          >
            <Play className="h-4 w-4" />
            Start agent
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="h-10 rounded-lg border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {agentState === "done" && <RunCompleteCard onReset={onReset} />}
    </div>
  );
}

function PipelineZoom({
  agentState,
  stageIndex,
  compact = false,
}: {
  agentState: AgentState;
  stageIndex: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-full min-h-[330px] overflow-hidden rounded-lg border p-4 transition-all duration-700",
        compact
          ? "border-[oklch(0.88_0.014_120)] bg-white"
          : "border-white/14 bg-white text-foreground shadow-2xl",
        agentState === "running" && "scale-[1.04]",
      )}
    >
      <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Agent pipeline
          </div>
          <div className="text-sm font-black">
            {agentState === "done" ? "Results published" : "Source to action"}
          </div>
        </div>
        <Timer className="h-5 w-5 text-[oklch(0.52_0.07_145)]" />
      </div>

      <div className="relative z-0 mt-16 grid gap-3">
        {pipeline.map((step, index) => {
          const Icon = step.icon;
          const isActive = agentState === "running" && index === stageIndex;
          const isDone =
            agentState === "done" ||
            (agentState === "running" && index < stageIndex);
          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-3 transition-all duration-500",
                isActive &&
                  "translate-x-2 border-[oklch(0.58_0.06_145)] bg-[oklch(0.94_0.024_145)] shadow-lg",
                isDone &&
                  !isActive &&
                  "border-[oklch(0.82_0.024_145)] bg-[oklch(0.97_0.014_145)]",
                !isActive &&
                  !isDone &&
                  "border-[oklch(0.88_0.014_120)] bg-[oklch(0.99_0.003_140)]",
              )}
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                  isDone || isActive
                    ? "bg-[oklch(0.68_0.045_145)] text-white"
                    : "bg-[oklch(0.94_0.024_145)] text-[oklch(0.34_0.055_145)]",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black">{step.label}</span>
                <span
                  className={cn(
                    "text-xs leading-5 text-muted-foreground",
                    compact ? "hidden" : "block",
                  )}
                >
                  {step.text}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <ProgressTrack agentState={agentState} />
      </div>
    </div>
  );
}

function FeatureExplorer({
  activeFeature,
  feature,
  onChange,
}: {
  activeFeature: (typeof features)[number]["id"];
  feature: (typeof features)[number];
  onChange: (id: (typeof features)[number]["id"]) => void;
}) {
  const Icon = feature.icon;

  return (
    <div id="journey-features">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Feature outputs
          </div>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight">
            Click through the customer journey outputs.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {features.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors",
                  activeFeature === item.id
                    ? "border-[oklch(0.58_0.06_145)] bg-[oklch(0.28_0.035_150)] text-white"
                    : "border-[oklch(0.86_0.018_120)] bg-white text-foreground hover:border-[oklch(0.68_0.045_145)]",
                )}
              >
                <ItemIcon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-6 shadow-sm">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[oklch(0.94_0.024_145)] text-[oklch(0.34_0.055_145)]">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight">
            {feature.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {feature.body}
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Traceable source context",
              "Organization-specific categories",
              "Database-backed workspace records",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.52_0.07_145)]" />
                {item}
              </div>
            ))}
          </div>
        </article>
        <ScreenshotFrame
          src={feature.image}
          alt={`${feature.title} screenshot`}
        />
      </div>
    </div>
  );
}

function ScreenshotFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-[oklch(0.86_0.018_120)] bg-white shadow-2xl">
      <div className="relative aspect-[16/10] w-full">
        {/* biome-ignore lint/performance/noImgElement: The Pages export uses direct static asset paths under /code-base. */}
        <img
          src={publicAsset(src)}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    </figure>
  );
}

function publicAsset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

function AgentStatusPill({
  agentState,
  dark = false,
}: {
  agentState: AgentState;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold",
        agentState === "running" &&
          "bg-[oklch(0.94_0.024_145)] text-[oklch(0.28_0.035_150)]",
        agentState === "done" &&
          "bg-[oklch(0.93_0.045_145)] text-[oklch(0.3_0.055_145)]",
        agentState === "idle" &&
          (dark
            ? "bg-white/10 text-white/70"
            : "bg-[oklch(0.95_0.006_140)] text-muted-foreground"),
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          agentState === "running" && "animate-pulse bg-[oklch(0.52_0.07_145)]",
          agentState === "done" && "bg-[oklch(0.52_0.07_145)]",
          agentState === "idle" && "bg-muted-foreground/45",
        )}
      />
      {agentState === "running"
        ? "Running"
        : agentState === "done"
          ? "Done"
          : "Idle"}
    </span>
  );
}

function ProgressTrack({ agentState }: { agentState: AgentState }) {
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[oklch(0.9_0.01_145)]">
      <div
        className={cn(
          "h-full rounded-full bg-[oklch(0.52_0.07_145)]",
          agentState === "running" &&
            "animate-[agent-progress_5.2s_linear_forwards]",
          agentState === "done" && "w-full",
          agentState === "idle" && "w-[8%]",
        )}
      />
      <style jsx>{`
        @keyframes agent-progress {
          from {
            width: 8%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function RunCompleteCard({
  onReset,
  className,
}: {
  onReset: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-5 w-full max-w-md rounded-lg border border-[oklch(0.78_0.035_145)] bg-white p-4 text-foreground shadow-2xl",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black">Agent preview complete</div>
          <div className="mt-1 text-xs text-muted-foreground">
            The current console shows inserted counts after each run.
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-[oklch(0.52_0.07_145)]" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <RunStat label="News" value="0" />
        <RunStat label="Funding" value="0" />
        <RunStat label="Reports" value="0" />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[oklch(0.34_0.055_145)]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Run again
      </button>
    </div>
  );
}

function RunStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.985_0.006_140)] p-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}
