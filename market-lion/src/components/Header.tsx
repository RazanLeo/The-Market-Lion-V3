"use client";
import Link from "next/link";
import { Brand } from "./Brand";
import { LangSwitcher } from "./LangSwitcher";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function Header({ variant = "public" }: { variant?: "public" | "app" }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Brand />
        <nav className="hidden md:flex items-center gap-1 mx-auto text-sm">
          {variant === "public" ? (
            <>
              <Link href="/#features" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.features")}</Link>
              <Link href="/#how"      className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.how")}</Link>
              <Link href="/pricing"   className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.pricing")}</Link>
              <Link href="/manual"    className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.manual")}</Link>
              <Link href="/about"     className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.about")}</Link>
              <Link href="/contact"   className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">{t("nav.contact")}</Link>
            </>
          ) : (
            <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300 flex items-center gap-1"><LayoutDashboard size={16}/> {t("nav.dashboard")}</Link>
          )}
        </nav>
        <div className="flex items-center gap-2 ms-auto">
          <LangSwitcher/>
          {variant === "public" ? (
            <>
              <Link href="/login"  className="btn-ghost text-sm"><LogIn size={16}/> {t("nav.login")}</Link>
              <Link href="/signup" className="btn-gold text-sm"><UserPlus size={16}/> {t("nav.signup")}</Link>
            </>
          ) : (
            <Link href="/api/auth/signout" className="btn-ghost text-sm">{t("nav.logout")}</Link>
          )}
        </div>
      </div>
    </header>
  );
}
