import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const simulations = await prisma.careerSimulation.findMany({
      orderBy: [{ category: "asc" }, { difficulty: "asc" }],
    });

    // If student, attach their completion status
    let completedIds: string[] = [];
    if (session.role === "student") {
      const results = await prisma.simulationResult.findMany({
        where: { userId: session.userId },
        select: { simulationId: true },
      });
      completedIds = results.map((r) => r.simulationId);
    }

    return NextResponse.json({
      simulations: simulations.map((s) => ({
        ...s,
        completed: completedIds.includes(s.id),
      })),
    });
  } catch (error) {
    console.error("Simulations error:", error);
    return NextResponse.json({ error: "Failed to get simulations" }, { status: 500 });
  }
}
