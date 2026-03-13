"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MissionOption {
  id: string;
  text: string;
}

interface MissionCardProps {
  mission: {
    id: number;
    title: string;
    scenario: string;
    options: MissionOption[];
  };
  onSubmit?: (optionId: string) => void;
  isSubmitting?: boolean;
  selectedAnswer?: string;
  disabled?: boolean;
}

export function MissionCard({
  mission,
  onSubmit,
  isSubmitting = false,
  selectedAnswer,
  disabled = false,
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
      {/* Mission Title */}
      <div className="space-y-2">
        <h2 className="font-heading font-bold text-2xl">{mission.title}</h2>
        <div className="w-12 h-1 bg-primary rounded-full" />
      </div>

      {/* Scenario */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-base leading-relaxed text-foreground">
          {mission.scenario}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">
          What would you do?
        </h3>
        {mission.options.map((option) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
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
                    : "border-border group-hover:border-primary"
                }`}
              >
                {selectedOption === option.id && (
                  <span className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{option.text}</p>
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
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
