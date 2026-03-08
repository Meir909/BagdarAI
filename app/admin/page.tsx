"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, School, Users, Plus, Copy, Check, BookOpen } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

interface SchoolData {
  id: string;
  name: string;
  city: string;
  schoolCode: string;
  invitationCode: string;
  directorPhone: string;
  _count: { users: number };
  users: Array<{ id: string; name: string; phone: string }>;
}

interface AuditLog {
  id: string;
  action: string;
  details: object;
  createdAt: string;
  user?: { name: string; role: string };
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDirector, setShowAddDirector] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schools" | "logs">("schools");

  const [schoolForm, setSchoolForm] = useState({ name: "", city: "", directorPhone: "" });
  const [directorForm, setDirectorForm] = useState({ name: "", phone: "", schoolId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/schools").then((r) => r.json()),
      fetch("/api/admin/audit-logs").then((r) => r.json()),
    ]).then(([schoolsData, logsData]) => {
      setSchools(schoolsData.schools || []);
      setAuditLogs(logsData.logs || []);
    }).finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateSchool = async () => {
    setSubmitting(true);
    setErrorMsg("");
    const res = await fetch("/api/admin/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schoolForm),
    });
    const data = await res.json();
    if (res.ok) {
      setSchools((prev) => [data.school, ...prev]);
      setSuccessMsg({ en: "School created successfully!", ru: "Школа успешно создана!", kk: "Мектеп сәтті жасалды!" }[language]);
      setSchoolForm({ name: "", city: "", directorPhone: "" });
      setShowAddSchool(false);
    } else {
      setErrorMsg(data.error || "Error");
    }
    setSubmitting(false);
  };

  const handleCreateDirector = async () => {
    setSubmitting(true);
    setErrorMsg("");
    const res = await fetch("/api/admin/directors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(directorForm),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccessMsg({ en: "Director registered!", ru: "Директор зарегистрирован!", kk: "Директор тіркелді!" }[language]);
      setDirectorForm({ name: "", phone: "", schoolId: "" });
      setShowAddDirector(false);
    } else {
      setErrorMsg(data.error || "Error");
    }
    setSubmitting(false);
  };

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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl">{{ en: "Admin Dashboard", ru: "Панель администратора", kk: "Администратор панелі" }[language]}</h1>
              <p className="text-sm text-muted-foreground">{user?.name}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: School, label: { en: "Schools", ru: "Школ", kk: "Мектеп" }, value: schools.length },
              { icon: Users, label: { en: "Directors", ru: "Директоров", kk: "Директор" }, value: schools.flatMap((s) => s.users).length },
              { icon: BookOpen, label: { en: "Total Users", ru: "Всего польз.", kk: "Барлық қолданушы" }, value: schools.reduce((sum, s) => sum + s._count.users, 0) },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <stat.icon className="h-5 w-5 text-primary mb-2" />
                <div className="text-2xl font-heading font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label[language]}</div>
              </motion.div>
            ))}
          </div>

          {/* Success/Error messages */}
          {successMsg && <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 text-sm">{successMsg}</div>}
          {errorMsg && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{errorMsg}</div>}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button onClick={() => { setShowAddSchool(!showAddSchool); setShowAddDirector(false); }} className="rounded-full gap-2">
              <Plus className="h-4 w-4" />
              {{ en: "Add School", ru: "Добавить школу", kk: "Мектеп қосу" }[language]}
            </Button>
            <Button variant="outline" onClick={() => { setShowAddDirector(!showAddDirector); setShowAddSchool(false); }} className="rounded-full gap-2">
              <Users className="h-4 w-4" />
              {{ en: "Add Director", ru: "Добавить директора", kk: "Директор қосу" }[language]}
            </Button>
          </div>

          {/* Add School Form */}
          {showAddSchool && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-6 bg-card border border-border rounded-2xl shadow-card">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Create New School", ru: "Создать новую школу", kk: "Жаңа мектеп жасау" }[language]}</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "School Name", ru: "Название школы", kk: "Мектеп атауы" }[language]}</label>
                  <Input value={schoolForm.name} onChange={(e) => setSchoolForm((p) => ({ ...p, name: e.target.value }))} placeholder="НИШ Астана" className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "City", ru: "Город", kk: "Қала" }[language]}</label>
                  <Input value={schoolForm.city} onChange={(e) => setSchoolForm((p) => ({ ...p, city: e.target.value }))} placeholder="Астана" className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "Director Phone (optional)", ru: "Телефон директора (необяз.)", kk: "Директор телефоны (міндетті емес)" }[language]}</label>
                  <Input value={schoolForm.directorPhone} onChange={(e) => setSchoolForm((p) => ({ ...p, directorPhone: e.target.value }))} placeholder="+77001234567" className="rounded-lg" />
                </div>
              </div>
              <Button onClick={handleCreateSchool} disabled={submitting || !schoolForm.name || !schoolForm.city} className="rounded-full">
                {submitting ? "..." : { en: "Generate Codes & Create", ru: "Сгенерировать коды и создать", kk: "Кодтар жасап, мектеп жасау" }[language]}
              </Button>
            </motion.div>
          )}

          {/* Add Director Form */}
          {showAddDirector && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-6 bg-card border border-border rounded-2xl shadow-card">
              <h3 className="font-heading font-semibold mb-4">{{ en: "Register Director", ru: "Зарегистрировать директора", kk: "Директор тіркеу" }[language]}</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "Director Name", ru: "Имя директора", kk: "Директор аты" }[language]}</label>
                  <Input value={directorForm.name} onChange={(e) => setDirectorForm((p) => ({ ...p, name: e.target.value }))} className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "Phone", ru: "Телефон", kk: "Телефон" }[language]}</label>
                  <Input value={directorForm.phone} onChange={(e) => setDirectorForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+77001234567" className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{{ en: "School", ru: "Школа", kk: "Мектеп" }[language]}</label>
                  <select value={directorForm.schoolId} onChange={(e) => setDirectorForm((p) => ({ ...p, schoolId: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">{{ en: "Select school...", ru: "Выберите школу...", kk: "Мектеп таңдаңыз..." }[language]}</option>
                    {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <Button onClick={handleCreateDirector} disabled={submitting || !directorForm.name || !directorForm.phone || !directorForm.schoolId} className="rounded-full">
                {submitting ? "..." : { en: "Register Director", ru: "Зарегистрировать", kk: "Тіркеу" }[language]}
              </Button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["schools", "logs"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {tab === "schools" ? { en: "Schools", ru: "Школы", kk: "Мектептер" }[language] : { en: "Audit Logs", ru: "Журнал аудита", kk: "Аудит журналы" }[language]}
              </button>
            ))}
          </div>

          {/* Schools Table */}
          {activeTab === "schools" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "School", ru: "Школа", kk: "Мектеп" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "City", ru: "Город", kk: "Қала" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "School Code", ru: "Код школы", kk: "Мектеп коды" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Inv. Code", ru: "Код приглаш.", kk: "Шақыру коды" }[language]}</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">{{ en: "Users", ru: "Польз.", kk: "Қолданушы" }[language]}</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, i) => (
                    <tr key={school.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="p-4">
                        <div className="font-medium text-sm">{school.name}</div>
                        {school.users[0] && <div className="text-xs text-muted-foreground">{school.users[0].name}</div>}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{school.city}</td>
                      <td className="p-4">
                        <CodeBadge code={school.schoolCode} copied={copiedCode === school.schoolCode} onCopy={() => copyCode(school.schoolCode)} />
                      </td>
                      <td className="p-4">
                        <CodeBadge code={school.invitationCode} copied={copiedCode === school.invitationCode} onCopy={() => copyCode(school.invitationCode)} />
                      </td>
                      <td className="p-4 text-sm font-medium">{school._count.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Audit Logs */}
          {activeTab === "logs" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              <div className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center gap-4">
                    <div className="text-xs text-muted-foreground w-32 shrink-0">{new Date(log.createdAt).toLocaleString()}</div>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-mono">{log.action}</span>
                    {log.user && <span className="text-xs text-muted-foreground">{log.user.name} ({log.user.role})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function CodeBadge({ code, copied, onCopy }: { code: string; copied: boolean; onCopy: () => void }) {
  return (
    <button onClick={onCopy} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors font-mono text-xs">
      <span className="truncate max-w-[140px]">{code}</span>
      {copied ? <Check className="h-3 w-3 text-green-500 shrink-0" /> : <Copy className="h-3 w-3 text-muted-foreground shrink-0" />}
    </button>
  );
}
