import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Get user metadata
    const role = user.user_metadata?.role;
    const schoolId = user.user_metadata?.school_id;
    const schoolName = user.user_metadata?.school_name;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role: role,
        name: user.user_metadata?.name || user.email,
        email: user.email,
        schoolId: schoolId,
        schoolName: schoolName,
        studentClass: user.user_metadata?.student_class,
        studentCode: user.user_metadata?.student_code,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
