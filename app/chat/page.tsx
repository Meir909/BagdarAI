"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Bot, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AIChat />
    </ProtectedRoute>
  );
}

function AIChat() {
  const { language } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [aiRequestsUsed, setAiRequestsUsed] = useState(user?.aiRequestsUsed || 0);
  const endRef = useRef<HTMLDivElement>(null);

  const greeting = {
    en: "Hello! I'm BagdarAI — your AI career advisor. Ask me anything about careers, universities, or your future path!",
    ru: "Привет! Я BagdarAI — твой AI советник по карьере. Спроси меня о профессиях, университетах или твоём будущем!",
    kk: "Сәлем! Мен BagdarAI — сенің AI мансап кеңесшің. Мамандықтар, университеттер немесе болашағың туралы сұра!",
  };

  useEffect(() => {
    setMessages([{ role: "assistant", content: greeting[language] }]);
    // Load history
    fetch("/api/ai/chat")
      .then((r) => r.json())
      .then((data) => {
        if (data.history && data.history.length > 0) {
          setMessages([
            { role: "assistant", content: greeting[language] },
            ...data.history.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })),
          ]);
        }
      })
      .catch(() => {});

    if (user?.subscriptionPlan === "FREE" && (user?.aiRequestsUsed || 0) >= 3) {
      setLimitReached(true);
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || limitReached) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, language }),
      });

      const data = await res.json();

      if (res.status === 429 && data.error === "limit_reached") {
        setLimitReached(true);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: { en: "You've reached the free plan limit of 3 AI requests. Please upgrade to Pro for unlimited access.", ru: "Вы исчерпали бесплатный лимит в 3 запроса. Перейдите на Pro для неограниченного доступа.", kk: "Тегін жоспарда 3 сұрақ лимиті таусылды. Шексіз қолжетімділік үшін Pro-ға өтіңіз." }[language],
        }]);
      } else if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        setAiRequestsUsed(data.aiRequestsUsed);
        if (user?.subscriptionPlan === "FREE" && data.aiRequestsUsed >= 3) {
          setLimitReached(true);
        }
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: { en: "Sorry, I couldn't respond right now. Please try again.", ru: "Извините, не могу ответить сейчас. Попробуйте снова.", kk: "Кешіріңіз, қазір жауап бере алмаймын. Қайта көріңіз." }[language],
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: { en: "Connection error. Please try again.", ru: "Ошибка соединения. Попробуйте снова.", kk: "Байланыс қатесі. Қайта көріңіз." }[language],
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const FREE_LIMIT = 3;

  return (
    <PageTransition>
      <div className="min-h-screen pt-16 flex flex-col">
        <div className="container max-w-3xl mx-auto px-4 py-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading font-semibold">{{ en: "AI Career Advisor", ru: "AI Карьерный советник", kk: "AI Мансап кеңесшісі" }[language]}</h1>
                <p className="text-xs text-muted-foreground">BagdarAI o4-mini</p>
              </div>
            </div>
            {user?.subscriptionPlan === "FREE" && (
              <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                {aiRequestsUsed}/{FREE_LIMIT} {{ en: "requests used", ru: "запросов", kk: "сұрақ" }[language]}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 rounded-2xl bg-muted/20 p-4 min-h-[400px]">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                }`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/50"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>

          {/* Limit warning */}
          <AnimatePresence>
            {limitReached && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>{{ en: "Free limit reached. Upgrade to Pro for unlimited AI chat.", ru: "Лимит бесплатного плана исчерпан. Перейди на Pro.", kk: "Тегін лимит таусылды. Pro-ға өт." }[language]}</span>
                </div>
                <Button size="sm" className="rounded-full ml-3 shrink-0" asChild>
                  <Link href="/pricing">Pro</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={limitReached
                ? { en: "Upgrade to Pro to continue...", ru: "Перейди на Pro для продолжения...", kk: "Жалғастыру үшін Pro-ға өт..." }[language]
                : { en: "Ask a career question...", ru: "Задай вопрос о карьере...", kk: "Мансап туралы сұрақ қой..." }[language]
              }
              disabled={limitReached || isTyping}
              className="flex-1 px-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping || limitReached}
              size="icon"
              className="rounded-full w-12 h-12 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
