export type RiasecDimension = "R" | "I" | "A" | "S" | "E" | "C";

export interface RiasecQuestion {
  id: number;
  dimension: RiasecDimension;
  en: string;
  ru: string;
  kk: string;
}

export interface RiasecScores {
  R: number; // Realistic
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
}

export const DIMENSION_LABELS: Record<RiasecDimension, { en: string; ru: string; kk: string; description: { en: string; ru: string; kk: string } }> = {
  R: {
    en: "Realistic",
    ru: "Реалистичный",
    kk: "Нақтылы",
    description: {
      en: "You enjoy working with tools, machines, and physical things. Practical and hands-on.",
      ru: "Тебе нравится работать с инструментами, машинами и физическими объектами. Практичный и конкретный.",
      kk: "Сен аспаптармен, машиналармен және физикалық заттармен жұмыс жасауды ұнатасың. Практикалық.",
    },
  },
  I: {
    en: "Investigative",
    ru: "Исследовательский",
    kk: "Зерттеушілік",
    description: {
      en: "You love analyzing, researching, and solving complex intellectual problems.",
      ru: "Тебе нравится анализировать, исследовать и решать сложные интеллектуальные задачи.",
      kk: "Сен талдауды, зерттеуді және күрделі ой мәселелерін шешуді ұнатасың.",
    },
  },
  A: {
    en: "Artistic",
    ru: "Артистичный",
    kk: "Көркемдік",
    description: {
      en: "You are creative and expressive, preferring freedom and self-expression.",
      ru: "Ты творческий и выразительный, предпочитаешь свободу и самовыражение.",
      kk: "Сен шығармашыл және экспрессивсің, еркіндік пен өзін-өзі білдіруді қалайсың.",
    },
  },
  S: {
    en: "Social",
    ru: "Социальный",
    kk: "Әлеуметтік",
    description: {
      en: "You enjoy helping, teaching, and working with people.",
      ru: "Тебе нравится помогать, учить и работать с людьми.",
      kk: "Сен адамдарға көмектесуді, оқытуды және олармен жұмыс жасауды ұнатасың.",
    },
  },
  E: {
    en: "Enterprising",
    ru: "Предприимчивый",
    kk: "Кәсіпкерлік",
    description: {
      en: "You like leading, persuading, and managing people and projects.",
      ru: "Тебе нравится руководить, убеждать и управлять людьми и проектами.",
      kk: "Сен жетекшілік жасауды, сендіруді және адамдар мен жобаларды басқаруды ұнатасың.",
    },
  },
  C: {
    en: "Conventional",
    ru: "Конвенциональный",
    kk: "Конвенционалды",
    description: {
      en: "You prefer organized, structured work with data, details, and systems.",
      ru: "Ты предпочитаешь организованную, структурированную работу с данными, деталями и системами.",
      kk: "Сен деректермен, бөлшектермен және жүйелермен ұйымдасқан, құрылымдалған жұмысты қалайсың.",
    },
  },
};

