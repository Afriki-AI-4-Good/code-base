export interface AgentSource {
  name: string;
  url: string;
}

interface AgentProfileSlice {
  org: string;
  prompt: string;
  newsSources?: string[];
  fundingSources?: string[];
  fundingCriteria?: {
    regions: string[];
    topics: string[];
  };
  wtgKeywords?: string[];
}

const NEWS_SOURCE_CATALOG: AgentSource[] = [
  { name: "Reuters Africa", url: "https://www.reuters.com/world/africa/" },
  { name: "Devex", url: "https://www.devex.com/news" },
  { name: "AllAfrica", url: "https://allafrica.com/" },
  {
    name: "DW Africa",
    url: "https://www.dw.com/en/top-stories/africa/s-12756",
  },
  {
    name: "The New Humanitarian",
    url: "https://www.thenewhumanitarian.org/africa",
  },
  { name: "Africa News", url: "https://www.africanews.com/" },
  { name: "BBC Africa", url: "https://www.bbc.com/news/world/africa" },
  { name: "BBC Afrique", url: "https://www.bbc.com/afrique" },
  { name: "Le Monde Afrique", url: "https://www.lemonde.fr/afrique/" },
  { name: "RFI Afrique", url: "https://www.rfi.fr/fr/afrique/" },
  { name: "ReliefWeb Burundi", url: "https://reliefweb.int/country/bdi" },
  { name: "Iwacu", url: "https://www.iwacu-burundi.org/" },
];

const FUNDING_SOURCE_CATALOG: AgentSource[] = [
  { name: "BMZ", url: "https://www.bmz.de/de/aktuelles/ausschreibungen" },
  {
    name: "EU Funding & Tenders",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
  },
  {
    name: "GIZ",
    url: "https://www.giz.de/en/workingwithgiz/bidding_procurement.html",
  },
  {
    name: "Stiftung Nord-Sued-Bruecken",
    url: "https://nord-sued-bruecken.de/foerderung.html",
  },
  {
    name: "Stiftung Nord-Süd-Brücken",
    url: "https://nord-sued-bruecken.de/foerderung.html",
  },
  {
    name: "Auswaertiges Amt",
    url: "https://www.auswaertiges-amt.de/en/aussenpolitik/themen/humanitaerehilfe/foerderung",
  },
  {
    name: "Auswärtiges Amt",
    url: "https://www.auswaertiges-amt.de/en/aussenpolitik/themen/humanitaerehilfe/foerderung",
  },
  {
    name: "Engagement Global",
    url: "https://www.engagement-global.de/de/aktuelles/ausschreibungen",
  },
  { name: "UN OCHA", url: "https://www.unocha.org/grants" },
  {
    name: "USAID",
    url: "https://www.usaid.gov/work-usaid/find-a-funding-opportunity",
  },
  {
    name: "Misereor",
    url: "https://www.misereor.de/ueber-misereor/evaluierung-beratung/ausschreibungen-fuer-gutachterinnen",
  },
  {
    name: "VENRO Newsletter",
    url: "https://venro.org/servicebereich/newsletter/",
  },
];

export function resolveNewsSources(labels: string[] = []): AgentSource[] {
  return resolveSources(labels, NEWS_SOURCE_CATALOG, [
    "ReliefWeb Burundi",
    "Iwacu",
    "BBC Afrique",
    "RFI Afrique",
  ]);
}

export function resolveFundingSources(labels: string[] = []): AgentSource[] {
  return resolveSources(labels, FUNDING_SOURCE_CATALOG, [
    "BMZ",
    "EU Funding & Tenders",
    "GIZ",
  ]);
}

export function buildNewsQuery(profile: AgentProfileSlice): string {
  const criteriaParts = [
    profile.prompt,
    ...(profile.fundingCriteria?.regions ?? []),
    ...(profile.fundingCriteria?.topics ?? []),
    ...(profile.wtgKeywords ?? []),
  ].filter(Boolean);
  const fallback =
    profile.org === "wtg"
      ? "animal welfare development cooperation NGO monitoring"
      : "Burundi education child protection health development cooperation";
  return uniqueWords(criteriaParts.join(" ") || fallback);
}

export function buildFundingQuery(profile: AgentProfileSlice): string {
  const regions = profile.fundingCriteria?.regions ?? [];
  const topics = profile.fundingCriteria?.topics ?? [];
  return uniqueWords(
    [
      "funding grants calls for proposals nonprofit NGO",
      profile.prompt,
      ...regions,
      ...topics,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function buildOrgProfile(profile: AgentProfileSlice): string {
  const criteria = profile.fundingCriteria;
  return [
    profile.prompt,
    criteria?.regions.length ? `Regions: ${criteria.regions.join(", ")}` : "",
    criteria?.topics.length ? `Topics: ${criteria.topics.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function resolveSources(
  labels: string[],
  catalog: AgentSource[],
  fallbackLabels: string[],
): AgentSource[] {
  const selected = labels
    .map((label) => resolveSourceLabel(label, catalog))
    .filter((source): source is AgentSource => source !== null);
  const sources = selected.length
    ? selected
    : fallbackLabels
        .map((label) => resolveSourceLabel(label, catalog))
        .filter((source): source is AgentSource => source !== null);
  return dedupeSources(sources);
}

function resolveSourceLabel(
  label: string,
  catalog: AgentSource[],
): AgentSource | null {
  const cleaned = label.trim();
  if (!cleaned) return null;
  if (looksLikeUrl(cleaned)) {
    return { name: nameFromUrl(cleaned), url: cleaned };
  }
  const normalized = normalizeLabel(cleaned);
  return (
    catalog.find((source) => normalizeLabel(source.name) === normalized) ?? null
  );
}

function dedupeSources(sources: AgentSource[]): AgentSource[] {
  const seen = new Set<string>();
  const unique: AgentSource[] = [];
  for (const source of sources) {
    if (seen.has(source.url)) continue;
    seen.add(source.url);
    unique.push(source);
  }
  return unique;
}

function looksLikeUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function nameFromUrl(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function normalizeLabel(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueWords(value: string): string {
  const words = value.split(/\s+/).filter(Boolean);
  return Array.from(new Set(words)).join(" ");
}
