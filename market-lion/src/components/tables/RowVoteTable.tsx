"use client";
import { TIMEFRAMES, type Timeframe } from "@/data/timeframes";
import { DecisionPill, TierChip } from "./TableShell";
import { InfoButton } from "../InfoModal";
import type { RowReport } from "@/lib/analysisEngine";

export type EnrichedRow = RowReport & {
  category?: string;
  description?: string;
  tier?: "S"|"A"|"B"|"C";
  chartButtonText?: string;
};

// Compute the per-TF summary section (exactly following Excel rows 32-37 in sheets 3-6)
function computeSummary(rows: EnrichedRow[]) {
  const totalW = rows.reduce((a, r) => a + Math.abs(r.decision.weighted), 0);
  return TIMEFRAMES.map(tf => {
    let buyW = 0, sellW = 0;
    for (const r of rows) {
      if (r.decision.perTf[tf] === 1)  buyW  += Math.abs(r.decision.weighted);
      if (r.decision.perTf[tf] === -1) sellW += Math.abs(r.decision.weighted);
    }
    const net = buyW - sellW;
    const conf = totalW > 0 ? Math.abs(net) / totalW : 0;
    const dec: "BUY"|"SELL"|"NEUTRAL" = net > 0.015 ? "BUY" : net < -0.015 ? "SELL" : "NEUTRAL";
    return { tf, buyW, sellW, net, conf, dec };
  });
}

export function RowVoteTable({ rows, weightLabel, totalWeightPct }:
  { rows: EnrichedRow[]; weightLabel: string; totalWeightPct: number }) {
  const summary = computeSummary(rows);
  const COLS = 12; // number of <th> columns

  return (
    <div>
      <table className="tbl">
        <thead>
          <tr>
            <th>الرقم</th>
            <th>الأداة / المدرسة / المؤشر</th>
            <th>التصنيف</th>
            <th>شرح الأداة</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>توافق الأطر</th>
            <th>الوزن من {weightLabel}</th>
            <th>درجة الثقة</th>
            <th>نتيجة التحليل</th>
            <th className="text-center text-[11px]">شارت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const buyCount     = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === 1).length;
            const sellCount    = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === -1).length;
            const neutralCount = TIMEFRAMES.length - buyCount - sellCount;
            return (
              <tr key={r.id}>
                <td className="text-zinc-400 text-center">{r.id}</td>
                <td className="font-semibold text-zinc-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {r.tier && <TierChip tier={r.tier}/>}
                    <span className="text-sm">{r.nameAr}</span>
                  </div>
                </td>
                <td className="text-zinc-400 text-xs">{r.category || "—"}</td>
                <td className="text-center">
                  <InfoButton title={`شرح الأداة: ${r.nameAr}`}>
                    {r.description ||
                     `الأداة: ${r.nameAr}\nالتصنيف: ${r.category || "—"}\n\nالشرح الكامل لهذه الأداة واستراتيجيتها.`}
                  </InfoButton>
                </td>
                {TIMEFRAMES.map(tf => (
                  <td key={tf} className="text-center">
                    {r.decision.perTf[tf] === 1  ? <span className="text-green-400 font-bold text-xs">شراء</span>
                     : r.decision.perTf[tf] === -1 ? <span className="text-red-400 font-bold text-xs">بيع</span>
                     : <span className="text-zinc-500 text-xs">—</span>}
                  </td>
                ))}
                <td className="text-center text-xs whitespace-nowrap">
                  <span className="text-green-400">{buyCount}</span>
                  <span className="text-zinc-500 mx-0.5">·</span>
                  <span className="text-red-400">{sellCount}</span>
                  <span className="text-zinc-500 mx-0.5">·</span>
                  <span className="text-zinc-400">{neutralCount}</span>
                </td>
                <td className="text-center font-mono text-xs text-zinc-300">
                  {r.decision.weighted >= 0 ? "+" : ""}{r.decision.weighted.toFixed(3)}
                </td>
                <td className="text-center text-gold-400 text-xs">{(r.decision.confidence*100).toFixed(0)}%</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DecisionPill d={r.decision.decision}/>
                    <InfoButton title={`نتيجة التحليل — ${r.nameAr}`} dense>
                      {`${r.nameAr}\n\n` +
                       `الدرجة الموزونة: ${r.decision.weighted.toFixed(3)}\n` +
                       `الثقة: ${(r.decision.confidence*100).toFixed(1)}٪\n` +
                       `التوافق: ${(r.decision.alignment*100).toFixed(0)}٪\n` +
                       `شراء: ${buyCount} • بيع: ${sellCount} • محايد: ${neutralCount}\n\n` +
                       `((1M×5)+(5M×10)+(15M×20)+(30M×18)+(1H×22)+(4H×25))÷100`}
                    </InfoButton>
                  </div>
                </td>
                <td className="text-center">
                  <Toggle id={r.id} drawText={r.chartButtonText || `رسم ${r.nameAr} على الشارت`}/>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* ────────── ملخص الجدول — حرفي من الإكسيل (صفوف 32-37) ────────── */}
        <tfoot>
          <tr className="bg-zinc-900/60 border-t-2 border-gold-500/40">
            <td colSpan={4} className="font-bold text-gold-400 text-xs text-center py-2">
              🎯 القرار النهائي للجدول — الوزن {totalWeightPct}٪
            </td>
            {TIMEFRAMES.map(tf => (
              <td key={tf} className="text-center py-2 text-xs font-bold text-zinc-300">{tf}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان الشراء</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-green-400 font-mono">{s.buyW.toFixed(3)}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان البيع</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-red-400 font-mono">{s.sellW.toFixed(3)}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">صافي الدرجة</td>
            {summary.map(s => (
              <td key={s.tf} className={`text-center font-mono font-bold ${s.net > 0 ? "text-green-400" : s.net < 0 ? "text-red-400" : "text-zinc-400"}`}>
                {s.net >= 0 ? "+" : ""}{s.net.toFixed(3)}
              </td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-gold-500/8 text-xs border-t border-gold-500/20">
            <td colSpan={4} className="text-gold-400 py-2 pe-2 text-end font-bold">القرار النهائي</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center py-2">
                {s.dec === "BUY"  ? <span className="chip-buy text-[10px]">شراء 🟢</span>
                 : s.dec === "SELL" ? <span className="chip-sell text-[10px]">بيع 🔴</span>
                 : <span className="chip-neutral text-[10px]">محايد ⚪</span>}
              </td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs border-b border-gold-500/20">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">درجة الثقة (%)</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-gold-400 font-mono">{(s.conf*100).toFixed(1)}%</td>
            ))}
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function Toggle({ id, drawText }: { id: number; drawText: string }) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none gap-1" title={drawText}>
      <input type="checkbox" className="peer sr-only" defaultChecked={false}/>
      <span className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-gold-500 relative transition-all
        before:content-[''] before:absolute before:top-0.5 before:end-0.5 before:w-4 before:h-4
        before:rounded-full before:bg-white before:transition-all peer-checked:before:end-[18px]"></span>
    </label>
  );
}
