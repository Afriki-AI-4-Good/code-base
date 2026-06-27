"use client";

import { ArrowLeft } from "lucide-react";
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
  const [username, setUsername] = useState("");
  const canContinue = normalizeUsername(username).length > 0;

  const handleSubmit = () => {
    if (!canContinue) return;
    onLogin({ org, username: normalizeUsername(username) });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[oklch(0.985_0.005_145)] px-4 text-foreground">
      <div className="w-full max-w-3xl rounded-2xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
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

        <div className="grid gap-4 md:grid-cols-2">
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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            placeholder="Username"
            className="h-11 bg-white"
          />
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
  );
}
