"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Bot, User, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";

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
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MentorsHub />
    </ProtectedRoute>
  );
}

function MentorsHub() {
  const { language } = useLanguage();
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);

  useEffect(() => {
    fetch("/api/npc/chat")
      .then((r) => r.json())
      .then((d) => setNpcs(d.npcs || []))
      .finally(() => setLoading(false));
  }, []);

  const getProfession = (npc: NPC) =>
    language === "ru" ? npc.professionRu : language === "kk" ? npc.professionKk : npc.profession;

  if (activeNpc) {
    return <NpcChat npc={activeNpc} language={language} onBack={() => setActiveNpc(null)} />;
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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {npcs.map((npc, i) => (
                <motion.div
                  key={npc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setActiveNpc(npc)}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all cursor-pointer"
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
              ))}

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

function NpcChat({ npc, language, onBack }: { npc: NPC; language: "en" | "ru" | "kk"; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  const introMsg = language === "ru" ? npc.introMessageRu : language === "kk" ? npc.introMessageKk : npc.introMessage;
  const profession = language === "ru" ? npc.professionRu : language === "kk" ? npc.professionKk : npc.profession;

  useEffect(() => {
    // Load history
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
    if (!input.trim() || isTyping) return;
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
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
            {npc.avatarEmoji}
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-semibold">{npc.name}</h2>
            <p className="text-xs text-muted-foreground">{profession}</p>
          </div>
          {totalXpEarned > 0 && (
            <div className="flex items-center gap-1 text-primary text-xs font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
              <Zap className="h-3 w-3" />
              <span>+{totalXpEarned} XP</span>
            </div>
          )}
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

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={{ en: `Ask ${npc.name} anything...`, ru: `Спроси ${npc.name} что угодно...`, kk: `${npc.name}-тан кез келген нәрсе сұра...` }[language]}
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
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
