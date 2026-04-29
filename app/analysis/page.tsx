"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Brain, Search, User, Calculator, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

const steps = [
  { icon: Brain, label: { en: "Processing your answers...", ru: "Обрабатываем ваши ответы...", kk: "Жауаптарыңызды өңдеудеміз..." } },
  { icon: Search, label: { en: "Matching career profiles...", ru: "Подбираем карьерные профили...", kk: "Мансап профильдерін таңдауда..." } },
  { icon: User, label: { en: "Building your personality map...", ru: "Строим карту личности...", kk: "Тұлға картасын жасауда..." } },
  { icon: Calculator, label: { en: "Calculating compatibility scores...", ru: "Вычисляем баллы совместимости...", kk: "Үйлесімділік балдарын есептеуде..." } },
];

export default function AnalysisPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AIAnalysis />
    </ProtectedRoute>
  );
}

function AIAnalysis() {
  const { language } = useLanguage();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (activeStep < steps.length) {
      const timer = setTimeout(() => setActiveStep((s) => s + 1), 1800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setCompleted(true), 600);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => router.push("/dashboard"), 1200);
      return () => clearTimeout(timer);
    }
  }, [completed, router]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
          >
            <Brain className="h-12 w-12 text-primary animate-pulse" />
          </motion.div>

          <h1 className="font-heading font-bold text-2xl mb-2">
            {{ en: "AI is analyzing your results", ru: "ИИ анализирует ваши результаты", kk: "ЖИ нәтижелеріңізді талдауда" }[language]}
          </h1>
          <p className="text-muted-foreground text-sm mb-10">
            {{ en: "This usually takes a few seconds", ru: "Обычно это занимает несколько секунд", kk: "Бұл әдетте бірнеше секунд алады" }[language]}
          </p>

          <div className="space-y-4 text-left mb-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: i <= activeStep ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  i < activeStep ? "bg-primary text-primary-foreground" : i === activeStep ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {i < activeStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <step.icon className={`h-4 w-4 ${i === activeStep ? "animate-pulse" : ""}`} />
                  )}
                </div>
                <span className={`text-sm ${i <= activeStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label[language]}
                </span>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-primary/10 border border-primary/20"
              >
                <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {{ en: "Analysis complete! Redirecting...", ru: "Анализ завершён! Перенаправление...", kk: "Талдау аяқталды! Бағытталуда..." }[language]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
