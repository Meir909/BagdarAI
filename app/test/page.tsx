"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  riasecQuestions,
  calculateRiasecScores,
  getHollandCode,
  getSuggestedCareers,
  DIMENSION_LABELS,
  RiasecDimension,
} from "@/data/riasec-questions";

const DIMENSION_COLORS: Record<RiasecDimension, string> = {
  R: "bg-orange-500",
  I: "bg-blue-500",
  A: "bg-purple-500",
  S: "bg-green-500",
  E: "bg-red-500",
  C: "bg-yellow-500",
};

const DIMENSION_BG: Record<RiasecDimension, string> = {
  R: "bg-orange-500/10 border-orange-500/30",
  I: "bg-blue-500/10 border-blue-500/30",
  A: "bg-purple-500/10 border-purple-500/30",
  S: "bg-green-500/10 border-green-500/30",
  E: "bg-red-500/10 border-red-500/30",
  C: "bg-yellow-500/10 border-yellow-500/30",
};

const RATING_LABELS = {
  en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  ru: ["Совсем нет", "Скорее нет", "Нейтрально", "Скорее да", "Полностью да"],
  kk: ["Мүлде жоқ", "Жоқ сияқты", "Бейтарап", "Иә сияқты", "Толықтай иә"],
};

export default function CareerTestPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <CareerTest />
    </ProtectedRoute>
  );
}

function CareerTest() {
  const { language } = useLanguage();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = riasecQuestions[current];
  const total = riasecQuestions.length;
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleRate = (rating: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: rating }));
  };

  const handleFinish = async () => {
    setSubmitting(true);

    const scores = calculateRiasecScores(answers);
    const hollandCode = getHollandCode(scores);
    const suggestedCareers = getSuggestedCareers(scores);

    // Build answers array for API with RIASEC metadata
    const answersArray = riasecQuestions.map((q) => ({
      questionId: q.id,
      questionText: q[language as Language] || q.en,
      dimension: q.dimension,
      dimensionName: DIMENSION_LABELS[q.dimension][language as Language] || DIMENSION_LABELS[q.dimension].en,
      rating: answers[q.id] ?? 3,
    }));

    try {
      const res = await fetch("/api/career-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersArray,
          riasecScores: scores,
          hollandCode,
          suggestedCareers,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("careerResult", JSON.stringify(data.result));
          sessionStorage.setItem("riasecScores", JSON.stringify(scores));
          sessionStorage.setItem("hollandCode", hollandCode);
        }
        router.push("/analysis");
      } else {
        router.push("/analysis");
      }
    } catch {
      router.push("/analysis");
    }
  };

  const currentRating = answers[question.id];
  const isAnswered = currentRating !== undefined;
  const canGoNext = isAnswered && current < total - 1;
  const canFinish = isAnswered && current === total - 1;

  const labels = RATING_LABELS[language as keyof typeof RATING_LABELS] || RATING_LABELS.en;

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="font-heading font-bold text-xl">
                  {{ en: "RIASEC Career Test", ru: "RIASEC Карьерный тест", kk: "RIASEC Мансап тесті" }[language]}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {{ en: "Holland Code personality assessment", ru: "Тест личности по методу Холланда", kk: "Холланд әдісімен жеке тұлғаны бағалау" }[language]}
                </p>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {current + 1} / {total}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {/* Dimension indicator */}
            <div className="flex items-center gap-2 mt-3">
              <span className={`w-2.5 h-2.5 rounded-full ${DIMENSION_COLORS[question.dimension]}`} />
              <span className="text-xs text-muted-foreground">
                {DIMENSION_LABELS[question.dimension][language as Language] || DIMENSION_LABELS[question.dimension].en}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {{ en: "Answered", ru: "Отвечено", kk: "Жауапталды" }[language]}: {answeredCount}/{total}
              </span>
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className={`border rounded-2xl p-8 shadow-card mb-6 ${DIMENSION_BG[question.dimension]}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                {{ en: "How much do you agree?", ru: "Насколько ты согласен?", kk: "Сен қаншалықты келісесің?" }[language]}
              </p>
              <h2 className="font-heading font-semibold text-xl mb-8 leading-relaxed">
                {(question[language as Language] as string) || question.en}
              </h2>

              {/* Likert scale */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                      currentRating === rating
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-background/60 border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      currentRating === rating
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}>
                      {rating}
                    </span>
                    <span className="text-sm">{labels[rating - 1]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {{ en: "Previous", ru: "Назад", kk: "Артқа" }[language]}
            </Button>

            {current < total - 1 ? (
              <Button
                className="flex-1 rounded-full"
                onClick={() => setCurrent((c) => c + 1)}
                disabled={!isAnswered}
              >
                {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-full shadow-[var(--shadow-button)]"
                onClick={handleFinish}
                disabled={!canFinish || submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {{ en: "Analyzing...", ru: "Анализируем...", kk: "Талдауда..." }[language]}
                  </span>
                ) : (
                  ({ en: "Finish Test", ru: "Завершить тест", kk: "Тестті аяқтау" }[language])
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
