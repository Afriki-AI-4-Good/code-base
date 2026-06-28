import {
  Banknote,
  Bot,
  FileText,
  Inbox,
  LogOut,
  Newspaper,
  PanelsTopLeft,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LoginSession, UserProfile } from "@/lib/profile";
import { getOrg } from "@/lib/profile";
import { cn } from "@/lib/utils";

const primaryItem = { id: "inbox", label: "Inbox", icon: Inbox };

const items = [
  { id: "agent", label: "Afriki AI Agent", icon: Bot },
  { id: "funding", label: "Funding", icon: Banknote },
  { id: "news", label: "News", icon: Newspaper },
  { id: "reports", label: "Reports", icon: FileText },
];

const experimentalItem = {
  id: "triage",
  label: "Triage Lab",
  icon: PanelsTopLeft,
};

export function Sidebar({
  profile,
  session,
  onChangeProfile,
  onLogout,
  active: activeProp,
  onActiveChange,
}: {
  profile: UserProfile | null;
  session: LoginSession;
  onChangeProfile: () => void;
  onLogout: () => void;
  active?: string;
  onActiveChange?: (id: string) => void;
}) {
  const [internalActive, setInternalActive] = useState("inbox");
  const active = activeProp ?? internalActive;
  const setActive = (id: string) => {
    if (onActiveChange) onActiveChange(id);
    else setInternalActive(id);
  };
  const org = getOrg(profile?.org ?? session.org);
  return (
    <aside className="flex h-screen w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-3">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onChangeProfile}
              className={cn(
                "mb-3 grid h-9 w-9 place-items-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-border transition-colors hover:bg-accent/40",
                org.accent,
              )}
              aria-label="Change profile"
            >
              <Image
                src={org.logoSrc}
                alt={org.logoAlt}
                width={org.id === "bk" ? 42 : 30}
                height={org.id === "bk" ? 14 : 30}
                className="max-h-7 w-auto object-contain"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {org.name} · {session.username}
          </TooltipContent>
        </Tooltip>
        <NavButton
          item={primaryItem}
          active={active}
          onSelect={setActive}
          primary
        />
        <div className="my-2 h-px w-8 bg-border" />
        {items.map((item) => {
          return (
            <NavButton
              key={item.id}
              item={item}
              active={active}
              onSelect={setActive}
            />
          );
        })}
        <div className="mt-auto flex flex-col gap-1">
          <NavButton
            item={experimentalItem}
            active={active}
            onSelect={setActive}
            experimental
          />
          <div className="my-1 h-px w-8 bg-border" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onLogout}
                className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}

function NavButton({
  item,
  active,
  onSelect,
  primary,
  experimental,
}: {
  item: { id: string; label: string; icon: typeof Inbox };
  active: string;
  onSelect: (id: string) => void;
  primary?: boolean;
  experimental?: boolean;
}) {
  const Icon = item.icon;
  const isActive = active === item.id;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(item.id)}
          className={cn(
            "relative grid h-10 w-10 place-items-center rounded-lg transition-colors",
            primary &&
              "mb-1 h-11 w-11 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90",
            primary &&
              isActive &&
              "after:absolute after:-right-[9px] after:top-1/2 after:h-7 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-primary",
            !primary &&
              !experimental &&
              (isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"),
            experimental &&
              (isActive
                ? "bg-[oklch(0.97_0.028_32)] text-[oklch(0.45_0.1_32)] ring-1 ring-[oklch(0.86_0.055_32)]"
                : "text-muted-foreground hover:bg-[oklch(0.98_0.018_32)] hover:text-[oklch(0.45_0.1_32)]"),
          )}
          aria-label={item.label}
        >
          <Icon className={cn(primary ? "h-5.5 w-5.5" : "h-5 w-5")} />
          {experimental && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.105_32)]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {item.label}
        {experimental ? " · Experimental" : ""}
        {primary ? " · Primary workspace" : ""}
      </TooltipContent>
    </Tooltip>
  );
}
