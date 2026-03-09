export interface DailyQuestData {
  type: "simulation" | "profession" | "mentor" | "test" | "chat";
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  xpReward: number;
  icon: string;
}

export const questTemplates: DailyQuestData[] = [
  // SIMULATION QUESTS
  {
    type: "simulation",
    title: "Career Day",
    titleRu: "День карьеры",
    titleKk: "Мансап күні",
    description: "Complete any career simulation to experience a day in the life of a professional.",
    descriptionRu: "Пройди любую карьерную симуляцию и почувствуй рабочий день специалиста.",
    descriptionKk: "Кез келген мансап симуляциясын өтіп, маманның жұмыс күнін сезін.",
    xpReward: 30,
    icon: "🎮",
  },
  {
    type: "simulation",
    title: "Perfect Score",
    titleRu: "Идеальный результат",
    titleKk: "Мінсіз нәтиже",
    description: "Score 80% or higher in any career simulation.",
    descriptionRu: "Набери 80% и выше в любой карьерной симуляции.",
    descriptionKk: "Кез келген мансап симуляциясында 80% және одан жоғары ұпай жина.",
    xpReward: 40,
    icon: "⭐",
  },
  {
    type: "simulation",
    title: "Tech Explorer",
    titleRu: "Исследователь технологий",
    titleKk: "Технология зерттеушісі",
    description: "Complete an IT career simulation today.",
    descriptionRu: "Пройди симуляцию IT-карьеры сегодня.",
    descriptionKk: "Бүгін IT мансап симуляциясын өт.",
    xpReward: 30,
    icon: "💻",
  },

  // PROFESSION QUESTS
  {
    type: "profession",
    title: "Career Scout",
    titleRu: "Разведчик карьеры",
    titleKk: "Мансап барлаушысы",
    description: "Explore 5 different professions in the professions catalog.",
    descriptionRu: "Изучи 5 разных профессий в каталоге профессий.",
    descriptionKk: "Мамандықтар каталогында 5 түрлі мамандықты зерттеп шық.",
    xpReward: 20,
    icon: "🔍",
  },
  {
    type: "profession",
    title: "Know Your Field",
    titleRu: "Знай своё поле",
    titleKk: "Өз саласыңды біл",
    description: "Read about 3 professions in your top career category.",
    descriptionRu: "Изучи 3 профессии из твоей основной категории карьеры.",
    descriptionKk: "Басты мансап санатыңнан 3 мамандықты оқып шық.",
    xpReward: 20,
    icon: "📚",
  },

  // MENTOR QUESTS
  {
    type: "mentor",
    title: "Mentor Session",
    titleRu: "Сессия с ментором",
    titleKk: "Ментормен сессия",
    description: "Ask an AI mentor at least 3 questions about their career.",
    descriptionRu: "Задай AI-ментору как минимум 3 вопроса о его карьере.",
    descriptionKk: "AI-менторға мансабы туралы кем дегенде 3 сұрақ қой.",
    xpReward: 20,
    icon: "🧑‍🏫",
  },
  {
    type: "mentor",
    title: "Meet a New Mentor",
    titleRu: "Познакомься с новым ментором",
    titleKk: "Жаңа ментормен таныс",
    description: "Start a conversation with an AI mentor you haven't talked to before.",
    descriptionRu: "Начни разговор с AI-ментором, с которым ещё не общался.",
    descriptionKk: "Бұрын сөйлеспеген AI-ментормен сөйлесуді бастаңыз.",
    xpReward: 25,
    icon: "🤝",
  },

  // TEST QUESTS
  {
    type: "test",
    title: "Know Yourself",
    titleRu: "Познай себя",
    titleKk: "Өзіңді тан",
    description: "Complete the MBTI personality test to discover your type.",
    descriptionRu: "Пройди тест личности MBTI и узнай свой тип.",
    descriptionKk: "MBTI тұлға тестін тапсырып, өз типіңді анықта.",
    xpReward: 35,
    icon: "🧠",
  },
  {
    type: "test",
    title: "Aptitude Champion",
    titleRu: "Чемпион способностей",
    titleKk: "Қабілет чемпионы",
    description: "Complete the aptitude test and score above 14/20.",
    descriptionRu: "Пройди тест способностей и набери больше 14/20.",
    descriptionKk: "Қабілет тестін тапсырып, 14/20-дан жоғары ұпай жина.",
    xpReward: 40,
    icon: "⚡",
  },
  {
    type: "test",
    title: "Full Profile",
    titleRu: "Полный профиль",
    titleKk: "Толық профиль",
    description: "Complete all three tests: RIASEC, MBTI, and Aptitude.",
    descriptionRu: "Пройди все три теста: RIASEC, MBTI и Способности.",
    descriptionKk: "Үш тестті де тапсыр: RIASEC, MBTI және Қабілет.",
    xpReward: 60,
    icon: "🏆",
  },

  // CHAT QUESTS
  {
    type: "chat",
    title: "Career Questions",
    titleRu: "Карьерные вопросы",
    titleKk: "Мансап сұрақтары",
    description: "Ask the AI career advisor 2 questions about a profession you're curious about.",
    descriptionRu: "Задай AI-советнику 2 вопроса о профессии, которая тебя интересует.",
    descriptionKk: "AI-кеңесшіге қызықтыратын мамандық туралы 2 сұрақ қой.",
    xpReward: 20,
    icon: "💬",
  },
  {
    type: "chat",
    title: "University Research",
    titleRu: "Исследование университетов",
    titleKk: "Университет зерттеуі",
    description: "Ask the AI about university options for your dream career.",
    descriptionRu: "Спроси AI о вариантах университетов для твоей мечты.",
    descriptionKk: "AI-дан арман мансабыңа арналған университет нұсқалары туралы сұра.",
    xpReward: 20,
    icon: "🎓",
  },
];

// Pick 3 random quests per day (seeded by date for consistency)
export function getDailyQuestIndices(date: Date = new Date()): number[] {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const indices: number[] = [];
  let s = seed;
  while (indices.length < 3) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const idx = Math.abs(s) % questTemplates.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices;
}
