import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        school: { select: { id: true, name: true, city: true } },
        careerResults: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        studentBadges: {
          include: { badge: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        schoolId: user.schoolId,
        schoolName: user.school?.name,
        studentClass: user.studentClass,
        studentCode: user.studentCode,
        subscriptionPlan: user.subscriptionPlan,
        aiRequestsUsed: user.aiRequestsUsed,
        careerResult: user.careerResults[0] || null,
        badges: user.studentBadges.map((sb) => ({ ...sb.badge, earnedAt: sb.earnedAt })),
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
