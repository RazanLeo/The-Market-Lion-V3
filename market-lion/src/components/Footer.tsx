"use client";
import Link from "next/link";
import { Brand } from "./Brand";
import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-gold-500/20 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <Brand />
          <p className="mt-4 text-zinc-400 leading-relaxed">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">{t("nav.about")}</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/about">{t("footer.about")}</Link></li>
            <li><Link href="/services">{t("footer.services")}</Link></li>
            <li><Link href="/pricing">{t("footer.pricing")}</Link></li>
            <li><Link href="/manual">{t("footer.manual")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">Legal</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/policies/terms">{t("footer.terms")}</Link></li>
            <li><Link href="/policies/privacy">{t("footer.privacy")}</Link></li>
            <li><Link href="/policies/risk">{t("footer.risk")}</Link></li>
            <li><Link href="/policies/refund">{t("footer.refund")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">{t("nav.contact")}</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/contact">{t("footer.contact")}</Link></li>
            <li>support@themarketlion.com</li>
            <li>24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-500/15 py-4 text-center text-xs text-zinc-500">
        {t("footer.copyright")} • The Market Lion v3
      </div>
    </footer>
  );
}
