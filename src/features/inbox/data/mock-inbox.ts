import type { InboxEntry } from "@/types/inbox";

const imageUnicefEducation =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80";
const imageEcwBurundi =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
const imageClimateEducation =
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80";
const imagePuppyTrade =
  "https://www.tierschutzbund.de/fileadmin/_processed_/7/c/csm_Golden_Retriever_Welpen_Transportbox_Tierheim_Welpenhandel_c_Armin_Lerch_dcb050605f.jpg";
const imageAnimalProtection =
  "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80";

export const mockInbox: InboxEntry[] = [
  {
    id: "1",
    priority: "relevant",
    category: "funding",
    title: "World Bank: Human Capital Development Project in Burundi",
    date: "2024-07-30",
    source: "World Bank",
    summary:
      "The World Bank announced a human-capital project for Burundi focused on nutrition, healthcare, and basic education services. The release says the project is expected to benefit 13.2 million people over five years, including refugees and host communities, and includes a record US$227.6 million package for Burundi.",
    deadline: "2024-07-30",
    amountRange: "US$227.6 million",
    topics: ["Basic Education", "Health", "Nutrition", "Refugees"],
    funder: "World Bank IDA and Global Partnership for Education trust fund",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Public investment programme, not a direct NGO call. Track for partnership and implementation opportunities.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "World Bank announcement", date: "2024-07-30" },
      {
        kind: "decision",
        label: "Financing package announced",
        date: "2024-07-30",
      },
      {
        kind: "kickoff",
        label: "Five-year implementation window",
        date: "2024-08-01",
      },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.worldbank.org/en/news/press-release/2024/07/30/a-three-in-one-project-to-foster-human-capital-development-in-burundi-afe",
      deadlineLabel: "Programme announcement",
      confidence: 0.95,
      impactAreas: ["education", "health", "nutrition"],
      recommendedAction:
        "Track implementing partners and procurement notices connected to school and health-service delivery.",
      keyFacts: [
        "Expected reach: 13.2 million people over five years.",
        "Financing package: US$200 million IDA grant plus US$27.6 million GPE trust-fund funding.",
      ],
    },
  },
  {
    id: "2",
    priority: "relevant",
    category: "funding",
    title: "Education Cannot Wait: Burundi Multi-Year Resilience Programme",
    date: "2021-12-31",
    source: "Education Cannot Wait",
    summary:
      "Education Cannot Wait announced US$12 million in catalytic seed funding for Burundi's first Multi-Year Resilience Programme. The programme is coordinated with the Government of Burundi and consortia led by World Vision International and UNICEF, with a target of reaching vulnerable children affected by crisis, displacement, climate shocks, and COVID-19.",
    deadline: "2021-12-31",
    amountRange:
      "US$12 million catalytic grant; US$18 million additional target",
    topics: ["Education in Emergencies", "Displacement", "Climate Resilience"],
    funder: "Education Cannot Wait",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Programme funding through consortia; useful for partnership mapping and education-in-emergencies alignment.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Grant announced", date: "2021-12-31" },
      { kind: "kickoff", label: "Three-year MYRP rollout", date: "2022-01-01" },
      {
        kind: "decision",
        label: "Additional financing target",
        date: "2024-12-31",
      },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.educationcannotwait.org/news-stories/press-releases/education-cannot-wait-announces-us12-million-catalytic-grant-multi-year",
      deadlineLabel: "Historical MYRP grant",
      confidence: 0.96,
      fitScore: 82,
      recommendedAction:
        "Use as a real reference programme for education-in-emergencies proposals and partner landscape analysis.",
      keyFacts: [
        "Seed funding: US$12 million.",
        "Fully funded target reach: more than 300,000 children and adolescents.",
      ],
    },
  },
  {
    id: "3",
    priority: "information",
    category: "funding",
    title: "WPHF Call for Proposals in Burundi",
    date: "2021-06-29",
    source: "Women's Peace & Humanitarian Fund",
    summary:
      "The Women's Peace & Humanitarian Fund opened a Burundi call for local civil society organizations led by and working with women and girls. The call supported women's participation in conflict prevention and institutional capacity for women, peace and security organizations.",
    deadline: "2021-08-13",
    amountRange:
      "US$2,500-30,000 institutional; US$30,000-200,000 programmatic",
    topics: ["Women & Girls", "Civil Society", "Peacebuilding"],
    funder: "Women's Peace & Humanitarian Fund",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Past call, retained as a realistic example of local-CSO funding streams in Burundi.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Call published", date: "2021-06-29" },
      { kind: "deadline", label: "Application deadline", date: "2021-08-13" },
      {
        kind: "decision",
        label: "Selection and contracting",
        date: "2021-10-01",
      },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://wphfund.org/call-for-proposals-in-burundi/",
      deadlineLabel: "Closed call",
      confidence: 0.94,
      fitScore: 64,
      recommendedAction:
        "Keep as a template for identifying future local-CSO windows and gender-focused partnership opportunities.",
    },
  },
  {
    id: "4",
    priority: "relevant",
    category: "news",
    title: "UNICEF Burundi: Every child has the right to quality education",
    date: "2019-12-04",
    source: "UNICEF Burundi",
    summary:
      "UNICEF's Burundi education programme page highlights strong gains in primary schooling while pointing to dropout among adolescents, household poverty, early pregnancy, school violence, low learning time, and the need for teacher training, school construction, and back-to-school support.",
    imageUrl: imageClimateEducation,
    location: {
      name: "Nyanza-Lac, Burundi",
      coords: [29.6, -4.34],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.unicef.org/burundi/education",
      confidence: 0.96,
      monitoringTheme: "Education access and quality in Burundi",
      suggestedUse:
        "Use as the baseline education-context card for proposals and monitoring briefs.",
      keyFacts: [
        "Gross enrollment for children aged 6 to 11 was reported at 119.6% in 2018.",
        "UNICEF identifies teacher training, school construction, and back-to-school campaigns as support areas.",
      ],
    },
  },
  {
    id: "5",
    priority: "urgent",
    category: "report",
    title: "UNICEF Burundi Situation Report No. 10: flooded schools supported",
    translatedFrom: "English",
    date: "2025-01-31",
    source: "UNICEF Situation Report",
    summary:
      "UNICEF reported support to 14 schools in Mutimbuzi Commune, Rural Bujumbura province, that were severely flooded or damaged by strong winds. The support included chalk supplies so 12,768 learners could continue education without disruption.",
    originalLanguage: "English",
    sender: "UNICEF Burundi Country Office",
    originalText:
      "UNICEF supported 14 schools in Mutimbuzi Commune, Rural Bujumbura province, severely flooded or having suffered roof damage due to strong winds. This support included 3,151 boxes of chalk for 12,768 learners.",
    location: {
      name: "Mutimbuzi, Burundi",
      coords: [29.32, -3.28],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.unicef.org/media/168361/file/Burundi-Humanitarian-SitRep-31-January-2025.pdf.pdf",
      confidence: 0.93,
      monitoringTheme: "Flood-damaged schools and learning continuity",
      recommendedAction:
        "Flag for emergency education, WASH, and school-supplies planning in Bujumbura Rural.",
      keyFacts: [
        "14 schools supported in Mutimbuzi.",
        "12,768 learners targeted for uninterrupted education.",
      ],
    },
  },
  {
    id: "6",
    priority: "urgent",
    category: "report",
    title: "UNICEF Burundi Humanitarian Situation Report No. 9",
    translatedFrom: "English",
    date: "2024-12-31",
    source: "ReliefWeb / UNICEF",
    summary:
      "UNICEF's 2024 Burundi humanitarian reporting notes the impact of El Nino-related floods and displacement, including affected school children, cholera risks, and emergency support to learners in flooded areas.",
    originalLanguage: "English",
    sender: "UNICEF Burundi via ReliefWeb",
    originalText:
      "Situation reports provide updates on the humanitarian situation, needs of children, UNICEF response, and funding requirements in Burundi.",
    location: {
      name: "Gatumba, Burundi",
      coords: [29.26, -3.31],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://reliefweb.int/report/burundi/unicef-burundi-humanitarian-situation-report-no-9-december-2024",
      confidence: 0.9,
      monitoringTheme:
        "Floods, displacement, cholera risk, and education disruption",
      recommendedAction:
        "Keep in urgent queue for emergency-education and health/WASH coordination.",
      keyFacts: [
        "UNICEF reporting links floods and displacement to education disruption.",
        "Learning-material and temporary-learning-space support appears in the 2024 response.",
      ],
    },
  },
  {
    id: "7",
    priority: "relevant",
    category: "news",
    title: "Education Cannot Wait: US$12 million catalytic grant for Burundi",
    date: "2021-12-31",
    source: "Education Cannot Wait",
    summary:
      "ECW announced catalytic seed funding for a Multi-Year Resilience Programme in Burundi. The programme was designed for returnee, internally displaced, and other vulnerable children, with pre-primary, primary, and secondary education components.",
    imageUrl: imageEcwBurundi,
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.educationcannotwait.org/news-stories/press-releases/education-cannot-wait-announces-us12-million-catalytic-grant-multi-year",
      confidence: 0.96,
      monitoringTheme: "Education in emergencies and resilience programming",
      suggestedUse:
        "Use in fundraising narratives about crisis-affected learners and resilience programming.",
      keyFacts: [
        "US$12 million catalytic seed funding.",
        "Programme seeks to mobilize an additional US$18 million.",
      ],
    },
  },
  {
    id: "8",
    priority: "information",
    category: "report",
    title: "UNICEF Burundi Situation Reports 2018-2026 index",
    translatedFrom: "English",
    date: "2026-05-31",
    source: "UNICEF Humanitarian Action for Children",
    summary:
      "UNICEF's Burundi situation-report index lists regular situation reports through 2026, including monthly reports and flash updates on Burundian returnees and DRC refugee impacts.",
    originalLanguage: "English",
    sender: "UNICEF Humanitarian Action for Children",
    originalText:
      "Situation reports are UNICEF's main reporting tool to monitor humanitarian response and needs of children in Burundi.",
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.unicef.org/appeals/burundi/situation-reports",
      confidence: 0.95,
      monitoringTheme: "Humanitarian situation-report watchlist",
      recommendedAction:
        "Use this index as the live source for replacing future static humanitarian mock reports.",
    },
  },
  {
    id: "9",
    priority: "relevant",
    category: "report",
    title: "IOM Burundi Crisis Response Plan 2024-2026",
    translatedFrom: "English",
    date: "2026-01-01",
    source: "IOM Crisis Response",
    summary:
      "IOM's Burundi Crisis Response Plan frames natural hazards, especially floods, erratic rainfall, Lake Tanganyika water-level rise, and hydric stress as key drivers of crisis and displacement in Burundi.",
    originalLanguage: "English",
    sender: "International Organization for Migration",
    originalText:
      "Natural hazards, most notably floods, erratic rainfall patterns, lake level rise, and hydric stress exacerbated by climate change, are driving humanitarian needs in Burundi.",
    location: {
      name: "Lake Tanganyika, Burundi",
      coords: [29.25, -3.75],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://crisisresponse.iom.int/response/burundi-crisis-response-plan-2024-2026",
      confidence: 0.92,
      monitoringTheme: "Climate hazards, floods, displacement, and mobility",
      suggestedUse:
        "Useful for board-level risk monitoring and emergency-preparedness fundraising.",
    },
  },
  {
    id: "10",
    priority: "urgent",
    category: "news",
    title: "German Animal Welfare Federation: illegal puppy trade continues",
    translatedFrom: "German",
    date: "2024-03-26",
    source: "Deutscher Tierschutzbund",
    summary:
      "The Deutscher Tierschutzbund reported that new figures show illegal puppy trade continues, with animal shelters and transport controls still encountering puppies affected by poor breeding and trade conditions.",
    imageUrl: imagePuppyTrade,
    location: {
      name: "Bonn, Germany",
      coords: [7.0982, 50.7374],
      countryId: "276",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.tierschutzbund.de/en/about-us/news/press/notification/new-figures-show-illegal-puppy-trade-continues-unabated/",
      confidence: 0.9,
      monitoringTheme: "Animal welfare in Germany: puppy trade",
      suggestedUse:
        "Same-day press-monitoring item for WTG communications and campaign planning.",
      keyFacts: [
        "Real press item from Deutscher Tierschutzbund.",
        "Topic maps to puppy trade and companion-animal welfare monitoring.",
      ],
    },
  },
  {
    id: "11",
    priority: "information",
    category: "news",
    title: "World Animal Protection Global Review 2024",
    date: "2024-12-01",
    source: "World Animal Protection",
    summary:
      "World Animal Protection's global review presents a 2024 overview of campaign and programme work across wildlife, farming, disasters, and animal-welfare systems. It is a useful comparator for international animal-welfare monitoring.",
    imageUrl: imageAnimalProtection,
    location: {
      name: "London, United Kingdom",
      coords: [-0.1276, 51.5072],
      countryId: "826",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.worldanimalprotection.org/about-us/global-reviews/2024/",
      confidence: 0.88,
      monitoringTheme: "International animal welfare campaigns and programmes",
      suggestedUse:
        "Background item for international animal-welfare trend monitoring and partner benchmarking.",
    },
  },
  {
    id: "12",
    priority: "information",
    category: "news",
    title: "AP: extreme weather disrupted schooling for 242 million children",
    date: "2025-01-24",
    source: "Associated Press",
    summary:
      "Associated Press reported UNICEF's finding that at least 242 million children in 85 countries had schooling interrupted in 2024 because of heatwaves, cyclones, flooding, and other climate hazards.",
    imageUrl: imageUnicefEducation,
    location: {
      name: "Cape Town, South Africa",
      coords: [18.4241, -33.9249],
      countryId: "710",
    },
    agentMetadata: {
      sourceUrl: "https://apnews.com/article/eb93150ca5c1f79a663f7c6755be3196",
      confidence: 0.87,
      monitoringTheme: "Climate hazards and education disruption",
      suggestedUse:
        "Use as global context for Burundi flood-related education interruptions.",
      keyFacts: [
        "UNICEF estimate cited by AP: 242 million affected children in 85 countries.",
        "Climate hazards include heatwaves, cyclones, and flooding.",
      ],
    },
  },
];
