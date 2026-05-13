"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/I18nProvider";

export default function Services() {
  const { t } = useI18n();
  const items = [
    { t: t("services.analysis_title"), d: t("services.analysis_desc") },
    { t: t("services.bot_title"),      d: t("services.bot_desc")      },
    { t: t("services.indicator_title"), d: t("services.indicator_desc") },
    { t: t("services.ai_title"),       d: t("services.ai_desc")       },
    { t: t("pricing.feature_support"), d: "24/7 across all channels" },
    { t: t("pricing.feature_pdf"),     d: "Daily, weekly, monthly PDF with P&L analysis" },
    { t: t("pricing.feature_multi"),   d: "Exness, Capital.com, IC Markets, Pepperstone, XM, FBS, FXTM..." },
    { t: "12 Languages",               d: "Arabic RTL + 11 global languages, instant switch without reload" },
    { t: "Admin Dashboard",            d: "Owner-only — isolated with middleware, 2FA, RBAC" },
  ];
  return (
    <>
      <Header/>
      <main className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">{t("services.title")}</h1>
        <p className="text-center text-zinc-400 mb-12 max-w-3xl mx-auto">{t("services.subtitle")}</p>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((x, i) => (
            <div key={i} className="gold-card p-6">
              <h3 className="text-gold-400 font-bold mb-2 text-lg">{x.t}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
