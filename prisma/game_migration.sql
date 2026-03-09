-- BagdarAI Game System Migration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "UserXP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "UserXP_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserXP_userId_key" ON "UserXP"("userId");
CREATE INDEX IF NOT EXISTS "UserXP_xp_idx" ON "UserXP"("xp");
ALTER TABLE "UserXP" ADD CONSTRAINT "UserXP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "CareerSimulation" (
    "id" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKk" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKk" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "scenarios" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CareerSimulation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CareerSimulation_careerId_idx" ON "CareerSimulation"("careerId");
CREATE INDEX IF NOT EXISTS "CareerSimulation_category_idx" ON "CareerSimulation"("category");

CREATE TABLE IF NOT EXISTS "SimulationResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "choices" JSONB NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "SimulationResult_userId_idx" ON "SimulationResult"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "SimulationResult_userId_simulationId_key" ON "SimulationResult"("userId", "simulationId");
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "CareerSimulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "DailyQuest" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKk" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKk" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '⚡',
    CONSTRAINT "DailyQuest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "UserQuest_userId_idx" ON "UserQuest"("userId");
CREATE INDEX IF NOT EXISTS "UserQuest_expiresAt_idx" ON "UserQuest"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "UserQuest_userId_questId_assignedAt_key" ON "UserQuest"("userId", "questId", "assignedAt");
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "DailyQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "NpcMentor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "professionRu" TEXT NOT NULL,
    "professionKk" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "introMessage" TEXT NOT NULL,
    "introMessageRu" TEXT NOT NULL,
    "introMessageKk" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL DEFAULT '🤖',
    "category" TEXT NOT NULL,
    CONSTRAINT "NpcMentor_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "NpcMentor_slug_key" ON "NpcMentor"("slug");

CREATE TABLE IF NOT EXISTS "NpcMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NpcMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "NpcMessage_userId_npcId_idx" ON "NpcMessage"("userId", "npcId");
ALTER TABLE "NpcMessage" ADD CONSTRAINT "NpcMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NpcMessage" ADD CONSTRAINT "NpcMessage_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NpcMentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
