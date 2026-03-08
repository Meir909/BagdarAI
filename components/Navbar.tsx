"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, Menu, X, Globe, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const langLabels: Record<Language, string> = { kk: "ҚАЗ", ru: "РУС", en: "ENG" };

const roleNavMap: Record<string, { to: string; label: Record<string, string> }[]> = {
  admin: [
    { to: "/admin", label: { en: "Admin Panel", ru: "Панель админа", kk: "Админ панелі" } },
  ],
  director: [
    { to: "/director", label: { en: "School Dashboard", ru: "Панель школы", kk: "Мектеп панелі" } },
  ],
  curator: [
    { to: "/curator-dashboard", label: { en: "My Students", ru: "Мои ученики", kk: "Менің оқушыларым" } },
  ],
  student: [
    { to: "/test", label: { en: "Test", ru: "Тест", kk: "Тест" } },
    { to: "/professions", label: { en: "Professions", ru: "Профессии", kk: "Мамандықтар" } },
    { to: "/dashboard", label: { en: "Dashboard", ru: "Панель", kk: "Панель" } },
    { to: "/chat", label: { en: "AI Chat", ru: "Чат", kk: "Чат" } },
  ],
  parent: [
    { to: "/parent", label: { en: "Child Report", ru: "Отчёт ребёнка", kk: "Бала есебі" } },
  ],
};

const publicLinks = [
  { to: "/", label: { en: "Home", ru: "Главная", kk: "Басты бет" } },
  { to: "/professions", label: { en: "Professions", ru: "Профессии", kk: "Мамандықтар" } },
  { to: "/pricing", label: { en: "Pricing", ru: "Тарифы", kk: "Тарифтер" } },
];

const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = isAuthenticated && user
    ? [
        { to: "/", label: { en: "Home", ru: "Главная", kk: "Басты бет" } },
        ...(roleNavMap[user.role] || []),
      ]
    : publicLinks;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading font-bold text-primary-foreground text-sm">B</span>
          </div>
          <span className="font-heading font-bold text-xl">BagdarAI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.to
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label[language]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {user?.name?.split(" ")[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/auth">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">{{ en: "Login", ru: "Войти", kk: "Кіру" }[language]}</span>
              </Link>
            </Button>
          )}

          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setLangOpen(!langOpen)} className="gap-1">
              <Globe className="h-4 w-4" />
              <span className="text-xs">{langLabels[language]}</span>
            </Button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                >
                  {(["kk", "ru", "en"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors ${
                        language === lang ? "bg-primary/10 font-medium" : ""
                      }`}
                    >
                      {langLabels[lang]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label[language]}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-destructive text-left"
                >
                  {{ en: "Logout", ru: "Выйти", kk: "Шығу" }[language]}
                </button>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-primary"
                >
                  {{ en: "Login / Register", ru: "Войти / Регистрация", kk: "Кіру / Тіркелу" }[language]}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
