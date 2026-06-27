ALTER TABLE "UserProfile" ADD COLUMN "username" TEXT NOT NULL DEFAULT 'local-user';
ALTER TABLE "UserProfile" ADD COLUMN "wtgKeywords" JSONB;
ALTER TABLE "UserProfile" ADD COLUMN "wtgNewsCategories" JSONB;

CREATE UNIQUE INDEX "UserProfile_org_username_key" ON "UserProfile"("org", "username");
