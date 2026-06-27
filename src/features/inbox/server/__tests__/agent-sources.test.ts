import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildFundingQuery,
  buildNewsQuery,
  resolveFundingSources,
  resolveNewsSources,
} from "../agent-sources";

describe("agent source resolution", () => {
  it("maps known news labels to URLs and keeps custom URL sources", () => {
    const sources = resolveNewsSources([
      "Reuters Africa",
      "https://example.org/feed",
    ]);

    assert.equal(sources[0]?.name, "Reuters Africa");
    assert.equal(sources[0]?.url, "https://www.reuters.com/world/africa/");
    assert.equal(sources[1]?.name, "example.org");
    assert.equal(sources[1]?.url, "https://example.org/feed");
  });

  it("falls back to default funding sources when labels are empty", () => {
    const sources = resolveFundingSources([]);

    assert.ok(sources.length >= 3);
    assert.equal(sources[0]?.name, "BMZ");
  });

  it("builds profile-aware news and funding queries", () => {
    const newsQuery = buildNewsQuery({
      org: "bk",
      prompt: "Focus on project risks.",
      newsSources: [],
      wtgKeywords: [],
      fundingCriteria: {
        regions: ["Burundi"],
        topics: ["Education"],
      },
    });
    const fundingQuery = buildFundingQuery({
      org: "bk",
      prompt: "Find grants.",
      fundingSources: [],
      fundingCriteria: {
        regions: ["Burundi"],
        topics: ["Education"],
      },
    });

    assert.match(newsQuery, /Burundi/);
    assert.match(newsQuery, /Education/);
    assert.match(fundingQuery, /funding/);
    assert.match(fundingQuery, /Education/);
  });
});
