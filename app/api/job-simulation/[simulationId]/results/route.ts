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

    // Skill mapping per simulation
    type SkillMap = Record<number, { correct: string[]; wrong: string[] }>;

    const SKILL_MAPS: Record<string, SkillMap> = {
      "sim-1": {
        1: { correct: ["Навык код-ревью", "Инициативность"], wrong: ["Культура кода"] },
        2: { correct: ["Командное взаимодействие", "Уверенность в коммуникации"], wrong: ["Профессиональная коммуникация"] },
        3: { correct: ["Управление проектом", "Внимание к деталям"], wrong: ["Анализ требований"] },
      },
      "sim-2": {
        1: { correct: ["Исследование данных (EDA)", "Системный подход"], wrong: ["Торопливость без анализа"] },
        2: { correct: ["Feature Engineering", "Работа с данными"], wrong: ["Статистическое мышление"] },
        3: { correct: ["Оценка моделей", "Бизнес-мышление"], wrong: ["Понимание метрик ML"] },
      },
      "ux-designer-1": {
        1: { correct: ["Пользовательское исследование", "Data-driven дизайн"], wrong: ["Анализ до действия"] },
        2: { correct: ["Навыки UX-решений", "Работа с ограничениями"], wrong: ["Приоритизация UX vs бизнес"] },
        3: { correct: ["Приоритизация фидбека", "Стратегическое мышление"], wrong: ["Управление стейкхолдерами"] },
        4: { correct: ["Управление рисками", "Прагматизм"], wrong: ["Data-driven решения"] },
        5: { correct: ["Системный UX-подход", "Дизайн-система"], wrong: ["Масштабируемость решений"] },
      },
    };

    const skillMap = SKILL_MAPS[simulationId] ?? {};
    const strengths: string[] = [];
    const improvements: string[] = [];

    missionResults.forEach((mr: any) => {
      const missionSkills = skillMap[mr.missionId];
      if (!missionSkills) return;
      if (mr.isCorrect) {
        missionSkills.correct.forEach((s: string) => strengths.push(s));
      } else {
        missionSkills.wrong.forEach((s: string) => improvements.push(s));
      }
    });

    const uniqueStrengths = [...new Set(strengths)];
    const uniqueImprovements = [...new Set(improvements)];

    // Recommendations per simulation + score
    const RECOMMENDATIONS: Record<string, { high: string; mid: string; low: string }> = {
      "ux-designer-1": {
        high: "Ты мыслишь как UX-профессионал! Попробуй профессию Product Designer или UX Lead.",
        mid: "Хорошее начало! Углубись в пользовательские исследования и design systems.",
        low: "UX — это навык. Пройди курсы по UX Research и попробуй снова.",
      },
      "sim-1": {
        high: "Ты готов к senior-задачам. Рассмотри роль Tech Lead или архитектора.",
        mid: "Продолжай практику. Читай код больших проектов и участвуй в code review.",
        low: "Сосредоточься на основах: структуры данных, алгоритмы, командная работа.",
      },
      "sim-2": {
        high: "Ты думаешь как data scientist. Попробуй ML Engineer или Data Lead.",
        mid: "Хорошие знания! Изучи глубже статистику и бизнес-метрики.",
        low: "Начни с основ: EDA, pandas, matplotlib. Практика на Kaggle поможет.",
      },
    };

    const recMap = RECOMMENDATIONS[simulationId] ?? { high: "", mid: "", low: "" };
    const recommendation =
      scorePercentage >= 80 ? recMap.high :
      scorePercentage >= 60 ? recMap.mid :
      recMap.low;

    return NextResponse.json({
      resultId: result.id,
      simulationId,
      totalScore: result.score,
      maxScore: result.maxScore,
      correctAnswers,
      totalMissions,
      scorePercentage,
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      recommendation,
      missionResults: missionResults.map((m: any) => ({
        missionId: m.missionId,
        title: skillMap[m.missionId]?.correct[0] ?? `Шаг ${m.missionId}`,
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
