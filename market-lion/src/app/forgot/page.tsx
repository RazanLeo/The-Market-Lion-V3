"use client";
import { Brand } from "@/components/Brand";
import { LionMark } from "@/components/LionMark";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export default function ForgotPassword() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-5"><Brand size={48}/></div>
        <h1 className="text-center font-display gold-text text-2xl mb-1 flex items-center justify-center gap-2">
          <KeyRound size={20}/> {t("forgot.title")}
        </h1>
        <p className="text-center text-zinc-400 text-sm mb-6">{t("forgot.subtitle")}</p>
        <form action="/api/auth/forgot" method="post" className="space-y-4">
          <input name="email" type="email" required placeholder={t("forgot.email")}
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <button className="btn-gold w-full inline-flex items-center justify-center gap-2">
            <LionMark size={18}/> {t("forgot.btn")}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          <Link href="/login" className="text-gold-400 font-bold">{t("forgot.back")}</Link>
        </p>
      </div>
    </main>
  );
}
