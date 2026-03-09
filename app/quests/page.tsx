"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

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

export default function QuestsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DailyQuests />
    </ProtectedRoute>
  );
}

function DailyQuests() {
  const { language } = useLanguage();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState<{ xp: number; level: number; progress: { current: number; needed: number } } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/quests").then((r) => r.json()),
      fetch("/api/xp").then((r) => r.json()),
    ]).then(([questData, xpData]) => {
      setQuests(questData.quests || []);
      setXp(xpData);
    }).finally(() => setLoading(false));
  }, []);

  const getTitle = (q: Quest) => language === "ru" ? q.titleRu : language === "kk" ? q.titleKk : q.title;
  const getDesc  = (q: Quest) => language === "ru" ? q.descriptionRu : language === "kk" ? q.descriptionKk : q.description;

  const completedCount = quests.filter((q) => q.completed).length;
  const totalXPAvailable = quests.reduce((sum, q) => sum + (q.completed ? 0 : q.xpReward), 0);

  // Time until reset
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursLeft = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(((tomorrow.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
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

          {/* XP bar */}
          {xp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
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
              {completedCount} / {quests.length} {{ en: "completed", ru: "выполнено", kk: "орындалды" }[language]}
            </span>
            {totalXPAvailable > 0 && (
              <span className="text-primary font-semibold">
                +{totalXPAvailable} XP {{ en: "available", ru: "доступно", kk: "қолжетімді" }[language]}
              </span>
            )}
          </div>

          {/* Quests */}
          <div className="space-y-4">
            {quests.map((quest, i) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={QUEST_LINKS[quest.type] || "/"}>
                  <div className={`bg-card border rounded-2xl p-5 shadow-card transition-all ${
                    quest.completed
                      ? "border-primary/20 opacity-70"
                      : "border-border hover:border-primary/40 hover:shadow-card-hover cursor-pointer"
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                        quest.completed ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {quest.completed ? "✅" : quest.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-semibold text-sm ${quest.completed ? "line-through text-muted-foreground" : ""}`}>
                            {getTitle(quest)}
                          </h3>
                          <div className="flex items-center gap-1 text-primary text-xs font-semibold shrink-0">
                            <Zap className="h-3 w-3" />
                            <span>+{quest.xpReward}</span>
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
                </Link>
              </motion.div>
            ))}

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
