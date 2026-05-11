"use client";
import { ECON_INDICATORS, TRACKED_SPEAKERS, NEWS_SOURCES } from "@/data/fundamental";
import { TIMEFRAMES } from "@/data/timeframes";
import { TableShell, DecisionPill } from "./TableShell";

export function Table2Fundamental({ asset }: { asset: string }) {
  return (
    <TableShell number={2} title="جدول ٢ — التحليل الأساسي والتقويم الاقتصادي" weight="20%"
      subtitle="ثلاثة أقسام: المؤشرات الاقتصادية + الأخبار والتقارير + الخطابات والتصريحات والتغريدات">

      <h4 className="text-gold-400 font-bold mb-2 mt-2">٢-أ • المؤشرات الاقتصادية</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>الأصل/العملة</th><th>المؤشر</th><th>الأهمية</th><th>المصدر</th>
            <th>السابق</th><th>المتوقع</th><th>الفعلي</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>الدرجة الموزونة</th><th>النسبة من 20٪</th><th>النتيجة</th>
          </tr>
        </thead>
        <tbody>
          {ECON_INDICATORS.slice(0, 25).map((e,i) => (
            <tr key={e.id}>
              <td className="text-zinc-400">{e.id}</td>
              <td>{e.asset}</td>
              <td className="font-semibold">{e.nameAr}</td>
              <td><span className={`chip-tier-${e.importance==='HIGH'?'S':e.importance==='MEDIUM'?'A':'B'}`}>{e.importance}</span></td>
              <td className="text-zinc-400">{e.source}</td>
              <td className="text-zinc-400">—</td>
              <td className="text-zinc-400">—</td>
              <td className="text-zinc-400">—</td>
              {TIMEFRAMES.map(tf => <td key={tf} className="text-center text-zinc-500">0</td>)}
              <td className="text-center">0.000</td>
              <td className="text-center text-gold-400">0.00%</td>
              <td><DecisionPill d="NEUTRAL"/></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="text-gold-400 font-bold mb-2 mt-6">٢-ب • الأخبار والتقارير</h4>
      <table className="tbl">
        <thead><tr>
          <th>#</th><th>الأصل</th><th>الخبر/التقرير</th><th>التاريخ</th><th>المصدر</th><th>الأهمية</th>
          <th>التحليل</th><th>النتيجة</th>
        </tr></thead>
        <tbody>
          {NEWS_SOURCES.slice(0, 8).map((src, i) => (
            <tr key={i}>
              <td className="text-zinc-400">{i+1}</td>
              <td>{asset}</td>
              <td className="text-zinc-300">آخر تقرير من {src} — يجلب لحظيًا</td>
              <td className="text-zinc-400">يومي</td>
              <td className="text-zinc-400">{src}</td>
              <td><span className="chip-tier-A">MEDIUM</span></td>
              <td className="text-zinc-400">—</td>
              <td><DecisionPill d="NEUTRAL"/></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="text-gold-400 font-bold mb-2 mt-6">٢-ج • الخطابات والتصريحات والتغريدات</h4>
      <table className="tbl">
        <thead><tr>
          <th>#</th><th>المتحدث</th><th>الدور</th><th>القناة</th><th>التحليل</th><th>النتيجة</th>
        </tr></thead>
        <tbody>
          {TRACKED_SPEAKERS.map(s => (
            <tr key={s.id}>
              <td className="text-zinc-400">{s.id}</td>
              <td className="font-semibold">{s.speaker}</td>
              <td className="text-zinc-400">{s.role}</td>
              <td><span className="chip-tier-B">{s.channel}</span></td>
              <td className="text-zinc-400">يجلب لحظيًا</td>
              <td><DecisionPill d="NEUTRAL"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}
