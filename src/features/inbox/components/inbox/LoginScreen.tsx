"use client";

import { ArrowLeft, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type LoginSession,
  normalizeUsername,
  ORGS,
  type OrgId,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const DEMO_EMAIL = "demo@afriki.org";
const DEMO_PASSWORD = "demo2026";

export function LoginScreen({
  initialOrg = "bk",
  onLogin,
  onBack,
}: {
  initialOrg?: OrgId;
  onLogin: (session: LoginSession) => void;
  onBack: () => void;
}) {
  const [org, setOrg] = useState<OrgId>(initialOrg);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const normalizedEmail = email.trim().toLowerCase();
  const canContinue =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) &&
    password.trim().length > 0;

  const handleSubmit = () => {
    if (!canContinue) return;
    onLogin({ org, username: normalizeUsername(normalizedEmail) });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[oklch(0.982_0.006_140)] px-4 text-foreground">
      <div className="w-full max-w-4xl rounded-2xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Organization login
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Choose your workspace
            </h1>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Landing
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ORGS.map((item) => {
            const active = org === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOrg(item.id)}
                className={cn(
                  "flex min-h-36 flex-col items-start gap-4 rounded-xl border bg-white p-4 text-left transition-all",
                  active
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex h-16 w-full items-center justify-center rounded-lg bg-white">
                  <Image
                    src={item.logoSrc}
                    alt={item.logoAlt}
                    width={item.id === "bk" ? 150 : 72}
                    height={item.id === "bk" ? 50 : 72}
                    className="max-h-14 w-auto object-contain"
                    priority
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-border bg-[oklch(0.99_0.004_110)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Demo access</div>
              <div className="text-xs text-muted-foreground">
                Organization, email, and password are prefilled for the demo.
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSubmit();
                }}
                placeholder="Email"
                className="h-11 bg-white pl-9"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSubmit();
                }}
                placeholder="Password"
                className="h-11 bg-white pl-9"
              />
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canContinue}
              className="h-11 shrink-0 px-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
