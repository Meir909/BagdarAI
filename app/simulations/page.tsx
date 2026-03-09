"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Gamepad2, Clock, Zap, Star, Lock } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

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

export default function SimulationsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Simulations />
    </ProtectedRoute>
  );
}

function Simulations() {
  const { language } = useLanguage();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl">
                {{ en: "Career Simulations", ru: "Карьерные симуляции", kk: "Мансап симуляциялары" }[language]}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm ml-13">
              {{ en: "Experience real job scenarios and earn XP", ru: "Испытай реальные рабочие ситуации и зарабатывай XP", kk: "Нақты жұмыс жағдайларын сезін және XP жина" }[language]}
            </p>
          </motion.div>

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
              {{ en: "No simulations available yet. Check back soon!", ru: "Симуляций пока нет. Загляни позже!", kk: "Симуляциялар әлі жоқ. Кейінірек қайт!" }[language]}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((sim, i) => {
                const diff = DIFF_COLOR[sim.difficulty];
                return (
                  <motion.div
                    key={sim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                  >
                    <Link href={`/simulations/${sim.id}`}>
                      <div className={`bg-card border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer h-full flex flex-col ${sim.completed ? "border-primary/30" : "border-border"}`}>
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
                    </Link>
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
