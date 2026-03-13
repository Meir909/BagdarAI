"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, ChevronRight } from "lucide-react";
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
  difficulty: string;
  totalMissions: number;
  currentMissionIndex: number;
  mission: Mission;
}

interface FeedbackData {
  feedback: { en: string; ru: string; kk: string };
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

      if (!user?.id) {
        setLoading(false);
        return;
      }
    })();
  }, [params, user?.id]);

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
      setLoading(false);
    } catch (error) {
      console.error("Start simulation error:", error);
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMissionSubmit = async (selectedOptionId: string) => {
    if (!simulationData) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/job-simulation/${simulationId}/mission`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resultId: simulationData.resultId,
            missionId: simulationData.mission.id,
            userAnswer: selectedOptionId,
            missionIndex: simulationData.currentMissionIndex,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit mission");

      const data: FeedbackData = await res.json();
      setFeedbackData(data);

      if (data.isComplete) {
        // Fetch final results
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

  const handleRetry = async () => {
    setLoading(true);
    setSimulationData(null);
    setFeedbackData(null);
    setResultsData(null);
    setState("intro");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">
          {{
            en: "Please log in to start a simulation",
            ru: "Пожалуйста, войдите для начала симуляции",
            kk: "Симуляция бастау үшін кіріңіз",
          }[language]}
        </p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 pb-10">
        <div className="container mx-auto px-4">
          {/* Progress Bar */}
          {simulationData && state !== "results" && (
            <div className="mb-8 mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  {{
                    en: `Mission ${simulationData.currentMissionIndex + 1} of ${simulationData.totalMissions}`,
                    ru: `Миссия ${simulationData.currentMissionIndex + 1} из ${simulationData.totalMissions}`,
                    kk: `Миссия ${simulationData.currentMissionIndex + 1} / ${simulationData.totalMissions}`,
                  }[language]}
                </span>
                {feedbackData && (
                  <span className="text-sm font-semibold text-primary">
                    {feedbackData.totalXP} / {feedbackData.totalXP + (simulationData.totalMissions - simulationData.currentMissionIndex - 1) * 25} XP
                  </span>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((simulationData.currentMissionIndex + (state === "feedback" ? 1 : 0)) / simulationData.totalMissions) * 100}%`,
                  }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto"
          >
            {state === "intro" && simulationData === null && (
              <SimulationIntro
                title={simulationId}
                difficulty="easy"
                totalMissions={3}
                onStart={handleStart}
              />
            )}

            {state === "mission" && simulationData && (
              <MissionCard
                mission={simulationData.mission}
                onSubmit={handleMissionSubmit}
                isSubmitting={submitting}
              />
            )}

            {state === "feedback" && feedbackData && simulationData && (
              <div className="space-y-6">
                <MissionCard
                  mission={simulationData.mission}
                  selectedAnswer={Object.keys(simulationData.mission.options)[0]}
                  disabled
                />
                <AIFeedback
                  feedback={feedbackData.feedback[language as keyof typeof feedbackData.feedback]}
                  isCorrect={feedbackData.isCorrect}
                  xpEarned={feedbackData.xpEarned}
                  totalXP={feedbackData.totalXP}
                />
                <Button
                  onClick={handleContinueToNext}
                  size="lg"
                  className="w-full rounded-full h-12 gap-2"
                >
                  {{
                    en: "Continue to Next Mission",
                    ru: "Перейти к следующей миссии",
                    kk: "Келесі миссияға өту",
                  }[language]}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {state === "results" && resultsData && (
              <SimulationResults
                results={resultsData}
                onRetry={handleRetry}
              />
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
