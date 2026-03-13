"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle, Lightbulb, BookOpen } from "lucide-react";

interface FeedbackDetail {
  explanation?: string;
  tips?: string[];
  realWorldContext?: string;
  nextSteps?: string[];
}

interface AIFeedbackProps {
  feedback: string;
  isCorrect: boolean;
  xpEarned: number;
  totalXP: number;
  details?: FeedbackDetail;
}

export function AIFeedback({
  feedback,
  isCorrect,
  xpEarned,
  totalXP,
  details,
}: AIFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Feedback Card */}
      <div
        className={`border-l-4 rounded-xl p-6 ${
          isCorrect
            ? "bg-green-500/10 border-green-500"
            : "bg-yellow-500/10 border-yellow-500"
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          {isCorrect ? (
            <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
          ) : (
            <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
          )}
          <div className="flex-1">
            <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              {isCorrect ? "Excellent!" : "Good Try"}
            </h4>
            <p className="text-sm leading-relaxed text-foreground">{feedback}</p>
          </div>
        </div>
      </div>

      {/* Detailed Feedback Sections */}
      {details && (
        <>
          {/* Explanation */}
          {details.explanation && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <BookOpen className="h-4 w-4" />
                How This Works
              </div>
              <p className="text-sm text-foreground leading-relaxed">{details.explanation}</p>
            </motion.div>
          )}

          {/* Tips */}
          {details.tips && details.tips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
                <Lightbulb className="h-4 w-4" />
                Key Takeaways
              </div>
              <ul className="space-y-2">
                {details.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Real World Context */}
          {details.realWorldContext && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                🌍 Real-World Context
              </div>
              <p className="text-sm text-foreground leading-relaxed">{details.realWorldContext}</p>
            </motion.div>
          )}

          {/* Next Steps */}
          {details.nextSteps && details.nextSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                📈 Next Steps
              </div>
              <ol className="space-y-2">
                {details.nextSteps.map((step, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </>
      )}

      {/* XP Earned */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
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
