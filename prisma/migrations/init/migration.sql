-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'director', 'curator', 'student', 'parent');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'SCHOOL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "schoolId" TEXT,
    "studentClass" TEXT,
    "studentCode" TEXT,
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "aiRequestsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "curatorId" TEXT,
    "childId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "directorPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "personalitySummary" TEXT NOT NULL,
    "topCareers" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "skillsToDevelop" JSONB NOT NULL,
    "roadmap" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameKk" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKk" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "futureDemand" INTEGER NOT NULL,
    "skills" JSONB NOT NULL,
    "universities" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameKk" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserXP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserXP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerSimulation" (
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

-- CreateTable
CREATE TABLE "SimulationResult" (
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

-- CreateTable
CREATE TABLE "DailyQuest" (
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

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NpcMentor" (
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

-- CreateTable
CREATE TABLE "NpcMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NpcMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerRoadmap" (
    "id" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "stages" JSONB NOT NULL,
    "requiredSkills" TEXT[],
    "universities" JSONB NOT NULL,
    "salaryInfo" JSONB NOT NULL,
    "timeline" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSimulation" (
    "id" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKk" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKk" TEXT NOT NULL,
    "missions" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSimulationResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "missionResults" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "feedback" TEXT,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentCode_key" ON "User"("studentCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_childId_key" ON "User"("childId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "School_schoolCode_key" ON "School"("schoolCode");

-- CreateIndex
CREATE UNIQUE INDEX "School_invitationCode_key" ON "School"("invitationCode");

-- CreateIndex
CREATE INDEX "CareerTest_userId_idx" ON "CareerTest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerResult_testId_key" ON "CareerResult"("testId");

-- CreateIndex
CREATE INDEX "CareerResult_userId_idx" ON "CareerResult"("userId");

-- CreateIndex
CREATE INDEX "CareerResult_isActive_idx" ON "CareerResult"("isActive");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE INDEX "Profession_category_idx" ON "Profession"("category");

-- CreateIndex
CREATE INDEX "StudentBadge_userId_idx" ON "StudentBadge"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBadge_userId_badgeId_key" ON "StudentBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserXP_userId_key" ON "UserXP"("userId");

-- CreateIndex
CREATE INDEX "UserXP_xp_idx" ON "UserXP"("xp");

-- CreateIndex
CREATE INDEX "CareerSimulation_careerId_idx" ON "CareerSimulation"("careerId");

-- CreateIndex
CREATE INDEX "CareerSimulation_category_idx" ON "CareerSimulation"("category");

-- CreateIndex
CREATE INDEX "SimulationResult_userId_idx" ON "SimulationResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationResult_userId_simulationId_key" ON "SimulationResult"("userId", "simulationId");

-- CreateIndex
CREATE INDEX "UserQuest_userId_idx" ON "UserQuest"("userId");

-- CreateIndex
CREATE INDEX "UserQuest_expiresAt_idx" ON "UserQuest"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_assignedAt_key" ON "UserQuest"("userId", "questId", "assignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NpcMentor_slug_key" ON "NpcMentor"("slug");

-- CreateIndex
CREATE INDEX "NpcMessage_userId_npcId_idx" ON "NpcMessage"("userId", "npcId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerRoadmap_professionId_key" ON "CareerRoadmap"("professionId");

-- CreateIndex
CREATE INDEX "CareerRoadmap_professionId_idx" ON "CareerRoadmap"("professionId");

-- CreateIndex
CREATE INDEX "JobSimulation_professionId_idx" ON "JobSimulation"("professionId");

-- CreateIndex
CREATE INDEX "UserSimulationResult_userId_idx" ON "UserSimulationResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSimulationResult_userId_simulationId_key" ON "UserSimulationResult"("userId", "simulationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerTest" ADD CONSTRAINT "CareerTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerResult" ADD CONSTRAINT "CareerResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerResult" ADD CONSTRAINT "CareerResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "CareerTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXP" ADD CONSTRAINT "UserXP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "CareerSimulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "DailyQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcMessage" ADD CONSTRAINT "NpcMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NpcMessage" ADD CONSTRAINT "NpcMessage_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NpcMentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerRoadmap" ADD CONSTRAINT "CareerRoadmap_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSimulation" ADD CONSTRAINT "JobSimulation_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSimulationResult" ADD CONSTRAINT "UserSimulationResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSimulationResult" ADD CONSTRAINT "UserSimulationResult_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "JobSimulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

