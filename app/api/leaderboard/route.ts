import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "global"; // global | school | class

    let whereClause: { schoolId?: string; studentClass?: string } = {};

    if (type === "school" || type === "class") {
      const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!currentUser?.schoolId) {
        return NextResponse.json({ error: "No school assigned" }, { status: 400 });
      }
      whereClause.schoolId = currentUser.schoolId;

      if (type === "class" && currentUser.studentClass) {
        whereClause.studentClass = currentUser.studentClass;
      }
    }

    const topUsers = await prisma.userXP.findMany({
      where: {
        user: { role: "student", ...whereClause },
      },
      include: {
        user: {
          select: { id: true, name: true, studentClass: true, schoolId: true, school: { select: { name: true } } },
        },
      },
      orderBy: { xp: "desc" },
      take: 50,
    });

    const board = topUsers.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      name: entry.user.name,
      class: entry.user.studentClass,
      schoolName: entry.user.school?.name ?? null,
      xp: entry.xp,
      level: entry.level,
      isCurrentUser: entry.userId === session.userId,
    }));

    // Find current user rank if not in top 50
    let currentUserEntry = board.find((e) => e.isCurrentUser) ?? null;
    if (!currentUserEntry) {
      const myXP = await prisma.userXP.findUnique({ where: { userId: session.userId } });
      if (myXP) {
        const countAbove = await prisma.userXP.count({
          where: { xp: { gt: myXP.xp }, user: { role: "student", ...whereClause } },
        });
        currentUserEntry = {
          rank: countAbove + 1,
          userId: session.userId,
          name: "",
          class: null,
          schoolName: null,
          xp: myXP.xp,
          level: myXP.level,
          isCurrentUser: true,
        };
      }
    }

    return NextResponse.json({ leaderboard: board, currentUser: currentUserEntry, type });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to get leaderboard" }, { status: 500 });
  }
}
