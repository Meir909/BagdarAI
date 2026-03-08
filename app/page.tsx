"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, MessageCircle, Map, BarChart3, Shield, Users, Sparkles, BookOpen, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const stats = [
  { value: "300+", label: { en: "Professions", ru: "Профессий", kk: "Мамандық" } },
  { value: "50+", label: { en: "Universities", ru: "Университетов", kk: "Университет" } },
  { value: "10K+", label: { en: "Students", ru: "Учеников", kk: "Оқушы" } },
  { value: "95%", label: { en: "Accuracy", ru: "Точность", kk: "Дәлдік" } },
];

const howItWorks = [
  { step: "01", icon: BookOpen, title: { en: "Take the AI Test", ru: "Пройдите AI тест", kk: "AI тестін тапсырыңыз" }, desc: { en: "Answer 15 questions about your interests and skills", ru: "Ответьте на 15 вопросов о ваших интересах", kk: "Қызығушылықтарыңыз туралы 15 сұраққа жауап беріңіз" } },
  { step: "02", icon: Sparkles, title: { en: "Get AI Analysis", ru: "Получите AI анализ", kk: "AI талдау алыңыз" }, desc: { en: "Our AI matches you with 300+ professions and builds your profile", ru: "Наш ИИ подберёт профессии из 300+ вариантов", kk: "AI 300+ мамандықтан сізге сәйкесін табады" } },
  { step: "03", icon: Map, title: { en: "Follow Your Roadmap", ru: "Следуйте плану", kk: "Жоспарды орындаңыз" }, desc: { en: "Get a personalized career roadmap with university recommendations", ru: "Получите персональный план с рекомендациями университетов", kk: "Университет ұсыныстарымен жеке жоспар алыңыз" } },
];

const features = [
  { icon: Brain, title: { en: "AI Career Test", ru: "AI Тест", kk: "AI Тесті" }, desc: { en: "15-question test powered by o4-mini", ru: "15 вопросов на основе o4-mini", kk: "o4-mini негізіндегі 15 сұрақ" } },
  { icon: BarChart3, title: { en: "Deep Analysis", ru: "Глубокий анализ", kk: "Терең талдау" }, desc: { en: "Personality + career compatibility score", ru: "Личность + совместимость с карьерой", kk: "Тұлға + мансап үйлесімділік баллы" } },
  { icon: MessageCircle, title: { en: "AI Chat Advisor", ru: "AI Советник", kk: "AI Кеңесші" }, desc: { en: "Ask any career question, get expert answers", ru: "Задай вопрос о карьере, получи ответ эксперта", kk: "Мансап туралы сұрақ қой, сарапшы жауабын ал" } },
  { icon: Map, title: { en: "Career Roadmap", ru: "Карьерный план", kk: "Мансап жоспары" }, desc: { en: "Step-by-step path from school to career", ru: "Путь от школы до карьеры пошагово", kk: "Мектептен мансапқа дейінгі қадамдар" } },
];

const faqData = [
  { q: { en: "What is BagdarAI?", ru: "Что такое BagdarAI?", kk: "BagdarAI дегеніміз не?" }, a: { en: "BagdarAI is an AI-powered career guidance platform for school students aged 14-18 in Kazakhstan.", ru: "BagdarAI — платформа профориентации на основе ИИ для школьников 14-18 лет Казахстана.", kk: "BagdarAI — Қазақстандағы 14-18 жастағы оқушыларға арналған AI мансап бағдарлау платформасы." } },
  { q: { en: "How accurate are the career recommendations?", ru: "Насколько точны рекомендации?", kk: "Мансап ұсыныстары қаншалықты дәл?" }, a: { en: "Our AI model achieves 95% satisfaction rate. It analyzes interests, skills, personality, and market demand.", ru: "Наша модель ИИ показывает 95% удовлетворённости. Анализируются интересы, навыки, характер и спрос рынка.", kk: "AI моделі 95% қанағаттану деңгейіне жетеді. Қызығушылықтар, дағдылар, тұлға және нарық сұранысы талданады." } },
  { q: { en: "Is BagdarAI free for students?", ru: "BagdarAI бесплатен для учеников?", kk: "BagdarAI оқушыларға тегін бе?" }, a: { en: "Yes! Students can take the career test and get basic recommendations for free. Pro plan offers unlimited AI chat.", ru: "Да! Ученики могут пройти тест бесплатно. Pro план — неограниченный AI чат.", kk: "Иә! Оқушылар тестті тегін тапсыра алады. Pro жоспарда шексіз AI чат." } },
  { q: { en: "Which universities are included?", ru: "Какие университеты представлены?", kk: "Қандай университеттер ұсынылады?" }, a: { en: "We include 50+ universities: NU, KBTU, SDU, KazNU from Kazakhstan, plus MIT, Stanford, ETH Zurich internationally.", ru: "50+ университетов: НУ, КБТУ, SDU, КазНУ и международные MIT, Stanford, ETH Zurich.", kk: "50+ университет: НУ, КБТУ, SDU, ҚазҰУ Қазақстаннан және MIT, Stanford халықаралық университеттер." } },
  { q: { en: "How does the school licensing work?", ru: "Как работает школьная лицензия?", kk: "Мектеп лицензиясы қалай жұмыс істейді?" }, a: { en: "Schools purchase annual licenses. Directors get analytics, curators track student progress, parents receive PDF reports.", ru: "Школы покупают годовые лицензии. Директора получают аналитику, кураторы — прогресс учеников, родители — PDF.", kk: "Мектептер жылдық лицензия сатып алады. Директорлар аналитика, кураторлар прогресс, ата-аналар PDF алады." } },
];

