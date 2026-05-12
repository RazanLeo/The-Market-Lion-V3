"use client";
import { LOCALES } from "@/i18n/locales";
import { useI18n } from "@/i18n/I18nProvider";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const current = LOCALES.find(l => l.code === locale);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="p-2 rounded-lg text-gold-400 hover:bg-gold-500/10 flex items-center gap-1.5 text-sm">
        <Globe size={16}/> <span className="hidden md:inline">{current?.flag} {current?.nameNative}</span>
      </button>
      {open && (
        <div className="absolute end-0 mt-1 w-56 max-h-80 overflow-y-auto bg-bg-card border border-gold-500/30 rounded-xl shadow-gold z-50 py-1">
          {LOCALES.map(l => (
            <button key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`w-full text-start px-3 py-2 text-sm flex items-center gap-2 hover:bg-gold-500/10 ${l.code===locale ? "text-gold-400 font-bold" : "text-zinc-200"}`}>
              <span>{l.flag}</span>
              <span className="flex-1">{l.nameNative}</span>
              <span className="text-xs text-zinc-500">{l.nameEn}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
