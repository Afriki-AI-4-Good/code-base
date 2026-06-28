import type { AgentFundingResult, AgentNewsResult } from "./agent-mappers";

interface DemoAgentRunResponse<TResult> {
  runId: number;
  elapsedSeconds: number;
  results: TResult[];
  events: DemoAgentRunEvent[];
}

interface DemoAgentRunEvent {
  id: number;
  runId: number;
  sourceId: number | null;
  type: string;
  message: string;
  createdAt: string;
}

interface DemoAgentOptions {
  delayMs?: number;
  maxCandidates: number;
  signal?: AbortSignal;
}

const DEMO_FUNDING_RUN_ID = 9001;
const DEMO_NEWS_RUN_ID = 9002;
const DEFAULT_DEMO_DELAY_MS = 5500;

const wtgFundingResults: AgentFundingResult[] = [
  {
    fit_label: "Strong fit",
    title: "Animal Welfare and Development Cooperation Fund 2026",
    deadline: "2026-07-24",
    amount_range: "EUR 75,000-350,000",
    topic: "Animal Welfare, Development Cooperation, East Africa",
    funder: "International Foundation for Animal Welfare Partnerships",
    eligibility_criteria: [
      "Registered nonprofit organization in Germany",
      "International partner implementation allowed",
      "Animal welfare must be linked to community education or veterinary outreach",
    ],
    fit_reasons: [
      "Direct match for WTG international animal welfare and development cooperation work",
      "Supports project countries and partner-led implementation",
    ],
    missing_information: ["Co-funding requirement must be confirmed"],
    summary:
      "A new funding window supports animal welfare projects that combine veterinary outreach, community education, and local partner capacity building in East Africa.",
    source: "International Animal Welfare Partnerships",
    published: "2026-06-28",
    link_to_original:
      "https://demo.wtg.local/funding/animal-welfare-development-cooperation-2026",
    original_title: "Animal Welfare and Development Cooperation Fund 2026",
  },
  {
    fit_label: "Strong fit",
    title: "Companion Animal Welfare in Europe: Public Awareness Grants",
    deadline: "2026-08-15",
    amount_range: "EUR 25,000-120,000",
    topic: "Companion Animals, Puppy Trade, Public Awareness",
    funder: "European Companion Animal Welfare Trust",
    eligibility_criteria: [
      "EU-based civil society organizations may apply",
      "Campaigns must include digital outreach and policy recommendations",
    ],
    fit_reasons: [
      "Fits WTG monitoring around puppy trade and animal suffering on social media",
      "Supports public communication and advocacy work",
    ],
    missing_information: [],
    summary:
      "The trust funds campaigns addressing illegal puppy trade, online animal sales, and consumer awareness across Germany and neighboring countries.",
    source: "European Companion Animal Welfare Trust",
    published: "2026-06-27",
    link_to_original:
      "https://demo.wtg.local/funding/companion-animal-welfare-europe-2026",
    original_title: "Companion Animal Welfare in Europe",
  },
  {
    fit_label: "Possible fit",
    title: "Working Animals Resilience Grants for East Africa",
    deadline: "2026-09-05",
    amount_range: "EUR 40,000-180,000",
    topic: "Working Animals, Rural Livelihoods, East Africa",
    funder: "Rural Livelihoods and Animal Health Fund",
    eligibility_criteria: [
      "Projects must work with local animal health providers",
      "Evidence of community participation required",
    ],
    fit_reasons: [
      "Relevant to WTG topics around donkey welfare and rural livelihoods",
    ],
    missing_information: ["Eligible applicant countries need legal review"],
    summary:
      "The call backs projects protecting working animals in rural value chains, with a focus on donkeys, transport animals, and veterinary access.",
    source: "Rural Livelihoods and Animal Health Fund",
    published: "2026-06-25",
    link_to_original:
      "https://demo.wtg.local/funding/working-animals-east-africa-2026",
    original_title: "Working Animals Resilience Grants",
  },
  {
    fit_label: "Possible fit",
    title: "Rapid Response Grants for Animal Suffering on Social Platforms",
    deadline: "rolling",
    amount_range: "EUR 10,000-50,000",
    topic: "Social Media Monitoring, Animal Welfare, Advocacy",
    funder: "Digital Civic Response Fund",
    eligibility_criteria: [
      "Rapid response communication work must start within four weeks",
      "Coalition applications are welcome",
    ],
    fit_reasons: [
      "Relevant for WTG monitoring of animal suffering and viral abuse content",
    ],
    missing_information: [
      "Animal welfare organizations are not named explicitly",
    ],
    summary:
      "Rolling micro-grants support civil society teams responding to harmful viral content, platform policy failures, and urgent public education needs.",
    source: "Digital Civic Response Fund",
    published: "2026-06-26",
    link_to_original:
      "https://demo.wtg.local/funding/social-media-animal-welfare-rapid-response",
    original_title: "Rapid Response Grants for Platform Accountability",
  },
];

