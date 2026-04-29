"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Zap, Crown } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getLevelTitle } from "@/services/game";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  class: string | null;
  schoolName: string | null;
  xp: number;
  level: number;
  isCurrentUser: boolean;
}

type BoardType = "global" | "school" | "class";

export default function LeaderboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Leaderboard />
    </ProtectedRoute>
  );
}

function Leaderboard() {
  const { language } = useLanguage();
  const [type, setType] = useState<BoardType>("global");
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?type=${type}`)
      .then((r) => r.json())
      .then((d) => {
        setBoard(d.leaderboard || []);
        setCurrentUser(d.currentUser || null);
      })
      .finally(() => setLoading(false));
  }, [type]);

  const TABS: Array<{ key: BoardType; label: { en: string; ru: string; kk: string } }> = [
    { key: "global", label: { en: "Global",  ru: "Глобальный", kk: "Жаһандық" } },
    { key: "school", label: { en: "School",  ru: "Школа",      kk: "Мектеп"    } },
    { key: "class",  label: { en: "Class",   ru: "Класс",      kk: "Сынып"     } },
  ];

  const MEDAL = ["🥇", "🥈", "🥉"];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-heading font-bold text-3xl">
                {{ en: "Leaderboard", ru: "Лидерборд", kk: "Көшбасшылар кестесі" }[language]}
              </h1>
            </div>
          </motion.div>

          {/* Type tabs */}
          <div className="flex gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setType(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  type === tab.key
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label[language]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : board.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {{ en: "No rankings yet. Be the first to earn XP!", ru: "Рейтинга пока нет. Стань первым, кто заработает XP!", kk: "Рейтинг әлі жоқ. XP жинаған бірінші бол!" }[language]}
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {board.length >= 3 && (
                <div className="flex items-end justify-center gap-3 mb-8">
                  {[board[1], board[0], board[2]].map((entry, i) => {
                    if (!entry) return null;
                    const heights = ["h-20", "h-28", "h-16"];
                    const delays = [0.1, 0, 0.2];
                    return (
                      <motion.div
                        key={entry.userId}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: delays[i] }}
                        className="flex flex-col items-center gap-2 flex-1 max-w-[120px]"
                      >
                        <div className="text-2xl">{MEDAL[entry.rank - 1]}</div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-xs font-semibold text-center truncate w-full px-1">{entry.name}</p>
                        <div className={`w-full ${heights[i]} bg-primary/10 border-t-2 border-primary rounded-t-xl flex flex-col items-center justify-center gap-1`}>
                          <div className="flex items-center gap-1 text-primary">
                            <Zap className="h-3 w-3" />
                            <span className="text-xs font-bold">{entry.xp}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Lv.{entry.level}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Full list */}
              <div className="space-y-2">
                {board.map((entry, i) => {
                  const levelInfo = getLevelTitle(entry.level);
                  return (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        entry.isCurrentUser
                          ? "bg-primary/5 border-primary/30"
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="w-8 text-center shrink-0">
                        {entry.rank <= 3 ? (
                          <span className="text-lg">{MEDAL[entry.rank - 1]}</span>
                        ) : (
                          <span className="text-sm font-semibold text-muted-foreground">{entry.rank}</span>
                        )}
                      </div>

                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${entry.isCurrentUser ? "text-primary" : ""}`}>
                            {entry.name}
                            {entry.isCurrentUser && (
                              <span className="ml-1 text-xs font-normal text-primary/70">
                                {({ en: "you", ru: "вы", kk: "сіз" } as Record<string, string>)[language]}
                              </span>
                            )}
                          </span>
                          {entry.rank === 1 && <Crown className="h-3.5 w-3.5 text-yellow-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {levelInfo[language]} • {entry.class ? `${entry.class}` : ""}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-primary font-semibold text-sm justify-end">
                          <Zap className="h-3.5 w-3.5" />
                          <span>{entry.xp}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Lv.{entry.level}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Current user if not in top 50 */}
              {currentUser && !board.find((e) => e.isCurrentUser) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center gap-3"
                >
                  <span className="text-sm font-semibold text-muted-foreground w-8 text-center">#{currentUser.rank}</span>
                  <div className="flex-1 text-sm font-semibold text-primary">
                    {{ en: "Your rank", ru: "Ваш ранг", kk: "Сіздің рангіңіз" }[language]}
                  </div>
                  <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                    <Zap className="h-3.5 w-3.5" />
                    <span>{currentUser.xp} XP</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
