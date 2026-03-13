import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ simulationId: string }> }
) {
  try {
    const { simulationId } = await params;
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.userSimulationResult.findUnique({
      where: {
        userId_simulationId: {
          userId: session.userId,
          simulationId,
        },
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Results not found" }, { status: 404 });
    }

    const missionResults = (result.missionResults as any[]) || [];
    const correctAnswers = missionResults.filter((m) => m.isCorrect).length;
    const totalMissions = missionResults.length;
    const scorePercentage = totalMissions > 0 ? Math.round((correctAnswers / totalMissions) * 100) : 0;

    // Analyze strengths and improvements
    const strengths: string[] = [];
    const improvements: string[] = [];

    missionResults.forEach((mr: any) => {
      if (mr.isCorrect) {
        // Determine what they did well based on mission type
        if (mr.missionId === 1 && mr.userAnswer === "a") {
          strengths.push("Communication Skills");
          strengths.push("Problem Solving");
        } else if (mr.missionId === 2 && mr.userAnswer === "b") {
          strengths.push("Team Collaboration");
          strengths.push("Confidence");
        } else if (mr.missionId === 3 && mr.userAnswer === "b") {
          strengths.push("Project Management");
          strengths.push("Attention to Detail");
        }
      } else {
        if (mr.missionId === 1 && mr.userAnswer !== "a") {
          improvements.push("Code Review Practices");
        } else if (mr.missionId === 2 && mr.userAnswer !== "b") {
          improvements.push("Professional Communication");
        } else if (mr.missionId === 3 && mr.userAnswer !== "b") {
          improvements.push("Requirements Analysis");
        }
      }
    });

    // Remove duplicates
    const uniqueStrengths = [...new Set(strengths)];
    const uniqueImprovements = [...new Set(improvements)];

    // Generate recommendations based on performance
    let recommendation = "";
    if (scorePercentage >= 80) {
      recommendation = "You're ready for senior-level responsibilities. Consider leading technical discussions.";
    } else if (scorePercentage >= 60) {
      recommendation = "You're on the right track. Keep practicing and learning from experienced team members.";
    } else {
      recommendation = "Focus on the fundamentals first. Seek mentorship and practice more.";
    }

    return NextResponse.json({
      resultId: result.id,
      simulationId,
      score: result.score,
      maxScore: result.maxScore,
      correctAnswers,
      totalMissions,
      scorePercentage,
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      recommendation,
      missionDetails: missionResults.map((m: any) => ({
        missionId: m.missionId,
        userAnswer: m.userAnswer,
        isCorrect: m.isCorrect,
        xpEarned: m.xpEarned,
        feedback: m.feedback,
      })),
      completedAt: result.completedAt,
    });
  } catch (error) {
    console.error("Results fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
