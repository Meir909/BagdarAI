"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Brain, MessageCircle, Map, BarChart3, Shield, Users, Sparkles,
  BookOpen, Trophy, ChevronDown, ChevronUp, Zap, Target, Star, Play,
  GraduationCap, TrendingUp, Award, Rocket, CheckCircle2, Globe2,
  Swords, FlaskConical, Palette, HeartPulse, Briefcase, Code2,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const stats = [
  { value: "300+", label: { en: "Professions", ru: "Профессий", kk: "Мамандық" } },
  { value: "50+", label: { en: "Universities", ru: "Университетов", kk: "Университет" } },
  { value: "10K+", label: { en: "Students", ru: "Учеников", kk: "Оқушы" } },
  { value: "95%", label: { en: "Satisfaction", ru: "Довольных", kk: "Қанағаттанған" } },
];

const howItWorks = [
  {
    step: "01", icon: BookOpen,
    title: { en: "Take the AI Test", ru: "Пройдите AI тест", kk: "AI тестін тапсырыңыз" },
    desc: { en: "Answer 42 RIASEC + MBTI + Aptitude questions. Takes just 10 minutes.", ru: "Ответьте на 42 вопроса RIASEC + MBTI + Способности. Займёт 10 минут.", kk: "42 RIASEC + MBTI + Қабілет сұрағына жауап беріңіз. 10 минут жетеді." },
  },
  {
    step: "02", icon: Sparkles,
    title: { en: "Get AI Analysis", ru: "Получите AI анализ", kk: "AI талдау алыңыз" },
    desc: { en: "OpenAI o4-mini matches your personality to 300+ careers with match scores.", ru: "OpenAI o4-mini подберёт профессии из 300+ с оценкой совместимости.", kk: "OpenAI o4-mini 300+ мамандықтан сізге сәйкесін үйлесімділік баллымен табады." },
  },
  {
    step: "03", icon: Map,
    title: { en: "Explore & Level Up", ru: "Исследуй и развивайся", kk: "Зерттеп, деңгей ал" },
    desc: { en: "Play career simulations, chat with AI mentors, complete daily quests and earn XP.", ru: "Проходи карьерные симуляции, общайся с AI-менторами, выполняй квесты.", kk: "Мансап симуляцияларын ойна, AI-менторлармен сөйлес, тапсырмалар орында." },
  },
];

const gamificationFeatures = [
  {
    icon: Swords,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    title: { en: "Career Simulations", ru: "Карьерные симуляции", kk: "Мансап симуляциялары" },
    desc: { en: "Step into a Data Scientist's day. Solve real problems. Earn up to 80 XP.", ru: "Войди в день дата-сайентиста. Реши реальные задачи. Получи до 80 XP.", kk: "Дата-ғалымның күніне кір. Нақты мәселелерді шеш. 80 XP дейін ал." },
    link: "/simulations",
    badge: { en: "6 Careers", ru: "6 карьер", kk: "6 мансап" },
  },
  {
    icon: MessageCircle,
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-500/10",
    title: { en: "AI NPC Mentors", ru: "AI NPC Менторы", kk: "AI NPC Менторлар" },
    desc: { en: "Chat with Arman the AI Engineer or Dana the Psychologist. +10 XP per message.", ru: "Общайся с Арманом-инженером или Даной-психологом. +10 XP за сообщение.", kk: "Арман-инженермен немесе Дана-психологпен сөйлес. Хабарлама үшін +10 XP." },
    link: "/mentors",
    badge: { en: "6 Mentors", ru: "6 менторов", kk: "6 ментор" },
  },
  {
    icon: Target,
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
    title: { en: "Daily Quests", ru: "Ежедневные задания", kk: "Күнделікті тапсырмалар" },
    desc: { en: "3 new quests every day. Explore a profession, chat with a mentor, finish a simulation.", ru: "3 новых задания каждый день. Изучи профессию, поговори с ментором.", kk: "Күн сайын 3 жаңа тапсырма. Мамандықты зерттей, ментормен сөйлес." },
    link: "/quests",
    badge: { en: "12 Templates", ru: "12 шаблонов", kk: "12 үлгі" },
  },
  {
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    title: { en: "Leaderboard", ru: "Рейтинг", kk: "Рейтинг" },
    desc: { en: "Compete globally, by school or by class. Top students earn special badges.", ru: "Соревнуйся глобально, по школе или классу. Лучшие получают бейджи.", kk: "Жаһандық, мектеп немесе сынып бойынша бәсекелес. Үздіктер бейдж алады." },
    link: "/leaderboard",
    badge: { en: "3 Scopes", ru: "3 уровня", kk: "3 деңгей" },
  },
];

