import type { InboxEntry } from "@/types/inbox";

const imageUnicefEducation =
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80";
const imageEcwBurundi =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
const imageClimateEducation =
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80";
const imageWaterAccess =
  "https://images.unsplash.com/photo-1541844053589-346841d0b34c?auto=format&fit=crop&w=1200&q=80";
const imageAgricultureResilience =
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80";
const imageFloodResponse =
  "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80";
const imageEconomyMarkets =
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80";
const imageHealthResponse =
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80";
const imageDisplacementSupport =
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80";
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
  {
    id: "13",
    priority: "relevant",
    category: "news",
    title: 'UNICEF Burundi: World Water Day 2024 "Water for Peace"',
    date: "2024-03-22",
    source: "UNICEF Burundi",
    summary:
      "UNICEF Burundi marked World Water Day 2024 under the theme 'Water for Peace', emphasizing that water is a human right and calling for increased budget allocations to drinking water, hygiene, and sanitation as part of Burundi's Vision 2040/2060.",
    imageUrl: imageWaterAccess,
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.unicef.org/burundi/press-releases/world-water-day-2024-under-theme-water-peace",
      confidence: 0.95,
      monitoringTheme: "WASH financing, peacebuilding, and child health",
      suggestedUse:
        "Use as a WASH-sector signal for education, school sanitation, and community resilience planning.",
      keyFacts: [
        "Theme: Water for Peace.",
        "UNICEF Burundi links WASH budget allocations to access, hygiene, sanitation, and peace between communities.",
      ],
    },
  },
  {
    id: "14",
    priority: "relevant",
    category: "funding",
    title:
      "AfDB: Additional US$8.6M grant for rural water and climate resilience",
    date: "2025-10-22",
    source: "African Development Bank",
    summary:
      "The African Development Fund approved an additional US$8.6 million grant through its Climate Action Window to support the first phase of Burundi's Water Sector and Climate Resilience Building Support Programme (PASEREC). The grant supplements earlier Bank financing for the programme.",
    deadline: "2025-10-22",
    amountRange: "US$8.6 million additional grant",
    topics: ["Water Supply", "Climate Resilience", "Rural Communities"],
    funder: "African Development Fund / African Development Bank",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Public-sector programme financing; relevant for local implementation, WASH partnerships, and climate-resilience monitoring.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Additional grant approved", date: "2025-10-22" },
      {
        kind: "kickoff",
        label: "PASEREC Phase 1 extension",
        date: "2026-01-01",
      },
      {
        kind: "decision",
        label: "Implementation monitoring",
        date: "2026-12-31",
      },
    ],
    location: {
      name: "Rural Burundi",
      coords: [29.9189, -3.3731],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.afdb.org/en/news-and-events/press-releases/african-development-fund-approves-additional-86-million-grant-clean-water-supply-and-climate-change-resilience-rural-burundi-88031",
      deadlineLabel: "Grant approval",
      confidence: 0.94,
      fitScore: 72,
      impactAreas: ["WASH", "climate resilience", "rural services"],
      recommendedAction:
        "Monitor procurement and local implementation windows connected to PASEREC activities.",
    },
  },
  {
    id: "15",
    priority: "information",
    category: "report",
    title: "World Bank Macro Poverty Outlook: Burundi April 2026",
    translatedFrom: "English",
    date: "2026-04-01",
    source: "World Bank Macro Poverty Outlook",
    summary:
      "The April 2026 Macro Poverty Outlook reports that Burundi's real GDP grew by 4.0% in 2025, while inflation nearly doubled amid supply constraints and fuel shortages. The poverty rate remains high at 74%, reflecting inflation pressure and limited job creation.",
    originalLanguage: "English",
    sender: "World Bank Macro Poverty Outlook",
    originalText:
      "Real GDP grew by 4.0 percent in 2025, driven by agriculture, services, and public spending. The poverty rate remains high at 74 percent due to inflation and limited job creation.",
    location: {
      name: "Washington DC, USA (World Bank)",
      coords: [-77.0369, 38.9072],
      countryId: "840",
    },
    agentMetadata: {
      sourceUrl:
        "https://thedocs.worldbank.org/en/doc/bae48ff2fefc5a869546775b3f010735-0500062021/related/mpo-bdi.pdf",
      confidence: 0.93,
      monitoringTheme:
        "Macroeconomic risk, poverty, inflation, and livelihoods",
      suggestedUse:
        "Use as context for board briefings and for explaining household vulnerability in proposals.",
      keyFacts: [
        "Real GDP growth: 4.0% in 2025.",
        "Poverty rate remains high at 74%.",
      ],
    },
  },
  {
    id: "16",
    priority: "relevant",
    category: "news",
    title:
      "GCA partners with AfDB on US$148M agricultural resilience investment",
    date: "2024-10-04",
    source: "Global Center on Adaptation",
    summary:
      "The Global Center on Adaptation announced support to the African Development Bank's Burundi-Rwanda Integrated Development Program, a US$148 million initiative focused on strengthening agricultural resilience in Burundi and Rwanda through climate-smart practices and technical assistance.",
    imageUrl: imageAgricultureResilience,
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://gca.org/news/gca-partners-with-afdb-for-148-million-investment-to-boost-agricultural-resilience-in-burundi/",
      confidence: 0.91,
      monitoringTheme: "Climate-smart agriculture and resilience investment",
      suggestedUse:
        "Track for livelihood, food-security, and school-feeding context in Burundi-related proposals.",
      keyFacts: [
        "Investment scale: US$148 million.",
        "Focus: agricultural resilience and climate-smart practices.",
      ],
    },
  },
  {
    id: "17",
    priority: "information",
    category: "report",
    title: "UNEP GRID: Burundi water country fiche",
    translatedFrom: "English",
    date: "2026-01-01",
    source: "UNEP GRID-Geneva",
    summary:
      "UNEP GRID's Burundi water fiche describes Lake Tanganyika as one of the world's largest freshwater reserves, with around 20,000 km3 of water. It notes that approximately 8% of the lake lies within Burundi and that the lake is central to fisheries and water-resource monitoring.",
    originalLanguage: "English",
    sender: "UNEP GRID-Geneva",
    originalText:
      "Lake Tanganyika is one of the largest lakes and freshwater reserves in the world, containing around 20,000 km3 of water. Approximately 8% of Lake Tanganyika is within Burundi's national boundaries.",
    location: {
      name: "Lake Tanganyika, Burundi",
      coords: [29.25, -3.75],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://dicf.unepgrid.ch/burundi/water",
      confidence: 0.88,
      monitoringTheme: "Water resources, fisheries, and Lake Tanganyika",
      suggestedUse:
        "Useful background for WASH, fisheries, climate resilience, and lakeshore community risk analysis.",
      keyFacts: [
        "Lake Tanganyika contains around 20,000 km3 of water.",
        "About 8% of Lake Tanganyika is within Burundi's national boundaries.",
      ],
    },
  },
  {
    id: "18",
    priority: "urgent",
    category: "report",
    title: "UNICEF Burundi Flash Update: Burundian returnees from Rwanda",
    translatedFrom: "English",
    date: "2026-05-31",
    source: "UNICEF Humanitarian Action for Children",
    summary:
      "UNICEF's 2026 situation-report stream includes flash updates on Burundian returnees from Rwanda. The updates are relevant for education, child protection, WASH, and family reunification monitoring when returnee movements put pressure on local services.",
    originalLanguage: "English",
    sender: "UNICEF Burundi Humanitarian Action for Children",
    originalText:
      "Flash updates on Burundian returnees from Rwanda are listed in UNICEF's Burundi situation-report archive for 2026.",
    location: {
      name: "Kirundo, Burundi",
      coords: [30.096, -2.584],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.unicef.org/appeals/burundi/situation-reports",
      confidence: 0.9,
      monitoringTheme: "Returnees, child protection, education continuity",
      recommendedAction:
        "Keep in urgent queue for returnee-response tracking and school-capacity monitoring in northern provinces.",
      keyFacts: [
        "UNICEF's 2026 archive lists flash updates on Burundian returnees from Rwanda.",
        "Likely programme relevance: education, child protection, WASH, and family support.",
      ],
    },
  },
  {
    id: "19",
    priority: "relevant",
    category: "news",
    title:
      "UNICEF Burundi: 2026 situation reports continue flood response watch",
    date: "2026-04-30",
    source: "UNICEF Humanitarian Action for Children",
    summary:
      "UNICEF's 2026 Burundi situation-report archive continues regular monitoring of humanitarian response needs, including children affected by floods, displacement, health risks, and education disruption.",
    imageUrl: imageFloodResponse,
    location: {
      name: "Gatumba, Burundi",
      coords: [29.26, -3.31],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.unicef.org/appeals/burundi/situation-reports",
      confidence: 0.9,
      monitoringTheme:
        "Flood response and child-focused humanitarian monitoring",
      suggestedUse:
        "Use as a live-monitoring card for the 2026 humanitarian response stream.",
      keyFacts: [
        "UNICEF maintains a 2026 Burundi situation-report archive.",
        "Relevant to floods, displacement, health risks, and education continuity.",
      ],
    },
  },
  {
    id: "20",
    priority: "relevant",
    category: "report",
    title: "World Bank Macro Poverty Outlook: Burundi 2026 update",
    translatedFrom: "English",
    date: "2026-04-01",
    source: "World Bank Macro Poverty Outlook",
    summary:
      "The April 2026 World Bank Macro Poverty Outlook reports continued macroeconomic pressure in Burundi, including high poverty, inflation pressure, and external-sector constraints. It is useful background for funding proposals that need to explain household vulnerability.",
    originalLanguage: "English",
    sender: "World Bank",
    originalText:
      "The April 2026 Macro Poverty Outlook for Burundi discusses growth, inflation, fiscal and external pressures, and poverty trends.",
    location: {
      name: "Washington DC, USA (World Bank)",
      coords: [-77.0369, 38.9072],
      countryId: "840",
    },
    agentMetadata: {
      sourceUrl:
        "https://thedocs.worldbank.org/en/doc/bae48ff2fefc5a869546775b3f010735-0500062021/related/mpo-bdi.pdf",
      confidence: 0.92,
      monitoringTheme:
        "Macroeconomic pressure, poverty, and household vulnerability",
      suggestedUse:
        "Use for board briefings and proposal context on poverty, inflation, and service affordability.",
      keyFacts: [
        "Source is the World Bank Macro Poverty Outlook April 2026 edition.",
        "Focus: growth, inflation, poverty, fiscal and external-sector constraints.",
      ],
    },
  },
  {
    id: "21",
    priority: "information",
    category: "news",
    title: "World Bank: Burundi economic outlook tracks poverty and inflation",
    date: "2026-04-01",
    source: "World Bank",
    summary:
      "The 2026 World Bank Macro Poverty Outlook for Burundi is a useful monitoring signal for NGOs because inflation, poverty, and limited job creation affect household capacity to keep children in school and pay for basic services.",
    imageUrl: imageEconomyMarkets,
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://thedocs.worldbank.org/en/doc/bae48ff2fefc5a869546775b3f010735-0500062021/related/mpo-bdi.pdf",
      confidence: 0.88,
      monitoringTheme: "Poverty and education affordability",
      suggestedUse:
        "Use as socioeconomic context for education access and child-protection fundraising narratives.",
      keyFacts: [
        "Macro Poverty Outlook is a World Bank country-monitoring product.",
        "Relevant for education proposals because household poverty affects retention and attendance.",
      ],
    },
  },
  {
    id: "22",
    priority: "urgent",
    category: "report",
    title: "WHO AFRO: cholera and acute watery diarrhoea regional watch",
    translatedFrom: "English",
    date: "2026-03-31",
    source: "WHO Regional Office for Africa",
    summary:
      "WHO AFRO's regional emergency reporting continues to monitor cholera and acute watery diarrhoea risks across affected African countries. For Burundi-linked work, this is relevant to school WASH, lakeshore communities, and cross-border health-risk monitoring.",
    originalLanguage: "English",
    sender: "WHO Regional Office for Africa",
    originalText:
      "Regional emergency updates monitor cholera and acute watery diarrhoea risks, response measures, and affected countries in the African region.",
    location: {
      name: "Brazzaville, WHO Africa",
      coords: [15.2832, -4.2634],
      countryId: "178",
    },
    agentMetadata: {
      sourceUrl: "https://www.afro.who.int/health-topics/cholera",
      confidence: 0.86,
      monitoringTheme: "Cholera risk, WASH, health response",
      recommendedAction:
        "Flag for school WASH and water-quality coordination when lakeshore or displacement stories appear.",
      keyFacts: [
        "WHO AFRO maintains regional cholera information and response updates.",
        "Relevance: WASH, schools, cross-border health-risk monitoring.",
      ],
    },
  },
  {
    id: "23",
    priority: "information",
    category: "news",
    title: "WHO Africa cholera monitoring remains relevant for school WASH",
    date: "2026-03-31",
    source: "WHO Africa",
    summary:
      "WHO Africa's cholera monitoring provides regional context for waterborne-disease risk. For Burundi-focused education and child-health work, the signal is most useful when paired with school sanitation and flood-displacement reports.",
    imageUrl: imageHealthResponse,
    location: {
      name: "Lake Tanganyika region",
      coords: [29.25, -3.75],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.afro.who.int/health-topics/cholera",
      confidence: 0.84,
      monitoringTheme: "Waterborne disease and school sanitation",
      suggestedUse:
        "Keep as background context for emergency education and WASH proposal sections.",
      keyFacts: [
        "Cholera risk is closely linked with water, sanitation, and hygiene conditions.",
        "School WASH can be framed as both education-continuity and health protection.",
      ],
    },
  },
  {
    id: "24",
    priority: "relevant",
    category: "funding",
    title:
      "World Bank Burundi human capital programme: 2026 implementation watch",
    date: "2026-01-15",
    source: "World Bank",
    summary:
      "The World Bank-financed human-capital programme announced in 2024 remains relevant in 2026 as implementation continues across education, health, and nutrition services. NGOs should watch implementation and procurement signals connected to basic education and vulnerable learners.",
    deadline: "2026-12-31",
    amountRange: "US$227.6 million programme envelope",
    topics: ["Basic Education", "Nutrition", "Health", "Vulnerable Learners"],
    funder: "World Bank IDA / GPE trust fund",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Implementation-watch item, not a direct open call. Useful for procurement and partner-mapping monitoring.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Implementation monitoring", date: "2026-01-15" },
      { kind: "info", label: "Partner/procurement watch", date: "2026-06-30" },
      {
        kind: "deadline",
        label: "Annual review checkpoint",
        date: "2026-12-31",
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
      deadlineLabel: "2026 implementation watch",
      confidence: 0.9,
      fitScore: 70,
      recommendedAction:
        "Monitor World Bank procurement and implementation updates for education-service delivery opportunities.",
    },
  },
  {
    id: "25",
    priority: "relevant",
    category: "report",
    title: "BTI 2026 Country Report: Burundi",
    translatedFrom: "English",
    date: "2026-03-01",
    source: "Bertelsmann Transformation Index",
    summary:
      "The BTI 2026 country report provides political, economic, and governance context for Burundi. It is useful for risk notes, donor due diligence, governance assumptions, and board-level strategic monitoring.",
    originalLanguage: "English",
    sender: "Bertelsmann Stiftung",
    originalText:
      "BTI country reports assess political transformation, economic transformation, and governance performance across countries, including Burundi.",
    location: {
      name: "Gütersloh, Germany",
      coords: [8.383, 51.906],
      countryId: "276",
    },
    agentMetadata: {
      sourceUrl: "https://bti-project.org/en/reports/country-report/BDI",
      confidence: 0.87,
      monitoringTheme: "Governance, political risk, and donor due diligence",
      suggestedUse:
        "Use as background in high-level risk sections rather than as a direct programme signal.",
    },
  },
  {
    id: "26",
    priority: "information",
    category: "news",
    title: "IOM Burundi 2026 crisis planning tracks displacement drivers",
    date: "2026-01-01",
    source: "IOM Crisis Response",
    summary:
      "IOM's Burundi crisis response planning for 2024-2026 remains a 2026 reference for flood displacement, lake-level rise, erratic rainfall, and mobility trends that affect children, schools, and local service access.",
    imageUrl: imageDisplacementSupport,
    location: {
      name: "Lake Tanganyika, Burundi",
      coords: [29.25, -3.75],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://crisisresponse.iom.int/response/burundi-crisis-response-plan-2024-2026",
      confidence: 0.89,
      monitoringTheme: "Displacement, mobility, floods, and school access",
      suggestedUse:
        "Use as context for emergency education, WASH, and lakeshore-community risk notes.",
      keyFacts: [
        "Crisis plan covers 2024-2026.",
        "Drivers include floods, erratic rainfall, lake-level rise, and hydric stress.",
      ],
    },
  },
  {
    id: "27",
    priority: "information",
    category: "funding",
    title: "AfDB PASEREC water programme: 2026 implementation monitoring",
    date: "2026-01-01",
    source: "African Development Bank",
    summary:
      "Following the African Development Fund's additional grant for PASEREC, 2026 monitoring should focus on rural water supply, climate resilience, and implementation opportunities that may touch schools or child-focused community infrastructure.",
    deadline: "2026-12-31",
    amountRange: "US$8.6 million additional grant within PASEREC",
    topics: ["WASH", "Rural Water", "Climate Resilience"],
    funder: "African Development Fund / African Development Bank",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Monitoring item for public-sector programme implementation and related local partner opportunities.",
    },
    bkEligible: "check",
    phases: [
      {
        kind: "open",
        label: "2026 implementation monitoring",
        date: "2026-01-01",
      },
      { kind: "info", label: "Local procurement watch", date: "2026-06-30" },
      {
        kind: "deadline",
        label: "Annual monitoring checkpoint",
        date: "2026-12-31",
      },
    ],
    location: {
      name: "Rural Burundi",
      coords: [29.9189, -3.3731],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.afdb.org/en/news-and-events/press-releases/african-development-fund-approves-additional-86-million-grant-clean-water-supply-and-climate-change-resilience-rural-burundi-88031",
      deadlineLabel: "2026 implementation watch",
      confidence: 0.9,
      fitScore: 68,
      recommendedAction:
        "Track procurement notices and local implementation partners connected to rural water and resilience activities.",
    },
  },
  {
    id: "28",
    priority: "relevant",
    category: "funding",
    title: "ECW Burundi MYRP: 2026 partner and continuation watch",
    date: "2026-02-01",
    source: "Education Cannot Wait",
    summary:
      "Education Cannot Wait's Burundi Multi-Year Resilience Programme remains relevant in 2026 as a reference for education-in-emergencies partnerships, vulnerable learners, returnee communities, and climate-disaster affected schools.",
    deadline: "2026-11-30",
    amountRange:
      "US$12 million seed grant; US$30 million full programme target",
    topics: ["Education in Emergencies", "Returnees", "Child Protection"],
    funder: "Education Cannot Wait",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Continuation-watch item for partner mapping and follow-on funding signals, not a direct open call.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "2026 partner watch", date: "2026-02-01" },
      { kind: "info", label: "Consortium review", date: "2026-06-30" },
      { kind: "deadline", label: "Follow-on funding scan", date: "2026-11-30" },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://www.educationcannotwait.org/news-stories/press-releases/education-cannot-wait-announces-us12-million-catalytic-grant-multi-year",
      deadlineLabel: "2026 continuation watch",
      confidence: 0.89,
      fitScore: 76,
      recommendedAction:
        "Track ECW, UNICEF, and World Vision updates for follow-on education-in-emergencies partnership windows.",
    },
  },
  {
    id: "29",
    priority: "urgent",
    category: "funding",
    title: "UNICEF Burundi HAC 2026: education and WASH funding gap watch",
    date: "2026-06-01",
    source: "UNICEF Humanitarian Action for Children",
    summary:
      "UNICEF's 2026 Burundi humanitarian reporting and appeal pages are useful for monitoring child-focused funding gaps across education, WASH, health, nutrition, and child protection during flood, returnee, and refugee-response operations.",
    deadline: "2026-07-31",
    amountRange: "Appeal and sector funding requirements vary by HAC update",
    topics: ["Education", "WASH", "Child Protection", "Humanitarian Response"],
    funder: "UNICEF Humanitarian Action for Children",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Funding-gap monitoring item; relevant for co-financing, in-kind support, and response alignment.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Mid-year HAC review", date: "2026-06-01" },
      { kind: "deadline", label: "Urgent gap scan", date: "2026-07-31" },
      {
        kind: "decision",
        label: "Response reprioritization",
        date: "2026-09-30",
      },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://www.unicef.org/appeals/burundi",
      deadlineLabel: "Urgent 2026 funding-gap scan",
      confidence: 0.87,
      fitScore: 74,
      recommendedAction:
        "Review HAC sector gaps and identify where school supplies, WASH, or emergency education support can align.",
    },
  },
  {
    id: "30",
    priority: "relevant",
    category: "funding",
    title:
      "IOM Burundi Crisis Response Plan 2026: displacement support pipeline",
    date: "2026-01-15",
    source: "IOM Crisis Response",
    summary:
      "IOM's Burundi Crisis Response Plan for 2024-2026 provides a 2026 funding and response framework for displacement, mobility, flood impacts, returnees, and cross-border crisis response.",
    deadline: "2026-12-31",
    amountRange: "Response-plan funding requirements listed by IOM",
    topics: ["Displacement", "Returnees", "Shelter", "WASH"],
    funder: "International Organization for Migration",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Response-plan monitoring item for partnerships and complementary support around displaced families and host communities.",
    },
    bkEligible: "check",
    phases: [
      {
        kind: "open",
        label: "2026 response-plan monitoring",
        date: "2026-01-15",
      },
      { kind: "info", label: "Mid-year response review", date: "2026-06-30" },
      { kind: "deadline", label: "Annual plan checkpoint", date: "2026-12-31" },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://crisisresponse.iom.int/response/burundi-crisis-response-plan-2024-2026",
      deadlineLabel: "2026 response-plan window",
      confidence: 0.9,
      fitScore: 62,
      recommendedAction:
        "Track displacement-response funding needs that intersect with education access, WASH, and family support.",
    },
  },
  {
    id: "31",
    priority: "information",
    category: "funding",
    title: "UNEP Lake Tanganyika water monitoring: 2026 evidence pipeline",
    date: "2026-01-01",
    source: "UNEP GRID-Geneva",
    summary:
      "UNEP GRID's Burundi water fiche is not a grant call, but it supports 2026 evidence-building for WASH, Lake Tanganyika, fisheries, and climate-resilience proposals that need credible water-resource context.",
    deadline: "2026-10-31",
    amountRange: "Evidence source for WASH and climate proposals",
    topics: ["Water Resources", "Lake Tanganyika", "WASH", "Climate"],
    funder: "Evidence source / proposal pipeline",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Use as proposal evidence and programme design context rather than direct funding.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "Evidence review", date: "2026-01-01" },
      { kind: "info", label: "Proposal evidence pack", date: "2026-05-31" },
      {
        kind: "deadline",
        label: "Use in 2026 grant pipeline",
        date: "2026-10-31",
      },
    ],
    location: {
      name: "Lake Tanganyika, Burundi",
      coords: [29.25, -3.75],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl: "https://dicf.unepgrid.ch/burundi/water",
      deadlineLabel: "2026 evidence-pipeline checkpoint",
      confidence: 0.86,
      fitScore: 58,
      recommendedAction:
        "Attach to WASH and climate-resilience concept notes as background evidence.",
    },
  },
  {
    id: "32",
    priority: "relevant",
    category: "funding",
    title: "GCA-AfDB Burundi resilience investment: 2026 implementation scan",
    date: "2026-03-15",
    source: "Global Center on Adaptation",
    summary:
      "The Global Center on Adaptation's partnership with AfDB on a US$148 million Burundi-Rwanda agricultural resilience investment remains useful in 2026 for tracking livelihood, food-security, climate adaptation, and school-feeding-adjacent opportunities.",
    deadline: "2026-09-30",
    amountRange: "US$148 million regional investment",
    topics: [
      "Agriculture",
      "Climate Adaptation",
      "Food Security",
      "Livelihoods",
    ],
    funder: "African Development Bank / Global Center on Adaptation",
    criteria: {
      ownContributionRequired: false,
      nrwHeadquarters: false,
      applyFromBurundi: true,
      notes:
        "Implementation-scan item for climate adaptation and livelihood partnership opportunities.",
    },
    bkEligible: "check",
    phases: [
      { kind: "open", label: "2026 implementation scan", date: "2026-03-15" },
      { kind: "info", label: "Partner opportunity review", date: "2026-06-30" },
      { kind: "deadline", label: "Pipeline decision", date: "2026-09-30" },
    ],
    location: {
      name: "Bujumbura, Burundi",
      coords: [29.3599, -3.3614],
      countryId: "108",
    },
    agentMetadata: {
      sourceUrl:
        "https://gca.org/news/gca-partners-with-afdb-for-148-million-investment-to-boost-agricultural-resilience-in-burundi/",
      deadlineLabel: "2026 implementation scan",
      confidence: 0.88,
      fitScore: 66,
      recommendedAction:
        "Monitor adaptation implementation partners and school-feeding or youth-livelihood intersections.",
    },
  },
];
