import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SIMULATION_TEMPLATES: Record<string, any> = {
  "sim-1": {
    // Software Engineer - First Day
    title: "First Day as Software Engineer",
    titleRu: "Первый день инженера ПО",
    titleKk: "Бағдарламалық инженердің бірінші күні",
    description: "Start your first day at a tech company",
    difficulty: "easy",
    xpReward: 100,
    missions: [
      {
        missionId: 1,
        title: "Code Review",
        titleRu: "Проверка кода",
        titleKk: "Код рецензиясы",
        scenario:
          "A senior developer asks you to review their code. You see a performance issue in their algorithm. How do you respond?",
        scenarioRu: "Старший разработчик просит вас проверить его код. Вы видите проблему с производительностью. Как вы ответите?",
        scenarioKk: "Ата разработчик сізге кодты тексеруді сұрайды. Сіз алгоритмде өндіктік мәселесін көрдіңіз. Қалай жауап бересіз?",
        options: [
          {
            id: "a",
            text: "Point out the issue directly and suggest a fix",
            textRu: "Указать на проблему и предложить решение",
            textKk: "Мәселеге указать және шешім ұсыну",
            isCorrect: true,
          },
          {
            id: "b",
            text: "Ignore it and approve the code",
            textRu: "Игнорировать и одобрить код",
            textKk: "Ескеру және кодты мақұлдау",
            isCorrect: false,
          },
          {
            id: "c",
            text: "Ask them to fix it without explaining",
            textRu: "Попросить их исправить, не объясняя",
            textKk: "Түсіндірмегедей түзетуін сұрау",
            isCorrect: false,
          },
        ],
        xpReward: 25,
      },
      {
        missionId: 2,
        title: "Meeting Participation",
        titleRu: "Участие в совещании",
        titleKk: "Жиынтықта қатысу",
        scenario:
          "In your first team meeting, there's a debate about using a new technology. You have concerns. What do you do?",
        scenarioRu: "На первом совещании команды обсуждают новую технологию. У вас есть опасения. Что вы делаете?",
        scenarioKk: "团队의 첫번째 회의에서 새로운 기술을 사용하는 것에 대해 토론합니다. 우려사항이 있습니다. 무엇을 하시겠습니까?",
        options: [
          {
            id: "a",
            text: "Stay silent to avoid standing out",
            textRu: "Молчать, чтобы не выделяться",
            textKk: "Сөзсіз қалу және көзге түспеу",
            isCorrect: false,
          },
          {
            id: "b",
            text: "Share your concerns professionally",
            textRu: "Поделиться опасениями профессионально",
            textKk: "Алаңдарыңызды кәсіби түрде бөлісу",
            isCorrect: true,
          },
          {
            id: "c",
            text: "Criticize the proposal harshly",
            textRu: "Резко критиковать предложение",
            textKk: "Ұсынысты қатыршылықпен сынау",
            isCorrect: false,
          },
        ],
        xpReward: 25,
      },
      {
        missionId: 3,
        title: "Project Assignment",
        titleRu: "Назначение на проект",
        titleKk: "Жобага тағайындау",
        scenario:
          "You're assigned to a high-priority project with a tight deadline. The requirements are unclear. What's your next step?",
        scenarioRu: "Вас назначили на приоритетный проект со сжатыми сроками. Требования неясны. Что дальше?",
        scenarioKk: "Сіз қатқыл мерзімді ең басымды жобаға тағайындалдыңыз. Талаптар анық емес. Келесі қадам қандай?",
        options: [
          {
            id: "a",
            text: "Start coding immediately based on your understanding",
            textRu: "Начать кодирование сразу же",
            textKk: "Бірден кодтауды бастау",
            isCorrect: false,
          },
          {
            id: "b",
            text: "Clarify requirements with the team first",
            textRu: "Сначала уточнить требования с командой",
            textKk: "Алдымен командамен талаптарды нақтылау",
            isCorrect: true,
          },
          {
            id: "c",
            text: "Work on what seems most important",
            textRu: "Работать над тем, что кажется важным",
            textKk: "Ең маңды болып көрінгенге жұмыс істеу",
            isCorrect: false,
          },
        ],
        xpReward: 25,
      },
    ],
  },
  "sim-2": {
    // Data Scientist - Analysis Challenge
    title: "Data Analysis Challenge",
    titleRu: "Проблема анализа данных",
    titleKk: "Деректерді талдау сынағы",
    description: "You receive a large dataset and need to provide insights",
    difficulty: "medium",
    xpReward: 150,
    missions: [
      {
        missionId: 1,
        title: "Data Exploration",
        titleRu: "Исследование данных",
        titleKk: "Деректерді зерттеу",
        scenario:
          "You have a dataset with 1M rows and 50 columns. What's your first step?",
        scenarioRu: "У вас есть набор данных с 1M строк и 50 столбцов. Первый шаг?",
        scenarioKk: "Сізде 1M жол және 50 бағаны бар деректер жиынтығы бар. Бірінші қадам?",
        options: [
          {
            id: "a",
            text: "Start building models immediately",
            textRu: "Начать строить модели сразу",
            textKk: "Бірден модельдер құра бастау",
            isCorrect: false,
          },
          {
            id: "b",
            text: "Explore data: check distributions, missing values, correlations",
            textRu: "Исследовать данные: проверить распределение, пропуски, корреляции",
            textKk: "Деректерді зерттеу: таралу, жоғалған мәндер, корреляция",
            isCorrect: true,
          },
          {
            id: "c",
            text: "Clean all data first without understanding it",
            textRu: "Очистить все данные, не понимая их",
            textKk: "Барлық деректерді түсінбегедей тазарту",
            isCorrect: false,
          },
        ],
        xpReward: 40,
      },
      {
        missionId: 2,
        title: "Feature Engineering",
        titleRu: "Инженерия признаков",
        titleKk: "Ерекшелік инженериясы",
        scenario:
          "After exploration, you need to prepare features for modeling. What do you do?",
        scenarioRu: "После исследования нужно подготовить признаки. Что вы делаете?",
        scenarioKk: "Зерттеуден кейін модельдеу үшін ерекшеліктерді дайындау қажет. Неге араласасыз?",
        options: [
          {
            id: "a",
            text: "Use all 50 columns as-is",
            textRu: "Использовать все 50 столбцов как есть",
            textKk: "Барлық 50 бағаны өйткені де қолдану",
            isCorrect: false,
          },
          {
            id: "b",
            text: "Select relevant features, handle missing values, scale/normalize",
            textRu: "Выбрать релевантные признаки, обработать пропуски, масштабировать",
            textKk: "Тиісті ерекшеліктерді таңдау, пропуски өңдеу, масштабтау",
            isCorrect: true,
          },
          {
            id: "c",
            text: "Remove columns randomly to reduce dimensionality",
            textRu: "Удалить столбцы случайно",
            textKk: "Кездейсоқ бағаларды жою",
            isCorrect: false,
          },
        ],
        xpReward: 40,
      },
      {
        missionId: 3,
        title: "Model Evaluation",
        titleRu: "Оценка модели",
        titleKk: "Модель бағалау",
        scenario:
          "Your model achieves 95% accuracy. Is this good enough to deploy?",
        scenarioRu: "Ваша модель достигает 95% точности. Этого достаточно для развертывания?",
        scenarioKk: "Сіздің модель 95% дәлдіктіге қол жеткізді. Бұл орналастыруға жеткілік пе?",
        options: [
          {
            id: "a",
            text: "Deploy immediately - accuracy is high",
            textRu: "Развернуть сразу - высокая точность",
            textKk: "Бірден орналастыру - дәлдік жоғары",
            isCorrect: false,
          },
          {
            id: "b",
            text: "Check precision, recall, F1-score, and business impact first",
            textRu: "Проверить precision, recall, F1-score, влияние на бизнес",
            textKk: "Precision, recall, F1-score, бизнес әсерін тексеру",
            isCorrect: true,
          },
          {
            id: "c",
            text: "Only look at accuracy, it's the only metric that matters",
            textRu: "Смотреть только точность, это единственная метрика",
            textKk: "Тек дәлдіктіні қара, бұл жалғыз өлшемі",
            isCorrect: false,
          },
        ],
        xpReward: 40,
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

    // Get simulation template
    const simulation = SIMULATION_TEMPLATES[simulationId];
    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    // Check if user already has a result for this simulation
    const existingResult = await prisma.userSimulationResult.findUnique({
      where: {
        userId_simulationId: {
          userId: session.userId,
          simulationId,
        },
      },
    });

    let resultId = existingResult?.id;

    // If new attempt, create a new result record
    if (!existingResult) {
      const newResult = await prisma.userSimulationResult.create({
        data: {
          userId: session.userId,
          simulationId,
          score: 0,
          maxScore: simulation.missions.reduce((sum: number, m: any) => sum + m.xpReward, 0),
          missionResults: [],
        },
      });
      resultId = newResult.id;
    }

    // Return first mission
    const firstMission = simulation.missions[0];

    return NextResponse.json({
      resultId,
      simulationId,
      title: simulation.title,
      difficulty: simulation.difficulty,
      totalMissions: simulation.missions.length,
      currentMissionIndex: 0,
      mission: {
        id: firstMission.missionId,
        title: firstMission.title,
        scenario: firstMission.scenario,
        options: firstMission.options.map((opt: any) => ({
          id: opt.id,
          text: opt.text,
        })),
      },
    });
  } catch (error) {
    console.error("Simulation start error:", error);
    return NextResponse.json(
      { error: "Failed to start simulation" },
      { status: 500 }
    );
  }
}
