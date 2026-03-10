"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Send, User, ArrowLeft, Zap, Lock, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

const FREE_MSG_LIMIT = 10;

interface NPC {
  id: string;
  slug: string;
  name: string;
  profession: string;
  professionRu: string;
  professionKk: string;
  introMessage: string;
  introMessageRu: string;
  introMessageKk: string;
  avatarEmoji: string;
  category: string;
  messageCount: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MentorsPage() {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);

  const isPro = isAuthenticated && (user?.subscriptionPlan === "PRO" || user?.subscriptionPlan === "SCHOOL");
  const totalMessages = npcs.reduce((sum, n) => sum + n.messageCount, 0);
  const freeMessagesLeft = Math.max(0, FREE_MSG_LIMIT - totalMessages);
  const isFreeExhausted = !isPro && isAuthenticated && freeMessagesLeft === 0;

  useEffect(() => {
    fetch("/api/npc/chat")
      .then((r) => r.json())
      .then((d) => setNpcs(d.npcs || []))
      .finally(() => setLoading(false));
  }, []);

  const getProfession = (npc: NPC) =>
    language === "ru" ? npc.professionRu : language === "kk" ? npc.professionKk : npc.profession;

  const handleNpcClick = (npc: NPC) => {
    if (!isAuthenticated) return; // guest: no-op (banner handles it)
    if (isFreeExhausted) return;  // free exhausted: no-op
    setActiveNpc(npc);
  };