const wtgNewsResults: AgentNewsResult[] = [
  {
    ranking: "Urgent",
    title_de:
      "Investigation zu illegalem Welpenhandel gewinnt auf Instagram stark an Reichweite",
    summary_de:
      "Mehrere reichweitenstarke Accounts verbreiten eine Recherche zu mutmasslichem illegalem Welpenhandel mit Bezug zu grenzueberschreitenden Online-Verkaeufen. Das Thema entwickelt sich schnell und kann eine kurzfristige Kommunikationsreaktion erfordern.",
    translated_excerpt_de:
      "Die Recherche beschreibt Online-Verkaufsnetzwerke, fehlende Herkunftsnachweise und wachsenden Druck auf Plattformen.",
    source: "Google Alerts: WTG monitoring",
    published: "2026-06-28",
    link_to_original:
      "https://demo.wtg.local/news/puppy-trade-instagram-investigation",
    original_title:
      "Illegal puppy trade investigation gains traction on Instagram",
    relevance_reason:
      "Matches WTG monitoring for puppy trade, social media animal suffering, and Germany-facing communications.",
  },
  {
    ranking: "Relevant",
    title_de:
      "Ostafrika debattiert neue Massnahmen gegen den Handel mit Eselhaeuten",
    summary_de:
      "Regionale Medien berichten ueber neue Kontrollen im Eselhaut-Handel und die Folgen fuer Arbeitstiere und laendliche Haushalte. Tierschutzorganisationen fordern bessere Registrierung und veterinarmedizinische Versorgung.",
    translated_excerpt_de:
      "Die Debatte verbindet Tierschutz, Existenzsicherung und grenzueberschreitenden Handel.",
    source: "Regional Animal Welfare Digest",
    published: "2026-06-27",
    link_to_original:
      "https://demo.wtg.local/news/donkey-hide-trade-east-africa",
    original_title: "East Africa debates donkey-hide trade restrictions",
    relevance_reason:
      "Relevant to WTG international animal welfare and working animal monitoring.",
  },
  {
    ranking: "Relevant",
    title_de: "EU-Parlament fordert strengere Regeln fuer lange Tiertransporte",
    summary_de:
      "Ein Ausschuss des EU-Parlaments fordert kuerzere Transportzeiten, bessere Kontrollen und digitale Nachweise fuer Tiertransporte. Deutsche Verbaende bereiten Stellungnahmen vor.",
    translated_excerpt_de:
      "Die Initiative kann Auswirkungen auf WTG-Advocacy zu Nutztieren und politischer Kommunikation haben.",
    source: "EU Policy Monitor",
    published: "2026-06-26",
    link_to_original:
      "https://demo.wtg.local/news/eu-animal-welfare-transport-rules",
    original_title: "EU lawmakers call for stricter animal transport rules",
    relevance_reason:
      "Fits WTG Germany and EU animal welfare policy monitoring.",
  },
  {
    ranking: "Information",
    title_de:
      "Neue Tollwut-Impfpartnerschaften in Projektlaendern angekuendigt",
    summary_de:
      "Veterinaerbehoerden und lokale NGOs starten neue Impfkampagnen fuer Hunde in mehreren Projektregionen. Die Programme setzen auf Schulbesuche und mobile Teams.",
    translated_excerpt_de:
      "Die Initiative bietet Anknuepfungspunkte fuer Bildung, Praevention und lokale Partnerarbeit.",
    source: "Global Veterinary Brief",
    published: "2026-06-24",
    link_to_original:
      "https://demo.wtg.local/news/rabies-vaccination-partnerships",
    original_title: "New rabies vaccination partnerships announced",
    relevance_reason:
      "Useful background for WTG animal health and partner program monitoring.",
  },
  {
    ranking: "Urgent",
    title_de: "Plattformen pruefen neue Regeln gegen Videos mit Tierleid",
    summary_de:
      "Mehrere Social-Media-Plattformen testen strengere Meldemechanismen fuer Inhalte, die Tierleid zeigen oder zur Nachahmung animieren. NGOs kritisieren fehlende Transparenz bei der Durchsetzung.",
    translated_excerpt_de:
      "Das Thema betrifft Kampagnen, Monitoring und moegliche Forderungen an Plattformbetreiber.",
    source: "Digital Policy Watch",
    published: "2026-06-28",
    link_to_original:
      "https://demo.wtg.local/news/animal-suffering-social-media-platforms",
    original_title: "Platforms review rules on animal suffering content",
    relevance_reason:
      "Direct match for WTG monitoring of animal welfare on social media.",
  },
];

