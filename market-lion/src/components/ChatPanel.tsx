"use client";
import { useState, useRef, useEffect } from "react";
import { LionMark } from "./LionMark";
import { Send, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatPanel({ context }: { context: any }) {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: t("chat.greeting_ar") }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await r.json();
      setMessages(m => [...m, { role: "assistant", content: data?.content || t("chat.error") }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: t("chat.connection_error") }]);
    } finally { setBusy(false); }
  }

  return (
    <section className="gold-card overflow-hidden">
      <header className="flex items-center gap-3 px-5 py-3 border-b border-gold-500/20 bg-bg-soft">
        <LionMark size={28}/>
        <div>
          <h3 className="text-gold-400 font-bold">
            {t("chat.title")}
          </h3>
          <p className="text-[11px] text-zinc-400">
            {t("chat.subtitle")}
          </p>
        </div>
      </header>
      <div className="h-96 overflow-y-auto px-4 py-4 space-y-3 bg-black/40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-gold-500/15 border border-gold-500/30 text-zinc-100"
                : "bg-bg-card border border-line text-zinc-200"
            }`}>
              {m.role === "assistant" && <span className="inline-flex items-center gap-1 text-gold-400 text-[11px] font-bold mb-1"><LionMark size={14}/> Market Lion GPT</span>}
              <div>{m.content}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 text-sm bg-bg-card border border-line flex items-center gap-2 text-zinc-400">
              <Loader2 className="animate-spin" size={14}/>
              {t("chat.thinking")}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-gold-500/20 p-3 flex items-center gap-2 bg-bg-soft">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={t("chat.placeholder")}
          className="flex-1 bg-bg-card border border-gold-500/25 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold-500/40"
        />
        <button onClick={send} disabled={busy || !input.trim()}
          className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
          <Send size={16}/>{t("chat.send")}
        </button>
      </div>
    </section>
  );
}
