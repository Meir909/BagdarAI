import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMentorResponse } from "@/lib/ai/mentorService";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, context } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user info for context
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    // Generate AI mentor response
    const mentorResponse = await generateMentorResponse({
      message,
      context,
      userProgress: {
        totalXP: 0,
        currentLevel: 1,
        levelXP: 0,
        nextLevelXP: 100,
        achievements: [],
        dailyXP: 0,
        weeklyXP: 0,
      },
      conversationHistory: [],
    });

    return NextResponse.json({
      success: true,
      response: mentorResponse.content,
      xpEarned: mentorResponse.xpReward,
      suggestions: mentorResponse.suggestions,
    });
  } catch (error) {
    console.error("Mentor chat error:", error);
    return NextResponse.json(
      { error: "Failed to process mentor message" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      messages: [],
      userProgress: {
        totalXP: 0,
        currentLevel: 1,
        levelXP: 0,
        nextLevelXP: 100,
        achievements: [],
        dailyXP: 0,
        weeklyXP: 0,
      },
      hasMore: false,
    });
  } catch (error) {
    console.error("Mentor history error:", error);
    return NextResponse.json(
      { error: "Failed to get mentor history" },
      { status: 500 }
    );
  }
}
