import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    let students;

    if (session.role === "curator") {
      students = await prisma.user.findMany({
        where: { curatorId: session.userId, role: "student" },
        include: {
          careerResults: {
            where: { isActive: true },
            take: 1,
          },
          studentBadges: { include: { badge: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } else if (session.role === "director") {
      const director = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!director?.schoolId) return NextResponse.json({ error: "No school assigned" }, { status: 400 });

      students = await prisma.user.findMany({
        where: { schoolId: director.schoolId, role: "student" },
        include: {
          careerResults: {
            where: { isActive: true },
            take: 1,
          },
          curator: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const total = students.length;

    return NextResponse.json({
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        class: s.studentClass,
        studentCode: s.studentCode,
        testCompleted: s.careerResults.length > 0,
        topCareer: s.careerResults[0]
          ? ((s.careerResults[0].topCareers as Array<{ name: string }>)[0]?.name || null)
          : null,
        aiScore: s.careerResults[0]
          ? ((s.careerResults[0].topCareers as Array<{ match: number }>)[0]?.match || null)
          : null,
        curatorName: (s as { curator?: { name: string } | null }).curator?.name || null,
        createdAt: s.createdAt,
      })),
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Students error:", error);
    return NextResponse.json({ error: "Failed to get students" }, { status: 500 });
  }
}
