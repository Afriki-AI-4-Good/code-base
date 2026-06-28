"use client";

import {
  ArrowRight,
  CheckCircle2,
  Globe2,
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
        <div aria-hidden="true" />
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
              Agentic AI intelligence for NGOs
            </div>
            <AfrikiWordmark />
            <p className="mt-7 max-w-3xl text-balance text-2xl font-medium leading-snug text-[oklch(0.34_0.012_260)] sm:text-3xl">
              Afriki monitors scattered sources, retrieves what matters,
              translates foreign-language content, and turns it into a{" "}
              <span className="font-black text-[oklch(0.25_0.05_145)]">
                triaged inbox
              </span>{" "}
              for NGOs.
            </p>

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
                Built for transparent monitoring across many sources
              </div>
            </div>
          </div>

          <div className="relative z-0 hidden min-w-0 lg:block">
            <FeatureScreenshot
              src="/landing/inbox-map.png"
              alt="Afriki inbox map view screenshot"
              priority
            />
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
                Afriki brings agentic AI, field experience, and two NGO use
                cases into one workspace for monitoring, translation, and
                decision-ready review.
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
                The problem
              </div>
              <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight">
                NGO teams should not spend hours searching, copying, and
                translating updates by hand.
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
                Agentic funding intelligence
              </div>
              <h2 className="mt-3 max-w-xl text-4xl font-black tracking-tight">
                Never miss a relevant grant because someone had to check one
                more portal manually.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                Afriki keeps funding separate from reports, translates calls,
                checks fit against the NGO profile, and surfaces deadline,
                amount, funder, eligibility, and next steps before the first
                review.
              </p>
            </div>
            <FeatureScreenshot
              src="/landing/funding-view.png"
              alt="Afriki funding page screenshot"
              priority
              variant="dark"
            />
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

function AfrikiWordmark() {
  const content = (
    <>
      <span>afriki</span>
      <span
        className="inline-block h-[0.14em] w-[0.14em] translate-y-[0.015em] rounded-full bg-[oklch(0.68_0.045_145)]"
        aria-hidden="true"
      />
    </>
  );

  return (
    <h1
      aria-label="afriki"
      className="inline-flex max-w-4xl items-baseline gap-[0.045em] text-[clamp(3.3rem,10vw,8.5rem)] font-black leading-[0.86] tracking-[-0.045em] text-[oklch(0.22_0.012_260)]"
    >
      {content}
    </h1>
  );
}

const PIPELINE = [
  {
    title: "Monitor",
    body: "Agentic source monitoring watches RSS feeds, newsletters, alerts, databases, and mailboxes across many domains.",
    icon: Globe2,
  },
  {
    title: "Retrieve",
    body: "Keyword searches and source hits become traceable items, so teams can see what was found and where it came from.",
    icon: CheckCircle2,
  },
  {
    title: "Translate",
    body: "Foreign-language content is translated into the team's working language, with the original preserved for review.",
    icon: Languages,
  },
  {
    title: "Triage",
    body: "Urgency, category, deadline, amount, funder, and eligibility are surfaced before anyone opens the source.",
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

function FeatureScreenshot({
  src,
  alt,
  priority = false,
  variant = "light",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: "light" | "dark";
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border shadow-2xl",
        variant === "dark"
          ? "border-white/15 bg-white/8"
          : "border-[oklch(0.86_0.018_120)] bg-white",
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 48vw, 100vw"
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </figure>
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
