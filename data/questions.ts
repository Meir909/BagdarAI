export interface QuizOption {
  en: string;
  ru: string;
  kk: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  en: string;
  ru: string;
  kk: string;
  category: string;
  options: QuizOption[];
}

export const careerQuestions: QuizQuestion[] = [
  {
    id: 1,
    en: "What activity do you enjoy most in your free time?",
    ru: "Чем ты больше всего любишь заниматься в свободное время?",
    kk: "Бос уақытыңда ең ұнататын ісің не?",
    category: "interests",
    options: [
      { en: "Programming or using technology", ru: "Программирование или технологии", kk: "Бағдарламалау немесе технологиялар", category: "IT" },
      { en: "Creating art or music", ru: "Создание искусства или музыки", kk: "Өнер немесе музыка жасау", category: "Creative" },
      { en: "Reading books or doing research", ru: "Чтение книг или исследования", kk: "Кітап оқу немесе зерттеу", category: "Science" },
      { en: "Playing sports or staying active", ru: "Занятие спортом или активность", kk: "Спортпен немесе белсенді болу", category: "Medicine" },
    ],
  },
  {
    id: 2,
    en: "How do you prefer to solve problems?",
    ru: "Как ты предпочитаешь решать проблемы?",
    kk: "Мәселелерді қалай шешкенді жөн көресің?",
    category: "analytical",
    options: [
      { en: "With logic and systematic analysis", ru: "Логикой и системным анализом", kk: "Логика мен жүйелі талдаумен", category: "IT" },
      { en: "With creative and original ideas", ru: "Творческими и оригинальными идеями", kk: "Шығармашылық және оригинал идеялармен", category: "Creative" },
      { en: "By gathering data and researching", ru: "Сбором данных и исследованием", kk: "Деректер жинау және зерттеумен", category: "Science" },
      { en: "By working with others as a team", ru: "Командной работой с другими", kk: "Командамен бірге жұмыс істеумен", category: "Business" },
    ],
  },
  {
    id: 3,
    en: "Which subject do you enjoy most at school?",
    ru: "Какой предмет тебе больше всего нравится в школе?",
    kk: "Мектепте қандай пәнді ең ұнататынсың?",
    category: "interests",
    options: [
      { en: "Math or Computer Science", ru: "Математика или информатика", kk: "Математика немесе информатика", category: "IT" },
      { en: "Art, Music or Literature", ru: "Искусство, музыка или литература", kk: "Өнер, музыка немесе әдебиет", category: "Creative" },
      { en: "Biology, Chemistry or Physics", ru: "Биология, химия или физика", kk: "Биология, химия немесе физика", category: "Science" },
      { en: "History, Economics or Languages", ru: "История, экономика или языки", kk: "Тарих, экономика немесе тілдер", category: "Business" },
    ],
  },
  {
    id: 4,
    en: "How comfortable are you with taking risks?",
    ru: "Насколько ты комфортно чувствуешь себя при рисках?",
    kk: "Тәуекелдерге қаншалықты жайлы қарайсың?",
    category: "leadership",
    options: [
      { en: "I love taking calculated risks and trying new things", ru: "Мне нравится рисковать и пробовать новое", kk: "Есептелген тәуекелдер алуды және жаңа нәрселерді сынауды ұнатамын", category: "Business" },
      { en: "I prefer security and stability", ru: "Я предпочитаю безопасность и стабильность", kk: "Қауіпсіздік пен тұрақтылықты қалаймын", category: "Engineering" },
      { en: "Depends on how much I know about the situation", ru: "Зависит от того, насколько я знаком с ситуацией", kk: "Жағдайды қаншалықты білетініме байланысты", category: "Science" },
      { en: "I enjoy creative risks in art or ideas", ru: "Мне нравится творческий риск", kk: "Өнерде немесе идеяларда шығармашылық тәуекел ұнайды", category: "Creative" },
    ],
  },
  {
    id: 5,
    en: "What kind of work environment do you prefer?",
    ru: "Какую рабочую среду ты предпочитаешь?",
    kk: "Қандай жұмыс ортасын қалайсың?",
    category: "communication",
    options: [
      { en: "Quiet office with individual work", ru: "Тихий офис с индивидуальной работой", kk: "Жеке жұмыс жасайтын тыныш кеңсе", category: "IT" },
      { en: "Creative studio with flexible hours", ru: "Творческая студия с гибким графиком", kk: "Икемді сағаттар бар шығармашылық студия", category: "Creative" },
      { en: "Lab or research environment", ru: "Лаборатория или исследовательская среда", kk: "Зертхана немесе зерттеу ортасы", category: "Science" },
      { en: "Dynamic team environment with meetings", ru: "Динамичная командная среда с совещаниями", kk: "Кездесулер бар динамикалық командалық орта", category: "Business" },
    ],
  },
  {
    id: 6,
    en: "What motivates you most in your future career?",
    ru: "Что тебя больше всего мотивирует в будущей карьере?",
    kk: "Болашақ мансапта сені не ең көп ынталандырады?",
    category: "interests",
    options: [
      { en: "Building innovative products or technologies", ru: "Создание инновационных продуктов", kk: "Инновациялық өнімдер мен технологиялар жасау", category: "IT" },
      { en: "Helping people directly with their problems", ru: "Помощь людям с их проблемами", kk: "Адамдарға мәселелерімен тікелей көмектесу", category: "Medicine" },
      { en: "Making money and achieving success", ru: "Зарабатывание денег и достижение успеха", kk: "Ақша табу және жетістікке жету", category: "Business" },
      { en: "Expressing creativity and making art", ru: "Выражение творчества и создание искусства", kk: "Шығармашылықты білдіру және өнер жасау", category: "Creative" },
    ],
  },
  {
    id: 7,
    en: "How do you feel about leading and managing others?",
    ru: "Как ты относишься к руководству другими людьми?",
    kk: "Басқаларды басқару мен жетекшілік туралы не ойлайсың?",
    category: "leadership",
    options: [
      { en: "I love leading and motivating teams", ru: "Мне нравится руководить командами", kk: "Командаларды басқару және ынталандыруды ұнатамын", category: "Business" },
      { en: "I prefer working independently on technical problems", ru: "Предпочитаю работать самостоятельно", kk: "Техникалық мәселелерде өз бетімше жұмыс істеуді қалаймын", category: "IT" },
      { en: "I can lead when needed but prefer collaboration", ru: "Могу вести, но предпочитаю сотрудничество", kk: "Қажет болса жетекшілік ете аламын, бірақ ынтымақтастықты қалаймын", category: "Science" },
      { en: "I prefer mentoring and teaching others", ru: "Предпочитаю наставничество", kk: "Басқаларды тәлімгерлік пен оқытуды қалаймын", category: "Education" },
    ],
  },
  {
    id: 8,
    en: "What type of projects do you enjoy most?",
    ru: "Какие проекты тебе больше всего нравятся?",
    kk: "Қандай жобаларды ең ұнататынсың?",
    category: "analytical",
    options: [
      { en: "Technical projects with clear goals", ru: "Технические проекты с четкими целями", kk: "Нақты мақсаттары бар техникалық жобалар", category: "Engineering" },
      { en: "Research projects finding new knowledge", ru: "Исследовательские проекты", kk: "Жаңа білім табатын зерттеу жобалары", category: "Science" },
      { en: "Creative projects with artistic freedom", ru: "Творческие проекты с художественной свободой", kk: "Көркем еркіндігі бар шығармашылық жобалар", category: "Creative" },
      { en: "Business projects with real impact", ru: "Бизнес-проекты с реальным влиянием", kk: "Нақты әсер ететін бизнес жобалары", category: "Business" },
    ],
  },
  {
    id: 9,
    en: "How important is work-life balance to you?",
    ru: "Насколько важен для тебя баланс работы и личной жизни?",
    kk: "Жұмыс пен жеке өмір арасындағы тепе-теңдік сен үшін қаншалықты маңызды?",
    category: "interests",
    options: [
      { en: "Very important, I need clear boundaries", ru: "Очень важен, нужны четкие границы", kk: "Өте маңызды, нақты шекаралар қажет", category: "Education" },
      { en: "I'm fine working extra hours for passion projects", ru: "Готов работать сверхурочно ради страсти", kk: "Жанды жобалар үшін қосымша сағаттарда жұмыс жасауға дайынмын", category: "Creative" },
      { en: "High earnings justify demanding hours", ru: "Высокие доходы оправдывают требовательные часы", kk: "Жоғары табыс талаптарды ақтайды", category: "Business" },
      { en: "I want flexible hours that fit my life", ru: "Хочу гибкие часы под мою жизнь", kk: "Өмірімге сай икемді сағаттар қалаймын", category: "IT" },
    ],
  },
  {
    id: 10,
    en: "What kind of impact do you want to have?",
    ru: "Какое влияние ты хочешь оказать?",
    kk: "Қандай ықпал қалдырғың келеді?",
    category: "communication",
    options: [
      { en: "Save lives and improve health", ru: "Спасать жизни и улучшать здоровье", kk: "Өмірлерді құтқару және денсаулықты жақсарту", category: "Medicine" },
      { en: "Build technology that changes the world", ru: "Создать технологии, меняющие мир", kk: "Дүниені өзгертетін технологиялар жасау", category: "IT" },
      { en: "Create art that inspires people", ru: "Создать искусство, вдохновляющее людей", kk: "Адамдарды шабыттандыратын өнер жасау", category: "Creative" },
      { en: "Build businesses that create jobs", ru: "Создать бизнес, дающий рабочие места", kk: "Жұмыс орны жасайтын бизнес қуру", category: "Business" },
    ],
  },
  {
    id: 11,
    en: "How do you handle deadlines and time pressure?",
    ru: "Как ты справляешься с дедлайнами и давлением времени?",
    kk: "Мерзімдер мен уақыт қысымын қалай шешесің?",
    category: "analytical",
    options: [
      { en: "I thrive under pressure and meet all deadlines", ru: "Процветаю под давлением и выполняю все дедлайны", kk: "Қысым астында гүлденемін және барлық мерзімдерді орындаймын", category: "Business" },
      { en: "I plan carefully to avoid last-minute stress", ru: "Планирую тщательно, чтобы избежать стресса", kk: "Соңғы минуттық стрессті болдырмау үшін мұқият жоспарлаймын", category: "Engineering" },
      { en: "I need time to do quality work, even if it takes longer", ru: "Мне нужно время для качественной работы", kk: "Ұзаққа созылса да сапалы жұмыс үшін уақыт қажет", category: "Science" },
      { en: "I work creatively and flexibly with time", ru: "Работаю творчески и гибко со временем", kk: "Уақытпен шығармашылық пен икемді жұмыс жасаймын", category: "Creative" },
    ],
  },
  {
    id: 12,
    en: "What is your relationship with mathematics?",
    ru: "Как ты относишься к математике?",
    kk: "Математикамен қарым-қатынасың қандай?",
    category: "analytical",
    options: [
      { en: "I love math and it comes naturally to me", ru: "Обожаю математику, она дается легко", kk: "Математиканы жақсы көремін, ол маған табиғи келеді", category: "IT" },
      { en: "I use math as a tool when needed", ru: "Использую математику как инструмент", kk: "Математиканы қажет болғанда құрал ретінде қолданамын", category: "Engineering" },
      { en: "I prefer qualitative over quantitative thinking", ru: "Предпочитаю качественное мышление", kk: "Сандық ойлаудан гөрі сапалық ойлауды қалаймын", category: "Creative" },
      { en: "Math is fine but I prefer biology or chemistry", ru: "Математика ничего, но предпочитаю биологию", kk: "Математика жақсы, бірақ биология немесе химияны қалаймын", category: "Medicine" },
    ],
  },
  {
    id: 13,
    en: "How do you prefer to communicate your ideas?",
    ru: "Как ты предпочитаешь выражать свои идеи?",
    kk: "Идеяларыңды қалай жеткізгенді жөн көресің?",
    category: "communication",
    options: [
      { en: "Through writing and detailed documentation", ru: "Через письмо и документацию", kk: "Жазу және егжей-тегжейлі құжаттар арқылы", category: "Science" },
      { en: "Through visuals, design or art", ru: "Через визуалы, дизайн или искусство", kk: "Визуалдар, дизайн немесе өнер арқылы", category: "Creative" },
      { en: "Through presentations and speaking", ru: "Через презентации и выступления", kk: "Презентациялар мен сөйлеу арқылы", category: "Business" },
      { en: "Through code and technical solutions", ru: "Через код и технические решения", kk: "Код пен техникалық шешімдер арқылы", category: "IT" },
    ],
  },
  {
    id: 14,
    en: "Where do you see yourself in 10 years?",
    ru: "Где ты видишь себя через 10 лет?",
    kk: "10 жылдан кейін өзіңді қайда көресің?",
    category: "interests",
    options: [
      { en: "Running my own company or startup", ru: "Руковожу собственной компанией", kk: "Өз компания немесе стартапымды басқарамын", category: "Business" },
      { en: "Working at a leading tech company", ru: "Работаю в ведущей IT-компании", kk: "Жетекші технологиялық компанияда жұмыс жасаймын", category: "IT" },
      { en: "Making a difference in healthcare", ru: "Меняю мир здравоохранения", kk: "Денсаулық сақтауда айырмашылық жасаймын", category: "Medicine" },
      { en: "Teaching or doing research", ru: "Преподаю или занимаюсь исследованиями", kk: "Оқытамын немесе зерттеу жүргіземін", category: "Education" },
    ],
  },
  {
    id: 15,
    en: "What excites you most about the future?",
    ru: "Что тебя больше всего волнует в будущем?",
    kk: "Болашақта сені не ең көп толқытады?",
    category: "leadership",
    options: [
      { en: "AI and technology transforming the world", ru: "ИИ и технологии, трансформирующие мир", kk: "ЖИ мен технологиялардың дүниені өзгертуі", category: "IT" },
      { en: "New medical breakthroughs saving lives", ru: "Медицинские открытия, спасающие жизни", kk: "Өмірлерді құтқаратын жаңа медициналық жетістіктер", category: "Medicine" },
      { en: "Green energy and sustainability solutions", ru: "Зеленая энергия и устойчивое развитие", kk: "Жасыл энергия мен тұрақтылық шешімдері", category: "Engineering" },
      { en: "New forms of art and creative expression", ru: "Новые формы искусства и творчества", kk: "Жаңа өнер пішіндері және шығармашылық өрнектер", category: "Creative" },
    ],
  },
];
