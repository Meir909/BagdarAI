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
  "ux-designer-1": {
    missions: [
      {
        missionId: 1,
        title: "Первый сигнал",
        options: [
          { id: "a", text: "Сразу переделать шаг 3", isCorrect: false, feedback: { en: "Acting without data is risky. You might fix the wrong thing and waste time.", ru: "Действовать без данных — рискованно. Ты можешь исправить не то и потерять время.", kk: "Деректерсіз әрекет ету — тәуекел. Дұрыс емес нәрсені түзетуіңіз мүмкін." } },
          { id: "b", text: "Провести интервью с пользователями", isCorrect: true, feedback: { en: "Smart move! User interviews reveal the 'why' behind numbers. 5 interviews can uncover 80% of problems.", ru: "Умно! Интервью с пользователями раскрывают «почему» за цифрами. 5 интервью могут выявить 80% проблем.", kk: "Ақылды! Пайдаланушы сұхбаттары сандар артындағы «неге» ашады. 5 сұхбат мәселелердің 80%-ын анықтай алады." } },
          { id: "c", text: "Посмотреть записи сессий", isCorrect: true, feedback: { en: "Excellent! Session recordings show exactly where users struggle. This is quantitative data at its best.", ru: "Отлично! Записи сессий показывают точно, где пользователи застревают. Это лучшие количественные данные.", kk: "Тамаша! Сессия жазбалары пайдаланушылардың қай жерде тоқырайтынын нақты көрсетеді." } },
          { id: "d", text: "Попросить подождать", isCorrect: false, feedback: { en: "Asking for more time without a plan shows lack of initiative. Come with a proposal, not just a request.", ru: "Просить больше времени без плана показывает отсутствие инициативы. Приходи с предложением, а не просьбой.", kk: "Жоспарсыз көбірек уақыт сұрау бастамашылықтың жоқтығын көрсетеді." } },
        ],
      },
      {
        missionId: 2,
        title: "Что скрывает шаг 3",
        options: [
          { id: "a", text: "Добавить inline-подсказки", isCorrect: true, feedback: { en: "Great! Inline hints reduce cognitive load without removing fields. Quick win that respects constraints.", ru: "Отлично! Подсказки снижают когнитивную нагрузку, не удаляя поля. Быстрая победа при соблюдении ограничений.", kk: "Тамаша! Кеңестер өрістерді жоймай танымдық жүктемені азайтады." } },
          { id: "b", text: "Разбить на 2 подшага", isCorrect: true, feedback: { en: "Smart! Breaking up long forms increases completion rates. Research shows shorter steps feel less overwhelming.", ru: "Умно! Разбивка длинных форм повышает коэффициент заполнения. Более короткие шаги кажутся менее перегруженными.", kk: "Ақылды! Ұзын формаларды бөлшектеу аяқталу жылдамдығын арттырады." } },
          { id: "c", text: "Сделать часть полей необязательными", isCorrect: true, feedback: { en: "Clever compromise! Optional fields + progress bar = better UX without breaking backend requirements.", ru: "Умный компромисс! Необязательные поля + прогресс-бар = лучший UX без нарушения требований бэкенда.", kk: "Ақылды компромисс! Міндетті емес өрістер + прогресс жолағы = жақсырақ UX." } },
          { id: "d", text: "Настоять на удалении полей", isCorrect: false, feedback: { en: "You'll create conflict without solving the real problem. Good designers find solutions within constraints, not fights.", ru: "Ты создашь конфликт, не решив реальную проблему. Хорошие дизайнеры находят решения в рамках ограничений.", kk: "Нақты мәселені шешпей конфликт туғызасыз. Жақсы дизайнерлер шектеулер шеңберінде шешімдер табады." } },
        ],
      },
      {
        missionId: 3,
        title: "Прототип под огнём",
        options: [
          { id: "a", text: "Принять весь фидбек", isCorrect: false, feedback: { en: "Taking all feedback blindly leads to 'design by committee' — a product no one is happy with. Prioritize strategically.", ru: "Принятие всего фидбека слепо ведёт к «дизайну комитетом» — продукту, которым никто не доволен.", kk: "Барлық кері байланысты соқыр қабылдау «комитет дизайнына» әкеледі." } },
          { id: "b", text: "Исправить баг и вернуть поле", isCorrect: true, feedback: { en: "Good balance! You fixed the real user issue, honored the analyst's need, and pushed back on cosmetic requests.", ru: "Хороший баланс! Ты исправил реальную проблему пользователя, учёл нужды аналитика и отложил косметику.", kk: "Жақсы тепе-теңдік! Нақты пайдаланушы мәселесін шештіңіз, аналитиктің қажеттілігін ескердіңіз." } },
          { id: "c", text: "Приоритизировать по влиянию на пользователя", isCorrect: true, feedback: { en: "This is how senior designers think! Impact on users first, then business, then aesthetics. Perfect prioritization.", ru: "Вот как думают старшие дизайнеры! Влияние на пользователей первично, затем бизнес, потом эстетика.", kk: "Аға дизайнерлер осылай ойлайды! Алдымен пайдаланушыларға әсер, содан кейін бизнес, содан кейін эстетика." } },
          { id: "d", text: "Отложить всё", isCorrect: false, feedback: { en: "Avoiding decisions isn't design leadership. The team needs direction, not more delays.", ru: "Избегание решений — не дизайн-лидерство. Команде нужно направление, а не очередные задержки.", kk: "Шешімдерден қашу — дизайн-жетекшілік емес. Команда бағытты керек, тағы кешігулерді емес." } },
        ],
      },
      {
        missionId: 4,
        title: "A/B тест: решение",
        options: [
          { id: "a", text: "A/B тест на 3 дня", isCorrect: true, feedback: { en: "Pragmatic! Even 3-day data gives directional signal. Use it to validate, not as final truth.", ru: "Прагматично! Даже данные за 3 дня дают направление. Используй для проверки, а не как окончательную истину.", kk: "Прагматикалық! Тіпті 3 күндік деректер бағыттық сигнал береді." } },
          { id: "b", text: "Выкатить новую версию", isCorrect: true, feedback: { en: "Reasonable! You have qualitative data from user testing. That's evidence enough for a confident launch.", ru: "Разумно! У тебя есть качественные данные из пользовательского тестирования. Этого достаточно для уверенного запуска.", kk: "Ақылға қонымды! Сізде пайдаланушы тестісінен сапалық деректер бар." } },
          { id: "c", text: "Только критические фиксы", isCorrect: true, feedback: { en: "Excellent risk management! Ship what you know works, test the rest later. This is professional UX thinking.", ru: "Отличное управление рисками! Запускай то, что точно работает, остальное тестируй позже.", kk: "Тамаша тәуекел басқарма! Жұмыс істейтінін жеткіз, қалғанын кейінірек тест." } },
          { id: "d", text: "Отменить рекламу", isCorrect: false, feedback: { en: "This would damage business relationships and trust. Perfect is the enemy of good — ship and iterate.", ru: "Это повредит деловым отношениям и доверию. Идеальное — враг хорошего. Запускай и итерируй.", kk: "Бұл іскерлік қарым-қатынасты бұзады. Жетілген — жақсының жауы. Жеткізіп, итерациялаңыз." } },
        ],
      },
      {
        missionId: 5,
        title: "Результаты и следующий шаг",
        options: [
          { id: "a", text: "Применить те же фиксы", isCorrect: false, feedback: { en: "Copy-pasting fixes without a system creates inconsistency. What worked in one form won't always work elsewhere.", ru: "Копирование фиксов без системы создаёт непоследовательность. То, что сработало в одной форме, не всегда сработает в другом месте.", kk: "Жүйесіз түзетулерді көшіру сәйкессіздік туғызады." } },
          { id: "b", text: "Создать дизайн-систему", isCorrect: true, feedback: { en: "This is thinking like a senior designer! A design system multiplies your impact across the whole product.", ru: "Вот это мышление старшего дизайнера! Дизайн-система умножает твоё влияние на весь продукт.", kk: "Бұл аға дизайнердің ойлауы! Дизайн жүйесі сіздің барлық өнімге әсеріңізді арттырады." } },
          { id: "c", text: "UX-аудит всего продукта", isCorrect: true, feedback: { en: "Strategic and methodical! Audit first gives you the full picture before committing resources.", ru: "Стратегично и методично! Аудит сначала даёт полную картину перед распределением ресурсов.", kk: "Стратегиялық және жүйелі! Алдымен аудит ресурстарды бөлуден бұрын толық суретті береді." } },
          { id: "d", text: "Нанять ещё дизайнеров", isCorrect: false, feedback: { en: "More people without a system means more chaos. Build the system first, then scale the team if needed.", ru: "Больше людей без системы означает больше хаоса. Сначала строй систему, потом масштабируй команду.", kk: "Жүйесіз көп адам — көбірек хаос дегенді білдіреді. Алдымен жүйені салыңыз." } },
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

    const isCorrect = selectedOption.isCorrect;
    const xpEarned = isCorrect ? mission.xpReward : Math.floor(mission.xpReward * 0.5);

    // Use static feedback from template if available, otherwise generate via AI
    let feedbackData: { en: string; ru: string; kk: string };
    let explanation: string | undefined;
    let tips: string[] | undefined;

    if (selectedOption.feedback) {
      feedbackData = selectedOption.feedback;
    } else {
      const correctOption = mission.options.find((opt: any) => opt.isCorrect);
      const professionMap: Record<string, string> = {
        "sim-1": "Software Engineer",
        "sim-2": "Data Scientist",
        "ux-designer-1": "UX Designer",
      };
      const aiResponse = await generateSimulationFeedback(
        mission.scenario,
        selectedOption.text,
        correctOption?.text || "Best practice approach",
        professionMap[simulationId] || "Professional",
        "en"
      );
      feedbackData = { en: aiResponse.feedback, ru: aiResponse.feedback, kk: aiResponse.feedback };
      explanation = aiResponse.explanation;
      tips = aiResponse.tips;
    }

    // Update result in DB
    const currentResult = await prisma.userSimulationResult.findUnique({
      where: { id: resultId },
      select: { missionResults: true, score: true, maxScore: true },
    });

    const updatedMissionResults = [...(currentResult?.missionResults as any[]), {
      missionId,
      userAnswer,
      feedback: feedbackData,
      explanation,
      tips,
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
      feedback: feedbackData,
      explanation,
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
