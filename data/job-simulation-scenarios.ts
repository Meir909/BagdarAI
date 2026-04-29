export interface JobSimulationScenario {
  id: string;
  professionId: string;
  profession: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  difficulty: "easy" | "medium" | "hard";
  missions: Mission[];
}

export interface Mission {
  id: number;
  title: string;
  scenario: string;
  context: {
    goal: string;
    timeline?: string;
    stakeholders?: string[];
    constraints?: string[];
  };
  options: MissionOption[];
}

export interface MissionOption {
  id: string;
  text: string;
  icon?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const jobSimulationScenarios: JobSimulationScenario[] = [
  {
    id: "sim-soft-eng-1",
    professionId: "soft-engineer",
    profession: "Software Engineer",
    title: "Launch Day Crisis",
    titleRu: "День запуска - Кризис",
    titleKk: "Ағымдау күні - Дағдарыс",
    description: "It's 2 hours before launch and your team discovers a critical bug in the payment system. How do you handle it?",
    descriptionRu: "За 2 часа до запуска команда обнаружила критическую ошибку в системе платежей. Как вы действуете?",
    descriptionKk: "Ағымдау уақытына 2 сағат қалғанда команда төлем жүйесінде сыналы қателік тапты. Қалай іс-әрекет аласыз?",
    difficulty: "hard",
    missions: [
      {
        id: 1,
        title: "Assess the Situation",
        scenario: `Your team has found a bug in the payment processing module that causes transactions to fail randomly.

        Status: 2 hours until live launch
        Impact: ~5000 users affected when live
        Root cause: Not yet identified
        Your role: Lead developer on the project

        The team is panicked. Investors are watching. Your manager wants an update NOW.

        What do you do first?`,
        context: {
          goal: "Handle the crisis effectively without causing more damage",
          timeline: "2 hours before launch",
          stakeholders: ["Team members", "Product manager", "Investors", "Users"],
          constraints: [
            "Limited time for debugging",
            "High visibility to stakeholders",
            "Pressure to hit launch deadline",
            "Payment system is critical",
          ],
        },
        options: [
          {
            id: "a",
            text: "🚨 Immediately roll back the entire release and delay launch by a week",
            icon: "🚨",
            difficulty: "easy",
          },
          {
            id: "b",
            text: "🔍 Take 15 mins to understand the bug, create a mitigation plan, then update stakeholders",
            icon: "🔍",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "⚡ Launch with a warning that payments might fail and handle fixes post-launch",
            icon: "⚡",
            difficulty: "hard",
          },
          {
            id: "d",
            text: "😰 Panic and blame the QA team for missing the bug",
            icon: "😰",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 2,
        title: "Execute the Fix",
        scenario: `You've identified the issue: a race condition in the payment processing queue.

        Options on the table:
        1. Implement a full fix: 90 mins, but no time to test thoroughly
        2. Deploy a quick workaround: 30 mins, reduces failure rate by 60%
        3. Disable high-value transactions temporarily: 15 mins, prevents major losses

        The team is split. Some want to launch on time. Others want to be safe.
        Your decision will determine whether you hit the deadline.`,
        context: {
          goal: "Minimize risk while hitting the launch window",
          timeline: "90 minutes until launch",
          stakeholders: ["Engineering team", "Product team", "Finance", "Customers"],
          constraints: [
            "Very limited testing time",
            "Can't test with real payment processors",
            "Risk of user data exposure",
          ],
        },
        options: [
          {
            id: "a",
            text: "🎯 Implement full fix with rapid code review and automated tests only",
            icon: "🎯",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "⚠️ Deploy workaround, monitor closely, have rollback plan ready",
            icon: "⚠️",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "🛡️ Disable high-value transactions, protect against worst case",
            icon: "🛡️",
            difficulty: "easy",
          },
          {
            id: "d",
            text: "🤷 'Just ship it' - hope the bug doesn't affect too many users",
            icon: "🤷",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 3,
        title: "Communication & Follow-up",
        scenario: `The fix is deployed. Payment success rate is 98% (up from 85%).

        But now you need to:
        1. Communicate what happened to stakeholders
        2. Explain the risk/reward decision you made
        3. Plan the post-launch investigation
        4. Keep the team morale high

        A journalist from TechNews just called the CEO asking about the "payment system failure."
        Social media is starting to pick it up.`,
        context: {
          goal: "Manage the narrative and maintain trust with users",
          timeline: "2 hours after launch",
          stakeholders: ["Public", "Media", "Leadership", "Users", "Team"],
          constraints: [
            "Negative headlines are forming",
            "Limited information to share publicly",
            "Must maintain user confidence",
          ],
        },
        options: [
          {
            id: "a",
            text: "📢 Publish a transparent post about what happened and how it's fixed",
            icon: "📢",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "🤐 Say nothing publicly - don't draw more attention",
            icon: "🤐",
            difficulty: "hard",
          },
          {
            id: "c",
            text: "📹 Hold a press conference with engineers explaining the technical issue",
            icon: "📹",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "💬 Blame external vendors or infrastructure for the issue",
            icon: "💬",
            difficulty: "hard",
          },
        ],
      },
    ],
  },
  {
    id: "sim-designer-1",
    professionId: "ux-designer",
    profession: "UX Designer",
    title: "Redesigning a Legacy Product",
    titleRu: "Переделка устаревшего продукта",
    titleKk: "Ескі өнімді қайта жобалау",
    description: "Your company wants to modernize its 10-year-old e-commerce platform. The old interface works but users hate it.",
    descriptionRu: "Компания хочет модернизировать свою 10-летнюю платформу электронной коммерции.",
    descriptionKk: "Компания 10 жасар электрондық сауда платформасын жаңартқысы келеді.",
    difficulty: "medium",
    missions: [
      {
        id: 1,
        title: "Research & Discovery",
        scenario: `You have $50k budget and 8 weeks to redesign.

        Current problems (from user interviews):
        - Checkout takes 8 steps (industry standard: 3-4)
        - Mobile version is unusable
        - Product search doesn't work well
        - Confusing information hierarchy

        Your team is asking: "What should we redesign first?"

        But you also have constraints:
        - Legacy backend can't change
        - Must support IE11 browsers
        - Finance team needs to avoid refunds
        - CEO wants "just make it look modern"`,
        context: {
          goal: "Create a prioritized redesign roadmap that increases conversion",
          timeline: "8 weeks",
          stakeholders: ["Users", "Engineering", "Finance", "Leadership"],
          constraints: [
            "Technical debt in backend",
            "Browser compatibility needs",
            "Budget limitations",
            "Stakeholder misalignment",
          ],
        },
        options: [
          {
            id: "a",
            text: "Run comprehensive user research first, let data guide priorities",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "Start with visual redesign to make it look modern quickly",
            difficulty: "easy",
          },
          {
            id: "c",
            text: "Focus on checkout flow — it's the biggest pain point",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "Redesign everything at once — need to be efficient with time",
            difficulty: "hard",
          },
        ],
      },
    ],
  },
  {
    id: "ux-designer-1",
    professionId: "ux-designer",
    profession: "UX Designer",
    title: "UX Designer: Crisis Day",
    titleRu: "UX-дизайнер: Кризисный день",
    titleKk: "UX-дизайнер: Дағдарыс күні",
    description: "Users are complaining about the confusing interface. You are a UX designer. How do you fix it?",
    descriptionRu: "Пользователи жалуются на сложный интерфейс. Ты UX-дизайнер. Как ты это исправишь?",
    descriptionKk: "Пайдаланушылар күрделі интерфейс туралы шағымданады. Сен UX-дизайнерсің. Оны қалай түзейсің?",
    difficulty: "easy",
    missions: [
      {
        id: 1,
        title: "Первый сигнал",
        scenario: `Ты только что стал UX-дизайнером в стартапе.

Твой менеджер пишет:
"Только что вышел отчёт. 70% пользователей бросают регистрацию на шаге 3 из 5. Нужно срочно что-то делать. У тебя 2 дня."

В твоей команде:
- Один разработчик (занят другим проектом)
- Нет тестировщиков
- Дизайн-система не описана

С чего начнёшь?`,
        context: {
          goal: "Понять причину отказов и предложить решение",
          timeline: "2 дня",
          stakeholders: ["Менеджер", "Разработчик", "Реальные пользователи"],
          constraints: [
            "Ограниченное время",
            "Мало ресурсов команды",
            "Нет данных о пользователях",
          ],
        },
        options: [
          {
            id: "a",
            text: "Сразу переделать шаг 3 — убрать лишние поля",
            difficulty: "easy",
          },
          {
            id: "b",
            text: "Провести 5 быстрых интервью с пользователями, чтобы понять причину",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "Посмотреть записи сессий в Hotjar/FullStory и найти паттерн",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "Попросить менеджера подождать — нужно больше времени на анализ",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 2,
        title: "Что скрывает шаг 3",
        scenario: `Ты посмотрел записи сессий. Вот что нашёл:

Шаг 3 — форма "О себе":
- 12 обязательных полей
- Поле "Дата рождения" вызывает путаницу
- Кнопка "Далее" не видна на мобильных
- Нет подсказок к полям

Пользователи застревают особенно на поле "Имя пользователя". Оно требует уникальное имя, но не объясняет правила.

Разработчик говорит: "Поля нужны для аналитики. Их нельзя убирать."

Что будешь делать?`,
        context: {
          goal: "Сократить dropout на шаге 3 без удаления полей",
          timeline: "1 день на дизайн",
          stakeholders: ["Разработчик", "Аналитик", "Пользователи"],
          constraints: [
            "Нельзя убирать поля — нужна аналитика",
            "Бэкенд трогать нельзя",
            "Ограниченное время",
          ],
        },
        options: [
          {
            id: "a",
            text: "Добавить inline-подсказки к каждому полю и сделать кнопку видимой на мобайле",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "Разбить шаг 3 на 2 подшага — уменьшить когнитивную нагрузку",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "Сделать часть полей необязательными и добавить прогресс-бар",
            difficulty: "hard",
          },
          {
            id: "d",
            text: "Настоять на удалении полей — пользовательский опыт важнее аналитики",
            difficulty: "easy",
          },
        ],
      },
      {
        id: 3,
        title: "Прототип под огнём",
        scenario: `Ты сделал прототип в Figma за ночь.

Вот реакции на review:

Разработчик: "Это займёт 2 недели, у нас нет времени."
Менеджер: "Мне нравится, но СЕО хочет, чтобы логотип был крупнее."
Аналитик: "Ты убрал поле 'Город' — нам оно нужно для отчётов."
Пользователь (тест): "Наконец-то понятно! Но кнопка 'Назад' пропала."

Время критик-сессии истекло. У тебя 1 час до финального решения.

Что делаешь с фидбеком?`,
        context: {
          goal: "Защитить ключевые решения и принять компромиссы",
          timeline: "1 час до финального решения",
          stakeholders: ["Разработчик", "Менеджер", "СЕО", "Аналитик", "Пользователь"],
          constraints: [
            "Не всё можно реализовать сразу",
            "У разных людей разные приоритеты",
            "Реальный пользователь нашёл баг",
          ],
        },
        options: [
          {
            id: "a",
            text: "Принять весь фидбек и обновить прототип — делаем всё правки",
            difficulty: "easy",
          },
          {
            id: "b",
            text: "Исправить баг с кнопкой 'Назад', вернуть поле 'Город', остальное — в следующей итерации",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "Приоритизировать фидбек по влиянию на пользователя: баг исправить, поле вернуть, лого — нет",
            difficulty: "hard",
          },
          {
            id: "d",
            text: "Отложить всё — нужно ещё одно тестирование",
            difficulty: "hard",
          },
        ],
      },
      {
        id: 4,
        title: "A/B тест: решение",
        scenario: `Разработчик предлагает запустить A/B тест: старая версия vs твоя.

Параметры:
- 50% трафика на старую версию
- 50% трафика на твою версию
- Срок теста: 2 недели

Но появляется проблема:
Маркетолог говорит: "Мы запускаем рекламную кампанию через 3 дня. Нельзя ждать 2 недели."

Менеджер: "Либо сейчас, либо выкатываем сразу без теста."

Что предлагаешь?`,
        context: {
          goal: "Запустить изменения с минимальным риском и максимальной скоростью",
          timeline: "3 дня до рекламы",
          stakeholders: ["Маркетолог", "Разработчик", "Менеджер"],
          constraints: [
            "3 дня — мало для корректного A/B теста",
            "Рекламная кампания нельзя переносить",
            "Риск потерять деньги на плохой UX",
          ],
        },
        options: [
          {
            id: "a",
            text: "Запустить A/B тест на 3 дня — даже ограниченные данные лучше, чем ничего",
            difficulty: "medium",
          },
          {
            id: "b",
            text: "Выкатить новую версию полностью — у нас есть данные из тестов с пользователями",
            difficulty: "medium",
          },
          {
            id: "c",
            text: "Запустить только критические фиксы (баг + кнопка), отложить полный редизайн",
            difficulty: "hard",
          },
          {
            id: "d",
            text: "Отменить рекламу — нельзя запускать с непроверенным интерфейсом",
            difficulty: "easy",
          },
        ],
      },
      {
        id: 5,
        title: "Результаты и следующий шаг",
        scenario: `Прошло 2 недели после запуска.

Данные показывают:
- Dropout на шаге 3: снизился с 70% до 38%
- Время заполнения формы: с 4 мин до 2.1 мин
- NPS (оценка пользователей): +12 пунктов

Менеджер доволен. СЕО говорит: "Отлично! Теперь сделай так же на всём продукте."

Тебя спрашивают: "Что делаем дальше?"

У тебя есть 3 опции:`,
        context: {
          goal: "Масштабировать успех на весь продукт стратегически",
          timeline: "Квартал Q2",
          stakeholders: ["СЕО", "Продуктовая команда", "Разработка"],
          constraints: [
            "Команда ограничена в ресурсах",
            "Много других проблем в продукте",
            "Нет системной дизайн-системы",
          ],
        },
        options: [
          {
            id: "a",
            text: "Применить те же фиксы ко всем экранам — быстрый способ улучшить продукт",
            difficulty: "easy",
          },
          {
            id: "b",
            text: "Создать дизайн-систему — чтобы все изменения были консистентны и масштабируемы",
            difficulty: "hard",
          },
          {
            id: "c",
            text: "Провести UX-аудит всего продукта, приоритизировать проблемы, затем системно исправлять",
            difficulty: "medium",
          },
          {
            id: "d",
            text: "Нанять ещё дизайнеров — одному не справиться",
            difficulty: "medium",
          },
        ],
      },
    ],
  },
];
