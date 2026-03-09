"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Star, Target, TrendingUp, BookOpen, Award, RefreshCw, Brain, Zap, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMbtiType, MBTI_DESCRIPTIONS, DICHOTOMY_LABELS, type MbtiScores } from "@/data/mbti-questions";
import { getAptitudeStrengths, APTITUDE_LABELS, type AptitudeScores } from "@/data/aptitude-questions";

interface CareerResult {
  personalitySummary: string;
  topCareers: Array<{ name: string; nameRu?: string; nameKk?: string; match: number; description: string }>;
  strengths: string[];
  skillsToDevelop: string[];
  roadmap: Array<{ step: number; title: string; description: string; timeframe: string }>;
}

interface MbtiResult {
  scores: MbtiScores;
  type: string;
}

interface AptitudeResult {
  scores: AptitudeScores;
  total: number;
  maxTotal: number;
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
  const { user } = useAuth();
  const [result, setResult] = useState<CareerResult | null>(null);
  const [mbtiResult, setMbtiResult] = useState<MbtiResult | null>(null);
  const [aptitudeResult, setAptitudeResult] = useState<AptitudeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // RIASEC result
    const stored = sessionStorage.getItem("careerResult");
    if (stored) {
      try { setResult(JSON.parse(stored)); sessionStorage.removeItem("careerResult"); } catch {}
    } else if (user?.careerResult) {
      setResult(user.careerResult as CareerResult);
    }

    // MBTI result
    const storedMbti = sessionStorage.getItem("mbtiResult");
    if (storedMbti) {
      try { setMbtiResult(JSON.parse(storedMbti)); } catch {}
    }

    // Aptitude result
    const storedApt = sessionStorage.getItem("aptitudeResult");
    if (storedApt) {
      try { setAptitudeResult(JSON.parse(storedApt)); } catch {}
    }