// Career recommendations by RIASEC code (first 2-3 letters of top dimensions)
export const RIASEC_CAREERS: Record<string, { en: string; ru: string; kk: string }[]> = {
  RI: [{ en: "Mechanical Engineer", ru: "Инженер-механик", kk: "Механика инженері" }, { en: "Civil Engineer", ru: "Инженер-строитель", kk: "Азаматтық инженер" }, { en: "Electrical Engineer", ru: "Инженер-электрик", kk: "Электр инженері" }],
  RA: [{ en: "Architect", ru: "Архитектор", kk: "Сәулетші" }, { en: "Industrial Designer", ru: "Промышленный дизайнер", kk: "Өнеркәсіптік дизайнер" }, { en: "Landscape Architect", ru: "Ландшафтный архитектор", kk: "Ландшафт сәулетшісі" }],
  RS: [{ en: "Physical Therapist", ru: "Физиотерапевт", kk: "Физиотерапевт" }, { en: "Veterinarian", ru: "Ветеринар", kk: "Ветеринар" }, { en: "Occupational Therapist", ru: "Трудовой терапевт", kk: "Еңбек терапевті" }],
  RE: [{ en: "Construction Manager", ru: "Менеджер по строительству", kk: "Құрылыс менеджері" }, { en: "Military Officer", ru: "Военный офицер", kk: "Әскери офицер" }, { en: "Pilot", ru: "Пилот", kk: "Пилот" }],
  RC: [{ en: "Accountant", ru: "Бухгалтер", kk: "Бухгалтер" }, { en: "Quality Control Inspector", ru: "Инспектор по контролю качества", kk: "Сапа бақылау инспекторы" }, { en: "Surveyor", ru: "Геодезист", kk: "Геодезист" }],
  IR: [{ en: "Software Engineer", ru: "Инженер-программист", kk: "Бағдарламалық жасақтама инженері" }, { en: "Data Scientist", ru: "Учёный по данным", kk: "Деректер ғалымы" }, { en: "Physicist", ru: "Физик", kk: "Физик" }],
  IA: [{ en: "Medical Researcher", ru: "Медицинский исследователь", kk: "Медициналық зерттеуші" }, { en: "UX Designer", ru: "UX-дизайнер", kk: "UX-дизайнер" }, { en: "Psychologist", ru: "Психолог", kk: "Психолог" }],
  IS: [{ en: "Doctor", ru: "Врач", kk: "Дәрігер" }, { en: "Biologist", ru: "Биолог", kk: "Биолог" }, { en: "Pharmacist", ru: "Фармацевт", kk: "Фармацевт" }],
  IE: [{ en: "Investment Analyst", ru: "Инвестиционный аналитик", kk: "Инвестициялық аналитик" }, { en: "Tech Entrepreneur", ru: "Технологический предприниматель", kk: "Технологиялық кәсіпкер" }, { en: "Economist", ru: "Экономист", kk: "Экономист" }],
  IC: [{ en: "Statistician", ru: "Статистик", kk: "Статистик" }, { en: "Financial Analyst", ru: "Финансовый аналитик", kk: "Қаржы аналитигі" }, { en: "Database Administrator", ru: "Администратор БД", kk: "ДБ администраторы" }],
  AR: [{ en: "Graphic Designer", ru: "Графический дизайнер", kk: "Графикалық дизайнер" }, { en: "Animator", ru: "Аниматор", kk: "Аниматор" }, { en: "Film Director", ru: "Кинорежиссёр", kk: "Кино режиссері" }],
  AI: [{ en: "Journalist", ru: "Журналист", kk: "Журналист" }, { en: "Writer", ru: "Писатель", kk: "Жазушы" }, { en: "Art Director", ru: "Арт-директор", kk: "Өнер директоры" }],
  AS: [{ en: "Teacher of Arts", ru: "Учитель искусств", kk: "Өнер мұғалімі" }, { en: "Music Therapist", ru: "Музыкальный терапевт", kk: "Музыкалық терапевт" }, { en: "Actor", ru: "Актёр", kk: "Актер" }],
  AE: [{ en: "Advertising Manager", ru: "Менеджер по рекламе", kk: "Жарнама менеджері" }, { en: "Fashion Designer", ru: "Модельер", kk: "Сән дизайнері" }, { en: "Marketing Creative", ru: "Маркетинговый креатив", kk: "Маркетинг шығармашылы" }],
  AC: [{ en: "Editor", ru: "Редактор", kk: "Редактор" }, { en: "Interior Designer", ru: "Дизайнер интерьеров", kk: "Интерьер дизайнері" }, { en: "Photographer", ru: "Фотограф", kk: "Фотограф" }],
  SR: [{ en: "Sports Coach", ru: "Спортивный тренер", kk: "Спорт жаттықтырушысы" }, { en: "Paramedic", ru: "Фельдшер", kk: "Парамедик" }, { en: "Community Worker", ru: "Работник социальной сферы", kk: "Қоғамдық қызметкер" }],
  SI: [{ en: "School Counselor", ru: "Школьный психолог", kk: "Мектеп психологы" }, { en: "Nurse", ru: "Медсестра", kk: "Медбике" }, { en: "Speech Therapist", ru: "Логопед", kk: "Логопед" }],
  SA: [{ en: "Drama Teacher", ru: "Учитель театра", kk: "Театр мұғалімі" }, { en: "Social Worker", ru: "Социальный работник", kk: "Әлеуметтік қызметкер" }, { en: "Librarian", ru: "Библиотекарь", kk: "Кітапханашы" }],
  SE: [{ en: "HR Manager", ru: "HR-менеджер", kk: "HR менеджері" }, { en: "Teacher", ru: "Учитель", kk: "Мұғалім" }, { en: "Social Media Manager", ru: "SMM-специалист", kk: "Әлеуметтік медиа менеджері" }],
  SC: [{ en: "Medical Records Specialist", ru: "Специалист по медицинским записям", kk: "Медициналық жазба маманы" }, { en: "Administrative Assistant", ru: "Административный помощник", kk: "Әкімшілік көмекші" }, { en: "Court Reporter", ru: "Стенограф суда", kk: "Сот стенографисті" }],
  ER: [{ en: "Real Estate Agent", ru: "Риэлтор", kk: "Риэлтор" }, { en: "Farm Manager", ru: "Менеджер фермы", kk: "Шаруашылық менеджері" }, { en: "Sales Manager", ru: "Менеджер по продажам", kk: "Сату менеджері" }],
  EI: [{ en: "Lawyer", ru: "Юрист", kk: "Заңгер" }, { en: "Business Analyst", ru: "Бизнес-аналитик", kk: "Бизнес-аналитик" }, { en: "Management Consultant", ru: "Консультант по управлению", kk: "Басқару кеңесшісі" }],
  EA: [{ en: "Marketing Manager", ru: "Маркетинг-менеджер", kk: "Маркетинг менеджері" }, { en: "Public Relations Specialist", ru: "PR-специалист", kk: "PR маманы" }, { en: "Brand Manager", ru: "Бренд-менеджер", kk: "Бренд менеджері" }],
  ES: [{ en: "School Principal", ru: "Директор школы", kk: "Мектеп директоры" }, { en: "Event Planner", ru: "Организатор мероприятий", kk: "Іс-шара ұйымдастырушысы" }, { en: "Hotel Manager", ru: "Менеджер отеля", kk: "Қонақ үй менеджері" }],
  EC: [{ en: "Entrepreneur", ru: "Предприниматель", kk: "Кәсіпкер" }, { en: "Bank Manager", ru: "Менеджер банка", kk: "Банк менеджері" }, { en: "Insurance Agent", ru: "Страховой агент", kk: "Сақтандыру агенті" }],
  CR: [{ en: "Drafter", ru: "Чертёжник", kk: "Сызушы" }, { en: "Medical Lab Technician", ru: "Медицинский лаборант", kk: "Медициналық зертханашы" }, { en: "Bookkeeper", ru: "Бухгалтер", kk: "Бухгалтер" }],
  CI: [{ en: "Actuary", ru: "Актуарий", kk: "Актуарий" }, { en: "Auditor", ru: "Аудитор", kk: "Аудитор" }, { en: "Tax Specialist", ru: "Налоговый специалист", kk: "Салық маманы" }],
  CA: [{ en: "Technical Writer", ru: "Технический писатель", kk: "Техникалық жазушы" }, { en: "Desktop Publisher", ru: "Издатель", kk: "Баспашы" }, { en: "Copywriter", ru: "Копирайтер", kk: "Копирайтер" }],
  CS: [{ en: "Office Manager", ru: "Офис-менеджер", kk: "Кеңсе менеджері" }, { en: "HR Coordinator", ru: "HR-координатор", kk: "HR координатор" }, { en: "Bank Teller", ru: "Кассир банка", kk: "Банк кассирі" }],
  CE: [{ en: "Accountant", ru: "Бухгалтер-аналитик", kk: "Бухгалтер-аналитик" }, { en: "Financial Controller", ru: "Финансовый контролёр", kk: "Қаржы бақылаушысы" }, { en: "Project Coordinator", ru: "Координатор проектов", kk: "Жоба координаторы" }],
};

