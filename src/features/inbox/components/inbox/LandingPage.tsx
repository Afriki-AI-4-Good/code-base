"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  Globe2,
  Landmark,
  MailCheck,
  Map as MapIcon,
  Newspaper,
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
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[oklch(0.26_0.04_170)] text-white shadow-sm">
            <MapIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Signal Desk</div>
            <div className="text-[11px] text-muted-foreground">
              NGO operations intelligence
            </div>
          </div>
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
              Built for the hackathon, shaped by real NGO desks
            </div>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              One calm room for noisy civic work.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Signal Desk turns funding calls, field updates, news, and partner
              reports into an organized workspace for teams that need to act
              before the moment passes.
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
                <CheckCircle2 className="h-4 w-4 text-[oklch(0.47_0.11_145)]" />
                Username only, no password wall
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
                    Live workspace preview
                  </div>
                  <div className="text-lg font-bold">
                    Map, inbox, next steps
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
                        Burundi field report
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
                Built around organizations already in the room.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <PartnerMark label="TUM Social AI Club" tone="club" />
              {ORGS.map((org) => (
                <PartnerLogo key={org.id} org={org} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3">
          {REFERENCES.map((reference) => (
            <article
              key={reference.title}
              className="rounded-lg border border-[oklch(0.84_0.025_110)] bg-white p-5 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                {reference.org}
              </div>
              <h2 className="mt-3 text-lg font-black tracking-tight">
                {reference.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {reference.body}
              </p>
            </article>
          ))}
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
    owner: "Team",
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
    body: "A mocked BK desk shows calls for proposals beside translated field context, so funding work starts with the right evidence.",
  },
  {
    org: "Welttierschutzgesellschaft e.V.",
    title: "Animal welfare monitoring without inbox sprawl",
    body: "A mocked WTG desk tracks keywords and categories from onboarding, then places new coverage where communications teams can act.",
  },
  {
    org: "TUM Social AI Club",
    title: "Hackathon foundation for responsible automation",
    body: "The starter keeps the interface, database profile, and server routes in one place for the agent features coming next.",
  },
];

type PartnerOrg = (typeof ORGS)[number];

function PartnerMark({ label, tone }: { label: string; tone: "club" }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-[oklch(0.97_0.015_230)] p-4 text-center">
      <div>
        <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-md bg-[oklch(0.3_0.07_230)] text-white">
          {tone === "club" ? <ClipboardList className="h-4 w-4" /> : null}
        </div>
        <div className="text-sm font-black uppercase tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
}

function PartnerLogo({ org }: { org: PartnerOrg }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-lg border border-border bg-[oklch(0.99_0.003_110)] p-4">
      <Image
        src={org.logoSrc}
        alt={org.logoAlt}
        width={org.id === "bk" ? 170 : 74}
        height={org.id === "bk" ? 56 : 74}
        className="max-h-16 w-auto object-contain"
      />
    </div>
  );
}
