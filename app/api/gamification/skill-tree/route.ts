import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data for now
    return NextResponse.json({
      skillTree: [],
      userProgress: [],
      totalSkills: 0,
      unlockedSkills: 0,
    });
  } catch (error) {
    console.error("Skill tree error:", error);
    return NextResponse.json(
      { error: "Failed to get skill tree" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: "Skill system temporarily disabled",
    });
  } catch (error) {
    console.error("Skill tree action error:", error);
    return NextResponse.json(
      { error: "Failed to process skill action" },
      { status: 500 }
    );
  }
}
