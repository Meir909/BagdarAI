"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, AlertTriangle, BookOpen, Lightbulb } from "lucide-react";

interface AIFeedbackProps {
  feedback: string;
  isCorrect: boolean;
  xpEarned: number;
  totalXP: number;
  explanation?: string;
  tips?: string[];
}

export function AIFeedback({
  feedback,
  isCorrect,
  xpEarned,
  totalXP,
  explanation,
  tips,
}: AIFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Mentor header */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-base">
          🧠
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">AI-наставник</p>
          <p className="text-xs text-muted-foreground">Анализирует твоё решение</p>
        </div>
      </div>

      {/* Main feedback card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border-l-4 p-5 ${
          isCorrect
            ? "border-l-emerald-500 bg-emerald-500/8 border border-emerald-500/20"
            : "border-l-amber-500 bg-amber-500/8 border border-amber-500/20"
        }`}
      >
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          )}
          <div>
            <p className={`mb-1.5 text-sm font-bold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {isCorrect ? "Профессиональное решение!" : "Есть лучший подход"}
            </p>
            <p className="text-sm leading-relaxed text-foreground">{feedback}</p>
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-500">
            <BookOpen className="h-3.5 w-3.5" />
            Почему это работает
          </div>
          <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
        </motion.div>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
        >
          <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-violet-500">
            <Lightbulb className="h-3.5 w-3.5" />
            Запомни
          </div>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* XP earned */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Получено XP</p>
            <p className="text-sm font-bold text-foreground">Всего: {totalXP} XP</p>
          </div>
        </div>
        <div className="text-right">
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-3xl font-bold text-primary"
          >
            +{xpEarned}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
