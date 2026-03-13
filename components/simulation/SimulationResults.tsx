"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Target, RotateCw } from "lucide-react";

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
  }>;
}

interface SimulationResultsProps {
  results: ResultsData;
  onRetry: () => void;
}

export function SimulationResults({
  results,
  onRetry,
}: SimulationResultsProps) {
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { label: "Outstanding", color: "text-green-600 dark:text-green-400", icon: "🌟" };
    if (percentage >= 60) return { label: "Good", color: "text-blue-600 dark:text-blue-400", icon: "👍" };
    return { label: "Keep Practicing", color: "text-yellow-600 dark:text-yellow-400", icon: "💪" };
  };

  const performance = getPerformanceLevel(results.scorePercentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl"
        >
          {performance.icon}
        </motion.div>
        <h1 className="font-heading font-bold text-3xl">Simulation Complete!</h1>
        <div className={`text-2xl font-bold ${performance.color}`}>
          {performance.label}
        </div>
      </div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{results.totalScore}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div className="text-center border-x border-primary/20">
            <div className="text-3xl font-bold text-primary">{results.correctAnswers}/{results.totalMissions}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{results.scorePercentage}%</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Overall Performance</span>
          <span className="text-primary">{results.scorePercentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${results.scorePercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
          />
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-500/10 border border-green-200 dark:border-green-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {results.strengths.map((strength, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-green-900 dark:text-green-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 mt-1.5 flex-shrink-0" />
                <span>{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {results.improvements.map((improvement, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0" />
                <span>{improvement}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {results.recommendation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mission Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <h3 className="font-semibold text-sm">Mission Results</h3>
        <div className="space-y-2">
          {results.missionResults.map((mission, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                mission.isCorrect
                  ? "bg-green-500/5 border-green-200 dark:border-green-800"
                  : "bg-yellow-500/5 border-yellow-200 dark:border-yellow-800"
              }`}
            >
              <div>
                <p className="font-medium text-sm">{mission.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${
                  mission.isCorrect ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                }`}>
                  {mission.isCorrect ? "✓ Correct" : "○ Partial"}
                </span>
                <span className="text-sm font-bold text-primary">+{mission.xpEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 pt-4"
      >
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 rounded-full h-11"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button className="flex-1 rounded-full h-11">
          Share Results
        </Button>
      </motion.div>
    </motion.div>
  );
}
