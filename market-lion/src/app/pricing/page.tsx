"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { Check } from "lucide-react";

export default function Pricing() {
  const { t } = useI18n();
  const features = [
    t("pricing.feature_bot"),
    t("pricing.feature_indicator"),
    t("pricing.feature_analysis"),
    t("pricing.feature_ai"),
    t("pricing.feature_support"),
    t("pricing.feature_pdf"),
    t("pricing.feature_multi"),
  ];
  return (
    <>
      <Header/>
      <main className="max-w-5xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">{t("pricing.title")}</h1>
        <p className="text-center text-zinc-400 mb-10">{t("pricing.subtitle")}</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: t("pricing.individual_title"), price: t("pricing.individual_price"), plan: "individual" },
            { name: t("pricing.institution_title"), price: t("pricing.institution_price"), plan: "institution" },
          ].map(p => (
            <div key={p.plan} className="gold-card p-7">
              <h3 className="text-gold-400 font-bold text-2xl">{p.name}</h3>
              <div className="text-4xl gold-text my-4">{p.price}</div>
              <ul className="space-y-2 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-gold-400 shrink-0"/> {f}
                  </li>
                ))}
              </ul>
              <Link href={`/signup?plan=${p.plan}`} className="btn-gold w-full">{t("pricing.cta")}</Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">MADA · PayPal · Visa · Mastercard · Apple Pay · PayTabs</p>
      </main>
      <Footer/>
    </>
  );
}
