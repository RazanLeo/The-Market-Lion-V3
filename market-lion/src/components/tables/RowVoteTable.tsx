"use client";
import { TIMEFRAMES } from "@/data/timeframes";
import { DecisionPill } from "./TableShell";
import type { RowReport } from "@/lib/analysisEngine";

export type EnrichedRow = RowReport & { category?: string; description?: string; tier?: "S"|"A"|"B"|"C" };

export function RowVoteTable({ rows, weightLabel }: { rows: EnrichedRow[]; weightLabel: string }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>الأداة / المدرسة / المؤشر</th>
          <th>التصنيف</th>
          <th>الشرح</th>
          {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
          <th>توافق الأطر</th>
          <th>الوزن من {weightLabel}</th>
          <th>درجة الثقة</th>
          <th>القرار</th>
          <th>تشغيل/إيقاف على الشارت</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td className="text-zinc-400">{r.id}</td>
            <td className="font-semibold text-zinc-100">{r.nameAr}</td>
            <td className="text-zinc-400">{r.category || "—"}</td>
            <td className="text-zinc-400 max-w-[28rem] truncate">{r.description || "—"}</td>
            {TIMEFRAMES.map(tf => (
              <td key={tf} className="text-center">
                {r.decision.perTf[tf] === 1 ? <span className="text-green-400">+1</span>
                  : r.decision.perTf[tf] === -1 ? <span className="text-red-400">-1</span>
                  : <span className="text-zinc-500">0</span>}
              </td>
            ))}
            <td className="text-center text-gold-400">{(r.decision.alignment*100).toFixed(0)}%</td>
            <td className="text-center text-zinc-300">{r.decision.weighted >= 0 ? "+" : ""}{r.decision.weighted.toFixed(3)}</td>
            <td className="text-center text-gold-400">{(r.decision.confidence*100).toFixed(0)}%</td>
            <td><DecisionPill d={r.decision.decision}/></td>
            <td className="text-center"><Toggle id={r.id}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Toggle({ id }: { id: number }) {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only" defaultChecked={false}/>
      <span className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-gold-500 relative transition-all
        before:content-[''] before:absolute before:top-0.5 before:end-0.5 before:w-4 before:h-4
        before:rounded-full before:bg-white before:transition-all peer-checked:before:end-[18px]"></span>
    </label>
  );
}
