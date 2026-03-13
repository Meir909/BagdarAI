"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle, Lightbulb, Clock, Target } from "lucide-react";

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

  const handleSubmit = (optionId: string) => {
    if (!disabled && !isSubmitting) {
      setSelectedOption(optionId);
      onSubmit?.(optionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Mission Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Mission {missionNumber} of {totalMissions}</span>
            </div>
            <h2 className="font-heading font-bold text-2xl">{mission.title}</h2>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(missionNumber / totalMissions) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="w-12 h-1 bg-primary rounded-full" />
      </div>

      {/* Mission Context - Key Info */}
      {mission.context && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mission.context.goal && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-primary">Goal</div>
                  <p className="text-xs text-muted-foreground">{mission.context.goal}</p>
                </div>
              </div>
            </div>
          )}
          {mission.context.timeline && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">Timeline</div>
                  <p className="text-xs text-muted-foreground">{mission.context.timeline}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenario */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {mission.scenario}
        </p>
      </div>

      {/* Constraints */}
      {mission.context?.constraints && mission.context.constraints.length > 0 && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-4 w-4" />
            Constraints
          </div>
          <ul className="space-y-1">
            {mission.context.constraints.map((constraint, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-500" />
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stakeholders */}
      {mission.context?.stakeholders && mission.context.stakeholders.length > 0 && (
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
            <Lightbulb className="h-4 w-4" />
            Key Stakeholders
          </div>
          <div className="flex flex-wrap gap-2">
            {mission.context.stakeholders.map((stakeholder, i) => (
              <span
                key={i}
                className="text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full"
              >
                {stakeholder}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">
          What would you do?
        </h3>
        {mission.options.map((option, idx) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleSubmit(option.id)}
            disabled={disabled || isSubmitting}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            } ${disabled ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                  selectedOption === option.id
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              >
                {selectedOption === option.id && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground">{option.icon} {option.text}</p>
                  {option.difficulty && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      option.difficulty === 'easy'
                        ? 'bg-green-500/10 text-green-600'
                        : option.difficulty === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      {option.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Submit Button */}
      {!disabled && selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => handleSubmit(selectedOption)}
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-full h-12 gap-2"
          >
            {isSubmitting ? "Getting AI Feedback..." : "Submit Answer & Get Feedback"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
