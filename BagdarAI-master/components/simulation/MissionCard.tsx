"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle, Lightbulb, Clock, Target, CheckCircle2 } from "lucide-react";

interface MissionOption {
  id: string;
  text: string;
  icon?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface MissionContext {
  timeline?: string;
  stakeholders?: string[];
  constraints?: string[];
  goal?: string;
}

interface MissionCardProps {
  mission: {
    id: number;
    title: string;
    scenario: string;
    context?: MissionContext;
    options: MissionOption[];
  };
  onSubmit?: (optionId: string) => void;
  isSubmitting?: boolean;
  selectedAnswer?: string;
  disabled?: boolean;
  missionNumber?: number;
  totalMissions?: number;
}

const optionLetters = ["A", "B", "C", "D"];

export function MissionCard({
  mission,
  onSubmit,
  isSubmitting = false,
  selectedAnswer,
  disabled = false,
  missionNumber = 1,
  totalMissions = 3,
}: MissionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedAnswer || null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelect = (optionId: string) => {
    if (!disabled && !isSubmitting) {
      setSelectedOption(optionId);
      setIsConfirming(true);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && onSubmit) {
      onSubmit(selectedOption);
    }
  };

  const handleChangeChoice = () => {
    setIsConfirming(false);
    setSelectedOption(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5"
    >
      {/* Mission Header */}
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Target className="h-3.5 w-3.5 text-primary" />
          <span>Шаг {missionNumber} из {totalMissions}</span>
        </div>
        <h2 className="font-heading text-xl font-bold leading-tight text-foreground md:text-2xl">
          {mission.title}
        </h2>
      </div>

      {/* Context Info */}
      {mission.context && (mission.context.goal || mission.context.timeline) && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {mission.context.goal && (
            <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3">
              <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-primary">Цель</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{mission.context.goal}</p>
              </div>
            </div>
          )}
          {mission.context.timeline && (
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <div>
                <p className="text-xs font-semibold text-blue-500">Время</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{mission.context.timeline}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenario */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground md:text-base">
          {mission.scenario}
        </p>
      </div>

      {/* Constraints */}
      {mission.context?.constraints && mission.context.constraints.length > 0 && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-orange-500">
            <AlertCircle className="h-3.5 w-3.5" />
            Ограничения
          </div>
          <ul className="space-y-1.5">
            {mission.context.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-orange-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stakeholders */}
      {mission.context?.stakeholders && mission.context.stakeholders.length > 0 && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-500">
            <Lightbulb className="h-3.5 w-3.5" />
            Стейкхолдеры
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mission.context.stakeholders.map((s, i) => (
              <span key={i} className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-500">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question */}
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Что ты сделаешь?</p>
        <div className="space-y-2.5">
          {mission.options.map((option, idx) => {
            const letter = optionLetters[idx] ?? String(idx + 1);
            const isSelected = selectedOption === option.id;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => handleSelect(option.id)}
                disabled={disabled || isSubmitting}
                className={`group w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/8 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/3"
                } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {/* Letter badge */}
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="h-4 w-4" /> : letter}
                  </div>

                  {/* Text */}
                  <p className={`flex-1 text-sm font-medium leading-snug transition-colors duration-200 ${
                    isSelected ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                  }`}>
                    {option.text}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Submit area */}
      <AnimatePresence>
        {isConfirming && selectedOption && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="space-y-2"
          >
            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full gap-2 font-semibold shadow-[var(--shadow-button)]"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  AI анализирует...
                </>
              ) : (
                "Подтвердить выбор"
              )}
            </Button>
            {!isSubmitting && (
              <button
                onClick={handleChangeChoice}
                className="w-full cursor-pointer text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Изменить ответ
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
