import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateCareerRoadmap } from "@/services/openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { career, language = "ru" } = body as { career: string; language: "en" | "ru" | "kk" };

    if (!career) {
      return NextResponse.json({ error: "Career name is required" }, { status: 400 });
    }

    const roadmap = await generateCareerRoadmap(career, language as "en" | "ru" | "kk");

    return NextResponse.json({ success: true, roadmap });
  } catch (error) {
    console.error("Roadmap error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
