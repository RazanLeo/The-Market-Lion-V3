"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MessageSquare, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function Contact() {
  const { t } = useI18n();
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">{t("contact.title")}</h1>
        <p className="text-center text-zinc-400 mb-10">{t("contact.subtitle")}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="gold-card p-5"><Mail className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">{t("login.email")}</div><div className="text-sm text-zinc-400">support@themarketlion.com</div></div>
          <div className="gold-card p-5"><MessageSquare className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">{t("services.ai_title")}</div><div className="text-sm text-zinc-400">{t("services.ai_desc")}</div></div>
          <div className="gold-card p-5"><Phone className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">{t("pricing.institution_title")}</div><div className="text-sm text-zinc-400">{t("pricing.institution_price")}</div></div>
          <div className="gold-card p-5"><Globe className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">HQ</div><div className="text-sm text-zinc-400">Saudi Arabia — Riyadh</div></div>
        </div>

        <form className="gold-card p-6 grid gap-4" action="/api/contact" method="post">
          <input name="name" required placeholder={t("contact.name")} className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="email" type="email" required placeholder={t("contact.email")} className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="subject" required placeholder={t("contact.subject")} className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <textarea name="message" rows={6} required placeholder={t("contact.message")} className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"></textarea>
          <button className="btn-gold">{t("contact.btn")}</button>
        </form>
      </main>
      <Footer/>
    </>
  );
}
