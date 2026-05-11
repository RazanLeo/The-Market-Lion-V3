"use client";
import { WHALE_TRACKERS, ORDER_FLOW_TOOLS } from "@/data/orderFlow";
import { TIMEFRAMES } from "@/data/timeframes";
import { TableShell, DecisionPill, TierChip } from "./TableShell";
import type { RowReport } from "@/lib/analysisEngine";

export function Table6OrderFlow({ rows }: { rows: RowReport[] }) {
  return (
    <TableShell number={6} title="جدول ٦ — تدفق الأوامر، البوك ماب، السيولة، حجم التداول" weight="15%"
      subtitle="٣ أقسام: رصد سيولة وصفقات صناع السوق والحيتان والمؤسسات • حركة الأموال اللحظي بأسماء المؤسسات الحقيقية • أدوات التحليل">

      <h4 className="text-gold-400 font-bold mb-2 mt-2">٦-أ • Whale Tracker (15 فئة مؤسسية)</h4>
      <table className="tbl">
        <thead><tr>
          <th>#</th><th>الفئة</th><th>أمثلة المؤسسات</th>
          <th className="text-center">صفقات 10K+</th><th className="text-center">100K+</th><th className="text-center">500K+</th><th className="text-center">1M+</th>
        </tr></thead>
        <tbody>
          {WHALE_TRACKERS.map(w => (
            <tr key={w.id}>
              <td className="text-zinc-400">{w.id}</td>
              <td className="font-semibold">{w.nameAr}</td>
              <td className="text-zinc-400">{w.examples.join(" · ")}</td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="text-gold-400 font-bold mb-2 mt-6">٦-ب • Real-Time Money Flow</h4>
      <table className="tbl">
        <thead><tr>
          <th>#</th><th>التوقيت</th><th>المؤسسة</th><th>النوع</th><th>الكمية ($)</th><th>الكمية (Lot/Oz/Bbl)</th>
        </tr></thead>
        <tbody>
          {[
            ["BlackRock","شراء","$50,000,000","1,540 oz"],
            ["Saudi PIF","شراء","$200,000,000","6,160 oz"],
            ["Saudi Aramco","بيع","$500,000,000","6,250,000 bbl"],
            ["Federal Reserve","شراء","$1,000,000,000","30,800 oz"],
            ["Goldman Sachs","شراء","$25,000,000","770 oz"],
            ["Bridgewater","بيع","$30,000,000","923 oz"],
            ["Vanguard","شراء","$80,000,000","2,463 oz"],
            ["Citadel","شراء","$45,000,000","1,386 oz"],
          ].map((row, i) => (
            <tr key={i}>
              <td className="text-zinc-400">{i+1}</td>
              <td className="text-zinc-400">live</td>
              <td className="font-semibold">{row[0]}</td>
              <td>{row[1]}</td>
              <td className="text-gold-400 font-mono">{row[2]}</td>
              <td className="text-zinc-300">{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="text-gold-400 font-bold mb-2 mt-6">٦-ج • Order Flow & Bookmap Analytics (10 أدوات)</h4>
      <table className="tbl">
        <thead><tr>
          <th>#</th><th>الأداة</th><th>Tier</th><th>الشرح</th>
          {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
          <th>الوزن من 15٪</th><th>الثقة</th><th>القرار</th><th>على الشارت</th>
        </tr></thead>
        <tbody>
          {ORDER_FLOW_TOOLS.map((tool, idx) => {
            const r = rows[idx];
            return (
              <tr key={tool.id}>
                <td className="text-zinc-400">{tool.id}</td>
                <td className="font-semibold">{tool.nameAr}</td>
                <td><TierChip tier={tool.tier}/></td>
                <td className="text-zinc-400 max-w-sm">{tool.descriptionAr}</td>
                {TIMEFRAMES.map(tf => (
                  <td key={tf} className="text-center">
                    {r?.decision.perTf[tf] === 1 ? <span className="text-green-400">+1</span> :
                     r?.decision.perTf[tf] === -1 ? <span className="text-red-400">-1</span> :
                     <span className="text-zinc-500">0</span>}
                  </td>
                ))}
                <td className="text-center text-zinc-300">{r ? r.decision.weighted.toFixed(3) : "—"}</td>
                <td className="text-center text-gold-400">{r ? (r.decision.confidence*100).toFixed(0) + "%" : "—"}</td>
                <td>{r && <DecisionPill d={r.decision.decision}/>}</td>
                <td className="text-center"><OFToggle/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableShell>
  );
}

function OFToggle() {
  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only"/>
      <span className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-gold-500 relative transition-all
        before:content-[''] before:absolute before:top-0.5 before:end-0.5 before:w-4 before:h-4
        before:rounded-full before:bg-white before:transition-all peer-checked:before:end-[18px]"></span>
    </label>
  );
}