export const riasecQuestions: RiasecQuestion[] = [
  // === REALISTIC (R) — 7 questions ===
  {
    id: 1,
    dimension: "R",
    en: "I enjoy building or fixing things with my hands.",
    ru: "Мне нравится строить или чинить что-то руками.",
    kk: "Маған қолыммен бірдеңе жасау немесе жөндеу ұнайды.",
  },
  {
    id: 2,
    dimension: "R",
    en: "I like working outdoors or in a physical environment.",
    ru: "Мне нравится работать на улице или в физической среде.",
    kk: "Маған сыртта немесе физикалық ортада жұмыс жасау ұнайды.",
  },
  {
    id: 3,
    dimension: "R",
    en: "I enjoy using tools and equipment to complete tasks.",
    ru: "Мне нравится использовать инструменты и оборудование для выполнения задач.",
    kk: "Маған тапсырмаларды орындау үшін аспаптар мен жабдықтарды пайдалану ұнайды.",
  },
  {
    id: 4,
    dimension: "R",
    en: "I prefer doing practical work over theoretical study.",
    ru: "Я предпочитаю практическую работу теоретическому обучению.",
    kk: "Мен теориялық оқудан гөрі практикалық жұмысты қалаймын.",
  },
  {
    id: 5,
    dimension: "R",
    en: "I am good at assembling or taking apart machines.",
    ru: "Я хорошо умею собирать или разбирать машины.",
    kk: "Мен машиналарды жинап немесе бөлшектей аламын.",
  },
  {
    id: 6,
    dimension: "R",
    en: "I enjoy physical activities like sports or construction.",
    ru: "Мне нравятся физические занятия, такие как спорт или строительство.",
    kk: "Маған спорт немесе құрылыс сияқты физикалық іс-әрекеттер ұнайды.",
  },
  {
    id: 7,
    dimension: "R",
    en: "I like working with plants, animals, or in agriculture.",
    ru: "Мне нравится работать с растениями, животными или в сельском хозяйстве.",
    kk: "Маған өсімдіктермен, жануарлармен немесе ауыл шаруашылығымен жұмыс жасау ұнайды.",
  },

  // === INVESTIGATIVE (I) — 7 questions ===
  {
    id: 8,
    dimension: "I",
    en: "I love solving complex problems and puzzles.",
    ru: "Я люблю решать сложные задачи и головоломки.",
    kk: "Мен күрделі мәселелер мен жұмбақтарды шешуді жақсы көремін.",
  },
  {
    id: 9,
    dimension: "I",
    en: "I enjoy reading scientific or technical books and articles.",
    ru: "Мне нравится читать научные или технические книги и статьи.",
    kk: "Маған ғылыми немесе техникалық кітаптар мен мақалалар оқу ұнайды.",
  },
  {
    id: 10,
    dimension: "I",
    en: "I like conducting experiments or doing research.",
    ru: "Мне нравится проводить эксперименты или заниматься исследованиями.",
    kk: "Маған тәжірибелер жүргізу немесе зерттеу жұмыстарымен айналысу ұнайды.",
  },
  {
    id: 11,
    dimension: "I",
    en: "I prefer analyzing data to find patterns or insights.",
    ru: "Я предпочитаю анализировать данные для поиска закономерностей.",
    kk: "Мен заңдылықтар мен ойларды табу үшін деректерді талдауды қалаймын.",
  },
  {
    id: 12,
    dimension: "I",
    en: "I enjoy working on intellectual challenges and theories.",
    ru: "Мне нравится работать над интеллектуальными задачами и теориями.",
    kk: "Маған зияткерлік тапсырмалар мен теориялармен жұмыс жасау ұнайды.",
  },
  {
    id: 13,
    dimension: "I",
    en: "I like learning about how things work in nature or science.",
    ru: "Мне нравится узнавать, как всё работает в природе или науке.",
    kk: "Маған табиғатта немесе ғылымда заттардың қалай жұмыс жасайтынын білу ұнайды.",
  },
  {
    id: 14,
    dimension: "I",
    en: "I often ask 'why' and want to understand things deeply.",
    ru: "Я часто спрашиваю «почему» и хочу глубоко понять вещи.",
    kk: "Мен жиі «неге?» деп сұраймын және заттарды тереңінен түсінгім келеді.",
  },

  // === ARTISTIC (A) — 7 questions ===
  {
    id: 15,
    dimension: "A",
    en: "I enjoy creating art, music, or writing.",
    ru: "Мне нравится создавать искусство, музыку или писать.",
    kk: "Маған өнер жасау, музыка немесе жазу ұнайды.",
  },
  {
    id: 16,
    dimension: "A",
    en: "I prefer freedom and creativity in my work over strict rules.",
    ru: "Я предпочитаю свободу и творчество в работе, а не строгие правила.",
    kk: "Мен жұмыста қатаң ережелерден гөрі еркіндік пен шығармашылықты қалаймын.",
  },
  {
    id: 17,
    dimension: "A",
    en: "I have a strong sense of aesthetics and design.",
    ru: "У меня развито чувство эстетики и дизайна.",
    kk: "Менде эстетика мен дизайнға деген сезім жақсы дамыған.",
  },
  {
    id: 18,
    dimension: "A",
    en: "I like expressing myself through creative projects.",
    ru: "Мне нравится выражать себя через творческие проекты.",
    kk: "Маған шығармашылық жобалар арқылы өзімді білдіру ұнайды.",
  },
  {
    id: 19,
    dimension: "A",
    en: "I enjoy attending concerts, museums, or art exhibitions.",
    ru: "Мне нравится посещать концерты, музеи или художественные выставки.",
    kk: "Маған концерттерге, мұражайларға немесе көркем өнер көрмелеріне бару ұнайды.",
  },
  {
    id: 20,
    dimension: "A",
    en: "I often think of unique or unconventional ideas.",
    ru: "Я часто думаю о нестандартных или оригинальных идеях.",
    kk: "Мен жиі бірегей немесе ерекше идеялар туралы ойлаймын.",
  },
  {
    id: 21,
    dimension: "A",
    en: "I like storytelling, photography, or filmmaking.",
    ru: "Мне нравится рассказывать истории, фотографировать или снимать фильмы.",
    kk: "Маған әңгіме айту, фотосурет немесе фильм түсіру ұнайды.",
  },

  // === SOCIAL (S) — 7 questions ===
  {
    id: 22,
    dimension: "S",
    en: "I enjoy helping others with their problems.",
    ru: "Мне нравится помогать другим с их проблемами.",
    kk: "Маған басқаларға мәселелерімен көмектесу ұнайды.",
  },
  {
    id: 23,
    dimension: "S",
    en: "I like teaching or explaining things to people.",
    ru: "Мне нравится учить или объяснять что-то людям.",
    kk: "Маған адамдарға бірдеңе үйрету немесе түсіндіру ұнайды.",
  },
  {
    id: 24,
    dimension: "S",
    en: "I am good at listening and understanding others' feelings.",
    ru: "Я умею слушать и понимать чувства других людей.",
    kk: "Мен басқалардың сезімдерін тыңдай және түсіне аламын.",
  },
  {
    id: 25,
    dimension: "S",
    en: "I prefer working in teams over working alone.",
    ru: "Я предпочитаю работать в команде, а не в одиночку.",
    kk: "Мен жалғыз жұмыс жасаудан гөрі топта жұмыс жасауды қалаймын.",
  },
  {
    id: 26,
    dimension: "S",
    en: "I care deeply about making a positive impact on society.",
    ru: "Мне важно оказывать положительное влияние на общество.",
    kk: "Маған қоғамға оң ықпал ету маңызды.",
  },
  {
    id: 27,
    dimension: "S",
    en: "I volunteer or enjoy participating in community activities.",
    ru: "Я занимаюсь волонтёрством или участвую в общественных мероприятиях.",
    kk: "Мен еріктілікпен айналысамын немесе қоғамдық іс-шараларға қатысамын.",
  },
  {
    id: 28,
    dimension: "S",
    en: "I enjoy counseling or advising friends when they have problems.",
    ru: "Мне нравится консультировать или давать советы друзьям при проблемах.",
    kk: "Маған достарымның мәселелері болғанда кеңес беру ұнайды.",
  },

  // === ENTERPRISING (E) — 7 questions ===
  {
    id: 29,
    dimension: "E",
    en: "I like taking the lead in group projects or activities.",
    ru: "Мне нравится брать на себя инициативу в групповых проектах.",
    kk: "Маған топтық жобаларда бастамашыл болу ұнайды.",
  },
  {
    id: 30,
    dimension: "E",
    en: "I enjoy convincing or persuading others to my point of view.",
    ru: "Мне нравится убеждать других в своей точке зрения.",
    kk: "Маған басқаларды өз көзқарасыма сендіру ұнайды.",
  },
  {
    id: 31,
    dimension: "E",
    en: "I am interested in starting a business or being an entrepreneur.",
    ru: "Меня интересует открытие бизнеса или предпринимательство.",
    kk: "Маған бизнес ашу немесе кәсіпкер болу қызықтырады.",
  },
  {
    id: 32,
    dimension: "E",
    en: "I like competitive situations where I can win.",
    ru: "Мне нравятся конкурентные ситуации, где я могу победить.",
    kk: "Маған жеңе алатын бәсекелестік жағдайлар ұнайды.",
  },
  {
    id: 33,
    dimension: "E",
    en: "I enjoy making important decisions and taking responsibility.",
    ru: "Мне нравится принимать важные решения и нести ответственность.",
    kk: "Маған маңызды шешімдер қабылдау және жауапкершілік алу ұнайды.",
  },
  {
    id: 34,
    dimension: "E",
    en: "I am comfortable speaking in front of large groups.",
    ru: "Мне комфортно выступать перед большой аудиторией.",
    kk: "Маған үлкен аудитория алдында сөйлеу ыңғайлы.",
  },
  {
    id: 35,
    dimension: "E",
    en: "I think about how to make money and grow a business.",
    ru: "Я думаю о том, как зарабатывать деньги и развивать бизнес.",
    kk: "Мен ақша табу және бизнесті дамыту туралы ойлаймын.",
  },

  // === CONVENTIONAL (C) — 7 questions ===
  {
    id: 36,
    dimension: "C",
    en: "I like working with numbers, data, and spreadsheets.",
    ru: "Мне нравится работать с числами, данными и таблицами.",
    kk: "Маған сандармен, деректермен және кестелермен жұмыс жасау ұнайды.",
  },
  {
    id: 37,
    dimension: "C",
    en: "I prefer clear instructions and structured tasks.",
    ru: "Я предпочитаю чёткие инструкции и структурированные задачи.",
    kk: "Мен нақты нұсқаулар мен құрылымдалған тапсырмаларды қалаймын.",
  },
  {
    id: 38,
    dimension: "C",
    en: "I enjoy organizing files, records, or information systems.",
    ru: "Мне нравится организовывать файлы, записи или информационные системы.",
    kk: "Маған файлдарды, жазбаларды немесе ақпараттық жүйелерді ұйымдастыру ұнайды.",
  },
  {
    id: 39,
    dimension: "C",
    en: "I am good at keeping track of details and following procedures.",
    ru: "Я хорошо отслеживаю детали и следую процедурам.",
    kk: "Мен бөлшектерді бақылап, процедураларды сақтай аламын.",
  },
  {
    id: 40,
    dimension: "C",
    en: "I like managing budgets, finances, or accounting tasks.",
    ru: "Мне нравится управлять бюджетами, финансами или бухгалтерскими задачами.",
    kk: "Маған бюджеттерді, қаржыны немесе бухгалтерлік тапсырмаларды басқару ұнайды.",
  },
  {
    id: 41,
    dimension: "C",
    en: "I prefer routine tasks that have clear right and wrong answers.",
    ru: "Я предпочитаю рутинные задачи с чёткими правильными ответами.",
    kk: "Мен нақты дұрыс және қате жауаптары бар тұрақты тапсырмаларды қалаймын.",
  },
  {
    id: 42,
    dimension: "C",
    en: "I enjoy working in an office environment with defined processes.",
    ru: "Мне нравится работать в офисе с чёткими процессами.",
    kk: "Маған нақты процестері бар кеңседе жұмыс жасау ұнайды.",
  },
];

/**
 * Calculate RIASEC scores from answers.
 * answers: Record<questionId, rating> where rating is 1-5
 */
export function calculateRiasecScores(answers: Record<number, number>): RiasecScores {
  const scores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const question of riasecQuestions) {
    const rating = answers[question.id] ?? 0;
    scores[question.dimension] += rating;
  }

  return scores;
}

/**
 * Get top dimensions sorted by score descending
 */
export function getTopDimensions(scores: RiasecScores): RiasecDimension[] {
  return (Object.entries(scores) as [RiasecDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([dim]) => dim);
}

/**
 * Get Holland Code (top 3 dimensions)
 */
export function getHollandCode(scores: RiasecScores): string {
  return getTopDimensions(scores).slice(0, 3).join("");
}

/**
 * Get career suggestions based on top 2 dimensions
 */
export function getSuggestedCareers(scores: RiasecScores): { en: string; ru: string; kk: string }[] {
  const top = getTopDimensions(scores);
  const code2 = top[0] + top[1];
  return RIASEC_CAREERS[code2] || RIASEC_CAREERS[top[1] + top[0]] || [];
}
