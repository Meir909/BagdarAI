"use client";

import { motion } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface Stage {
  stage: number;
  title: string;
  titleRu?: string;
  titleKk?: string;
  duration: string;
  icon?: string;
  [key: string]: any;
}

interface RoadmapTimelineProps {
  stages: Stage[];
  selectedStage: number | null;
  onStageSelect: (stageNum: number) => void;
}

export function RoadmapTimeline({ stages, selectedStage, onStageSelect }: RoadmapTimelineProps) {
  const { language } = useLanguage();

  const getStageTitle = (stage: Stage) => {
    if (language === "ru") return stage.titleRu || stage.title;
    if (language === "kk") return stage.titleKk || stage.title;
    return stage.title;
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-muted" />

      {/* Stages */}
      <div className="space-y-6">
        {stages.map((stage, idx) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onStageSelect(stage.stage)}
            className="relative pl-20 cursor-pointer group"
          >
            {/* Circle on timeline */}
            <motion.div
              animate={{
                scale: selectedStage === stage.stage ? 1.3 : 1,
                backgroundColor: selectedStage === stage.stage ? "rgb(var(--primary))" : "rgb(var(--muted))",
              }}
              className="absolute left-0 top-1 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center text-lg transition-all"
            >
              {stage.icon || "🎯"}
            </motion.div>

            {/* Card */}
            <motion.div
              animate={{
                backgroundColor:
                  selectedStage === stage.stage ? "rgb(var(--primary-foreground))" : "transparent",
                borderColor: selectedStage === stage.stage ? "rgb(var(--primary))" : "rgb(var(--border))",
              }}
              className="bg-card border rounded-2xl p-5 transition-all group-hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-heading font-semibold text-lg">{getStageTitle(stage)}</h3>
                  <p className="text-xs text-muted-foreground">{stage.duration}</p>
                </div>
                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                  {stage.stage}
                </span>
              </div>

              {/* Show details when selected */}
              {selectedStage === stage.stage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border/50 space-y-3 text-sm"
                >
                  {stage.subjects && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {stage.subjects.map((s: string) => (
                          <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {stage.skills && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {stage.skills.map((s: string) => (
                          <span key={s} className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {stage.activities && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Activities:</p>
                      <ul className="space-y-1">
                        {stage.activities.map((a: string) => (
                          <li key={a} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
