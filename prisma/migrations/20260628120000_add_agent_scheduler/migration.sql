CREATE TABLE "AgentSettings" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "scheduleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "intervalDays" INTEGER NOT NULL DEFAULT 2,
    "nextRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "focusAreas" JSONB NOT NULL DEFAULT '["news","funding","reports"]',
    "model" TEXT NOT NULL DEFAULT 'qwen3:8b',
    "newsMaxCandidates" INTEGER NOT NULL DEFAULT 10,
    "fundingMaxCandidates" INTEGER NOT NULL DEFAULT 12,
    "includeGdelt" BOOLEAN NOT NULL DEFAULT true,
    "gdeltTimespan" TEXT NOT NULL DEFAULT '7d',
    "emailScanEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentStep" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "insertedNews" INTEGER NOT NULL DEFAULT 0,
    "insertedFunding" INTEGER NOT NULL DEFAULT 0,
    "insertedReports" INTEGER NOT NULL DEFAULT 0,
    "events" JSONB NOT NULL DEFAULT '[]',
    "configSnapshot" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AgentSettings_org_username_key" ON "AgentSettings"("org", "username");
CREATE INDEX "AgentSettings_nextRunAt_idx" ON "AgentSettings"("nextRunAt");
CREATE INDEX "AgentRun_org_username_createdAt_idx" ON "AgentRun"("org", "username", "createdAt");
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");