export default function Home() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

          <div className="container relative mx-auto px-4 py-24 md:py-36">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {{ en: "AI-Powered Career Guidance", ru: "ИИ-ориентация карьеры", kk: "AI мансап бағдарлау" }[language]}
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
                {{ en: "Discover Your Future Career with AI", ru: "Найди свою будущую профессию с помощью ИИ", kk: "AI көмегімен болашақ мамандығыңды тап" }[language]}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {{ en: "300+ professions, personalized AI analysis, university recommendations", ru: "300+ профессий, персональный AI анализ, рекомендации университетов", kk: "300+ мамандық, жеке AI талдау, университет ұсыныстары" }[language]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full text-base font-semibold shadow-[var(--shadow-button)] animate-pulse-glow">
                  <Link href="/test">
                    {{ en: "Start Career Test", ru: "Начать тест", kk: "Тестті бастау" }[language]} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full text-base">
                  <Link href="/schools">
                    <Shield className="mr-2 h-5 w-5" /> {{ en: "For Schools", ru: "Для школ", kk: "Мектептер үшін" }[language]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label[language]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "How It Works", ru: "Как это работает", kk: "Бұл қалай жұмыс істейді" }[language]}
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
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

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "Platform Features", ru: "Возможности платформы", kk: "Платформа мүмкіндіктері" }[language]}
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{feature.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc[language]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
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
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{item.q[language]}</span>
                    {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground">{item.a[language]}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {{ en: "Start Your Career Journey Today", ru: "Начни карьерный путь сегодня", kk: "Бүгін мансап жолыңды баста" }[language]}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                {{ en: "Join thousands of students already discovering their future careers", ru: "Присоединяйся к тысячам учеников, уже открывающих свой карьерный путь", kk: "Болашақ мамандықтарын ашып жатқан мыңдаған оқушыларға қосыл" }[language]}
              </p>
              <Button asChild size="lg" className="rounded-full shadow-[var(--shadow-button)]">
                <Link href="/test">
                  {{ en: "Take Free Career Test", ru: "Пройти бесплатный тест", kk: "Тегін тест тапсыру" }[language]} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <span className="font-bold text-primary-foreground text-xs">B</span>
                  </div>
                  <span className="font-heading font-bold">BagdarAI</span>
                </div>
                <p className="text-xs text-muted-foreground">{{ en: "AI career guidance for Kazakhstan students.", ru: "AI профориентация для учеников Казахстана.", kk: "Қазақстан оқушыларына AI мансап бағдарлау." }[language]}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">{{ en: "Platform", ru: "Платформа", kk: "Платформа" }[language]}</h4>
                <div className="space-y-2">
                  {[{ href: "/test", label: { en: "Career Test", ru: "Карьерный тест", kk: "Мансап тесті" } }, { href: "/professions", label: { en: "Professions", ru: "Профессии", kk: "Мамандықтар" } }, { href: "/pricing", label: { en: "Pricing", ru: "Тарифы", kk: "Тарифтер" } }].map((l) => (
                    <Link key={l.href} href={l.href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label[language]}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">{{ en: "Schools", ru: "Школам", kk: "Мектептерге" }[language]}</h4>
                <div className="space-y-2">
                  <Link href="/schools" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{{ en: "For Schools", ru: "Для школ", kk: "Мектептер үшін" }[language]}</Link>
                  <Link href="/auth" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{{ en: "Login", ru: "Войти", kk: "Кіру" }[language]}</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">{{ en: "Contact", ru: "Контакты", kk: "Байланыс" }[language]}</h4>
                <p className="text-xs text-muted-foreground">info@bagdarai.kz</p>
                <p className="text-xs text-muted-foreground mt-1">Astana, Kazakhstan</p>
              </div>
            </div>
            <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} BagdarAI. {{ en: "All rights reserved.", ru: "Все права защищены.", kk: "Барлық құқықтар қорғалған." }[language]}
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
