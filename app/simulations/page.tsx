"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Gamepad2, Clock, Zap, Lock, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

interface Simulation {
  id: string;
  careerId: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  xpReward: number;
  category: string;
  completed: boolean;
}

const DIFF_COLOR = {
  easy:   { bg: "bg-green-500/10",  text: "text-green-600",  label: { en: "Easy",   ru: "Лёгкий",  kk: "Жеңіл"  } },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-600", label: { en: "Medium", ru: "Средний", kk: "Орташа" } },
  hard:   { bg: "bg-red-500/10",    text: "text-red-600",    label: { en: "Hard",   ru: "Сложный", kk: "Қиын"   } },
};

// FREE plan: only first simulation is unlocked
const FREE_SIM_LIMIT = 1;

export default function SimulationsPage() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const isPro = isAuthenticated && (user?.subscriptionPlan === "PRO" || user?.subscriptionPlan === "SCHOOL");

  useEffect(() => {
    fetch("/api/simulations")
      .then((r) => r.json())
      .then((d) => setSimulations(d.simulations || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(simulations.map((s) => s.category)))];
  const filtered = filter === "All" ? simulations : simulations.filter((s) => s.category === filter);

  const getTitle = (s: Simulation) => language === "ru" ? s.titleRu : language === "kk" ? s.titleKk : s.title;
  const getDesc  = (s: Simulation) => language === "ru" ? s.descriptionRu : language === "kk" ? s.descriptionKk : s.description;

  // Is this simulation locked for current user?
  const isLocked = (index: number) => {
    if (!isAuthenticated) return index > 0; // guests: only first visible but locked on click
    if (isPro) return false;               // PRO: all unlocked
    return index >= FREE_SIM_LIMIT;         // FREE: only first unlocked
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl">
                {{ en: "Career Simulations", ru: "Карьерные симуляции", kk: "Мансап симуляциялары" }[language]}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {{ en: "Experience real job scenarios and earn XP", ru: "Испытай реальные рабочие ситуации и зарабатывай XP", kk: "Нақты жұмыс жағдайларын сезін және XP жина" }[language]}
            </p>
          </motion.div>

          {/* FREE plan banner */}
          {isAuthenticated && !isPro && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Crown className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: `Free plan: ${FREE_SIM_LIMIT} simulation unlocked. Upgrade to PRO for all ${simulations.length}.`, ru: `Бесплатный план: открыта ${FREE_SIM_LIMIT} симуляция. Перейди на PRO для всех ${simulations.length}.`, kk: `Тегін жоспар: ${FREE_SIM_LIMIT} симуляция ашық. Барлық ${simulations.length}-ге PRO алыңыз.` }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0">
                <Link href="/pricing">{{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {/* Guest banner */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Lock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: "Sign in to play career simulations and earn XP.", ru: "Войдите, чтобы играть в симуляции и зарабатывать XP.", kk: "Симуляциялар ойнап XP жинау үшін кіріңіз." }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0">
                <Link href="/auth">{{ en: "Sign In", ru: "Войти", kk: "Кіру" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "All" ? { en: "All", ru: "Все", kk: "Барлығы" }[language] : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {{ en: "No simulations available yet.", ru: "Симуляций пока нет.", kk: "Симуляциялар әлі жоқ." }[language]}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((sim, i) => {
                const diff = DIFF_COLOR[sim.difficulty];
                const locked = isLocked(i);

                const card = (
                  <div className={`relative bg-card border rounded-2xl p-5 shadow-card transition-all h-full flex flex-col ${
                    sim.completed ? "border-primary/30" :
                    locked ? "border-border opacity-75" :
                    "border-border hover:shadow-card-hover hover:border-primary/30"
                  }`}>
                    {/* Lock overlay */}
                    {locked && (
                      <div className="absolute inset-0 rounded-2xl bg-card/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 gap-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-xs font-semibold text-amber-600">PRO</p>
                        <Button asChild size="sm" className="rounded-full text-xs h-7 bg-amber-500 hover:bg-amber-600 text-white border-0 mt-1">
                          <Link href="/pricing" onClick={(e) => e.stopPropagation()}>
                            {{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
                        {diff.label[language]}
                      </span>
                      {sim.completed && (
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                          ✓ {{ en: "Done", ru: "Пройдено", kk: "Өтілді" }[language]}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-semibold text-base mb-2">{getTitle(sim)}</h3>
                    <p className="text-xs text-muted-foreground flex-1 line-clamp-3 mb-4">{getDesc(sim)}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{sim.estimatedTime} {{ en: "min", ru: "мин", kk: "мин" }[language]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Zap className="h-3 w-3" />
                        <span>+{sim.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={sim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={!locked ? { y: -3 } : {}}
                  >
                    {locked || !isAuthenticated ? (
                      <div className="h-full">{card}</div>
                    ) : (
                      <Link href={`/simulations/${sim.id}`} className="block h-full">{card}</Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
