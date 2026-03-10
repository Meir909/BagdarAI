"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

const plans = [
  {
    key: "free",
    label: { en: "Free", ru: "Free", kk: "Free" },
    priceAmount: "0",
    currency: "",
    period: null,
    features: {
      en: ["1 Career Test", "Basic results", "3 Professions to explore", "Community access"],
      ru: ["1 карьерный тест", "Базовые результаты", "3 профессии для изучения", "Доступ к сообществу"],
      kk: ["1 мансап тесті", "Негізгі нәтижелер", "3 мамандықты зерттеу", "Қауымдастыққа қол жеткізу"],
    },
    href: "/auth",
    highlight: false,
  },
  {
    key: "pro",
    label: { en: "Pro", ru: "Pro", kk: "Pro" },
    priceAmount: "2,990",
    currency: "₸",
    period: { en: "/month", ru: "/мес", kk: "/ай" },
    features: {
      en: ["Unlimited tests", "Full AI analysis", "AI 300+ professions", "AI Chat adviser", "Career roadmap", "University suggestions", "Badges & achievements"],
      ru: ["Безлимитные тесты", "Полный AI анализ", "AI 300+ профессий", "AI советник", "Карьерный план", "Рекомендации университетов", "Бейджи и достижения"],
      kk: ["Шексіз тесттер", "Толық AI талдау", "AI 300+ мамандық", "AI кеңесші", "Мансап жоспары", "Университет ұсыныстары", "Бейджиктер"],
    },
    href: "/auth",
    highlight: true,
  },
  {
    key: "school",
    label: { en: "School", ru: "School", kk: "School" },
    priceAmount: "49,900",
    currency: "₸",
    period: { en: "/month", ru: "/мес", kk: "/ай" },
    features: {
      en: ["Up to 500 students", "Admin dashboard", "Class analytics", "PDF reports", "Excel import", "Student invites", "Priority support", "Custom branding"],
      ru: ["До 500 учеников", "Панель администратора", "Аналитика классов", "PDF отчёты", "Импорт Excel", "Приглашения учеников", "Приоритетная поддержка", "Кастомный брендинг"],
      kk: ["500-ге дейін оқушы", "Админ панелі", "Сынып аналитикасы", "PDF есептер", "Excel импорт", "Оқушы шақыруы", "Басым қолдау", "Бренд баптауы"],
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

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl border-2 overflow-hidden transition-all ${
                  plan.highlight
                    ? "border-amber-400 shadow-[0_8px_40px_rgba(251,191,36,0.35)] scale-105"
                    : "border-amber-200 shadow-[0_4px_24px_rgba(251,191,36,0.15)]"
                }`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 ${
                    plan.highlight
                      ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
                      : "bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-white"
                  }`}
                />

                <div className="relative z-10 p-7">
                  {/* Plan name */}
                  <h3 className="font-heading font-bold text-2xl text-amber-900 mb-4">
                    {plan.label[language]}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-heading font-extrabold text-amber-700">
                      {plan.currency}{plan.priceAmount}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-amber-600 ml-1">{plan.period[language]}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {plan.features[language].map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-amber-900">
                        <Check className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA button */}
                  <Button
                    className={`w-full rounded-full font-semibold text-sm h-11 ${
                      plan.highlight
                        ? "bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-[0_4px_14px_rgba(251,191,36,0.5)]"
                        : "bg-white hover:bg-amber-50 text-amber-700 border border-amber-300"
                    }`}
                    asChild
                  >
                    <Link href={plan.href}>
                      {{ en: "Get Started", ru: "Начать", kk: "Бастау" }[language]}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
