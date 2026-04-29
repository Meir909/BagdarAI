import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getTodayExpiry(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export async function GET() {
  try {
    const session = await getSession();
    // Allow unauthenticated access, but only return generic quests for guests
    if (!session || session.role !== "student") {
      // Return empty list for guests - they see blurred preview on page
      return NextResponse.json({ quests: [] });
    }

    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get today's assigned quests
    let userQuests = await prisma.userQuest.findMany({
      where: {
        userId: session.userId,
        assignedAt: { gte: todayStart },
        expiresAt: { gt: now },
      },
      include: { quest: true },
    });

    // If no quests for today, assign 3 random quests
    if (userQuests.length === 0) {
      const allQuests = await prisma.dailyQuest.findMany();
      if (allQuests.length === 0) {
        return NextResponse.json({ quests: [] });
      }

      // Deterministic daily selection using date seed
      const dateNum = todayStart.getFullYear() * 10000 + (todayStart.getMonth() + 1) * 100 + todayStart.getDate();
      const userNum = session.userId.charCodeAt(0) + session.userId.charCodeAt(1);
      let seed = dateNum + userNum;
      const picked: typeof allQuests = [];
      const indices = new Set<number>();

      while (picked.length < Math.min(3, allQuests.length)) {
        seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
        const idx = seed % allQuests.length;
        if (!indices.has(idx)) {
          indices.add(idx);
          picked.push(allQuests[idx]);
        }
      }

      const expiresAt = getTodayExpiry();
      await prisma.userQuest.createMany({
        data: picked.map((q) => ({
          userId: session.userId,
          questId: q.id,
          expiresAt,
        })),
        skipDuplicates: true,
      });

      userQuests = await prisma.userQuest.findMany({
        where: { userId: session.userId, assignedAt: { gte: todayStart }, expiresAt: { gt: now } },
        include: { quest: true },
      });
    }

    return NextResponse.json({
      quests: userQuests.map((uq) => ({
        id: uq.id,
        questId: uq.questId,
        type: uq.quest.type,
        title: uq.quest.title,
        titleRu: uq.quest.titleRu,
        titleKk: uq.quest.titleKk,
        description: uq.quest.description,
        descriptionRu: uq.quest.descriptionRu,
        descriptionKk: uq.quest.descriptionKk,
        xpReward: uq.quest.xpReward,
        icon: uq.quest.icon,
        completed: uq.completed,
        completedAt: uq.completedAt,
        expiresAt: uq.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Quests error:", error);
    return NextResponse.json({ error: "Failed to get quests" }, { status: 500 });
  }
}
