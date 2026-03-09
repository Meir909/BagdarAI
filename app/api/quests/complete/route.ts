import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/services/game";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userQuestId } = await request.json() as { userQuestId: string };
    if (!userQuestId) return NextResponse.json({ error: "Missing userQuestId" }, { status: 400 });

    const userQuest = await prisma.userQuest.findUnique({
      where: { id: userQuestId },
      include: { quest: true },
    });

    if (!userQuest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    if (userQuest.userId !== session.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (userQuest.completed) return NextResponse.json({ error: "Already completed" }, { status: 400 });
    if (userQuest.expiresAt < new Date()) return NextResponse.json({ error: "Quest expired" }, { status: 400 });

    await prisma.userQuest.update({
      where: { id: userQuestId },
      data: { completed: true, completedAt: new Date() },
    });

    const { newXP, newLevel, leveledUp } = await awardXP(session.userId, userQuest.quest.xpReward);

    return NextResponse.json({
      success: true,
      xpEarned: userQuest.quest.xpReward,
      newXP,
      newLevel,
      leveledUp,
    });
  } catch (error) {
    console.error("Quest complete error:", error);
    return NextResponse.json({ error: "Failed to complete quest" }, { status: 500 });
  }
}
