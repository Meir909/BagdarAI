-- Gamification Database Schema for BagdarAI

-- Skills Table
CREATE TABLE "Skill" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "xpRequired" INTEGER NOT NULL DEFAULT 0,
  "level" INTEGER NOT NULL DEFAULT 1,
  "icon" TEXT,
  "parentId" TEXT,
  "unlocks" TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Skill_category_idx" ON "Skill"("category");
CREATE INDEX "Skill_parentId_idx" ON "Skill"("parentId");

-- User Skills Progress Table
CREATE TABLE "UserSkill" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "skillId" TEXT NOT NULL,
  "unlockedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "progress" INTEGER NOT NULL DEFAULT 0,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");

-- Skill Tree Paths
CREATE TABLE "SkillTreePath" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "color" TEXT,
  "prerequisites" TEXT[],
  "totalSkills" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SkillTreePath_pkey" PRIMARY KEY ("id")
);

-- Mini Games Table
CREATE TABLE "MiniGame" (
  "id" TEXT NOT NULL,
  "career" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL,
  "duration" INTEGER NOT NULL DEFAULT 300, -- seconds
  "tasks" JSONB NOT NULL DEFAULT '[]',
  "xpReward" INTEGER NOT NULL DEFAULT 30,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MiniGame_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MiniGame_career_idx" ON "MiniGame"("career");
CREATE INDEX "MiniGame_category_idx" ON "MiniGame"("category");

-- Mini Game Results
CREATE TABLE "MiniGameResult" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "gameId" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
  "totalTasks" INTEGER NOT NULL DEFAULT 0,
  "timeSpent" INTEGER NOT NULL DEFAULT 0,
  "xpEarned" INTEGER NOT NULL DEFAULT 0,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MiniGameResult_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MiniGameResult_userId_idx" ON "MiniGameResult"("userId");
CREATE INDEX "MiniGameResult_gameId_idx" ON "MiniGameResult"("gameId");

-- Mentor Messages
CREATE TABLE "MentorMessage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL, -- 'user' | 'assistant'
  "content" TEXT NOT NULL,
  "context" TEXT, -- Optional context for the conversation
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MentorMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MentorMessage_userId_idx" ON "MentorMessage"("userId");
CREATE INDEX "MentorMessage_createdAt_idx" ON "MentorMessage"("createdAt");

-- XP Progress and Achievements
CREATE TABLE "XPProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "totalXP" INTEGER NOT NULL DEFAULT 0,
  "currentLevel" INTEGER NOT NULL DEFAULT 1,
  "levelXP" INTEGER NOT NULL DEFAULT 0,
  "nextLevelXP" INTEGER NOT NULL DEFAULT 100,
  "achievements" JSONB NOT NULL DEFAULT '[]',
  "dailyXP" INTEGER NOT NULL DEFAULT 0,
  "weeklyXP" INTEGER NOT NULL DEFAULT 0,
  "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "XPProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "XPProgress_userId_key" ON "XPProgress"("userId");

-- Daily Quests
CREATE TABLE "DailyQuest" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- 'mini_game' | 'skill_unlock' | 'mentor_chat'
  "target" INTEGER NOT NULL,
  "xpReward" INTEGER NOT NULL DEFAULT 10,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "date" DATE NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DailyQuest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DailyQuest_date_idx" ON "DailyQuest"("date");

-- User Daily Quest Progress
CREATE TABLE "UserDailyQuest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questId" TEXT NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserDailyQuest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserDailyQuest_userId_questId_key" ON "UserDailyQuest"("userId", "questId");

-- Foreign Keys
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" 
FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Skill" ADD CONSTRAINT "Skill_parentId_fkey" 
FOREIGN KEY ("parentId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MiniGameResult" ADD CONSTRAINT "MiniGameResult_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MiniGameResult" ADD CONSTRAINT "MiniGameResult_gameId_fkey" 
FOREIGN KEY ("gameId") REFERENCES "MiniGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MentorMessage" ADD CONSTRAINT "MentorMessage_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "XPProgress" ADD CONSTRAINT "XPProgress_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserDailyQuest" ADD CONSTRAINT "UserDailyQuest_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserDailyQuest" ADD CONSTRAINT "UserDailyQuest_questId_fkey" 
FOREIGN KEY ("questId") REFERENCES "DailyQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
