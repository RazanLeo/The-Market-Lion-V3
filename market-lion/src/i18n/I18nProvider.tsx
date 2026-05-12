"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DEFAULT_LOCALE, Locale, LOCALES } from "./locales";
import { t as tFn } from "./translations";

type Ctx = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = (typeof window !== "undefined") ? localStorage.getItem("ml.locale") as Locale : null;
    if (saved && LOCALES.some(l => l.code === saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    const def = LOCALES.find(l => l.code === locale);
    if (def && typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = def.dir;
    }
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("ml.locale", l);
  };

  const dir = useMemo(() => LOCALES.find(l => l.code === locale)?.dir || "rtl", [locale]);
  const t = (key: string) => tFn(key, locale);

  return <I18nCtx.Provider value={{ locale, dir, t, setLocale }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n must be used inside <I18nProvider>");
  return c;
}
