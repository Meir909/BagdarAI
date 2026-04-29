import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Simple text/JSON report (PDF generation would require a separate library)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId") || session.userId;
    const format = searchParams.get("format") || "json";

    // Authorization check
    let canAccess = false;
    if (session.role === "student" && studentId === session.userId) canAccess = true;
    if (session.role === "parent") {
      const parent = await prisma.user.findUnique({ where: { id: session.userId } });
      if (parent?.childId === studentId) canAccess = true;
    }
    if (session.role === "curator") {
      const student = await prisma.user.findUnique({ where: { id: studentId } });
      if (student?.curatorId === session.userId) canAccess = true;
    }
    if (session.role === "director") {
      const director = await prisma.user.findUnique({ where: { id: session.userId } });
      const student = await prisma.user.findUnique({ where: { id: studentId } });
      if (director?.schoolId && director.schoolId === student?.schoolId) canAccess = true;
    }
    if (session.role === "admin") canAccess = true;

    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        school: true,
        careerResults: {
          where: { isActive: true },
          take: 1,
        },
        studentBadges: { include: { badge: true } },
      },
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const result = student.careerResults[0];

    const reportData = {
      generatedAt: new Date().toISOString(),
      student: {
        name: student.name,
        class: student.studentClass,
        school: student.school?.name || "Individual",
        studentCode: student.studentCode,
      },
      careerAnalysis: result
        ? {
            personalitySummary: result.personalitySummary,
            topCareers: result.topCareers,
            strengths: result.strengths,
            skillsToDevelop: result.skillsToDevelop,
            roadmap: result.roadmap,
          }
        : null,
      badges: student.studentBadges.map((sb) => ({
        name: sb.badge.name,
        icon: sb.badge.icon,
        earnedAt: sb.earnedAt,
      })),
    };

    if (format === "json") {
      return NextResponse.json(reportData);
    }

    // For CSV format
    if (format === "csv") {
      const topCareer = (result?.topCareers as Array<{ name: string; match: number }> | null)?.[0];
      const csv = [
        "Name,Class,School,Top Career,Match %,Test Completed",
        `"${student.name}","${student.studentClass}","${student.school?.name || "Individual"}","${topCareer?.name || "N/A"}","${topCareer?.match || 0}","${!!result}"`,
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="report-${student.name}.csv"`,
        },
      });
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
