"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Inbox,
  Landmark,
  Languages,
  MailCheck,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ORGS } from "@/lib/profile";
import { cn } from "@/lib/utils";

const PARTNER_ORGS = ORGS.filter((org) => org.id !== "new_cause");

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-[oklch(0.982_0.006_140)] text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={onLogin}
          className="flex items-center text-left"
          aria-label="Open organization login"
        >
          <Image
            src="/brand/afriki-logo.svg"
            alt="Afriki logo"
            width={128}
            height={49}
            priority
            className="h-10 w-auto"
          />
        </button>
        <Button
          type="button"
          onClick={onLogin}
          className="h-10 gap-2 rounded-lg bg-[oklch(0.28_0.035_150)] px-4 text-white hover:bg-[oklch(0.34_0.045_150)]"
        >
          Log in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-7xl items-center gap-10 overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,0.85fr)]">
          <div className="relative z-10 max-w-[680px]">
            <div className="mb-7 text-[11px] font-semibold uppercase tracking-[0.42em] text-[oklch(0.44_0.045_150)]">
              An intelligent inbox for small NGOs
            </div>
            <h1 className="max-w-4xl text-balance text-[clamp(3.3rem,10vw,8.5rem)] font-black leading-[0.86] tracking-tight text-[oklch(0.22_0.012_260)]">
              afriki
              <span className="ml-2 inline-block h-[0.14em] w-[0.14em] rounded-full bg-[oklch(0.68_0.045_145)] align-baseline" />
            </h1>
            <p className="mt-7 max-w-3xl text-balance text-2xl font-medium leading-snug text-[oklch(0.34_0.012_260)] sm:text-3xl">
              Turning the daily flood of African news and funding calls into a{" "}
              <span className="font-black text-[oklch(0.25_0.05_145)]">
                triaged inbox
              </span>{" "}
              for small NGOs.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-muted-foreground">
              <PriorityDot color="bg-[oklch(0.72_0.085_28)]" label="Urgent" />
              <PriorityDot color="bg-[oklch(0.79_0.085_78)]" label="Relevant" />
              <PriorityDot
                color="bg-[oklch(0.68_0.045_145)]"
                label="Information"
              />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={onLogin}
                className="h-11 gap-2 rounded-lg bg-[oklch(0.28_0.035_150)] px-5 text-white hover:bg-[oklch(0.34_0.045_150)]"
              >
                Enter workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[oklch(0.48_0.065_145)]" />
                Built around real BK and WTG workflows
              </div>
            </div>
          </div>

          <div className="relative z-0 hidden min-w-0 lg:block">
            <ProductMockup />
          </div>

          <div className="absolute bottom-0 left-5 right-5 h-px bg-[oklch(0.84_0.018_120)] sm:left-8 sm:right-8" />
        </section>

        <section className="border-b border-[oklch(0.84_0.018_120)] bg-white/72">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Designed with
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Real partners, real operating pressure.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Afriki brings social AI, field experience, and two NGO use cases
                into one calm workspace.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <PartnerImage
                src="/partners/tum-social-ai-club-logo.svg"
                alt="TUM Social AI Club logo"
                label="Social AI community"
                width={210}
                height={64}
              />
              {PARTNER_ORGS.map((org) => (
                <PartnerLogo key={org.id} org={org} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                What Afriki does
              </div>
              <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight">
                From scattered raw sources to a clean, role-aware inbox.
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onLogin}
              className="h-10 rounded-lg bg-white"
            >
              View workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {PIPELINE.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="min-h-48 rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-[oklch(0.94_0.024_145)] text-[oklch(0.34_0.055_145)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[oklch(0.24_0.02_260)] text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55">
                The moat
              </div>
              <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight">
                Funding intelligence: never miss a grant again.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                Every funding call is separated from reports, translated,
                checked against the NGO profile, and shown with deadline,
                amount, funder, and eligibility before the first review.
              </p>
            </div>
            <FundingCard />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Project references
            </div>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight">
              Workflows grounded in BK and WTG specifications.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REFERENCES.map((reference) => {
              const Icon = reference.icon;
              return (
                <article
                  key={reference.title}
                  className="overflow-hidden rounded-lg border border-[oklch(0.86_0.018_120)] bg-white shadow-sm"
                >
                  <div className={reference.bandClass}>
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/92 text-[oklch(0.25_0.04_145)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
                      {reference.org}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black tracking-tight">
                      {reference.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {reference.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {reference.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[oklch(0.95_0.02_145)] px-2 py-1 text-[11px] font-semibold text-[oklch(0.34_0.055_145)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

const PIPELINE = [
  {
    title: "Aggregate",
    body: "RSS, newsletters, funding databases, Google Alerts, and mailbox reports pulled into one place.",
    icon: Globe2,
  },
  {
    title: "Classify",
    body: "Priority and organization-specific categories tagged on every item.",
    icon: CheckCircle2,
  },
  {
    title: "Translate",
    body: "Summary in the team's language, with the original preserved for review.",
    icon: Languages,
  },
  {
    title: "Flag funding",
    body: "Deadlines, amounts, funders, and eligibility surfaced up front.",
    icon: Landmark,
  },
];

const REFERENCES = [
  {
    org: "Burundikids e.V.",
    title: "Funding scout for education programs",
    body: "Funding calls are separated from inbox reports and shown with deadline, amount range, eligibility, and BK-specific review status.",
    tags: ["Funding", "Eligibility", "Deadlines"],
    icon: Landmark,
    bandClass:
      "flex h-24 items-start justify-between bg-[oklch(0.32_0.045_150)] p-4",
  },
  {
    org: "Welttierschutzgesellschaft e.V.",
    title: "Animal welfare press mirror",
    body: "WTG monitoring combines keywords, categories, and urgency so daily Google Alert items become clear press-mirror entries.",
    tags: ["Keywords", "Categories", "Urgency"],
    icon: Newspaper,
    bandClass:
      "flex h-24 items-start justify-between bg-[oklch(0.49_0.09_42)] p-4",
  },
  {
    org: "Afriki",
    title: "Emails turned into working notes",
    body: "Incoming project emails are translated, summarized, sorted by urgency, and prepared for deeper review.",
    tags: ["Email intake", "Translation", "Reports"],
    icon: MailCheck,
    bandClass:
      "flex h-24 items-start justify-between bg-[oklch(0.29_0.028_260)] p-4",
  },
];

type PartnerOrg = (typeof ORGS)[number];

function ProductMockup() {
  return (
    <div className="rounded-2xl border border-[oklch(0.86_0.018_120)] bg-white p-4 shadow-2xl">
      <div className="grid min-h-[460px] gap-4 lg:grid-cols-[0.78fr_1.2fr_0.86fr]">
        <div className="rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.98_0.006_140)] p-4">
          <div className="mb-5 flex items-center gap-2 text-sm font-black">
            <Inbox className="h-4 w-4 text-[oklch(0.42_0.055_145)]" />
            Inbox
          </div>
          {["All", "Today", "Funding"].map((item, index) => (
            <div
              key={item}
              className={cn(
                "mb-2 rounded-lg px-3 py-2 text-xs font-semibold",
                index === 0
                  ? "bg-[oklch(0.28_0.035_150)] text-white"
                  : "bg-white text-muted-foreground",
              )}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <MockItem
            priority="Urgent"
            category="Funding"
            title="BMZ Call: Education Projects in Sub-Saharan Africa 2026"
            meta="Jul 15 · 17d · EUR 200k-1.5M"
            tone="urgent"
          />
          <MockItem
            priority="Urgent"
            category="Report"
            title="Quarterly Report Q2 2026 - Bujumbura School"
            meta="French · translated summary ready"
            tone="urgent"
          />
          <MockItem
            priority="Relevant"
            category="News"
            title="Burundi unveils new education strategy"
            meta="Source clustered with policy updates"
            tone="relevant"
          />
        </div>

        <div className="rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.985_0.006_140)] p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your brief
          </div>
          <div className="mt-2 text-lg font-black leading-tight">
            5 items for you, 2 urgent.
          </div>
          <div className="mt-5 space-y-3 text-xs leading-5 text-muted-foreground">
            <BriefLine text="BMZ education call - deadline 15 Jul" />
            <BriefLine text="Bujumbura School Q2 report" />
            <BriefLine text="New national education strategy" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FundingCard() {
  return (
    <article className="rounded-xl border border-white/10 bg-white p-5 text-foreground shadow-2xl">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]">
        <span className="rounded bg-[oklch(0.95_0.035_28)] px-2 py-1 text-[oklch(0.45_0.1_28)]">
          Urgent
        </span>
        <span className="rounded bg-[oklch(0.96_0.02_145)] px-2 py-1 text-[oklch(0.35_0.055_145)]">
          Funding
        </span>
        <span className="text-muted-foreground">Translated from German</span>
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-tight">
        BMZ Call for Proposals: Education Projects in Sub-Saharan Africa 2026
      </h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <FundingFact label="Amount" value="EUR 200k - 1.5M" />
        <FundingFact label="Funder" value="BMZ" />
        <FundingFact label="BK eligibility" value="Yes" />
      </div>
      <div className="mt-5 rounded-lg border border-[oklch(0.86_0.018_120)] bg-[oklch(0.982_0.006_140)] p-4">
        <div className="flex items-center justify-between gap-4">
          {["Open", "Info", "Deadline", "Decision"].map((step, index) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  index < 3
                    ? "bg-[oklch(0.68_0.045_145)]"
                    : "bg-[oklch(0.86_0.018_120)]",
                )}
              />
              <span className="truncate text-xs font-semibold text-muted-foreground">
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-[oklch(0.72_0.085_28)]" />
          <div>
            <div className="text-xl font-black">17 days</div>
            <div className="text-xs text-muted-foreground">
              to the submission deadline · 15 Jul 2026
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PriorityDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function MockItem({
  priority,
  category,
  title,
  meta,
  tone,
}: {
  priority: string;
  category: string;
  title: string;
  meta: string;
  tone: "urgent" | "relevant";
}) {
  return (
    <article className="rounded-lg border border-[oklch(0.88_0.014_120)] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em]">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            tone === "urgent"
              ? "bg-[oklch(0.72_0.085_28)]"
              : "bg-[oklch(0.79_0.085_78)]",
          )}
        />
        <span>{priority}</span>
        <span className="text-muted-foreground">{category}</span>
      </div>
      <h3 className="mt-3 text-sm font-black leading-snug">{title}</h3>
      <div className="mt-2 text-xs text-muted-foreground">{meta}</div>
    </article>
  );
}

function BriefLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.5_0.07_145)]" />
      <span>{text}</span>
    </div>
  );
}

function FundingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[oklch(0.88_0.014_120)] bg-[oklch(0.99_0.003_140)] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-black">{value}</div>
    </div>
  );
}

function PartnerImage({
  src,
  alt,
  label,
  width,
  height,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-4 text-center shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-h-14 w-auto object-contain"
      />
      <div className="mt-3 text-[11px] font-semibold text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function PartnerLogo({ org }: { org: PartnerOrg }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-[oklch(0.86_0.018_120)] bg-white p-4 text-center shadow-sm">
      <Image
        src={org.logoSrc}
        alt={org.logoAlt}
        width={org.id === "bk" ? 220 : 74}
        height={org.id === "bk" ? 74 : 74}
        className={cn(
          "w-auto object-contain",
          org.id === "bk" ? "max-h-20" : "max-h-16",
        )}
      />
      <div className="mt-3 text-[11px] font-semibold text-muted-foreground">
        {org.description}
      </div>
    </div>
  );
}
