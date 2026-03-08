"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Users, BookOpen, UserCheck, ArrowLeft, Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const roleConfig = [
  { role: "student" as UserRole, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10", label: { en: "Student", ru: "Ученик", kk: "Оқушы" }, desc: { en: "Enter your career journey", ru: "Начни карьерный путь", kk: "Мансап жолыңды баста" } },
  { role: "director" as UserRole, icon: Shield, color: "text-primary", bg: "bg-primary/10", label: { en: "Director", ru: "Директор", kk: "Директор" }, desc: { en: "School management", ru: "Управление школой", kk: "Мектепті басқару" } },
  { role: "curator" as UserRole, icon: Users, color: "text-green-500", bg: "bg-green-500/10", label: { en: "Curator", ru: "Куратор", kk: "Куратор" }, desc: { en: "Student supervision", ru: "Надзор за учениками", kk: "Оқушыларды бақылау" } },
  { role: "parent" as UserRole, icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10", label: { en: "Parent", ru: "Родитель", kk: "Ата-ана" }, desc: { en: "Monitor your child", ru: "Следи за ребёнком", kk: "Баланы бақыла" } },
];

const redirectMap: Record<string, string> = {
  admin: "/admin",
  director: "/director",
  curator: "/curator-dashboard",
  student: "/dashboard",
  parent: "/parent",
};

const errorMap: Record<string, Record<string, string>> = {
  invalid_school_code: { en: "Invalid school code", ru: "Неверный код школы", kk: "Мектеп коды қате" },
  invalid_invitation_code: { en: "Invalid invitation code", ru: "Неверный код приглашения", kk: "Шақыру коды қате" },
  phone_not_found: { en: "Phone number not found", ru: "Телефон не найден", kk: "Телефон табылмады" },
  invalid_student_code: { en: "Invalid student code", ru: "Неверный код ученика", kk: "Оқушы коды қате" },
  "Email already registered": { en: "Email already registered", ru: "Email уже зарегистрирован", kk: "Email тіркелген" },
  "Invalid credentials": { en: "Invalid credentials", ru: "Неверные данные", kk: "Деректер қате" },
};

export default function AuthPage() {
  const { language } = useLanguage();
  const { login, register } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | "admin" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    let result: { success: boolean; error?: string };

    if (selectedRole === "admin") {
      result = await login("admin", form);
    } else if (selectedRole === "director") {
      result = await login("director", form);
    } else if (selectedRole === "curator") {
      // Curator registers
      result = await register("curator", form);
    } else if (selectedRole === "student") {
      result = await register("student", form);
    } else if (selectedRole === "parent") {
      // Try login first, if user doesn't exist register
      result = await register("parent", form);
    } else {
      result = { success: false, error: "Unknown role" };
    }

    setLoading(false);

    if (result.success) {
      const role = selectedRole as string;
      router.push(redirectMap[role] || "/");
    } else {
      const errKey = result.error || "";
      const translated = errorMap[errKey]?.[language] || errKey;
      setError(translated);
    }
  };

  if (!selectedRole) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="container max-w-2xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h1 className="text-3xl font-heading font-bold mb-2">
                {{ en: "Choose Your Role", ru: "Выбери свою роль", kk: "Рөліңді таңда" }[language]}
              </h1>
              <p className="text-muted-foreground text-sm">
                {{ en: "Select how you use BagdarAI", ru: "Выбери, как ты используешь BagdarAI", kk: "BagdarAI-ды қалай қолданатыныңды таңда" }[language]}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {roleConfig.map((rc, i) => (
                <motion.button
                  key={rc.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  onClick={() => setSelectedRole(rc.role)}
                  className="p-6 rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${rc.bg} flex items-center justify-center mb-4`}>
                    <rc.icon className={`h-6 w-6 ${rc.color}`} />
                  </div>
                  <h3 className="font-heading font-semibold mb-1">{rc.label[language]}</h3>
                  <p className="text-xs text-muted-foreground">{rc.desc[language]}</p>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedRole("admin")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                {{ en: "I am Admin", ru: "Я — Администратор", kk: "Мен — Администратор" }[language]}
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const roleInfo = roleConfig.find((r) => r.role === selectedRole);

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <button onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {{ en: "Back", ru: "Назад", kk: "Артқа" }[language]}
            </button>

            <div className="flex items-center gap-3 mb-6">
              {roleInfo && (
                <div className={`w-10 h-10 rounded-xl ${roleInfo.bg} flex items-center justify-center`}>
                  <roleInfo.icon className={`h-5 w-5 ${roleInfo.color}`} />
                </div>
              )}
              <div>
                <h2 className="font-heading font-bold text-lg">{roleInfo?.label[language]}</h2>
                <p className="text-xs text-muted-foreground">{roleInfo?.desc[language]}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedRole === "admin" && (
                <>
                  <Field label={{ en: "Email", ru: "Email", kk: "Email" }[language]} value={form.email || ""} onChange={(v) => handleFieldChange("email", v)} type="email" />
                  <Field label={{ en: "Password", ru: "Пароль", kk: "Құпия сөз" }[language]} value={form.password || ""} onChange={(v) => handleFieldChange("password", v)} type="password" />
                </>
              )}
              {selectedRole === "director" && (
                <>
                  <Field label={{ en: "Phone Number", ru: "Номер телефона", kk: "Телефон нөмірі" }[language]} value={form.phone || ""} onChange={(v) => handleFieldChange("phone", v)} placeholder="+77001234567" />
                  <Field label={{ en: "School Code", ru: "Код школы", kk: "Мектеп коды" }[language]} value={form.schoolCode || ""} onChange={(v) => handleFieldChange("schoolCode", v)} placeholder="SCHOOL-2024-ASTANA" />
                  <Field label={{ en: "Invitation Code", ru: "Код приглашения", kk: "Шақыру коды" }[language]} value={form.invitationCode || ""} onChange={(v) => handleFieldChange("invitationCode", v)} placeholder="INV-NIS-001" />
                </>
              )}
              {selectedRole === "curator" && (
                <>
                  <Field label={{ en: "Full Name", ru: "Полное имя", kk: "Толық атыңыз" }[language]} value={form.name || ""} onChange={(v) => handleFieldChange("name", v)} />
                  <Field label={{ en: "Email", ru: "Email", kk: "Email" }[language]} value={form.email || ""} onChange={(v) => handleFieldChange("email", v)} type="email" />
                  <Field label={{ en: "Password", ru: "Пароль", kk: "Құпия сөз" }[language]} value={form.password || ""} onChange={(v) => handleFieldChange("password", v)} type="password" />
                  <Field label={{ en: "Invitation Code", ru: "Код приглашения", kk: "Шақыру коды" }[language]} value={form.invitationCode || ""} onChange={(v) => handleFieldChange("invitationCode", v)} placeholder="INV-NIS-001" />
                </>
              )}
              {selectedRole === "student" && (
                <>
                  <Field label={{ en: "Full Name", ru: "Полное имя", kk: "Толық атыңыз" }[language]} value={form.name || ""} onChange={(v) => handleFieldChange("name", v)} />
                  <Field label={{ en: "Class (e.g. 10A)", ru: "Класс (напр. 10A)", kk: "Сынып (мыс. 10A)" }[language]} value={form.studentClass || ""} onChange={(v) => handleFieldChange("studentClass", v)} placeholder="10A" />
                  <Field label={{ en: "School Code", ru: "Код школы", kk: "Мектеп коды" }[language]} value={form.schoolCode || ""} onChange={(v) => handleFieldChange("schoolCode", v)} placeholder="SCHOOL-2024-ASTANA" />
                </>
              )}
              {selectedRole === "parent" && (
                <>
                  <Field label={{ en: "Full Name", ru: "Полное имя", kk: "Толық атыңыз" }[language]} value={form.name || ""} onChange={(v) => handleFieldChange("name", v)} />
                  <Field label={{ en: "Email", ru: "Email", kk: "Email" }[language]} value={form.email || ""} onChange={(v) => handleFieldChange("email", v)} type="email" />
                  <Field label={{ en: "Password", ru: "Пароль", kk: "Құпия сөз" }[language]} value={form.password || ""} onChange={(v) => handleFieldChange("password", v)} type="password" />
                  <Field label={{ en: "Student Code (optional)", ru: "Код ученика (необяз.)", kk: "Оқушы коды (міндетті емес)" }[language]} value={form.studentCode || ""} onChange={(v) => handleFieldChange("studentCode", v)} placeholder="STU-00001" />
                </>
              )}
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-destructive text-center">
                {error}
              </motion.p>
            )}

            <Button className="w-full mt-6 rounded-full" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {{ en: "Loading...", ru: "Загрузка...", kk: "Жүктелуде..." }[language]}
                </span>
              ) : (
                ({ en: "Continue", ru: "Продолжить", kk: "Жалғастыру" }[language])
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg"
      />
    </div>
  );
}
