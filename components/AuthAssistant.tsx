"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "assistant" | "user";
  text: string;
}

// ─── Knowledge base (trilingual) ─────────────────────────────────────────────

type Lang = "en" | "ru" | "kk";

interface Rule {
  keywords: string[];
  answer: Record<Lang, string>;
}

const RULES: Rule[] = [
  {
    keywords: ["ученик", "школьник", "школа", "student", "оқушы", "мектеп", "school student"],
    answer: {
      ru: "Ученик школы входит через **«Ученик»** → вводит имя, **код школы** (SCH-XXXX) и класс при первой регистрации. При повторном входе достаточно своего **кода ученика** (STU-XXXX).",
      en: "A school student logs in via **«Student»** → enters name, **school code** (SCH-XXXX) and class on first registration. On next logins use your **student code** (STU-XXXX).",
      kk: "Мектеп оқушысы **«Оқушы»** арқылы кіреді → атын, **мектеп кодын** (SCH-XXXX) және сыныбын енгізеді. Келесі кірулерде тек **оқушы кодын** (STU-XXXX) пайдаланады.",
    },
  },
  {
    keywords: ["код ученика", "student code", "stu-", "oқушы коды", "оқушы коды", "мой код"],
    answer: {
      ru: "Код ученика — **STU-XXXX** — это твой личный код для входа. Его получаешь после первой регистрации. Если потерял — обратись к куратору или директору школы.",
      en: "Student code — **STU-XXXX** — is your personal login code. You get it after first registration. If lost — contact your curator or school director.",
      kk: "Оқушы коды — **STU-XXXX** — бұл сенің жеке кіру кодың. Оны алғашқы тіркелуден кейін аласың. Жоғалтсаң — куратор немесе директорға хабарлас.",
    },
  },
  {
    keywords: ["код школы", "school code", "sch-", "мектеп коды", "инвитация"],
    answer: {
      ru: "Код школы — **SCH-XXXX** — нужен только при **первой** регистрации ученика. Его знает директор или куратор школы. При повторном входе этот код не нужен.",
      en: "School code — **SCH-XXXX** — is only required during **first** student registration. Your director or curator has it. Not needed for subsequent logins.",
      kk: "Мектеп коды — **SCH-XXXX** — тек **алғашқы** тіркелу кезінде қажет. Оны директор немесе куратор біледі. Кейінгі кірулерде қажет емес.",
    },
  },
  {
    keywords: ["куратор", "curator"],
    answer: {
      ru: "Куратор входит через роль **«Куратор»** → email + пароль + **код приглашения** от директора школы.",
      en: "Curator logs in via **«Curator»** role → email + password + **invitation code** from the school director.",
      kk: "Куратор **«Куратор»** рөлі арқылы кіреді → email + пароль + директордың **шақыру коды**.",
    },
  },
  {
    keywords: ["директор", "director"],
    answer: {
      ru: "Директор входит через роль **«Директор»** → email + пароль. Аккаунт директора создаётся администратором платформы.",
      en: "Director logs in via **«Director»** role → email + password. Director account is created by platform admin.",
      kk: "Директор **«Директор»** рөлі арқылы кіреді → email + пароль. Директор аккаунтын платформа әкімшісі жасайды.",
    },
  },
  {
    keywords: ["родитель", "parent", "ата-ана"],
    answer: {
      ru: "Родитель входит через **«Родитель»** → email + пароль + **код ученика** своего ребёнка для привязки аккаунта.",
      en: "Parent logs in via **«Parent»** → email + password + **student code** of their child to link accounts.",
      kk: "Ата-ана **«Ата-ана»** арқылы кіреді → email + пароль + баланың **оқушы коды** аккаунтты байланыстыру үшін.",
    },
  },
  {
    keywords: ["забыл пароль", "forgot password", "парольды ұмыттым", "не помню пароль", "reset"],
    answer: {
      ru: "Сброс пароля: напиши администратору платформы или куратору школы. Функция «забыли пароль» появится в следующем обновлении.",
      en: "Password reset: contact the platform admin or school curator. 'Forgot password' feature is coming in the next update.",
      kk: "Парольді қалпына келтіру: платформа әкімшісіне немесе куратоорға жазыңыз. «Парольді ұмыттым» функциясы келесі жаңартуда қосылады.",
    },
  },
  {
    keywords: ["зарегистрироваться", "register", "тіркелу", "новый", "создать аккаунт"],
    answer: {
      ru: "Для регистрации:\n• **Ученик** — выбери роль «Ученик», введи имя, код школы и класс\n• **Куратор** — нужен код приглашения от директора\n• **Родитель** — email, пароль и код ученика ребёнка",
      en: "To register:\n• **Student** — select 'Student', enter name, school code and class\n• **Curator** — need invitation code from director\n• **Parent** — email, password and child's student code",
      kk: "Тіркелу үшін:\n• **Оқушы** — «Оқушы» рөлін таңдап, атыңды, мектеп кодын және сыныбыңды енгізіңіз\n• **Куратор** — директордың шақыру коды керек\n• **Ата-ана** — email, пароль және баланың оқушы коды",
    },
  },
  {
    keywords: ["ошибка", "error", "қате", "не работает", "не входит", "проблема"],
    answer: {
      ru: "Если возникла ошибка:\n1. Проверь правильность кода (без пробелов)\n2. Убедись что интернет работает\n3. Попробуй другой браузер\n4. Обратись к куратору или директору",
      en: "If you have an error:\n1. Check code is correct (no spaces)\n2. Make sure internet works\n3. Try another browser\n4. Contact your curator or director",
      kk: "Қате болса:\n1. Кодтың дұрыстығын тексер (бос орын жоқ)\n2. Интернет жұмыс істейтінін тексер\n3. Басқа браузерді қолданып көр\n4. Куратор немесе директорға хабарлас",
    },
  },
  {
    keywords: ["привет", "hello", "hi", "сәлем", "салем", "что умеешь", "помоги"],
    answer: {
      ru: "Привет! 👋 Я помогу войти в BagdarAI. Спроси меня:\n• Как войти как ученик?\n• Что такое код школы?\n• Как зарегистрировать куратора?",
      en: "Hi! 👋 I'll help you log in to BagdarAI. Ask me:\n• How to log in as a student?\n• What is school code?\n• How to register as curator?",
      kk: "Сәлем! 👋 BagdarAI-ға кіруге көмектесемін. Сұра:\n• Оқушы ретінде қалай кіруге болады?\n• Мектеп коды дегеніміз не?\n• Куратор қалай тіркеледі?",
    },
  },
];

