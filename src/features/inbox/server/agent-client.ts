import "server-only";

import { env } from "~/env";
import type { AgentFundingResult, AgentNewsResult } from "./agent-mappers";
import type { AgentSource } from "./agent-sources";

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
}

export interface FundingAgentRequest {
  query: string;
  orgProfile: string;
  sources: AgentSource[];
  model: string;
  maxCandidates: number;
}

export async function runNewsAgent(
  input: NewsAgentRequest,
  options?: AgentRunOptions,
): Promise<AgentRunResponse<AgentNewsResult>> {
  return postAgentRun<AgentNewsResult>("/runs/news", input, options);
}

export async function runFundingAgent(
  input: FundingAgentRequest,
  options?: AgentRunOptions,
): Promise<AgentRunResponse<AgentFundingResult>> {
  return postAgentRun<AgentFundingResult>("/runs/funding", input, options);
}

export async function getAgentHealth(): Promise<AgentHealth> {
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
