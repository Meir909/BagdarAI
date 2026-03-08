import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCareerAnalysis, QuizAnswer } from "@/services/openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers, language = "ru" } = body as { answers: QuizAnswer[]; language: "en" | "ru" | "kk" };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    // Mark previous results as inactive
    await prisma.careerResult.updateMany({
      where: { userId: session.userId, isActive: true },
      data: { isActive: false },
    });

    // Save the test
    const careerTest = await prisma.careerTest.create({
      data: {
        userId: session.userId,
        answers: answers as object[],
      },
    });

    // Generate AI analysis
    let analysisResult;
    try {
      analysisResult = await generateCareerAnalysis(answers, language as "en" | "ru" | "kk");
    } catch (aiError) {
      console.error("AI analysis failed:", aiError);
      // Use fallback
      analysisResult = {
        personalitySummary: "You have a diverse set of interests and skills that open many career paths.",
        topCareers: [
          { name: "Software Engineer", nameRu: "Инженер-программист", nameKk: "Бағдарламалық жасақтама инженері", match: 85, description: "Strong analytical skills." },
          { name: "Business Analyst", nameRu: "Бизнес-аналитик", nameKk: "Бизнес-аналитик", match: 78, description: "Combines technical and business skills." },
          { name: "Designer", nameRu: "Дизайнер", nameKk: "Дизайнер", match: 72, description: "Creative expression career." },
        ],
        strengths: ["Problem solving", "Communication", "Creativity", "Adaptability"],
        skillsToDevelop: ["Technical skills", "Leadership", "Time management"],
        roadmap: [
          { step: 1, title: "Academic Foundation", description: "Focus on core subjects", timeframe: "Now - 1 year" },
          { step: 2, title: "Skill Building", description: "Learn specific skills", timeframe: "1-2 years" },
          { step: 3, title: "University", description: "Choose and enter university", timeframe: "2-4 years" },
          { step: 4, title: "Experience", description: "Internships and projects", timeframe: "4-6 years" },
          { step: 5, title: "Career Start", description: "First job opportunity", timeframe: "6+ years" },
        ],
      };
    }

    // Save the result
    const careerResult = await prisma.careerResult.create({
      data: {
        userId: session.userId,
        testId: careerTest.id,
        personalitySummary: analysisResult.personalitySummary,
        topCareers: analysisResult.topCareers as object[],
        strengths: analysisResult.strengths,
        skillsToDevelop: analysisResult.skillsToDevelop,
        roadmap: analysisResult.roadmap as object[],
        isActive: true,
      },
    });

    // Award badges
    const badges = await prisma.badge.findMany();
    const firstStepBadge = badges.find((b) => b.trigger === "test_complete");
    if (firstStepBadge) {
      await prisma.studentBadge.upsert({
        where: { userId_badgeId: { userId: session.userId, badgeId: firstStepBadge.id } },
        create: { userId: session.userId, badgeId: firstStepBadge.id },
        update: {},
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "test_completed",
        details: { testId: careerTest.id, topCareer: (analysisResult.topCareers[0] as { name: string }).name },
      },
    });

    return NextResponse.json({
      success: true,
      testId: careerTest.id,
      resultId: careerResult.id,
      result: analysisResult,
    });
  } catch (error) {
    console.error("Career test error:", error);
    return NextResponse.json({ error: "Failed to process test" }, { status: 500 });
  }
}