export function getDemoAgentHealth() {
  return {
    ok: true,
    status: "demo_wtg",
  };
}

export async function runDemoFundingAgent(
  options: DemoAgentOptions,
): Promise<DemoAgentRunResponse<AgentFundingResult>> {
  await waitForDemoDelay(options);
  return createDemoResponse(
    DEMO_FUNDING_RUN_ID,
    wtgFundingResults.slice(0, options.maxCandidates),
    "Funding demo fixtures loaded for WTG.",
  );
}

export async function runDemoNewsAgent(
  options: DemoAgentOptions,
): Promise<DemoAgentRunResponse<AgentNewsResult>> {
  await waitForDemoDelay(options);
  return createDemoResponse(
    DEMO_NEWS_RUN_ID,
    wtgNewsResults.slice(0, options.maxCandidates),
    "News demo fixtures loaded for WTG.",
  );
}

async function waitForDemoDelay(options: DemoAgentOptions) {
  const delayMs = options.delayMs ?? DEFAULT_DEMO_DELAY_MS;
  if (delayMs <= 0) return;

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delayMs);
    options.signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function createDemoResponse<TResult>(
  runId: number,
  results: TResult[],
  loadedMessage: string,
): DemoAgentRunResponse<TResult> {
  return {
    runId,
    elapsedSeconds: DEFAULT_DEMO_DELAY_MS / 1000,
    results,
    events: createDemoEvents(runId, loadedMessage, results.length),
  };
}

function createDemoEvents(
  runId: number,
  loadedMessage: string,
  resultCount: number,
): DemoAgentRunEvent[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: runId * 10 + 1,
      runId,
      sourceId: null,
      type: "demo",
      message: "WTG demo mode active. Python agents were not called.",
      createdAt,
    },
    {
      id: runId * 10 + 2,
      runId,
      sourceId: null,
      type: "write",
      message: `${loadedMessage} ${resultCount} items ready for inbox write.`,
      createdAt,
    },
    {
      id: runId * 10 + 3,
      runId,
      sourceId: null,
      type: "finished",
      message: "Demo retrieval completed.",
      createdAt,
    },
  ];
}
