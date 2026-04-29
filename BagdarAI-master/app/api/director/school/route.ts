import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "director") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const director = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!director?.schoolId) {
      return NextResponse.json({ error: "No school assigned" }, { status: 400 });
    }

    const school = await prisma.school.findUnique({
      where: { id: director.schoolId },
      select: { id: true, name: true, city: true, schoolCode: true, invitationCode: true },
    });

    return NextResponse.json({ school });
  } catch (error) {
    console.error("Director school error:", error);
    return NextResponse.json({ error: "Failed to get school" }, { status: 500 });
  }
}
