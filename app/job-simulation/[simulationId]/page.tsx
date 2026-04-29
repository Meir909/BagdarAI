"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { SimulationIntro } from "@/components/simulation/SimulationIntro";
import { MissionCard } from "@/components/simulation/MissionCard";
import { AIFeedback } from "@/components/simulation/AIFeedback";
import { SimulationResults } from "@/components/simulation/SimulationResults";

type SimulationState = "intro" | "mission" | "feedback" | "results";

interface Mission {
  id: number;
  title: string;
  scenario: string;
  options: Array<{ id: string; text: string }>;
}

interface SimulationData {
  resultId: string;
  simulationId: string;
  title: string;
  titleRu?: string;
  description?: string;
  descriptionRu?: string;
  profession?: string;
  difficulty: string;
  totalMissions: number;
  currentMissionIndex: number;
  mission: Mission;
  xpReward?: number;
}

interface FeedbackData {
  feedback: { en: string; ru: string; kk: string };
  explanation?: string;
  tips?: string[];
  isCorrect: boolean;
  xpEarned: number;
  totalXP: number;
  nextMission: Mission | null;
  isComplete: boolean;
}

interface ResultsData {
  totalScore: number;
  maxScore: number;
  correctAnswers: number;
  totalMissions: number;
  scorePercentage: number;
  strengths: string[];
  improvements: string[];
  recommendation: string;
  missionResults: Array<{
    missionId: number;
    title: string;
    isCorrect: boolean;
    xpEarned: number;
    feedback: { en: string; ru: string; kk: string };
  }>;
}

// Metadata shown on the intro screen before simulation starts
const SIMULATION_META: Record<string, { title: string; description: string; profession: string }> = {
  "ux-designer-1": {
    title: "UX Designer: Кризисный день",
    description: "Пользователи жалуются на сложный интерфейс. Ты UX-дизайнер. Как ты это исправишь? Пройди 5 реальных ситуаций из рабочего дня дизайнера.",
    profession: "UX Designer",
  },
  "sim-1": {
    title: "First Day as Software Engineer",
    description: "Твой первый день в tech-компании. Прими правильные решения и покажи, что ты — профессионал.",
    profession: "Software Engineer",
  },
  "sim-2": {
    title: "Data Analysis Challenge",
    description: "Перед тобой датасет из 1 млн строк. Сможешь сделать правильные выводы и развернуть модель?",
    profession: "Data Scientist",
  },
};

export default function JobSimulationPage({
  params,
}: {
  params: Promise<{ simulationId: string }>;
}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [simulationId, setSimulationId] = useState<string>("");
  const [state, setState] = useState<SimulationState>("intro");
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { simulationId } = await params;
      setSimulationId(simulationId);
      setLoading(false);
    })();
  }, [params]);

  const handleStart = async () => {
    if (!simulationId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/job-simulation/${simulationId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to start simulation");
      const data = await res.json();
      setSimulationData(data);
      setState("mission");
    } catch (error) {
      console.error("Start simulation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMissionSubmit = async (selectedOptionId: string) => {
    if (!simulationData) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/job-simulation/${simulationId}/mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId: simulationData.resultId,
          missionId: simulationData.mission.id,
          userAnswer: selectedOptionId,
          missionIndex: simulationData.currentMissionIndex,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit mission");
      const data: FeedbackData = await res.json();
      setFeedbackData(data);

      if (data.isComplete) {
        const resultsRes = await fetch(
          `/api/job-simulation/${simulationId}/results?resultId=${simulationData.resultId}`
        );
        const results: ResultsData = await resultsRes.json();
        setResultsData(results);
        setState("results");
      } else {
        setState("feedback");
      }
    } catch (error) {
      console.error("Submit mission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueToNext = () => {
    if (feedbackData?.nextMission && simulationData) {
      setSimulationData({
        ...simulationData,
        currentMissionIndex: simulationData.currentMissionIndex + 1,
        mission: feedbackData.nextMission,
      });
      setFeedbackData(null);
      setState("mission");
    }
  };

  const handleRetry = () => {
    setSimulationData(null);
    setFeedbackData(null);
    setResultsData(null);
    setState("intro");
  };

  const meta = simulationId ? SIMULATION_META[simulationId] : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <p className="text-muted-foreground">
          {{ en: "Please log in to start a simulation", ru: "Войдите, чтобы начать симуляцию", kk: "Симуляция бастау үшін кіріңіз" }[language]}
        </p>
        <Button asChild className="rounded-full">
          <a href="/auth/login">Войти</a>
        </Button>
      </div>
    );
  }

  // Progress values
  const currentStep = simulationData
    ? simulationData.currentMissionIndex + (state === "feedback" ? 1 : 0)
    : 0;
  const totalSteps = simulationData?.totalMissions ?? 0;
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const currentXP = feedbackData?.totalXP ?? 0;

  return (
    <PageTransition>
      <div className="min-h-screen pb-12 pt-16">
        <div className="container mx-auto px-4">

          {/* Progress bar — visible during active simulation */}
          {simulationData && state !== "results" && state !== "intro" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 mt-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Шаг {Math.min(currentStep + 1, totalSteps)} из {totalSteps}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Zap className="h-3 w-3" />
                  {currentXP} XP
                </span>
              </div>

              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                />
              </div>

              {totalSteps <= 8 && (
                <div className="mt-2 flex gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < currentStep
                          ? "bg-primary"
                          : i === currentStep
                          ? "bg-primary/40"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Main content */}
          <div className="mx-auto max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* INTRO */}
                {state === "intro" && (
                  <SimulationIntro
                    title={meta?.title ?? simulationId}
                    description={meta?.description}
                    profession={meta?.profession}
                    difficulty="easy"
                    totalMissions={5}
                    onStart={handleStart}
                  />
                )}

                {/* MISSION */}
                {state === "mission" && simulationData && (
                  <MissionCard
                    mission={simulationData.mission}
                    onSubmit={handleMissionSubmit}
                    isSubmitting={submitting}
                    missionNumber={simulationData.currentMissionIndex + 1}
                    totalMissions={simulationData.totalMissions}
                  />
                )}

                {/* FEEDBACK */}
                {state === "feedback" && feedbackData && simulationData && (
                  <div className="space-y-5">
                    <MissionCard
                      mission={simulationData.mission}
                      disabled
                      missionNumber={simulationData.currentMissionIndex + 1}
                      totalMissions={simulationData.totalMissions}
                    />
                    <AIFeedback
                      feedback={
                        feedbackData.feedback[language as keyof typeof feedbackData.feedback]
                        || feedbackData.feedback.ru
                        || feedbackData.feedback.en
                      }
                      isCorrect={feedbackData.isCorrect}
                      xpEarned={feedbackData.xpEarned}
                      totalXP={feedbackData.totalXP}
                      explanation={feedbackData.explanation}
                      tips={feedbackData.tips}
                    />
                    <Button
                      onClick={handleContinueToNext}
                      size="lg"
                      className="w-full h-12 rounded-full gap-2 font-semibold shadow-[var(--shadow-button)]"
                    >
                      Следующий шаг
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* RESULTS */}
                {state === "results" && resultsData && (
                  <SimulationResults results={resultsData} onRetry={handleRetry} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
