import { prisma } from "@/lib/prisma";

// XP required to reach each level (cumulative)
// Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, ...
export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

export const XP_REWARDS = {
  simulation_complete: 50,   // base, overridden by simulation.xpReward
  simulation_perfect: 20,    // bonus for 100% score
  daily_quest: 20,
  ai_question: 10,
  npc_chat: 10,
  test_riasec: 30,
  test_mbti: 20,
  test_aptitude: 20,
} as const;

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; level: number } {
  const level = getLevelFromXP(currentXP);
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
  const prevThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  return {
    current: currentXP - prevThreshold,
    needed: nextThreshold - prevThreshold,
    level,
  };
}

export async function awardXP(userId: string, amount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const existing = await prisma.userXP.findUnique({ where: { userId } });
  const oldXP = existing?.xp ?? 0;
  const oldLevel = getLevelFromXP(oldXP);

  const newXP = oldXP + amount;
  const newLevel = getLevelFromXP(newXP);

  await prisma.userXP.upsert({
    where: { userId },
    create: { userId, xp: newXP, level: newLevel },
    update: { xp: newXP, level: newLevel },
  });

  return { newXP, newLevel, leveledUp: newLevel > oldLevel };
}

export async function getUserXP(userId: string): Promise<{ xp: number; level: number }> {
  const record = await prisma.userXP.findUnique({ where: { userId } });
  return { xp: record?.xp ?? 0, level: record?.level ?? 1 };
}

export function getLevelTitle(level: number): { en: string; ru: string; kk: string } {
  const titles: Record<number, { en: string; ru: string; kk: string }> = {
    1:  { en: "Beginner",      ru: "Новичок",        kk: "Жаңадан бастаушы" },
    2:  { en: "Explorer",      ru: "Исследователь",  kk: "Зерттеуші" },
    3:  { en: "Adventurer",    ru: "Авантюрист",     kk: "Авантюрист" },
    4:  { en: "Achiever",      ru: "Достигатель",    kk: "Жетістікке жеткен" },
    5:  { en: "Specialist",    ru: "Специалист",     kk: "Маман" },
    6:  { en: "Expert",        ru: "Эксперт",        kk: "Сарапшы" },
    7:  { en: "Champion",      ru: "Чемпион",        kk: "Чемпион" },
    8:  { en: "Master",        ru: "Мастер",         kk: "Шебер" },
    9:  { en: "Grandmaster",   ru: "Грандмастер",    kk: "Гранд шебер" },
    10: { en: "Legend",        ru: "Легенда",        kk: "Аңыз" },
  };
  return titles[Math.min(level, 10)] ?? titles[10];
}
