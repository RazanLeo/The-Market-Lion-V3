"use client";
import Link from "next/link";
import { LionMark } from "./LionMark";
import { useI18n } from "@/i18n/I18nProvider";

export function Brand({ size = 40, withName = true }: { size?: number; withName?: boolean }) {
  const { t } = useI18n();
  return (
    <Link href="/" className="flex items-center gap-3 group select-none">
      <LionMark size={size} priority className="shadow-glow group-hover:scale-105 transition-transform"/>
      {withName && (
        <div className="leading-tight">
          <div className="font-display text-xl gold-text whitespace-nowrap">{t("brand.name")}</div>
          <div className="text-[11px] tracking-wider text-gold-500 font-semibold">{t("brand.tagline")}</div>
        </div>
      )}
    </Link>
  );
}
