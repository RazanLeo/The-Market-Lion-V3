"use client";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { LionMark } from "@/components/LionMark";
import { LogIn } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-6"><Brand size={48} /></div>
        <h1 className="text-center text-2xl font-display gold-text mb-1 flex items-center justify-center gap-2">
          <LionMark size={26}/> {t("login.title")}
        </h1>
        <p className="text-center text-zinc-400 text-sm mb-6">{t("login.subtitle")}</p>
        <form action="/api/auth/callback/credentials" method="post" className="space-y-4">
          <div>
            <label className="text-sm text-gold-400 mb-1 block">{t("login.email")}</label>
            <input name="email" type="email" required placeholder="you@example.com"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <div>
            <label className="text-sm text-gold-400 mb-1 block">{t("login.password")}</label>
            <input name="password" type="password" required placeholder="••••••••"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" /> {t("login.remember")}</label>
            <Link href="/forgot" className="text-gold-400">{t("login.forgot")}</Link>
          </div>
          <button className="btn-gold w-full"><LogIn size={16}/> {t("login.btn")}</button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          {t("login.no_account")} <Link href="/signup" className="text-gold-400 font-bold">{t("login.signup_link")}</Link>
        </p>
      </div>
    </main>
  );
}
