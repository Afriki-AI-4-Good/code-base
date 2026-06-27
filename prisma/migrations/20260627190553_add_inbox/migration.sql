-- CreateTable
CREATE TABLE "InboxEntry" (
    "id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "translatedFrom" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "locationName" TEXT,
    "locationLng" DOUBLE PRECISION,
    "locationLat" DOUBLE PRECISION,
    "locationCountryId" TEXT,
    "imageUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "amountRange" TEXT,
    "topics" JSONB,
    "funder" TEXT,
    "criteria" JSONB,
    "bkEligible" TEXT,
    "originalLanguage" TEXT,
    "sender" TEXT,
    "originalText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InboxEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingPhase" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FundingPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "newsSources" JSONB NOT NULL,
    "emailConnected" BOOLEAN NOT NULL DEFAULT false,
    "emailAddress" TEXT,
    "outputFormat" JSONB NOT NULL,
    "fundingSources" JSONB NOT NULL,
    "fundingCriteria" JSONB NOT NULL,
    "urgency" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InboxEntry_category_idx" ON "InboxEntry"("category");

-- CreateIndex
CREATE INDEX "InboxEntry_priority_idx" ON "InboxEntry"("priority");

-- CreateIndex
CREATE INDEX "InboxEntry_date_idx" ON "InboxEntry"("date");

-- CreateIndex
CREATE INDEX "FundingPhase_entryId_idx" ON "FundingPhase"("entryId");

-- CreateIndex
CREATE INDEX "FundingPhase_date_idx" ON "FundingPhase"("date");

-- AddForeignKey
ALTER TABLE "FundingPhase" ADD CONSTRAINT "FundingPhase_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "InboxEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
