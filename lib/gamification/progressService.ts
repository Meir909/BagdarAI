import { prisma } from '@/lib/prisma';

export interface UserProgress {
  totalXP: number;
  currentLevel: number;
  levelXP: number;
  nextLevelXP: number;
  achievements: string[];
  dailyXP: number;
  weeklyXP: number;
  unlockedSkills: number;
  completedGames: number;
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    // Get XP progress
    const xpProgress = await prisma.xPProgress.findUnique({
      where: { userId },
    });

    // Get user skills count
    const userSkillsCount = await prisma.userSkill.count({
      where: { userId },
    });

    // Get completed games count
    const gamesCount = await prisma.miniGameResult.count({
      where: { userId },
    });

    // Default values if no progress exists
    const defaultProgress = {
      totalXP: 0,
      currentLevel: 1,
      levelXP: 0,
      nextLevelXP: 100,
      achievements: [],
      dailyXP: 0,
      weeklyXP: 0,
    };

    const xpData = xpProgress || defaultProgress;

    return {
      ...xpData,
      unlockedSkills: userSkillsCount,
      completedGames: gamesCount,
      achievements: Array.isArray(xpData.achievements) ? xpData.achievements : [],
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {
      totalXP: 0,
      currentLevel: 1,
      levelXP: 0,
      nextLevelXP: 100,
      achievements: [],
      dailyXP: 0,
      weeklyXP: 0,
      unlockedSkills: 0,
      completedGames: 0,
    };
  }
}

export async function updateUserProgress(
  userId: string,
  updates: Partial<UserProgress>
): Promise<UserProgress> {
  try {
    const existing = await prisma.xPProgress.findUnique({
      where: { userId },
    });

    if (existing) {
      const updated = await prisma.xPProgress.update({
        where: { userId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
      
      return await getUserProgress(userId);
    } else {
      await prisma.xPProgress.create({
        data: {
          userId,
          totalXP: updates.totalXP || 0,
          currentLevel: updates.currentLevel || 1,
          levelXP: updates.levelXP || 0,
          nextLevelXP: updates.nextLevelXP || 100,
          achievements: updates.achievements || [],
          dailyXP: updates.dailyXP || 0,
          weeklyXP: updates.weeklyXP || 0,
        },
      });
      
      return await getUserProgress(userId);
    }
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function awardXP(
  userId: string,
  amount: number,
  reason: string
): Promise<void> {
  try {
    const currentProgress = await getUserProgress(userId);
    const newTotalXP = currentProgress.totalXP + amount;
    
    // Calculate new level
    const newLevel = calculateLevel(newTotalXP);
    const levelXP = getXPForLevel(newLevel);
    const nextLevelXP = getXPForLevel(newLevel + 1);
    
    // Check for level up
    const leveledUp = newLevel > currentProgress.currentLevel;
    
    // Update progress
    await updateUserProgress(userId, {
      totalXP: newTotalXP,
      currentLevel: newLevel,
      levelXP: levelXP,
      nextLevelXP: nextLevelXP,
      dailyXP: currentProgress.dailyXP + amount,
      weeklyXP: currentProgress.weeklyXP + amount,
    });
    
    // Add achievement if leveled up
    if (leveledUp) {
      await addAchievement(userId, `Reached Level ${newLevel}`);
    }
    
    console.log(`Awarded ${amount} XP to user ${userId} for ${reason}`);
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
}

function calculateLevel(totalXP: number): number {
  let level = 1;
  let requiredXP = 100;
  
  while (totalXP >= requiredXP && level < 50) {
    level++;
    requiredXP += getLevelXPRequirement(level);
  }
  
  return level;
}

function getLevelXPRequirement(level: number): number {
  if (level <= 10) return 100;
  if (level <= 20) return 150;
  if (level <= 30) return 200;
  if (level <= 40) return 300;
  return 500;
}

function getXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += getLevelXPRequirement(i);
  }
  return totalXP;
}

async function addAchievement(userId: string, achievement: string): Promise<void> {
  try {
    const currentProgress = await getUserProgress(userId);
    const achievements = [...currentProgress.achievements];
    
    if (!achievements.includes(achievement)) {
      achievements.push(achievement);
      await updateUserProgress(userId, { achievements });
    }
  } catch (error) {
    console.error('Error adding achievement:', error);
  }
}
