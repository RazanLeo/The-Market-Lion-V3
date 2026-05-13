"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/I18nProvider";

export default function About() {
  const { t } = useI18n();
  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-14 space-y-8 text-zinc-300 leading-loose">
        <h1 className="font-display gold-text text-4xl">{t("about.title")} — {t("brand.name")}</h1>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">{t("about.vision_title")}</h2>
          <p>{t("about.vision")}</p>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">{t("about.mission_title")}</h2>
          <p>{t("about.mission")}</p>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">{t("about.founder_title")}</h2>
          <p>{t("about.founder")}</p>
        </section>

        <div className="grid sm:grid-cols-4 gap-4 mt-8">
          {[
            { n: "500+", label: t("about.stats_users") },
            { n: "125+", label: t("about.stats_tools") },
            { n: "9", label: t("about.stats_assets") },
            { n: "99.9%", label: t("about.stats_uptime") },
          ].map((s, i) => (
            <div key={i} className="gold-card p-5 text-center">
              <div className="text-3xl font-display gold-text">{s.n}</div>
              <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
