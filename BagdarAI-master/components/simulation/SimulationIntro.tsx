"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Target, Brain, Clock, ChevronRight, Star } from "lucide-react";

interface SimulationIntroProps {
  title: string;
  description?: string;
  profession?: string;
  difficulty: string;
  totalMissions: number;
  xpReward?: number;
  onStart: () => void;
}

const difficultyConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy: {
    label: "Начальный",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  medium: {
    label: "Средний",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  hard: {
    label: "Продвинутый",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

const professionIcons: Record<string, string> = {
  "UX Designer": "🎨",
  "Software Engineer": "💻",
  "Data Scientist": "📊",
  "Product Manager": "🧭",
  "Marketing Manager": "📣",
};

export function SimulationIntro({
  title,
  description,
  profession,
  difficulty,
  totalMissions,
  xpReward,
  onStart,
}: SimulationIntroProps) {
  const diff = difficultyConfig[difficulty] ?? difficultyConfig.easy;
  const icon = profession ? (professionIcons[profession] ?? "🏆") : "🏆";
  const totalXP = xpReward ?? totalMissions * 25;

  const steps = [
    { icon: Brain, label: "Читаешь ситуацию", desc: "Ты в роли профессионала" },
    { icon: Target, label: "Принимаешь решение", desc: "4 варианта на каждый шаг" },
    { icon: Zap, label: "Получаешь фидбек", desc: "AI-наставник объясняет" },
    { icon: Star, label: "Набираешь опыт", desc: "XP и итоговый анализ" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Hero block */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-primary/10 p-8 text-center"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
        </div>

        <div className="relative">
          {/* Profession icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-4xl shadow-lg"
          >
            {icon}
          </motion.div>

          {/* Profession badge */}
          {profession && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              <span>{profession}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-3 font-heading text-2xl font-bold leading-tight md:text-3xl"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground"
            >
              {description}
            </motion.p>
          )}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${diff.bg} ${diff.border} ${diff.color}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {diff.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              {totalMissions} шагов · ~{totalMissions * 2} мин
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" />
              до {totalXP} XP
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">Как это работает</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-semibold leading-snug text-foreground">{step.label}</p>
              <p className="text-xs leading-snug text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <Button
          onClick={onStart}
          size="lg"
          className="w-full h-13 rounded-full gap-2 text-base font-semibold shadow-[var(--shadow-button)]"
        >
          Начать симуляцию
          <ChevronRight className="h-5 w-5" />
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Нет правильных ответов — есть профессиональные
        </p>
      </motion.div>
    </motion.div>
  );
}
