export interface DailyQuestData {
  type: "simulation" | "profession" | "mentor" | "test" | "chat" | "job_simulation" | "leaderboard" | "daily_login" | "roadmap";
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

  // JOB SIMULATION QUESTS
  {
    type: "job_simulation",
    title: "Hard Mode Challenge",
    titleRu: "Вызов сложного режима",
    titleKk: "Ауыр режимінің сынағы",
    description: "Complete a hard difficulty job simulation and score 70% or higher.",
    descriptionRu: "Пройди симуляцию на сложном уровне и набери 70% и выше.",
    descriptionKk: "Ауыр деңгейдегі симуляцияны өтіп, 70% және одан жоғары ұпай жина.",
    xpReward: 50,
    icon: "🔥",
  },
  {
    type: "job_simulation",
    title: "Multi-Mission Master",
    titleRu: "Мастер мультимиссий",
    titleKk: "Көпмиссия шебері",
    description: "Complete a job simulation with 3+ missions in a single session.",
    descriptionRu: "Пройди симуляцию с 3+ миссиями в одной сессии.",
    descriptionKk: "Бір сеансында 3+ миссиясы бар симуляцияны өт.",
    xpReward: 45,
    icon: "🎯",
  },

  // LEADERBOARD QUESTS
  {
    type: "leaderboard",
    title: "Rise Up",
    titleRu: "Подним вверх",
    titleKk: "Жоғарыға өтіңіз",
    description: "Earn 500 XP today to climb the leaderboard.",
    descriptionRu: "Заработай 500 XP сегодня и подойди выше в рейтинге.",
    descriptionKk: "Бүгін 500 XP табыңыз және рейтингке ілінейіңіз.",
    xpReward: 50,
    icon: "📈",
  },
  {
    type: "leaderboard",
    title: "Weekly Grind",
    titleRu: "Еженедельный труд",
    titleKk: "Аптасына еңбек",
    description: "Earn 1000 XP this week to reach the top 10 weekly leaderboard.",
    descriptionRu: "Заработай 1000 XP на этой неделе и войди в топ-10.",
    descriptionKk: "Осы аптада 1000 XP табыңыз және топ-10-ға кіріңіз.",
    xpReward: 75,
    icon: "🏅",
  },

  // DAILY LOGIN QUESTS
  {
    type: "daily_login",
    title: "Consistency is Key",
    titleRu: "Последовательность важна",
    titleKk: "Ұзақтығы маңызды",
    description: "Log in for 3 consecutive days to earn a bonus streak reward.",
    descriptionRu: "Заходи 3 дня подряд и получи бонус за серию.",
    descriptionKk: "3 күн подряд кіріп, серия бонусын алыңыз.",
    xpReward: 35,
    icon: "🔥",
  },
  {
    type: "daily_login",
    title: "Daily Starter",
    titleRu: "Ежедневный старт",
    titleKk: "Күнделік баста",
    description: "Log in and complete at least 1 activity today.",
    descriptionRu: "Войди и выполни хотя бы 1 активность сегодня.",
    descriptionKk: "Кіріңіз және бүгін кем дегенде 1 белсенді орындаңыз.",
    xpReward: 15,
    icon: "✅",
  },

  // ROADMAP QUESTS
  {
    type: "roadmap",
    title: "Roadmap Explorer",
    titleRu: "Путешественник по дороге",
    titleKk: "Жолдың зерттеушісі",
    description: "Explore a career roadmap for your dream profession.",
    descriptionRu: "Изучи дорожную карту для своей мечты.",
    descriptionKk: "Арманы мансабыңыз үшін жолды картасын зерттеңіз.",
    xpReward: 25,
    icon: "🗺️",
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
