"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, GraduationCap, TrendingUp, DollarSign, Lock, ArrowRight, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["All", "IT", "Business", "Creative", "Science", "Medicine", "Engineering", "Education"];

interface Profession {
  id: string;
  name: string;
  nameRu: string;
  nameKk: string;
  category: string;
  description: string;
  descriptionRu: string;
  descriptionKk: string;
  salary: string;
  futureDemand: number;
  skills: string[];
  universities: Array<{ name: string; country: string }>;
}

export default function ProfessionsPage() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Profession | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: "24" });
    if (search) params.set("search", search);
    if (activeCategory !== "All") params.set("category", activeCategory);

    setLoading(true);
    fetch(`/api/professions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProfessions(data.professions || []);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, activeCategory, page]);

  const getName = (p: Profession) => {
    if (language === "ru") return p.nameRu || p.name;
    if (language === "kk") return p.nameKk || p.name;
    return p.name;
  };

  const getDesc = (p: Profession) => {
    if (language === "ru") return p.descriptionRu || p.description;
    if (language === "kk") return p.descriptionKk || p.description;
    return p.description;
  };

  const categoryIcons: Record<string, string> = {
    IT: "💻", Business: "💼", Creative: "🎨", Science: "🔬",
    Medicine: "⚕️", Engineering: "⚙️", Education: "📚",
  };

  const demandColor = (d: number) =>
    d >= 80 ? "text-green-500" : d >= 60 ? "text-primary" : "text-orange-500";

  const handleCardClick = (prof: Profession) => {
    if (isAuthenticated) {
      setSelected(prof);
    } else {
      setSelected(prof); // store for context
      setShowAuthGate(true);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2">
              {{ en: "Professions", ru: "Профессии", kk: "Мамандықтар" }[language]}
            </h1>
            <p className="text-muted-foreground text-sm">
              {total > 0
                ? `${total} ${{ en: "professions available", ru: "профессий доступно", kk: "мамандық қолжетімді" }[language]}`
                : ({ en: "Loading professions...", ru: "Загрузка профессий...", kk: "Мамандықтар жүктелуде..." } as Record<string, string>)[language]}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={{ en: "Search professions...", ru: "Поиск профессий...", kk: "Мамандық іздеу..." }[language]}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "All"
                  ? { en: "All", ru: "Все", kk: "Барлығы" }[language]
                  : `${categoryIcons[cat] || ""} ${cat}`}
              </button>
            ))}
          </div>

          {/* Not logged in banner */}
          {!authLoading && !isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Lock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: "Sign in to view full profession details, salary ranges and university recommendations.", ru: "Войдите, чтобы увидеть полное описание, зарплату и университеты.", kk: "Толық сипаттаманы, жалақыны және университеттерді көру үшін кіріңіз." }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0">
                <Link href="/auth">{{ en: "Sign In", ru: "Войти", kk: "Кіру" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : professions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-medium">{{ en: "No professions found.", ru: "Профессии не найдены.", kk: "Мамандықтар табылмады." }[language]}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {professions.map((prof, i) => (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                  onClick={() => handleCardClick(prof)}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer relative group"
                >
                  {/* Lock overlay for guests */}
                  {!isAuthenticated && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-muted flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{categoryIcons[prof.category] || "🏢"}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mr-7">
                      {prof.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-2">{getName(prof)}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{getDesc(prof)}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span className={`font-medium ${demandColor(prof.futureDemand)}`}>{prof.futureDemand}%</span>
                    <span>{{ en: "demand", ru: "спрос", kk: "сұраныс" }[language]}</span>
                  </div>

                  {isAuthenticated ? (
                    <>
                      <div className="text-xs font-medium text-foreground mb-2">{prof.salary}</div>
                      {prof.universities && prof.universities.length > 0 && (
                        <div className="flex items-start gap-1 text-xs text-muted-foreground">
                          <GraduationCap className="h-3 w-3 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {prof.universities.slice(0, 2).map((u) => u.name).join(", ")}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-primary/70 mt-1">
                      <Lock className="h-3 w-3" />
                      <span>{{ en: "Sign in for details", ru: "Войдите для деталей", kk: "Деталдар үшін кіріңіз" }[language]}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 24 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-muted transition-colors"
              >
                {{ en: "Previous", ru: "Назад", kk: "Артқа" }[language]}
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                {page} / {Math.ceil(total / 24)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 24)}
                className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-muted transition-colors"
              >
                {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Gate Modal */}
      <AnimatePresence>
        {showAuthGate && selected && (
          <Dialog open={showAuthGate} onOpenChange={(open) => { if (!open) setShowAuthGate(false); }}>
            <DialogContent className="max-w-sm text-center">
              <button
                onClick={() => setShowAuthGate(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="pt-2 pb-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                  {categoryIcons[selected.category] || "🏢"}
                </div>
                <DialogHeader>
                  <DialogTitle className="text-center text-lg">
                    {{ en: "Sign in to view details", ru: "Войдите для просмотра", kk: "Деталдарды көру үшін кіріңіз" }[language]}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  {{ en: `Get full details for "${getName(selected)}" — salary, required skills, and top universities.`, ru: `Получите полное описание «${getName(selected)}» — зарплата, навыки и университеты.`, kk: `«${getName(selected)}» толық сипаттамасын алыңыз — жалақы, дағдылар және университеттер.` }[language]}
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild className="rounded-full w-full" onClick={() => setShowAuthGate(false)}>
                    <Link href="/auth">
                      {{ en: "Sign In", ru: "Войти", kk: "Кіру" }[language]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full w-full" onClick={() => setShowAuthGate(false)}>
                    <Link href="/auth?tab=register">
                      {{ en: "Create Free Account", ru: "Создать аккаунт бесплатно", kk: "Тегін аккаунт жасаңыз" }[language]}
                    </Link>
                  </Button>
                  <button
                    onClick={() => setShowAuthGate(false)}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
                  >
                    {{ en: "Continue browsing", ru: "Продолжить просмотр", kk: "Шолуды жалғастыру" }[language]}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Full Detail Modal (authenticated) */}
      <Dialog open={!!selected && !showAuthGate && isAuthenticated} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && isAuthenticated && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{categoryIcons[selected.category] || "🏢"}</span>
                  <div>
                    <DialogTitle className="font-heading text-xl">{getName(selected)}</DialogTitle>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selected.category}</span>
                  </div>
                </div>
              </DialogHeader>

              <p className="text-sm text-muted-foreground leading-relaxed">{getDesc(selected)}</p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    {{ en: "Salary", ru: "Зарплата", kk: "Жалақы" }[language]}
                  </div>
                  <div className="font-semibold text-sm">{selected.salary}</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="h-3 w-3" />
                    {{ en: "Future demand", ru: "Будущий спрос", kk: "Болашақ сұраныс" }[language]}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${selected.futureDemand}%` }} />
                    </div>
                    <span className={`font-semibold text-sm ${demandColor(selected.futureDemand)}`}>
                      {selected.futureDemand}%
                    </span>
                  </div>
                </div>
              </div>

              {selected.skills && selected.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">
                    {{ en: "Required Skills", ru: "Необходимые навыки", kk: "Қажетті дағдылар" }[language]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((skill, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.universities && selected.universities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {{ en: "Top Universities", ru: "Топ университеты", kk: "Үздік университеттер" }[language]}
                  </h3>
                  <div className="space-y-2">
                    {selected.universities.map((u, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-xs text-muted-foreground">{u.country}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
