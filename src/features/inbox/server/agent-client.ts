import "server-only";

import { env } from "~/env";
import type { OnboardingExtras } from "../lib/profile";
import type { AgentFundingResult, AgentNewsResult } from "./agent-mappers";
import type { AgentSource } from "./agent-sources";
import {
  getDemoAgentHealth,
  runDemoFundingAgent,
  runDemoNewsAgent,
} from "./demo-agent";

interface AgentRunResponse<TResult> {
  runId: number;
  elapsedSeconds: number;
  results: TResult[];
  events: AgentRunEvent[];
}

interface AgentRunEvent {
  id: number;
  runId: number;
  sourceId: number | null;
  type: string;
  message: string;
  createdAt: string;
}

export interface NewsAgentRequest {
  query: string;
  sources: AgentSource[];
  model: string;
  maxCandidates: number;
  urgentDefinition: string;
  relevantDefinition: string;
  includeGdelt: boolean;
  gdeltQuery: string;
  gdeltTimespan: string;
  outputFormat?: OnboardingExtras["outputFormat"];
}

export interface FundingAgentRequest {
  query: string;
  orgProfile: string;
  sources: AgentSource[];
  model: string;
  maxCandidates: number;
  outputFormat?: OnboardingExtras["outputFormat"];
}

export async function runNewsAgent(
  input: NewsAgentRequest,
  options?: AgentRunOptions,
): Promise<AgentRunResponse<AgentNewsResult>> {
  if (env.DEMO_AGENT_MODE === "wtg") {
    return runDemoNewsAgent({
      maxCandidates: input.maxCandidates,
      signal: options?.signal,
    });
  }

  return postAgentRun<AgentNewsResult>("/runs/news", input, options);
}

export async function runFundingAgent(
  input: FundingAgentRequest,
  options?: AgentRunOptions,
): Promise<AgentRunResponse<AgentFundingResult>> {
  if (env.DEMO_AGENT_MODE === "wtg") {
    return runDemoFundingAgent({
      maxCandidates: input.maxCandidates,
      signal: options?.signal,
    });
  }

  return postAgentRun<AgentFundingResult>("/runs/funding", input, options);
}

export async function getAgentHealth(): Promise<AgentHealth> {
  if (env.DEMO_AGENT_MODE === "wtg") {
    return getDemoAgentHealth();
  }

  const response = await fetch(`${env.AGENT_API_URL}/health`);
  const payload = (await response
    .json()
    .catch(() => null)) as Partial<AgentHealth> | null;

  return {
    ok: response.ok && payload?.status === "ok",
    status: payload?.status ?? `http_${response.status}`,
  };
}

async function postAgentRun<TResult>(
  path: string,
  body: unknown,
  options?: AgentRunOptions,
): Promise<AgentRunResponse<TResult>> {
  const response = await fetch(`${env.AGENT_API_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: options?.signal,
  });
  const payload = (await response.json().catch(() => null)) as
    | (Partial<AgentRunResponse<TResult>> & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Agent API returned ${response.status}`);
  }
  if (
    !payload ||
    typeof payload.runId !== "number" ||
    !Array.isArray(payload.results)
  ) {
    throw new Error("Agent API returned an invalid response.");
  }

  return {
    runId: payload.runId,
    elapsedSeconds: Number(payload.elapsedSeconds ?? 0),
    results: payload.results,
    events: Array.isArray(payload.events) ? payload.events : [],
  };
}

interface AgentRunOptions {
  signal?: AbortSignal;
}

interface AgentHealth {
  ok: boolean;
  status: string;
}
