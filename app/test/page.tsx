"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import { careerQuestions } from "@/data/questions";

export default function CareerTestPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <CareerTest />
    </ProtectedRoute>
  );
}

function CareerTest() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = careerQuestions[current];
  const total = careerQuestions.length;
  const progress = ((current + 1) / total) * 100;

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleFinish = async () => {
    setSubmitting(true);

    // Build answers array for API
    const answersArray = careerQuestions.map((q) => ({
      questionId: q.id,
      questionText: q[language as Language] || q.en,
      selectedOption: q.options[answers[q.id] ?? 0]?.[language as Language] || q.options[answers[q.id] ?? 0]?.en || "",
      category: q.options[answers[q.id] ?? 0]?.category || q.category,
    }));

    try {
      const res = await fetch("/api/career-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArray, language }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store result in sessionStorage for analysis page
        if (typeof window !== "undefined") {
          sessionStorage.setItem("careerResult", JSON.stringify(data.result));
        }
        router.push("/analysis");
      } else {
        // Still navigate to analysis (it can show error or cached result)
        router.push("/analysis");
      }
    } catch {
      router.push("/analysis");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-heading font-bold text-xl">
                {{ en: "Career Test", ru: "Карьерный тест", kk: "Мансап тесті" }[language]}
              </h1>
              <span className="text-sm text-muted-foreground">
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
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-card mb-6"
            >
              <h2 className="font-heading font-semibold text-xl mb-6 leading-relaxed">
                {(question[language as Language] as string) || question.en}
              </h2>

              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[question.id] === i
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-background border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm">{(opt[language as Language] as string) || opt.en}</span>
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
                disabled={answers[question.id] === undefined}
              >
                {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                className="flex-1 rounded-full shadow-[var(--shadow-button)]"
                onClick={handleFinish}
                disabled={answers[question.id] === undefined || submitting}
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
