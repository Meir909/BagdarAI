"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "kk" | "ru" | "en";

const translations: Record<string, Record<Language, string>> = {
  "nav.home": { kk: "Басты бет", ru: "Главная", en: "Home" },
  "nav.test": { kk: "Тест", ru: "Тест", en: "Career Test" },
  "nav.professions": { kk: "Мамандықтар", ru: "Профессии", en: "Professions" },
  "nav.dashboard": { kk: "Панель", ru: "Панель", en: "Dashboard" },
  "nav.chat": { kk: "Чат", ru: "Чат", en: "AI Chat" },
  "nav.schools": { kk: "Мектептер", ru: "Школы", en: "For Schools" },
  "nav.pricing": { kk: "Тарифтер", ru: "Тарифы", en: "Pricing" },
  "hero.title": { kk: "AI көмегімен болашақ мамандығыңды тап", ru: "Найди свою будущую профессию с помощью ИИ", en: "Discover Your Future Career with AI" },
  "hero.subtitle": { kk: "300+ мамандық, жеке талдау, университет ұсыныстары", ru: "300+ профессий, персональный анализ, рекомендации университетов", en: "300+ professions, personalized analysis, university recommendations" },
  "hero.cta": { kk: "Тестті бастау", ru: "Начать тест", en: "Start Career Test" },
  "hero.schools_cta": { kk: "Мектептер үшін", ru: "Для школ", en: "For Schools" },
  "auth.choose_role": { kk: "Рөліңді таңда", ru: "Выбери свою роль", en: "Choose Your Role" },
  "auth.student": { kk: "Оқушы", ru: "Ученик", en: "Student" },
  "auth.director": { kk: "Директор", ru: "Директор", en: "Director" },
  "auth.curator": { kk: "Куратор", ru: "Куратор", en: "Curator" },
  "auth.parent": { kk: "Ата-ана", ru: "Родитель", en: "Parent" },
  "auth.login": { kk: "Кіру", ru: "Войти", en: "Login" },
  "auth.register": { kk: "Тіркелу", ru: "Зарегистрироваться", en: "Register" },
  "auth.name": { kk: "Толық аты-жөні", ru: "Полное имя", en: "Full Name" },
  "auth.email": { kk: "Электрондық пошта", ru: "Электронная почта", en: "Email" },
  "auth.password": { kk: "Құпия сөз", ru: "Пароль", en: "Password" },
  "auth.phone": { kk: "Телефон нөмірі", ru: "Номер телефона", en: "Phone Number" },
  "auth.school_code": { kk: "Мектеп коды", ru: "Код школы", en: "School Code" },
  "auth.invitation_code": { kk: "Шақыру коды", ru: "Код приглашения", en: "Invitation Code" },
  "auth.student_code": { kk: "Оқушы коды", ru: "Код ученика", en: "Student Code" },
  "auth.class": { kk: "Сынып", ru: "Класс", en: "Class" },
  "auth.continue": { kk: "Жалғастыру", ru: "Продолжить", en: "Continue" },
  "auth.back": { kk: "Артқа", ru: "Назад", en: "Back" },
  "auth.admin_login": { kk: "Мен — Администратор", ru: "Я — Администратор", en: "I am Admin" },
  "auth.error.invalid_school": { kk: "Мектеп коды қате", ru: "Неверный код школы", en: "Invalid school code" },
  "auth.error.invalid_invitation": { kk: "Шақыру коды қате", ru: "Неверный код приглашения", en: "Invalid invitation code" },
  "auth.error.phone_not_found": { kk: "Телефон табылмады", ru: "Телефон не найден", en: "Phone number not found" },
  "auth.error.email_taken": { kk: "Email тіркелген", ru: "Email уже занят", en: "Email already registered" },
  "auth.error.invalid_credentials": { kk: "Деректер қате", ru: "Неверные данные", en: "Invalid credentials" },
  "auth.error.invalid_student_code": { kk: "Оқушы коды қате", ru: "Неверный код ученика", en: "Invalid student code" },
  "test.title": { kk: "Мансап тесті", ru: "Карьерный тест", en: "Career Test" },
  "test.question": { kk: "Сұрақ", ru: "Вопрос", en: "Question" },
  "test.of": { kk: "", ru: "из", en: "of" },
  "test.next": { kk: "Келесі", ru: "Далее", en: "Next" },
  "test.prev": { kk: "Артқа", ru: "Назад", en: "Previous" },
  "test.finish": { kk: "Аяқтау", ru: "Завершить", en: "Finish" },
  "test.analyzing": { kk: "Талдау жүріп жатыр...", ru: "Анализируем...", en: "Analyzing..." },
  "dashboard.title": { kk: "Менің панелім", ru: "Мой дашборд", en: "My Dashboard" },
  "dashboard.top_careers": { kk: "Үздік мамандықтар", ru: "Лучшие карьеры", en: "Top Careers" },
  "dashboard.roadmap": { kk: "Жол картасы", ru: "Карьерный маршрут", en: "Career Roadmap" },
  "dashboard.badges": { kk: "Жетістіктер", ru: "Достижения", en: "Achievements" },
  "dashboard.take_test": { kk: "Тест тапсыру", ru: "Пройти тест", en: "Take Career Test" },
  "chat.title": { kk: "AI Кеңесші", ru: "AI Консультант", en: "AI Career Advisor" },
  "chat.placeholder": { kk: "Мансап туралы сұрақ қой...", ru: "Задай вопрос о карьере...", en: "Ask a career question..." },
  "chat.send": { kk: "Жіберу", ru: "Отправить", en: "Send" },
  "chat.limit_reached": { kk: "Тегін сұрақтар таусылды. Pro нұсқасына өту.", ru: "Бесплатные запросы исчерпаны. Переходи на Pro.", en: "Free requests exhausted. Upgrade to Pro." },
  "chat.greeting": { kk: "Сәлем! Мен BagdarAI — сенің мансап кеңесшің. Болашақ мамандығың туралы сұрақ қой!", ru: "Привет! Я BagdarAI — твой карьерный советник. Задай вопрос о будущей профессии!", en: "Hello! I'm BagdarAI — your career advisor. Ask me anything about your future career!" },
  "professions.title": { kk: "Мамандықтар", ru: "Профессии", en: "Professions" },
  "professions.search": { kk: "Іздеу...", ru: "Поиск...", en: "Search..." },
  "professions.all": { kk: "Барлығы", ru: "Все", en: "All" },
  "professions.demand": { kk: "Сұраныс", ru: "Спрос", en: "Demand" },
  "professions.salary": { kk: "Жалақы", ru: "Зарплата", en: "Salary" },
  "common.loading": { kk: "Жүктелуде...", ru: "Загрузка...", en: "Loading..." },
  "common.save": { kk: "Сақтау", ru: "Сохранить", en: "Save" },
  "common.cancel": { kk: "Болдырмау", ru: "Отменить", en: "Cancel" },
  "common.logout": { kk: "Шығу", ru: "Выйти", en: "Logout" },
  "common.download_pdf": { kk: "PDF жүктеу", ru: "Скачать PDF", en: "Download PDF" },
  "common.download_excel": { kk: "Excel жүктеу", ru: "Скачать Excel", en: "Download Excel" },
  "admin.title": { kk: "Администратор панелі", ru: "Панель администратора", en: "Admin Dashboard" },
  "admin.create_school": { kk: "Мектеп қосу", ru: "Добавить школу", en: "Add School" },
  "admin.add_director": { kk: "Директор қосу", ru: "Добавить директора", en: "Add Director" },
  "admin.schools": { kk: "Мектептер", ru: "Школы", en: "Schools" },
  "admin.audit_logs": { kk: "Аудит журналы", ru: "Журнал аудита", en: "Audit Logs" },
  "director.title": { kk: "Директор панелі", ru: "Панель директора", en: "Director Dashboard" },
  "curator.title": { kk: "Куратор панелі", ru: "Панель куратора", en: "Curator Dashboard" },
  "curator.students": { kk: "Менің оқушыларым", ru: "Мои ученики", en: "My Students" },
  "parent.title": { kk: "Ата-ана панелі", ru: "Панель родителя", en: "Parent Dashboard" },
  "pricing.title": { kk: "Тарифтер", ru: "Тарифы", en: "Pricing" },
  "pricing.free": { kk: "Тегін", ru: "Бесплатно", en: "Free" },
  "pricing.pro": { kk: "Про", ru: "Про", en: "Pro" },
  "pricing.school": { kk: "Мектеп", ru: "Школа", en: "School" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ru");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
