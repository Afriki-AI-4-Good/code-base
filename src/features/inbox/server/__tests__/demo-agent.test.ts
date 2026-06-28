import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapAgentFundingResultToInboxEntry,
  mapAgentNewsResultToInboxEntry,
} from "../agent-mappers";
import {
  getDemoAgentHealth,
  runDemoFundingAgent,
  runDemoNewsAgent,
} from "../demo-agent";

describe("WTG demo agent", () => {
  it("reports local demo health without requiring the Python API", () => {
    assert.deepEqual(getDemoAgentHealth(), {
      ok: true,
      status: "demo_wtg",
    });
  });

  it("returns deterministic WTG funding fixtures with stable source URLs", async () => {
    const response = await runDemoFundingAgent({
      delayMs: 0,
      maxCandidates: 12,
    });

    assert.equal(response.runId, 9001);
    assert.equal(response.results.length, 4);
    assert.deepEqual(
      response.results.map((result) => result.link_to_original),
      [
        "https://demo.wtg.local/funding/animal-welfare-development-cooperation-2026",
        "https://demo.wtg.local/funding/companion-animal-welfare-europe-2026",
        "https://demo.wtg.local/funding/working-animals-east-africa-2026",
        "https://demo.wtg.local/funding/social-media-animal-welfare-rapid-response",
      ],
    );
    assert.match(response.results[0]?.title ?? "", /Animal Welfare/);
    assert.equal(response.events.at(-1)?.type, "finished");
  });

  it("returns deterministic WTG news fixtures with stable source URLs", async () => {
    const response = await runDemoNewsAgent({
      delayMs: 0,
      maxCandidates: 10,
    });

    assert.equal(response.runId, 9002);
    assert.equal(response.results.length, 5);
    assert.deepEqual(
      response.results.map((result) => result.link_to_original),
      [
        "https://demo.wtg.local/news/puppy-trade-instagram-investigation",
        "https://demo.wtg.local/news/donkey-hide-trade-east-africa",
        "https://demo.wtg.local/news/eu-animal-welfare-transport-rules",
        "https://demo.wtg.local/news/rabies-vaccination-partnerships",
        "https://demo.wtg.local/news/animal-suffering-social-media-platforms",
      ],
    );
    assert.equal(response.results[0]?.ranking, "Urgent");
    assert.equal(response.events.at(-1)?.type, "finished");
  });

  it("maps WTG fixtures into stable agent inbox entry ids", async () => {
    const fundingResponse = await runDemoFundingAgent({
      delayMs: 0,
      maxCandidates: 12,
    });
    const newsResponse = await runDemoNewsAgent({
      delayMs: 0,
      maxCandidates: 10,
    });
    const firstFundingResult = fundingResponse.results[0];
    const firstNewsResult = newsResponse.results[0];

    assert.ok(firstFundingResult);
    assert.ok(firstNewsResult);

    const fundingEntry = mapAgentFundingResultToInboxEntry(firstFundingResult, {
      runId: fundingResponse.runId,
      detectedAt: "2026-06-28",
    });
    const newsEntry = mapAgentNewsResultToInboxEntry(firstNewsResult, {
      runId: newsResponse.runId,
      detectedAt: "2026-06-28",
    });

    assert.equal(fundingEntry.category, "funding");
    assert.equal(newsEntry.category, "news");
    assert.match(fundingEntry.id, /^agent:funding:/);
    assert.match(newsEntry.id, /^agent:news:/);
    assert.deepEqual(fundingEntry.topics, [
      "Animal Welfare",
      "Development Cooperation",
      "East Africa",
    ]);
    assert.equal(
      newsEntry.agentMetadata?.monitoringTheme,
      "Context monitoring",
    );
  });
});