const professionCategories = [
  { icon: Code2,       color: "text-blue-500",   bg: "bg-blue-500/10",   label: { en: "Technology",  ru: "Технологии",  kk: "Технология"  }, count: 68 },
  { icon: HeartPulse,  color: "text-red-500",    bg: "bg-red-500/10",    label: { en: "Medicine",    ru: "Медицина",    kk: "Медицина"    }, count: 42 },
  { icon: Briefcase,   color: "text-amber-500",  bg: "bg-amber-500/10",  label: { en: "Business",    ru: "Бизнес",      kk: "Бизнес"      }, count: 55 },
  { icon: Palette,     color: "text-purple-500", bg: "bg-purple-500/10", label: { en: "Creative",    ru: "Творчество",  kk: "Шығармашылық"}, count: 38 },
  { icon: FlaskConical,color: "text-green-500",  bg: "bg-green-500/10",  label: { en: "Science",     ru: "Наука",       kk: "Ғылым"       }, count: 47 },
  { icon: GraduationCap,color:"text-sky-500",    bg: "bg-sky-500/10",    label: { en: "Education",   ru: "Образование", kk: "Білім"       }, count: 28 },
  { icon: Globe2,      color: "text-teal-500",   bg: "bg-teal-500/10",   label: { en: "International",ru:"Международные",kk: "Халықаралық" }, count: 24 },
  { icon: Rocket,      color: "text-orange-500", bg: "bg-orange-500/10", label: { en: "Engineering", ru: "Инженерия",   kk: "Инженерия"   }, count: 33 },
];

const testimonials = [
  {
    name: "Айгерим С.",
    school: "НИШ Астана, 11 кл.",
    avatar: "А",
    color: "bg-violet-500",
    rating: 5,
    text: {
      en: "BagdarAI showed me that UX Design suits me 94%. Now I know exactly where to apply. The career simulation was so realistic!",
      ru: "BagdarAI показал, что UX-дизайн подходит мне на 94%. Теперь точно знаю, куда поступать. Симуляция карьеры была реалистичной!",
      kk: "BagdarAI маған UX-дизайн 94% сәйкес екенін көрсетті. Енді қайда тапсыруды нақты білемін. Мансап симуляциясы өте нақты болды!",
    },
  },
  {
    name: "Данияр Н.",
    school: "Лицей №1 Алматы, 10 кл.",
    avatar: "Д",
    color: "bg-sky-500",
    rating: 5,
    text: {
      en: "I talked with the AI Mentor Arman for a week. He explained machine learning better than my teacher. Earned 500 XP already!",
      ru: "Общался с AI-ментором Арманом неделю. Он объяснил ML лучше учителя. Уже набрал 500 XP!",
      kk: "Бір апта бойы AI-ментор Арманмен сөйлестім. Ол ML-ды мұғалімнен де жақсы түсіндірді. 500 XP жинадым!",
    },
  },
  {
    name: "Зарина М.",
    school: "Гимназия №5 Қарағанды, 11 кл.",
    avatar: "З",
    color: "bg-emerald-500",
    rating: 5,
    text: {
      en: "The daily quests make me open the app every day. I'm now #3 in the school leaderboard. My parents got a detailed PDF report too.",
      ru: "Ежедневные квесты заставляют открывать приложение каждый день. Я на 3-м месте в рейтинге школы. Родители тоже получили PDF-отчёт.",
      kk: "Күнделікті тапсырмалар мені күн сайын ашуға мәжбүр етеді. Мектеп рейтингінде 3-орындамын. Ата-анам да PDF есеп алды.",
    },
  },
];

