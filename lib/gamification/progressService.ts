import { prisma } from '@/lib/prisma';
import { getLevelFromXP, getXPForNextLevel, getLevelTitle } from '@/services/game';

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
    const xpRecord = await prisma.userXP.findUnique({ where: { userId } });
    const completedGames = await prisma.simulationResult.count({ where: { userId } });

    const totalXP = xpRecord?.xp ?? 0;
    const currentLevel = xpRecord?.level ?? 1;
    const progress = getXPForNextLevel(totalXP);

    return {
      totalXP,
      currentLevel,
      levelXP: progress.current,
      nextLevelXP: progress.needed,
      achievements: [],
      dailyXP: 0,
      weeklyXP: 0,
      unlockedSkills: 0,
      completedGames,
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
