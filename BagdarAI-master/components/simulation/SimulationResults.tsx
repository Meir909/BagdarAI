"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Target, RotateCw, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

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
    feedback?: { en: string; ru: string; kk: string };
  }>;
}

interface SimulationResultsProps {
  results: ResultsData;
  onRetry: () => void;
}

function ScoreCircle({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const color =
    percentage >= 80
      ? "#22c55e"
      : percentage >= 60
      ? "#3b82f6"
      : "#f59e0b";

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="-rotate-90" width="136" height="136" viewBox="0 0 136 136">
        {/* Background circle */}
        <circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <motion.circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute flex flex-col items-center"
      >
        <span className="font-heading text-3xl font-bold" style={{ color }}>
          {percentage}%
        </span>
        <span className="text-xs text-muted-foreground">результат</span>
      </motion.div>
    </div>
  );
}

const performanceLevels = [
  {
    min: 80,
    label: "Профессионал",
    desc: "Ты мыслишь как настоящий профессионал",
    color: "text-emerald-500",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    emoji: "🌟",
  },
  {
    min: 60,
    label: "На верном пути",
    desc: "Хорошие основы, есть куда расти",
    color: "text-blue-500",
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
    emoji: "👍",
  },
  {
    min: 0,
    label: "Продолжай практику",
    desc: "Ошибки — часть обучения. Попробуй снова",
    color: "text-amber-500",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
    emoji: "💪",
  },
];

export function SimulationResults({ results, onRetry }: SimulationResultsProps) {
  const perf = performanceLevels.find((p) => results.scorePercentage >= p.min) ?? performanceLevels[2];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`overflow-hidden rounded-3xl border bg-gradient-to-br ${perf.bg} ${perf.border} p-6 text-center`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-3 text-5xl"
        >
          {perf.emoji}
        </motion.div>
        <h1 className="mb-1 font-heading text-2xl font-bold">Симуляция завершена!</h1>
        <p className={`text-lg font-bold ${perf.color}`}>{perf.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{perf.desc}</p>
      </motion.div>

      {/* Score + Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:justify-around"
      >
        <ScoreCircle percentage={results.scorePercentage} />

        <div className="flex flex-row gap-6 sm:flex-col sm:gap-4">
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-primary">{results.totalScore}</p>
            <p className="text-xs text-muted-foreground">XP заработано</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-foreground">
              {results.correctAnswers}/{results.totalMissions}
            </p>
            <p className="text-xs text-muted-foreground">верных решений</p>
          </div>
        </div>
      </motion.div>

      {/* Strengths & Improvements */}
      {(results.strengths.length > 0 || results.improvements.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          {results.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-500/8 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Сильные стороны
                </h3>
              </div>
              <ul className="space-y-2">
                {results.strengths.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-100"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {results.improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-500/8 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Зоны роста
                </h3>
              </div>
              <ul className="space-y-2">
                {results.improvements.map((imp, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    {imp}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* Recommendation */}
      {results.recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"
        >
          <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="mb-1 text-sm font-semibold">Рекомендация наставника</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{results.recommendation}</p>
          </div>
        </motion.div>
      )}

      {/* Mission breakdown */}
      {results.missionResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <p className="text-sm font-semibold">Разбор по шагам</p>
          <div className="space-y-2">
            {results.missionResults.map((m, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl border p-3 ${
                  m.isCorrect
                    ? "border-emerald-200 dark:border-emerald-900 bg-emerald-500/5"
                    : "border-amber-200 dark:border-amber-900 bg-amber-500/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {m.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  )}
                  <p className="text-sm font-medium">{m.title || `Шаг ${i + 1}`}</p>
                </div>
                <span className="text-sm font-bold text-primary">+{m.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 pt-2"
      >
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 h-11 rounded-full gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Попробовать снова
        </Button>
        <Button asChild className="flex-1 h-11 rounded-full gap-2">
          <Link href="/job-simulations">
            Другие профессии
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
