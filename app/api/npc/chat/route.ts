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
    const { searchParams } = new URL(request.url);
    const npcSlug = searchParams.get("npcSlug");
    const language = searchParams.get("language") || "en";

    // Get conversation history for specific NPC mentor
    if (npcSlug && session && session.role === "student") {
      const npc = await prisma.npcMentor.findUnique({
        where: { slug: npcSlug },
        select: {
          id: true,
          slug: true,
          name: true,
          profession: true,
          professionRu: true,
          professionKk: true,
          introMessage: true,
          introMessageRu: true,
          introMessageKk: true,
          avatarEmoji: true,
          category: true,
        },
      });

      if (!npc) {
        return NextResponse.json({ error: "NPC not found" }, { status: 404 });
      }

      // Check if user has any messages with this NPC
      const messageCount = await prisma.npcMessage.count({
        where: { userId: session.userId, npcId: npc.id },
      });

      // If no messages, create the first intro message (mentor first-message feature)
      if (messageCount === 0) {
        const langMap = { en: "introMessage", ru: "introMessageRu", kk: "introMessageKk" };
        const introField = langMap[language as keyof typeof langMap] || "introMessage";
        const introMsg = npc[introField as keyof typeof npc] as string;

        await prisma.npcMessage.create({
          data: {
            userId: session.userId,
            npcId: npc.id,
            role: "assistant",
            content: introMsg,
          },
        });
      }

      // Get all messages (including the one we just created)
      const history = await prisma.npcMessage.findMany({
        where: { userId: session.userId, npcId: npc.id },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({
        npc: {
          id: npc.id,
          slug: npc.slug,
          name: npc.name,
          profession: npc.profession,
          professionRu: npc.professionRu,
          professionKk: npc.professionKk,
          avatarEmoji: npc.avatarEmoji,
          category: npc.category,
        },
        history: history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });
    }

    // Get all NPC mentors from database (for listing all mentors)
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
