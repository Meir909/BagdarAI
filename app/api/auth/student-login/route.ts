import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";

/**
 * POST /api/auth/student-login
 * School student login by studentCode (no email/password required).
 * Used by BagdarAI mobile app.
 */
export async function POST(request: NextRequest) {
  try {
    const { studentCode } = await request.json();

    if (!studentCode?.trim()) {
      return NextResponse.json({ error: "Student code is required" }, { status: 400 });
    }

    const student = await prisma.user.findUnique({
      where: { studentCode: studentCode.trim().toUpperCase() },
    });

    if (!student || student.role !== "student") {
      return NextResponse.json({ error: "invalid_student_code" }, { status: 404 });
    }

    const token = signToken({
      userId: student.id,
      role: student.role,
      email: student.email ?? undefined,
      name: student.name,
    });

    const cookieConfig = setAuthCookie(token);

    const response = NextResponse.json({
      success: true,
      user: {
        id: student.id,
        role: student.role,
        name: student.name,
        email: student.email,
        studentCode: student.studentCode,
        studentClass: student.studentClass,
        schoolId: student.schoolId,
      },
    });

    response.cookies.set(
      cookieConfig.name,
      cookieConfig.value,
      cookieConfig.options as Parameters<typeof response.cookies.set>[2]
    );

    return response;
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
