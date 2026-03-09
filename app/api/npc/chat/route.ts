import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { npcChat } from "@/services/openai";
import { buildNpcSystemPrompt } from "@/data/npc-mentors";
import { awardXP, XP_REWARDS } from "@/services/game";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { npcSlug, message, language = "ru" } = body as {
      npcSlug: string;
      message: string;
      language: "en" | "ru" | "kk";
    };

    if (!npcSlug || !message?.trim()) {
      return NextResponse.json({ error: "Missing npcSlug or message" }, { status: 400 });
    }

    // Check if NPC exists
    const npc = await prisma.NpcMentor.findUnique({ where: { slug: npcSlug } });
    if (!npc) return NextResponse.json({ error: "NPC not found" }, { status: 404 });

    // Load recent history
    const history = await prisma.NpcMessage.findMany({
      where: { userId: session.userId, npcId: npc.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const npcData = {
      slug: npc.slug,
      name: npc.name,
      profession: npc.profession,
      professionRu: npc.professionRu,
      professionKk: npc.professionKk,
      personality: npc.personality,
      introMessage: npc.introMessage,
      introMessageRu: npc.introMessageRu,
      introMessageKk: npc.introMessageKk,
      avatarEmoji: npc.avatarEmoji,
      category: npc.category,
    };

    const systemPrompt = buildNpcSystemPrompt(npcData, language);

    let aiResponse: string;
    try {
      aiResponse = await npcChat(
        systemPrompt,
        history.map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
        message
      );
    } catch {
      aiResponse = language === "kk"
        ? "Кешіріңіз, қазір жауап бере алмаймын. Кейінірек көріңіз."
        : language === "ru"
        ? "Извините, не могу ответить прямо сейчас. Попробуйте позже."
        : "Sorry, I can't respond right now. Please try again later.";
    }

    // Save messages
    await prisma.NpcMessage.createMany({
      data: [
        { userId: session.userId, npcId: npc.id, role: "user", content: message },
        { userId: session.userId, npcId: npc.id, role: "assistant", content: aiResponse },
      ],
    });

    // Award XP for chatting with NPC (only for first 10 messages per NPC to prevent farming)
    const msgCount = history.length;
    let xpEarned = 0;
    if (msgCount < 10) {
      try {
        const result = await awardXP(session.userId, XP_REWARDS.npc_chat);
        xpEarned = XP_REWARDS.npc_chat;
      } catch (xpError) {
        console.error("XP award error:", xpError);
        // Continue without XP award
      }
    }

    return NextResponse.json({ success: true, response: aiResponse, xpEarned });
  } catch (error) {
    console.error("NPC chat error:", error);
    return NextResponse.json({ error: "Failed to process NPC message" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const npcSlug = searchParams.get("npcSlug");

    if (!npcSlug) {
      // Return all NPCs with metadata
      const npcs = await prisma.NpcMentor.findMany({ orderBy: { category: "asc" } });
      const chatCounts = await prisma.NpcMessage.groupBy({
        by: ["npcId"],
        where: { userId: session.userId, role: "user" },
        _count: { id: true },
      });
      const countMap = Object.fromEntries(chatCounts.map((c: any) => [c.npcId, c._count.id]));

      return NextResponse.json({
        npcs: npcs.map((n: any) => ({ ...n, messageCount: countMap[n.id] ?? 0 })),
      });
    }

    const npc = await prisma.NpcMentor.findUnique({ where: { slug: npcSlug } });
    if (!npc) return NextResponse.json({ error: "NPC not found" }, { status: 404 });

    const history = await prisma.NpcMessage.findMany({
      where: { userId: session.userId, npcId: npc.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ npc, history });
  } catch (error) {
    console.error("NPC get error:", error);
    return NextResponse.json({ error: "Failed to get NPC data" }, { status: 500 });
  }
}
