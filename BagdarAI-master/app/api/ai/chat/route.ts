import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { careerChat } from "@/services/openai";

const FREE_LIMIT = 3;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, language = "ru" } = body as { message: string; language: "en" | "ru" | "kk" };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check usage limit
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.subscriptionPlan === "FREE" && user.aiRequestsUsed >= FREE_LIMIT) {
      return NextResponse.json({
        error: "limit_reached",
        message: "Free plan limit of 3 AI requests reached. Upgrade to Pro for unlimited access.",
        aiRequestsUsed: user.aiRequestsUsed,
        limit: FREE_LIMIT,
      }, { status: 429 });
    }

    // Load chat history (last 20 messages)
    const history = await prisma.chatMessage.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Call AI
    let aiResponse: string;
    try {
      aiResponse = await careerChat(
        history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        message,
        language as "en" | "ru" | "kk"
      );
    } catch (aiError) {
      console.error("AI chat failed:", aiError);
      aiResponse = language === "kk"
        ? "Кешіріңіз, қазір жауап бере алмаймын. Кейінірек көріңіз."
        : language === "ru"
        ? "Извините, в данный момент я не могу ответить. Попробуйте позже."
        : "Sorry, I cannot respond right now. Please try again later.";
    }

    // Save messages
    await prisma.chatMessage.createMany({
      data: [
        { userId: session.userId, role: "user", content: message },
        { userId: session.userId, role: "assistant", content: aiResponse },
      ],
    });

    // Increment usage counter
    await prisma.user.update({
      where: { id: session.userId },
      data: { aiRequestsUsed: { increment: 1 } },
    });

    // Award chat badge
    const chatBadge = await prisma.badge.findFirst({ where: { trigger: "chat_first" } });
    if (chatBadge) {
      await prisma.studentBadge.upsert({
        where: { userId_badgeId: { userId: session.userId, badgeId: chatBadge.id } },
        create: { userId: session.userId, badgeId: chatBadge.id },
        update: {},
      });
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      aiRequestsUsed: user.aiRequestsUsed + 1,
      limit: user.subscriptionPlan === "FREE" ? FREE_LIMIT : null,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await prisma.chatMessage.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json({ error: "Failed to get history" }, { status: 500 });
  }
}
