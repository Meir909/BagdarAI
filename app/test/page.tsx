"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CheckCircle2, Brain, Calculator } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  riasecQuestions,
  calculateRiasecScores,
  getHollandCode,
  getSuggestedCareers,
  DIMENSION_LABELS,
  RiasecDimension,
} from "@/data/riasec-questions";
import {
  mbtiQuestions,
  calculateMbtiScores,
  getMbtiType,
  MBTI_DESCRIPTIONS,
  DICHOTOMY_LABELS,
  DICHOTOMY_COLORS,
  DICHOTOMY_BG,
  MbtiDichotomy,
} from "@/data/mbti-questions";
import {
  aptitudeQuestions,
  calculateAptitudeScores,
  getAptitudeStrengths,
  APTITUDE_LABELS,
} from "@/data/aptitude-questions";

const DIMENSION_COLORS: Record<RiasecDimension, string> = {
  R: "bg-orange-500", I: "bg-blue-500", A: "bg-purple-500",
  S: "bg-green-500", E: "bg-red-500", C: "bg-yellow-500",
};

const DIMENSION_BG: Record<RiasecDimension, string> = {
  R: "bg-orange-500/10 border-orange-500/30", I: "bg-blue-500/10 border-blue-500/30",
  A: "bg-purple-500/10 border-purple-500/30", S: "bg-green-500/10 border-green-500/30",
  E: "bg-red-500/10 border-red-500/30", C: "bg-yellow-500/10 border-yellow-500/30",
};

const RATING_LABELS = {
  en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  ru: ["Совсем нет", "Скорее нет", "Нейтрально", "Скорее да", "Полностью да"],
  kk: ["Мүлде жоқ", "Жоқ сияқты", "Бейтарап", "Иә сияқты", "Толықтай иә"],
};

export default function CareerTestPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <MultiTestContainer />
      </Suspense>
    </ProtectedRoute>
  );
}

