"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart3, Download, CheckCircle2, XCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Student {
  id: string;
  name: string;
  class: string;
  studentCode: string;
  testCompleted: boolean;
  topCareer: string | null;
  aiScore: number | null;
}

const COLORS = ["hsl(45,93%,58%)", "hsl(200,70%,55%)", "hsl(140,50%,50%)", "hsl(320,60%,55%)", "hsl(25,80%,55%)", "hsl(270,50%,55%)"];

export default function CuratorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["curator"]}>
      <CuratorDashboard />
    </ProtectedRoute>
  );
}

function CuratorDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = students.filter((s) => s.testCompleted).length;
  const completionRate = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

  const handleDownloadReport = async () => {
    const res = await fetch(`/api/reports?format=csv`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Build interest data from students
  const interestData = [
    { name: "IT", value: students.filter((s) => s.topCareer?.toLowerCase().includes("engineer") || s.topCareer?.toLowerCase().includes("developer")).length || 2 },
    { name: "Medicine", value: students.filter((s) => s.topCareer?.toLowerCase().includes("doctor") || s.topCareer?.toLowerCase().includes("nurse")).length || 1 },
    { name: "Business", value: students.filter((s) => s.topCareer?.toLowerCase().includes("manager") || s.topCareer?.toLowerCase().includes("analyst")).length || 1 },
    { name: "Other", value: Math.max(1, students.length - completedCount) },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl">{{ en: "Curator Dashboard", ru: "Панель куратора", kk: "Куратор панелі" }[language]}</h1>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" className="rounded-full gap-2">
              <Download className="h-4 w-4" />
              {{ en: "Export Report", ru: "Экспорт", kk: "Экспорт" }[language]}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: { en: "Students", ru: "Учеников", kk: "Оқушы" }, value: students.length },
              { icon: CheckCircle2, label: { en: "Tests Done", ru: "Тестов", kk: "Тест" }, value: completedCount },
              { icon: BarChart3, label: { en: "Completion", ru: "Выполнение", kk: "Орындалуы" }, value: `${completionRate}%` },
              { icon: Download, label: { en: "Reports", ru: "Отчёты", kk: "Есептер" }, value: completedCount },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-heading font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label[language]}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          {interestData.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Career Interests", ru: "Карьерные интересы", kk: "Мансап қызығушылықтары" }[language]}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={interestData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {interestData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-heading font-semibold">{{ en: "My Students", ru: "Мои ученики", kk: "Менің оқушыларым" }[language]} ({students.length})</h3>
            </div>
            {students.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                {{ en: "No students assigned yet", ru: "Ученики ещё не назначены", kk: "Оқушылар әлі тіркелмеген" }[language]}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Name", ru: "Имя", kk: "Аты" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Class", ru: "Класс", kk: "Сынып" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Test", ru: "Тест", kk: "Тест" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Top Career", ru: "Профессия", kk: "Мамандық" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Score", ru: "Балл", kk: "Балл" }[language]}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="p-4">
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.studentCode}</div>
                      </td>
                      <td className="p-4 text-sm">{s.class}</td>
                      <td className="p-4">
                        {s.testCompleted
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : <XCircle className="h-4 w-4 text-muted-foreground" />
                        }
                      </td>
                      <td className="p-4 text-sm">{s.topCareer || "—"}</td>
                      <td className="p-4">
                        {s.aiScore ? <span className="text-sm font-semibold text-primary">{s.aiScore}%</span> : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
