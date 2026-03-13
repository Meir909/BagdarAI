"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SimulationIntroProps {
  title: string;
  difficulty: string;
  totalMissions: number;
  onStart: () => void;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  hard: "bg-red-500/20 text-red-700 dark:text-red-400",
};

const difficultyLabels: Record<string, Record<string, string>> = {
  easy: { en: "Easy", ru: "Легко", kk: "Оңай" },
  medium: { en: "Medium", ru: "Средне", kk: "Орта" },
  hard: { en: "Hard", ru: "Сложно", kk: "Қиын" },
};

export function SimulationIntro({
  title,
  difficulty,
  totalMissions,
  onStart,
}: SimulationIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="space-y-3">
        <h1 className="font-heading font-bold text-3xl">{title}</h1>
        <p className="text-muted-foreground text-sm">
          {totalMissions} missions • Earn XP and unlock achievements
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            difficultyColors[difficulty]
          }`}
        >
          {difficultyLabels[difficulty]["en"]}
        </span>
        <span className="text-xs text-muted-foreground">⏱️ ~10 minutes</span>
        <span className="text-xs text-muted-foreground">🎯 {totalMissions * 25} XP possible</span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-3">
        <h3 className="font-semibold">How it works:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-bold text-primary">1.</span>
            <span>Read the scenario and situation</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">2.</span>
            <span>Choose your response from the options</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">3.</span>
            <span>Get feedback from an AI mentor</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary">4.</span>
            <span>Earn XP and unlock insights about your skills</span>
          </li>
        </ol>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="w-full rounded-full h-12 gap-2"
      >
        🚀 Start Simulation
      </Button>
    </motion.div>
  );
}
