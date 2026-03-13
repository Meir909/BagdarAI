import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSimulationFeedback } from "@/lib/openai";

const SIMULATION_TEMPLATES: Record<string, any> = {
  "sim-1": {
    missions: [
      {
        missionId: 1,
        title: "Code Review",
        options: [
          {
            id: "a",
            text: "Point out the issue directly and suggest a fix",
            isCorrect: true,
            feedback: {
              en: "Excellent! You showed initiative and communication skills. This is how a good team member operates.",
              ru: "Отлично! Вы проявили инициативу и навыки общения. Так работает хороший член команды.",
              kk: "Өте жақсы! Сіз инициатива және коммуникация дағдыларын көрсеттіңіз. Бұл жақсы ұжымның мүшесі жұмыс істейді.",
            },
          },
          { id: "b", text: "Ignore it and approve the code", isCorrect: false, feedback: { en: "This could damage team trust and code quality.", ru: "Это может повредить доверие в команде.", kk: "Бұл ұжым сенімін зақымдауы мүмкін." } },
          { id: "c", text: "Ask them to fix it without explaining", isCorrect: false, feedback: { en: "They need to understand why. Provide guidance, not orders.", ru: "Они должны понять почему. Предоставьте рекомендации.", kk: "Олар неге екенін түсінуі керек. Нұсқама беріңіз." } },
        ],
      },
      {
        missionId: 2,
        title: "Meeting Participation",
        options: [
          { id: "a", text: "Stay silent to avoid standing out", isCorrect: false, feedback: { en: "Your opinion matters, especially in team decisions.", ru: "Ваше мнение важно.", kk: "Сіздің пікіріңіз маңызды." } },
          {
            id: "b",
            text: "Share your concerns professionally",
            isCorrect: true,
            feedback: { en: "Great! You contributed to better decision-making. This shows leadership potential.", ru: "Отлично! Вы помогли улучшить принятие решений.", kk: "Өте жақсы! Сіз шешім қабылдауға көмектестіңіз." },
          },
          { id: "c", text: "Criticize the proposal harshly", isCorrect: false, feedback: { en: "Be professional and constructive, not harsh.", ru: "Будьте конструктивны, а не резки.", kk: "Конструктивті болыңыз, қатыршылықпа емес." } },
        ],
      },
      {
        missionId: 3,
        title: "Project Assignment",
        options: [
          { id: "a", text: "Start coding immediately based on your understanding", isCorrect: false, feedback: { en: "This could lead to wasted effort. Always clarify requirements first.", ru: "Это может привести к потере времени.", kk: "Бұл уақыт жоғалтуына әкелуі мүмкін." } },
          {
            id: "b",
            text: "Clarify requirements with the team first",
            isCorrect: true,
            feedback: { en: "Perfect! This prevents miscommunication and rework. You're thinking like a professional.", ru: "Идеально! Это предотвращает переделки.", kk: "Тамаша! Бұл қайта істеуді болдырмайды." },
          },
          { id: "c", text: "Work on what seems most important", isCorrect: false, feedback: { en: "You might be working on the wrong things. Always get clear direction.", ru: "Вы можете работать на неправильное.", kk: "Сіз дұрыс емес нәрсеге жұмыс істеуіңіз мүмкін." } },
        ],
      },
    ],
  },
  "sim-2": {
    missions: [
      {
        missionId: 1,
        title: "Data Exploration",
        options: [
          { id: "a", text: "Start building models immediately", isCorrect: false, feedback: { en: "You'll waste time building bad models. EDA is crucial.", ru: "Вы потратите время на плохие модели.", kk: "Сіз жаман модельдерге уақыт жумсайсыз." } },
          {
            id: "b",
            text: "Explore data: check distributions, missing values, correlations",
            isCorrect: true,
            feedback: { en: "Excellent! This is the foundation of good data science. You're following best practices.", ru: "Отлично! Это основа хорошей науки данных.", kk: "Өте жақсы! Бұл деректер ғылымының негізі." },
          },
          { id: "c", text: "Clean all data first without understanding it", isCorrect: false, feedback: { en: "You might remove important information. Understand first, then clean.", ru: "Вы можете удалить важную информацию.", kk: "Сіз маңызды ақпаратты жоюы мүмкін." } },
        ],
      },
      {
        missionId: 2,
        title: "Feature Engineering",
        options: [
          { id: "a", text: "Use all 50 columns as-is", isCorrect: false, feedback: { en: "Curse of dimensionality! Feature selection is crucial for model performance.", ru: "Проклятие размерности! Выбор признаков критичен.", kk: "Өлшемділіктің қарғасы! Ерекшелік таңдауы критикалық." } },
          {
            id: "b",
            text: "Select relevant features, handle missing values, scale/normalize",
            isCorrect: true,
            feedback: { en: "Perfect! This is professional data science. You'll build better models.", ru: "Идеально! Это профессиональная наука данных.", kk: "Тамаша! Бұл кәсіби деректер ғылымы." },
          },
          { id: "c", text: "Remove columns randomly to reduce dimensionality", isCorrect: false, feedback: { en: "Random removal loses information. Use statistical methods for feature selection.", ru: "Случайное удаление теряет информацию.", kk: "Кездейсоқ жою ақпаратты жоғалтады." } },
        ],
      },
      {
        missionId: 3,
        title: "Model Evaluation",
        options: [
          { id: "a", text: "Deploy immediately - accuracy is high", isCorrect: false, feedback: { en: "Accuracy alone is not enough! Check other metrics and business impact.", ru: "Точности недостаточно! Проверьте другие метрики.", kk: "Дәлдігі жеткіліксіз! Басқа өлшемдерді тексеріңіз." } },
          {
            id: "b",
            text: "Check precision, recall, F1-score, and business impact first",
            isCorrect: true,
            feedback: { en: "Excellent! You're thinking like a data scientist who understands business. This is crucial for real-world models.", ru: "Отлично! Вы думаете как настоящий data scientist.", kk: "Өте жақсы! Сіз нағыз деректер ғалымы сияқты ойлайсыз." },
          },
          { id: "c", text: "Only look at accuracy, it's the only metric that matters", isCorrect: false, feedback: { en: "This is a common mistake. Different metrics matter for different problems.", ru: "Это частая ошибка. Разные метрики для разных проблем.", kk: "Бұл ортақ қателік. Түрлі мәселеліктер үшін түрлі өлшемдер." } },
        ],
      },
    ],
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ simulationId: string }> }
) {
  try {
    const { simulationId } = await params;
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resultId, missionId, userAnswer, missionIndex } = await req.json();

    const simulation = SIMULATION_TEMPLATES[simulationId];
    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    const mission = simulation.missions[missionIndex];
    const selectedOption = mission.options.find((opt: any) => opt.id === userAnswer);

    if (!selectedOption) {
      return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
    }

    // Generate AI feedback
    const correctOption = mission.options.find((opt: any) => opt.isCorrect);
    const aiResponse = await generateSimulationFeedback(
      mission.scenario,
      selectedOption.text,
      correctOption?.text || "Best practice approach",
      simulationId === "sim-1" ? "Software Engineer" : "Data Scientist",
      "en" // Default to English, can be extended to support languages
    );

    const isCorrect = selectedOption.isCorrect;
    const xpEarned = isCorrect ? mission.xpReward : Math.floor(mission.xpReward * 0.5);

    // Update result in DB
    const currentResult = await prisma.userSimulationResult.findUnique({
      where: { id: resultId },
      select: { missionResults: true, score: true, maxScore: true },
    });

    const updatedMissionResults = [...(currentResult?.missionResults as any[]), {
      missionId,
      userAnswer,
      feedback: {
        en: aiResponse.feedback,
        ru: aiResponse.feedback, // In production, translate to Russian
        kk: aiResponse.feedback, // In production, translate to Kazakh
      },
      explanation: aiResponse.explanation,
      tips: aiResponse.tips,
      xpEarned,
      isCorrect,
    }];

    const newScore = (currentResult?.score || 0) + xpEarned;

    await prisma.userSimulationResult.update({
      where: { id: resultId },
      data: {
        missionResults: updatedMissionResults,
        score: newScore,
      },
    });

    // Check if this is the last mission
    const isLastMission = missionIndex === simulation.missions.length - 1;
    let nextMission = null;

    if (!isLastMission) {
      const nextMissionData = simulation.missions[missionIndex + 1];
      nextMission = {
        id: nextMissionData.missionId,
        title: nextMissionData.title,
        scenario: nextMissionData.scenario,
        options: nextMissionData.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
        })),
      };
    }

    return NextResponse.json({
      resultId,
      missionId,
      feedback: {
        en: aiResponse.feedback,
        ru: aiResponse.feedback,
        kk: aiResponse.feedback,
      },
      explanation: aiResponse.explanation,
      isCorrect,
      xpEarned,
      totalXP: newScore,
      nextMission,
      isComplete: isLastMission,
    });
  } catch (error) {
    console.error("Mission submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit mission" },
      { status: 500 }
    );
  }
}
