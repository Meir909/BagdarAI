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
      games: [],
      recentResults: [],
      totalGamesPlayed: 0,
    });
  } catch (error) {
    console.error("Mini games error:", error);
    return NextResponse.json(
      { error: "Failed to get mini games" },
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
      message: "Mini-games temporarily disabled",
    });
  } catch (error) {
    console.error("Mini game result error:", error);
    return NextResponse.json(
      { error: "Failed to save game result" },
      { status: 500 }
    );
  }
}
