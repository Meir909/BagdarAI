import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMentorResponse } from "@/lib/ai/mentorService";
import { getUserProgress } from "@/lib/gamification/progressService";

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

    // Save user message
    await prisma.MentorMessage.create({
      data: {
        userId: session.userId,
        role: "user",
        content: message,
        context: context || null,
      },
    });

    // Get user progress for context
    const userProgress = await getUserProgress(session.userId);
    
    // Get recent conversation history
    const recentMessages = await prisma.MentorMessage.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Generate AI mentor response
    const mentorResponse = await generateMentorResponse({
      message,
      context,
      userProgress,
      conversationHistory: recentMessages.reverse(),
    });

    // Save mentor response
    await prisma.MentorMessage.create({
      data: {
        userId: session.userId,
        role: "assistant",
        content: mentorResponse.content,
        context: context || null,
      },
    });

    // Award XP for mentor interaction
    if (mentorResponse.xpReward > 0) {
      await awardXP(session.userId, mentorResponse.xpReward, "mentor_chat");
    }

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get conversation history
    const messages = await prisma.MentorMessage.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Get user progress for context
    const userProgress = await getUserProgress(session.userId);

    return NextResponse.json({
      messages: messages.reverse(),
      userProgress,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error("Mentor history error:", error);
    return NextResponse.json(
      { error: "Failed to get mentor history" },
      { status: 500 }
    );
  }
}
