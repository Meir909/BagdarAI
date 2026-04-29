"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, TrendingUp, DollarSign, GraduationCap, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";
import Link from "next/link";

export default function CareerRoadmapPage({ params }: { params: Promise<{ professionId: string }> }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [professionId, setProfessionId] = useState<string>("");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<number | null>(1);

  useEffect(() => {
    (async () => {
      const { professionId } = await params;
      setProfessionId(professionId);

      try {
        const res = await fetch(`/api/career-roadmap/${professionId}`);
        const data = await res.json();
        setRoadmap(data);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">{{ en: "Roadmap not found", ru: "Карта не найдена", kk: "Карта табылмады" }[language]}</p>
      </div>
    );
  }

  const getName = (name: string, nameRu: string, nameKk: string) => {
    if (language === "ru") return nameRu || name;
    if (language === "kk") return nameKk || name;
    return name;
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                🎯
              </div>
              <div className="flex-1">
                <h1 className="font-heading font-bold text-3xl">
                  {getName(roadmap.professionName, roadmap.professionNameRu, roadmap.professionNameKk)}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {{ en: "Your career roadmap", ru: "Ваша карьерная карта", kk: "Сіздің мансап картасы" }[language]} • {roadmap.timeline}{" "}
                  {{ en: "years", ru: "лет", kk: "жыл" }[language]}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-heading font-bold text-primary">{roadmap.futureDemand}%</div>
                <p className="text-xs text-muted-foreground">{{ en: "Future demand", ru: "Спрос", kk: "Сұраныс" }[language]}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {{ en: "Career Path", ru: "Карьерный путь", kk: "Мансап жолы" }[language]}
              </h2>
              <RoadmapTimeline
                stages={roadmap.stages}
                selectedStage={selectedStage}
                onStageSelect={setSelectedStage}
              />
            </motion.div>

            {/* Side Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              {/* Required Skills */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {{ en: "Key Skills", ru: "Ключевые навыки", kk: "Негізгі дағдылар" }[language]}
                </h3>
                <div className="space-y-2">
                  {roadmap.requiredSkills.map((skill: string) => (
                    <div key={skill} className="flex items-center gap-2 text-xs">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Info */}
              {roadmap.salaryInfo && (
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    {{ en: "Salary Range", ru: "Диапазон зарплаты", kk: "Жалақы диапазоны" }[language]}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(roadmap.salaryInfo).map(([country, salary]: [string, unknown]) => (
                      <div key={country} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{country}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{String(salary)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Universities */}
              {roadmap.stages[2]?.topUniversities && (
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {{ en: "Top Universities", ru: "Топ ВУЗы", kk: "Үздік ВУ" }[language]}
                  </h3>
                  <div className="space-y-2">
                    {roadmap.stages[2].topUniversities.map((uni: any) => (
                      <div key={uni.name} className="border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <p className="text-xs font-medium">{uni.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {{ en: "Min score", ru: "Мин. балл", kk: "Мін. балл" }[language]}: {uni.minScore}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button asChild className="w-full rounded-full h-10 gap-2">
                <Link href={`/job-simulation?profession=${professionId}`}>
                  <Zap className="h-4 w-4" />
                  {{ en: "Try Simulation", ru: "Попробовать", kk: "Сынап көру" }[language]}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
