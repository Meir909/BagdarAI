import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie, COOKIE_NAME } from "@/lib/auth";
import { generateStudentCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, name, email, password, schoolCode, invitationCode, studentClass, studentCode, phone } = body;

    if (!role || !name) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    let user;

    switch (role) {
      case "student": {
        if (!schoolCode || !studentClass) {
          return NextResponse.json({ error: "School code and class are required" }, { status: 400 });
        }

        const school = await prisma.school.findUnique({ where: { schoolCode } });
        if (!school) {
          return NextResponse.json({ error: "invalid_school_code" }, { status: 400 });
        }

        // Idempotency: Check if student with same email/phone already exists (prevent duplicates)
        if (email) {
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing && existing.role === "student") {
            // Return existing student (idempotent)
            user = existing;
            break;
          }
        }
        if (phone) {
          const existing = await prisma.user.findFirst({ where: { phone, role: "student" } });
          if (existing) {
            // Return existing student
            user = existing;
            break;
          }
        }

        // Find a curator for this class (optional - assign to first available curator in school)
        const curator = await prisma.user.findFirst({
          where: { schoolId: school.id, role: "curator" },
        });

        const newStudentCode = generateStudentCode();

        user = await prisma.user.create({
          data: {
            role: "student",
            name,
            email: email || undefined,
            phone: phone || undefined,
            schoolId: school.id,
            studentClass,
            studentCode: newStudentCode,
            curatorId: curator?.id ?? undefined,
          },
        });

        // Award "First Step" will happen on test completion
        break;
      }

      case "parent": {
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        let childId: string | undefined;

        if (studentCode) {
          const child = await prisma.user.findUnique({ where: { studentCode } });
          if (!child) {
            return NextResponse.json({ error: "invalid_student_code" }, { status: 400 });
          }
          // Check if the child already has a parent
          const existingParent = await prisma.user.findFirst({ where: { childId: child.id } });
          if (!existingParent) {
            childId = child.id;
          }
        }

        user = await prisma.user.create({
          data: {
            role: "parent",
            name,
            email,
            passwordHash,
            childId: childId ?? undefined,
          },
        });
        break;
      }

      case "curator": {
        if (!email || !password || !invitationCode) {
          return NextResponse.json({ error: "Email, password and invitation code are required" }, { status: 400 });
        }

        const school = await prisma.school.findUnique({ where: { invitationCode } });
        if (!school) {
          return NextResponse.json({ error: "invalid_invitation_code" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        user = await prisma.user.create({
          data: {
            role: "curator",
            name,
            email,
            passwordHash,
            schoolId: school.id,
          },
        });

        await prisma.auditLog.create({
          data: { userId: user.id, action: "curator_registered", details: { schoolId: school.id } },
        });
        break;
      }

      case "individual_student": {
        // B2C student without school
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newStudentCode = generateStudentCode();

        user = await prisma.user.create({
          data: {
            role: "student",
            name,
            email,
            passwordHash,
            studentClass: body.studentClass || "Individual",
            studentCode: newStudentCode,
          },
        });

        await prisma.auditLog.create({
          data: { userId: user.id, action: "student_registered", details: { type: "individual" } },
        });
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (role === "student") {
      await prisma.auditLog.create({
        data: { userId: user.id, action: "student_registered", details: { schoolId: user.schoolId, class: studentClass } },
      });
    }

    const token = signToken({ userId: user.id, role: user.role, email: user.email ?? undefined, name: user.name });
    const cookieConfig = setAuthCookie(token);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, role: user.role, name: user.name, email: user.email, studentCode: user.studentCode },
    });

    response.cookies.set(cookieConfig.name, cookieConfig.value, cookieConfig.options as Parameters<typeof response.cookies.set>[2]);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
