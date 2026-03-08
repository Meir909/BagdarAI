"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

const plans = [
  {
    key: "free",
    price: { en: "Free", ru: "Бесплатно", kk: "Тегін" },
    priceAmount: "0",
    features: {
      en: ["1 Career Test", "Basic AI results", "3 AI chat requests", "Browse 300+ professions"],
      ru: ["1 карьерный тест", "Базовые AI результаты", "3 запроса AI чата", "Просмотр 300+ профессий"],
      kk: ["1 мансап тесті", "Негізгі AI нәтижелері", "3 AI чат сұрауы", "300+ мамандықты қарау"],
    },
    href: "/auth",
    highlight: false,
  },
  {
    key: "pro",
    price: { en: "Pro", ru: "Про", kk: "Про" },
    priceAmount: "2,990",
    currency: "₸",
    period: { en: "/month", ru: "/мес", kk: "/ай" },
    features: {
      en: ["Unlimited career tests", "Full AI career analysis", "Unlimited AI chat", "Career roadmap", "University suggestions", "PDF reports", "Badges & achievements"],
      ru: ["Безлимитные тесты", "Полный AI анализ", "Безлимитный AI чат", "Карьерный план", "Рекомендации университетов", "PDF отчёты", "Бейджи и достижения"],
      kk: ["Шексіз тесттер", "Толық AI талдау", "Шексіз AI чат", "Мансап жоспары", "Университет ұсыныстары", "PDF есептер", "Бейджиктер"],
    },
    href: "/auth",
    highlight: true,
  },
  {
    key: "school",
    price: { en: "School", ru: "Школа", kk: "Мектеп" },
    priceAmount: "49,900",
    currency: "₸",
    period: { en: "/month", ru: "/мес", kk: "/ай" },
    features: {
      en: ["Up to 500 students", "Director analytics dashboard", "Class-level analytics", "Curator management", "PDF & Excel reports", "Student progress tracking", "Priority support"],
      ru: ["До 500 учеников", "Аналитика директора", "Аналитика по классам", "Управление кураторами", "PDF и Excel отчёты", "Отслеживание прогресса", "Приоритетная поддержка"],
      kk: ["500-ге дейін оқушы", "Директор аналитикасы", "Сынып аналитикасы", "Куратор басқаруы", "PDF және Excel есептер", "Прогресті бақылау", "Басым қолдау"],
    },
    href: "/schools",
    highlight: false,
  },
];

export default function PricingPage() {
  const { language } = useLanguage();

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              {{ en: "Simple Pricing", ru: "Простые тарифы", kk: "Қарапайым тарифтер" }[language]}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {{ en: "Start free, upgrade when you're ready", ru: "Начни бесплатно, переходи на Pro когда готов", kk: "Тегін бастаңыз, дайын болсаңыз Pro-ға өтіңіз" }[language]}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.highlight
                    ? "bg-card border-primary shadow-[var(--shadow-card-hover)] scale-105"
                    : "bg-card border-border shadow-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> {{ en: "Most Popular", ru: "Популярный", kk: "Танымал" }[language]}
                  </div>
                )}

                <h3 className="font-heading font-bold text-xl mb-2">{plan.price[language]}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-heading font-bold">{plan.currency || ""}{plan.priceAmount}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period[language]}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features[language].map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full ${plan.highlight ? "shadow-[var(--shadow-button)]" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>
                    {{ en: "Get Started", ru: "Начать", kk: "Бастау" }[language]}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
