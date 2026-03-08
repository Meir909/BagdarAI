"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Star, Target, TrendingUp, BookOpen, Award, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

interface CareerResult {
  personalitySummary: string;
  topCareers: Array<{ name: string; nameRu?: string; nameKk?: string; match: number; description: string }>;
  strengths: string[];
  skillsToDevelop: string[];
  roadmap: Array<{ step: number; title: string; description: string; timeframe: string }>;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const { language } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [result, setResult] = useState<CareerResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try sessionStorage first (just finished test)
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("careerResult") : null;
    if (stored) {
      try {
        setResult(JSON.parse(stored));
        sessionStorage.removeItem("careerResult");
        setLoading(false);
        return;
      } catch {}
    }

    // Load from user data
    if (user?.careerResult) {
      setResult(user.careerResult as CareerResult);
    }
    setLoading(false);
  }, [user]);

  const getCareerName = (career: { name: string; nameRu?: string; nameKk?: string }) => {
    if (language === "ru") return career.nameRu || career.name;
    if (language === "kk") return career.nameKk || career.name;
    return career.name;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Target className="h-16 w-16 text-primary/30 mx-auto mb-6" />
            <h1 className="font-heading font-bold text-2xl mb-3">
              {{ en: "No career analysis yet", ru: "Анализ карьеры ещё не пройден", kk: "Мансап талдауы әлі жоқ" }[language]}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              {{ en: "Take the career test to get your personalized AI analysis", ru: "Пройди карьерный тест, чтобы получить персональный AI анализ", kk: "Жеке AI талдауыңызды алу үшін мансап тестін тапсырыңыз" }[language]}
            </p>
            <Button asChild className="rounded-full">
              <Link href="/test">
                {{ en: "Take Career Test", ru: "Пройти тест", kk: "Мансап тестін тапсыру" }[language]}
              </Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const topCareers = Array.isArray(result.topCareers) ? result.topCareers : [];
  const roadmap = Array.isArray(result.roadmap) ? result.roadmap : [];
  const strengths = Array.isArray(result.strengths) ? result.strengths : [];
  const skillsToDevelop = Array.isArray(result.skillsToDevelop) ? result.skillsToDevelop : [];
  const userBadges = Array.isArray(user?.badges) ? user.badges as Array<{ name: string; nameRu?: string; nameKk?: string; icon: string }> : [];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl">
                {{ en: "My Dashboard", ru: "Мой дашборд", kk: "Менің панелім" }[language]}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{user?.name}</p>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-full gap-2">
              <Link href="/test">
                <RefreshCw className="h-4 w-4" />
                {{ en: "Retake Test", ru: "Перепройти тест", kk: "Тестті қайта тапсыру" }[language]}
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Personality Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-semibold">{{ en: "Your Profile", ru: "Ваш профиль", kk: "Сіздің профиліңіз" }[language]}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{result.personalitySummary}</p>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">{{ en: "Key Strengths", ru: "Сильные стороны", kk: "Негізгі күшті жақтарыңыз" }[language]}</h3>
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold">{{ en: "Skills to Develop", ru: "Навыки для развития", kk: "Дамыту керек дағдылар" }[language]}</h3>
                {skillsToDevelop.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Careers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-semibold">{{ en: "Top Career Matches", ru: "Лучшие совпадения", kk: "Үздік мансап сәйкестіктері" }[language]}</h2>
              </div>
              <div className="space-y-4">
                {topCareers.map((career, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 font-heading font-bold text-primary text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{getCareerName(career)}</span>
                        <span className="text-sm text-primary font-semibold ml-2 shrink-0">{career.match}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${career.match}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        />
                      </div>
                      {career.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{career.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
                  <Link href="/chat">
                    <BookOpen className="h-4 w-4" />
                    {{ en: "Ask AI Advisor", ru: "Спросить AI советника", kk: "AI кеңесшіден сұра" }[language]}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Career Roadmap */}
          {roadmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-semibold">{{ en: "Career Roadmap", ru: "Карьерный план", kk: "Мансап жол картасы" }[language]}</h2>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {roadmap.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex gap-4 pl-10"
                    >
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{step.step}</span>
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{step.title}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{step.timeframe}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Badges */}
          {userBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-semibold">{{ en: "Achievements", ru: "Достижения", kk: "Жетістіктер" }[language]}</h2>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {userBadges.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-xs font-medium text-center">
                      {language === "ru" ? (badge.nameRu || badge.name) : language === "kk" ? (badge.nameKk || badge.name) : badge.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