function MultiTestContainer() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") || "";
  const initialTab = (["riasec", "mbti", "aptitude"].includes(rawTab) ? rawTab : "riasec") as "riasec" | "mbti" | "aptitude";
  const [activeTab, setActiveTab] = useState<"riasec" | "mbti" | "aptitude">(initialTab);
  const [riasecDone, setRiasecDone] = useState(() => typeof window !== "undefined" && !!sessionStorage.getItem("careerResult"));
  const [mbtiDone, setMbtiDone] = useState(() => typeof window !== "undefined" && !!sessionStorage.getItem("mbtiResult"));
  const [aptitudeDone, setAptitudeDone] = useState(() => typeof window !== "undefined" && !!sessionStorage.getItem("aptitudeResult"));

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container max-w-2xl mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold mb-2">
              {{ en: "Career Assessments", ru: "Карьерные тесты", kk: "Мансап тесттері" }[language]}
            </h1>
            <p className="text-sm text-muted-foreground">
              {{ en: "Complete all 3 tests to get a full career profile", ru: "Пройди все 3 теста для полного карьерного профиля", kk: "Толық мансап профилі үшін 3 тестті де өт" }[language]}
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "riasec" | "mbti" | "aptitude")}>
            <TabsList className="w-full mb-8 grid grid-cols-3">
              <TabsTrigger value="riasec">
                <span className="flex items-center gap-1.5">
                  {riasecDone && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  RIASEC
                </span>
              </TabsTrigger>
              <TabsTrigger value="mbti">
                <span className="flex items-center gap-1.5">
                  {mbtiDone && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  MBTI
                </span>
              </TabsTrigger>
              <TabsTrigger value="aptitude">
                <span className="flex items-center gap-1.5">
                  {aptitudeDone && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  {{ en: "Aptitude", ru: "Способности", kk: "Қабілет" }[language]}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="riasec">
              <RiasecTestRunner language={language} onComplete={() => setRiasecDone(true)} />
            </TabsContent>
            <TabsContent value="mbti">
              <MbtiTestRunner language={language} onComplete={() => setMbtiDone(true)} />
            </TabsContent>
            <TabsContent value="aptitude">
              <AptitudeTestRunner language={language} onComplete={() => setAptitudeDone(true)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}

// ─── RIASEC ──────────────────────────────────────────────────────────────────

function RiasecTestRunner({ language, onComplete }: { language: Language; onComplete: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const question = riasecQuestions[current];
  const total = riasecQuestions.length;
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleFinish = async () => {
    setSubmitting(true);
    const scores = calculateRiasecScores(answers);
    const hollandCode = getHollandCode(scores);
    const suggestedCareers = getSuggestedCareers(scores);
    const answersArray = riasecQuestions.map((q) => ({
      questionId: q.id,
      questionText: q[language as Language] || q.en,
      dimension: q.dimension,
      dimensionName: DIMENSION_LABELS[q.dimension][language as Language] || DIMENSION_LABELS[q.dimension].en,
      rating: answers[q.id] ?? 3,
    }));
    try {
      const res = await fetch("/api/career-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArray, riasecScores: scores, hollandCode, suggestedCareers, language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("careerResult", JSON.stringify(data.result));
          sessionStorage.setItem("riasecScores", JSON.stringify(scores));
          sessionStorage.setItem("hollandCode", hollandCode);
        }
        onComplete();
        router.push("/analysis");
      } else {
        router.push("/analysis");
      }
    } catch {
      router.push("/analysis");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{{ en: "Question", ru: "Вопрос", kk: "Сұрақ" }[language]} {current + 1}/{total}</span>
          <span>{answeredCount}/{total} {{ en: "answered", ru: "отвечено", kk: "жауапталды" }[language]}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${DIMENSION_BG[question.dimension]}`}>
            <div className={`w-2 h-2 rounded-full ${DIMENSION_COLORS[question.dimension]}`} />
            {DIMENSION_LABELS[question.dimension][language as Language] || DIMENSION_LABELS[question.dimension].en}
          </div>
          <p className="text-base font-medium leading-relaxed mb-6">{question[language as Language] || question.en}</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: rating }))} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${answers[question.id] === rating ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}>
                <span className="text-lg font-bold">{rating}</span>
                <span className="text-[10px] text-center leading-tight text-muted-foreground">{RATING_LABELS[language as keyof typeof RATING_LABELS]?.[rating - 1]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0} className="rounded-full gap-2">
          <ChevronLeft className="h-4 w-4" />
          {{ en: "Previous", ru: "Назад", kk: "Артқа" }[language]}
        </Button>
        {current < total - 1 ? (
          <Button onClick={() => setCurrent((p) => p + 1)} disabled={!answers[question.id]} className="rounded-full gap-2">
            {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={answeredCount < total || submitting} className="rounded-full gap-2 bg-green-600 hover:bg-green-700">
            {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {{ en: "Finish Test", ru: "Завершить тест", kk: "Тестті аяқтау" }[language]}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── MBTI ─────────────────────────────────────────────────────────────────────

function MbtiTestRunner({ language, onComplete }: { language: Language; onComplete: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ type: string; scores: ReturnType<typeof calculateMbtiScores> } | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("mbtiResult");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const question = mbtiQuestions[current];
  const total = mbtiQuestions.length;
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleFinish = () => {
    const scores = calculateMbtiScores(answers);
    const type = getMbtiType(scores);
    const res = { type, scores };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mbtiResult", JSON.stringify(res));
    }
    setResult(res);
    onComplete();
  };

  if (result) {
    const desc = MBTI_DESCRIPTIONS[result.type];
    const dichotomies: { d: MbtiDichotomy; a: "E" | "S" | "T" | "J"; b: "I" | "N" | "F" | "P" }[] = [
      { d: "EI", a: "E", b: "I" }, { d: "SN", a: "S", b: "N" },
      { d: "TF", a: "T", b: "F" }, { d: "JP", a: "J", b: "P" },
    ];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-3xl font-heading font-bold text-primary">{result.type}</span>
          </div>
          <p className="font-semibold text-lg mb-1">{desc?.nickname || result.type}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc?.[language as Language] || desc?.en}</p>
        </div>
        <div className="space-y-3 mb-6">
          {dichotomies.map(({ d, a, b }) => {
            const scoreA = result.scores[a];
            const scoreB = result.scores[b];
            const tot = scoreA + scoreB;
            const pctA = tot > 0 ? Math.round((scoreA / tot) * 100) : 50;
            return (
              <div key={d}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-medium">{DICHOTOMY_LABELS[d][language as Language]}</span>
                  <span>{a} {pctA}% / {b} {100 - pctA}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${DICHOTOMY_COLORS[d]} rounded-full transition-all`} style={{ width: `${pctA}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); setCurrent(0); }} className="rounded-full flex-1">
            {{ en: "Retake", ru: "Пройти снова", kk: "Қайта өту" }[language]}
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="rounded-full flex-1">
            {{ en: "Go to Dashboard", ru: "В личный кабинет", kk: "Кабинетке өту" }[language]}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{{ en: "Question", ru: "Вопрос", kk: "Сұрақ" }[language]} {current + 1}/{total}</span>
          <span>{answeredCount}/{total} {{ en: "answered", ru: "отвечено", kk: "жауапталды" }[language]}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${DICHOTOMY_BG[question.dichotomy]}`}>
            <div className={`w-2 h-2 rounded-full ${DICHOTOMY_COLORS[question.dichotomy]}`} />
            {DICHOTOMY_LABELS[question.dichotomy][language as Language]}
          </div>
          <p className="text-base font-medium leading-relaxed mb-6">{question[language as Language] || question.en}</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: rating }))} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${answers[question.id] === rating ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}>
                <span className="text-lg font-bold">{rating}</span>
                <span className="text-[10px] text-center leading-tight text-muted-foreground">{RATING_LABELS[language as keyof typeof RATING_LABELS]?.[rating - 1]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0} className="rounded-full gap-2">
          <ChevronLeft className="h-4 w-4" />
          {{ en: "Previous", ru: "Назад", kk: "Артқа" }[language]}
        </Button>
        {current < total - 1 ? (
          <Button onClick={() => setCurrent((p) => p + 1)} disabled={!answers[question.id]} className="rounded-full gap-2">
            {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={answeredCount < total} className="rounded-full gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {{ en: "See Results", ru: "Посмотреть результат", kk: "Нәтижені көру" }[language]}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── APTITUDE ─────────────────────────────────────────────────────────────────

function AptitudeTestRunner({ language, onComplete }: { language: Language; onComplete: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ReturnType<typeof calculateAptitudeScores> | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("aptitudeResult");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const question = aptitudeQuestions[current];
  const total = aptitudeQuestions.length;
  const progress = ((current + 1) / total) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleFinish = () => {
    const scores = calculateAptitudeScores(answers);
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxTotal = aptitudeQuestions.length;
    const aptResult = { scores, total, maxTotal };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("aptitudeResult", JSON.stringify(aptResult));
    }
    setResult(scores);
    onComplete();
  };

  if (result) {
    const strengths = getAptitudeStrengths(result);
    const topCat = strengths[0];
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="text-lg font-heading font-bold">
              {{ en: "Aptitude Results", ru: "Результаты способностей", kk: "Қабілет нәтижелері" }[language]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {{ en: "Your strongest aptitude:", ru: "Ваша сильнейшая способность:", kk: "Ең күшті қабілетіңіз:" }[language]}{" "}
            <span className={`font-semibold ${APTITUDE_LABELS[topCat].color}`}>
              {APTITUDE_LABELS[topCat][language as Language]}
            </span>
          </p>
        </div>
        <div className="space-y-4 mb-6">
          {strengths.map((cat) => (
            <div key={cat}>
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium ${APTITUDE_LABELS[cat].color}`}>{APTITUDE_LABELS[cat][language as Language]}</span>
                <span className="text-muted-foreground">{result[cat]}/5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${APTITUDE_LABELS[cat].color.replace("text-", "bg-")} rounded-full transition-all`} style={{ width: `${(result[cat] / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); setCurrent(0); }} className="rounded-full flex-1">
            {{ en: "Retake", ru: "Пройти снова", kk: "Қайта өту" }[language]}
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="rounded-full flex-1">
            {{ en: "Go to Dashboard", ru: "В личный кабинет", kk: "Кабинетке өту" }[language]}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{{ en: "Question", ru: "Вопрос", kk: "Сұрақ" }[language]} {current + 1}/{total}</span>
          <span>{answeredCount}/{total} {{ en: "answered", ru: "отвечено", kk: "жауапталды" }[language]}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-card mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${APTITUDE_LABELS[question.category].bg}`}>
            <div className={`w-2 h-2 rounded-full ${APTITUDE_LABELS[question.category].color.replace("text-", "bg-")}`} />
            {APTITUDE_LABELS[question.category][language as Language]}
          </div>
          <p className="text-base font-medium leading-relaxed mb-6">{question[language as Language] || question.en}</p>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => (
              <button key={opt.label} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt.label }))} className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${answers[question.id] === opt.label ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${answers[question.id] === opt.label ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{opt.label}</span>
                <span className="text-sm">{opt[language as Language] || opt.en}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0} className="rounded-full gap-2">
          <ChevronLeft className="h-4 w-4" />
          {{ en: "Previous", ru: "Назад", kk: "Артқа" }[language]}
        </Button>
        {current < total - 1 ? (
          <Button onClick={() => setCurrent((p) => p + 1)} disabled={!answers[question.id]} className="rounded-full gap-2">
            {{ en: "Next", ru: "Далее", kk: "Келесі" }[language]}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={answeredCount < total} className="rounded-full gap-2 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {{ en: "See Results", ru: "Посмотреть результат", kk: "Нәтижені көру" }[language]}
          </Button>
        )}
      </div>
    </div>
  );
}
