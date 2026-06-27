"use client";

import {
  ArrowRight,
  Compass,
  Globe2,
  Landmark,
  MailCheck,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ORGS } from "@/lib/profile";

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-[oklch(0.985_0.008_100)] text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={onLogin}
          className="flex items-center gap-3 text-left"
          aria-label="Open organization login"
        >
          <Image
            src="/brand/afriki-logo.svg"
            alt="Afriki logo"
            width={132}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </button>
        <Button
          type="button"
          onClick={onLogin}
          className="h-10 gap-2 bg-[oklch(0.26_0.04_170)] px-4 text-white hover:bg-[oklch(0.32_0.05_170)]"
        >
          Log in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-8 px-5 pb-12 pt-4 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[oklch(0.77_0.07_90)] bg-[oklch(0.96_0.025_90)] px-3 py-1 text-xs font-semibold text-[oklch(0.34_0.06_90)]">
              <Compass className="h-3.5 w-3.5" />
              Afrika + KI, shaped for NGO operations
            </div>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Intelligence for teams working across borders.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Afriki turns funding calls, field updates, media monitoring, and
              received project reports into a calm workspace for teams that need
              to understand context before they act.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={onLogin}
                className="h-11 gap-2 bg-[oklch(0.26_0.04_170)] px-5 text-white hover:bg-[oklch(0.32_0.05_170)]"
              >
                Enter workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[oklch(0.47_0.11_145)]" />
                Organization workspaces, simple team access
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden h-24 w-24 rotate-[-7deg] rounded-lg border border-[oklch(0.82_0.05_65)] bg-[oklch(0.98_0.02_65)] p-3 text-xs font-semibold shadow-lg md:block">
              <div className="text-[10px] uppercase text-muted-foreground">
                Today
              </div>
              <div className="mt-2">3 deadlines moved into action</div>
            </div>
            <div className="rounded-xl border border-[oklch(0.84_0.025_130)] bg-white p-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-3 pb-3">
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">
                    Afriki workspace
                  </div>
                  <div className="text-lg font-bold">
                    Sources, urgency, outputs
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {ORGS.map((org) => (
                    <div
                      key={org.id}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white p-1"
                    >
                      <Image
                        src={org.logoSrc}
                        alt={org.logoAlt}
                        width={org.id === "bk" ? 34 : 25}
                        height={org.id === "bk" ? 12 : 25}
                        className="max-h-7 w-auto object-contain"
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 p-3 md:grid-cols-[0.9fr_1.1fr]">
                <div className="min-h-72 rounded-lg border border-[oklch(0.83_0.04_145)] bg-[oklch(0.93_0.035_145)] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <Globe2 className="h-5 w-5 text-[oklch(0.34_0.07_170)]" />
                    <span className="rounded bg-white px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
                      Source map
                    </span>
                  </div>
                  <div className="relative h-48 rounded-lg bg-[oklch(0.78_0.055_155)]">
                    <span className="absolute left-[18%] top-[36%] h-3 w-3 rounded-full bg-[oklch(0.7_0.17_35)] ring-4 ring-white/70" />
                    <span className="absolute left-[51%] top-[55%] h-3 w-3 rounded-full bg-[oklch(0.42_0.12_215)] ring-4 ring-white/70" />
                    <span className="absolute left-[70%] top-[28%] h-3 w-3 rounded-full bg-[oklch(0.54_0.12_145)] ring-4 ring-white/70" />
                    <div className="absolute bottom-3 left-3 right-3 rounded-md bg-white/90 p-3 shadow-sm">
                      <div className="text-xs font-semibold">
                        Burundi project email
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        Translated, tagged, and ready for review.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {SIGNALS.map((signal) => {
                    const Icon = signal.icon;
                    return (
                      <article
                        key={signal.title}
                        className="rounded-lg border border-border bg-[oklch(0.99_0.004_110)] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className={signal.iconClass}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h2 className="truncate text-sm font-bold">
                                {signal.title}
                              </h2>
                              <span className="shrink-0 text-[10px] font-semibold uppercase text-muted-foreground">
                                {signal.owner}
                              </span>
                            </div>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {signal.body}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[oklch(0.86_0.025_110)] bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Partners
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                A focused partner network.
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Afriki brings product, social-impact, and NGO expertise into one
                operational workspace.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <PartnerImage
                src="/partners/tum-social-ai-club-logo.svg"
                alt="TUM Social AI Club logo"
                label="Research and social AI community"
                width={210}
                height={64}
              />
              {ORGS.map((org) => (
                <PartnerLogo key={org.id} org={org} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Project references
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Workflows grounded in real NGO needs.
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={onLogin}
              className="h-10"
            >
              View workspace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REFERENCES.map((reference) => {
              const Icon = reference.icon;
              return (
                <article
                  key={reference.title}
                  className="overflow-hidden rounded-lg border border-[oklch(0.84_0.025_110)] bg-white shadow-sm"
                >
                  <div className={reference.bandClass}>
                    <div className="grid h-10 w-10 place-items-center rounded-md bg-white/90 text-[oklch(0.26_0.04_170)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right text-[10px] font-bold uppercase tracking-wide text-white/90">
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
                          className="rounded-md bg-[oklch(0.96_0.015_120)] px-2 py-1 text-[11px] font-semibold text-[oklch(0.33_0.05_145)]"
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

const SIGNALS = [
  {
    title: "Grant deadline detected",
    owner: "BK",
    body: "Eligibility, amount range, co-funding notes, and timeline are grouped before the first review meeting.",
    icon: Landmark,
    iconClass:
      "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[oklch(0.94_0.035_90)] text-[oklch(0.39_0.08_80)]",
  },
  {
    title: "Animal welfare issue clustered",
    owner: "WTG",
    body: "Articles are sorted into German, international, social media, agriculture, and NGO-reporting categories.",
    icon: Newspaper,
    iconClass:
      "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[oklch(0.94_0.035_35)] text-[oklch(0.48_0.13_35)]",
  },
  {
    title: "Partner report translated",
    owner: "Inbox",
    body: "Original text, summary, source, tags, and image fields follow each workspace's onboarding setup.",
    icon: MailCheck,
    iconClass:
      "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[oklch(0.94_0.035_210)] text-[oklch(0.38_0.1_220)]",
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
      "flex h-24 items-start justify-between bg-[oklch(0.38_0.08_155)] p-4",
  },
  {
    org: "Welttierschutzgesellschaft e.V.",
    title: "Animal welfare press mirror",
    body: "WTG monitoring combines keywords, categories, and urgency so daily Google Alert items can become clear press-mirror entries.",
    tags: ["Keywords", "Categories", "Urgency"],
    icon: Newspaper,
    bandClass:
      "flex h-24 items-start justify-between bg-[oklch(0.48_0.12_45)] p-4",
  },
  {
    org: "Afriki",
    title: "Email reports turned into working notes",
    body: "Incoming project emails are translated, summarized, sorted by urgency, and prepared as a clean output before deeper review.",
    tags: ["Email intake", "Translation", "Reports"],
    icon: MailCheck,
    bandClass:
      "flex h-24 items-start justify-between bg-[oklch(0.32_0.08_220)] p-4",
  },
];

type PartnerOrg = (typeof ORGS)[number];

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
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-border bg-[oklch(0.99_0.003_110)] p-4 text-center shadow-sm">
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
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-border bg-[oklch(0.99_0.003_110)] p-4 text-center shadow-sm">
      <Image
        src={org.logoSrc}
        alt={org.logoAlt}
        width={org.id === "bk" ? 170 : 74}
        height={org.id === "bk" ? 56 : 74}
        className="max-h-16 w-auto object-contain"
      />
      <div className="mt-3 text-[11px] font-semibold text-muted-foreground">
        {org.description}
      </div>
    </div>
  );
}
