import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { npcChat } from "@/services/openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { npcId, message, language = "en", history = [] } = body;

    if (!npcId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get NPC mentor data
    const npc = await prisma.npcMentor.findUnique({ where: { id: npcId } });
    if (!npc) {
      return NextResponse.json({ error: "NPC not found" }, { status: 404 });
    }

    // Build system prompt
    const langMap = { en: "English", ru: "Russian", kk: "Kazakh" };
    const langName = langMap[language as keyof typeof langMap] || "English";

    const npcSystemPrompt = `You are ${npc.name}, a ${npc.profession}. Your personality: ${npc.personality}.

Always respond in ${langName}. Be supportive, practical, and share real-world insights from your experience.
Keep responses concise (2-3 paragraphs max) and engaging. Ask follow-up questions to help the student think deeply.`;

    // Get AI response
    const aiResponse = await npcChat(npcSystemPrompt, history, message);

    // Save message to database
    await prisma.npcMessage.create({
      data: {
        userId: session.userId,
        npcId: npc.id,
        role: "user",
        content: message,
      },
    });

    await prisma.npcMessage.create({
      data: {
        userId: session.userId,
        npcId: npc.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({
      response: aiResponse,
      xpEarned: 15,
    });
  } catch (error) {
    console.error("NPC chat error:", error);
    return NextResponse.json({ error: "Failed to process NPC message" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    // Allow unauthenticated access - return all NPCs

    // Get all NPC mentors from database
    const npcs = await prisma.npcMentor.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        profession: true,
        professionRu: true,
        professionKk: true,
        avatarEmoji: true,
        category: true,
      },
    });

    // If authenticated, count messages
    let npcList = npcs.map((npc) => ({
      ...npc,
      messageCount: 0,
    }));

    if (session && session.role === "student") {
      npcList = await Promise.all(
        npcs.map(async (npc) => {
          const count = await prisma.npcMessage.count({
            where: { userId: session.userId, npcId: npc.id },
          });
          return { ...npc, messageCount: count };
        })
      );
    }

    return NextResponse.json({ npcs: npcList });
  } catch (error) {
    console.error("NPC get error:", error);
    return NextResponse.json({ error: "Failed to get NPC data" }, { status: 500 });
  }
}