    setLoading(false);
  }, [user]);

  const getCareerName = (career: { name: string; nameRu?: string; nameKk?: string }) => {
    if (language === "ru") return career.nameRu || career.name;
    if (language === "kk") return career.nameKk || career.name;
    return career.name;
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const topCareers = Array.isArray(result?.topCareers) ? result!.topCareers : [];
  const roadmap = Array.isArray(result?.roadmap) ? result!.roadmap : [];
  const strengths = Array.isArray(result?.strengths) ? result!.strengths : [];
  const skillsToDevelop = Array.isArray(result?.skillsToDevelop) ? result!.skillsToDevelop : [];
  const userBadges = Array.isArray(user?.badges) ? user!.badges as Array<{ name: string; nameRu?: string; nameKk?: string; icon: string }> : [];

  const mbtiType = mbtiResult ? getMbtiType(mbtiResult.scores) : null;
  const mbtiDesc = mbtiType ? MBTI_DESCRIPTIONS[mbtiType] : null;
  const aptStrengths = aptitudeResult ? getAptitudeStrengths(aptitudeResult.scores) : [];

  const dichotomies: Array<{ key: "EI" | "SN" | "TF" | "JP"; left: "E" | "S" | "T" | "J"; right: "I" | "N" | "F" | "P" }> = [
    { key: "EI", left: "E", right: "I" },
    { key: "SN", left: "S", right: "N" },
    { key: "TF", left: "T", right: "F" },
    { key: "JP", left: "J", right: "P" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-xl text-primary">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-heading font-bold text-xl truncate">{user?.name || "—"}</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user?.studentClass && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {{ en: "Class", ru: "Класс", kk: "Сынып" }[language]} {user.studentClass}
                    </span>
                  )}
                  {user?.schoolName && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full truncate max-w-[160px]">
                      {user.schoolName}
                    </span>
                  )}
                  {user?.subscriptionPlan && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {user.subscriptionPlan}
                    </span>
                  )}
                </div>
              </div>
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </motion.div>

          {/* Tests Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            {[
              {
                icon: Target,
                color: "text-primary",
                bg: "bg-primary/10",
                label: { en: "RIASEC Career Test", ru: "RIASEC тест", kk: "RIASEC тест" },
                status: result
                  ? { en: "Completed ✓", ru: "Пройден ✓", kk: "Өтілді ✓" }
                  : { en: "Not taken", ru: "Не пройден", kk: "Өтілмеген" },
                done: !!result,
                href: "/test",
              },
              {
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                label: { en: "MBTI Personality", ru: "MBTI личность", kk: "MBTI тұлға" },
                status: mbtiType
                  ? { en: mbtiType, ru: mbtiType, kk: mbtiType }
                  : { en: "Not taken", ru: "Не пройден", kk: "Өтілмеген" },
                done: !!mbtiType,
                href: "/test?tab=mbti",
              },
              {
                icon: Zap,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                label: { en: "Aptitude Test", ru: "Тест способностей", kk: "Қабілеттер тесті" },
                status: aptitudeResult
                  ? { en: `${aptitudeResult.total}/${aptitudeResult.maxTotal}`, ru: `${aptitudeResult.total}/${aptitudeResult.maxTotal}`, kk: `${aptitudeResult.total}/${aptitudeResult.maxTotal}` }
                  : { en: "Not taken", ru: "Не пройден", kk: "Өтілмеген" },
                done: !!aptitudeResult,
                href: "/test?tab=aptitude",
              },
            ].map((t, i) => (
              <Link key={i} href={t.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`bg-card border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                    t.done ? "border-primary/30" : "border-border"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center mb-3`}>
                    <t.icon className={`h-5 w-5 ${t.color}`} />
                  </div>
                  <p className="font-medium text-sm mb-1">{t.label[language]}</p>
                  <p className={`text-xs font-semibold ${t.done ? "text-primary" : "text-muted-foreground"}`}>
                    {t.status[language]}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <span>{t.done ? { en: "View results", ru: "Смотреть", kk: "Қарау" }[language] : { en: "Take test", ru: "Пройти", kk: "Тапсыру" }[language]}</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* No tests at all */}
          {!result && !mbtiResult && !aptitudeResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-10 text-center shadow-card"
            >
              <Target className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h2 className="font-heading font-bold text-xl mb-2">
                {{ en: "Start your journey", ru: "Начни свой путь", kk: "Жолыңды баста" }[language]}
              </h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                {{ en: "Take RIASEC, MBTI, or Aptitude test to discover your career path.", ru: "Пройди RIASEC, MBTI или Тест способностей, чтобы узнать свой карьерный путь.", kk: "Мансап жолыңды ашу үшін RIASEC, MBTI немесе Қабілеттер тестін тапсыр." }[language]}
              </p>
              <Button asChild className="rounded-full">
                <Link href="/test">
                  {{ en: "Start Testing", ru: "Начать тестирование", kk: "Тестілеуді бастау" }[language]}
                </Link>
              </Button>
            </motion.div>
          )}

          {/* RIASEC Results */}
          {result && (
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold">{{ en: "RIASEC Profile", ru: "RIASEC профиль", kk: "RIASEC профилі" }[language]}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{result.personalitySummary}</p>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">{{ en: "Key Strengths", ru: "Сильные стороны", kk: "Күшті жақтар" }[language]}</h3>
                  {strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-semibold">{{ en: "Skills to Develop", ru: "Навыки для развития", kk: "Дамыту дағдылары" }[language]}</h3>
                  {skillsToDevelop.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
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
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
                    <Link href="/chat">
                      <BookOpen className="h-4 w-4" />
                      {{ en: "Ask AI Advisor", ru: "Спросить AI советника", kk: "AI кеңесшіден сұра" }[language]}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* MBTI Result */}
          {mbtiResult && mbtiDesc && mbtiType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-purple-500" />
                <h2 className="font-heading font-semibold">{{ en: "MBTI Personality", ru: "MBTI личность", kk: "MBTI тұлға" }[language]}</h2>
              </div>
              <div className="flex flex-wrap gap-4 items-start">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-6 py-4 text-center shrink-0">
                  <div className="font-heading font-bold text-3xl text-purple-500">{mbtiType}</div>
                  <div className="text-xs text-muted-foreground mt-1">{mbtiDesc.nickname}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "ru" ? mbtiDesc.ru : language === "kk" ? mbtiDesc.kk : mbtiDesc.en}
                  </p>
                  <div className="space-y-2">
                    {dichotomies.map(({ key, left, right }) => {
                      const lScore = mbtiResult.scores[left];
                      const rScore = mbtiResult.scores[right];
                      const total = lScore + rScore || 1;
                      const lPct = Math.round((lScore / total) * 100);
                      return (
                        <div key={key} className="flex items-center gap-3 text-xs">
                          <span className="w-4 font-bold text-purple-500">{left}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${lPct}%` }}
                            />
                          </div>
                          <span className="w-4 font-bold text-right text-muted-foreground">{right}</span>
                          <span className="text-muted-foreground w-10 text-right">{lPct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Aptitude Result */}
          {aptitudeResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-orange-500" />
                <h2 className="font-heading font-semibold">{{ en: "Aptitude Test Results", ru: "Результаты теста способностей", kk: "Қабілеттер тесті нәтижелері" }[language]}</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-heading font-bold text-2xl text-orange-500">{aptitudeResult.total}</span>
                <span className="text-muted-foreground text-sm">/ {aptitudeResult.maxTotal} {{ en: "correct", ru: "правильно", kk: "дұрыс" }[language]}</span>
              </div>
              <div className="space-y-3">
                {(Object.keys(aptitudeResult.scores) as Array<keyof AptitudeScores>).map((cat) => {
                  const info = APTITUDE_LABELS[cat];
                  const score = aptitudeResult.scores[cat];
                  const pct = Math.round((score / 5) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-3 text-sm">
                      <span className="w-20 text-xs text-muted-foreground shrink-0">
                        {language === "ru" ? info.ru : language === "kk" ? info.kk : info.en}
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${info.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-semibold">{score}/5</span>
                    </div>
                  );
                })}
              </div>
              {aptStrengths.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  {{ en: "Strengths:", ru: "Сильные стороны:", kk: "Күшті жақтары:" }[language]}{" "}
                  <span className="text-foreground font-medium">{aptStrengths.join(", ")}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Career Roadmap */}
          {roadmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6"
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
              transition={{ delay: 0.35 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card"
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
