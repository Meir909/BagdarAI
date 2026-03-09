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

    const body = await request.json();
    const { simulationId, score, maxScore, choices } = body as {
      simulationId: string;
      score: number;
      maxScore: number;
      choices: Array<{ scenarioId: number; optionId: string }>;
    };

    if (!simulationId || score === undefined || !maxScore) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const simulation = await prisma.careerSimulation.findUnique({
      where: { id: simulationId },
    });
    if (!simulation) return NextResponse.json({ error: "Simulation not found" }, { status: 404 });

    // Calculate XP: base reward scaled by score percentage
    const pct = score / maxScore;
    let xpEarned = Math.round(simulation.xpReward * pct);
    // Bonus for perfect score
    if (pct === 1) xpEarned += 20;

    // Upsert result (allow retakes — keep best score)
    const existing = await prisma.simulationResult.findUnique({
      where: { userId_simulationId: { userId: session.userId, simulationId } },
    });

    let isNewCompletion = false;
    if (!existing) {
      await prisma.simulationResult.create({
        data: { userId: session.userId, simulationId, score, maxScore, choices, xpEarned },
      });
      isNewCompletion = true;
    } else if (score > existing.score) {
      // Update only if better score
      const xpDiff = xpEarned - existing.xpEarned;
      await prisma.simulationResult.update({
        where: { userId_simulationId: { userId: session.userId, simulationId } },
        data: { score, maxScore, choices, xpEarned, completedAt: new Date() },
      });
      if (xpDiff > 0) {
        await awardXP(session.userId, xpDiff);
        return NextResponse.json({ success: true, xpEarned: xpDiff, improved: true });
      }
      return NextResponse.json({ success: true, xpEarned: 0, improved: true });
    }

    // Award XP for new completion
    const { newXP, newLevel, leveledUp } = await awardXP(session.userId, xpEarned);

    // Award badge for first simulation
    const simBadge = await prisma.badge.findFirst({ where: { trigger: "first_simulation" } });
    if (simBadge) {
      await prisma.studentBadge.upsert({
        where: { userId_badgeId: { userId: session.userId, badgeId: simBadge.id } },
        create: { userId: session.userId, badgeId: simBadge.id },
        update: {},
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "simulation_completed",
        details: { simulationId, score, maxScore, xpEarned, isNewCompletion },
      },
    });

    return NextResponse.json({ success: true, xpEarned, newXP, newLevel, leveledUp });
  } catch (error) {
    console.error("Simulation complete error:", error);
    return NextResponse.json({ error: "Failed to save simulation result" }, { status: 500 });
  }
}
