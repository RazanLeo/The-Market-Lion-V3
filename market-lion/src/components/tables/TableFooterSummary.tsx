"use client";
import { TIMEFRAMES } from "@/data/timeframes";
import type { Timeframe } from "@/data/timeframes";

/** Per-table closing summary row — exactly as Excel Sheets 2-6 end with. */
export function TableFooterSummary({ tableNumber, weightPct, summary }:
  { tableNumber: number; weightPct: number; summary: { perTf: Record<Timeframe, number>; composite: number; confidence: number } }) {
  const dirText = summary.composite > 0 ? "↑ صاعد" : summary.composite < 0 ? "↓ هابط" : "↔ عرضي";
  return (
    <div className="mt-4 gold-card p-4">
      <h4 className="text-gold-400 font-bold mb-3">🎯 القرار النهائي للجدول — مساهمة الجدول {weightPct}٪ من القرار النهائي للمنصة</h4>
      <table className="tbl text-xs">
        <thead>
          <tr>
            <th>الإطار الزمني</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th className="text-center">1D / الاتجاه العام</th>
            <th className="text-center">درجة الثقة</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-semibold">صافي التصويت</td>
            {TIMEFRAMES.map(tf => {
              const v = summary.perTf[tf] ?? 0;
              const cls = v > 0 ? "text-green-400" : v < 0 ? "text-red-400" : "text-zinc-400";
              return <td key={tf} className={`text-center font-mono ${cls}`}>{v >= 0 ? "+" : ""}{v.toFixed(1)}</td>;
            })}
            <td className="text-center font-bold text-gold-400">{summary.composite >= 0 ? "+" : ""}{summary.composite.toFixed(2)}</td>
            <td className="text-center text-gold-400">{(summary.confidence*100).toFixed(0)}%</td>
          </tr>
          <tr>
            <td className="font-semibold">القرار</td>
            {TIMEFRAMES.map(tf => {
              const v = summary.perTf[tf] ?? 0;
              return <td key={tf} className="text-center">
                {v > 0 ? <span className="chip-buy">شراء</span> : v < 0 ? <span className="chip-sell">بيع</span> : <span className="chip-neutral">محايد</span>}
              </td>;
            })}
            <td className="text-center font-bold">{dirText}</td>
            <td className="text-center">—</td>
          </tr>
          <tr className="bg-gold-500/5">
            <td className="font-bold text-gold-400">مساهمة الجدول في القرار النهائي للمنصة</td>
            <td colSpan={7} className="text-center text-gold-400 font-bold">
              {((summary.composite/2) * weightPct).toFixed(2)}٪ من {weightPct}٪
            </td>
            <td className="text-center text-gold-400">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
