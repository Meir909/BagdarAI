import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCareerAnalysis, RiasecQuizAnswer } from "@/services/openai";
import { RiasecScores } from "@/data/riasec-questions";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      answers,
      riasecScores,
      hollandCode,
      suggestedCareers,
      language = "ru",
    } = body as {
      answers: RiasecQuizAnswer[];
      riasecScores: RiasecScores;
      hollandCode: string;
      suggestedCareers: { en: string; ru: string; kk: string }[];
      language: "en" | "ru" | "kk";
    };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    // Mark previous results as inactive
    await prisma.careerResult.updateMany({
      where: { userId: session.userId, isActive: true },
      data: { isActive: false },
    });

    // Save the test with RIASEC data
    const careerTest = await prisma.careerTest.create({
      data: {
        userId: session.userId,
        answers: {
          questions: answers,
          riasecScores,
          hollandCode,
        } as object,
      },
    });

    // Generate AI analysis using RIASEC data
    let analysisResult;
    try {
      analysisResult = await generateCareerAnalysis(answers, riasecScores, hollandCode, suggestedCareers, language);
    } catch (aiError) {
      console.error("AI analysis failed:", aiError);
      analysisResult = {
        personalitySummary: `Your Holland Code is ${hollandCode}. You have a unique combination of personality traits that open many career paths.`,
        topCareers: suggestedCareers.slice(0, 3).map((c, i) => ({
          name: c.en,
          nameRu: c.ru,
          nameKk: c.kk,
          match: 85 - i * 7,
          description: "Based on your RIASEC profile, this career aligns with your personality type.",
        })),
        strengths: ["Analytical thinking", "Creativity", "Communication", "Problem solving"],
        skillsToDevelop: ["Technical skills", "Leadership", "Time management"],
        roadmap: [
          { step: 1, title: "Academic Foundation", description: "Focus on subjects aligned with your Holland Code", timeframe: "Now - 1 year" },
          { step: 2, title: "Skill Building", description: "Develop core skills for your career path", timeframe: "1-2 years" },
          { step: 3, title: "University", description: "Choose and enter a relevant university program", timeframe: "2-4 years" },
          { step: 4, title: "Experience", description: "Internships and real-world projects", timeframe: "4-6 years" },
          { step: 5, title: "Career Start", description: "Land your first professional role", timeframe: "6+ years" },
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
        details: {
          testId: careerTest.id,
          hollandCode,
          topCareer: (analysisResult.topCareers[0] as { name: string }).name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      testId: careerTest.id,
      resultId: careerResult.id,
      result: analysisResult,
      riasecScores,
      hollandCode,
    });
  } catch (error) {
    console.error("Career test error:", error);
    return NextResponse.json({ error: "Failed to process test" }, { status: 500 });
  }
}
