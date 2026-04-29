"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Zap, Lock, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

interface JobSimulation {
  id: string;
  professionId: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  profession: {
    name: string;
    category: string;
  };
}

const DIFF_COLOR = {
  easy: { bg: "bg-green-500/10", text: "text-green-600", label: { en: "Easy", ru: "Лёгкий", kk: "Жеңіл" } },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-600", label: { en: "Medium", ru: "Средний", kk: "Орташа" } },
  hard: { bg: "bg-red-500/10", text: "text-red-600", label: { en: "Hard", ru: "Сложный", kk: "Қиын" } },
};

const categories = ["All", "IT", "Business", "Creative", "Science", "Medicine", "Engineering", "Education"];

const categoryIcons: Record<string, string> = {
  IT: "💻",
  Business: "💼",
  Creative: "🎨",
  Science: "🔬",
  Medicine: "⚕️",
  Engineering: "⚙️",
  Education: "📚",
};

export default function JobSimulationsPage() {
  const { language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [simulations, setSimulations] = useState<JobSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);

    fetch(`/api/job-simulations?${params}`)
      .then((r) => r.json())
      .then((d) => setSimulations(d.simulations || []))
      .catch(() => setSimulations([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const getText = (obj: any, key: string) => {
    if (language === "ru") return obj[key + "Ru"] || obj[key];
    if (language === "kk") return obj[key + "Kk"] || obj[key];
    return obj[key];
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2">
              {{ en: "Job Simulations", ru: "Профессиональные симуляции", kk: "Мамандық симуляциялары" }[language]}
            </h1>
            <p className="text-muted-foreground text-sm">
              {{ en: "Practice real-world scenarios for different careers", ru: "Практикуйте реальные сценарии разных карьер", kk: "Түрлі мансаптар үшін нақты сценарийлерді практикалау" }[language]}
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "All"
                  ? { en: "All", ru: "Все", kk: "Барлығы" }[language]
                  : `${categoryIcons[cat] || ""} ${cat}`}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : simulations.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-4">🎮</p>
              <p className="font-medium">{{ en: "No simulations available yet.", ru: "Симуляции недоступны.", kk: "Симуляциялар әлі қол жетімді емес." }[language]}</p>
              <p className="text-sm mt-2">{{ en: "Check back soon for new challenges!", ru: "Скоро будут новые вызовы!", kk: "Жақында жаңа ынамдар болады!" }[language]}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((sim, i) => (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{categoryIcons[sim.profession.category] || "🏢"}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFF_COLOR[sim.difficulty].bg} ${DIFF_COLOR[sim.difficulty].text}`}>
                      {DIFF_COLOR[sim.difficulty].label[language as keyof typeof DIFF_COLOR["easy"]["label"]]}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-sm mb-1">{getText(sim, "title")}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{sim.profession.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{getText(sim, "description")}</p>

                  <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span>{sim.xpReward} XP</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="w-full rounded-full group-hover:scale-105 transition-transform"
                  >
                    <Link href={`/job-simulation/${sim.id}`}>
                      {{ en: "Start Simulation", ru: "Начать симуляцию", kk: "Симуляцияны бастау" }[language]}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