  if (activeNpc) {
    return (
      <NpcChat
        npc={activeNpc}
        language={language}
        onBack={(updatedCount) => {
          if (updatedCount !== undefined) {
            setNpcs((prev) => prev.map((n) => n.id === activeNpc.id ? { ...n, messageCount: n.messageCount + updatedCount } : n));
          }
          setActiveNpc(null);
        }}
        isPro={isPro}
        freeMessagesLeft={freeMessagesLeft}
      />
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🧑‍🏫</div>
              <h1 className="font-heading font-bold text-3xl">
                {{ en: "AI Mentors", ru: "AI-менторы", kk: "AI-менторлар" }[language]}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {{ en: "Chat with professionals from different careers. Each question earns 10 XP.", ru: "Общайся с профессионалами из разных сфер. Каждый вопрос приносит 10 XP.", kk: "Түрлі мамандықтардан мамандармен сөйлес. Әр сұрақ 10 XP береді." }[language]}
            </p>
          </motion.div>

          {/* Guest banner */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <Lock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground flex-1">
                {{ en: "Sign in to chat with AI mentors and earn XP.", ru: "Войдите, чтобы общаться с AI-менторами и зарабатывать XP.", kk: "AI-менторлармен сөйлесіп XP жинау үшін кіріңіз." }[language]}
              </span>
              <Button asChild size="sm" className="rounded-full shrink-0">
                <Link href="/auth">{{ en: "Sign In", ru: "Войти", kk: "Кіру" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {/* FREE plan banner */}
          {isAuthenticated && !isPro && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 border rounded-xl px-4 py-3 mb-6 text-sm ${
                isFreeExhausted
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <Crown className={`h-4 w-4 shrink-0 ${isFreeExhausted ? "text-red-500" : "text-amber-500"}`} />
              <span className="text-muted-foreground flex-1">
                {isFreeExhausted
                  ? ({ en: "You've used all 10 free messages. Upgrade to PRO for unlimited chats.", ru: "Вы использовали все 10 бесплатных сообщений. Перейди на PRO для безлимита.", kk: "10 тегін хабарды пайдаландыңыз. Шексіз чат үшін PRO-ға өтіңіз." } as Record<string, string>)[language]
                  : ({ en: `Free plan: ${freeMessagesLeft} of ${FREE_MSG_LIMIT} messages left. Upgrade for unlimited.`, ru: `Бесплатный план: осталось ${freeMessagesLeft} из ${FREE_MSG_LIMIT} сообщений. Перейди на PRO.`, kk: `Тегін жоспар: ${FREE_MSG_LIMIT}-нан ${freeMessagesLeft} хабар қалды. PRO алыңыз.` } as Record<string, string>)[language]
                }
              </span>
              <Button asChild size="sm" className={`rounded-full shrink-0 text-white border-0 ${isFreeExhausted ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}>
                <Link href="/pricing">{{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}</Link>
              </Button>
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {npcs.map((npc, i) => {
                const clickable = isAuthenticated && !isFreeExhausted;
                return (
                  <motion.div
                    key={npc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={clickable ? { y: -3 } : {}}
                    onClick={() => handleNpcClick(npc)}
                    className={`bg-card border border-border rounded-2xl p-5 shadow-card transition-all ${
                      clickable
                        ? "hover:shadow-card-hover hover:border-primary/30 cursor-pointer"
                        : "opacity-70 cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                        {npc.avatarEmoji}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold">{npc.name}</h3>
                        <p className="text-xs text-muted-foreground">{getProfession(npc)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{npc.category}</span>
                      {npc.messageCount > 0 ? (
                        <span className="text-primary font-medium">
                          {npc.messageCount} {{ en: "messages", ru: "сообщений", kk: "хабар" }[language]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {{ en: "New", ru: "Новый", kk: "Жаңа" }[language]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {npcs.length === 0 && (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                  {{ en: "No mentors available yet.", ru: "Менторов пока нет.", kk: "Менторлар әлі жоқ." }[language]}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function NpcChat({
  npc,
  language,
  onBack,
  isPro,
  freeMessagesLeft,
}: {
  npc: NPC;
  language: "en" | "ru" | "kk";
  onBack: (updatedCount?: number) => void;
  isPro: boolean;
  freeMessagesLeft: number;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [msgsThisSession, setMsgsThisSession] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  const remaining = isPro ? Infinity : Math.max(0, freeMessagesLeft - msgsThisSession);
  const isExhausted = !isPro && remaining === 0;

  const introMsg = language === "ru" ? npc.introMessageRu : language === "kk" ? npc.introMessageKk : npc.introMessage;
  const profession = language === "ru" ? npc.professionRu : language === "kk" ? npc.professionKk : npc.profession;

  useEffect(() => {
    fetch(`/api/npc/chat?npcSlug=${npc.slug}`)
      .then((r) => r.json())
      .then((d) => {
        const history: Message[] = d.history?.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })) || [];
        setMessages([{ role: "assistant", content: introMsg }, ...history]);
      })
      .catch(() => {
        setMessages([{ role: "assistant", content: introMsg }]);
      });
  }, [npc.slug]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || isExhausted) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/npc/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npcSlug: npc.slug, message: userMsg, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        if (data.xpEarned) setTotalXpEarned((t) => t + data.xpEarned);
        setMsgsThisSession((c) => c + 1);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't respond. Please try again." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      <div className="container max-w-2xl mx-auto px-4 py-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onBack(msgsThisSession)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            {npc.avatarEmoji}
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-semibold">{npc.name}</h2>
            <p className="text-xs text-muted-foreground">{profession}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isExhausted ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
              }`}>
                {isExhausted
                  ? ({ en: "Limit reached", ru: "Лимит", kk: "Лимит" } as Record<string, string>)[language]
                  : `${remaining} {{ en: "left", ru: "осталось", kk: "қалды" }[language]}`
                }
              </span>
            )}
            {totalXpEarned > 0 && (
              <div className="flex items-center gap-1 text-primary text-xs font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                <Zap className="h-3 w-3" />
                <span>+{totalXpEarned} XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 rounded-2xl bg-muted/20 p-4 min-h-[400px]">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : npc.avatarEmoji}
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
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-sm">
                {npc.avatarEmoji}
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

        {/* Exhausted upgrade banner */}
        {isExhausted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-3 text-sm"
          >
            <Crown className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-muted-foreground flex-1">
              {{ en: "You've used all 10 free messages. Upgrade to PRO for unlimited AI mentors.", ru: "Вы использовали все 10 бесплатных сообщений. PRO — безлимитные AI-менторы.", kk: "10 тегін хабарды пайдаландыңыз. PRO — шексіз AI-менторлар." }[language]}
            </span>
            <Button asChild size="sm" className="rounded-full shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0">
              <Link href="/pricing">
                {{ en: "Upgrade", ru: "Улучшить", kk: "Жаңарту" }[language]}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={isExhausted
              ? ({ en: "Message limit reached. Upgrade to continue.", ru: "Лимит достигнут. Перейди на PRO.", kk: "Лимит таусылды. PRO-ға өтіңіз." } as Record<string, string>)[language]
              : ({ en: `Ask ${npc.name} anything...`, ru: `Спроси ${npc.name} что угодно...`, kk: `${npc.name}-тан кез келген нәрсе сұра...` } as Record<string, string>)[language]
            }
            disabled={isTyping || isExhausted}
            className="flex-1 px-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || isExhausted}
            size="icon"
            className="rounded-full w-12 h-12 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
