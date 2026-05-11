"use client";
import { TRADE_PLAN } from "@/data/tradePlan";
import { TableShell } from "./TableShell";
import { TradeLevels } from "@/lib/tradePlan";

export function Table8Plan({ asset, lots, levels, capital, riskPct, riskAmount, leverage = 500, mode, tf, direction }:
  { asset: string; lots: number; levels: TradeLevels; capital: number; riskPct: number; riskAmount: number; leverage?: number; mode: "BOT"|"MANUAL"; tf: string; direction: "BUY"|"SELL"|"NEUTRAL" }) {
  const valueOf: Record<number, string | number> = {
    1: capital.toFixed(2) + " $",
    2: riskPct + "%",
    3: riskAmount.toFixed(2) + " $",
    4: "1:" + leverage,
    5: lots.toFixed(2) + " Lots",
    6: (lots * 100000 / leverage).toFixed(2) + " $",
    7: (lots * 100000 / leverage).toFixed(2) + " $",
    8: (capital - lots * 100000 / leverage).toFixed(2) + " $",
    9: (capital / Math.max(lots * 100000 / leverage, 1) * 100).toFixed(0) + "%",
    10: "Forex / Metals / Energy (CFD)",
    11: asset,
    12: mode === "BOT" ? "البوت الآلي" : "التداول اليدوي",
    13: tf,
    14: direction === "BUY" ? "Buy 🟢" : direction === "SELL" ? "Sell 🔴" : "—",
    15: levels.entry.toFixed(4),
    16: levels.tp1.toFixed(4),
    17: levels.tp2.toFixed(4),
    18: levels.tp3.toFixed(4),
    19: levels.tp4.toFixed(4),
    20: levels.sl.toFixed(4),
    21: "—",
    22: "Active (auto)",
    23: "—",
    24: "—",
    25: "—",
    26: "Auto (0.618-0.786)",
    27: "—",
    28: "10$ / standard lot",
    29: (riskAmount * 4).toFixed(2) + " $",
    30: riskAmount.toFixed(2) + " $",
    31: "—",
    32: "—",
    33: "—",
    34: (Math.abs(levels.tp4 - levels.entry) / Math.abs(levels.entry - levels.sl)).toFixed(2),
    35: "PDF يومي",
    36: "PDF أسبوعي",
    37: "PDF شهري + ضرائب الأرباح",
  };
  return (
    <TableShell number={8} title="جدول ٨ — خطة التداول والمخاطرة" subtitle="كل بند له زر تشغيل/إيقاف للرسم على الشارت — يتحدث لحظيًا مع نتائج التحليل والقرار النهائي">
      <table className="tbl">
        <thead>
          <tr><th>#</th><th>البند</th><th>القيمة</th><th>الشرح / كيف يُحسب</th><th>🎨 على الشارت</th></tr>
        </thead>
        <tbody>
          {TRADE_PLAN.map(p => (
            <tr key={p.id}>
              <td className="text-zinc-400">{p.id}</td>
              <td className="font-semibold">{p.nameAr}</td>
              <td className="text-gold-400 font-mono">{valueOf[p.id]}</td>
              <td className="text-zinc-400 text-xs max-w-md">{p.formulaAr || "—"}</td>
              <td className="text-center"><PlanToggle defaultChecked={!!p.defaultOnChart}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function PlanToggle({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only" defaultChecked={defaultChecked}/>
      <span className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-gold-500 relative transition-all
        before:content-[''] before:absolute before:top-0.5 before:end-0.5 before:w-4 before:h-4
        before:rounded-full before:bg-white before:transition-all peer-checked:before:end-[18px]"></span>
    </label>
  );
}
