"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Target, Trophy, Download, BookOpen } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ReportData {
  student: { name: string; class: string; school: string; studentCode: string };
  careerAnalysis: {
    personalitySummary: string;
    topCareers: Array<{ name: string; match: number }>;
    strengths: string[];
    skillsToDevelop: string[];
    roadmap: Array<{ step: number; title: string; description: string; timeframe: string }>;
  } | null;
  badges: Array<{ name: string; icon: string; earnedAt: string }>;
}

export default function ParentPage() {
  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <ParentDashboard />
    </ProtectedRoute>
  );
}

function ParentDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => {
        if (r.status === 403) { setNoChild(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setReport(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async () => {
    const res = await fetch("/api/reports?format=csv");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report?.student.name || "report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (noChild || !report) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Users className="h-16 w-16 text-primary/30 mx-auto mb-6" />
            <h1 className="font-heading font-bold text-2xl mb-3">
              {{ en: "No child linked", ru: "Ребёнок не привязан", kk: "Бала байланыстырылмаған" }[language]}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {{ en: "Use a student code to link your child's account. Contact their school for the student code.", ru: "Используй код ученика, чтобы привязать аккаунт ребёнка. Обратись в школу за кодом.", kk: "Баланың аккаунтын байланыстыру үшін оқушы кодын пайдаланыңыз. Код үшін мектепке хабарласыңыз." }[language]}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const topCareers = report.careerAnalysis?.topCareers || [];
  const strengths = report.careerAnalysis?.strengths || [];
  const roadmap = report.careerAnalysis?.roadmap || [];

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl">{{ en: "Child's Report", ru: "Отчёт ребёнка", kk: "Бала есебі" }[language]}</h1>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
            </div>
            <Button onClick={handleDownload} variant="outline" className="rounded-full gap-2">
              <Download className="h-4 w-4" />
              {{ en: "Download CSV", ru: "Скачать CSV", kk: "CSV жүктеу" }[language]}
            </Button>
          </div>

          {/* Student Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
            <h2 className="font-heading font-bold text-xl mb-1">{report.student.name}</h2>
            <p className="text-sm text-muted-foreground">{report.student.class} · {report.student.school}</p>
            <p className="text-xs text-muted-foreground mt-1">{{ en: "Student Code", ru: "Код ученика", kk: "Оқушы коды" }[language]}: {report.student.studentCode}</p>
          </motion.div>

          {!report.careerAnalysis ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-8 shadow-card text-center">
              <BookOpen className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {{ en: "Your child hasn't completed the career test yet.", ru: "Ваш ребёнок ещё не прошёл карьерный тест.", kk: "Балаңыз мансап тестін әлі тапсырмаған." }[language]}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Personality */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-heading font-semibold mb-3">{{ en: "Personality Summary", ru: "Резюме личности", kk: "Тұлға түйіндемесі" }[language]}</h3>
                <p className="text-sm text-muted-foreground">{report.careerAnalysis.personalitySummary}</p>
              </motion.div>

              {/* Top Careers */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-semibold">{{ en: "Top Career Matches", ru: "Лучшие профессии", kk: "Үздік мансап сәйкестіктері" }[language]}</h3>
                </div>
                <div className="space-y-3">
                  {topCareers.map((career, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-primary font-bold text-sm w-5">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{career.name}</span>
                          <span className="text-sm text-primary font-semibold">{career.match}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${career.match}%` }} transition={{ delay: 0.3 + i * 0.1 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Strengths */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-heading font-semibold mb-3">{{ en: "Key Strengths", ru: "Сильные стороны", kk: "Күшті жақтары" }[language]}</h3>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s}</span>
                  ))}
                </div>
              </motion.div>

              {/* Badges */}
              {report.badges.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-border rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-heading font-semibold">{{ en: "Earned Badges", ru: "Полученные бейджи", kk: "Алынған бейджиктер" }[language]}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {report.badges.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
                        <span>{b.icon}</span>
                        <span className="text-xs font-medium">{b.name}</span>
                      </div>
                    ))}
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
