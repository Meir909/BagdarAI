"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Zap, Trophy, RotateCcw, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { SimulationScenario, SimulationOption } from "@/data/simulations";

interface SimulationData {
  id: string;
  title: string;
  titleRu: string;
  titleKk: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  difficulty: string;
  estimatedTime: number;
  xpReward: number;
  category: string;
  scenarios: SimulationScenario[];
  completed: boolean;
}

export default function SimulationPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <SimulationRunner />
    </ProtectedRoute>
  );
}

function SimulationRunner() {
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [choices, setChoices] = useState<Array<{ scenarioId: number; optionId: string; score: number }>>([]);
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/simulations")
      .then((r) => r.json())
      .then((d) => {
        const sim = (d.simulations || []).find((s: SimulationData) => s.id === id);
        setSimulation(sim || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{{ en: "Simulation not found", ru: "Симуляция не найдена", kk: "Симуляция табылмады" }[language]}</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/simulations">← {{ en: "Back", ru: "Назад", kk: "Артқа" }[language]}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const scenarios = simulation.scenarios as SimulationScenario[];
  const scenario = scenarios[currentScenario];

  const getTitle  = () => language === "ru" ? simulation.titleRu  : language === "kk" ? simulation.titleKk  : simulation.title;
  const getSit    = (s: SimulationScenario) => language === "ru" ? s.situationRu : language === "kk" ? s.situationKk : s.situation;
  const getTask   = (s: SimulationScenario) => language === "ru" ? s.taskRu      : language === "kk" ? s.taskKk      : s.task;
  const getChoice = (o: SimulationOption)   => language === "ru" ? o.choiceRu    : language === "kk" ? o.choiceKk    : o.choice;
  const getFeedback=(o: SimulationOption)   => language === "ru" ? o.feedbackRu  : language === "kk" ? o.feedbackKk  : o.feedback;

  const chosenOption = scenario?.options.find((o) => o.id === selectedOption);

  const handleSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const option = scenario.options.find((o) => o.id === selectedOption)!;
    const newChoices = [...choices, { scenarioId: scenario.id, optionId: selectedOption, score: option.score }];
    setChoices(newChoices);

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((c) => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Calculate results
      const total = newChoices.reduce((sum, c) => sum + c.score, 0);
      const max = scenarios.reduce((sum, s) => sum + Math.max(...s.options.map((o) => o.score)), 0);
      setTotalScore(total);
      setMaxScore(max);
      finishSimulation(newChoices, total, max);
    }
  };

  const finishSimulation = async (
    finalChoices: Array<{ scenarioId: number; optionId: string; score: number }>,
    score: number,
    max: number
  ) => {
    setSaving(true);
    setPhase("result");
    try {
      const res = await fetch("/api/simulations/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulationId: simulation.id,
          score,
          maxScore: max,
          choices: finalChoices,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setXpEarned(data.xpEarned ?? 0);
        setLeveledUp(data.leveledUp ?? false);
      }
    } catch {}
    setSaving(false);
  };

  const restart = () => {
    setCurrentScenario(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setChoices([]);
    setPhase("playing");
    setTotalScore(0);
    setMaxScore(0);
    setXpEarned(0);
    setLeveledUp(false);
  };

  const scorePct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // RESULT SCREEN
  if (phase === "result") {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full mx-4 bg-card border border-border rounded-3xl p-8 shadow-card text-center"
          >
            <div className="text-6xl mb-4">
              {scorePct >= 80 ? "🏆" : scorePct >= 50 ? "⭐" : "💪"}
            </div>
            <h2 className="font-heading font-bold text-2xl mb-2">
              {scorePct >= 80
                ? { en: "Excellent Work!", ru: "Отличная работа!", kk: "Тамаша жұмыс!" }[language]
                : scorePct >= 50
                ? { en: "Good Effort!", ru: "Хорошая попытка!", kk: "Жақсы тырысу!" }[language]
                : { en: "Keep Practicing!", ru: "Продолжай практиковаться!", kk: "Жаттықтыруды жалғастыр!" }[language]}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">{getTitle()}</p>

            <div className="bg-muted/50 rounded-2xl p-5 mb-6">
              <div className="text-4xl font-heading font-bold text-primary mb-1">{scorePct}%</div>
              <div className="text-sm text-muted-foreground mb-3">{totalScore} / {maxScore} {{ en: "points", ru: "баллов", kk: "ұпай" }[language]}</div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>

            {xpEarned > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-semibold rounded-xl px-4 py-3 mb-4"
              >
                <Zap className="h-5 w-5" />
                <span>+{xpEarned} XP {{ en: "earned!", ru: "заработано!", kk: "жиналды!" }[language]}</span>
              </motion.div>
            )}

            {leveledUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm font-semibold text-yellow-600 bg-yellow-500/10 rounded-xl px-4 py-2 mb-4"
              >
                🎉 {{ en: "Level Up!", ru: "Новый уровень!", kk: "Деңгей өсті!" }[language]}
              </motion.div>
            )}

            <div className="flex gap-3 justify-center mt-2">
              <Button variant="outline" className="rounded-full gap-2" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                {{ en: "Try Again", ru: "Ещё раз", kk: "Қайталау" }[language]}
              </Button>
              <Button className="rounded-full gap-2" asChild>
                <Link href="/simulations">
                  <Trophy className="h-4 w-4" />
                  {{ en: "More Simulations", ru: "Больше симуляций", kk: "Тағы симуляциялар" }[language]}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // PLAYING SCREEN
  const progress = ((currentScenario) / scenarios.length) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/simulations" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-heading font-semibold text-sm truncate">{getTitle()}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {currentScenario + 1} / {scenarios.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
              <Zap className="h-3 w-3" />
              <span>+{simulation.xpReward} XP</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Situation */}
              <div className="bg-muted/50 rounded-2xl p-5 mb-5">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                  {{ en: "Situation", ru: "Ситуация", kk: "Жағдай" }[language]}
                </div>
                <p className="text-sm leading-relaxed">{getSit(scenario)}</p>
              </div>

              {/* Task */}
              <div className="bg-card border border-border rounded-2xl p-5 mb-5">
                <div className="text-xs text-primary font-medium uppercase tracking-wide mb-2">
                  {{ en: "Your Task", ru: "Твоё задание", kk: "Сенің тапсырмаң" }[language]}
                </div>
                <p className="font-semibold text-sm">{getTask(scenario)}</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-5">
                {scenario.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isPerfect = option.score === Math.max(...scenario.options.map((o) => o.score));
                  const showResult = showFeedback && isSelected;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={!showFeedback ? { scale: 1.01 } : {}}
                      whileTap={!showFeedback ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        !showFeedback
                          ? "bg-card border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                          : isSelected
                          ? option.score >= 8
                            ? "bg-green-500/10 border-green-500/50"
                            : option.score >= 5
                            ? "bg-yellow-500/10 border-yellow-500/50"
                            : "bg-red-500/10 border-red-500/50"
                          : "bg-muted/30 border-border opacity-50 cursor-default"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {option.id.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{getChoice(option)}</p>
                          {showResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2"
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                {option.score >= 8 ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : option.score >= 5 ? (
                                  <CheckCircle className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-xs font-semibold">
                                  +{option.score} {{ en: "pts", ru: "очков", kk: "ұпай" }[language]}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{getFeedback(option)}</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button className="w-full rounded-full gap-2" onClick={handleNext}>
                    {currentScenario < scenarios.length - 1
                      ? <>{{ en: "Next Scenario", ru: "Следующий сценарий", kk: "Келесі сценарий" }[language]} <ChevronRight className="h-4 w-4" /></>
                      : <>{{ en: "See Results", ru: "Смотреть результаты", kk: "Нәтижелерді қарау" }[language]} <Trophy className="h-4 w-4" /></>}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
