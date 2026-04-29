import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  console.log("[LOGIN] Received login request");
  
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log("[LOGIN] Email:", email);

    if (!email || !password) {
      console.log("[LOGIN] Missing email or password");
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    console.log("[LOGIN] Creating Supabase client...");
    const supabase = await createClient();
    console.log("[LOGIN] Supabase client created");

    console.log("[LOGIN] Calling signInWithPassword...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("[LOGIN] signInWithPassword result:", error ? "error" : "success");

    if (error) {
      console.log("[LOGIN] Auth error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    if (!user) {
      console.log("[LOGIN] No user returned");
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    console.log("[LOGIN] Success for user:", user.id);
    
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
    console.error("[LOGIN] Unexpected error:", error);
    return NextResponse.json({ error: "Login failed: " + (error as Error).message }, { status: 500 });
  }
}
