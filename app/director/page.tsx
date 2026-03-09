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

const COLORS = ["hsl(45,93%,58%)", "hsl(200,70%,55%)", "hsl(140,50%,50%)", "hsl(320,60%,55%)", "hsl(25,80%,55%)", "hsl(270,60%,55%)", "hsl(160,50%,45%)", "hsl(10,75%,55%)"];

const CATEGORY_LABELS: Record<string, { en: string; ru: string; kk: string }> = {
  IT:          { en: "IT",          ru: "IT",          kk: "IT" },
  Business:    { en: "Business",    ru: "Бизнес",      kk: "Бизнес" },
  Creative:    { en: "Creative",    ru: "Творчество",  kk: "Шығармашылық" },
  Science:     { en: "Science",     ru: "Наука",       kk: "Ғылым" },
  Medicine:    { en: "Medicine",    ru: "Медицина",    kk: "Медицина" },
  Engineering: { en: "Engineering", ru: "Инженерия",   kk: "Инженерия" },
  Education:   { en: "Education",   ru: "Образование", kk: "Білім" },
};

interface Student {
  id: string;
  name: string;
  class: string;
  testCompleted: boolean;
  topCareer: string | null;
  curatorName: string | null;
  createdAt: string;
}

interface SchoolInfo {
  name: string;
  city: string;
  schoolCode: string;
  invitationCode: string;
}

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
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/director/school").then((r) => r.json()),
    ]).then(([studentsData, schoolData]) => {
      setStudents(studentsData.students || []);
      setSchool(schoolData.school || null);
    }).finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const completedStudents = students.filter((s) => s.testCompleted);
  const completedCount = completedStudents.length;
  const completionRate = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

  // Real interest data: count career categories from top careers
  const categoryCounts: Record<string, number> = {};
  for (const s of completedStudents) {
    if (!s.topCareer) continue;
    const career = s.topCareer.toLowerCase();
    let matched = false;
    for (const cat of Object.keys(CATEGORY_LABELS)) {
      const keywords: Record<string, string[]> = {
        IT: ["software", "developer", "data", "cybersecurity", "ai", "cloud", "devops", "game", "blockchain", "web", "mobile", "engineer", "programmer", "tech"],
        Business: ["business", "finance", "marketing", "manager", "entrepreneur", "analyst", "accountant", "sales", "investment", "hr"],
        Creative: ["designer", "artist", "animator", "content", "architect", "photographer", "film", "music", "writer", "fashion", "interior"],
        Science: ["scientist", "physicist", "chemist", "biologist", "mathematician", "environmental", "geologist", "astronomer", "biotechnologist"],
        Medicine: ["doctor", "surgeon", "pharmacist", "dentist", "nurse", "psychiatrist", "psychologist", "medical", "physiotherapist"],
        Engineering: ["civil", "mechanical", "electrical", "aerospace", "chemical", "petroleum", "robotics", "biomedical", "mining"],
        Education: ["teacher", "professor", "educator", "psychologist", "principal", "e-learning"],
      };
      if (keywords[cat]?.some((kw) => career.includes(kw))) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        matched = true;
        break;
      }
    }
    if (!matched) {
      categoryCounts["Other"] = (categoryCounts["Other"] || 0) + 1;
    }
  }

  const interestData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name: CATEGORY_LABELS[name]?.[language] || name,
      value,
    }));

  // Real monthly data: group students by registration month (last 6 months)
  const now = new Date();
  const monthlyMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyMap[key] = 0;
  }
  for (const s of completedStudents) {
    const d = new Date(s.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in monthlyMap) monthlyMap[key]++;
  }

  const MONTH_NAMES: Record<number, { en: string; ru: string; kk: string }> = {
    0: { en: "Jan", ru: "Янв", kk: "Қаң" },
    1: { en: "Feb", ru: "Фев", kk: "Ақп" },
    2: { en: "Mar", ru: "Мар", kk: "Нау" },
    3: { en: "Apr", ru: "Апр", kk: "Сәу" },
    4: { en: "May", ru: "Май", kk: "Мам" },
    5: { en: "Jun", ru: "Июн", kk: "Мау" },
    6: { en: "Jul", ru: "Июл", kk: "Шіл" },
    7: { en: "Aug", ru: "Авг", kk: "Там" },
    8: { en: "Sep", ru: "Сен", kk: "Қыр" },
    9: { en: "Oct", ru: "Окт", kk: "Қаз" },
    10: { en: "Nov", ru: "Ноя", kk: "Қар" },
    11: { en: "Dec", ru: "Дек", kk: "Жел" },
  };

  const monthlyData = Object.entries(monthlyMap).map(([key, tests]) => {
    const month = parseInt(key.split("-")[1]);
    return { month: MONTH_NAMES[month][language], tests };
  });

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
                <p className="text-sm text-muted-foreground">{school?.name || user?.schoolName || user?.name}</p>
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
              <div className="text-xs text-muted-foreground mb-3">{{ en: "School Access Codes", ru: "Коды доступа к школе", kk: "Мектеп кіру кодтары" }[language]}</div>
              {school ? (
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{{ en: "School Code", ru: "Код школы", kk: "Мектеп коды" }[language]}</div>
                    <button
                      onClick={() => copyCode(school.schoolCode)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted font-mono text-sm hover:bg-muted/80 transition-colors w-full text-left"
                    >
                      <span className="flex-1">{school.schoolCode}</span>
                      {copiedCode === school.schoolCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{{ en: "Invitation Code", ru: "Код приглашения", kk: "Шақыру коды" }[language]}</div>
                    <button
                      onClick={() => copyCode(school.invitationCode)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted font-mono text-sm hover:bg-muted/80 transition-colors w-full text-left"
                    >
                      <span className="flex-1">{school.invitationCode}</span>
                      {copiedCode === school.invitationCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{{ en: "Contact admin to get school codes", ru: "Обратитесь к администратору", kk: "Кодтар үшін администраторға хабарласыңыз" }[language]}</p>
              )}
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="text-xs text-muted-foreground mb-2">{{ en: "Test Completion", ru: "Прохождение тестов", kk: "Тест орындалуы" }[language]}</div>
              <div className="text-3xl font-heading font-bold">{completionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">{completedCount} {{ en: "of", ru: "из", kk: "/" }[language]} {students.length} {{ en: "students tested", ru: "учеников прошли", kk: "оқушы тапсырды" }[language]}</div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              {interestData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                  {{ en: "No test results yet", ru: "Результатов тестов ещё нет", kk: "Тест нәтижелері жоқ" }[language]}
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={interestData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false}>
                        {interestData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v} ${language === "ru" ? "уч." : language === "kk" ? "оқ." : "st."}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Tests by Month", ru: "Тесты по месяцам", kk: "Ай сайынғы тесттер" }[language]}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="tests" fill="hsl(45,93%,58%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-semibold">{{ en: "All Students", ru: "Все ученики", kk: "Барлық оқушылар" }[language]}</h3>
              <span className="text-xs text-muted-foreground">{students.length} {{ en: "total", ru: "всего", kk: "барлығы" }[language]}</span>
            </div>
            {students.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">{{ en: "No students found", ru: "Ученики не найдены", kk: "Оқушылар табылмады" }[language]}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Name", ru: "Имя", kk: "Аты" }[language]}</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Class", ru: "Класс", kk: "Сынып" }[language]}</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Curator", ru: "Куратор", kk: "Куратор" }[language]}</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Top Career", ru: "Профессия", kk: "Мамандық" }[language]}</th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Status", ru: "Статус", kk: "Күй" }[language]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 50).map((s, i) => (
                      <tr key={s.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="p-4 font-medium text-sm">{s.name}</td>
                        <td className="p-4 text-sm">{s.class || "—"}</td>
                        <td className="p-4 text-sm text-muted-foreground">{s.curatorName || "—"}</td>
                        <td className="p-4 text-sm">{s.topCareer || "—"}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.testCompleted ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                            {s.testCompleted
                              ? { en: "Done", ru: "Готово", kk: "Дайын" }[language]
                              : { en: "Pending", ru: "Не пройден", kk: "Өтілмеген" }[language]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
