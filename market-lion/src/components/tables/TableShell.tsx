"use client";
import { ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function TableShell({
  number, title, subtitle, weight, badge, children,
}: { number: number; title: string; subtitle?: string; weight?: string; badge?: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="gold-card p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-400 grid place-items-center font-display text-lg">{number}</div>
          <div>
            <h3 className="text-gold-400 font-bold text-lg">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {weight && <span className="chip-tier-S">{t("shell.weight")}: {weight}</span>}
          {badge && <span className="chip chip-neutral">{badge}</span>}
        </div>
      </header>
      <div className="overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

export function DecisionPill({ d }: { d: "BUY"|"SELL"|"NEUTRAL" }) {
  const { t } = useI18n();
  if (d === "BUY")  return <span className="chip-buy">{t("common.buy")} 🟢</span>;
  if (d === "SELL") return <span className="chip-sell">{t("common.sell")} 🔴</span>;
  return <span className="chip-neutral">{t("common.neutral")} ⚪</span>;
}

const TIER_META: Record<string, { cls: string }> = {
  S: { cls: "bg-yellow-400/20 text-yellow-300 ring-yellow-400/50" },
  A: { cls: "bg-sky-400/20 text-sky-300 ring-sky-400/50" },
  B: { cls: "bg-zinc-400/20 text-zinc-300 ring-zinc-500/40" },
  C: { cls: "bg-zinc-600/20 text-zinc-400 ring-zinc-600/30" },
};

export function TierChip({ tier }: { tier: "S"|"A"|"B"|"C" }) {
  const m = TIER_META[tier] || TIER_META.C;
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ring-1 shrink-0 ${m.cls}`}
      title={`Tier ${tier}`}
    >
      {tier}
    </span>
  );
}
