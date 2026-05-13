"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/I18nProvider";

export default function Manual() {
  const { t } = useI18n();
  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-4xl mb-6">{t("manual.title")}</h1>
        <p className="text-zinc-400">{t("manual.subtitle")}</p>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">1) {t("manual.s1_title")}</h2>
          <p>{t("manual.s1")}</p>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">2) {t("manual.s2_title")}</h2>
          <p>{t("manual.s2")}</p>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">3) {t("manual.s3_title")}</h2>
          <p>{t("manual.s3")}</p>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">4) {t("manual.s4_title")}</h2>
          <p>{t("manual.s4")}</p>
        </section>
      </main>
      <Footer/>
    </>
  );
}
