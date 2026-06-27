import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapAgentFundingResultToInboxEntry,
  mapAgentNewsResultToInboxEntry,
} from "../agent-mappers";

describe("agent result mappers", () => {
  it("maps news ranking and metadata into an inbox news entry", () => {
    const entry = mapAgentNewsResultToInboxEntry(
      {
        ranking: "Relevant",
        title_de: "Burundi: Neue Bildungsstrategie",
        summary_de: "Die Regierung stellt eine Bildungsstrategie vor.",
        translated_excerpt_de: "Auszug",
        source: "Iwacu",
        published: "2026-06-27",
        link_to_original: "https://example.org/news",
        original_title: "Education strategy",
        relevance_reason: "Directly affects projects",
      },
      { runId: 12, detectedAt: "2026-06-27" },
    );

    assert.equal(entry.category, "news");
    assert.equal(entry.priority, "relevant");
    assert.equal(entry.title, "Burundi: Neue Bildungsstrategie");
    assert.equal(entry.agentMetadata?.sourceUrl, "https://example.org/news");
    assert.equal(
      entry.agentMetadata?.decisionReason,
      "Directly affects projects",
    );
    assert.equal(entry.location?.countryId, "108");
  });

  it("maps strong-fit funding with a near deadline to urgent", () => {
    const entry = mapAgentFundingResultToInboxEntry(
      {
        fit_label: "Strong fit",
        title: "Education call",
        deadline: "2026-07-10",
        amount_range: "EUR 10,000-50,000",
        topic: "Education",
        funder: "BMZ",
        eligibility_criteria: ["registered nonprofit"],
        fit_reasons: ["Topic and region match"],
        missing_information: ["Co-funding unclear"],
        summary: "Funding for education projects.",
        source: "BMZ",
        published: "2026-06-20",
        link_to_original: "https://example.org/call",
        original_title: "Call",
      },
      { runId: 99, detectedAt: "2026-06-27" },
    );

    assert.equal(entry.category, "funding");
    assert.equal(entry.priority, "urgent");
    assert.equal(entry.deadline, "2026-07-10");
    assert.equal(entry.bkEligible, "yes");
    assert.equal(entry.agentMetadata?.fitScore, 90);
    assert.deepEqual(entry.topics, ["Education"]);
    assert.match(entry.criteria.notes ?? "", /Co-funding unclear/);
  });

  it("parses natural-language funding deadlines instead of using the sync date", () => {
    const entry = mapAgentFundingResultToInboxEntry(
      {
        fit_label: "Strong fit",
        title: "Year-end education call",
        deadline: "31 December 2026",
        amount_range: "EUR 10,000-50,000",
        topic: "Education",
        funder: "BMZ",
        eligibility_criteria: ["registered nonprofit"],
        fit_reasons: ["Topic and region match"],
        missing_information: [],
        summary: "Funding for education projects.",
        source: "BMZ",
        published: "2026-06-20",
        link_to_original: "https://example.org/year-end-call",
        original_title: "Year-end call",
      },
      { runId: 101, detectedAt: "2026-06-27" },
    );

    assert.equal(entry.deadline, "2026-12-31");
    assert.equal(entry.agentMetadata?.deadlineLabel, undefined);
  });

  it("keeps non-date funding deadlines displayable through metadata", () => {
    const entry = mapAgentFundingResultToInboxEntry(
      {
        fit_label: "Unknown",
        title: "Rolling program",
        deadline: "rolling",
        amount_range: "unknown",
        topic: "unknown",
        funder: "Foundation",
        eligibility_criteria: [],
        fit_reasons: [],
        missing_information: [],
        summary: "Rolling funding program.",
        source: "Foundation",
        published: "",
        link_to_original: "https://example.org/rolling",
        original_title: "Rolling program",
      },
      { runId: 100, detectedAt: "2026-06-27" },
    );

    assert.equal(entry.priority, "information");
    assert.notEqual(entry.deadline, "2026-06-27");
    assert.equal(entry.deadline, "9999-12-31");
    assert.equal(entry.agentMetadata?.deadlineLabel, "rolling");
    assert.deepEqual(entry.phases, [
      { kind: "open", label: "Detected", date: "2026-06-27" },
    ]);
  });
});
