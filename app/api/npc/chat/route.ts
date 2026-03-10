import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { npcSlug, message, language } = body;

    if (!npcSlug || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For now, return a mock response
    // In production, integrate with LLM API
    const responses: Record<string, string> = {
      almas: "That's a great question! In software engineering, we focus on writing clean, maintainable code.",
      ayaru: "Product management is about understanding user needs and building solutions that matter.",
      omir: "Data science is all about turning raw data into actionable insights for business.",
    };

    const response = responses[npcSlug] || "Thanks for the question! That's an interesting topic.";

    return NextResponse.json({
      response,
      xpEarned: 10,
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

    // Get all NPCs for the grid
    const npcList = [
      { id: "1", name: "Алмас", slug: "almas", profession: "Software Engineer", professionRu: "Программист", professionKk: "Бағдарлама өндіктеушісі", avatarEmoji: "👨‍💻", category: "Tech", messageCount: 0 },
      { id: "2", name: "Айару", slug: "ayaru", profession: "Product Manager", professionRu: "Менеджер продукта", professionKk: "Өнім менеджері", avatarEmoji: "👩‍💼", category: "Management", messageCount: 0 },
      { id: "3", name: "Өмір", slug: "omir", profession: "Data Scientist", professionRu: "Специалист по данным", professionKk: "Деректер ғалымы", avatarEmoji: "📊", category: "Tech", messageCount: 0 },
    ];

    // If authenticated, get actual chat counts
    if (session && session.role === "student") {
      // In real implementation, fetch from database
      // For now, return the list as is
    }

    return NextResponse.json({ npcs: npcList });
  } catch (error) {
    console.error("NPC get error:", error);
    return NextResponse.json({ error: "Failed to get NPC data" }, { status: 500 });
  }
}