const FALLBACK: Record<Lang, string> = {
  ru: "Не совсем понял 🤔 Попробуй:\n• «Как войти как ученик?»\n• «Что такое код школы?»\n• «Как зарегистрироваться?»",
  en: "I'm not sure I understood 🤔 Try:\n• «How to login as student?»\n• «What is school code?»\n• «How to register?»",
  kk: "Түсінбедім 🤔 Қолданып көр:\n• «Оқушы ретінде қалай кіруге болады?»\n• «Мектеп коды дегеніміз не?»\n• «Қалай тіркелуге болады?»",
};

const QUICK: Record<Lang, string[]> = {
  ru: ["Как войти как ученик?", "Что такое код школы?", "Как войти куратором?"],
  en: ["How to login as student?", "What is school code?", "How to login as curator?"],
  kk: ["Оқушы ретінде қалай кіреді?", "Мектеп коды дегеніміз не?", "Куратор қалай кіреді?"],
};

const GREETING: Record<Lang, string> = {
  ru: "Привет! 👋 Я помогу разобраться со входом в BagdarAI. Задай вопрос или выбери ниже.",
  en: "Hi! 👋 I'll help you with logging into BagdarAI. Ask a question or choose below.",
  kk: "Сәлем! 👋 BagdarAI-ға кіруге көмектесемін. Сұрақ қой немесе төменнен таңда.",
};

function getAnswer(input: string, lang: Lang): string {
  const q = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule.answer[lang];
    }
  }
  return FALLBACK[lang];
}

function Md({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, li) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={li}>
            {parts.map((p, i) =>
              i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>
            )}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthAssistant() {
  const { language } = useLanguage();
  const lang = (language as Lang) ?? "ru";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: GREETING[lang] },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    const answer = getAnswer(q, lang);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "assistant", text: answer },
    ]);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.93 }}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-colors ${
          open
            ? "bg-card border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-6 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ maxHeight: "420px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {{ ru: "Помощник", en: "Assistant", kk: "Көмекші" }[lang]}
                </p>
                <p className="text-xs text-green-500">
                  {{ ru: "Онлайн", en: "Online", kk: "Онлайн" }[lang]}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" ? <Md text={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}

              {/* Quick prompts */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {QUICK[lang].map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left text-xs text-primary border border-primary/30 bg-primary/5 rounded-xl px-3 py-2 hover:bg-primary/10 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-border flex gap-2 items-center">
              <input
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                placeholder={{ ru: "Задай вопрос...", en: "Ask a question...", kk: "Сұрақ қой..." }[lang]}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
