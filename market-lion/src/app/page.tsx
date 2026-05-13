"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LionMark } from "@/components/LionMark";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Crown, BarChart3, Newspaper, Building2, Shield, Zap, LineChart, Brain, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function HomePage() {
  const { t } = useI18n();
  const features = [
    { icon: <Brain size={20}/>,    title: t("landing.feature.ai.title"),       desc: t("landing.feature.ai.desc") },
    { icon: <BarChart3 size={20}/>,title: t("landing.feature.tools.title"),    desc: t("landing.feature.tools.desc") },
    { icon: <Newspaper size={20}/>,title: t("landing.feature.fundamental.title"), desc: t("landing.feature.fundamental.desc") },
    { icon: <Building2 size={20}/>,title: t("landing.feature.whales.title"),   desc: t("landing.feature.whales.desc") },
    { icon: <Shield size={20}/>,   title: t("landing.feature.risk.title"),     desc: t("landing.feature.risk.desc") },
    { icon: <Zap size={20}/>,      title: t("landing.feature.scalping.title"), desc: t("landing.feature.scalping.desc") },
    { icon: <LineChart size={20}/>,title: t("landing.feature.bot.title"),      desc: t("landing.feature.bot.desc") },
    { icon: <Globe size={20}/>,    title: t("landing.feature.langs.title"),    desc: t("landing.feature.langs.desc") },
  ];
  const tablesPreview = [
    { num: 1, title: t("landing.tp.1.title"),                            desc: t("landing.tp.1.desc") },
    { num: 2, title: t("landing.tp.2.title"), weight: "20%",            desc: t("landing.tp.2.desc") },
    { num: 3, title: t("landing.tp.3.title"), weight: "30%",            desc: t("landing.tp.3.desc") },
    { num: 4, title: t("landing.tp.4.title"), weight: "25%",            desc: t("landing.tp.4.desc") },
    { num: 5, title: t("landing.tp.5.title"), weight: "10%",            desc: t("landing.tp.5.desc") },
    { num: 6, title: t("landing.tp.6.title"), weight: "15%",            desc: t("landing.tp.6.desc") },
    { num: 7, title: t("landing.tp.7.title"),                            desc: t("landing.tp.7.desc") },
    { num: 8, title: t("landing.tp.8.title"),                            desc: t("landing.tp.8.desc") },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_-10%,rgba(212,175,55,0.18),transparent_60%)]"/>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 chip-tier-S mb-5">
              <Crown size={14}/> {t("hero.badge")}
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight flex items-center gap-3">
              <LionMark size={56} priority/>
              <span className="gold-text">{t("hero.title")}</span>
            </h1>
            <div className="text-2xl md:text-3xl text-white mt-2">The Market Lion</div>
            <div className="text-base text-gold-500/80 mt-1">{t("brand.tagline")}</div>
            <div className="text-sm text-zinc-500 mt-0.5">{t("brand.tech_name")}</div>
            <p className="mt-5 text-lg text-zinc-300 leading-loose">{t("hero.subtitle")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup"    className="btn-gold">{t("hero.cta_primary")} <ArrowLeft size={18}/></Link>
              <Link href="/dashboard" className="btn-ghost">{t("hero.cta_secondary")}</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_1")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_2")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_3")}</div>
            </div>
          </div>
          <div className="relative">
            <div className="gold-card p-6">
              <Image src="/logo/market-lion-logo.jpg" alt={t("brand.name")} width={620} height={620}
                className="rounded-xl ring-2 ring-gold-500/40 shadow-gold w-full h-auto" priority/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">{t("landing.features_title")}</h2>
        <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">{t("landing.features_subtitle")}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="gold-card p-5">
              <div className="w-10 h-10 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center mb-3">{f.icon}</div>
              <h3 className="font-bold text-gold-400 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tables Preview */}
      <section id="how" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">{t("landing.tables_title")}</h2>
        <p className="text-center text-zinc-400 max-w-3xl mx-auto mb-12">{t("landing.tables_subtitle")}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {tablesPreview.map(tb => (
            <div key={tb.num} className="gold-card p-5 flex gap-4 items-start">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gold-500/15 text-gold-400 grid place-items-center font-display text-xl">{tb.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gold-400">{tb.title}</h3>
                  {tb.weight && <span className="chip-tier-S">{t("shell.weight")} {tb.weight}</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{tb.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl gold-text mb-4 flex items-center justify-center gap-3">
          <LionMark size={40}/> {t("landing.cta_title")}
        </h2>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">{t("landing.cta_subtitle")}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/signup"   className="btn-gold">{t("landing.cta_btn_signup")}</Link>
          <Link href="/dashboard" className="btn-ghost">{t("landing.cta_btn_try")}</Link>
          <Link href="/contact"  className="btn-ghost">{t("landing.cta_btn_contact")}</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
