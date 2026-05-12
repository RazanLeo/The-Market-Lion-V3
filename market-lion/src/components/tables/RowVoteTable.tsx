"use client";
import { TIMEFRAMES } from "@/data/timeframes";
import { DecisionPill, TierChip } from "./TableShell";
import { InfoButton } from "../InfoModal";
import type { RowReport } from "@/lib/analysisEngine";

export type EnrichedRow = RowReport & {
  category?: string;
  description?: string;      // tool/strategy explanation (POPUP ONLY)
  tier?: "S"|"A"|"B"|"C";
  chartButtonText?: string;
};

export function RowVoteTable({ rows, weightLabel, totalWeightPct }:
  { rows: EnrichedRow[]; weightLabel: string; totalWeightPct: number }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>الرقم</th>
          <th>الأداة / المدرسة / المؤشر</th>
          <th>التصنيف</th>
          <th>شرح الأداة واستراتيجيتها</th>
          {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
          <th>نتيجة التحليل الشامل</th>
          <th>توافق الأطر الزمنية</th>
          <th>الوزن من {weightLabel}</th>
          <th>درجة الثقة</th>
          <th>نتيجة التحليل</th>
          <th>زر تشغيل/إيقاف على الشارت<br/><span className="text-[10px] text-zinc-500">(الافتراضي: مغلق)</span></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const buyCount = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === 1).length;
          const sellCount = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === -1).length;
          const neutralCount = TIMEFRAMES.length - buyCount - sellCount;
          return (
            <tr key={r.id}>
              <td className="text-zinc-400">{r.id}</td>
              <td className="font-semibold text-zinc-100">
                <div className="flex items-center gap-1">
                  {r.tier && <TierChip tier={r.tier}/>}
                  <span>{r.nameAr}</span>
                </div>
              </td>
              <td className="text-zinc-400 text-xs whitespace-nowrap">{r.category || "—"}</td>
              {/* ICON-ONLY: NO text in the cell */}
              <td className="text-center">
                <InfoButton title={`شرح الأداة: ${r.nameAr}`}>
                  {r.description ||
                   `الأداة: ${r.nameAr}\nالتصنيف: ${r.category || "—"}\n\nالشرح الكامل لهذه الأداة واستراتيجيتها سيظهر هنا. (سيتم إثراء المحتوى تدريجياً من قاعدة المعرفة.)`}
                </InfoButton>
              </td>
              {TIMEFRAMES.map(tf => (
                <td key={tf} className="text-center">
                  {r.decision.perTf[tf] === 1 ? <span className="text-green-400 font-bold">شراء</span>
                    : r.decision.perTf[tf] === -1 ? <span className="text-red-400 font-bold">بيع</span>
                    : <span className="text-zinc-500">محايد</span>}
                </td>
              ))}
              <td className="text-center text-xs whitespace-nowrap">
                <span className="text-green-400">{buyCount} شراء</span> ·{" "}
                <span className="text-red-400">{sellCount} بيع</span> ·{" "}
                <span className="text-zinc-400">{neutralCount} محايد</span>
              </td>
              <td className="text-center text-gold-400">{(r.decision.alignment*100).toFixed(0)}%</td>
              <td className="text-center text-zinc-300 font-mono">
                {r.decision.weighted >= 0 ? "+" : ""}{r.decision.weighted.toFixed(3)}
              </td>
              <td className="text-center text-gold-400">{(r.decision.confidence*100).toFixed(0)}%</td>
              {/* Result + icon for analysis details */}
              <td className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <DecisionPill d={r.decision.decision}/>
                  <InfoButton title={`نتيجة التحليل اللحظي — ${r.nameAr}`} dense>
                    {`الأداة: ${r.nameAr}\n` +
                     `التصنيف: ${r.category || "—"}\n\n` +
                     `الدرجة الموزونة (مرجّحة عبر الأطر): ${r.decision.weighted.toFixed(3)}\n` +
                     `درجة الثقة: ${(r.decision.confidence*100).toFixed(1)}٪\n` +
                     `توافق الأطر: ${(r.decision.alignment*100).toFixed(0)}٪\n` +
                     `العدّ: ${buyCount} شراء / ${sellCount} بيع / ${neutralCount} محايد\n\n` +
                     `معادلة الترجيح الزمني (حرفية من جدول الإكسل):\n` +
                     `((1M × 5) + (5M × 10) + (15M × 20) + (30M × 18) + (1H × 22) + (4H × 25)) ÷ 100\n\n` +
                     `القرار النهائي للأداة: ${r.decision.decision === "BUY" ? "شراء 🟢" : r.decision.decision === "SELL" ? "بيع 🔴" : "محايد ⚪"}`}
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
    </table>
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
