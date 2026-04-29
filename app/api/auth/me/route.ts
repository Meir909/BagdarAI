import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        role: user.user_metadata?.role,
        name: user.user_metadata?.name || user.email,
        email: user.email,
        schoolId: user.user_metadata?.school_id,
        schoolName: user.user_metadata?.school_name,
        studentClass: user.user_metadata?.student_class,
        studentCode: user.user_metadata?.student_code,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
