"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, CheckCircle, Clock, Lock, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

interface Quest {
  id: string;
  questId: string;
  type: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  xpReward: number;
  icon: string;
  completed: boolean;
  completedAt: string | null;
  expiresAt: string;
}

const QUEST_LINKS: Record<string, string> = {
  simulation: "/simulations",
  profession: "/professions",
  mentor: "/mentors",
  test: "/test",
  chat: "/chat",
};

// FREE plan: only first quest is playable
const FREE_QUEST_LIMIT = 1;

export default function QuestsPage() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState<{ xp: number; level: number; progress: { current: number; needed: number } } | null>(null);

  const isPro = isAuthenticated && (user?.subscriptionPlan === "PRO" || user?.subscriptionPlan === "SCHOOL");

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([
      fetch("/api/quests").then((r) => r.json()),
      fetch("/api/xp").then((r) => r.json()),
    ]).then(([questData, xpData]) => {
      setQuests(questData.quests || []);
      setXp(xpData);
    }).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const getTitle = (q: Quest) => language === "ru" ? q.titleRu : language === "kk" ? q.titleKk : q.title;
  const getDesc  = (q: Quest) => language === "ru" ? q.descriptionRu : language === "kk" ? q.descriptionKk : q.description;

  const completedCount = quests.filter((q) => q.completed).length;
  const totalXPAvailable = quests.reduce((sum, q) => sum + (q.completed ? 0 : q.xpReward), 0);

  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursLeft = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(((tomorrow.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

  const isLocked = (index: number) => {
    if (!isAuthenticated) return true;
    if (isPro) return false;
    return index >= FREE_QUEST_LIMIT;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Guest view — show preview of what quests look like
  if (!isAuthenticated) {
    const previewQuests = [
      { icon: "⚡", title: { en: "Complete a Simulation", ru: "Пройди симуляцию", kk: "Симуляция аяқта" }, xp: 60 },
      { icon: "💬", title: { en: "Chat with a Mentor", ru: "Поговори с ментором", kk: "Ментормен сөйлес" }, xp: 30 },
      { icon: "🔍", title: { en: "Explore a Profession", ru: "Изучи профессию", kk: "Мамандықты зерттей" }, xp: 20 },
    ];
    return (
      <PageTransition>
        <div className="min-h-screen pt-16">
          <div className="container max-w-2xl mx-auto px-4 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h1 className="font-heading font-bold text-3xl mb-1">
                {{ en: "Daily Quests", ru: "Ежедневные задания", kk: "Күнделікті тапсырмалар" }[language]}
              </h1>
              <p className="text-sm text-muted-foreground">
                {{ en: "3 new quests every day. Complete them to earn XP.", ru: "3 новых задания каждый день. Выполняй и зарабатывай XP.", kk: "Күн сайын 3 жаңа тапсырма. Орындап XP жина." }[language]}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Lock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: "Sign in to get your daily quests and earn XP.", ru: "Войдите, чтобы получить задания и зарабатывать XP.", kk: "Тапсырмалар алу және XP жинау үшін кіріңіз." }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0">
                <Link href="/auth">{{ en: "Sign In", ru: "Войти", kk: "Кіру" }[language]}</Link>
              </Button>
            </motion.div>

            <div className="space-y-4 opacity-60 pointer-events-none select-none">
              {previewQuests.map((q, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">{q.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm blur-[2px]">{q.title[language]}</div>
                    <div className="text-xs text-muted-foreground mt-1 blur-[2px]">Lorem ipsum quest description</div>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-semibold">
                    <Zap className="h-3 w-3" /><span>+{q.xp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="font-heading font-bold text-3xl mb-1">
              {{ en: "Daily Quests", ru: "Ежедневные задания", kk: "Күнделікті тапсырмалар" }[language]}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {{ en: "Resets in", ru: "Сброс через", kk: "Жаңарту" }[language]}{" "}
                {hoursLeft}h {minutesLeft}m
              </span>
            </div>
          </motion.div>

          {/* FREE plan banner */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Crown className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: `Free plan: ${FREE_QUEST_LIMIT} of ${quests.length} quests available. Upgrade for all.`, ru: `Бесплатный план: ${FREE_QUEST_LIMIT} из ${quests.length} заданий. Перейди на PRO для всех.`, kk: `Тегін жоспар: ${quests.length} тапсырманың ${FREE_QUEST_LIMIT}-і қолжетімді. Барлығы үшін PRO.` }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0">
                <Link href="/pricing">{{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {/* XP bar */}
          {xp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-card mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-muted-foreground">{{ en: "Level", ru: "Уровень", kk: "Деңгей" }[language]} </span>
                  <span className="font-heading font-bold text-xl text-primary">{xp.level}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">{xp.xp} XP</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((xp.progress.current / xp.progress.needed) * 100, 100)}%` }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{xp.progress.current} XP</span>
                <span>{xp.progress.needed} XP {{ en: "to next level", ru: "до следующего", kk: "келесі деңгейге" }[language]}</span>
              </div>
            </motion.div>
          )}

          {/* Progress summary */}
          <div className="flex items-center justify-between mb-5 text-sm">
            <span className="text-muted-foreground">
              {completedCount} / {isPro ? quests.length : FREE_QUEST_LIMIT} {{ en: "completed", ru: "выполнено", kk: "орындалды" }[language]}
            </span>
            {totalXPAvailable > 0 && isPro && (
              <span className="text-primary font-semibold">
                +{totalXPAvailable} XP {{ en: "available", ru: "доступно", kk: "қолжетімді" }[language]}
              </span>
            )}
          </div>

          {/* Quests */}
          <div className="space-y-4">
            {quests.map((quest, i) => {
              const locked = isLocked(i);
              const content = (
                <div className={`relative bg-card border rounded-2xl p-5 shadow-card transition-all ${
                  quest.completed ? "border-primary/20 opacity-70" :
                  locked ? "border-border" :
                  "border-border hover:border-primary/40 hover:shadow-card-hover cursor-pointer"
                }`}>
                  {/* Lock overlay */}
                  {locked && (
                    <div className="absolute inset-0 rounded-2xl bg-card/70 backdrop-blur-[1px] flex items-center justify-center z-10 gap-3">
                      <Crown className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-semibold text-amber-600">PRO</span>
                      <Button asChild size="sm" className="rounded-full text-xs h-7 bg-amber-500 hover:bg-amber-600 text-white border-0">
                        <Link href="/pricing" onClick={(e) => e.stopPropagation()}>
                          {{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${quest.completed ? "bg-primary/10" : "bg-muted"}`}>
                      {quest.completed ? "✅" : quest.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-sm ${quest.completed ? "line-through text-muted-foreground" : ""}`}>
                          {getTitle(quest)}
                        </h3>
                        <div className="flex items-center gap-1 text-primary text-xs font-semibold shrink-0">
                          <Zap className="h-3 w-3" /><span>+{quest.xpReward}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{getDesc(quest)}</p>
                      {quest.completed && quest.completedAt && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>{{ en: "Completed", ru: "Выполнено", kk: "Орындалды" }[language]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                >
                  {locked ? (
                    <div>{content}</div>
                  ) : (
                    <Link href={QUEST_LINKS[quest.type] || "/"}>{content}</Link>
                  )}
                </motion.div>
              );
            })}

            {quests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {{ en: "No quests available. Check back tomorrow!", ru: "Заданий нет. Заходи завтра!", kk: "Тапсырмалар жоқ. Ертең кел!" }[language]}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
