"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface AIFeedbackProps {
  feedback: string;
  isCorrect: boolean;
  xpEarned: number;
  totalXP: number;
}

export function AIFeedback({
  feedback,
  isCorrect,
  xpEarned,
  totalXP,
}: AIFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Feedback Card */}
      <div
        className={`border-l-4 rounded-xl p-6 ${
          isCorrect
            ? "bg-green-500/10 border-green-500 text-green-900 dark:text-green-100"
            : "bg-yellow-500/10 border-yellow-500 text-yellow-900 dark:text-yellow-100"
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <h4 className="font-semibold mb-1">
              {isCorrect ? "Excellent!" : "Good Try"}
            </h4>
            <p className="text-sm leading-relaxed">{feedback}</p>
          </div>
        </div>
      </div>

      {/* XP Earned */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold">XP Earned</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{xpEarned}</div>
            <div className="text-xs text-muted-foreground">Total: {totalXP} XP</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
