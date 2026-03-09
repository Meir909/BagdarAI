import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    // Get available mini-games
    let whereClause: any = {};
    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;

    const games = await prisma.MiniGame.findMany({
      where: whereClause,
      orderBy: { category: "asc" },
    });

    // Get user's game results
    const userResults = await prisma.MiniGameResult.findMany({
      where: { userId: session.userId },
      include: { game: true },
      orderBy: { completedAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      games,
      recentResults: userResults,
      totalGamesPlayed: userResults.length,
    });
  } catch (error) {
    console.error("Mini games error:", error);
    return NextResponse.json(
      { error: "Failed to get mini games" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, results, timeSpent } = body;

    if (!gameId || !results) {
      return NextResponse.json(
        { error: "Game ID and results are required" },
        { status: 400 }
      );
    }

    // Get game details
    const game = await prisma.MiniGame.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Calculate score and XP
    const correctAnswers = results.filter((r: any) => r.isCorrect).length;
    const totalTasks = results.length;
    const score = Math.round((correctAnswers / totalTasks) * 100);
    const xpEarned = Math.round((score / 100) * game.xpReward);

    // Save game result
    const gameResult = await prisma.MiniGameResult.create({
      data: {
        userId: session.userId,
        gameId,
        score,
        tasksCompleted: correctAnswers,
        totalTasks,
        timeSpent: timeSpent || 0,
        xpEarned,
      },
    });

    // Award XP
    await awardXP(session.userId, xpEarned, "mini_game_complete");

    // Check for achievements
    const achievements = await checkAchievements(session.userId);

    return NextResponse.json({
      success: true,
      result: gameResult,
      xpEarned,
      achievements,
      feedback: generateFeedback(game, score),
    });
  } catch (error) {
    console.error("Mini game result error:", error);
    return NextResponse.json(
      { error: "Failed to save game result" },
      { status: 500 }
    );
  }
}

function generateFeedback(game: any, score: number): string {
  if (score >= 90) {
    return `🎉 Excellent work! You scored ${score}% in ${game.title}. You have a natural talent for this career field!`;
  } else if (score >= 70) {
    return `👏 Great job! You scored ${score}% in ${game.title}. With practice, you could excel in this career!`;
  } else if (score >= 50) {
    return `💪 Good effort! You scored ${score}% in ${game.title}. This career has interesting challenges worth exploring!`;
  } else {
    return `🌟 Keep learning! You scored ${score}% in ${game.title}. Every expert was once a beginner - try again to improve!`;
  }
}

async function checkAchievements(userId: string): Promise<string[]> {
  const achievements: string[] = [];
  
  // Check for various achievements
  const results = await prisma.MiniGameResult.findMany({
    where: { userId },
  });

  if (results.length === 1) {
    achievements.push("🎮 First Game Complete!");
  }

  if (results.length === 10) {
    achievements.push("🏆 Game Enthusiast - 10 games played!");
  }

  const perfectScores = results.filter(r => r.score === 100);
  if (perfectScores.length >= 3) {
    achievements.push("⭐ Perfectionist - 3 perfect scores!");
  }

  return achievements;
}

async function awardXP(userId: string, amount: number, reason: string) {
  // Implementation for awarding XP
  console.log(`Awarding ${amount} XP to user ${userId} for ${reason}`);
}
