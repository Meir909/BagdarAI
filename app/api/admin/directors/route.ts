import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, schoolId } = body;

    if (!name || !phone || !schoolId) {
      return NextResponse.json({ error: "Name, phone, and school are required" }, { status: 400 });
    }

    // Check if phone already exists
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
    }

    // Check school exists
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Update school director phone if not set
    if (!school.directorPhone) {
      await prisma.school.update({ where: { id: schoolId }, data: { directorPhone: phone } });
    }

    const director = await prisma.user.create({
      data: {
        role: "director",
        name,
        phone,
        schoolId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "director_registered",
        details: { directorId: director.id, schoolId, phone },
      },
    });

    return NextResponse.json({ success: true, director: { id: director.id, name: director.name, phone: director.phone } });
  } catch (error) {
    console.error("Create director error:", error);
    return NextResponse.json({ error: "Failed to create director" }, { status: 500 });
  }
}
