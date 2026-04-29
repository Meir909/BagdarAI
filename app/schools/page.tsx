"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, FileText, Shield, TrendingUp, Check } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

const features = [
  { icon: Users, title: { en: "Student Management", ru: "Управление учениками", kk: "Оқушыларды басқару" }, desc: { en: "Track every student's progress and career readiness", ru: "Отслеживайте прогресс каждого ученика", kk: "Әр оқушының прогресін бақылаңыз" } },
  { icon: BarChart3, title: { en: "Advanced Analytics", ru: "Расширенная аналитика", kk: "Кеңейтілген аналитика" }, desc: { en: "Class-level and school-wide career interest analytics", ru: "Аналитика карьерных интересов по классам и школе", kk: "Сынып пен мектеп деңгейіндегі мансап аналитикасы" } },
  { icon: FileText, title: { en: "PDF/Excel Reports", ru: "PDF/Excel отчёты", kk: "PDF/Excel есептер" }, desc: { en: "Generate detailed reports for any student or class", ru: "Создавайте подробные отчёты для любого ученика или класса", kk: "Кез келген оқушы немесе сынып үшін есептер жасаңыз" } },
  { icon: Shield, title: { en: "Role-Based Access", ru: "Ролевой доступ", kk: "Рөлдік қолжетімділік" }, desc: { en: "Director, Curator, Parent — each sees what they need", ru: "Директор, куратор, родитель — каждый видит своё", kk: "Директор, куратор, ата-ана — әрқайсысы керектісін көреді" } },
];

const benefits = [
  { en: "Improve student career readiness by 40%", ru: "Повысить готовность учеников к карьере на 40%", kk: "Оқушылардың мансапқа дайындығын 40%-ға арттыру" },
  { en: "Reduce wrong university major choices", ru: "Сократить ошибки выбора специальности", kk: "Қате мамандық таңдауын азайту" },
  { en: "Give parents transparent progress reports", ru: "Дать родителям прозрачные отчёты о прогрессе", kk: "Ата-аналарға ашық прогресс есептер беру" },
  { en: "Meet national career guidance standards", ru: "Соответствовать национальным стандартам профориентации", kk: "Ұлттық мансап бағдарлау стандарттарын орындау" },
];

export default function SchoolsPage() {
  const { language } = useLanguage();

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
                <Shield className="h-4 w-4 text-primary" />
                {{ en: "For Schools & Institutions", ru: "Для школ и учреждений", kk: "Мектептер мен мекемелер үшін" }[language]}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {{ en: "AI Career Guidance for Your Entire School", ru: "AI профориентация для всей вашей школы", kk: "Бүкіл мектебіңіз үшін AI мансап бағдарлау" }[language]}
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                {{ en: "Give every student personalized career analysis. Give directors and curators real-time insights.", ru: "Дайте каждому ученику персональный анализ карьеры. Директорам и кураторам — инсайты в реальном времени.", kk: "Әр оқушыға жеке мансап талдауы. Директорлар мен кураторларға нақты уақыттағы мәліметтер." }[language]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full shadow-[var(--shadow-button)]" asChild>
                  <Link href="/auth">
                    {{ en: "Request School License", ru: "Запросить лицензию для школы", kk: "Мектеп лицензиясын сұрау" }[language]}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="/pricing">
                    {{ en: "View Pricing", ru: "Посмотреть тарифы", kk: "Тарифтерді қарау" }[language]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">{{ en: "Everything Schools Need", ru: "Всё, что нужно школам", kk: "Мектептерге қажет нәрселердің барлығы" }[language]}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{f.title[language]}</h3>
                <p className="text-sm text-muted-foreground">{f.desc[language]}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-heading font-bold mb-8">{{ en: "Why Schools Choose BagdarAI", ru: "Почему школы выбирают BagdarAI", kk: "Мектептер BagdarAI таңдайтын себептер" }[language]}</h2>
              <div className="space-y-4 text-left">
                {benefits.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{b[language]}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <Button size="lg" className="rounded-full shadow-[var(--shadow-button)]" asChild>
                  <Link href="/auth">{{ en: "Get Started Today", ru: "Начать сегодня", kk: "Бүгін бастаңыз" }[language]}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
