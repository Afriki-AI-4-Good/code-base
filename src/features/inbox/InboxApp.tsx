"use client";

import { useEffect, useMemo, useState } from "react";

import { CardDetailSheet } from "@/components/inbox/CardDetailSheet";
import { FundingView } from "@/components/inbox/FundingView";
import type { CategoryFilter, ViewMode } from "@/components/inbox/InboxHeader";
import { KanbanView } from "@/components/inbox/KanbanView";
import { LandingPage } from "@/components/inbox/LandingPage";
import { ListView } from "@/components/inbox/ListView";
import { LoginScreen } from "@/components/inbox/LoginScreen";
import {
  FilterPills,
  MapBackdrop,
  ViewTabs,
} from "@/components/inbox/MapBackdrop";
import { MapView } from "@/components/inbox/MapView";
import { NewsView } from "@/components/inbox/NewsView";
import { OnboardingDialog } from "@/components/inbox/OnboardingDialog";
import { ReportsView } from "@/components/inbox/ReportsView";
import { Sidebar } from "@/components/inbox/Sidebar";
import {
  filterByTime,
  TimePills,
  type TimeRange,
} from "@/components/inbox/TimeFilter";
import {
  clearSession,
  type LoginSession,
  loadSession,
  saveSession,
  type UserProfile,
} from "@/lib/profile";
import type { InboxEntry } from "@/types/inbox";
import { api } from "~/trpc/react";

export function InboxApp() {
  const utils = api.useUtils();
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [session, setSession] = useState<LoginSession | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("landing");
  const { data: entries = [], isLoading: entriesLoading } =
    api.inbox.list.useQuery(undefined, { enabled: sessionLoaded && !!session });
  const { data: savedProfile, isLoading: profileLoading } =
    api.inbox.profile.get.useQuery(session ?? FALLBACK_SESSION, {
      enabled: sessionLoaded && !!session,
    });

  const [section, setSection] = useState<string>("inbox");
  const [view, setView] = useState<ViewMode>("map");
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [selected, setSelected] = useState<InboxEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const upsertProfile = api.inbox.profile.upsert.useMutation({
    onSuccess: async (nextProfile) => {
      setProfile(nextProfile);
      setOnboardingOpen(false);
      await utils.inbox.profile.get.invalidate({
        org: nextProfile.org,
        username: nextProfile.username,
      });
    },
  });

  useEffect(() => {
    setSession(loadSession());
    setSessionLoaded(true);
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setOnboardingOpen(false);
      return;
    }

    setProfile(savedProfile ?? null);
    if (!profileLoading && !savedProfile) setOnboardingOpen(true);
  }, [profileLoading, savedProfile, session]);

  const filtered = useMemo(() => {
    const byCategory =
      filter === "all"
        ? entries
        : entries.filter((entry) => entry.category === filter);
    return filterByTime(byCategory, timeRange);
  }, [entries, filter, timeRange]);

  const handleSelect = (entry: InboxEntry) => {
    setSelected(entry);
    setOpen(true);
  };

  const handleCompleteOnboarding = (nextProfile: UserProfile) => {
    upsertProfile.mutate(nextProfile);
  };

  const handleCancelOnboarding = () => {
    if (profile) {
      setOnboardingOpen(false);
      return;
    }

    clearSession();
    setAuthMode("landing");
    setSession(null);
    setProfile(null);
    setOnboardingOpen(false);
  };

  const handleLogin = (nextSession: LoginSession) => {
    saveSession(nextSession);
    setSession(nextSession);
    setProfile(null);
    setSection("inbox");
    setAuthMode("landing");
  };

  const handleLogout = () => {
    clearSession();
    setAuthMode("landing");
    setSession(null);
    setProfile(null);
    setOnboardingOpen(false);
  };

  if (!sessionLoaded) {
    return <InboxLoading />;
  }

  if (!session) {
    if (authMode === "login") {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onBack={() => setAuthMode("landing")}
        />
      );
    }

    return <LandingPage onLogin={() => setAuthMode("login")} />;
  }

  if (entriesLoading || profileLoading) {
    return <InboxLoading />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        profile={profile}
        session={session}
        onChangeProfile={() => setOnboardingOpen(true)}
        onLogout={handleLogout}
        active={section}
        onActiveChange={setSection}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative flex-1 overflow-hidden bg-[oklch(0.985_0.005_145)]">
          {section === "funding" ? (
            <>
              <MapBackdrop entries={filtered} dimmed />
              <FundingView entries={entries} onSelect={handleSelect} />
            </>
          ) : section === "news" ? (
            <>
              <MapBackdrop
                entries={entries.filter((entry) => entry.category === "news")}
                dimmed
              />
              <NewsView entries={entries} onSelect={handleSelect} />
            </>
          ) : section === "reports" ? (
            <>
              <MapBackdrop entries={entries} dimmed />
              <ReportsView />
            </>
          ) : view === "map" ? (
            <>
              <MapView
                entries={filtered}
                onSelect={handleSelect}
                view={view}
                onViewChange={setView}
              />
              <div className="pointer-events-none absolute left-4 top-16 z-20">
                <div className="pointer-events-auto">
                  <TimePills value={timeRange} onChange={setTimeRange} />
                </div>
              </div>
            </>
          ) : (
            <>
              <MapBackdrop entries={filtered} dimmed />
              <div className="pointer-events-none absolute left-4 top-4 z-20">
                <div className="pointer-events-auto">
                  <ViewTabs view={view} onViewChange={setView} />
                </div>
              </div>
              <div className="pointer-events-none absolute left-4 top-16 z-20">
                <div className="pointer-events-auto">
                  <TimePills value={timeRange} onChange={setTimeRange} />
                </div>
              </div>
              <div className="pointer-events-none absolute right-4 top-4 z-20">
                <div className="pointer-events-auto">
                  <FilterPills filter={filter} onFilterChange={setFilter} />
                </div>
              </div>
              <div className="absolute inset-x-4 bottom-4 top-28 z-10 flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/55 shadow-xl backdrop-blur-xl">
                <div className="flex items-baseline justify-between border-b border-white/40 px-6 pb-3 pt-4">
                  <div>
                    <h1 className="text-lg font-bold tracking-tight">
                      Intelligent Inbox
                    </h1>
                    <p className="text-[11px] text-muted-foreground">
                      {filtered.length} curated entries · sorted by importance
                    </p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {view === "kanban" && (
                    <KanbanView entries={filtered} onSelect={handleSelect} />
                  )}
                  {view === "list" && (
                    <ListView entries={filtered} onSelect={handleSelect} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <CardDetailSheet entry={selected} open={open} onOpenChange={setOpen} />
      <OnboardingDialog
        open={onboardingOpen}
        session={session}
        initial={profile}
        onCancel={handleCancelOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}

type AuthMode = "landing" | "login";

const FALLBACK_SESSION: LoginSession = { org: "bk", username: "pending" };

function InboxLoading() {
  return (
    <div className="grid h-screen place-items-center bg-[oklch(0.985_0.005_145)] text-foreground">
      <div className="rounded-2xl border border-white/50 bg-white/70 px-5 py-4 text-sm shadow-xl backdrop-blur-xl">
        Loading intelligent inbox...
      </div>
    </div>
  );
}
