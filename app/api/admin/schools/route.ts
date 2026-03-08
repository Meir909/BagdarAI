import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSchoolCode, generateInvitationCode } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schools = await prisma.school.findMany({
      include: {
        users: {
          where: { role: "director" },
          select: { id: true, name: true, phone: true },
        },
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Get schools error:", error);
    return NextResponse.json({ error: "Failed to get schools" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, directorPhone } = body;

    if (!name || !city) {
      return NextResponse.json({ error: "Name and city are required" }, { status: 400 });
    }

    // Generate unique codes
    let schoolCode: string;
    let invitationCode: string;
    let attempts = 0;

    do {
      schoolCode = generateSchoolCode(city);
      const existing = await prisma.school.findUnique({ where: { schoolCode } });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    do {
      invitationCode = generateInvitationCode(name);
      const existing = await prisma.school.findUnique({ where: { invitationCode } });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    const school = await prisma.school.create({
      data: {
        name,
        city,
        schoolCode: schoolCode!,
        invitationCode: invitationCode!,
        directorPhone: directorPhone || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "school_created",
        details: { schoolId: school.id, name, city },
      },
    });

    return NextResponse.json({ success: true, school });
  } catch (error) {
    console.error("Create school error:", error);
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 });
  }
}
