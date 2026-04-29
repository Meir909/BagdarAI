import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, email, password, phone, schoolCode, invitationCode, remember } = body;

    let user;

    switch (role) {
      case "admin": {
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }
        user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== "admin") {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const valid = await bcrypt.compare(password, user.passwordHash || "");
        if (!valid) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        break;
      }

      case "director": {
        if (!phone || !schoolCode || !invitationCode) {
          return NextResponse.json({ error: "Phone, school code, and invitation code are required" }, { status: 400 });
        }

        const school = await prisma.school.findUnique({ where: { schoolCode } });
        if (!school) {
          return NextResponse.json({ error: "invalid_school_code" }, { status: 400 });
        }
        if (school.invitationCode !== invitationCode) {
          return NextResponse.json({ error: "invalid_invitation_code" }, { status: 400 });
        }

        user = await prisma.user.findFirst({ where: { phone, role: "director" } });
        if (!user) {
          return NextResponse.json({ error: "phone_not_found" }, { status: 401 });
        }
        if (user.schoolId !== school.id) {
          return NextResponse.json({ error: "invalid_school_code" }, { status: 401 });
        }
        break;
      }

      case "curator":
      case "parent": {
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }
        user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== role) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const valid = await bcrypt.compare(password, user.passwordHash || "");
        if (!valid) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email ?? undefined, name: user.name }, !!remember);
    const cookieConfig = setAuthCookie(token, !!remember);

    // Get school info
    let schoolName = "";
    if (user.schoolId) {
      const school = await prisma.school.findUnique({ where: { id: user.schoolId } });
      schoolName = school?.name || "";
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        schoolId: user.schoolId,
        schoolName,
        studentClass: user.studentClass,
        studentCode: user.studentCode,
        subscriptionPlan: user.subscriptionPlan,
        aiRequestsUsed: user.aiRequestsUsed,
      },
    });

    response.cookies.set(cookieConfig.name, cookieConfig.value, cookieConfig.options as Parameters<typeof response.cookies.set>[2]);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
