import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserXP, getLevelFromXP, getLevelTitle, getXPForNextLevel, LEVEL_THRESHOLDS } from "@/services/game";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { xp, level } = await getUserXP(session.userId);
    const progress = getXPForNextLevel(xp);
    const title = getLevelTitle(level);

    return NextResponse.json({
      xp,
      level,
      levelTitle: title,
      progress,
      nextLevelXP: LEVEL_THRESHOLDS[level] ?? null,
    });
  } catch (error) {
    console.error("XP error:", error);
    return NextResponse.json({ error: "Failed to get XP" }, { status: 500 });
  }
}
