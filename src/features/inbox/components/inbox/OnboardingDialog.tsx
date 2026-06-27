import {
  AlertTriangle,
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  Euro,
  FileText,
  Flame,
  Globe2,
  GripVertical,
  HandHeart,
  Heart,
  Image as ImageIcon,
  Languages,
  Link as LinkIcon,
  Mail,
  MapPin,
  Newspaper,
  Plus,
  SlidersHorizontal,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DEFAULT_EXTRAS,
  DEFAULT_OUTPUT_FIELDS,
  type DepartmentId,
  getDepartment,
  type OnboardingExtras,
  ORGS,
  type OrgId,
  type OutputFieldKey,
  type UserProfile,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const DEFAULT_ORG: OrgId = "bk";
const DEFAULT_DEPT: DepartmentId = "fundraising";

const NEWS_PRESETS = [
  "Reuters Africa",
  "Devex",
  "AllAfrica",
  "DW Africa",
  "The New Humanitarian",
  "Africa News",
  "BBC Africa",
  "Le Monde Afrique",
];
const FUNDING_PRESETS = [
  "EU Funding & Tenders",
  "BMZ",
  "GIZ",
  "Stiftung Nord-Süd-Brücken",
  "Auswärtiges Amt",
  "Engagement Global",
  "UN OCHA",
  "USAID",
];
const REGION_PRESETS = [
  "Burundi",
  "East Africa",
  "Sub-Saharan Africa",
  "Great Lakes",
  "Global",
];
const TOPIC_PRESETS = [
  "Education",
  "Child Protection",
  "Health",
  "WASH",
  "Livelihoods",
  "Climate",
];

type StepId = "org" | "news" | "format" | "funding" | "criteria" | "urgency";

const STEPS: {
  id: StepId;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "org",
    label: "Organization",
    sub: "Who you're briefing for",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "news",
    label: "News & Email",
    sub: "Your information inputs",
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    id: "format",
    label: "Layout",
    sub: "How items are displayed",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "funding",
    label: "Funding sources",
    sub: "Where you scout grants",
    icon: <HandHeart className="h-4 w-4" />,
  },
  {
    id: "criteria",
    label: "Criteria",
    sub: "What makes a grant a fit",
    icon: <SlidersHorizontal className="h-4 w-4" />,
  },
  {
    id: "urgency",
    label: "Urgency",
    sub: "Color-code thresholds",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
];

function getStep(index: number) {
  const step = STEPS[index];
  if (!step) throw new Error(`Unknown onboarding step: ${index}`);
  return step;
}

export function OnboardingDialog({
  open,
  initial,
  onComplete,
}: {
  open: boolean;
  initial?: UserProfile | null;
  onComplete: (p: UserProfile) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [org, setOrg] = useState<OrgId>(initial?.org ?? DEFAULT_ORG);
  const [dept] = useState<DepartmentId>(initial?.department ?? DEFAULT_DEPT);
  const [extras, setExtras] = useState<OnboardingExtras>({
    ...DEFAULT_EXTRAS,
    ...(initial ? extractExtras(initial) : {}),
    outputFormat: {
      ...DEFAULT_EXTRAS.outputFormat,
      ...(initial?.outputFormat ?? {}),
      fields: initial?.outputFormat?.fields?.length
        ? initial.outputFormat.fields
        : DEFAULT_OUTPUT_FIELDS,
    },
    urgency: {
      ...DEFAULT_EXTRAS.urgency,
      ...(initial?.urgency ?? {}),
    },
  });

  const step = getStep(stepIdx);
  const isLast = stepIdx === STEPS.length - 1;

  const update = <K extends keyof OnboardingExtras>(
    key: K,
    val: OnboardingExtras[K],
  ) => setExtras((e) => ({ ...e, [key]: val }));

  const handleNext = () => {
    if (isLast) {
      onComplete({
        org,
        department: dept,
        prompt: getDepartment(dept).defaultPrompt,
        ...extras,
      });
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        overlayClassName="fixed inset-0 z-50 bg-transparent backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        className="max-w-3xl p-0 overflow-hidden border border-white/50 bg-white shadow-2xl ring-1 ring-white/30"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-5 border-b border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {step.icon}
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {stepIdx + 1} of {STEPS.length}
                </div>
                <h2 className="text-lg font-semibold leading-tight">
                  {step.label}
                </h2>
                <div className="text-xs text-muted-foreground">{step.sub}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === stepIdx
                      ? "w-7 bg-primary"
                      : i < stepIdx
                        ? "w-2 bg-primary/60"
                        : "w-2 bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 min-h-[360px] max-h-[62vh] overflow-y-auto">
          {step.id === "org" && <OrgStep org={org} onChange={setOrg} />}
          {step.id === "news" && (
            <NewsStep
              sources={extras.newsSources}
              onSourcesChange={(v) => update("newsSources", v)}
              emailConnected={extras.emailConnected}
              emailAddress={extras.emailAddress ?? ""}
              onEmailChange={(connected, addr) => {
                update("emailConnected", connected);
                update("emailAddress", addr);
              }}
            />
          )}
          {step.id === "format" && (
            <FormatStep
              value={extras.outputFormat}
              onChange={(v) => update("outputFormat", v)}
            />
          )}
          {step.id === "funding" && (
            <FundingSourcesStep
              sources={extras.fundingSources}
              onChange={(v) => update("fundingSources", v)}
            />
          )}
          {step.id === "criteria" && (
            <CriteriaStep
              value={extras.fundingCriteria}
              onChange={(v) => update("fundingCriteria", v)}
            />
          )}
          {step.id === "urgency" && (
            <UrgencyStep
              value={extras.urgency}
              onChange={(v) => update("urgency", v)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-border/60 flex items-center justify-between bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="text-[11px] text-muted-foreground">
            You can edit these later in settings
          </div>
          <Button onClick={handleNext} size="sm" className="gap-1.5">
            {isLast ? (
              <>
                <Check className="h-4 w-4" />
                Finish
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function extractExtras(p: UserProfile): Partial<OnboardingExtras> {
  const { org: _o, department: _d, prompt: _p, ...rest } = p;
  return rest;
}

// ---------- Steps ----------

function OrgStep({
  org,
  onChange,
}: {
  org: OrgId;
  onChange: (o: OrgId) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Which organization are you briefing for?
      </p>
      <div className="grid grid-cols-2 gap-4">
        {ORGS.map((o) => {
          const active = org === o.id;
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => onChange(o.id)}
              className={cn(
                "group relative text-left rounded-2xl border p-5 transition-all",
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border bg-white hover:border-primary/40 hover:shadow-sm",
              )}
            >
              {active && (
                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold mb-3",
                  o.accent,
                )}
              >
                {o.id === "bk" ? (
                  <Heart className="h-5 w-5" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div className="text-base font-semibold break-words">
                {o.name}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mt-1 break-words">
                {o.description}
              </div>
            </button>
          );
        })}
      </div>
      <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Department (preset)
        </div>
        <div className="text-sm font-medium mt-0.5">
          {getDepartment(DEFAULT_DEPT).name}
        </div>
      </div>
    </div>
  );
}

function ChipList({
  items,
  selected,
  onToggle,
  onAdd,
}: {
  items: string[];
  selected: string[];
  onToggle: (s: string) => void;
  onAdd?: (s: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const all = useMemo(
    () => Array.from(new Set([...items, ...selected])),
    [items, selected],
  );
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {all.map((s) => {
          const on = selected.includes(s);
          return (
            <button
              type="button"
              key={s}
              onClick={() => onToggle(s)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all",
                on
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-white text-foreground hover:border-primary/40",
              )}
            >
              {on && <Check className="h-3 w-3" />}
              {s}
            </button>
          );
        })}
      </div>
      {onAdd && (
        <div className="flex gap-1.5">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add custom…"
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                onAdd(draft.trim());
                setDraft("");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-2"
            onClick={() => {
              if (draft.trim()) {
                onAdd(draft.trim());
                setDraft("");
              }
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function NewsStep({
  sources,
  onSourcesChange,
  emailConnected,
  emailAddress,
  onEmailChange,
}: {
  sources: string[];
  onSourcesChange: (s: string[]) => void;
  emailConnected: boolean;
  emailAddress: string;
  onEmailChange: (connected: boolean, addr: string) => void;
}) {
  const toggle = (s: string) =>
    onSourcesChange(
      sources.includes(s) ? sources.filter((x) => x !== s) : [...sources, s],
    );
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <SectionHeader
          icon={<Newspaper className="h-4 w-4" />}
          title="News sources"
          hint="Pick what you follow. Add your own."
        />
        <ChipList
          items={NEWS_PRESETS}
          selected={sources}
          onToggle={toggle}
          onAdd={(s) =>
            !sources.includes(s) && onSourcesChange([...sources, s])
          }
        />
      </section>

      <section className="space-y-3">
        <SectionHeader
          icon={<Mail className="h-4 w-4" />}
          title="Email connection"
          hint="Include relevant inbox emails in your brief."
        />
        <div className="flex gap-2">
          <Input
            value={emailAddress}
            onChange={(e) => onEmailChange(emailConnected, e.target.value)}
            placeholder="you@organization.org"
            className="h-10 text-sm"
          />
          <Button
            type="button"
            variant={emailConnected ? "secondary" : "outline"}
            size="sm"
            onClick={() => onEmailChange(!emailConnected, emailAddress)}
            className="h-10 shrink-0 gap-1.5 px-4"
          >
            {emailConnected ? (
              <>
                <Check className="h-3.5 w-3.5" /> Connected
              </>
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

// ---------- Layout / Output step (reorderable) ----------

const FIELD_META: Record<
  OutputFieldKey,
  { label: string; desc: string; icon: React.ReactNode }
> = {
  summary: {
    label: "Summary",
    desc: "AI summary of the item",
    icon: <AlignLeft className="h-4 w-4" />,
  },
  translation: {
    label: "Translation",
    desc: "Translated body",
    icon: <Languages className="h-4 w-4" />,
  },
  original: {
    label: "Original",
    desc: "Original-language excerpt",
    icon: <BookOpen className="h-4 w-4" />,
  },
  source: {
    label: "Source",
    desc: "Publisher or sender",
    icon: <Globe2 className="h-4 w-4" />,
  },
  date: {
    label: "Date",
    desc: "Publication / received date",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  url: {
    label: "URL",
    desc: "Link to the original source",
    icon: <LinkIcon className="h-4 w-4" />,
  },
  tags: {
    label: "Tags",
    desc: "Topics, regions, categories",
    icon: <Tag className="h-4 w-4" />,
  },
  image: {
    label: "Image",
    desc: "Cover image when available",
    icon: <ImageIcon className="h-4 w-4" />,
  },
};

function FormatStep({
  value,
  onChange,
}: {
  value: OnboardingExtras["outputFormat"];
  onChange: (v: OnboardingExtras["outputFormat"]) => void;
}) {
  const set = <K extends keyof OnboardingExtras["outputFormat"]>(
    k: K,
    v: OnboardingExtras["outputFormat"][K],
  ) => onChange({ ...value, [k]: v });

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...value.fields];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const current = next[idx];
    const target = next[j];
    if (!current || !target) return;
    next[idx] = target;
    next[j] = current;
    set("fields", next);
  };
  const toggleField = (idx: number) => {
    const next = value.fields.map((f, i) =>
      i === idx ? { ...f, enabled: !f.enabled } : f,
    );
    set("fields", next);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <SectionHeader
          icon={<FileText className="h-4 w-4" />}
          title="Information layout"
          hint="Drag-style reorder & toggle which fields appear per item. Order = display order."
        />
        <div className="rounded-xl border border-border bg-white divide-y divide-border overflow-hidden">
          {value.fields.map((f, idx) => {
            const meta = FIELD_META[f.key];
            return (
              <div
                key={f.key}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 transition-colors",
                  f.enabled ? "bg-white" : "bg-muted/40",
                )}
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === value.fields.length - 1}
                    className="h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    f.enabled
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      !f.enabled && "text-muted-foreground line-through",
                    )}
                  >
                    {meta.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {meta.desc}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground tabular-nums w-5 text-right">
                  {idx + 1}
                </div>
                <button
                  type="button"
                  onClick={() => toggleField(idx)}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors",
                    f.enabled ? "bg-primary" : "bg-muted",
                  )}
                  aria-label={f.enabled ? "Disable" : "Enable"}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                      f.enabled ? "left-[18px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Field label="Style">
          <SegGroup
            value={value.style}
            onChange={(v) => set("style", v as typeof value.style)}
            options={[
              { v: "bullets", label: "Bullets" },
              { v: "narrative", label: "Narrative" },
              { v: "executive", label: "Exec" },
            ]}
          />
        </Field>
        <Field label="Length per item">
          <SegGroup
            value={value.length}
            onChange={(v) => set("length", v as typeof value.length)}
            options={[
              { v: "short", label: "1 line" },
              { v: "medium", label: "2–3 lines" },
              { v: "long", label: "Detailed" },
            ]}
          />
        </Field>
        <Field label="Translate to">
          <SegGroup
            value={value.translateTo}
            onChange={(v) => set("translateTo", v as typeof value.translateTo)}
            options={[
              { v: "en", label: "English" },
              { v: "de", label: "Deutsch" },
            ]}
          />
        </Field>
      </section>
    </div>
  );
}

function FundingSourcesStep({
  sources,
  onChange,
}: {
  sources: string[];
  onChange: (s: string[]) => void;
}) {
  const toggle = (s: string) =>
    onChange(
      sources.includes(s) ? sources.filter((x) => x !== s) : [...sources, s],
    );
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<HandHeart className="h-4 w-4" />}
        title="Funding scouting sources"
        hint="Where do you currently search for calls and tenders?"
      />
      <ChipList
        items={FUNDING_PRESETS}
        selected={sources}
        onToggle={toggle}
        onAdd={(s) => !sources.includes(s) && onChange([...sources, s])}
      />
    </div>
  );
}

function CriteriaStep({
  value,
  onChange,
}: {
  value: OnboardingExtras["fundingCriteria"];
  onChange: (v: OnboardingExtras["fundingCriteria"]) => void;
}) {
  const set = <K extends keyof OnboardingExtras["fundingCriteria"]>(
    k: K,
    v: OnboardingExtras["fundingCriteria"][K],
  ) => onChange({ ...value, [k]: v });
  const toggleArr = (k: "regions" | "topics", s: string) => {
    const cur = value[k];
    set(
      k,
      cur.includes(s) ? cur.filter((x) => x !== s) : ([...cur, s] as never),
    );
  };
  const AMOUNT_MAX = 2_000_000;
  const AMOUNT_STEP = 5_000;
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <SectionHeader
          icon={<Euro className="h-4 w-4" />}
          title="Grant amount range"
          hint="Calls within this band are scored higher."
        />
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-xs text-muted-foreground">Min</div>
            <div className="text-sm font-semibold tabular-nums">
              €{value.minAmount.toLocaleString()}
            </div>
          </div>
          <Slider
            min={0}
            max={AMOUNT_MAX}
            step={AMOUNT_STEP}
            value={[value.minAmount]}
            onValueChange={(next) =>
              set(
                "minAmount",
                Math.min(next[0] ?? value.minAmount, value.maxAmount),
              )
            }
          />
          <div className="flex items-baseline justify-between mt-5 mb-3">
            <div className="text-xs text-muted-foreground">Max</div>
            <div className="text-sm font-semibold tabular-nums">
              €{value.maxAmount.toLocaleString()}
            </div>
          </div>
          <Slider
            min={0}
            max={AMOUNT_MAX}
            step={AMOUNT_STEP}
            value={[value.maxAmount]}
            onValueChange={(next) =>
              set(
                "maxAmount",
                Math.max(next[0] ?? value.maxAmount, value.minAmount),
              )
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader
          icon={<MapPin className="h-4 w-4" />}
          title="Eligible regions"
        />
        <ChipList
          items={REGION_PRESETS}
          selected={value.regions}
          onToggle={(s) => toggleArr("regions", s)}
        />
      </section>

      <section className="space-y-3">
        <SectionHeader
          icon={<Briefcase className="h-4 w-4" />}
          title="Topics of interest"
        />
        <ChipList
          items={TOPIC_PRESETS}
          selected={value.topics}
          onToggle={(s) => toggleArr("topics", s)}
        />
      </section>

      <Field
        label={
          <span className="flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5" /> Own contribution required
          </span>
        }
      >
        <SegGroup
          value={value.requireOwnContribution}
          onChange={(v) =>
            set(
              "requireOwnContribution",
              v as typeof value.requireOwnContribution,
            )
          }
          options={[
            { v: "any", label: "Any" },
            { v: "no", label: "Avoid" },
            { v: "ok", label: "OK" },
          ]}
        />
      </Field>
    </div>
  );
}

function UrgencyStep({
  value,
  onChange,
}: {
  value: OnboardingExtras["urgency"];
  onChange: (v: OnboardingExtras["urgency"]) => void;
}) {
  const set = <K extends keyof OnboardingExtras["urgency"]>(
    k: K,
    v: OnboardingExtras["urgency"][K],
  ) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Define what counts as Urgent, Relevant, or Information. These
        definitions are customizable but prefilled with formal defaults.
      </p>

      <div className="space-y-4">
        <DefinitionCard
          tone="urgent"
          icon={<Flame className="h-4 w-4" />}
          label="Urgent"
          value={value.urgentDefinition}
          onChange={(v) => set("urgentDefinition", v)}
        />
        <DefinitionCard
          tone="relevant"
          icon={<Bell className="h-4 w-4" />}
          label="Relevant"
          value={value.relevantDefinition}
          onChange={(v) => set("relevantDefinition", v)}
        />
        <DefinitionCard
          tone="information"
          icon={<FileText className="h-4 w-4" />}
          label="Information"
          value={value.informationDefinition}
          onChange={(v) => set("informationDefinition", v)}
        />
      </div>

      <section className="space-y-3">
        <SectionHeader
          icon={<Tag className="h-4 w-4" />}
          title="Always-urgent keywords"
          hint="Items containing these words are flagged urgent regardless of definition."
        />
        <KeywordEditor
          value={value.urgentKeywords}
          onChange={(v) => set("urgentKeywords", v)}
        />
      </section>
    </div>
  );
}

function DefinitionCard({
  tone,
  icon,
  label,
  value,
  onChange,
}: {
  tone: "urgent" | "relevant" | "information";
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const palette =
    tone === "urgent"
      ? { dot: "bg-red-500" }
      : tone === "relevant"
        ? { dot: "bg-amber-500" }
        : { dot: "bg-primary" };
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", palette.dot)} />
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
}

function KeywordEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((kw) => (
          <span
            key={kw}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-xs"
          >
            {kw}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== kw))}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. emergency"
          className="h-8 text-xs"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              draft.trim() &&
              !value.includes(draft.trim())
            ) {
              onChange([...value, draft.trim()]);
              setDraft("");
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => {
            if (draft.trim() && !value.includes(draft.trim())) {
              onChange([...value, draft.trim()]);
              setDraft("");
            }
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ---------- Atoms ----------

function SectionHeader({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function SegGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-white p-0.5">
      {options.map((o) => (
        <button
          type="button"
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-md transition-colors",
            value === o.v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
