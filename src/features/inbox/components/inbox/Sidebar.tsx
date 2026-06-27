import {
  Archive,
  Banknote,
  FileText,
  Inbox,
  Newspaper,
  Settings,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserProfile } from "@/lib/profile";
import { getOrg } from "@/lib/profile";
import { cn } from "@/lib/utils";

const items = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "funding", label: "Funding", icon: Banknote },
  { id: "news", label: "News", icon: Newspaper },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "archive", label: "Archive", icon: Archive },
];

export function Sidebar({
  profile,
  onChangeProfile,
  active: activeProp,
  onActiveChange,
}: {
  profile: UserProfile | null;
  onChangeProfile: () => void;
  active?: string;
  onActiveChange?: (id: string) => void;
}) {
  const [internalActive, setInternalActive] = useState("inbox");
  const active = activeProp ?? internalActive;
  const setActive = (id: string) => {
    if (onActiveChange) onActiveChange(id);
    else setInternalActive(id);
  };
  const org = profile ? getOrg(profile.org) : null;
  return (
    <aside className="flex h-screen w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-3">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onChangeProfile}
              className={cn(
                "mb-3 grid h-9 w-9 place-items-center rounded-lg font-bold text-sm transition-colors",
                org ? org.accent : "bg-primary text-primary-foreground",
              )}
              aria-label="Change profile"
            >
              {org ? org.initials : "BK"}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {org ? `${org.name} · change profile` : "Choose profile"}
          </TooltipContent>
        </Tooltip>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
        <div className="mt-auto flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onChangeProfile}
                className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                aria-label="Switch role"
              >
                <UserCog className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Switch organization / role
            </TooltipContent>
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
