"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, Users, BookOpen, BarChart3, Copy, Check, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

const COLORS = ["hsl(45,93%,58%)", "hsl(200,70%,55%)", "hsl(140,50%,50%)", "hsl(320,60%,55%)", "hsl(25,80%,55%)"];

export default function DirectorPage() {
  return (
    <ProtectedRoute allowedRoles={["director"]}>
      <DirectorDashboard />
    </ProtectedRoute>
  );
}

function DirectorDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [students, setStudents] = useState<Array<{ id: string; name: string; class: string; testCompleted: boolean; topCareer: string | null; curatorName: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const completedCount = students.filter((s) => s.testCompleted).length;
  const completionRate = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

  const interestData = [
    { name: "IT", value: 35 },
    { name: "Medicine", value: 20 },
    { name: "Business", value: 18 },
    { name: "Creative", value: 12 },
    { name: "Science", value: 15 },
  ];

  const monthlyData = [
    { month: { en: "Sep", ru: "Сен", kk: "Қыр" }[language], tests: 8 },
    { month: { en: "Oct", ru: "Окт", kk: "Қаз" }[language], tests: completedCount > 15 ? 15 : 5 },
    { month: { en: "Nov", ru: "Ноя", kk: "Қар" }[language], tests: completedCount > 25 ? 25 : completedCount },
    { month: { en: "Dec", ru: "Дек", kk: "Жел" }[language], tests: completedCount },
  ];

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
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl">{{ en: "Director Dashboard", ru: "Панель директора", kk: "Директор панелі" }[language]}</h1>
                <p className="text-sm text-muted-foreground">{user?.schoolName || user?.name}</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full gap-2" onClick={() => window.print()}>
              <Download className="h-4 w-4" />
              {{ en: "Export Report", ru: "Экспорт", kk: "Экспорт" }[language]}
            </Button>
          </div>

          {/* School Codes */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="text-xs text-muted-foreground mb-2">{{ en: "School Code", ru: "Код школы", kk: "Мектеп коды" }[language]}</div>
              <button
                onClick={() => copyCode("SCHOOL-CODE")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted font-mono text-sm hover:bg-muted/80 transition-colors"
              >
                <span>{{ en: "Contact Admin for code", ru: "Обратитесь к администратору", kk: "Кодты алу үшін администраторға хабарласыңыз" }[language]}</span>
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="text-xs text-muted-foreground mb-2">{{ en: "Statistics", ru: "Статистика", kk: "Статистика" }[language]}</div>
              <div className="text-2xl font-heading font-bold">{completionRate}%</div>
              <div className="text-xs text-muted-foreground">{{ en: "test completion rate", ru: "прохождение тестов", kk: "тест орындалуы" }[language]}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: { en: "Total Students", ru: "Всего учеников", kk: "Барлық оқушы" }, value: students.length },
              { icon: BookOpen, label: { en: "Tests Completed", ru: "Тестов пройдено", kk: "Тест тапсырылды" }, value: completedCount },
              { icon: BarChart3, label: { en: "Completion Rate", ru: "Выполнение", kk: "Орындалуы" }, value: `${completionRate}%` },
              { icon: Shield, label: { en: "Curators", ru: "Кураторов", kk: "Куратор" }, value: new Set(students.map((s) => s.curatorName).filter(Boolean)).size || 0 },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-heading font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label[language]}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Career Interests", ru: "Карьерные интересы", kk: "Мансап қызығушылықтары" }[language]}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={interestData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name}>
                      {interestData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Monthly Tests", ru: "Тесты по месяцам", kk: "Ай сайынғы тесттер" }[language]}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="tests" fill="hsl(45,93%,58%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Students by class */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-heading font-semibold">{{ en: "All Students", ru: "Все ученики", kk: "Барлық оқушылар" }[language]}</h3>
            </div>
            {students.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">{{ en: "No students found", ru: "Ученики не найдены", kk: "Оқушылар табылмады" }[language]}</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Name", ru: "Имя", kk: "Аты" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Class", ru: "Класс", kk: "Сынып" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Curator", ru: "Куратор", kk: "Куратор" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Top Career", ru: "Профессия", kk: "Мамандық" }[language]}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 20).map((s, i) => (
                    <tr key={s.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="p-4 font-medium text-sm">{s.name}</td>
                      <td className="p-4 text-sm">{s.class}</td>
                      <td className="p-4 text-sm text-muted-foreground">{s.curatorName || "—"}</td>
                      <td className="p-4 text-sm">{s.topCareer || "—"}</td>
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
