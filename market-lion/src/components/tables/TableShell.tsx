import { ReactNode } from "react";

export function TableShell({
  number, title, subtitle, weight, badge, children,
}: { number: number; title: string; subtitle?: string; weight?: string; badge?: string; children: ReactNode }) {
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
          {weight && <span className="chip-tier-S">الوزن: {weight}</span>}
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
  if (d === "BUY")  return <span className="chip-buy">شراء 🟢</span>;
  if (d === "SELL") return <span className="chip-sell">بيع 🔴</span>;
  return <span className="chip-neutral">محايد ⚪</span>;
}

export function TierChip({ tier }: { tier: "S"|"A"|"B"|"C" }) {
  return <span className={`chip-tier-${tier}`}>Tier {tier}</span>;
}
