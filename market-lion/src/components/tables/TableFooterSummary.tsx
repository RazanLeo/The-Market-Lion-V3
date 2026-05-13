"use client";
import { TIMEFRAMES } from "@/data/timeframes";
import type { Timeframe } from "@/data/timeframes";
import { useI18n } from "@/i18n/I18nProvider";

/** Per-table closing summary row — exactly as Excel Sheets 2-6 end with. */
export function TableFooterSummary({ tableNumber, weightPct, summary }:
  { tableNumber: number; weightPct: number; summary: { perTf: Record<Timeframe, number>; composite: number; confidence: number } }) {
  const { t } = useI18n();
  const dirText = summary.composite > 0 ? t("summary.up_trend") : summary.composite < 0 ? t("summary.down_trend") : t("summary.sideways");
  return (
    <div className="mt-4 gold-card p-4">
      <h4 className="text-gold-400 font-bold mb-3">{t("vote.footer.title")} — {t("summary.table_contribution")} {weightPct}%</h4>
      <table className="tbl text-xs">
        <thead>
          <tr>
            <th>{t("tables.t1.opt_tf")}</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th className="text-center">1D / {t("t7.col.overall_trend")}</th>
            <th className="text-center">{t("vote.col.confidence")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-semibold">{t("vote.footer.net")}</td>
            {TIMEFRAMES.map(tf => {
              const v = summary.perTf[tf] ?? 0;
              const cls = v > 0 ? "text-green-400" : v < 0 ? "text-red-400" : "text-zinc-400";
              return <td key={tf} className={`text-center font-mono ${cls}`}>{v >= 0 ? "+" : ""}{v.toFixed(1)}</td>;
            })}
            <td className="text-center font-bold text-gold-400">{summary.composite >= 0 ? "+" : ""}{summary.composite.toFixed(2)}</td>
            <td className="text-center text-gold-400">{(summary.confidence*100).toFixed(0)}%</td>
          </tr>
          <tr>
            <td className="font-semibold">{t("vote.footer.final_decision")}</td>
            {TIMEFRAMES.map(tf => {
              const v = summary.perTf[tf] ?? 0;
              return <td key={tf} className="text-center">
                {v > 0 ? <span className="chip-buy">{t("common.buy")}</span> : v < 0 ? <span className="chip-sell">{t("common.sell")}</span> : <span className="chip-neutral">{t("common.neutral")}</span>}
              </td>;
            })}
            <td className="text-center font-bold">{dirText}</td>
            <td className="text-center">—</td>
          </tr>
          <tr className="bg-gold-500/5">
            <td className="font-bold text-gold-400">{t("summary.table_contribution")}</td>
            <td colSpan={7} className="text-center text-gold-400 font-bold">
              {((summary.composite/2) * weightPct).toFixed(2)}% / {weightPct}%
            </td>
            <td className="text-center text-gold-400">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
