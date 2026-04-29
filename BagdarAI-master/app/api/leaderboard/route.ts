import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    // Allow unauthenticated access - show global leaderboard
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "global"; // global | school | class

    let whereClause: { schoolId?: string; studentClass?: string } = {};

    // Only filter by school/class if user is authenticated
    if ((type === "school" || type === "class") && session) {
      const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!currentUser?.schoolId) {
        return NextResponse.json({ error: "No school assigned" }, { status: 400 });
      }
      whereClause.schoolId = currentUser.schoolId;

      if (type === "class" && currentUser.studentClass) {
        whereClause.studentClass = currentUser.studentClass;
      }
    }

    // Temporary fix: Use User table directly without XP system
    const topUsers = await prisma.user.findMany({
      where: {
        role: "student",
        ...whereClause,
      },
      select: {
        id: true,
        name: true,
        studentClass: true,
        schoolId: true,
        school: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const board = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      name: user.name,
      class: user.studentClass,
      schoolName: user.school?.name ?? null,
      xp: 0, // Default XP
      level: 1, // Default level
      isCurrentUser: session ? user.id === session.userId : false,
    }));

    // Find current user rank if authenticated and not in top 50
    let currentUserEntry = session ? board.find((e) => e.isCurrentUser) ?? null : null;
    if (session && !currentUserEntry) {
      const myUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, studentClass: true, schoolId: true, createdAt: true }
      });
      if (myUser) {
        const countAbove = await prisma.user.count({
          where: {
            role: "student",
            ...whereClause,
            createdAt: { lt: myUser.createdAt }
          },
        });
        currentUserEntry = {
          rank: countAbove + 1,
          userId: myUser.id,
          name: myUser.name,
          class: myUser.studentClass,
          schoolName: null,
          xp: 0,
          level: 1,
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
