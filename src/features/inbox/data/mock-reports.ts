export type ReportType = "funding" | "project" | "financial";
export type ReportPeriod = "week" | "month" | "quarter" | "year";

export interface ReportKPI {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}

export interface ReportEntry {
  id: string;
  type: ReportType;
  period: ReportPeriod;
  title: string;
  dek: string;
  summary: string;
  author: string;
  date: string; // ISO
  readMinutes: number;
  coverUrl?: string;
  tag: string;
  kpis: ReportKPI[];
  highlights: string[];
  status: "draft" | "ready" | "shared";
  featured?: boolean;
}

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1400&q=70`;

export const mockReports: ReportEntry[] = [
  {
    id: "r-cover-q2",
    type: "project",
    period: "quarter",
    title: "Q2 Field Report: Schools, Shelters & Sustained Outcomes",
    dek: "Three months of measurable progress across 14 communities in Burundi.",
    summary:
      "Across April-June, Burundikids e.V. reached 12,480 children with steady programming. Enrolment rose in every region, while a new mentor model lifted retention to 91%. This issue zooms into the data, the stories, and what shifts in Q3.",
    author: "Programs Team",
    date: "2026-06-22",
    readMinutes: 9,
    coverUrl: img("photo-1488521787991-ed7bbaae773c"),
    tag: "Cover Story",
    kpis: [
      {
        label: "Children reached",
        value: "12,480",
        delta: "+8.4%",
        trend: "up",
      },
      { label: "Retention rate", value: "91%", delta: "+3 pts", trend: "up" },
      { label: "Active sites", value: "14", delta: "+2", trend: "up" },
      { label: "Cost / child", value: "€38", delta: "−€4", trend: "down" },
    ],
    highlights: [
      "New mentor cohort onboarded in Gitega and Ngozi",
      "WASH retrofit completed in 6 schools ahead of rainy season",
      "Two regional partners signed multi-year MoUs",
    ],
    status: "ready",
    featured: true,
  },
  {
    id: "r-fund-jun",
    type: "funding",
    period: "month",
    title: "Funding Pipeline · June",
    dek: "11 active calls, €1.42M in motion, two LOIs converted.",
    summary:
      "June closed with two converted LOIs (BMZ Civic Action and EU NDICI Pilot) and a strengthened pipeline weighted toward education and child protection.",
    author: "Fundraising",
    date: "2026-06-25",
    readMinutes: 4,
    coverUrl: img("photo-1554224155-6726b3ff858f"),
    tag: "Funding",
    kpis: [
      { label: "In pipeline", value: "€1.42M", delta: "+€220k", trend: "up" },
      { label: "Active calls", value: "11" },
      { label: "Win rate", value: "38%", delta: "+5 pts", trend: "up" },
      { label: "Upcoming deadlines", value: "4" },
    ],
    highlights: [
      "BMZ Civic Action LOI → full proposal invited",
      "EU NDICI Pilot shortlisted, decision August",
      "Two Swiss foundations entered first contact",
    ],
    status: "ready",
  },
  {
    id: "r-proj-jun",
    type: "project",
    period: "month",
    title: "Programs Monthly · June",
    dek: "Attendance steady at 94%, two schools transition to phase II.",
    summary:
      "Monthly programming held strong attendance through exam season, while phase II planning kicked off in Bujumbura Rural and Muyinga.",
    author: "Programs Team",
    date: "2026-06-24",
    readMinutes: 5,
    coverUrl: img("photo-1497486751825-1233686d5d80"),
    tag: "Programs",
    kpis: [
      { label: "Attendance", value: "94%", delta: "+1 pt", trend: "up" },
      { label: "Schools", value: "14" },
      { label: "Volunteers", value: "186", delta: "+22", trend: "up" },
      { label: "Incidents", value: "0", trend: "flat" },
    ],
    highlights: [
      "Phase II planning began at two sites",
      "Teacher training: 48 educators certified",
      "New psychosocial protocol piloted",
    ],
    status: "ready",
  },
  {
    id: "r-fin-jun",
    type: "financial",
    period: "month",
    title: "Finance & Donations · June",
    dek: "Inflows +12% vs. May, runway extended to 11 months.",
    summary:
      "Donations grew across recurring and one-time channels, while operational spend stayed within 96% of budget.",
    author: "Finance",
    date: "2026-06-26",
    readMinutes: 3,
    coverUrl: img("photo-1554224154-26032cdc0c39"),
    tag: "Finance",
    kpis: [
      { label: "Inflows", value: "€184k", delta: "+12%", trend: "up" },
      { label: "Spend vs. budget", value: "96%", trend: "flat" },
      { label: "Recurring donors", value: "1,284", delta: "+47", trend: "up" },
      { label: "Runway", value: "11 mo", delta: "+1 mo", trend: "up" },
    ],
    highlights: [
      "Year-mid campaign exceeded target by 8%",
      "Two corporate matching gifts secured",
      "Audit prep on track for July",
    ],
    status: "ready",
  },
  {
    id: "r-week-26",
    type: "project",
    period: "week",
    title: "Weekly Pulse · Week 26",
    dek: "Field signals, partner updates, and one to watch.",
    summary:
      "A quiet but productive week. Highlights: Ngozi mentor cohort began, BMZ confirmed LOI advance, one media mention on national radio.",
    author: "Comms",
    date: "2026-06-26",
    readMinutes: 2,
    coverUrl: img("photo-1531206715517-5c0ba140b2b8"),
    tag: "Weekly",
    kpis: [
      { label: "Signals", value: "23" },
      { label: "Media mentions", value: "4", delta: "+2", trend: "up" },
      { label: "Field reports", value: "9" },
    ],
    highlights: [
      "Ngozi mentor cohort kickoff",
      "BMZ LOI advanced",
      "Radio Isanganiro national feature",
    ],
    status: "ready",
  },
  {
    id: "r-fund-q2",
    type: "funding",
    period: "quarter",
    title: "Grants Quarterly · Q2",
    dek: "Diversified pipeline, two anchor wins, one strategic decline.",
    summary:
      "Q2 closed with €640k secured across four grants. A deliberate decline on a misaligned corporate call freed capacity for two child-protection submissions.",
    author: "Grant Management",
    date: "2026-06-20",
    readMinutes: 6,
    coverUrl: img("photo-1450101499163-c8848c66ca85"),
    tag: "Funding",
    kpis: [
      { label: "Secured", value: "€640k", delta: "+€180k", trend: "up" },
      { label: "Submitted", value: "9" },
      { label: "Pending", value: "5" },
      { label: "Hit rate", value: "44%", delta: "+6 pts", trend: "up" },
    ],
    highlights: [
      "GIZ multi-year grant confirmed",
      "Misaligned corporate call declined",
      "Two child-protection submissions in review",
    ],
    status: "ready",
  },
  {
    id: "r-fin-q2",
    type: "financial",
    period: "quarter",
    title: "Donations Quarterly · Q2",
    dek: "Recurring base grows steadily, mid-year campaign delivers.",
    summary:
      "Recurring donor base crossed 1,250, the mid-year campaign exceeded target, and a corporate matching partnership formalised.",
    author: "Finance",
    date: "2026-06-21",
    readMinutes: 5,
    coverUrl: img("photo-1607863680198-23d4b2565df0"),
    tag: "Finance",
    kpis: [
      { label: "Total inflows", value: "€512k", delta: "+9%", trend: "up" },
      { label: "Recurring share", value: "62%", delta: "+4 pts", trend: "up" },
      { label: "Avg. gift", value: "€84" },
      { label: "Retention", value: "88%", delta: "+2 pts", trend: "up" },
    ],
    highlights: [
      "1,284 recurring donors",
      "Mid-year campaign +8% over target",
      "Corporate match partnership signed",
    ],
    status: "ready",
  },
  {
    id: "r-year-2025",
    type: "project",
    period: "year",
    title: "Annual Report 2025 · Snapshot",
    dek: "A year of consolidation: deeper roots, sharper measurement.",
    summary:
      "2025 was defined by quality over expansion: tighter measurement, stronger partner trust, and a fully audited financial year.",
    author: "Management",
    date: "2026-01-15",
    readMinutes: 12,
    coverUrl: img("photo-1509099836639-18ba1795216d"),
    tag: "Annual",
    kpis: [
      { label: "Children reached", value: "41,200", delta: "+6%", trend: "up" },
      { label: "Total budget", value: "€2.1M" },
      { label: "Program ratio", value: "84%", delta: "+2 pts", trend: "up" },
      { label: "Partners", value: "27" },
    ],
    highlights: [
      "Clean audit, no findings",
      "Two new regional hubs",
      "Theory of Change refreshed",
    ],
    status: "shared",
  },
];