const universities = [
  { short: "NU",   full: "Nazarbayev University", city: "Astana",   flag: "🇰🇿" },
  { short: "KBTU", full: "Kazakh-British Technical University", city: "Almaty", flag: "🇰🇿" },
  { short: "SDU",  full: "Suleyman Demirel University", city: "Kaskelen",flag: "🇰🇿" },
  { short: "MIT",  full: "Massachusetts Institute of Technology", city: "Boston", flag: "🇺🇸" },
  { short: "ETH",  full: "ETH Zurich", city: "Zurich",  flag: "🇨🇭" },
  { short: "KazNU",full: "Al-Farabi Kazakh National University", city: "Almaty", flag: "🇰🇿" },
];

const faqData = [
  {
    q: { en: "What is BagdarAI?", ru: "Что такое BagdarAI?", kk: "BagdarAI дегеніміз не?" },
    a: { en: "BagdarAI is an AI-powered career guidance platform for school students aged 14-18 in Kazakhstan. It combines RIASEC, MBTI and Aptitude tests with gamified career exploration.", ru: "BagdarAI — платформа профориентации на основе ИИ для школьников 14-18 лет Казахстана. Совмещает тесты RIASEC, MBTI, способностей с геймифицированным изучением карьеры.", kk: "BagdarAI — Қазақстандағы 14-18 жастағы оқушыларға арналған AI мансап бағдарлау платформасы. RIASEC, MBTI және Қабілет тесттерін ойынды мансап зерттеумен біріктіреді." },
  },
  {
    q: { en: "How accurate are the career recommendations?", ru: "Насколько точны рекомендации?", kk: "Мансап ұсыныстары қаншалықты дәл?" },
    a: { en: "Our AI (OpenAI o4-mini) achieves 95% student satisfaction. It analyzes RIASEC Holland Code, MBTI personality type, aptitude scores and Kazakhstan market demand to suggest careers.", ru: "Наш ИИ (OpenAI o4-mini) показывает 95% удовлетворённости. Анализирует код Голланда RIASEC, тип личности MBTI, баллы способностей и спрос казахстанского рынка.", kk: "AI (OpenAI o4-mini) 95% қанағаттану деңгейіне жетеді. RIASEC Голланд коды, MBTI тұлға типі, қабілет баллдары және Қазақстан нарығының сұранысын талдайды." },
  },
  {
    q: { en: "Is BagdarAI free for students?", ru: "BagdarAI бесплатен для учеников?", kk: "BagdarAI оқушыларға тегін бе?" },
    a: { en: "Yes! Students can take all tests, explore 300+ professions, play career simulations and chat with AI mentors for free. Pro plan unlocks unlimited AI advisor chat.", ru: "Да! Ученики могут пройти все тесты, изучить 300+ профессий, пройти симуляции и поговорить с AI-менторами бесплатно. Pro-план — безлимитный AI-чат.", kk: "Иә! Оқушылар барлық тесттерді тапсырып, 300+ мамандықты зерттеп, симуляциялар ойнап, AI-менторлармен тегін сөйлесе алады. Pro жоспарда шексіз AI-чат." },
  },
  {
    q: { en: "Which universities are included?", ru: "Какие университеты представлены?", kk: "Қандай университеттер ұсынылады?" },
    a: { en: "50+ universities: NU, KBTU, SDU, IITU, Astana IT University from Kazakhstan, plus MIT, Stanford, ETH Zurich internationally. Each profession card shows relevant programs.", ru: "50+ университетов: НУ, КБТУ, SDU, ИАТУ, Astana IT University из Казахстана, плюс MIT, Stanford, ETH Zurich. Каждая карточка профессии показывает программы.", kk: "50+ университет: НУ, КБТУ, SDU, АИТУ, Astana IT University Қазақстаннан және MIT, Stanford, ETH Zurich. Әр мамандық картасы бағдарламаларды көрсетеді." },
  },
  {
    q: { en: "How does the school licensing work?", ru: "Как работает школьная лицензия?", kk: "Мектеп лицензиясы қалай жұмыс істейді?" },
    a: { en: "Schools purchase annual licenses. Directors get real-time analytics dashboards, curators track student progress and class leaderboards, parents receive detailed PDF reports.", ru: "Школы покупают годовые лицензии. Директора получают аналитику, кураторы — прогресс класса и рейтинги, родители — PDF-отчёты.", kk: "Мектептер жылдық лицензия сатып алады. Директорлар аналитика тақтасы, кураторлар сынып прогрессі мен рейтингі, ата-аналар PDF есеп алады." },
  },
];

const levelBadges = [
  { level: 1,  title: { en: "Beginner",     ru: "Новичок",      kk: "Жаңадан бастаушы" }, xp: "0",     color: "from-gray-400 to-gray-500" },
  { level: 3,  title: { en: "Explorer",     ru: "Исследователь",kk: "Зерттеуші"         }, xp: "250",   color: "from-blue-400 to-blue-600" },
  { level: 5,  title: { en: "Achiever",     ru: "Достигатель",  kk: "Жетістікке жетуші" }, xp: "700",   color: "from-emerald-400 to-green-600" },
  { level: 8,  title: { en: "Champion",     ru: "Чемпион",      kk: "Чемпион"           }, xp: "2500",  color: "from-violet-400 to-purple-600" },
  { level: 10, title: { en: "Legend",       ru: "Легенда",      kk: "Аңыз"              }, xp: "4000+", color: "from-amber-400 to-orange-500" },
];

export default function Home() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: copy */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {{ en: "AI-Powered Career Guidance", ru: "ИИ-ориентация карьеры", kk: "AI мансап бағдарлау" }[language]}
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                  {{ en: "Discover Your Future Career with AI", ru: "Найди свою будущую профессию с ИИ", kk: "AI-мен болашақ мамандығыңды тап" }[language]}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  {{ en: "RIASEC + MBTI + Aptitude tests. 300+ professions. Career simulations. AI mentors. Everything a student in Kazakhstan needs to choose their path.", ru: "RIASEC + MBTI + тесты способностей. 300+ профессий. Карьерные симуляции. AI-менторы. Всё, что нужно ученику Казахстана для выбора пути.", kk: "RIASEC + MBTI + Қабілет тесттері. 300+ мамандық. Мансап симуляциялары. AI-менторлар. Қазақстан оқушысына жол таңдауға қажет барлығы." }[language]}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Button asChild size="lg" className="rounded-full text-base font-semibold shadow-[var(--shadow-button)] animate-pulse-glow">
                    <Link href="/test">
                      {{ en: "Start Free Test", ru: "Начать бесплатно", kk: "Тегін бастау" }[language]}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full text-base">
                    <Link href="/schools">
                      <Shield className="mr-2 h-5 w-5" />
                      {{ en: "For Schools", ru: "Для школ", kk: "Мектептер үшін" }[language]}
                    </Link>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {[
                    { icon: CheckCircle2, text: { en: "Free for students", ru: "Бесплатно для учеников", kk: "Оқушыларға тегін" } },
                    { icon: CheckCircle2, text: { en: "No registration needed", ru: "Без регистрации", kk: "Тіркеусіз" } },
                    { icon: CheckCircle2, text: { en: "3 languages: KK / RU / EN", ru: "3 языка: ҚАЗ / РУС / ENG", kk: "3 тіл: ҚАЗ / РУС / ENG" } },
                  ].map((b, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <b.icon className="h-3.5 w-3.5 text-primary" />
                      {b.text[language]}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right: dashboard mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl" />
                  <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
                    {/* Mock header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="font-bold text-primary-foreground text-xs">B</span>
                      </div>
                      <span className="font-heading font-bold text-sm">BagdarAI Dashboard</span>
                      <div className="ml-auto flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-semibold">
                        <Zap className="h-3 w-3" /> 840 XP · Lvl 4
                      </div>
                    </div>

                    {/* Mock career match */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {{ en: "Top Career Matches", ru: "Топ карьерных совпадений", kk: "Үздік мансап сәйкестіктері" }[language]}
                      </p>
                      {[
                        { name: "UX Designer", pct: 94, color: "bg-violet-500" },
                        { name: "Product Manager", pct: 87, color: "bg-blue-500" },
                        { name: "Data Analyst", pct: 81, color: "bg-emerald-500" },
                      ].map((c) => (
                        <div key={c.name} className="flex items-center gap-3">
                          <span className="text-xs w-32 truncate">{c.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold w-8 text-right">{c.pct}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Mock XP progress */}
                    <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{{ en: "Level 4 · Achiever", ru: "Уровень 4 · Достигатель", kk: "4-деңгей · Жетістікке жетуші" }[language]}</span>
                        <span className="text-muted-foreground">840 / 1000 XP</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[84%] bg-gradient-to-r from-primary to-violet-500 rounded-full" />
                      </div>
                    </div>

                    {/* Mock quests */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {{ en: "Today's Quests", ru: "Задания на сегодня", kk: "Бүгінгі тапсырмалар" }[language]}
                      </p>
                      {[
                        { icon: "⚡", text: { en: "Complete a simulation", ru: "Пройти симуляцию", kk: "Симуляция аяқта" }, xp: 60, done: true },
                        { icon: "💬", text: { en: "Chat with a mentor", ru: "Поговорить с ментором", kk: "Ментормен сөйлес" }, xp: 30, done: false },
                        { icon: "🔍", text: { en: "Explore a profession", ru: "Изучить профессию", kk: "Мамандықты зерттей" }, xp: 20, done: false },
                      ].map((q, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${q.done ? "opacity-50 line-through" : "bg-muted/30"}`}>
                          <span>{q.icon}</span>
                          <span className="flex-1">{q.text[language]}</span>
                          <span className="text-primary font-semibold">+{q.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-14 border-y border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label[language]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "How It Works", ru: "Как это работает", kk: "Бұл қалай жұмыс істейді" }[language]}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {{ en: "From test to career clarity in three simple steps.", ru: "От теста до ясности карьеры — три шага.", kk: "Тесттен мансап анықтығына — үш қадам." }[language]}
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="relative text-center"
                >
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-sm font-mono text-primary mb-2">{step.step}</div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{step.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc[language]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GAMIFICATION ── */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold mb-4">
                <Zap className="h-3.5 w-3.5" />
                {{ en: "Gamified Learning", ru: "Геймифицированное обучение", kk: "Ойындастырылған оқу" }[language]}
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "Explore Careers Like a Game", ru: "Исследуй карьеру как игру", kk: "Мансапты ойын сияқты зерттей" }[language]}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {{ en: "Earn XP, level up, climb the leaderboard — all while learning about your future career.", ru: "Зарабатывай XP, повышай уровень, поднимайся в рейтинге — всё это изучая будущую карьеру.", kk: "XP жина, деңгей ал, рейтингке көтеріл — болашақ мамандығыңды зерттей отырып." }[language]}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gamificationFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer"
                >
                  <Link href={f.link} className="block">
                    <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                      <f.icon className={`h-6 w-6 bg-gradient-to-br ${f.color} bg-clip-text`} style={{ color: "transparent", WebkitBackgroundClip: "text" }} />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-semibold text-sm leading-tight">{f.title[language]}</h3>
                      <span className="shrink-0 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{f.badge[language]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc[language]}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                      {{ en: "Explore", ru: "Открыть", kk: "Ашу" }[language]}
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* XP Level Roadmap */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-14 bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">
                  {{ en: "XP Level System", ru: "Система XP уровней", kk: "XP деңгей жүйесі" }[language]}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {levelBadges.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 flex-1 min-w-[160px]">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {b.level}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{b.title[language]}</div>
                      <div className="text-xs text-muted-foreground">{b.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PROFESSION CATEGORIES ── */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "300+ Professions Across 8 Fields", ru: "300+ профессий в 8 сферах", kk: "8 саладан 300+ мамандық" }[language]}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {{ en: "Every profession includes salary ranges, skills required, and top universities in Kazakhstan and internationally.", ru: "Каждая профессия включает зарплату, навыки и топ-университеты в Казахстане и мире.", kk: "Әр мамандық жалақы аралығын, қажет дағдыларды және Қазақстан мен халықаралық үздік университеттерді қамтиды." }[language]}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
              {professionCategories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="text-center"
                >
                  <Link href="/professions">
                    <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-2`}>
                      <cat.icon className={`h-7 w-7 ${cat.color}`} />
                    </div>
                    <div className="text-xs font-medium leading-tight">{cat.label[language]}</div>
                    <div className="text-xs text-muted-foreground">{cat.count}</div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/professions">
                  {{ en: "Browse All Professions", ru: "Все профессии", kk: "Барлық мамандықтар" }[language]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── UNIVERSITIES ── */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-heading font-bold">
                  {{ en: "50+ Partner Universities", ru: "50+ Партнёрских университетов", kk: "50+ Серіктес университет" }[language]}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {{ en: "Each career recommendation includes direct links to relevant programs.", ru: "Каждая рекомендация включает ссылки на подходящие программы.", kk: "Әр ұсыным тиісті бағдарламаларға тікелей сілтемелерді қамтиды." }[language]}
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {universities.map((u, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
                >
                  <div className="text-2xl mb-1">{u.flag}</div>
                  <div className="font-heading font-bold text-sm">{u.short}</div>
                  <div className="text-xs text-muted-foreground leading-tight mt-0.5">{u.city}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Star className="h-3.5 w-3.5" />
                {{ en: "Student Stories", ru: "Истории учеников", kk: "Оқушы оқиғалары" }[language]}
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                {{ en: "What Students Say", ru: "Что говорят ученики", kk: "Оқушылар не айтады" }[language]}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-card"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text[language]}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.school}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR SCHOOLS ── */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold mb-6">
                  <Users className="h-3.5 w-3.5" />
                  {{ en: "For Schools & Educators", ru: "Для школ и педагогов", kk: "Мектептер мен педагогтарға" }[language]}
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  {{ en: "A Complete Career Guidance System for Your School", ru: "Полная система профориентации для вашей школы", kk: "Мектебіңізге арналған толық мансап бағдарлау жүйесі" }[language]}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: BarChart3, text: { en: "Director analytics — career interest charts, monthly activity, school codes", ru: "Аналитика для директора — интересы, активность, коды школы", kk: "Директорға аналитика — қызығушылықтар, белсенділік, мектеп кодтары" } },
                    { icon: Users, text: { en: "Curator dashboard — track every student's test results and XP progress", ru: "Панель куратора — прогресс каждого ученика, результаты тестов", kk: "Куратор тақтасы — әр оқушының тест нәтижелері мен XP прогрессі" } },
                    { icon: TrendingUp, text: { en: "Parent reports — receive PDF with child's career recommendations", ru: "Отчёты для родителей — PDF с карьерными рекомендациями ребёнка", kk: "Ата-ана есептері — баланың мансап ұсыныстары бар PDF" } },
                    { icon: Trophy, text: { en: "Class leaderboard — gamified engagement for the whole class", ru: "Рейтинг класса — геймификация для всего класса", kk: "Сынып рейтингі — бүкіл сынып үшін ойындастыру" } },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text[language]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button asChild className="rounded-full">
                    <Link href="/schools">
                      {{ en: "Learn More", ru: "Узнать больше", kk: "Толығырақ" }[language]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/pricing">
                      {{ en: "View Pricing", ru: "Тарифы", kk: "Тарифтер" }[language]}
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-card">
                  <div className="flex items-center gap-2 text-sm font-semibold pb-3 border-b border-border">
                    <Shield className="h-4 w-4 text-primary" />
                    {{ en: "School Admin Panel", ru: "Панель администратора школы", kk: "Мектеп әкімшілік тақтасы" }[language]}
                  </div>
                  {[
                    { label: { en: "Total Students", ru: "Учеников", kk: "Оқушылар" }, value: "247", icon: Users, color: "text-blue-500" },
                    { label: { en: "Tests Completed", ru: "Тестов пройдено", kk: "Тесттер аяқталды" }, value: "189", icon: CheckCircle2, color: "text-emerald-500" },
                    { label: { en: "Top Interest", ru: "Топ интерес", kk: "Үздік қызығушылық" }, value: { en: "Technology 38%", ru: "Технологии 38%", kk: "Технология 38%" }, icon: TrendingUp, color: "text-violet-500" },
                    { label: { en: "Avg. XP Level", ru: "Средний XP", kk: "Орташа XP деңгейі" }, value: "Lvl 3.4", icon: Zap, color: "text-amber-500" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                      <row.icon className={`h-5 w-5 ${row.color} shrink-0`} />
                      <span className="text-xs text-muted-foreground flex-1">{row.label[language]}</span>
                      <span className="text-sm font-semibold">{typeof row.value === "object" ? row.value[language] : row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "Frequently Asked Questions", ru: "Часто задаваемые вопросы", kk: "Жиі қойылатын сұрақтар" }[language]}
              </h2>
            </motion.div>
            <div className="space-y-3">
              {faqData.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q[language]}</span>
                    {openFaq === i
                      ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-muted-foreground">{item.a[language]}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 bg-primary/5 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "Start Your Career Journey Today", ru: "Начни карьерный путь сегодня", kk: "Бүгін мансап жолыңды баста" }[language]}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                {{ en: "Free for students. Takes 10 minutes. No registration required.", ru: "Бесплатно для учеников. 10 минут. Без регистрации.", kk: "Оқушыларға тегін. 10 минут. Тіркеусіз." }[language]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full shadow-[var(--shadow-button)] animate-pulse-glow">
                  <Link href="/test">
                    {{ en: "Take Free Career Test", ru: "Пройти бесплатный тест", kk: "Тегін тест тапсыру" }[language]}
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/professions">
                    {{ en: "Explore Professions", ru: "Изучить профессии", kk: "Мамандықтарды зерттеу" }[language]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border py-14 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-10 mb-10">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-primary-foreground text-sm">B</span>
                  </div>
                  <span className="font-heading font-bold text-lg">BagdarAI</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {{ en: "AI career guidance for Kazakhstan students ages 14–18.", ru: "AI профориентация для учеников Казахстана 14–18 лет.", kk: "Қазақстандағы 14–18 жастағы оқушыларға AI мансап бағдарлау." }[language]}
                </p>
                <p className="text-xs text-muted-foreground">info@bagdarai.kz</p>
                <p className="text-xs text-muted-foreground">Astana, Kazakhstan 🇰🇿</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-4">{{ en: "For Students", ru: "Ученикам", kk: "Оқушыларға" }[language]}</h4>
                <div className="space-y-2.5">
                  {[
                    { href: "/test",        label: { en: "Career Test",   ru: "Карьерный тест",   kk: "Мансап тесті"    } },
                    { href: "/professions", label: { en: "Professions",   ru: "Профессии",        kk: "Мамандықтар"     } },
                    { href: "/simulations", label: { en: "Simulations",   ru: "Симуляции",        kk: "Симуляциялар"    } },
                    { href: "/mentors",     label: { en: "AI Mentors",    ru: "AI-Менторы",       kk: "AI-Менторлар"    } },
                    { href: "/quests",      label: { en: "Daily Quests",  ru: "Задания",          kk: "Тапсырмалар"     } },
                    { href: "/leaderboard", label: { en: "Leaderboard",   ru: "Рейтинг",          kk: "Рейтинг"         } },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label[language]}</Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-4">{{ en: "For Schools", ru: "Школам", kk: "Мектептерге" }[language]}</h4>
                <div className="space-y-2.5">
                  {[
                    { href: "/schools",  label: { en: "For Schools", ru: "Для школ",  kk: "Мектептер үшін" } },
                    { href: "/pricing",  label: { en: "Pricing",     ru: "Тарифы",    kk: "Тарифтер"       } },
                    { href: "/auth",     label: { en: "Login",       ru: "Войти",     kk: "Кіру"           } },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label[language]}</Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-4">{{ en: "Contact", ru: "Контакты", kk: "Байланыс" }[language]}</h4>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">info@bagdarai.kz</p>
                  <p className="text-xs text-muted-foreground">+7 (700) 000-00-00</p>
                  <p className="text-xs text-muted-foreground">Astana, Kazakhstan</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} BagdarAI. {{ en: "All rights reserved.", ru: "Все права защищены.", kk: "Барлық құқықтар қорғалған." }[language]}</span>
              <span className="flex items-center gap-1">
                {{ en: "Made with", ru: "Сделано с", kk: "Жасалған" }[language]} ❤️ {{ en: "in Kazakhstan", ru: "в Казахстане", kk: "Қазақстанда" }[language]}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
